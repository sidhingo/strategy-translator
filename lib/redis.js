import { Redis } from '@upstash/redis';

export const redis = Redis.fromEnv();

export const dayKey = (date = new Date()) => date.toISOString().slice(0, 10);

// Prefixed with strategy-translator so this tool's stats never blend with
// the 100-day-plan tool's, even though both share the same Redis database.
export const keys = {
  dailyBudget: (day) => `strategy-translator:budget:day:${day}`,
  statsHits: (day) => `strategy-translator:stats:hits:${day}`,
  statsCostCents: (day) => `strategy-translator:stats:cost_cents:${day}`,
  statsIps: (day) => `strategy-translator:stats:ips:${day}`,
};