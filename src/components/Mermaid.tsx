"use client"

import { useEffect, useId, useRef, useState } from "react"

/**
 * Client-only Mermaid renderer. Mermaid needs the DOM, so it can't run at
 * build time on the Workers target — it's dynamically imported here and only
 * loaded on pages that actually use a diagram.
 *
 * Usage inside MDX:  <Mermaid chart={`flowchart LR\n  A --> B`} />
 */
export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reactId = useId()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default
        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          securityLevel: "strict",
          fontFamily: "var(--font-jakarta, system-ui, sans-serif)",
        })
        // Mermaid ids must be valid CSS selectors — useId contains ':'.
        const id = `mermaid-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`
        const { svg } = await mermaid.render(id, chart)
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to render diagram")
        }
      }
    }

    render()
    return () => {
      cancelled = true
    }
  }, [chart, reactId])

  if (error) {
    return (
      <pre
        className="overflow-x-auto rounded-md p-4 text-sm"
        style={{
          backgroundColor: "var(--surface)",
          color: "var(--muted)",
          border: "1px solid var(--line)",
        }}
      >
        Diagram error: {error}
        {"\n\n"}
        {chart}
      </pre>
    )
  }

  return (
    <div
      ref={ref}
      className="my-8 flex justify-center overflow-x-auto"
      role="img"
      aria-label="Diagram"
    />
  )
}
