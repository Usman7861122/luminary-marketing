import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { MouseEvent, PointerEvent as ReactPointerEvent, ReactNode, SVGProps } from 'react';
import { LazyMotion, animate, domAnimation, m, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';

/**
 * The Luminary stack: five ceramic plates that open on hover to show how the marketing system works.
 * Interaction is a port of the Syntra hero stack: hover the core (or a card) and the plates spring apart,
 * cards fade in beside them, hairlines link each card to its plate and a bead runs along each line.
 */

const cn = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ');

// ───────────── geometry ─────────────
const ISO_X = 0.866;
const ISO_Y = 0.5;
const CX = 500;
const CY = 500;
const RING_FLATTEN = 0.57;
const RING_RX = [400, 530] as const;

type SlabType = { half: number; radius: number; top: number; depth: number };

const BASE: SlabType = { half: 168, radius: 40, top: 475, depth: 34 };
const SEAM_GAP = 9;
const MID: SlabType = { half: 151, radius: 36, top: BASE.top - SEAM_GAP - 28, depth: 28 };
const CAP: SlabType = { half: 101, radius: 28, top: MID.top - 14, depth: 14 };

type Point = [number, number];
const round = (n: number) => Math.round(n * 100) / 100;
const project = (x: number, y: number, cx = CX, cy = CY): Point => [cx + (x - y) * ISO_X, cy + (x + y) * ISO_Y];

const footprint = (half: number, radius: number, steps = 14): Point[] => {
  const r = Math.min(radius, half);
  const c = half - r;
  const corners: [number, number, number][] = [[c, c, 0], [-c, c, 90], [-c, -c, 180], [c, -c, 270]];
  const pts: Point[] = [];
  for (const [ox, oy, start] of corners) {
    for (let i = 0; i <= steps; i++) {
      const a = ((start + (90 * i) / steps) * Math.PI) / 180;
      pts.push([ox + r * Math.cos(a), oy + r * Math.sin(a)]);
    }
  }
  return pts;
};

const toPath = (pts: Point[]) => `M${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L')}Z`;

const topPath = (slab: SlabType, inset = 0, cx = CX, dy = 0) => {
  const half = slab.half - inset;
  const radius = Math.max(slab.radius - inset, 1);
  return toPath(footprint(half, radius).map(([x, y]) => project(x, y, cx, slab.top + dy)));
};

const hull = (points: Point[]): Point[] => {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Point, a: Point, b: Point) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const build = (list: Point[]) => {
    const out: Point[] = [];
    for (const p of list) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], p) <= 0) out.pop();
      out.push(p);
    }
    out.pop();
    return out;
  };
  return [...build(pts), ...build([...pts].reverse())];
};

const bodyPath = (slab: SlabType, inset = 0) => {
  const half = slab.half - inset;
  const radius = Math.max(slab.radius - inset, 1);
  const outline = footprint(half, radius);
  const upper = outline.map(([x, y]) => project(x, y, CX, slab.top));
  const lower = outline.map(([x, y]) => project(x, y, CX, slab.top + slab.depth));
  return toPath(hull([...upper, ...lower]));
};

const facePoint = (slab: SlabType, side: 'left' | 'right', u: number, v: number): Point => {
  const { half, top, depth } = slab;
  if (side === 'left') {
    const [x, y] = project(-half + 2 * half * u, half, CX, top);
    return [x, y + depth * v];
  }
  const [x, y] = project(half, half - 2 * half * u, CX, top);
  return [x, y + depth * v];
};

const FACE_MATRIX = { left: `${ISO_X} ${ISO_Y} 0 1`, right: `${ISO_X} ${-ISO_Y} 0 1`, top: `${ISO_X} ${ISO_Y} ${-ISO_X} ${ISO_Y}` };

const ringPoint = (rx: number, angleDeg: number): Point => {
  const a = (angleDeg * Math.PI) / 180;
  return [round(CX + rx * Math.cos(a)), round(CY + rx * RING_FLATTEN * Math.sin(a))];
};
const ringPath = (rx: number) => {
  const ry = rx * RING_FLATTEN;
  return `M${CX + rx} ${CY}A${rx} ${ry} 0 1 1 ${CX - rx} ${CY}A${rx} ${ry} 0 1 1 ${CX + rx} ${CY}Z`;
};

// ───────────── palette (dark ceramic, champagne light) ─────────────
const GOLD = '#D9B97A';
const GOLD_GLOW = '#E8C98A';

// ───────────── content ─────────────
const EASE = [0.22, 1, 0.36, 1] as const;

const STAGES = [
  { title: 'Strategy and brand', items: ['Positioning', 'Voice', 'Offers'], apps: ['pen', 'gem', 'target'], icon: 'compass', side: 'right' },
  { title: 'Content and reels', items: ['Shoots', 'Reels', 'Captions'], apps: ['instagram', 'tiktok', 'youtube'], icon: 'video', side: 'left' },
  { title: 'Growth engine', items: ['Ads', 'Local SEO', 'Email'], apps: ['facebook', 'search', 'mail'], side: 'right', main: true },
  { title: 'Website and booking', items: ['Pages', 'Forms', 'Follow-up'], apps: ['globe', 'calendar', 'mail'], icon: 'globe', side: 'left' },
  { title: 'Booked consultations', items: ['Inquiries', 'Consults', 'Procedures'], apps: ['phone', 'calendar', 'star'], icon: 'star', side: 'right' }
] as const;

type Stage = (typeof STAGES)[number];
const isMain = (s: Stage) => 'main' in s && s.main;

const MOTION = {
  floatDistance: 10,
  floatSeconds: 6.5,
  tiltDegrees: 3.5,
  ringParallax: 12,
  backdropParallax: 5,
  orbitSeconds: [70, 95],
  orbitOpenOpacity: 0.15
};

const ARTBOARD = 1000;

const EXPLODE = {
  spring: { stiffness: 105, damping: 25, mass: 1 },
  gap: 94,
  aiLift: 12,
  topPlateY: 230,
  stagger: 0.05,
  scales: [0.63, 0.62, 0.7, 1.07, 1.06]
};

const STAGE_CARDS = {
  left: { edge: -2, width: 31 },
  right: { edge: 0, width: 29 },
  restInset: 10,
  outward: 2,
  beadSeconds: 1.6
};

// ───────────── plates ─────────────
const PLATE_SLABS: SlabType[] = [
  { ...BASE, top: BASE.top + 17, depth: 17 },
  { ...BASE, top: BASE.top, depth: 17 },
  MID,
  { ...CAP, top: CAP.top + 7, depth: 7 },
  { ...CAP, top: CAP.top, depth: 7 }
];
const AI_PLATE = 2;
const TARGET_TOPS = PLATE_SLABS.map((_, i) => EXPLODE.topPlateY + (PLATE_SLABS.length - 1 - i) * EXPLODE.gap - (i === AI_PLATE ? EXPLODE.aiLift : 0));
const TRAVEL = PLATE_SLABS.map((slab, i) => TARGET_TOPS[i] - slab.top);
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const plateProgress = (i: number, p: number) => {
  const delay = Math.abs(i - AI_PLATE) * EXPLODE.stagger;
  return clamp((p - delay) / (1 - delay));
};
const plateY = (i: number, p: number) => TRAVEL[i] * plateProgress(i, p);
const plateScale = (i: number, p: number) => 1 + (EXPLODE.scales[i] - 1) * plateProgress(i, p);
const tipOffset = (i: number) => {
  const { half, radius } = PLATE_SLABS[i];
  return 0.866 * (2 * half - 0.586 * radius) * EXPLODE.scales[i];
};
const tipX = (i: number, side: 'left' | 'right') => CX + (side === 'right' ? 1 : -1) * tipOffset(i);
const cornerY = (i: number) => TARGET_TOPS[i] + PLATE_SLABS[i].depth / 2;

// ───────────── the mark: a four-point luminary star ─────────────
const STAR = 'M0 -27C3 -10 10 -3 27 0C10 3 3 10 0 27C-3 10 -10 3 -27 0C-10 -3 -3 -10 0 -27Z';
const Star = ({ fill, stroke }: { fill: string; stroke?: string }) => <path d={STAR} fill={fill} stroke={stroke} strokeWidth={stroke ? 0.7 : undefined} />;

const LOGO_SIDE = ['#5c4219', '#6e4f1d', '#7d5b22', '#8f6b2c', '#a17a35', '#b58a3e'];
const LOGO_SCALE = 1.55;

// ───────────── core parts ─────────────
type FaceProps = { slab: SlabType; side: 'left' | 'right'; u: number; v: number };

const FaceMark = ({ slab, side, u, v, w, h, fill, glow }: FaceProps & { w: number; h: number; fill: string; glow?: boolean }) => {
  const [x, y] = facePoint(slab, side, u, v);
  return (
    <g transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) matrix(${FACE_MATRIX[side]} 0 0)`}>
      {glow && <rect x={-w / 2 - 2} y={-h / 2 - 3} width={w + 4} height={h + 6} rx={h} fill={fill} filter="url(#lm-blur-sm)" opacity="0.75" />}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={fill} />
    </g>
  );
};

const PanelLine = ({ slab, side, v, from = 0.14, to = 0.86 }: { slab: SlabType; side: 'left' | 'right'; v: number; from?: number; to?: number }) => {
  const [x1, y1] = facePoint(slab, side, from, v);
  const [x2, y2] = facePoint(slab, side, to, v);
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#7d776a" strokeWidth="0.9" opacity="0.5" />;
};

const Fastener = ({ slab, x, y }: { slab: SlabType; x: number; y: number }) => {
  const [px, py] = project(x, y, CX, slab.top);
  return (
    <g transform={`translate(${px.toFixed(2)} ${py.toFixed(2)}) matrix(${FACE_MATRIX.top} 0 0)`}>
      <circle r="6.5" fill="url(#lm-hole)" stroke="#59544a" strokeWidth="1" />
    </g>
  );
};

const SlabBody = ({ slab }: { slab: SlabType }) => (
  <g>
    <path d={bodyPath(slab)} fill="url(#lm-side)" />
    <path d={bodyPath(slab)} fill="url(#lm-side-shade)" />
    <path d={bodyPath(slab)} fill="none" stroke="#4d483f" strokeWidth="1" opacity="0.9" />
  </g>
);

const SlabTop = ({ slab, groove }: { slab: SlabType; groove?: number }) => (
  <g>
    <path d={topPath(slab)} fill="url(#lm-bevel)" stroke="rgb(217 185 122 / .45)" strokeWidth="1" />
    <path d={topPath(slab, 4.5)} fill="url(#lm-top)" stroke="rgb(244 239 230 / .16)" strokeWidth="1" />
    {groove !== undefined && <path d={topPath(slab, groove)} fill="none" stroke="#14130f" strokeWidth="1.2" opacity="0.9" />}
  </g>
);

const CoreLogo = ({ x, y }: { x: number; y: number }) => {
  const plane = (lift: number) => `translate(${x} ${y - lift}) matrix(${FACE_MATRIX.top} 0 0) scale(${LOGO_SCALE})`;
  const top = LOGO_SIDE.length;
  return (
    <g>
      <g transform={`${plane(0)} translate(2.4 2.4)`} opacity="0.5" filter="url(#lm-blur-sm)">
        <Star fill="#000" />
      </g>
      {LOGO_SIDE.map((fill, k) => (
        <g key={fill} transform={plane(k)}>
          <Star fill={fill} />
        </g>
      ))}
      <g transform={plane(top)}>
        <rect x="-29" y="-29" width="58" height="58" fill="url(#lm-logo-top)" clipPath="url(#lm-mark-clip)" />
        <Star fill="none" stroke="#fff3d6" />
      </g>
    </g>
  );
};

const CoreDefs = () => (
  <defs>
    <linearGradient id="lm-side" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#3d3a34" />
      <stop offset="0.46" stopColor="#2f2c27" />
      <stop offset="0.5" stopColor="#1b1a17" />
      <stop offset="1" stopColor="#252320" />
    </linearGradient>
    <linearGradient id="lm-side-shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.45" stopColor="#000" stopOpacity="0" />
      <stop offset="1" stopColor="#000" stopOpacity="0.38" />
    </linearGradient>
    <linearGradient id="lm-bevel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#5b564c" />
      <stop offset="1" stopColor="#2a2824" />
    </linearGradient>
    <linearGradient id="lm-top" x1="0.1" y1="0" x2="0.9" y2="1">
      <stop offset="0" stopColor="#3a3731" />
      <stop offset="1" stopColor="#1f1e1b" />
    </linearGradient>
    <linearGradient id="lm-inlay" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#171614" />
      <stop offset="1" stopColor="#2c2a26" />
    </linearGradient>
    <linearGradient id="lm-seam" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#f6e6c0" />
      <stop offset="0.5" stopColor={GOLD} />
      <stop offset="1" stopColor="#c2994e" />
    </linearGradient>
    <linearGradient id="lm-slot" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#0a0a09" />
      <stop offset="1" stopColor="#25231f" />
    </linearGradient>
    <linearGradient id="lm-logo-top" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#fbefd0" />
      <stop offset="0.55" stopColor={GOLD} />
      <stop offset="1" stopColor="#b8914a" />
    </linearGradient>
    <clipPath id="lm-mark-clip">
      <Star fill="#000" />
    </clipPath>
    <radialGradient id="lm-hole" cx="0.5" cy="0.4" r="0.7">
      <stop offset="0" stopColor="#0c0c0b" />
      <stop offset="1" stopColor="#2c2a26" />
    </radialGradient>
    <filter id="lm-blur-sm" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3.5" /></filter>
    <filter id="lm-blur-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="9" /></filter>
    <filter id="lm-blur-spill" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="18" /></filter>
  </defs>
);

// ───────────── the core at rest ─────────────
const CoreObject = (props: SVGProps<SVGSVGElement>) => {
  const seam: SlabType = { half: MID.half - 2, radius: MID.radius - 2, top: MID.top + MID.depth - 1, depth: SEAM_GAP + 1 };
  const spillDy = BASE.top - MID.top;
  return (
    <svg viewBox="0 0 1000 1000" role="img" aria-label="The Luminary system, five layers stacked" {...props}>
      <CoreDefs />
      <SlabBody slab={BASE} />
      <SlabTop slab={BASE} groove={10} />
      <PanelLine slab={BASE} side="left" v={0.3} />
      <PanelLine slab={BASE} side="right" v={0.3} />
      {[0.5, 0.58, 0.66].map((u) => <FaceMark key={u} slab={BASE} side="right" u={u} v={0.62} w={4.5} h={4.5} fill="url(#lm-slot)" />)}
      {[0.32, 0.4].map((u) => <FaceMark key={u} slab={BASE} side="left" u={u} v={0.62} w={4.5} h={4.5} fill="url(#lm-slot)" />)}

      <g className="lm-seam-pulse">
        <path d={topPath(MID, 4, CX, spillDy)} fill={GOLD_GLOW} opacity="0.2" filter="url(#lm-blur-spill)" />
        <path d={bodyPath(seam)} fill={GOLD_GLOW} opacity="0.6" filter="url(#lm-blur-glow)" />
      </g>
      <path d={bodyPath(seam)} fill="url(#lm-seam)" />

      <SlabBody slab={MID} />
      <SlabTop slab={MID} groove={11} />
      <PanelLine slab={MID} side="left" v={0.78} />
      <PanelLine slab={MID} side="right" v={0.78} />
      <FaceMark slab={MID} side="left" u={0.62} v={0.42} w={34} h={7.5} fill="url(#lm-slot)" />
      {[0.34, 0.42].map((u) => <FaceMark key={u} slab={MID} side="left" u={u} v={0.42} w={5} h={5} fill="url(#lm-slot)" />)}
      {[0.44, 0.52].map((u) => <FaceMark key={u} slab={MID} side="right" u={u} v={0.42} w={5} h={5} fill="url(#lm-slot)" />)}
      <FaceMark slab={MID} side="right" u={0.68} v={0.42} w={22} h={4.5} fill="url(#lm-slot)" />
      <g className="lm-seam-pulse"><FaceMark slab={MID} side="left" u={0.2} v={0.42} w={7} h={2.6} fill={GOLD_GLOW} glow /></g>
      <Fastener slab={MID} x={0} y={-MID.half + 28} />
      <Fastener slab={MID} x={-MID.half + 28} y={0} />
      <Fastener slab={MID} x={MID.half - 28} y={0} />
      <Fastener slab={MID} x={0} y={MID.half - 28} />

      <SlabBody slab={CAP} />
      <SlabTop slab={CAP} />
      <path d={topPath(CAP, 19)} fill="url(#lm-inlay)" stroke="#47433b" strokeWidth="1.2" />
      <path d={topPath(CAP, 20.5)} fill="none" stroke="rgb(244 239 230 / .14)" strokeWidth="1" />
      <CoreLogo x={CX} y={CAP.top} />
    </svg>
  );
};

const CoreShadow = (props: SVGProps<SVGSVGElement>) => {
  const floor = { ...BASE, top: BASE.top + BASE.depth + 30 };
  return (
    <svg viewBox="0 0 1000 1000" aria-hidden {...props}>
      <defs>
        <filter id="lm-blur-lg" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="26" /></filter>
        <filter id="lm-blur-md" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" /></filter>
      </defs>
      <path d={topPath(floor, -14)} fill={GOLD} opacity="0.1" filter="url(#lm-blur-lg)" />
      <path d={topPath(floor, 6)} fill="#000" opacity="0.7" filter="url(#lm-blur-md)" />
    </svg>
  );
};

const NODES: [number, number][] = [[118, 132], [318, 82], [690, 96], [884, 188], [936, 470], [70, 512], [150, 858], [850, 846]];

const DepthBackdrop = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 1000 1000" aria-hidden {...props}>
    <defs>
      <linearGradient id="lm-glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.07" />
        <stop offset="1" stopColor="#fff" stopOpacity="0.01" />
      </linearGradient>
    </defs>
    <g fill="url(#lm-glass)" stroke="rgb(244 239 230 / .12)" strokeWidth="1" opacity="0.7">
      <rect width="290" height="250" rx="22" transform="matrix(0.866 -0.5 0 1 232 300)" />
      <rect width="290" height="250" rx="22" transform="matrix(0.866 0.5 0 1 520 150)" />
    </g>
    <g fill="#26241f" stroke="#6b6558" strokeWidth="1">
      {NODES.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 4 : 3} opacity="0.9" />)}
    </g>
  </svg>
);

// ───────────── exploded view ─────────────
const SKIRT = [0, 4, 0, 10, 10];

const Plate = ({ index, progress, children }: { index: number; progress: MotionValue<number>; children: ReactNode }) => {
  const y = useTransform(progress, (v) => plateY(index, v));
  const scale = useTransform(progress, (v) => plateScale(index, v));
  const apart = useTransform(progress, (v) => plateProgress(index, v));
  const shadow = useTransform(apart, (v) => v * 0.5);
  const slab = PLATE_SLABS[index];
  const skirt = SKIRT[index];
  return (
    <m.g style={{ y, scale }}>
      {index > 0 && <m.path d={topPath(slab, -6, CX, slab.depth + 34)} fill="#000" filter="url(#lm-blur-spill)" style={{ opacity: shadow }} />}
      {skirt > 0 && (
        <m.g style={{ opacity: apart }}>
          <SlabBody slab={{ ...slab, top: slab.top + slab.depth - 1, depth: skirt + 1 }} />
        </m.g>
      )}
      {children}
    </m.g>
  );
};

const PlateNumber = ({ slab, n, main = false }: { slab: SlabType; n: number; main?: boolean }) => {
  const k = slab.half * 0.56;
  const [x, y] = project(k, k, CX, slab.top);
  const plane = `matrix(${FACE_MATRIX.top} 0 0) rotate(-45)`;
  const label = String(n).padStart(2, '0');
  const text = { textAnchor: 'middle' as const, dominantBaseline: 'central' as const, fontSize: 25, fontWeight: 500, letterSpacing: 2.5 };
  return (
    <g transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`} aria-hidden>
      <text {...text} transform={`translate(0 0.9) ${plane}`} fill="#000" opacity="0.7">{label}</text>
      <text {...text} transform={plane} fill={main ? GOLD_GLOW : '#8d877a'}>{label}</text>
    </g>
  );
};

const AiEmphasis = ({ progress }: { progress: MotionValue<number> }) => {
  const on = useTransform(progress, (v) => clamp((v - 0.5) / 0.4));
  const rim = useTransform(on, (v) => v * 0.9);
  const halo = useTransform(on, (v) => v * 0.55);
  const spill = useTransform(halo, (v) => v * 0.35);
  return (
    <g transform={`translate(${CX} ${MID.top}) matrix(${FACE_MATRIX.top} 0 0)`}>
      <m.circle r="86" fill={GOLD_GLOW} filter="url(#lm-blur-spill)" style={{ opacity: spill }} />
      <m.circle r="56" fill="none" stroke={GOLD} strokeWidth="1.4" style={{ opacity: rim }} />
      <m.circle r="38" fill="none" stroke={GOLD} strokeWidth="1" strokeDasharray="3 6" style={{ opacity: halo }} />
      <m.circle r="9" fill={GOLD} style={{ opacity: rim }} />
    </g>
  );
};

const ExplodedCore = ({ progress, ...props }: SVGProps<SVGSVGElement> & { progress: MotionValue<number> }) => {
  const strongGlow = useTransform(progress, (v) => clamp((v - 0.4) / 0.5) * 0.6);
  const seam = { half: MID.half - 2, radius: MID.radius - 2, top: MID.top + MID.depth - 1, depth: SEAM_GAP + 1 };
  const inlay = (slab: SlabType) => (
    <>
      <path d={topPath(slab, 19)} fill="url(#lm-inlay)" stroke="#47433b" strokeWidth="1.2" />
      <path d={topPath(slab, 20.5)} fill="none" stroke="rgb(244 239 230 / .14)" strokeWidth="1" />
    </>
  );
  return (
    <svg viewBox="0 0 1000 1000" aria-hidden {...props}>
      <CoreDefs />
      <Plate index={0} progress={progress}>
        <SlabBody slab={PLATE_SLABS[0]} />
        <SlabTop slab={PLATE_SLABS[0]} groove={10} />
        <PlateNumber slab={PLATE_SLABS[0]} n={1} />
        {[0.5, 0.58, 0.66].map((u) => <FaceMark key={u} slab={BASE} side="right" u={u} v={0.62} w={4.5} h={4.5} fill="url(#lm-slot)" />)}
        {[0.32, 0.4].map((u) => <FaceMark key={u} slab={BASE} side="left" u={u} v={0.62} w={4.5} h={4.5} fill="url(#lm-slot)" />)}
      </Plate>
      <Plate index={1} progress={progress}>
        <SlabBody slab={PLATE_SLABS[1]} />
        <SlabTop slab={PLATE_SLABS[1]} groove={10} />
        <PlateNumber slab={PLATE_SLABS[1]} n={2} />
        <PanelLine slab={BASE} side="left" v={0.3} />
        <PanelLine slab={BASE} side="right" v={0.3} />
      </Plate>
      <Plate index={AI_PLATE} progress={progress}>
        <g className="lm-seam-pulse">
          <path d={topPath(MID, 4, CX, BASE.top - MID.top)} fill={GOLD_GLOW} opacity="0.2" filter="url(#lm-blur-spill)" />
          <path d={bodyPath(seam)} fill={GOLD_GLOW} opacity="0.6" filter="url(#lm-blur-glow)" />
        </g>
        <m.path d={bodyPath(seam)} fill={GOLD_GLOW} filter="url(#lm-blur-glow)" style={{ opacity: strongGlow }} />
        <path d={bodyPath(seam)} fill="url(#lm-seam)" />
        <SlabBody slab={MID} />
        <SlabTop slab={MID} groove={11} />
        <PlateNumber slab={MID} n={3} main />
        <PanelLine slab={MID} side="left" v={0.78} />
        <PanelLine slab={MID} side="right" v={0.78} />
        <FaceMark slab={MID} side="left" u={0.62} v={0.42} w={34} h={7.5} fill="url(#lm-slot)" />
        {[0.34, 0.42].map((u) => <FaceMark key={u} slab={MID} side="left" u={u} v={0.42} w={5} h={5} fill="url(#lm-slot)" />)}
        {[0.44, 0.52].map((u) => <FaceMark key={u} slab={MID} side="right" u={u} v={0.42} w={5} h={5} fill="url(#lm-slot)" />)}
        <FaceMark slab={MID} side="right" u={0.68} v={0.42} w={22} h={4.5} fill="url(#lm-slot)" />
        <g className="lm-seam-pulse"><FaceMark slab={MID} side="left" u={0.2} v={0.42} w={7} h={2.6} fill={GOLD_GLOW} glow /></g>
        <Fastener slab={MID} x={0} y={-MID.half + 28} />
        <Fastener slab={MID} x={-MID.half + 28} y={0} />
        <Fastener slab={MID} x={MID.half - 28} y={0} />
        <Fastener slab={MID} x={0} y={MID.half - 28} />
        <AiEmphasis progress={progress} />
      </Plate>
      <Plate index={3} progress={progress}>
        <SlabBody slab={PLATE_SLABS[3]} />
        <SlabTop slab={PLATE_SLABS[3]} />
        {inlay(PLATE_SLABS[3])}
        <PlateNumber slab={PLATE_SLABS[3]} n={4} />
      </Plate>
      <Plate index={4} progress={progress}>
        <SlabBody slab={PLATE_SLABS[4]} />
        <SlabTop slab={PLATE_SLABS[4]} />
        {inlay(CAP)}
        <CoreLogo x={CX} y={CAP.top} />
      </Plate>
    </svg>
  );
};

// ───────────── orbits and beads ─────────────
const OrbitalSystem = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 1000 1000" aria-hidden {...props}>
    <g fill="none" stroke="rgb(217 185 122 / .3)" strokeWidth="1">
      <ellipse cx={CX} cy={CY} rx={RING_RX[0]} ry={RING_RX[0] * RING_FLATTEN} opacity="0.8" />
      <ellipse cx={CX} cy={CY} rx={RING_RX[1]} ry={RING_RX[1] * RING_FLATTEN} opacity="0.55" />
    </g>
  </svg>
);

type NodeType = { ring: 0 | 1; angle: number; size: number };
const BEADS: NodeType[] = [
  { ring: 0, angle: 20, size: 7 }, { ring: 0, angle: 110, size: 5.5 }, { ring: 0, angle: 200, size: 8 }, { ring: 0, angle: 290, size: 6 },
  { ring: 1, angle: 60, size: 6 }, { ring: 1, angle: 132, size: 8 }, { ring: 1, angle: 204, size: 5.5 }, { ring: 1, angle: 276, size: 7 }, { ring: 1, angle: 348, size: 6.5 }
];

const Crystal = ({ size }: { size: number }) => (
  <g filter="url(#lm-crystal-shadow)">
    <circle r={size * 1.55} fill="url(#lm-crystal-halo)" />
    <circle r={size} fill="url(#lm-crystal-body)" />
    <circle r={size} fill="url(#lm-crystal-refract)" />
    <circle r={size - 0.5} fill="none" stroke="url(#lm-crystal-rim)" strokeWidth="1" />
    <ellipse cx={-size * 0.32} cy={-size * 0.4} rx={size * 0.36} ry={size * 0.2} transform={`rotate(-30 ${-size * 0.32} ${-size * 0.4})`} fill="#fff" opacity="0.95" />
    <circle cx={size * 0.34} cy={-size * 0.5} r={Math.max(0.7, size * 0.07)} fill="#fff" opacity="0.85" />
  </g>
);

const Particles = ({ half, animate: run, paused = false, ...props }: SVGProps<SVGSVGElement> & { half: 'back' | 'front'; animate: boolean; paused?: boolean }) => {
  const ref = useRef<SVGSVGElement>(null);
  const clipId = `lm-clip-${half}`;
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (paused) svg.pauseAnimations();
    else svg.unpauseAnimations();
  }, [paused]);
  return (
    <svg ref={ref} viewBox="0 0 1000 1000" aria-hidden {...props}>
      <defs>
        <clipPath id={clipId}>
          {half === 'back' ? <rect x="-200" y="-200" width="1400" height={CY + 200} /> : <rect x="-200" y={CY} width="1400" height="700" />}
        </clipPath>
        <linearGradient id="lm-crystal-body" x1="0.15" y1="0.1" x2="0.85" y2="0.95">
          <stop offset="0" stopColor="#FFF3D6" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#E3BE74" stopOpacity="0.9" />
          <stop offset="1" stopColor="#A97B2D" stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id="lm-crystal-refract" cx="0.6" cy="0.78" r="0.45">
          <stop offset="0" stopColor="#FFF8E6" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FFF8E6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lm-crystal-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#8f6b2c" stopOpacity="0.6" />
        </linearGradient>
        <radialGradient id="lm-crystal-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.5" stopColor={GOLD} stopOpacity="0.22" />
          <stop offset="1" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
        <filter id="lm-crystal-shadow" x="-80%" y="-80%" width="260%" height="260%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#000" floodOpacity="0.55" />
        </filter>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {BEADS.map((node, i) => {
          const rx = RING_RX[node.ring];
          const [x, y] = ringPoint(rx, node.angle);
          const dur = MOTION.orbitSeconds[node.ring];
          const reverse = node.ring === 1;
          const start = node.angle / 360;
          const begin = -dur * (reverse ? 1 - start : start);
          return (
            <g key={i} transform={run ? undefined : `translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
              <Crystal size={node.size} />
              {run && <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={ringPath(rx)} {...(reverse && { keyPoints: '1;0', keyTimes: '0;1', calcMode: 'linear' })} />}
            </g>
          );
        })}
      </g>
    </svg>
  );
};

const DOTS = Array.from({ length: 26 }, (_, i) => {
  const a = (i * 137.5 * Math.PI) / 180;
  const r = 160 + ((i * 53) % 340);
  return [round(CX + r * Math.cos(a) * 1.02), round(CY + r * Math.sin(a) * RING_FLATTEN * 1.6), 0.8 + (i % 3) * 0.5] as const;
});

const TechnicalBackdrop = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 1000 1000" aria-hidden {...props}>
    <defs>
      <linearGradient id="lm-axis-v" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8d877a" stopOpacity="0" /><stop offset="0.5" stopColor="#8d877a" stopOpacity="0.4" /><stop offset="1" stopColor="#8d877a" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="lm-axis-h" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#8d877a" stopOpacity="0" /><stop offset="0.5" stopColor="#8d877a" stopOpacity="0.55" /><stop offset="1" stopColor="#8d877a" stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect x={CX - 0.5} y="110" width="1" height="780" fill="url(#lm-axis-v)" />
    <rect x="70" y={CY - 0.5} width="860" height="1" fill="url(#lm-axis-h)" />
    <g fill="#8d877a">{DOTS.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} opacity={0.25 + (i % 4) * 0.1} />)}</g>
    <g stroke="#8d877a" strokeWidth="1" opacity="0.45">
      {([[212, 292], [790, 690], [860, 430], [150, 560]] as const).map(([x, y]) => <path key={`${x}-${y}`} d={`M${x - 5} ${y}h10M${x} ${y - 5}v10`} />)}
    </g>
  </svg>
);

// ───────────── glyphs (monoline, drawn to match the brand) ─────────────
const GLYPHS: Record<string, ReactNode> = {
  pen: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></>,
  gem: <><path d="M6 3h12l4 6-10 12L2 9z" /><path d="M2 9h20" /><path d="M11 3 8 9l4 12 4-12-3-6" /></>,
  target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
  compass: <><circle cx="12" cy="12" r="10" /><path d="m16 8-2 6-6 2 2-6z" /></>,
  video: <><rect x="2" y="6" width="14" height="12" rx="2" /><path d="m22 8-6 4 6 4z" /></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".6" fill="currentColor" /></>,
  tiktok: <path d="M9 12.5a4 4 0 1 0 4 4V3c.6 2.6 2.6 4.2 5 4.4" />,
  youtube: <><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3z" /></>,
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></>,
  globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />,
  star: <path d="m12 2 3.1 6.3 6.9 1-5 4.8 1.2 6.9-6.2-3.2-6.2 3.2L7 14.1 2 9.3l6.9-1z" />,
  cursor: <path d="M4 4l7.1 17.5 2.5-7.9 7.9-2.5z" />
};

const Glyph = ({ name, className, strokeWidth = 1.5 }: { name: string; className?: string; strokeWidth?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
    {GLYPHS[name]}
  </svg>
);

// ───────────── stage cards ─────────────
const AppGlyphs = ({ stage, tiles, className }: { stage: Stage; tiles: boolean; className?: string }) => (
  <div className={cn('lm-stage-apps flex shrink-0 items-center', tiles ? 'gap-[0.45em]' : 'gap-[0.4em]', className)}>
    {stage.apps.map((app, i) =>
      tiles ? (
        <span key={`${app}${i}`} className="grid size-[2.15em] place-items-center rounded-[0.6em] border border-ivory/15 bg-obsidian/70 text-champagne">
          <Glyph name={app} className="size-[1.2em]" />
        </span>
      ) : (
        <Glyph key={`${app}${i}`} name={app} className="size-[1.3em] text-champagne/80" />
      )
    )}
    <span className="sr-only">Includes {stage.items.join(', ')}</span>
  </div>
);

const StageCardBody = ({ index }: { index: number }) => {
  const stage = STAGES[index];
  const main = isMain(stage);
  const icon = 'icon' in stage ? stage.icon : null;
  return (
    <div className="grid grid-cols-[1.35em_minmax(0,1fr)_auto] items-start gap-x-[0.5em]">
      <span className="col-start-1 row-start-1 flex h-[1.64em] items-center text-[0.8em] font-medium tabular-nums text-ivory/55">{String(index + 1).padStart(2, '0')}</span>
      <div className={cn('col-start-2 row-start-1 flex flex-wrap items-baseline justify-between gap-x-[0.6em]', main && 'col-span-2')}>
        <p className="text-[1.05em] font-medium leading-[1.25] tracking-[-0.01em] text-ivory md:whitespace-nowrap">{stage.title}</p>
        {main && <span className="shrink-0 text-[0.72em] font-semibold uppercase tracking-[0.12em] text-champagne">Core layer</span>}
      </div>
      {icon && (
        <span className="col-start-1 row-start-2 mt-[0.4em] flex h-[1.276em] items-center">
          <Glyph name={icon} className="size-[1.25em] text-champagne" strokeWidth={1.5} />
        </span>
      )}
      <div className={cn('col-start-2 row-start-2 mt-[0.4em]', main && 'col-span-2')}>
        <p className="text-[0.88em] leading-[1.45] text-ivory/60">{stage.items.join(' · ')}</p>
        {main && <AppGlyphs stage={stage} tiles className="mt-[0.75em] justify-end" />}
      </div>
      {!main && <AppGlyphs stage={stage} tiles={false} className="col-start-3 row-span-2 row-start-1 self-center" />}
    </div>
  );
};

const pct = (n: number) => `${(n / ARTBOARD) * 100}%`;
const cardDirection = (index: number) => (STAGES[index].side === 'left' ? -1 : 1);

const StageCard = ({ index, progress, open, lit, onHover }: { index: number; progress: MotionValue<number>; open: boolean; lit: boolean; onHover: (i: number | null) => void }) => {
  const opacity = useTransform(progress, [0.35, 0.9], [0, 1]);
  const x = useTransform(progress, [0, 1], [-cardDirection(index) * STAGE_CARDS.restInset, cardDirection(index) * STAGE_CARDS.outward]);
  const stage = STAGES[index];
  const { edge, width } = STAGE_CARDS[stage.side];
  const left = stage.side === 'left' ? edge : 100 - edge - width;
  return (
    <li style={{ top: pct(cornerY(index)), left: `${left}%`, width: `${width}%` }} className="absolute -translate-y-1/2">
      <m.div
        style={{ opacity, x }}
        onPointerEnter={(e: ReactPointerEvent) => { if (e.pointerType === 'mouse') onHover(index); }}
        onPointerLeave={() => onHover(null)}
        className={cn('lm-stage-card px-[0.9em] py-[0.85em]', open && 'pointer-events-auto', lit && 'lm-stage-card-lit')}
      >
        <StageCardBody index={index} />
      </m.div>
    </li>
  );
};

const StageCards = ({ progress, open, hovered, onHover }: { progress: MotionValue<number>; open: boolean; hovered: number | null; onHover: (i: number | null) => void }) => (
  <ul aria-label="How the Luminary system works" aria-hidden={!open} className="pointer-events-none absolute inset-0 m-0 hidden list-none p-0 text-[clamp(10px,1.7cqw,15px)] md:block">
    {STAGES.map((stage, i) => <StageCard key={stage.title} index={i} progress={progress} open={open} lit={hovered === i} onHover={onHover} />)}
  </ul>
);

// ───────────── connectors ─────────────
const lineEnds = (plate: number, card: number, side: 'left' | 'right') => {
  const dir = side === 'right' ? 1 : -1;
  return { plateX: plate + dir * 7, nodeX: card - dir * 10 };
};

const StageConnector = ({ plate, card, y, side, index, main, lit, active, progress, className }: { plate: number; card: number; y: number; side: 'left' | 'right'; index: number; main: boolean; lit: boolean; active: boolean; progress: MotionValue<number>; className?: string }) => {
  const show = useTransform(progress, [0.55, 0.9], [0, 1]);
  const t = useMotionValue(0);
  const beadX = useTransform(t, (k) => {
    const ends = lineEnds(plate, card, side);
    return ends.nodeX + (ends.plateX - ends.nodeX) * k;
  });
  const beadOpacity = useTransform([t, show], ([k, s]: number[]) => s * Math.sin(Math.PI * k));
  const { plateX, nodeX } = lineEnds(plate, card, side);

  useEffect(() => {
    if (!active) return;
    const controls = animate(t, [0, 1], { duration: STAGE_CARDS.beadSeconds, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.4, delay: 0.5 + index * 0.25 });
    return () => { controls.stop(); t.set(0); };
  }, [active, index, t]);

  return (
    <m.svg aria-hidden viewBox={`0 0 ${ARTBOARD} ${ARTBOARD}`} style={{ opacity: show }} className={className}>
      <line x1={plateX} x2={nodeX} y1={y} y2={y} stroke="rgb(244 239 230 / .22)" strokeWidth="1" />
      <m.line x1={plateX} x2={nodeX} y1={y} y2={y} stroke={GOLD} strokeWidth="1.2" initial={false} animate={{ opacity: lit ? 0.9 : 0 }} transition={{ duration: 0.25 }} />
      <circle cx={plateX} cy={y} r="2.6" fill="#8d877a" />
      <m.circle cx={nodeX} cy={y} r={main ? 10 : 8} fill={GOLD} initial={false} animate={{ opacity: lit || main ? 0.28 : 0.14 }} transition={{ duration: 0.25 }} />
      <circle cx={nodeX} cy={y} r="3.6" fill={GOLD} />
      <m.circle cx={beadX} cy={y} r="2.6" fill={GOLD_GLOW} style={{ opacity: beadOpacity }} />
    </m.svg>
  );
};

const StageConnectors = ({ progress, active, hovered }: { progress: MotionValue<number>; active: boolean; hovered: number | null }) => (
  <div className="pointer-events-none absolute inset-0 hidden md:block">
    {STAGES.map((stage, i) => {
      const { edge, width } = STAGE_CARDS[stage.side];
      const cardEdge = stage.side === 'left' ? (edge + width) * 10 : (100 - edge - width) * 10;
      return (
        <StageConnector key={stage.title} plate={tipX(i, stage.side)} card={cardEdge} y={cornerY(i)} side={stage.side} index={i} main={isMain(stage)} lit={hovered === i} active={active} progress={progress} className="pointer-events-none absolute inset-0 size-full overflow-visible" />
      );
    })}
  </div>
);

// On a phone the visual is too narrow for cards beside it, so they sit below it as a grid.
const StageList = ({ reduce }: { reduce: boolean }) => (
  <m.ul initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5, ease: EASE }} aria-label="How the Luminary system works" className="m-0 mt-6 grid list-none grid-cols-1 gap-2.5 p-0 text-[13px] sm:grid-cols-2 md:hidden">
    {STAGES.map((stage, i) => (
      <li key={stage.title} className="lm-stage-card px-[1.05em] py-[0.95em]"><StageCardBody index={i} /></li>
    ))}
  </m.ul>
);

// ───────────── the visual ─────────────
const subscribeToVisibility = (onChange: () => void) => {
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
};
const isPageVisible = () => !document.hidden;
const isPageVisibleOnServer = () => true;

const ParallaxLayer = ({ x, y, reach, children }: { x: MotionValue<number>; y: MotionValue<number>; reach: number; children: ReactNode }) => {
  const tx = useTransform(x, (v) => v * reach);
  const ty = useTransform(y, (v) => v * reach);
  return <m.div style={{ x: tx, y: ty }} className="pointer-events-none absolute inset-0">{children}</m.div>;
};

const Tilted = ({ rotateX, rotateY, children }: { rotateX: MotionValue<number>; rotateY: MotionValue<number>; children: ReactNode }) => (
  <div className="pointer-events-none absolute inset-0 [perspective:1400px]">
    <m.div style={{ rotateX, rotateY }} className="absolute inset-0">
      <div className="lm-float absolute inset-0">{children}</div>
    </m.div>
  </div>
);

export default function LuminaryStack() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const pointerType = useRef('mouse');
  const visualRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;

  const onScreen = useInView(visualRef, { margin: '40px' });
  const pageVisible = useSyncExternalStore(subscribeToVisibility, isPageVisible, isPageVisibleOnServer);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const x = useSpring(px, { stiffness: 55, damping: 18, mass: 0.9 });
  const y = useSpring(py, { stiffness: 55, damping: 18, mass: 0.9 });
  const rotateY = useTransform(x, (v) => v * MOTION.tiltDegrees);

  // 0 = stacked, 1 = apart. One spring drives the plates, connectors, cards and shadow together.
  const target = useMotionValue(0);
  const progress = useSpring(target, reduce ? { duration: 0.01 } : EXPLODE.spring);

  const rotateX = useTransform([y, progress], ([v, p]: number[]) => v * -MOTION.tiltDegrees + p * 4);
  const restOpacity = useTransform(progress, [0, 0.04], [1, 0]);
  const explodedOpacity = useTransform(progress, [0, 0.03], [0, 1]);
  const shadowOpacity = useTransform(progress, [0, 1], [1, 0.55]);
  const orbitOpacity = useTransform(progress, [0, 0.6], [1, MOTION.orbitOpenOpacity]);
  const hintOpacity = useTransform(progress, [0, 0.25], [1, 0]);

  const beadsPaused = open || !onScreen || !pageVisible;

  useEffect(() => { target.set(open ? 1 : 0); }, [open, target]);

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const box = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - box.left) / box.width - 0.5) * 2);
    py.set(((e.clientY - box.top) / box.height - 0.5) * 2);
  };
  const handlePointerLeave = () => { px.set(0); py.set(0); setOpen(false); };
  const handleCardHover = (index: number | null) => { setHovered(index); if (index !== null && !reduce) setOpen(true); };
  const handleCorePointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => { pointerType.current = e.pointerType; };
  const handleCorePointerEnter = (e: ReactPointerEvent<HTMLButtonElement>) => { if (e.pointerType === 'mouse' && !reduce) setOpen(true); };
  // A mouse opens it by hovering the core. Touch and keyboard have no hover, so they toggle instead.
  const handleCoreClick = (e: MouseEvent<HTMLButtonElement>) => { if (e.detail === 0 || pointerType.current !== 'mouse') setOpen((v) => !v); };

  return (
    <LazyMotion features={domAnimation}>
      <>
        <div
          ref={visualRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          style={{ ['--lm-float' as string]: MOTION.floatDistance, ['--lm-float-seconds' as string]: `${MOTION.floatSeconds}s` }}
          className="lm-enter @container relative -my-[6%] -ml-[12.5%] aspect-square w-[125%] max-w-none md:mx-auto md:my-0 md:w-full md:max-w-[840px] lg:mx-0 lg:w-[104%] lg:max-w-none"
        >
          <div className="absolute inset-0">
            <div aria-hidden className="lm-halo pointer-events-none absolute inset-[6%]" />

            <div className="lm-fade-edge absolute inset-0">
              <ParallaxLayer x={x} y={y} reach={-MOTION.backdropParallax}>
                <DepthBackdrop className="absolute inset-0 size-full overflow-visible" />
                <TechnicalBackdrop className="absolute inset-0 size-full overflow-visible" />
              </ParallaxLayer>
            </div>

            <ParallaxLayer x={x} y={y} reach={MOTION.ringParallax}>
              <m.div style={{ opacity: orbitOpacity }} className="absolute inset-0">
                <OrbitalSystem className="absolute inset-0 size-full overflow-visible" />
                <Particles half="back" animate={!reduce} paused={beadsPaused} className="absolute inset-0 size-full overflow-visible" />
              </m.div>
            </ParallaxLayer>

            <m.div style={{ opacity: shadowOpacity }} className="absolute inset-0">
              <CoreShadow className="pointer-events-none absolute inset-0 size-full overflow-visible" />
            </m.div>

            <Tilted rotateX={rotateX} rotateY={rotateY}>
              <m.div style={{ opacity: restOpacity }} className="absolute inset-0">
                <CoreObject className="absolute inset-0 size-full overflow-visible" />
              </m.div>
              <m.div style={{ opacity: explodedOpacity }} className="absolute inset-0">
                <ExplodedCore progress={progress} className="absolute inset-0 size-full overflow-visible" />
              </m.div>
              <StageConnectors progress={progress} active={open && !reduce} hovered={hovered} />
            </Tilted>

            <ParallaxLayer x={x} y={y} reach={MOTION.ringParallax}>
              <m.div style={{ opacity: orbitOpacity }} className="absolute inset-0">
                <Particles half="front" animate={!reduce} paused={beadsPaused} className="absolute inset-0 size-full overflow-visible" />
              </m.div>
            </ParallaxLayer>

            <Tilted rotateX={rotateX} rotateY={rotateY}>
              <StageCards progress={progress} open={open} hovered={hovered} onHover={handleCardHover} />
            </Tilted>
          </div>

          <m.p aria-hidden style={{ opacity: hintOpacity }} className="pointer-events-none absolute left-1/2 top-[84%] m-0 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap text-[12.5px] text-ivory/60">
            <Glyph name="cursor" className="size-3.5 text-champagne" strokeWidth={1.8} />
            <span className="[@media(hover:none)]:hidden">Hover to see how it works</span>
            <span className="hidden [@media(hover:none)]:inline">Tap to see how it works</span>
          </m.p>

          <button
            type="button"
            aria-expanded={open}
            aria-label="Show how the Luminary system works inside"
            onPointerDown={handleCorePointerDown}
            onPointerEnter={handleCorePointerEnter}
            onClick={handleCoreClick}
            onBlur={() => setOpen(false)}
            className="absolute left-[22%] top-[30%] h-[44%] w-[56%] cursor-default rounded-[3rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne"
          />
        </div>
        <StageList reduce={reduce} />
      </>
    </LazyMotion>
  );
}
