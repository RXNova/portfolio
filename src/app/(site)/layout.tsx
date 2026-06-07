import type { Metadata } from "next"
import { ThemeProvider } from "@/components/ThemeProvider"
import Nav from "@/components/Nav"
import { jakarta, lora } from "@/lib/fonts"
import "../globals.css"

export const metadata: Metadata = {
  title: "Pradeep Kancharla — Senior Software Engineer & Frontend Lead",
  description:
    "Portfolio of Pradeep Kancharla. 9+ years building fast, accessible, and beautiful web products. Based in Berlin.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${lora.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen antialiased">

        {/* ── Animated blobs: z:0 — above body bg, below content ── */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />
          <div className="bg-orb bg-orb-3" />
        </div>

        {/* ── All page content: z:1 — above blobs ── */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <ThemeProvider>
            <Nav />
            {children}
          </ThemeProvider>
        </div>

        {/* ── Vignette: z:9996 — edge darkening for paper depth ── */}
        <div
          aria-hidden="true"
          className="vignette-overlay"
          style={{ position: "fixed", inset: 0, zIndex: 9996, pointerEvents: "none" }}
        />

        {/* ── Paper texture: z:9997 — directional fiber noise ── */}
        <div
          aria-hidden="true"
          className="texture-overlay"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9997,
            pointerEvents: "none",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.60 0.78' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='500' height='500' filter='url(%23p)'/%3E%3C/svg%3E\")",
            backgroundSize: "500px 500px",
          }}
        />

        {/* ── Film-grain overlay: z:9998 — above everything ── */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            pointerEvents: "none",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "300px 300px",
            opacity: 0.032,
            mixBlendMode: "overlay",
          }}
        />
      </body>
    </html>
  )
}
