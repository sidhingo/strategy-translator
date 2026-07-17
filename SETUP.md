# Setup & Operations Guide

Technical setup steps for running and deploying Strategy Translator. See `README.md` for the
project overview.

## What it costs

Cheaper than the 100-Day Plan Generator, no web search step involved. Roughly $0.02/run at
current pricing. Daily circuit-breaker at $0.75, shared monthly Anthropic Console cap of $25
across both projects.

## One-time setup

This project reuses the Anthropic, Upstash, and Resend accounts from the 100-Day Plan Generator,
only Cloudflare Turnstile needs a dedicated new widget.

### 1. Anthropic API key
Reuse the same dedicated key as the 100-day-plan project. Confirm the Console spend cap still
covers expected combined usage across both tools.

### 2. Upstash Redis
Reuse the same database. This project's keys are prefixed with `strategy-translator:` so its
stats never blend with the other tool's, even sharing one database.

### 3. Cloudflare Turnstile
Create a **new, separate widget** for this project (Cloudflare dashboard, Application Security,
Turnstile, Add widget, Invisible mode). Add both `localhost` and your production domain as
hostnames.

### 4. Resend
Reuse the same account and API key.

### 5. Cron secret
Generate one with `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"`,
set it as `CRON_SECRET` locally and in Vercel.

## Deploy

```bash
npm install
```

Push to GitHub, then in Vercel: New Project, import the repo, add every variable from
`.env.example` under Settings, Environment Variables, deploy.

The weekly cron fires Monday 01:00 UTC, staggered an hour after the 100-day tool's cron so the
two reports don't land in the same minute.

## Local development

```bash
cp .env.example .env
# fill in the values
npm i -g vercel
vercel dev
```

## Files that matter most

- `api/generate.js`: the pipeline, rate limit, budget check, extraction (Haiku), analysis
  (Sonnet, JSON), cost tracking
- `lib/pricing.js`: cost model and circuit-breaker thresholds
- `api/cron/weekly-report.js`: the Sunday email