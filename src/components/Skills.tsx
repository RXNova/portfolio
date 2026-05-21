import { skills } from "@/data/portfolio"
import SectionHeader from "@/components/SectionHeader"

export default function Skills() {
  return (
    <section id="skills" className="px-8 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="03" title="Skills" />

        <div className="mt-12 divide-y" style={{ borderColor: "var(--line)" }}>
          {Object.entries(skills).map(([category, items]) => (
            <div
              key={category}
              className="flex flex-col gap-5 py-8 sm:flex-row sm:gap-16"
            >
              <p
                className="w-36 flex-shrink-0 pt-1 text-[11px] font-black uppercase tracking-[0.25em]"
                style={{ color: "var(--accent)" }}
              >
                {category}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border px-4 py-2 text-sm font-medium"
                    style={{
                      borderColor: "var(--line)",
                      color: "var(--ink)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
