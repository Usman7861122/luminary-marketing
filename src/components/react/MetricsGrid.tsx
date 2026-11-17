import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';

type Metric = { value: number; decimals?: number; suffix?: string; label: string };

// Where each card starts before it flies into place (same offsets as Studio 3).
const FROM = ['-50% -50%', '0% -50%', '50% -50%', '-50% 50%', '0% 50%', '50% 50%'];

export default function MetricsGrid({ metrics, logo }: { metrics: Metric[]; logo: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  // 0 when the zone's top meets the viewport top, 1 when its bottom meets the viewport bottom.
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  // Keyframes copied from Studio 3 (metricsTitle, metricsLabel, metricsGrid).
  const titleScale = useTransform(p, [0, 0.25, 0.65, 1], [1, 1, 4, 4]);
  const titleOpacity = useTransform(p, [0, 0.25, 0.4, 0.65, 1], [1, 1, 1, 0, 0]);
  const labelOpacity = useTransform(p, [0, 0.63, 0.69, 1], [0, 0, 1, 1]);
  const gridScale = useTransform(p, [0, 0.25, 0.65, 1], [10, 10, 1, 1]);
  const gridOpacity = useTransform(p, [0, 0.25, 0.4, 0.65, 1], [0, 0, 0, 1, 1]);

  useMotionValueEvent(p, 'change', (v) => { if (v > 0.3 && !entered) setEntered(true); });
  useEffect(() => { if (reduce) setEntered(true); }, [reduce]);

  const cards = metrics.map((m, i) => {
    const [x, y] = FROM[i % FROM.length].split(' ');
    return (
      <li
        key={m.label}
        style={{
          translate: entered ? '0 0' : `${x} ${y}`,
          opacity: entered ? 1 : 0,
          transition: 'opacity 1s ease-in-out, translate 1s ease-in-out, border-color .5s, background-color .5s',
        }}
        className="flex flex-col items-center justify-center rounded-[12px] border border-ivory/25 bg-[#161616] p-4 hover:border-champagne/70 hover:bg-[#1b1a18] text-center md:p-8"
      >
        <p className="font-display text-4xl font-extralight tracking-[0.12em] text-ivory md:text-6xl lg:text-7xl">
          {m.value.toFixed(m.decimals ?? 0)}
          {m.suffix && <span className="text-champagne">{m.suffix}</span>}
        </p>
        <p className="mt-3 max-w-[15rem] text-[0.62rem] uppercase leading-relaxed tracking-[0.2em] text-ivory/60 md:mt-5 md:text-[0.72rem]">{m.label}</p>
      </li>
    );
  });

  const heading = (
    <div className="text-center">
      <p className="eyebrow">Luminary metrics</p>
      <h2 id="metrics-title" className="h-display mt-3 text-3xl md:mt-5 md:text-5xl">
        Results you can <span className="text-gold-shine font-medium">measure.</span>
      </h2>
    </div>
  );

  if (reduce) {
    return (
      <div className="container-lux py-24 md:py-32">
        <div className="mb-12">{heading}</div>
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">{cards}</ul>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative h-[250svh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        {/* Logo: shrinks away as you scroll */}
        <motion.div style={{ scale: titleScale, opacity: titleOpacity }} className="pointer-events-none absolute inset-0 z-0 grid place-items-center">
          <img src={logo} alt="Luminary Marketing" width={420} height={267} className="w-[min(60vw,22rem)]" />
        </motion.div>

        {/* Heading fades in once the grid has landed */}
        <motion.div style={{ opacity: labelOpacity }} className="relative z-[2] px-5 pt-[6.5rem] md:pt-[7.5rem]">
          {heading}
        </motion.div>

        {/* Grid zooms in from 10x */}
        <motion.div
          style={{ scale: gridScale, opacity: gridOpacity, transformOrigin: '50% 50%' }}
          className="container-lux relative z-[1] flex min-h-0 flex-1 flex-col pb-6 pt-4 md:pb-10 md:pt-6"
        >
          <ul className="mx-auto grid min-h-0 w-full max-w-[1200px] flex-1 auto-rows-fr grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3">{cards}</ul>
        </motion.div>
      </div>
    </div>
  );
}
