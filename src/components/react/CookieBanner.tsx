import { useEffect, useRef, useState } from 'react';

const KEY = 'lm-consent';
const VERSION = 1;

type Choices = { preferences: boolean; analytics: boolean; marketing: boolean };
type Saved = Choices & { v: number; necessary: true; ts: number };

const groups: { id: keyof Choices; title: string; text: string }[] = [
  { id: 'preferences', title: 'Preferences', text: 'Remember choices such as your layout or form details.' },
  { id: 'analytics', title: 'Analytics', text: 'Help us see which pages are useful. Data is combined, not personal.' },
  { id: 'marketing', title: 'Marketing', text: 'Let us measure our ads and show relevant ones on other sites.' },
];

function read(): Saved | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Saved;
    return s.v === VERSION ? s : null;
  } catch {
    return null;
  }
}

function save(c: Choices) {
  const value: Saved = { v: VERSION, necessary: true, ts: Date.now(), ...c };
  try { localStorage.setItem(KEY, JSON.stringify(value)); } catch { /* storage blocked: choice lasts for this visit only */ }
  (window as unknown as { lmConsent?: Saved }).lmConsent = value;
  window.dispatchEvent(new CustomEvent('lm:consent', { detail: value }));
}

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [choices, setChoices] = useState<Choices>({ preferences: false, analytics: false, marketing: false });
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existing = read();
    let t = 0;
    if (existing) {
      setChoices({ preferences: existing.preferences, analytics: existing.analytics, marketing: existing.marketing });
      (window as unknown as { lmConsent?: Saved }).lmConsent = existing;
    } else {
      // On a first visit, wait until the page loader has lifted.
      const wait = () => {
        if (document.documentElement.classList.contains('is-loaded')) t = window.setTimeout(() => setOpen(true), 700);
        else t = window.setTimeout(wait, 300);
      };
      wait();
    }
    const reopen = () => { const s = read(); if (s) setChoices({ preferences: s.preferences, analytics: s.analytics, marketing: s.marketing }); setCustom(true); setOpen(true); };
    window.addEventListener('lm:open-cookies', reopen);
    return () => { window.removeEventListener('lm:open-cookies', reopen); clearTimeout(t); };
  }, []);

  useEffect(() => { if (open) box.current?.focus({ preventScroll: true }); }, [open, custom]);

  const done = (c: Choices) => { save(c); setChoices(c); setOpen(false); setCustom(false); };

  if (!open) return null;

  const btn = 'rounded-full px-3.5 py-2 text-[0.66rem] font-medium uppercase tracking-[0.12em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne';

  return (
    <div
      ref={box}
      tabIndex={-1}
      role="dialog"
      aria-label="Cookie settings"
      style={{ outline: 'none' }}
      onKeyDown={(e) => { if (e.key === 'Escape' && read()) { setOpen(false); setCustom(false); } }}
      className="cookie-card fixed bottom-4 left-4 right-4 z-[70] rounded-[14px] border border-ivory/15 bg-graphite/95 p-5 text-ivory shadow-[0_24px_60px_-20px_rgb(0_0_0/.7)] backdrop-blur-md outline-none sm:right-auto sm:w-[23rem]"
    >
      {!custom ? (
        <>
          <p className="text-[0.82rem] leading-6 text-ivory/75">
            We use cookies to run this site and, with your OK, to see how it is used. <a href="/cookies" className="text-champagne-soft underline underline-offset-4">Cookie policy</a>
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <button type="button" onClick={() => done({ preferences: true, analytics: true, marketing: true })} className={`${btn} bg-champagne text-obsidian hover:bg-champagne-soft`}>Accept all</button>
            <button type="button" onClick={() => done({ preferences: false, analytics: false, marketing: false })} className={`${btn} border border-ivory/25 text-ivory/85 hover:border-champagne hover:text-champagne-soft`}>Reject</button>
            <button type="button" onClick={() => setCustom(true)} className={`${btn} px-1.5 text-ivory/70 underline underline-offset-4 hover:text-champagne-soft`}>Customize</button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="font-display text-lg font-light">Cookie settings</p>
            <button type="button" aria-label="Close cookie settings" onClick={() => { if (read()) { setOpen(false); setCustom(false); } else setCustom(false); }} className="grid h-8 w-8 place-items-center rounded-full text-ivory/60 hover:text-champagne-soft">
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" /></svg>
            </button>
          </div>
          <ul className="mt-3 divide-y divide-ivory/10">
            <li className="flex items-start justify-between gap-4 py-3">
              <div><p className="text-[0.85rem] text-ivory">Necessary</p><p className="mt-0.5 text-[0.75rem] leading-5 text-ivory/55">Keep the site working. Always on.</p></div>
              <span className="mt-0.5 text-[0.65rem] uppercase tracking-[0.18em] text-champagne">On</span>
            </li>
            {groups.map((g) => (
              <li key={g.id} className="flex items-start justify-between gap-4 py-3">
                <div><p id={`ck-${g.id}`} className="text-[0.85rem] text-ivory">{g.title}</p><p className="mt-0.5 text-[0.75rem] leading-5 text-ivory/55">{g.text}</p></div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={choices[g.id]}
                  aria-labelledby={`ck-${g.id}`}
                  onClick={() => setChoices((c) => ({ ...c, [g.id]: !c[g.id] }))}
                  className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne ${choices[g.id] ? 'border-champagne bg-champagne' : 'border-ivory/25 bg-obsidian'}`}
                >
                  <span className={`absolute top-0.5 rounded-full transition-all ${choices[g.id] ? 'left-[1.4rem] bg-obsidian' : 'left-0.5 bg-ivory/70'}`} style={{ height: '1.1rem', width: '1.1rem' }} />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => done(choices)} className={`${btn} bg-champagne text-obsidian hover:bg-champagne-soft`}>Save choices</button>
            <button type="button" onClick={() => done({ preferences: true, analytics: true, marketing: true })} className={`${btn} border border-ivory/25 text-ivory/85 hover:border-champagne hover:text-champagne-soft`}>Accept all</button>
          </div>
        </>
      )}
    </div>
  );
}
