import type { Metadata } from "next"
import Link from "next/link"
import { jakarta, lora } from "@/lib/fonts"
import "../globals.css"

export const metadata: Metadata = {
  title: "System Design — Pradeep Kancharla",
  description:
    "System design practice and write-ups by Pradeep Kancharla — architecture, trade-offs, and back-of-the-envelope thinking.",
}

/**
 * Separate root layout for the reading-focused blog. Deliberately omits the
 * portfolio's animated blobs, film-grain, vignette and paper-texture overlays
 * so long technical posts read cleanly.
 */
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${lora.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen antialiased" style={{ backgroundColor: "var(--canvas)" }}>
        <header
          className="sticky top-0 z-50"
          style={{
            backgroundColor: "color-mix(in srgb, var(--canvas) 82%, transparent)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "0 1px 0 0 var(--line)",
          }}
        >
          <nav className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
            <a
              href="https://rxnova.dev"
              className="text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: "var(--muted)" }}
            >
              ← rxnova.dev
            </a>
            <Link
              href="/system-design"
              className="font-serif text-sm font-black tracking-tight transition-opacity hover:opacity-70"
              style={{ color: "var(--ink)" }}
            >
              System Design
            </Link>
          </nav>
        </header>

        {children}
      </body>
    </html>
  )
}
