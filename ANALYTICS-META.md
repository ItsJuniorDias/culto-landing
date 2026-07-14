# CULTO — Eventos do Meta (Pixel + prontidão pra CAPI)

Upgrade da camada de analytics do Facebook/Meta Ads. Foco em **qualidade de
correspondência (EMQ)**, **cobertura de eventos** e **deduplicação pronta pra
Conversions API**. Nada de PII crú sai do browser — o Pixel hasheia (SHA-256) no
cliente e, no server-side, o hash é feito no seu backend.

---

## O que mudou, em uma frase cada

1. **`external_id` estável** entra no Advanced Matching desde o 1º PageView →
   maior EMQ, principalmente no checkout sem login.
2. **`_fbc` do anúncio capturado e persistido** (não só o cookie volátil do
   Pixel) → atribuição não se perde quando a pessoa volta depois.
3. **Todo evento carrega `eventID`** (determinístico onde importa) → pronto pra
   deduplicar com a Conversions API.
4. **`Contact` duplicado corrigido** e **Lead/Contact consolidados** num listener
   só → contagem honesta e cobertura de TODOS os CTAs de WhatsApp.
5. **`contents[]`** nos eventos de produto → melhor casamento com catálogo/DPA.

---

## Mapa de eventos

| Evento | Onde dispara | Parâmetros-chave | Dedup / eventID |
|---|---|---|---|
| `PageView` | `index.html` (carga) + troca de rota (`PixelTracker`) | — | auto por navegação; 1ª carga sai do HTML |
| `ViewContent` | `/pack/:id`, `/sites`, `/motion` | `content_name`, `content_category`, `content_type`, (pack: `value`, `contents`) | auto |
| `AddToCart` | clique em "comprar" no `PackDetail` | `content_ids`, `contents`, `value`, `currency` | auto |
| `InitiateCheckout` | checkout monta | idem + `num_items` | auto |
| `AddPaymentInfo` | submit do checkout (dados válidos) | idem | auto |
| `Purchase` | `/compra/retorno` (pago) | `value` real, `contents`, `num_items` | **`order.<id>`** (determinístico) + trava no localStorage |
| `Lead` | qualquer clique de WhatsApp + submit do formulário | `content_category`, `value` (proxy), `currency` | 1×/serviço/sessão; `eventID` `lead.<uuid>` |
| `Contact` | clique de WhatsApp e de telefone | `contact_method`, `content_category` | auto (1 por clique) |
| `CompleteRegistration` | cadastro no `/login` | `status` | auto |

Nesse site **todo clique de WhatsApp é intenção de orçamento**, então WhatsApp
conta como `Lead` + `Contact`; telefone (`tel:`) conta como `Contact`. Isso é
resolvido no listener global (`PixelTracker`), que descobre o serviço pela rota
(`/sites` vs `/motion`) e cai no número do link como fallback. Consequência: os
botões "Chamar no WhatsApp" dos **cards de plano** e do **dashboard** — que antes
não geravam Lead nenhum — agora geram.

Pra marcar um link que NÃO deve virar lead/contact (ex.: suporte no futuro):
`<a href="https://wa.me/..." data-no-track>`.

---

## EMQ: `external_id` + `fbc` + `fbp`

O Event Match Quality é o quanto o Meta consegue casar o evento com uma pessoa. O
que subiu:

- **`external_id`**: um UUID anônimo e estável, guardado em `localStorage`
  (`culto:xid`), gerado no `index.html` **antes** do primeiro `fbq('init')` e
  injetado no Advanced Matching. Como a compra é sem login, esse é o âncora que
  mais segura o EMQ quando e-mail/telefone ainda não são conhecidos. No checkout
  e no login, o `identify()` re-inicia o Pixel com `em/ph/fn/ln` **+** o mesmo
  `external_id` (pra não perder no re-init).
- **`_fbc`**: o cookie que o Pixel cria a partir do `fbclid` some se a pessoa sai
  e volta sem o parâmetro na URL — aí a atribuição do anúncio se perde. Agora o
  `fbclid` é capturado no load, transformado no formato oficial
  (`fb.1.<timestamp>.<fbclid>`) e persistido no `localStorage` (`culto:_fbc`) +
  cookie, com re-hidratação em sessão nova. É o mesmo padrão de `_fbc` estável
  que você fez no Pedagogy.
- **`_fbp`**: lido do cookie do Pixel para mandar junto no server-side.

Arquivo: `src/lib/metaIdentity.js` (novo) + trecho inline no `index.html`.

---

## Deduplicação e prontidão pra Conversions API

Toda função de evento (`track`, `lead`, `purchase`, …) agora **aceita e devolve o
`eventID`**. A regra: o navegador e o servidor mandam o **mesmo** `eventID` e o
Meta conta uma vez só.

- **`Purchase`** já usa `order.<id>` — o servidor consegue reproduzir esse id a
  partir do webhook do gateway sem combinar nada. É o mais importante, e já está
  pronto.
- **Demais eventos**: o `eventID` é gerado no browser e **retornado** pela
  função. Pra deduplicar no server-side, mande esse id junto no POST do CAPI.

Deixei dois ganchos em `metaIdentity.js`:

```js
import { getEventSourceData, capiPayload } from './lib/metaIdentity'

// tudo que o CAPI precisa do lado do cliente (external_id, fbc, fbp, UA, URL)
const src = getEventSourceData()

// corpo pronto pro seu endpoint server-side (espelho do evento do browser)
const body = capiPayload({
  eventName: 'Lead',
  eventId,                       // o MESMO devolvido pelo fireLead()
  customData: { value: 600, currency: 'BRL', content_category: 'sites' },
  userData: {},                  // em/ph você hasheia no SERVIDOR
})
// fetch('/api/meta/capi', { method:'POST', body: JSON.stringify(body) })
```

No backend (Fastify, como no Pedagogy) você recebe isso, hasheia o PII, anexa o
access token e faz o POST em `graph.facebook.com/<PIXEL_ID>/events`. O
`action_source`, `event_time`, `event_source_url` e `user_data` já vêm montados.

---

## Como testar

1. **Meta Pixel Helper** (extensão do Chrome): abra `/`, `/sites`, `/motion`,
   `/pack/bundle`, checkout. Confira que cada página dispara o evento esperado do
   mapa acima e que aparece `external_id` no Advanced Matching.
2. **Events Manager → Test Events**: cole o código de teste e navegue. Clique num
   WhatsApp → deve aparecer **um** `Lead` e **um** `Contact` (não dois Contact).
   Clique de novo → só `Contact` (o Lead é deduplicado na sessão).
3. **Atribuição**: entre pelo link com `?fbclid=teste123` e confira o cookie
   `_fbc` = `fb.1.<ts>.teste123`. Feche e reabra sem o parâmetro → o `_fbc`
   continua lá.
4. **Purchase**: finalize uma compra e confirme que refresh na página de retorno
   **não** dispara um segundo `Purchase` (trava por `order.<id>`).

---

## Pendências / calibragem

- **Valor proxy do `Lead`** (`src/lib/leads.js → LEAD_VALUE` = sites 600, motion
  350): troque pelos seus números reais (ticket × fechamento) assim que tiver.
- **CPF não é Advanced Matching** do Meta — segue coletado só pro pagamento, não
  entra no `identify()`.
- **Gateway em modo demonstração**: enquanto estiver assim, os `Purchase` são de
  teste. Ligue o Mercado Pago em produção antes de otimizar por compra.
- **Roteamento de WhatsApp dos cards de plano** (`ServiceCard`) usa o número
  padrão (sites) mesmo na página de motion — o Lead é classificado certo (pela
  rota), mas a conversa cai no seu número de sites. Se quiser, passo o número por
  serviço no `ServiceCard` num próximo passe.
