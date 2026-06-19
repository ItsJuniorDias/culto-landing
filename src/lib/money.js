// Formatação de dinheiro (BRL) e cálculo de parcelas.
// Centralizado pra que checkout, resumo e qualquer preço futuro usem a mesma
// formatação e as mesmas regras de parcelamento.

const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

// 197 → "R$ 197,00"  ·  177.3 → "R$ 177,30"
export const formatBRL = (value) => BRL.format(Number(value) || 0)

// Gera as opções de parcelamento sem juros.
// minParcela evita parcelas microscópicas (padrão de mercado ~R$ 5–10).
export function installmentOptions(total, { max = 12, minParcela = 10 } = {}) {
  const safeTotal = Math.max(0, Number(total) || 0)
  const count = Math.max(1, Math.min(max, Math.floor(safeTotal / minParcela) || 1))

  return Array.from({ length: count }, (_, i) => {
    const n = i + 1
    const each = safeTotal / n
    return {
      n,
      each,
      label: n === 1 ? `1x de ${formatBRL(each)}` : `${n}x de ${formatBRL(each)} sem juros`,
    }
  })
}
