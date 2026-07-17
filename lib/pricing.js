export const RATES = {
    'claude-haiku-4-5-20251001': { input: 1.0, output: 5.0 },
    'claude-sonnet-5': { input: 2.0, output: 10.0 }, // intro pricing through Aug 31, 2026
  };
  
  export const DAILY_BUDGET_CAP_CENTS = 75; // lower than the 100-day tool, no web search cost here
  export const MONTHLY_BUDGET_CAP_CENTS = 2500; // shared Console cap across both tools
  
  export function estimateCostCents({ model, inputTokens, outputTokens }) {
    const rate = RATES[model];
    if (!rate) throw new Error(`Unknown model for pricing: ${model}`);
    return (inputTokens / 1_000_000) * rate.input * 100 + (outputTokens / 1_000_000) * rate.output * 100;
  }