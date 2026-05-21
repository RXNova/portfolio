import { experience } from "@/data/portfolio"
import SectionHeader from "@/components/SectionHeader"

export default function Experience() {
  return (
    <section id="experience" className="px-8 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="01" title="Experience" />

        <div className="mt-12">
          {experience.map((job, i) => (
            <article key={i} className="border-t pt-4 pb-16" style={{ borderColor: "var(--line)" }}>
              {/* Big ordinal */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className="font-serif font-black leading-none tabular-nums"
                  style={{
                    fontSize: "clamp(4rem, 11vw, 8rem)",
                    color: "var(--accent)",
                    opacity: 0.12,
                    lineHeight: 1,
                  }}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium" style={{ color: "var(--muted)" }}>
                  {job.period}
                </span>
              </div>

              {/* Role + company + location */}
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <h3
                    className="font-serif text-2xl font-bold sm:text-3xl"
                    style={{ color: "var(--ink)" }}
                  >
                    {job.role}
                  </h3>
                  <span
                    className="text-base font-medium"
                    style={{ color: "var(--accent)", opacity: 0.7 }}
                  >
                    @
                  </span>
                  <span className="text-lg font-medium" style={{ color: "var(--muted)" }}>
                    {job.company}
                  </span>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                  {job.location}
                </span>
              </div>

              {/* One-line context */}
              {job.summary && (
                <p className="mb-6 text-sm" style={{ color: "var(--ink)", opacity: 0.6 }}>
                  {job.summary}
                </p>
              )}

              {/* Bullets */}
              <ul className="space-y-3 mb-7">
                {job.description.map((point, j) => (
                  <li
                    key={j}
                    className="flex gap-5 text-sm leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    <span
                      className="mt-2 h-px w-6 flex-shrink-0"
                      style={{ backgroundColor: "var(--accent)", opacity: 0.6 }}
                    />
                    {point}
                  </li>
                ))}
              </ul>

              {/* Tech pills */}
              <div className="flex flex-wrap gap-2">
                {job.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-sm px-1.5 py-px text-[9px] font-bold uppercase tracking-wide"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--accent) 8%, transparent)",
                      color: "var(--accent)",
                      border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
          <div className="border-t" style={{ borderColor: "var(--line)" }} />
        </div>
      </div>
    </section>
  )
}
