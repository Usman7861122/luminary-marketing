import { motion } from 'framer-motion';

type Project = { slug: string; title: string; tag: string; image: string; span: string; ratio: string };

export default function PortfolioGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-4 md:gap-5 lg:grid-cols-12">
      {projects.map((p, i) => (
        <motion.a
          key={p.slug}
          href={`/work/${p.slug}`}
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8% 0px' }}
          transition={{ duration: 0.9, delay: (i % 3) * 0.1, ease: [0.2, 0.7, 0.2, 1] }}
          className={`group relative block overflow-hidden rounded-[14px] ${p.span} ${p.ratio}`}
        >
          <img
            src={p.image}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/15 to-transparent transition-opacity duration-500 group-hover:from-obsidian/95" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-champagne">{p.tag}</p>
              <h3 className="font-display mt-2 text-2xl font-light text-ivory md:text-3xl">{p.title}</h3>
            </div>
            <span
              aria-hidden="true"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-[6px] border border-ivory/30 text-ivory opacity-0 transition-all duration-500 group-hover:border-champagne group-hover:text-champagne group-hover:opacity-100"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17 17 7M9 7h8v8" /></svg>
            </span>
          </div>
        </motion.a>
      ))}
    </div>
  );
}
