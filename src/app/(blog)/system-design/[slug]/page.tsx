import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getAllPosts, getPostMeta, getHeadings } from "@/lib/posts"

export const dynamicParams = false

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const meta = getPostMeta(slug)
  if (!meta) return {}
  return {
    title: `${meta.title} — System Design`,
    description: meta.excerpt,
  }
}

function formatDate(date: string): string {
  const d = new Date(date)
  if (isNaN(+d)) return date
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const meta = getPostMeta(slug)
  if (!meta) notFound()
  const headings = getHeadings(slug)
  const { default: Post } = await import(`@/content/system-design/${slug}.mdx`)

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12">
        {/* Article column */}
        <article className="mx-auto w-full max-w-3xl lg:mx-0">
          <Link
            href="/system-design"
            className="text-[11px] font-black uppercase tracking-[0.25em] transition-opacity hover:opacity-60"
            style={{ color: "var(--accent)" }}
          >
            ← System Design
          </Link>

          <div className="mt-8 mb-4 flex items-center gap-4">
            <span
              className="text-[11px] font-black uppercase tracking-widest"
              style={{ color: "var(--accent)" }}
            >
              {formatDate(meta.date)}
            </span>
            {meta.tags?.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-bold uppercase tracking-widest"
                style={{ color: "var(--muted)" }}
              >
                {tag}
              </span>
            ))}
          </div>

          <h1
            className="font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
            style={{ color: "var(--ink)" }}
          >
            {meta.title}
          </h1>

          {meta.excerpt && (
            <p className="mt-5 text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
              {meta.excerpt}
            </p>
          )}

          {/* Mobile TOC */}
          {headings.length > 0 && (
            <details
              className="mt-8 rounded-lg border p-4 lg:hidden"
              style={{ borderColor: "var(--line)" }}
            >
              <summary
                className="cursor-pointer text-[11px] font-black uppercase tracking-[0.2em]"
                style={{ color: "var(--muted)" }}
              >
                On this page
              </summary>
              <Toc headings={headings} />
            </details>
          )}

          <div className="mt-10 mb-12 h-px w-full" style={{ backgroundColor: "var(--line)" }} />

          <Post />

          <div className="mt-16 border-t pt-8" style={{ borderColor: "var(--line)" }}>
            <Link
              href="/system-design"
              className="text-[11px] font-black uppercase tracking-[0.25em] transition-opacity hover:opacity-60"
              style={{ color: "var(--accent)" }}
            >
              ← All posts
            </Link>
          </div>
        </article>

        {/* Desktop TOC sidebar */}
        {headings.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p
                className="mb-3 text-[11px] font-black uppercase tracking-[0.2em]"
                style={{ color: "var(--muted)" }}
              >
                On this page
              </p>
              <Toc headings={headings} />
            </div>
          </aside>
        )}
      </div>
    </main>
  )
}

function Toc({ headings }: { headings: { depth: number; text: string; slug: string }[] }) {
  return (
    <nav className="mt-3 lg:mt-0">
      <ul className="space-y-2 text-sm">
        {headings.map((h) => (
          <li key={h.slug} style={{ paddingLeft: h.depth === 3 ? "0.875rem" : 0 }}>
            <a
              href={`#${h.slug}`}
              className="block leading-snug transition-colors hover:text-[var(--accent)]"
              style={{ color: "var(--muted)" }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
