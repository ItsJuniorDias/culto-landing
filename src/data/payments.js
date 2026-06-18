// ════════════════════════════════════════════════════════════════════════
//  MERCADO PAGO · Links de pagamento
//  ----------------------------------------------------------------------
//  É AQUI que você cola o link de pagamento de cada pack. Só isso.
//
//  1. No painel do Mercado Pago, crie um "Link de pagamento" para cada pack.
//  2. Em cada link, configure as URLs de retorno (back_urls) apontando para:
//
//         Sucesso:    https://SEU-DOMINIO.com/compra/retorno
//         Pendente:   https://SEU-DOMINIO.com/compra/retorno
//         Falha:      https://SEU-DOMINIO.com/compra/retorno
//
//     (em teste local use http://localhost:5173/compra/retorno)
//
//  3. Cole o link gerado no campo do pack correspondente abaixo.
//
//  Enquanto o campo estiver vazio (''), o botão de compra mostra
//  "Pagamento em configuração" — o resto do fluxo já funciona.
//  Packs gratuitos não precisam de link.
// ════════════════════════════════════════════════════════════════════════

export const MP_PAYMENT_LINKS = {
  // chave = id do pack (veja src/data/catalog.js)
  design: '', // ex.: 'https://mpago.la/xxxxxxx'
  motion: '', // ex.: 'https://mpago.la/xxxxxxx'
  bundle: '', // ex.: 'https://mpago.la/xxxxxxx'
}

// URL de retorno que você configurou nas back_urls do Mercado Pago.
// Usada só como referência/documentação dentro do app.
export const MP_RETURN_PATH = '/compra/retorno'

export const getPaymentLink = (id) => MP_PAYMENT_LINKS[id] || ''
export const hasPaymentLink = (id) => Boolean(getPaymentLink(id))
