import { useId } from 'react'

/* Dark input field matching the design system. */
export default function Field({ label, type = 'text', value, onChange, placeholder, autoComplete, required }) {
  const id = useId()
  return (
    <label htmlFor={id} className="block">
      <span className="font-util mb-2 block text-[11px] uppercase tracking-[0.2em] text-faint">
        {label}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="w-full border border-line bg-ink px-4 py-3 text-[15px] text-bone placeholder:text-faint focus:border-blood focus:outline-none focus:ring-0"
      />
    </label>
  )
}
