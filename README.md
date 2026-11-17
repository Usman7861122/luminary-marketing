# Marketing Agency Website

Astro + React islands + Tailwind v4 + Framer Motion.

## Start
```bash
npm install
npm run dev
```

## Structure
- `src/pages` – routes (home, about, services, work, blog, contact)
- `src/layouts` – base layout
- `src/components/astro` – static components (no JS)
- `src/components/react` – React islands (use `client:*` only where needed)
- `src/data/site.ts` – nav, services, projects content
- `src/lib/motion.ts` – shared Framer Motion variants
