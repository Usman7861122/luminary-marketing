import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Site = { slug: string; name: string; kind: string; place: string; url: string; tablet: string; phone: string };

export default function DeviceShowcase({ sites }: { sites: Site[] }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = sites.length;
  const site = sites[i];

  useEffect(() => {
    if (reduce || paused || n < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 5000);
    return () => clearInterval(t);
  }, [reduce, paused, n]);

  const step = (d: number) => setI((v) => (v + d + n) % n);
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="grid items-center gap-12 lg:grid-cols-[1.9fr_1fr]">
      {/* Devices */}
      <div className="relative pb-[18%] sm:pb-[12%] lg:pb-[10%]">
        {/* Tablet */}
        <div className="relative w-[92%] transition-transform duration-700 ease-out hover:-translate-y-1.5 rounded-[26px] border border-ivory/20 bg-onyx p-[10px] shadow-[0_40px_90px_-30px_rgba(0,0,0,.9)] sm:p-3">
          <span aria-hidden className="absolute left-1/2 top-[3px] h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-ivory/25" />
          <div className="relative aspect-[1.9/1] overflow-hidden rounded-[16px] bg-obsidian">
            {sites.map((s, k) => (
              <motion.img key={s.slug} src={s.tablet} alt={k === i ? `${s.name} website on a tablet` : ''} aria-hidden={k !== i}
                width={1600} height={780} loading="lazy" draggable={false}
                className="absolute inset-0 !h-full w-full object-cover object-center"
                initial={false} animate={{ opacity: k === i ? 1 : 0, scale: k === i ? 1 : 1.04 }}
                transition={{ duration: reduce ? 0 : 0.8, ease }} />
            ))}
          </div>
        </div>

        {/* Phone */}
        <div className="absolute bottom-0 right-0 transition-transform duration-700 ease-out hover:-translate-y-3 w-[26%] min-w-[104px] rounded-[30px] border border-ivory/25 bg-onyx p-[6px] shadow-[0_40px_80px_-20px_rgba(0,0,0,.95)] sm:p-2">
          <span aria-hidden className="absolute left-1/2 top-[11px] z-10 h-[7px] w-[34%] -translate-x-1/2 rounded-full bg-obsidian" />
          <div className="relative aspect-[9/19] overflow-hidden rounded-[24px] bg-obsidian">
            {sites.map((s, k) => (
              <motion.img key={s.slug} src={s.phone} alt={k === i ? `${s.name} website on a phone` : ''} aria-hidden={k !== i}
                width={700} height={1400} loading="lazy" draggable={false}
                className="absolute inset-0 !h-full w-full object-cover object-top"
                initial={false} animate={{ opacity: k === i ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : 0.8, ease }} />
            ))}
          </div>
        </div>
      </div>

      {/* Info + controls */}
      <div>
        <div aria-live="polite">
          <p className="eyebrow">{site.place}</p>
          <h3 className="h-display mt-4 text-3xl md:text-4xl">{site.name}</h3>
          <p className="lead mt-4">{site.kind}</p>
        </div>
        <div className="mt-8 flex items-center gap-4">
          <button onClick={() => step(-1)} aria-label="Previous website" className="grid h-11 w-11 place-items-center rounded-[6px] border border-ivory/20 text-ivory/80 transition-colors hover:border-champagne hover:text-champagne">←</button>
          <button onClick={() => step(1)} aria-label="Next website" className="grid h-11 w-11 place-items-center rounded-[6px] border border-ivory/20 text-ivory/80 transition-colors hover:border-champagne hover:text-champagne">→</button>
          <div className="ml-2 flex gap-2" role="tablist" aria-label="Websites">
            {sites.map((s, k) => (
              <button key={s.slug} role="tab" aria-selected={k === i} aria-label={s.name} onClick={() => setI(k)}
                className={`h-[3px] rounded-full transition-all ${k === i ? 'w-10 bg-champagne' : 'w-5 bg-ivory/25 hover:bg-ivory/50'}`} />
            ))}
          </div>
        </div>
        <a href={site.url} target="_blank" rel="noopener noreferrer" className="btn-lux btn-lux--sm mt-10">Visit live site</a>
      </div>
    </div>
  );
}
