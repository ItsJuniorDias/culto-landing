import { useId } from 'react'

// Input do checkout: rótulo util maiúsculo, erro inline em blood-2, suporte a
// adorno à direita (ex.: bandeira do cartão) e a um hint discreto no rótulo.
// Cantos retos e foco blood, igual ao resto do design system.
export default function CheckoutInput({
  label,
  value,
  onChange,
  onBlur,
  error,
  show, // mostra o erro (normalmente "campo tocado")
  hint,
  right,
  type = 'text',
  inputMode,
  autoComplete,
  placeholder,
  maxLength,
  name,
}) {
  const id = useId()
  const invalid = Boolean(show && error)

  return (
    <label htmlFor={id} className="block">
      <span className="font-util mb-2 flex items-baseline justify-between gap-3 text-[11px] uppercase tracking-[0.2em] text-faint">
        <span>{label}</span>
        {hint && <span className="tracking-[0.08em] text-faint/70">{hint}</span>}
      </span>

      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          maxLength={maxLength}
          aria-invalid={invalid || undefined}
          className={`w-full border bg-ink px-4 py-3 text-[15px] text-bone placeholder:text-faint/70 focus:outline-none focus:ring-0 ${
            invalid ? 'border-blood' : 'border-line focus:border-blood'
          } ${right ? 'pr-16' : ''}`}
        />
        {right && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            {right}
          </span>
        )}
      </div>

      {invalid && (
        <span className="font-util mt-1.5 block text-[11px] uppercase tracking-[0.1em] text-blood-2">
          {error}
        </span>
      )}
    </label>
  )
}
