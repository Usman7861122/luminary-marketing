import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type Cta = { label: string; href: string };
type Props = { eyebrow: string; lead: string; words: string[]; text: string; primary: Cta; secondary: Cta };

const ease = [0.2, 0.7, 0.2, 1] as const;
// On the first visit the loader covers the page for about 1.4s, so the hero waits for it.
const wait = () => (typeof document !== 'undefined' && !document.documentElement.classList.contains('no-loader') ? 2.5 : 0);
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease, delay: delay + wait() },
});

export default function HeroHeadline({ eyebrow, lead, words, text, primary, secondary }: Props) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % words.length), 3400);
    return () => clearInterval(t);
  }, [reduce, words.length]);

  return (
    <div className="max-w-4xl">
      <motion.p {...rise(0.1)} className="eyebrow">{eyebrow}</motion.p>

      <h1 className="h-display mt-7 max-w-[10.5em] text-[clamp(2.5rem,5.2vw,4.7rem)]">
        <span className="sr-only">{lead} {words[0]}</span>
        <span aria-hidden="true" className="block">
          <motion.span {...rise(0.25)} className="block text-ivory">{lead}</motion.span>
          <span className="relative block h-[1.3em] overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={words[i]}
                className="text-gold-shine absolute left-0 top-0 block whitespace-nowrap pb-[0.12em] font-medium"
                initial={{ y: '90%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-90%', opacity: 0 }}
                transition={{ duration: 0.7, ease }}
              >
                {words[i]}
              </motion.span>
            </AnimatePresence>
          </span>
        </span>
      </h1>

      <motion.p {...rise(0.5)} className="lead mt-8 max-w-xl">{text}</motion.p>

      <motion.div {...rise(0.7)} className="mt-11 flex flex-wrap items-center gap-x-9 gap-y-6">
        <a href={primary.href} className="btn-lux">
          {primary.label}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </a>
        <a href={secondary.href} className="link-lux">{secondary.label}</a>
      </motion.div>
    </div>
  );
}
