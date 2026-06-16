"use client"

import { personal } from "@/data/portfolio"

const NAV_LINKS = [
  { href: "#experience",    label: "Experience"    },
  { href: "#projects",      label: "Projects"      },
  { href: "#skills",        label: "Skills"        },
  { href: "/writing",       label: "Writing"       },
  { href: "#contact",       label: "Contact"       },
]

export default function Nav() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{
        backgroundColor: "color-mix(in srgb, var(--canvas) 82%, transparent)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: "0 1px 0 0 var(--line)",
      }}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-8">
        <a
          href="#"
          className="flex h-10 w-10 items-center justify-center rounded-full font-serif text-sm font-black tracking-tight border transition-all hover:opacity-70"
          style={{ 
            color: "var(--ink)", 
            borderColor: "var(--line)",
            backgroundColor: "var(--surface)"
          }}
        >
          {personal.initials}
        </a>

        <ul className="hidden items-center gap-8 sm:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative pb-0.5 text-sm font-medium"
                style={{ color: "var(--muted)" }}
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-0 h-px w-0 transition-[width] duration-300 group-hover:w-full"
                  style={{ backgroundColor: "var(--accent)" }}
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
