const ACCENT = '#0B2545';

import { exportTranslationToPdf } from '../lib/pdfExport.js';

export default function TranslationOutput({ result, onReset }) {
  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs uppercase tracking-widest text-neutral-500">Decision</p>
        <div className="flex gap-2">
        <button
            onClick={() => exportTranslationToPdf(result)}
            className="border border-neutral-300 px-4 py-2 rounded text-sm font-medium hover:border-neutral-900 transition-colors"
          >
            Export PDF
          </button>
          <button
            onClick={onReset}
            className="text-neutral-500 px-4 py-2 rounded text-sm font-medium hover:text-neutral-900 transition-colors"
          >
            New plan
          </button>
        </div>
      </div>

      <h2 className="text-[22px] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
        {result.decisionTitle}
      </h2>
      <p
        className="text-sm text-neutral-600 leading-relaxed mb-8"
        style={{ borderLeft: `3px solid ${ACCENT}`, paddingLeft: '12px' }}
      >
        {result.summary}
      </p>

      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ACCENT }}>
        The Reality Check
      </p>
      <div className="border border-neutral-200 rounded overflow-hidden mb-8">
        <div className="hidden lg:grid grid-cols-2 bg-neutral-50 text-xs uppercase text-neutral-400 px-4 py-2">
          <span>Stated</span>
          <span>Actual</span>
        </div>
        {result.sayDoGap.map((pair, i) => (
          <div
            key={i}
            className="grid grid-cols-1 lg:grid-cols-2 px-4 py-3 text-sm border-t border-neutral-200 gap-2 lg:gap-4"
          >
            <span><span className="lg:hidden font-medium text-neutral-400 text-xs uppercase block mb-1">Stated</span>{pair.stated}</span>
            <span><span className="lg:hidden font-medium text-neutral-400 text-xs uppercase block mb-1">Actual</span>{pair.actual}</span>
          </div>
        ))}
      </div>

      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ACCENT }}>
        Scenario Branches
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {result.scenarios.map((s, i) => (
          <div key={i} className="border border-neutral-200 rounded p-4">
            <p className="text-sm font-semibold mb-2">{s.name}</p>
            <p className="text-sm text-neutral-600 mb-2">
              <span className="font-medium text-neutral-500">Costs: </span>
              {s.costs}
            </p>
            <p className="text-sm text-neutral-600">
              <span className="font-medium text-neutral-500">Buys: </span>
              {s.buys}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}