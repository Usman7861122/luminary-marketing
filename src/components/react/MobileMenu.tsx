import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Item = { label: string; href: string };
type Props = { nav: Item[]; services?: Item[] };

export default function MobileMenu({ nav, services = [] }: Props) {
  const [open, setOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);
  useEffect(() => { if (!open) setSvcOpen(false); }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="relative z-[60] grid h-10 w-10 place-items-center rounded-[6px] border border-ivory/25"
      >
        <span className="relative block h-3 w-5">
          <span className={`absolute left-0 h-px w-5 bg-ivory transition-all ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
          <span className={`absolute left-0 h-px w-5 bg-ivory transition-all ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[55] flex flex-col gap-6 overflow-y-auto bg-obsidian/97 px-8 pb-12 pt-28 backdrop-blur-xl"
          >
            {nav.map((n, i) => (
              <motion.div
                key={n.href}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i + 0.1, duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <div className="flex items-center gap-4">
                  <a
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-4xl font-light tracking-tight text-ivory hover:text-champagne"
                  >
                    {n.label}
                  </a>
                  {n.href === '/services' && services.length > 0 && (
                    <button
                      type="button"
                      aria-label={svcOpen ? 'Hide service categories' : 'Show service categories'}
                      aria-expanded={svcOpen}
                      onClick={() => setSvcOpen(!svcOpen)}
                      className="grid h-9 w-9 place-items-center rounded-full border border-ivory/25 text-ivory"
                    >
                      <svg viewBox="0 0 12 12" className={`h-3 w-3 transition-transform ${svcOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M2 4.5l4 4 4-4" /></svg>
                    </button>
                  )}
                </div>
                {n.href === '/services' && svcOpen && (
                  <ul className="mt-4 space-y-3 border-l border-ivory/15 pl-5">
                    {services.map((s) => (
                      <li key={s.href}>
                        <a href={s.href} onClick={() => setOpen(false)} className="text-[1rem] text-ivory/70 hover:text-champagne">{s.label}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
            <a href="/#contact" onClick={() => setOpen(false)} className="btn-lux mt-6 self-start">Book a call</a>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
