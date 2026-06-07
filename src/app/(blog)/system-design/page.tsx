import Link from "next/link"
import type { Metadata } from "next"
import { getAllPosts } from "@/lib/posts"

export const metadata: Metadata = {
  title: "System Design — Pradeep Kancharla",
  description:
    "System design practice and write-ups: architecture, trade-offs, and back-of-the-envelope thinking.",
}

function formatDate(date: string): string {
  const d = new Date(date)
  if (isNaN(+d)) return date
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

export default function SystemDesignIndex() {
  const posts = getAllPosts()

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <header className="mb-14">
        <h1
          className="font-serif text-4xl font-bold leading-tight sm:text-5xl"
          style={{ color: "var(--ink)" }}
        >
          System Design
        </h1>
        <p className="mt-4 text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
          Practice problems, architecture write-ups, and the trade-offs behind them.
        </p>
      </header>

      {posts.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No posts yet — check back soon.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/system-design/${post.slug}`}
                className="group block border-t py-8 transition-colors"
                style={{ borderColor: "var(--line)" }}
              >
                <p
                  className="text-[11px] font-black uppercase tracking-widest"
                  style={{ color: "var(--accent)" }}
                >
                  {formatDate(post.date)}
                </p>
                <h2
                  className="mt-2 font-serif text-xl font-bold sm:text-2xl"
                  style={{ color: "var(--ink)" }}
                >
                  <span className="underline-offset-4 decoration-[var(--accent)] group-hover:underline">
                    {post.title}
                  </span>
                </h2>
                <p className="mt-2 leading-relaxed" style={{ color: "var(--muted)" }}>
                  {post.excerpt}
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-sm px-1.5 py-px text-[9px] font-bold uppercase tracking-wide"
                        style={{
                          backgroundColor: "color-mix(in srgb, var(--accent) 8%, transparent)",
                          color: "var(--accent)",
                          border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
          <li className="border-t" style={{ borderColor: "var(--line)" }} />
        </ul>
      )}
    </main>
  )
}
