type BriefInfo = {
  title: string
  content: string
}

type AboutSectionProps = {
  briefInfo: BriefInfo | null
}

function AboutSection({ briefInfo }: AboutSectionProps) {
  if (!briefInfo) {
    return null
  }

  return (
    <section
      id="about"
      className="border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-[#050509]"
      aria-labelledby="about-title"
    >
      <div className="mx-auto max-w-5xl px-6">
        <header className="mb-8 max-w-2xl">
          <h2
            id="about-title"
            className="mb-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-600 dark:text-slate-300"
          >
            {briefInfo.title}
          </h2>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {briefInfo.content}
          </p>
        </header>
      </div>
    </section>
  )
}

export default AboutSection
