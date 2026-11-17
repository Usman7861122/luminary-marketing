import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Props = { nav: { label: string; href: string }[] };

export default function MobileMenu({ nav }: Props) {
  const [open, setOpen] = useState(false);

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
            className="fixed inset-0 z-[55] flex flex-col justify-center gap-6 bg-obsidian/97 px-8 backdrop-blur-xl"
          >
            {nav.map((n, i) => (
              <motion.a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i + 0.1, duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
                className="font-display text-4xl font-light tracking-tight text-ivory hover:text-champagne"
              >
                {n.label}
              </motion.a>
            ))}
            <a href="/#contact" onClick={() => setOpen(false)} className="btn-lux mt-6 self-start">Book a call</a>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
