import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

/**
 * Brand Visibility, scroll version. The photo stays still and the "camera" moves around her:
 * a depth map shifts near and far parts by different amounts, so scrolling swings the view
 * from one side to the other. The text card slides in from the left.
 */

type Props = { image: string; depth: string; alt: string; channels: string[]; focus?: [number, number]; at?: [number, number]; zoom?: number; swing?: number };

const VERT = `attribute vec2 a; varying vec2 v; void main(){ v = a*0.5+0.5; gl_Position = vec4(a,0.,1.); }`;
const FRAG = `precision highp float;
varying vec2 v;
uniform sampler2D uImg, uDepth;
uniform vec2 uOff;      // camera swing in uv units
uniform vec2 uFit;      // cover-fit scale
uniform vec2 uPos;      // cover-fit offset
uniform float uZoom;
const float FOCUS = 0.52;
vec2 map(vec2 p){ return (p - 0.5) / uZoom + 0.5; }
void main(){
  vec2 uv = vec2(v.x, 1.0 - v.y);
  vec2 base = map(uv * uFit + uPos);
  float d = texture2D(uDepth, base).r;
  vec2 p = base - uOff * (d - FOCUS);
  float d2 = texture2D(uDepth, p).r;
  p = base - uOff * (d2 - FOCUS);
  p = clamp(p, 0.001, 0.999);
  gl_FragColor = texture2D(uImg, p);
}`;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
}

function useOrbitCanvas(image: string, depth: string, focus: [number, number], at: [number, number], zoom: number, swing: number) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ draw: (t: number) => void } | null>(null);
  const [ok, setOk] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: false });
    if (!gl) { setOk(false); return; }
    let dead = false;

    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { setOk(false); return; }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    const tex = (img: HTMLImageElement, unit: number) => {
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };

    Promise.all([loadImage(image), loadImage(depth)]).then(([img, dep]) => {
      if (dead) return;
      tex(img, 0); tex(dep, 1);
      gl.uniform1i(U('uImg'), 0); gl.uniform1i(U('uDepth'), 1);
      let last = 0;
      const fit = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
        if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
        // cover fit, then zoom in so the face (focus) lands at the chosen spot (at) in the panel
        const ca = canvas.clientWidth / canvas.clientHeight, ia = img.width / img.height;
        let sx = 1, sy = 1;
        if (ca > ia) sy = ia / ca; else sx = ca / ia;
        sx /= zoom; sy /= zoom;
        const px = Math.min(Math.max(focus[0] - at[0] * sx, 0), 1 - sx);
        const py = Math.min(Math.max(focus[1] - at[1] * sy, 0), 1 - sy);
        gl.uniform2f(U('uFit'), sx, sy);
        gl.uniform2f(U('uPos'), px, py);
      };
      const draw = (t: number) => {
        last = t; fit();
        // t runs -1..1: the camera swings across about 24 degrees each way
        gl.uniform2f(U('uOff'), t * swing, Math.sin(t * Math.PI) * swing * 0.14);
        gl.uniform1f(U('uZoom'), 1.07 + Math.abs(t) * 0.03);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      };
      api.current = { draw };
      draw(last);
      new ResizeObserver(() => draw(last)).observe(canvas);
    }).catch(() => setOk(false));

    return () => { dead = true; api.current = null; };
  }, [image, depth]);

  return { canvasRef, api, ok };
}

export default function BrandOrbit({ image, depth, alt, channels, focus = [0.52, 0.34], at = [0.74, 0.42], zoom = 1.35, swing = 0.06 }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 });
  const { canvasRef, api, ok } = useOrbitCanvas(image, depth, focus, at, zoom, swing);

  // camera: -1 at the start, +1 at the end, steady in the first and last bit
  const cam = useTransform(p, [0.04, 0.9], [-1, 1], { clamp: true });
  useMotionValueEvent(cam, 'change', (t) => api.current?.draw(reduce ? 0 : t));
  useEffect(() => { api.current?.draw(reduce ? 0 : cam.get()); }, [ok, reduce]);

  const cardX = useTransform(p, [0.02, 0.32], [-110, 0]);
  const cardO = useTransform(p, [0.02, 0.28], [0, 1]);
  const panelS = useTransform(p, [0, 0.3], [0.94, 1]);
  const hint = useTransform(p, [0, 0.08], [1, 0]);

  const panel = (
    <motion.div style={reduce ? undefined : { scale: panelS }} className="img-round relative h-full w-full bg-obsidian">
      {ok ? (
        <canvas ref={canvasRef} role="img" aria-label={alt} className="absolute inset-y-0 right-0 h-full w-full md:w-[88%] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_16%)] [mask-image:linear-gradient(to_right,transparent,#000_16%)]" />
      ) : (
        <img src={image} alt={alt} className="absolute inset-y-0 right-0 !h-full !w-full object-cover object-[60%_30%] md:!w-[88%] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_16%)] [mask-image:linear-gradient(to_right,transparent,#000_16%)]" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-obsidian/80 via-obsidian/25 to-transparent" />
    </motion.div>
  );

  const card = (
    <motion.div style={reduce ? undefined : { x: cardX, opacity: cardO }} className="max-w-xl rounded-[14px] border border-ivory/15 bg-obsidian/60 p-12 backdrop-blur-xl">
      <p className="eyebrow">Brand visibility</p>
      <h2 id="vis-title" className="h-display mt-5 text-5xl">Grow your <span className="text-gold-shine font-medium">brand visibility.</span></h2>
      <p className="lead mt-6">Be the practice people see first and remember longest. We build a steady presence across the places your future patients already look.</p>
      <ul className="mt-8 flex flex-wrap gap-3">
        {channels.map((c) => <li key={c} className="chip cursor-default rounded-full border border-ivory/20 px-4 py-2 text-[0.72rem] uppercase tracking-[0.18em] text-ivory/80">{c}</li>)}
      </ul>
    </motion.div>
  );

  if (reduce) {
    return (
      <div className="container-lux py-28 md:py-40">
        <div className="relative min-h-[34rem]">{panel}<div className="absolute inset-0 flex items-center p-14">{card}</div></div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative h-[280svh]" aria-labelledby="vis-title">
      <div className="sticky top-0 flex h-[100svh] items-center">
        <div className="container-lux">
          <div className="relative h-[34rem] max-h-[78svh] w-full">
            {panel}
            <div className="absolute inset-0 flex items-center p-14">{card}</div>
            <motion.p aria-hidden style={{ opacity: hint }} className="pointer-events-none absolute -bottom-9 left-1/2 m-0 -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-ivory/45">Scroll</motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
