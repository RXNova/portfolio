import type { MDXComponents } from "mdx/types"
import type { ComponentPropsWithoutRef } from "react"
import Mermaid from "@/components/Mermaid"

/**
 * Global MDX component mapping. Elements are hand-styled with the site's CSS
 * vars (--ink / --muted / --accent / --line / --surface) so MDX content matches
 * the clean reading theme without pulling in @tailwindcss/typography.
 *
 * Code blocks are already turned into styled markup at build time by
 * rehype-pretty-code (Shiki); here we only add container chrome.
 *
 * `Mermaid` is exposed so .mdx files can use <Mermaid chart={`...`} /> directly.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <h1
        className="mt-2 mb-6 font-serif text-3xl font-bold leading-tight sm:text-4xl"
        style={{ color: "var(--ink)" }}
        {...props}
      />
    ),
    h2: (props) => (
      <h2
        className="group mt-14 mb-4 scroll-mt-24 font-serif text-2xl font-bold sm:text-3xl"
        style={{ color: "var(--ink)" }}
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        className="group mt-10 mb-3 scroll-mt-24 font-serif text-xl font-bold sm:text-2xl"
        style={{ color: "var(--ink)" }}
        {...props}
      />
    ),
    p: (props) => (
      <p
        className="my-5 text-[1.05rem] leading-relaxed"
        style={{ color: "var(--muted)" }}
        {...props}
      />
    ),
    ul: (props) => (
      <ul
        className="my-5 list-disc space-y-2 pl-6 text-[1.05rem] leading-relaxed"
        style={{ color: "var(--muted)" }}
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="my-5 list-decimal space-y-2 pl-6 text-[1.05rem] leading-relaxed"
        style={{ color: "var(--muted)" }}
        {...props}
      />
    ),
    li: (props) => <li className="pl-1.5" {...props} />,
    a: ({ className, ...props }: ComponentPropsWithoutRef<"a">) => {
      // The "#" permalinks injected by rehype-autolink-headings are styled via
      // the .heading-anchor rule in globals.css — leave them alone.
      if (className?.includes("heading-anchor")) {
        return <a className={className} {...props} />
      }
      return (
        <a
          className={`font-medium underline underline-offset-4 transition-opacity hover:opacity-70 ${className ?? ""}`}
          style={{ color: "var(--accent)", textDecorationColor: "var(--fade)" }}
          {...props}
        />
      )
    },
    blockquote: (props) => (
      <blockquote
        className="my-6 border-l-2 pl-5 italic"
        style={{ borderColor: "var(--accent)", color: "var(--muted)" }}
        {...props}
      />
    ),
    hr: (props) => (
      <hr className="my-12" style={{ borderColor: "var(--line)" }} {...props} />
    ),
    table: (props) => (
      <div className="my-6 overflow-x-auto">
        <table
          className="w-full border-collapse text-left text-sm"
          style={{ color: "var(--muted)" }}
          {...props}
        />
      </div>
    ),
    th: (props) => (
      <th
        className="border-b px-3 py-2 font-semibold"
        style={{ borderColor: "var(--line)", color: "var(--ink)" }}
        {...props}
      />
    ),
    td: (props) => (
      <td className="border-b px-3 py-2 align-top" style={{ borderColor: "var(--line)" }} {...props} />
    ),
    // Inline code (rehype-pretty-code leaves these as plain <code>).
    code: ({ className, ...props }: ComponentPropsWithoutRef<"code">) => {
      const isBlock = className?.includes("language-") || className?.includes("[data-")
      if (isBlock) return <code className={className} {...props} />
      return (
        <code
          className={`rounded px-1.5 py-0.5 text-[0.9em] ${className ?? ""}`}
          style={{
            backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)",
            color: "var(--ink)",
          }}
          {...props}
        />
      )
    },
    pre: (props) => (
      <pre
        className="my-6 overflow-x-auto rounded-lg p-4 text-sm leading-relaxed"
        style={{ backgroundColor: "#0d1117", border: "1px solid var(--line)" }}
        {...props}
      />
    ),
    Mermaid,
    ...components,
  }
}
