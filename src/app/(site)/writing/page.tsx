import Link from "next/link"
import type { Metadata } from "next"
import { articles } from "@/data/articles"

export const metadata: Metadata = {
  title: "Writing — Pradeep Kancharla",
  description:
    "Articles and frontend system design write-ups by Pradeep Kancharla — building fast, accessible web products.",
}

export default function WritingIndex() {
  return (
    <main className="min-h-screen px-8 py-20 md:py-28" style={{ position: "relative", zIndex: 1 }}>
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] transition-opacity hover:opacity-60"
          style={{ color: "var(--accent)" }}
        >
          ← Home
        </Link>

        {/* Title */}
        <h1
          className="mt-8 font-serif text-4xl font-bold leading-tight sm:text-5xl"
          style={{ color: "var(--ink)" }}
        >
          Writing
        </h1>
        <p
          className="mt-4 text-base leading-relaxed sm:text-lg"
          style={{ color: "var(--muted)" }}
        >
          Notes on shipping products, plus frontend system design write-ups.
        </p>

        {/* Article list */}
        <div className="mt-12">
          {articles.map((post, i) => (
            <Link
              key={i}
              href={`/writing/${post.slug}`}
              className="group grid items-center gap-y-1 border-t py-8
                         md:grid-cols-[90px_1fr_70px] md:gap-x-10"
              style={{ borderColor: "var(--line)" }}
            >
              <p
                className="text-[11px] font-black uppercase tracking-widest"
                style={{ color: "var(--accent)" }}
              >
                {post.date}
              </p>

              <p
                className="text-base font-semibold sm:text-lg"
                style={{ color: "var(--ink)" }}
              >
                <span className="underline-offset-4 decoration-[var(--accent)] group-hover:underline">
                  {post.title}
                </span>
              </p>

              <p
                className="text-[11px] font-bold uppercase tracking-widest md:text-right"
                style={{ color: "var(--muted)" }}
              >
                {post.readTime}
                <span
                  className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden
                >
                  →
                </span>
              </p>
            </Link>
          ))}
          <div className="border-t" style={{ borderColor: "var(--line)" }} />
        </div>
      </div>
    </main>
  )
}
