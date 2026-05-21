import { notFound } from "next/navigation"
import Link from "next/link"
import { articles } from "@/data/articles"
import type { Metadata } from "next"

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = articles.find((a) => a.slug === slug)
  if (!article) return {}
  return {
    title: `${article.title} — Pradeep Kancharla`,
    description: article.excerpt,
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = articles.find((a) => a.slug === slug)
  if (!article) notFound()

  return (
    <main className="min-h-screen px-8 py-20 md:py-28" style={{ position: "relative", zIndex: 1 }}>
      <div className="mx-auto max-w-2xl">
        {/* Back link */}
        <Link
          href="/#blog"
          className="mb-12 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] transition-opacity hover:opacity-60"
          style={{ color: "var(--accent)" }}
        >
          ← Writing
        </Link>

        {/* Meta */}
        <div className="mt-8 mb-4 flex items-center gap-4">
          <span
            className="text-[11px] font-black uppercase tracking-widest"
            style={{ color: "var(--accent)" }}
          >
            {article.date}
          </span>
          <span
            className="text-[11px] font-bold uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            {article.readTime} read
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
          style={{ color: "var(--ink)" }}
        >
          {article.title}
        </h1>

        {/* Excerpt */}
        <p
          className="mt-6 text-base leading-relaxed sm:text-lg"
          style={{ color: "var(--muted)" }}
        >
          {article.excerpt}
        </p>

        {/* Cover image */}
        {article.coverImage && (
          <div className="mt-10 overflow-hidden rounded-lg border" style={{ borderColor: "var(--line)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full object-cover"
              style={{ maxHeight: "400px" }}
            />
          </div>
        )}

        {/* Divider */}
        <div className="mt-12 mb-12 h-px w-full" style={{ backgroundColor: "var(--line)" }} />

        {/* Sections */}
        <div className="space-y-10">
          {article.sections.map((section, i) => (
            <div key={i}>
              {section.heading && (
                <h2
                  className="mb-4 font-serif text-xl font-bold sm:text-2xl"
                  style={{ color: "var(--ink)" }}
                >
                  {section.heading}
                </h2>
              )}
              <p
                className="text-base leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Tech pills */}
        <div className="mt-12 flex flex-wrap gap-2">
          {article.tech.map((t) => (
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

        {/* External links */}
        {article.links.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-4">
            {article.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold transition-opacity hover:opacity-60"
                style={{ color: "var(--accent)" }}
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        )}

        {/* Footer divider */}
        <div className="mt-16 border-t pt-8" style={{ borderColor: "var(--line)" }}>
          <Link
            href="/#blog"
            className="text-[11px] font-black uppercase tracking-[0.25em] transition-opacity hover:opacity-60"
            style={{ color: "var(--accent)" }}
          >
            ← All Writing
          </Link>
        </div>
      </div>
    </main>
  )
}
