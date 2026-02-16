type PhilosophyCard = {
  title: string
  body: string
}

type Philosophy = {
  title: string
  body: string
  cards: PhilosophyCard[]
}

type PhilosophySectionProps = {
  philosophy: Philosophy
}

function PhilosophySection({ philosophy }: PhilosophySectionProps) {
  return (
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
          {philosophy.cards.map((card) => (
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
          ))}
        </div>
      </div>
    </section>
  )
}

export default PhilosophySection

