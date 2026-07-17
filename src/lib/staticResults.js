export const STATIC_RESULTS = {
    product: {
      decisionTitle: 'August vs. September launch, and what we tell the board',
      summary:
        'The team frames this as an on-track Q3 launch, but engineering time and sales pressure suggest the real question is a timing tradeoff between two enterprise deals and a September conference alignment, with a hiring freeze that isn\'t actually holding.',
      sayDoGap: [
        { stated: 'Team is focused on the Q3 launch', actual: 'Half of engineering time went to firefighting a billing bug' },
        { stated: 'Hiring is frozen', actual: 'Recruiting still has 3 open reqs posted' },
      ],
      scenarios: [
        { name: 'Path A: Launch August', costs: 'Rushed QA, marketing misses the conference tie-in', buys: 'Two enterprise deals close on schedule' },
        { name: 'Path B: Launch September', costs: 'Enterprise deals may slip or need concessions', buys: 'Conference-aligned launch, more QA runway' },
      ],
    },
    founder: {
      decisionTitle: 'Whether to formalize the enterprise pivot, and when to hire an AE',
      summary:
        'The seed-deck thesis says self-serve first, but 80% of this quarter\'s revenue came from three sales-assisted deals, not the funnel. The real decision isn\'t whether to acknowledge that, it\'s how loudly, and whether hiring waits for the raise to close.',
      sayDoGap: [
        { stated: 'Self-serve is the core thesis of the company', actual: '80% of this quarter\'s revenue came from three sales-assisted deals' },
        { stated: 'Growth is coming from the self-serve funnel', actual: 'The self-serve funnel isn\'t converting the way hoped' },
      ],
      scenarios: [
        { name: 'Path A: Commit to enterprise motion now', costs: 'Rewrites the seed-deck thesis, may unsettle investors expecting self-serve', buys: 'Aligns strategy with where revenue is actually coming from' },
        { name: 'Path B: Wait until after the raise closes', costs: 'Delays hiring an AE, keeps relying on ad hoc sales-assisted deals', buys: 'Avoids signaling a strategy pivot mid-raise' },
      ],
    },
    gtm: {
      decisionTitle: 'Whether to add mid-market AEs now or prove the motion first',
      summary:
        'Mid-market is on every slide as the growth priority, but 90% of rep time this month went to enterprise renewals, and mid-market pipeline is flat. The board will ask why it hasn\'t moved before this gets resolved.',
      sayDoGap: [
        { stated: 'GTM priority is expanding into mid-market', actual: '90% of reps\' time went to renewing and upselling existing enterprise accounts' },
        { stated: 'Mid-market is the growth focus', actual: 'Mid-market pipeline is flat quarter over quarter' },
      ],
      scenarios: [
        { name: 'Path A: Add 2 mid-market AEs next quarter', costs: 'Headcount spend before the current motion is proven', buys: 'Faster signal on whether more capacity actually moves the pipeline' },
        { name: 'Path B: Prove the motion with current reps first', costs: 'Slower mid-market progress heading into the board meeting', buys: 'Avoids over-hiring into an unproven motion' },
      ],
    },
  };