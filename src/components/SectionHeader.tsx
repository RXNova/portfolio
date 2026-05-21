export default function SectionHeader({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-baseline justify-between border-b pb-5" style={{ borderColor: "var(--line)" }}>
      <h2 className="font-serif text-3xl font-bold sm:text-4xl" style={{ color: "var(--ink)" }}>
        {title}
      </h2>
      <span className="text-[11px] font-black uppercase tracking-[0.25em]" style={{ color: "var(--accent)" }}>
        {index}
      </span>
    </div>
  )
}
