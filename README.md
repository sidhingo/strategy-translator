# Strategy Translator

Paste something messy, meeting notes, a Slack thread, a status update, and get back the actual
decision buried inside it: where what's said doesn't match what's actually happening, and the
real tradeoffs, not a summary.

**Live demo:** [strategy-translator.vercel.app](https://strategy-translator.vercel.app)

## Why this exists

A raw AI chat can summarize messy text well enough if you know to ask the right way. Most people
don't know to ask for a stated-vs-actual comparison, or to demand real tradeoffs instead of one
comfortable recommendation. This tool encodes that specific analytical lens and applies it every
time, consistently, for anyone, without them needing to know the framework exists.

## How it works

Two stages, both real Anthropic API calls:

1. **Reading**: pulls the essentials out of the raw text, the real decision or tension, stated
   goals, and what's actually described happening
2. **Comparing**: takes that extraction and builds the Reality Check (stated vs. actual) and two
   opposing scenario branches with explicit tradeoffs, no recommendation, the reader decides

No web search, this tool only reads what you give it. Production guardrails: per-IP rate
limiting, an invisible bot check, a daily spend circuit-breaker, all the same discipline as its
sibling project.

## Stack

React, Vite, Tailwind CSS on the frontend. Vercel serverless functions as the orchestrator.
Anthropic API (Claude) for extraction and analysis. Upstash Redis for rate limiting and usage
tracking. Cloudflare Turnstile for bot protection. Resend for automated reporting.

## Setup

See [`SETUP.md`](./SETUP.md) for the full technical walkthrough.



Built by [sidhingo](https://github.com/sidhingo).
