import { personal } from "@/data/portfolio"
import SectionHeader from "@/components/SectionHeader"

export default function Contact() {
  return (
    <section id="contact" className="px-8 py-24 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="05" title="Contact" />

        <div className="mt-20">
          <h2
            className="font-serif font-black tracking-tighter"
            style={{ lineHeight: 0.9 }}
          >
            <span
              className="block"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                color: "var(--ink)",
              }}
            >
              Open to
            </span>
            <span
              className="block"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                color: "transparent",
                WebkitTextStroke: "1px var(--accent)",
              }}
            >
              new work.
            </span>
          </h2>

          <p className="mt-6 text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>
            Full-time · Part-time · Freelance
          </p>

          {/* Divider */}
          <div className="mt-12 h-px w-full" style={{ backgroundColor: "var(--line)" }} />

          {/* Email + socials row */}
          <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <a
              href={`mailto:${personal.email}`}
              className="group inline-flex items-center gap-3 font-semibold transition-all hover:gap-5"
              style={{
                fontSize: "clamp(1rem, 2.2vw, 1.4rem)",
                color: "var(--ink)",
                textDecoration: "underline",
                textUnderlineOffset: "6px",
                textDecorationColor: "var(--accent)",
              }}
            >
              Email
              <span
                className="text-2xl transition-transform duration-300 group-hover:translate-x-1.5"
                style={{ color: "var(--accent)" }}
                aria-hidden
              >
                ↗︎
              </span>
            </a>

            <div className="flex flex-wrap gap-3">
              {[
                { href: personal.github,   label: "GitHub"    },
                { href: personal.linkedin, label: "LinkedIn"  },
              ].map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border px-5 py-2 text-[11px] font-black uppercase tracking-widest transition-all hover:opacity-60"
                  style={{ borderColor: "var(--line)", color: "var(--muted)" }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="mt-24 flex items-center justify-between border-t pt-8 text-[11px] font-bold uppercase tracking-widest"
          style={{ borderColor: "var(--line)", color: "var(--muted)" }}
        >
          <span>© {new Date().getFullYear()} {personal.name}</span>
          <span>{personal.location}</span>
        </div>
      </div>
    </section>
  )
}
