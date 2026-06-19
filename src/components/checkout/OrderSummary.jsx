import { formatBRL } from '../../lib/money'
import { Lock, Check } from './icons'

const BRANDS = ['Visa', 'Mastercard', 'Amex', 'Elo', 'Pix']

// Resumo do pedido (coluna direita no desktop / bloco recolhível no mobile).
// Recebe tudo pronto da página — não calcula preço sozinho.
export default function OrderSummary({
  pack,
  subtotal,
  discount,
  total,
  couponInput,
  onCouponInputChange,
  appliedCoupon,
  couponError,
  onApplyCoupon,
  onRemoveCoupon,
  installmentLabel,
}) {
  const includes = (pack.includes || []).slice(0, 4)

  return (
    <div className="border border-line bg-panel">
      {/* pack */}
      <div className="flex gap-4 border-b border-line p-5">
        <div className="h-[72px] w-[72px] shrink-0 overflow-hidden border border-line bg-ink">
          {pack.thumb && (
            <img src={pack.thumb} alt="" className="h-full w-full object-cover object-top" />
          )}
        </div>
        <div className="min-w-0">
          <span className="font-util text-[10px] uppercase tracking-[0.2em] text-blood">
            {pack.kind}
          </span>
          <h3 className="font-display mt-0.5 text-[22px] font-extrabold leading-[0.95]">
            {pack.title}
          </h3>
          <span className="font-util mt-1 inline-block text-[10px] uppercase tracking-[0.16em] text-faint">
            Acesso vitalício · download imediato
          </span>
        </div>
      </div>

      {/* inclui */}
      {includes.length > 0 && (
        <ul className="space-y-2 border-b border-line p-5">
          {includes.map((item) => (
            <li key={item} className="flex gap-2.5 text-[13px] text-ash">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blood" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {/* cupom */}
      <div className="border-b border-line p-5">
        {appliedCoupon ? (
          <div className="flex items-center justify-between gap-3 border border-blood/40 bg-blood/10 px-3 py-2.5">
            <span className="font-util text-[11px] uppercase tracking-[0.14em] text-bone">
              <span className="text-blood-2">{appliedCoupon.code}</span> · {appliedCoupon.label}
            </span>
            <button
              type="button"
              onClick={onRemoveCoupon}
              className="font-util text-[11px] uppercase tracking-[0.14em] text-faint transition-colors hover:text-bone"
            >
              Remover
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                value={couponInput}
                onChange={(e) => onCouponInputChange(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onApplyCoupon())}
                placeholder="Cupom de desconto"
                className="w-full border border-line bg-ink px-3 py-2.5 text-[13px] uppercase tracking-[0.08em] text-bone placeholder:tracking-normal placeholder:text-faint/70 focus:border-blood focus:outline-none"
              />
              <button
                type="button"
                onClick={onApplyCoupon}
                disabled={!couponInput.trim()}
                className="font-util shrink-0 border border-line px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-bone transition-colors hover:border-blood hover:text-blood disabled:cursor-not-allowed disabled:opacity-40"
              >
                Aplicar
              </button>
            </div>
            {couponError && (
              <span className="font-util mt-1.5 block text-[10px] uppercase tracking-[0.1em] text-blood-2">
                {couponError}
              </span>
            )}
          </>
        )}
      </div>

      {/* totais */}
      <div className="p-5">
        <div className="space-y-2 text-[14px]">
          <div className="flex justify-between text-ash">
            <span>Subtotal</span>
            <span>{formatBRL(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-blood-2">
              <span>Desconto</span>
              <span>−{formatBRL(discount)}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
          <span className="font-util text-[12px] uppercase tracking-[0.2em] text-faint">Total</span>
          <div className="text-right">
            <div className="font-display text-[34px] font-black leading-none">{formatBRL(total)}</div>
            {installmentLabel && (
              <div className="font-util mt-1 text-[11px] uppercase tracking-[0.12em] text-ash">
                {installmentLabel}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* confiança */}
      <div className="border-t border-line px-5 py-4">
        <div className="flex items-center gap-2 text-faint">
          <Lock className="h-3.5 w-3.5" />
          <span className="font-util text-[10px] uppercase tracking-[0.14em]">
            Pagamento criptografado · ambiente seguro
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {BRANDS.map((b) => (
            <span
              key={b}
              className="font-util border border-line px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-faint"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
