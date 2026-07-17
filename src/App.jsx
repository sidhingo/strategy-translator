import { useState, useRef, useEffect } from 'react';
import StrategyInput, { EXAMPLES } from './components/StrategyInput.jsx';
import TranslationStages from './components/TranslationStages.jsx';
import TranslationOutput from './components/TranslationOutput.jsx';
import Footer from './components/Footer.jsx';
import { STATIC_RESULTS } from './lib/staticResults.js';

const STEPS = [
  { n: '01', label: 'Extract the real decision' },
  { n: '02', label: 'Compare stated vs. actual' },
  { n: '03', label: 'Branch the tradeoffs' },
];

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

export default function App() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle'); // idle | reading | comparing | done | error
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const turnstileWidgetId = useRef(null);
  const turnstileToken = useRef(null);

  const matchedExampleKey = Object.keys(EXAMPLES).find((key) => EXAMPLES[key] === input);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !window.turnstile) return;
    turnstileWidgetId.current = window.turnstile.render('#turnstile-container', {
      sitekey: TURNSTILE_SITE_KEY,
      size: 'invisible',
      callback: (token) => {
        turnstileToken.current = token;
      },
    });
  }, []);

  const handleGenerate = async () => {
    setErrorMsg('');

    // Free shortcut: an untouched example never touches the API.
    if (matchedExampleKey) {
      setResult(STATIC_RESULTS[matchedExampleKey]);
      setStatus('done');
      return;
    }

    setStatus('reading');

    if (window.turnstile && turnstileWidgetId.current !== null) {
      window.turnstile.execute(turnstileWidgetId.current);
      await new Promise((r) => setTimeout(r, 400));
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input.trim(), turnstileToken: turnstileToken.current }),
      });

      if (!res.ok || !res.body) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line);

          if (event.stage === 'reading' && event.status === 'start') setStatus('reading');
          if (event.stage === 'comparing' && event.status === 'start') setStatus('comparing');
          if (event.stage === 'complete') {
            setResult(event.result);
            setStatus('done');
          }
          if (event.stage === 'error') {
            setErrorMsg(event.message || 'Something went wrong. Try again.');
            setStatus('error');
          }
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Try again.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setInput('');
    setResult(null);
    setStatus('idle');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-white">
      <div id="turnstile-container" style={{ display: 'none' }} />

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        <div style={{ borderTop: '3px solid #0B2545' }} className="pt-4 mb-10 pb-6 border-b border-neutral-200">
          <h1 className="text-3xl font-semibold">Strategy Translator</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-10">
          <aside className="md:border-r md:border-neutral-200 md:pr-8">
            <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: '#0B2545' }}>
              How it reads this
            </p>
            <div className="space-y-4">
              {STEPS.map((s) => (
                <div key={s.n} className="flex gap-3 text-sm text-neutral-600 leading-relaxed">
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono text-white"
                    style={{ backgroundColor: '#0B2545' }}
                  >
                    {s.n.replace('0', '')}
                  </span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </aside>

          <main>
            {status === 'idle' || status === 'error' ? (
              <StrategyInput input={input} setInput={setInput} onGenerate={handleGenerate} errorMsg={errorMsg} />
            ) : null}

            {(status === 'reading' || status === 'comparing') && <TranslationStages status={status} />}

            {status === 'done' && result && (
              <TranslationOutput result={result} onReset={handleReset} />
            )}
          </main>
        </div>

        <div className="mt-10">
          <Footer />
        </div>
      </div>
    </div>
  );
}