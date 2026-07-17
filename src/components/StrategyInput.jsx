import { useState } from 'react';

const ACCENT = '#0B2545';

export const EXAMPLES = {
  product: `Quick recap from today's sync. Team is heads down on the Q3 launch, though half of engineering time this week actually went to firefighting the billing bug from last release. Marketing wants launch pushed to align with the conference in September but sales is pushing hard for August since two enterprise deals are contingent on the new tier being live. Also heard finance is nervous about headcount, we said we'd freeze hiring but recruiting still has 3 open reqs posted. Need to figure out what we're actually telling the board Thursday.`,
  founder: `thinking through this more, I think we need to just commit to the enterprise motion, self-serve isn't converting the way we hoped even though that's literally the whole thesis of the seed deck, we keep saying self-serve first but honestly 80% of revenue this quarter came from three sales-assisted deals not the funnel, don't know if we tell the board we're pivoting or just quietly shift resources, also need to figure out if we hire an AE now or wait until after the raise closes`,
  gtm: `Debrief from pipeline review. We keep saying our GTM priority is expanding into mid-market, it's on every slide, but pulling up the actual pipeline, 90% of reps' time this month went to renewing and upselling existing enterprise accounts, not new mid-market logos. Nobody's mad about it since renewals are easy wins and hit the number, but mid-market pipeline is basically flat quarter over quarter. CRO wants to add 2 more mid-market AEs next quarter. VP Sales thinks that's premature until we prove the motion works with current reps first. Board meeting is in 10 days and someone's going to ask why mid-market hasn't moved.`,
};

export default function StrategyInput({ input, setInput, onGenerate, errorMsg }) {
  const [isExample, setIsExample] = useState(false);
  const isThin = input.trim().length > 0 && input.trim().length < 120;

  const loadExample = (text) => {
    setInput(text);
    setIsExample(true);
  };

  const handleFocus = () => {
    if (isExample) {
      setInput('');
      setIsExample(false);
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    if (isExample) setIsExample(false);
  };

  return (
    <div className="mb-4">
      <h2 className="text-[28px] leading-tight mb-3" style={{ fontFamily: 'Georgia, serif' }}>
        Paste the mess. Get the actual decision.
      </h2>
      <p className="text-base text-neutral-600 leading-relaxed mb-6">
        Meeting notes, a Slack thread, a status update, or a paragraph in your own words about
        a real decision you're facing. It finds where what's said doesn't match what's
        actually happening, and lays out the real tradeoffs.
      </p>

      <div className="flex flex-nowrap gap-2 mb-4 items-center">
      <span
          className="text-xs font-mono uppercase tracking-widest mr-1 flex-shrink-0"
          style={{ color: '#0B2545' }}
        >
          See it in action:
        </span>
        <button
          onClick={() => loadExample(EXAMPLES.product)}
          className="text-xs px-3 py-1.5 rounded border border-neutral-300 text-neutral-600 hover:border-[#0B2545] hover:text-[#0B2545] transition-colors whitespace-nowrap"
        >
          Product/Eng recap
        </button>
        <button
          onClick={() => loadExample(EXAMPLES.founder)}
          className="text-xs px-3 py-1.5 rounded border border-neutral-300 text-neutral-600 hover:border-[#0B2545] hover:text-[#0B2545] transition-colors whitespace-nowrap"
        >
          Founder brain-dump
        </button>
        <button
          onClick={() => loadExample(EXAMPLES.gtm)}
          className="text-xs px-3 py-1.5 rounded border border-neutral-300 text-neutral-600 hover:border-[#0B2545] hover:text-[#0B2545] transition-colors whitespace-nowrap"
        >
          GTM/Sales debrief
        </button>
      </div>

      <textarea
        value={input}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder="Input your text here..."
        rows={10}
        className="w-full border border-neutral-300 rounded px-4 py-3 text-base leading-relaxed focus:outline-none focus:border-[#0B2545] resize-none placeholder-neutral-400"
      />

      {isThin && (
        <p className="mt-2 text-sm text-amber-600">
          A bit more detail (what's actually happening, not just the goal) will sharpen the read.
        </p>
      )}

      <button
        onClick={onGenerate}
        disabled={!input.trim()}
        className="mt-4 text-white px-6 py-3 rounded font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        style={{ backgroundColor: ACCENT }}
      >
        Translate
      </button>

      {errorMsg && <p className="mt-4 text-sm text-red-600 font-mono">{errorMsg}</p>}

      <p className="mt-4 text-xs text-neutral-400 font-mono">
        Takes about 15-20 seconds. Nothing you paste is stored after the session ends.
      </p>
    </div>
  );
}