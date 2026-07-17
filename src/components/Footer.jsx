import { useState } from 'react';

const WEB3FORMS_ACCESS_KEY = 'e654107b-6293-409c-a1bb-b5a4dead8447';

export default function Footer() {
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    data.append('access_key', WEB3FORMS_ACCESS_KEY);
    data.append('subject', 'Strategy Translator: feedback');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });
      if (res.ok) {
        setSent(true);
        form.reset();
      }
    } catch {
      // fail silently, nothing sensitive at stake in a feedback form
    }
  };

  return (
    <footer className="pb-12">
      <div className="border-t border-neutral-200 pt-6">
        <p className="text-xs text-neutral-500 leading-relaxed">
          This tool analyzes only the text you paste, it doesn't search the web or pull in
          outside company data. Outputs are AI-generated and may be incomplete or inaccurate,
          treat this as a starting point for your own judgment, not a final answer.
        </p>
      </div>

      <div className="mt-10 border-t border-neutral-200 pt-6 text-sm text-neutral-500 flex items-center gap-2 overflow-hidden">
        <span className="flex-shrink-0 font-medium text-neutral-700">Also built:</span>
        
        <a href="https://hundred-day-plan.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-neutral-700 flex-shrink-0 font-medium"
        >
          100-Day Plan Generator
        </a>
        <span className="text-neutral-300 flex-shrink-0">→</span>
        <span className="truncate">live pipeline that researches any company, builds a plan</span>
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-8">
        <p className="text-[11px] text-neutral-500 mb-4">
          Have feedback, a question, or want to collaborate? Drop a note below.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="email"
              name="email"
              required
              placeholder="Your email"
              className="w-full md:w-1/3 bg-neutral-50 border border-neutral-200 px-3 py-3 text-[13px] text-neutral-900 focus:outline-none focus:border-[#0B2545] transition-colors placeholder-neutral-400"
            />
            <input
              type="text"
              name="message"
              required
              placeholder="Your message"
              className="w-full md:flex-1 bg-neutral-50 border border-neutral-200 px-3 py-3 text-[13px] text-neutral-900 focus:outline-none focus:border-[#0B2545] transition-colors placeholder-neutral-400"
            />
            <button
              type="submit"
              className="w-full md:w-auto bg-neutral-900 hover:bg-neutral-700 text-white font-bold uppercase tracking-[0.2em] text-[10px] px-6 py-3 transition-colors whitespace-nowrap"
            >
              Send
            </button>
          </div>
          {sent && (
            <p className="text-[11px] text-emerald-600 font-medium">
              Message received. I'll be in touch if relevant. Thank you.
            </p>
          )}
        </form>
      </div>

      <div className="mt-8 text-neutral-400 text-[9px] md:text-[10px] tracking-[0.3em] font-bold uppercase">
        <span>Strategy Translator // Built by sidhingo</span>
      </div>
    </footer>
  );
}