import { Ratelimit } from '@upstash/ratelimit';
import { redis, dayKey, keys } from '../lib/redis.js';
import { estimateCostCents, DAILY_BUDGET_CAP_CENTS } from '../lib/pricing.js';

export const config = { runtime: 'edge' };

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 d'),
  prefix: 'ratelimit:strategy-translator:ip',
});

function sse(obj) {
  return new TextEncoder().encode(JSON.stringify(obj) + '\n');
}

async function verifyTurnstile(token, ip) {
  if (!process.env.TURNSTILE_SECRET_KEY) return true;
  if (!token) return false;
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
  });
  const data = await res.json();
  return data.success === true;
}

async function callAnthropic({ model, system, messages, maxTokens }) {
  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify({ model, max_tokens: maxTokens, system, messages }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${errText.slice(0, 300)}`);
  }
  return res.json();
}

function extractText(response) {
  return (response.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n');
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), { status: 405 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const today = dayKey();

  const stream = new ReadableStream({
    async start(controller) {
      const fail = (message) => {
        controller.enqueue(sse({ stage: 'error', message }));
        controller.close();
      };

      try {
        const { text, turnstileToken } = await req.json();

        if (!text || typeof text !== 'string' || text.trim().length < 20) {
          return fail('That looks too short to analyze, add a bit more detail.');
        }
        if (text.length > 6000) {
          return fail('That\'s a lot of text, trim it down to the most relevant part and try again.');
        }

        const human = await verifyTurnstile(turnstileToken, ip);
        if (!human) return fail('Verification failed, refresh the page and try again.');

        const { success } = await ratelimit.limit(ip);
        if (!success) return fail('You\'ve hit today\'s limit for this tool. Check back tomorrow.');

        const spentToday = Number((await redis.get(keys.dailyBudget(today))) || 0);
        if (spentToday >= DAILY_BUDGET_CAP_CENTS) {
          return fail('High demand right now, check back later today.');
        }

        // --- Stage 1: Reading (Haiku, fast extraction pass) ---
        controller.enqueue(sse({ stage: 'reading', status: 'start' }));

        const extractResponse = await callAnthropic({
          model: 'claude-haiku-4-5-20251001',
          maxTokens: 700,
          system:
            'Extract the essentials from this messy business text: what decision or tension is actually being discussed, what goals or priorities are explicitly stated, and what specific activities, numbers, or facts are described as actually happening. Be dense and factual, no commentary, no formatting beyond plain sentences.',
          messages: [{ role: 'user', content: text }],
        });

        const extracted = extractText(extractResponse);
        if (!extracted || extracted.length < 30) {
          return fail('Could not find enough signal in that text to analyze.');
        }

        // --- Stage 2: Comparing & branching (Sonnet, structured JSON) ---
        controller.enqueue(sse({ stage: 'comparing', status: 'start' }));

        const analysisResponse = await callAnthropic({
          model: 'claude-sonnet-5',
          maxTokens: 1400,
          system: `You are a sharp strategy analyst. Given an extraction from messy business text, respond with ONLY valid JSON, no preamble, no markdown fences, matching exactly this shape:
{
  "decisionTitle": "A short, specific label for the real decision being forced, not a generic restatement of the topic",
  "summary": "2-3 sentences framing the actual tension and what's really at stake",
  "sayDoGap": [
    {"stated": "A specific stated goal or claim", "actual": "What the text actually describes happening instead"}
  ],
  "scenarios": [
    {"name": "Path A: a short label", "costs": "what this path gives up", "buys": "what this path gets you"},
    {"name": "Path B: a short label", "costs": "...", "buys": "..."}
  ]
}
sayDoGap must have exactly 2 pairs, grounded in specific details from the text, not generic observations. scenarios must have exactly 2 paths, framed as real, opposing tradeoffs, not one obviously-correct option and one strawman. No recommendation field, do not tell the reader which path to pick.`,
          messages: [{ role: 'user', content: extracted }],
        });

        const analysisText = extractText(analysisResponse);
        let result;
        try {
          let raw = analysisText.trim().replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
          try {
            result = JSON.parse(raw);
          } catch {
            const match = raw.match(/\{[\s\S]*\}/);
            if (!match) throw new Error('no JSON object found');
            result = JSON.parse(match[0]);
          }
        } catch {
          return fail('The analysis came back malformed, try again.');
        }

        const extractCost = estimateCostCents({
          model: 'claude-haiku-4-5-20251001',
          inputTokens: extractResponse.usage?.input_tokens || 0,
          outputTokens: extractResponse.usage?.output_tokens || 0,
        });
        const analysisCost = estimateCostCents({
          model: 'claude-sonnet-5',
          inputTokens: analysisResponse.usage?.input_tokens || 0,
          outputTokens: analysisResponse.usage?.output_tokens || 0,
        });
        const totalCostCents = extractCost + analysisCost;

        await Promise.all([
          redis.incrbyfloat(keys.dailyBudget(today), totalCostCents),
          redis.incrbyfloat(keys.statsCostCents(today), totalCostCents),
          redis.incr(keys.statsHits(today)),
          redis.sadd(keys.statsIps(today), ip),
        ]);

        controller.enqueue(sse({ stage: 'complete', result }));
        controller.close();
      } catch (err) {
        controller.enqueue(sse({ stage: 'error', message: 'Something went wrong analyzing this. Try again.' }));
        controller.close();
        console.error('generate.js error:', err);
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-cache' },
  });
}