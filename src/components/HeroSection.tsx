type Hero = {
  eyebrow: string
  title: string
  description: string
  minorInfo?: string | null
  primaryCtaLabel: string
  primaryCtaHref: string
  caption: string
  avatarUrl?: string
  contact?: {
    email?: string | null
    location?: string | null
    company?: string | null
    website?: string | null
    twitter?: string | null
  }
}

type Snapshot = {
  title: string
  items: string[]
  subtitle?: string | null
}

type HeroSectionProps = {
  hero: Hero
  snapshot: Snapshot
  theme: 'dark' | 'light'
}

function HeroSection({ hero, snapshot, theme }: HeroSectionProps) {
  const isDark = theme === 'dark'

  return (
    <section
      id="hero"
      className={`pb-12 pt-16 ${
        isDark ? 'bg-[#050509] text-slate-50' : 'bg-slate-50 text-slate-900'
      }`}
      aria-labelledby="hero-title"
    >
      <div className="mx-auto grid max-w-5xl gap-10 px-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2.2fr)] md:items-center">
        <div className="max-w-xl space-y-6">
          <p
            className={`text-xs font-semibold uppercase tracking-[0.25em] ${
              isDark ? 'text-indigo-300' : 'text-indigo-600'
            }`}
          >
            {hero.eyebrow}
          </p>
          <h1
            id="hero-title"
            className={`text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl ${
              isDark ? 'text-slate-50' : 'text-slate-900'
            }`}
          >
            {hero.title}
          </h1>
          <p
            className={`text-sm leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            {hero.description}
          </p>
          {hero.minorInfo && (
            <p
              className={`text-xs leading-relaxed ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {hero.minorInfo}
            </p>
          )}
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
          <div
            className={`rounded-2xl p-5 shadow-[0_18px_45px_rgba(0,0,0,0.8)] border ${
              isDark
                ? 'border-white/10 bg-gradient-to-b from-[#181827] to-[#0b0b14]'
                : 'border-slate-200 bg-white'
            }`}
          >
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
                <p
                  className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                    isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}
                >
                  {snapshot.title}
                </p>
                <p
                  className={`text-[11px] ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {snapshot.subtitle ??
                    'Snapshot generated from GitHub at build time.'}
                </p>
              </div>
            </div>
            <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
              {snapshot.items.map((item) => (
                <span
                  key={item}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] ${
                    isDark
                      ? 'bg-slate-900/60 text-slate-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>
            {hero.contact &&
              (hero.contact.company ||
                hero.contact.website ||
                hero.contact.email ||
                hero.contact.twitter) && (
                <div className="mt-4 border-t border-slate-800/40 pt-3 text-[11px] text-slate-300 dark:text-slate-300">
                  <div className="space-y-1.5">
                    {hero.contact.company && (
                      <p className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <span className="h-3 w-3 rounded-full bg-slate-400/80" />
                        <span>{hero.contact.company}</span>
                      </p>
                    )}
                    {hero.contact.website && (
                      <p className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-full bg-indigo-400/80" />
                        <a
                          href={hero.contact.website}
                          target="_blank"
                          rel="noreferrer"
                          className="truncate text-indigo-300 hover:text-indigo-200"
                        >
                          {hero.contact.website}
                        </a>
                      </p>
                    )}
                    {hero.contact.email && (
                      <p className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                        <a
                          href={`mailto:${hero.contact.email}`}
                          className="hover:underline"
                        >
                          {hero.contact.email}
                        </a>
                      </p>
                    )}
                    {hero.contact.twitter && (
                      <p className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <span className="h-3 w-3 rounded-full bg-sky-400/80" />
                        <a
                          href={`https://twitter.com/${hero.contact.twitter}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                        >
                          @{hero.contact.twitter}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              )}
          </div>
        </aside>
      </div>
    </section>
  )
}

export default HeroSection

