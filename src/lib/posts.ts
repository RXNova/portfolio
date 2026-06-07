import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import GithubSlugger from "github-slugger"

/**
 * Build-time helpers for the /system-design MDX blog.
 *
 * Everything here reads the filesystem and therefore only runs during static
 * generation (generateStaticParams / SSG). The pages that use it are fully
 * prerendered, so no `fs` access happens at Workers runtime.
 */

export const POSTS_DIR = path.join(process.cwd(), "src/content/system-design")

export interface PostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  tags?: string[]
  draft?: boolean
}

export interface Heading {
  depth: number
  text: string
  slug: string
}

function readPostFile(slug: string): string {
  return fs.readFileSync(path.join(POSTS_DIR, `${slug}.mdx`), "utf8")
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.mdx$/, "")
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(slugFromFilename)
}

export function getPostMeta(slug: string): PostMeta {
  const { data } = matter(readPostFile(slug))
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    excerpt: data.excerpt ?? "",
    tags: data.tags,
    draft: data.draft ?? false,
  }
}

export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map(getPostMeta)
    .filter((p) => !p.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
}

/**
 * Extract ## / ### headings for the table of contents. Slugs are generated with
 * github-slugger — the same library rehype-slug uses — so TOC links match the
 * ids rendered into the page.
 */
export function getHeadings(slug: string): Heading[] {
  const { content } = matter(readPostFile(slug))
  const slugger = new GithubSlugger()
  const headings: Heading[] = []
  let inFence = false

  for (const line of content.split("\n")) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line)
    if (!match) continue

    const depth = match[1].length
    // Strip basic inline markdown (links, emphasis, inline code) from the text.
    const text = match[2]
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[*_`]/g, "")
      .trim()

    headings.push({ depth, text, slug: slugger.slug(text) })
  }

  return headings
}
