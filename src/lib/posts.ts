import { allPosts, type GeneratedPost } from "@/content/system-design/posts.generated"

/**
 * Read-side helpers for the /system-design MDX blog.
 *
 * Post discovery, metadata, and headings come from a bundled manifest
 * (posts.generated.ts, produced by scripts/generate-posts.mjs). Nothing here
 * touches the filesystem, so it works identically at build time and on the
 * Cloudflare Workers runtime. MDX bodies are loaded separately via a bundled
 * dynamic import in the page component.
 */

export type Heading = GeneratedPost["headings"][number]

export type PostMeta = Omit<GeneratedPost, "headings">

export function getAllPosts(): PostMeta[] {
  return allPosts
    .filter((p) => !p.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .map(({ headings: _headings, ...meta }) => meta)
}

export function getPostMeta(slug: string): PostMeta | undefined {
  const post = allPosts.find((p) => p.slug === slug)
  if (!post) return undefined
  const { headings: _headings, ...meta } = post
  return meta
}

export function getHeadings(slug: string): Heading[] {
  return allPosts.find((p) => p.slug === slug)?.headings ?? []
}
