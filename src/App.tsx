import siteContent from './siteContent.json'
import HeroSection from './components/HeroSection'
import PhilosophySection from './components/PhilosophySection'
import ProjectsSection from './components/ProjectsSection'

function App() {
  const { hero, snapshot, philosophy, projects, footer } = siteContent

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
        <HeroSection hero={hero} snapshot={snapshot} />
        <PhilosophySection philosophy={philosophy} />
        <ProjectsSection projects={projects} />
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
