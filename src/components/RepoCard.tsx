type Repo = {
  name: string
  description: string
  url: string
  stars: number
  language?: string | null
  topics?: string[]
  lastUpdated?: string
}

type RepoCardProps = {
  repo: Repo
}

function RepoCard({ repo }: RepoCardProps) {
  return (
    <article
      className="flex flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-[#181829] to-[#0a0a13] p-5 text-sm text-slate-200 shadow-[0_18px_45px_rgba(0,0,0,0.8)]"
      aria-label={`Repository ${repo.name}`}
    >
      <header className="mb-3 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-slate-50">{repo.name}</h3>
          <p className="text-[13px] text-slate-300">
            {repo.description ?? 'Repository on GitHub.'}
          </p>
        </div>
        <a
          className="inline-flex items-center justify-center rounded-full bg-slate-900/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-100 ring-1 ring-slate-500/50 transition hover:bg-slate-900 hover:text-white hover:ring-indigo-400/80"
          href={repo.url}
          target="_blank"
          rel="noreferrer"
        >
          View
        </a>
      </header>

      <div className="mt-2 space-y-2 text-[12px] text-slate-300">
        <dl
          className="flex flex-wrap gap-x-4 gap-y-1"
          aria-label="Repository metadata"
        >
          <div className="flex items-center gap-1">
            <dt className="font-semibold text-slate-100">Stars</dt>
            <dd>{repo.stars}</dd>
          </div>
          {repo.language && (
            <div className="flex items-center gap-1">
              <dt className="font-semibold text-slate-100">Language</dt>
              <dd>{repo.language}</dd>
            </div>
          )}
          {repo.lastUpdated && (
            <div className="flex items-center gap-1">
              <dt className="font-semibold text-slate-100">Last updated</dt>
              <dd>{new Date(repo.lastUpdated).toLocaleDateString()}</dd>
            </div>
          )}
        </dl>
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {repo.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-indigo-400/40 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-indigo-200"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

export default RepoCard

