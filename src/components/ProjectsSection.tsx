import RepoCard from './RepoCard'

type ProjectRepo = {
  name: string
  description: string
  url: string
  stars: number
  language?: string | null
  topics?: string[]
  lastUpdated?: string
}

type Projects = {
  title: string
  body: string
  repos: ProjectRepo[]
}

type ProjectsSectionProps = {
  projects: Projects
}

function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      className="border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-[#050509]"
      aria-labelledby="projects-title"
    >
      <div className="mx-auto max-w-5xl px-6">
        <header className="mb-8 max-w-2xl">
          <h2
            id="projects-title"
            className="mb-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-600 dark:text-slate-300"
          >
            {projects.title}
          </h2>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {projects.body}
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {projects.repos.map((repo) => (
            <RepoCard key={repo.url} repo={repo} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection

