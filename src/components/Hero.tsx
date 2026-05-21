import { personal } from "@/data/portfolio"
import TechSphere from "./TechSphere"

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden px-8 pt-16">
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-between">

        {/* Location */}
        <div className="mt-10 flex items-center gap-2.5">
          <span
            className="h-2 w-2 flex-shrink-0 rounded-full"
            style={{ backgroundColor: "#22c55e", boxShadow: "0 0 0 4px rgba(34,197,94,0.12)" }}
            aria-hidden
          />
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {personal.location}
          </p>
        </div>

        {/* Name + Sphere Row */}
        <div className="flex-1 flex flex-col items-center gap-8 sm:flex-row sm:justify-between py-4">
          <h1
            className="font-serif font-black tracking-tighter"
            style={{ lineHeight: 0.88 }}
          >
            <span
              className="block"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                color: "var(--ink)",
              }}
            >
              Pradeep
            </span>
            <span
              className="block"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                color: "transparent",
                WebkitTextStroke: "1px var(--ink)",
              }}
            >
              Kancharla
            </span>
          </h1>

          <div className="w-full max-w-sm h-[250px] sm:h-[350px]">
            <TechSphere />
          </div>
        </div>

        {/* Bottom row */}
        <div className="pb-10">
          <div className="h-px w-full mb-8" style={{ backgroundColor: "var(--line)" }} />

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-[11px] font-black uppercase tracking-[0.25em]"
                style={{ color: "var(--accent)" }}
              >
                {personal.role}&ensp;·&ensp;{personal.title}
              </p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {personal.tagline}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-black transition-all hover:opacity-85 active:scale-[0.97]"
                style={{ backgroundColor: "var(--ink)", color: "var(--canvas)" }}
              >
                View work <span aria-hidden>↗︎</span>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center rounded-full border px-6 py-3 text-sm font-black transition-all hover:opacity-60"
                style={{ borderColor: "var(--line)", color: "var(--ink)" }}
              >
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
