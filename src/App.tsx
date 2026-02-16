import './App.css'
import siteContent from './siteContent.json'

function App() {
  const hero = siteContent.hero
  const snapshot = siteContent.snapshot
  const philosophy = siteContent.philosophy
  const projects = siteContent.projects
  const footer = siteContent.footer

  return (
    <div className="app">
      <header className="site-header">
        <div className="shell header-shell">
          <a
            href="#hero"
            className="brand"
            aria-label={`${hero.title} home`}
          >
            <span className="brand-mark" aria-hidden="true">
              {(hero.title ?? '?').charAt(0).toUpperCase()}
            </span>
            <span className="brand-text">
              {hero.title}
            </span>
          </a>
          <nav className="site-nav" aria-label="Primary">
            <a href="#philosophy">Philosophy</a>
            <a href="#projects">Projects</a>
            <a href={footer.githubUrl} target="_blank" rel="noreferrer">
              {footer.githubLabel}
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section id="hero" className="hero" aria-labelledby="hero-title">
          <div className="shell hero-shell">
            <div className="hero-copy">
              <p className="eyebrow">{hero.eyebrow}</p>
              <h1 id="hero-title">{hero.title}</h1>
              <p className="hero-lead">{hero.description}</p>
              <div className="hero-actions">
                <a
                  className="button primary"
                  href={hero.primaryCtaHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  {hero.primaryCtaLabel}
                </a>
                <p className="action-caption">
                  {hero.caption}
                </p>
              </div>
            </div>

            <aside className="hero-aside" aria-label="Profile summary">
              <div className="hero-panel">
                <h2>{snapshot.title}</h2>
                <ul>
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
          className="section section-philosophy"
          aria-labelledby="philosophy-title"
        >
          <div className="shell">
            <header className="section-header">
              <h2 id="philosophy-title">{philosophy.title}</h2>
              <p>{philosophy.body}</p>
            </header>

            <div className="grid">
              {philosophy.cards.map(
                (card: { title: string; body: string }) => (
                  <article key={card.title} className="card">
                    <h3>{card.title}</h3>
                    <p>{card.body}</p>
                  </article>
                ),
              )}
            </div>
          </div>
        </section>

        <section
          id="projects"
          className="section section-projects"
          aria-labelledby="projects-title"
        >
          <div className="shell">
            <header className="section-header">
              <h2 id="projects-title">{projects.title}</h2>
              <p>{projects.body}</p>
            </header>

            <div className="projects-grid">
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
                  className="project-card"
                  aria-label={`Repository ${repo.name}`}
                >
                  <header className="project-header">
                    <div>
                      <h3>{repo.name}</h3>
                      <p className="project-tagline">
                        {repo.description ?? 'Repository on GitHub.'}
                      </p>
                    </div>
                    <a
                      className="button ghost"
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View repo
                    </a>
                  </header>

                  <div className="project-body">
                    <dl className="repo-meta" aria-label="Repository metadata">
                      <div>
                        <dt>Stars</dt>
                        <dd>{repo.stars}</dd>
                      </div>
                      {repo.language && (
                        <div>
                          <dt>Language</dt>
                          <dd>{repo.language}</dd>
                        </div>
                      )}
                      {repo.lastUpdated && (
                        <div>
                          <dt>Last updated</dt>
                          <dd>
                            {new Date(repo.lastUpdated).toLocaleDateString()}
                          </dd>
                        </div>
                      )}
                    </dl>
                    {repo.topics && repo.topics.length > 0 && (
                      <p className="repo-topics">
                        Topics: <span>{repo.topics.join(', ')}</span>
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

      <footer className="site-footer">
        <div className="shell footer-shell">
          <div className="footer-meta">
            <p>
              {footer.text}
            </p>
            <p className="footer-subtle">
              {footer.subtleText}
            </p>
          </div>
          <div className="footer-links">
            <a
              href={footer.githubUrl}
              target="_blank"
              rel="noreferrer"
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
