import siteContent from './siteContent.json'

function App() {
  const hero = siteContent.hero
  const snapshot = siteContent.snapshot
  const philosophy = siteContent.philosophy
  const projects = siteContent.projects
  const footer = siteContent.footer

  return (
    <div className="min-h-screen bg-[#050509] text-slate-50 font-sans">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#050509]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a
            href="#hero"
            className="inline-flex items-center gap-2 text-slate-100 no-underline"
            aria-label={`${hero.title} home`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-sm font-semibold text-[#050509]" aria-hidden="true">
              {(hero.title ?? '?').charAt(0).toUpperCase()}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
              {hero.title}
            </span>
          </a>
          <nav className="flex items-center gap-4 text-xs font-medium text-slate-300" aria-label="Primary">
            <a href="#philosophy" className="border-b border-transparent pb-0.5 transition-colors hover:border-slate-400 hover:text-slate-50">Philosophy</a>
            <a href="#projects" className="border-b border-transparent pb-0.5 transition-colors hover:border-slate-400 hover:text-slate-50">Projects</a>
            <a href={footer.githubUrl} target="_blank" rel="noreferrer" className="border-b border-transparent pb-0.5 transition-colors hover:border-slate-400 hover:text-slate-50">
              {footer.githubLabel}
            </a>
          </nav>
        </div>
      </header>

      <main>
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
                <p className="max-w-xs text-[11px] text-slate-400">
                  {hero.caption}
                </p>
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
                <ul className="space-y-1.5 text-[13px] text-slate-200">
                  {snapshot.items.map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <section
          id="philosophy"
          className="border-t border-slate-800 bg-gradient-to-br from-[#101020] via-[#050509] to-[#050509] py-12"
          aria-labelledby="philosophy-title"
        >
          <div className="mx-auto max-w-5xl px-6">
            <header className="mb-8 max-w-2xl">
              <h2
                id="philosophy-title"
                className="mb-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-300"
              >
                {philosophy.title}
              </h2>
              <p className="text-sm leading-relaxed text-slate-300">
                {philosophy.body}
              </p>
            </header>

            <div className="grid gap-4 md:grid-cols-2">
              {philosophy.cards.map(
                (card: { title: string; body: string }) => (
                  <article
                    key={card.title}
                    className="rounded-xl border border-white/10 bg-gradient-to-b from-[#171824] to-[#10111b] p-4 text-sm text-slate-200 shadow-[0_18px_40px_rgba(0,0,0,0.75)] transition hover:-translate-y-0.5 hover:border-indigo-400/80 hover:shadow-[0_18px_50px_rgba(49,130,206,0.85)]"
                  >
                    <h3 className="mb-1.5 text-sm font-semibold text-slate-50">
                      {card.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed text-slate-300">
                      {card.body}
                    </p>
                  </article>
                ),
              )}
            </div>
          </div>
        </section>

        <section
          id="projects"
          className="border-t border-slate-800 bg-[#050509] py-12"
          aria-labelledby="projects-title"
        >
          <div className="mx-auto max-w-5xl px-6">
            <header className="mb-8 max-w-2xl">
              <h2
                id="projects-title"
                className="mb-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-300"
              >
                {projects.title}
              </h2>
              <p className="text-sm leading-relaxed text-slate-300">
                {projects.body}
              </p>
            </header>

            <div className="grid gap-4 md:grid-cols-2">
              {projects.repos.map(
                (repo: {
                  name: string
                  description: string
                  url: string
                  stars: number
                  language?: string | null
                  topics?: string[]
                  lastUpdated?: string
                }) => (
                <article
                  key={repo.url}
                  className="flex flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-[#181829] to-[#0a0a13] p-5 text-sm text-slate-200 shadow-[0_18px_45px_rgba(0,0,0,0.8)]"
                  aria-label={`Repository ${repo.name}`}
                >
                  <header className="mb-3 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-slate-50">
                        {repo.name}
                      </h3>
                      <p className="text-[13px] text-slate-300">
                        {repo.description ?? 'Repository on GitHub.'}
                      </p>
                    </div>
                    <a
                      className="inline-flex items-center justify-center rounded-full border border-white/30 bg-black/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-100 transition hover:border-white/60 hover:bg-black/70"
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View repo
                    </a>
                  </header>

                  <div className="mt-2 space-y-2 text-[12px] text-slate-300">
                    <dl className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Repository metadata">
                      <div className="flex items-center gap-1">
                        <dt className="font-semibold text-slate-100">Stars</dt>
                        <dd>{repo.stars}</dd>
                      </div>
                      {repo.language && (
                        <div className="flex items-center gap-1">
                          <dt className="font-semibold text-slate-100">
                            Language
                          </dt>
                          <dd>{repo.language}</dd>
                        </div>
                      )}
                      {repo.lastUpdated && (
                        <div className="flex items-center gap-1">
                          <dt className="font-semibold text-slate-100">
                            Last updated
                          </dt>
                          <dd>
                            {new Date(repo.lastUpdated).toLocaleDateString()}
                          </dd>
                        </div>
                      )}
                    </dl>
                    {repo.topics && repo.topics.length > 0 && (
                      <p className="text-[11px] text-slate-400">
                        Topics:{' '}
                        <span className="font-mono">
                          {repo.topics.join(', ')}
                        </span>
                      </p>
                    )}
                  </div>
                </article>
              ),
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-gradient-to-b from-[#111120] to-[#050509] py-6 text-xs text-slate-400">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-3 px-6 sm:flex-row sm:items-center">
          <div>
            <p>{footer.text}</p>
            <p className="mt-1 text-[11px] text-slate-500">
              {footer.subtleText}
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href={footer.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-indigo-300 hover:text-indigo-200"
            >
              {footer.githubLabel}
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
