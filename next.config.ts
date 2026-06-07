import type { NextConfig } from "next"
import createMDX from "@next/mdx"

const nextConfig: NextConfig = {
  output: "standalone",
  // Allow .md / .mdx files to act as routes and be imported as content.
  pageExtensions: ["ts", "tsx", "md", "mdx"],
}

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    // Turbopack (the default bundler in Next 16) requires plugins to be
    // referenced by string name with JSON-serializable options only.
    remarkPlugins: ["remark-gfm", "remark-frontmatter"],
    rehypePlugins: [
      ["rehype-pretty-code", { theme: "github-dark", keepBackground: false }],
      "rehype-slug",
      [
        "rehype-autolink-headings",
        {
          behavior: "append",
          properties: {
            className: ["heading-anchor"],
            ariaLabel: "Permalink to this section",
          },
          content: {
            type: "element",
            tagName: "span",
            properties: {},
            children: [{ type: "text", value: "#" }],
          },
        },
      ],
    ],
  },
})

export default withMDX(nextConfig)
