import { personalProjects } from "@/data/portfolio"
import SectionHeader from "@/components/SectionHeader"

export default function Projects() {
  return (
    <section
      id="projects"
      className="px-8 py-24 md:py-32"
      style={{ backgroundColor: "var(--surface)" }}
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="02" title="Projects" />

        <div className="mt-12">
          <div className="flex items-baseline justify-between mb-8 border-b pb-5" style={{ borderColor: "var(--line)" }}>
            <h3 className="font-serif text-2xl font-bold" style={{ color: "var(--ink)" }}>
              Personal
            </h3>
            <a
              href="https://github.com/RXNova"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-black uppercase tracking-[0.25em] transition-opacity hover:opacity-60"
              style={{ color: "var(--accent)" }}
            >
              github.com/rxnova ↗
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {personalProjects.map((project) => (
              <a
                key={project.github ?? project.name}
                href={(project as { live?: string | null }).live ?? project.github ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="project-card group flex flex-col gap-3 rounded-lg border p-5 transition-colors duration-200"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="font-sans text-sm font-bold" style={{ color: "var(--ink)" }}>
                    {project.name}
                  </h4>
                  <span
                    className="flex-shrink-0 text-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    style={{ color: "var(--accent)" }}
                    aria-hidden
                  >
                    ↗
                  </span>
                </div>
                <p className="flex-1 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--accent) 8%, transparent)",
                        color: "var(--accent)",
                        border: "1px solid color-mix(in srgb, var(--accent) 22%, transparent)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
