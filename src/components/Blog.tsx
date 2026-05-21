import { articles } from "@/data/articles"
import SectionHeader from "@/components/SectionHeader"

export default function Blog() {
  return (
    <section
      id="blog"
      className="px-8 py-24 md:py-32"
      style={{ backgroundColor: "var(--surface)" }}
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="04" title="Writing" />

        <div className="mt-12">
          {articles.map((post, i) => (
            <a
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
                <span
                  className="underline-offset-4 decoration-[var(--accent)] group-hover:underline"
                >
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
            </a>
          ))}
          <div className="border-t" style={{ borderColor: "var(--line)" }} />
        </div>
      </div>
    </section>
  )
}
