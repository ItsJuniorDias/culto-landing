/* Small uppercase label with flanking rules. `solo` drops the trailing rule. */
export default function Eyebrow({ children, solo = false, className = '' }) {
  return (
    <span
      className={`font-util inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.32em] text-blood ${className}`}
    >
      <span aria-hidden="true" className="h-px w-6 bg-blood" />
      {children}
      {!solo && <span aria-hidden="true" className="h-px w-6 bg-blood" />}
    </span>
  )
}
