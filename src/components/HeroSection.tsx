type Hero = {
  eyebrow: string
  title: string
  description: string
  primaryCtaLabel: string
  primaryCtaHref: string
  caption: string
  avatarUrl?: string
}

type Snapshot = {
  title: string
  items: string[]
}

type HeroSectionProps = {
  hero: Hero
  snapshot: Snapshot
}

function HeroSection({ hero, snapshot }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="bg-gradient-to-br from-[#15151e] via-[#050509] to-[#050509] pb-12 pt-16"
      aria-labelledby="hero-title"
    >
      <div className="mx-auto grid max-w-5xl gap-10 px-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2.2fr)] md:items-center">
        <div className="max-w-xl space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-300">
            {hero.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl md:text-5xl"
          >
            {hero.title}
          </h1>
          <p className="text-sm leading-relaxed text-slate-300">
            {hero.description}
          </p>
          <div className="flex flex-col items-start gap-3 pt-2 sm:flex-row sm:items-center">
            <a
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#050509] shadow-[0_14px_36px_rgba(37,99,235,0.7)] transition hover:from-blue-500 hover:to-cyan-300"
              href={hero.primaryCtaHref}
              target="_blank"
              rel="noreferrer"
            >
              {hero.primaryCtaLabel}
            </a>
            <p className="max-w-xs text-[11px] text-slate-400">{hero.caption}</p>
          </div>
        </div>

        <aside
          className="mx-auto w-full max-w-xs md:max-w-sm"
          aria-label="Profile summary"
        >
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#181827] to-[#0b0b14] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-3 pb-4">
              {hero.avatarUrl && (
                <img
                  className="h-12 w-12 rounded-full border border-white/20 object-cover shadow-lg"
                  src={hero.avatarUrl}
                  alt={`${hero.title} avatar`}
                  loading="lazy"
                />
              )}
              <div className="space-y-0.5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                  {snapshot.title}
                </p>
                <p className="text-[11px] text-slate-400">
                  Snapshot generated from GitHub at build time.
                </p>
              </div>
            </div>
            <div className="mt-1 flex flex-wrap gap-1.5 text-[11px] text-slate-200">
              {snapshot.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-slate-900/60 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default HeroSection

