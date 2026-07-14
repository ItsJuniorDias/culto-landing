# CULTO — Refatoração de conversão

Documento técnico das mudanças feitas antes de subir campanha. Foco nos três
funis: **packs** (compra direta), **sites** (lead via WhatsApp) e **motion**
(lead via WhatsApp). Cada bloco explica o que era, o que virou e por quê.

---

## 1. Checkout como convidado — o maior ralo da loja

**Era:** pra comprar qualquer pack, `PackDetail.handleBuy` te jogava em `/login`
antes do checkout, e `Checkout.jsx` tinha um guard `if (!user) return <Navigate
to="/login">`. Cadastro obrigatório antes de ver o checkout é um dos maiores
pontos de abandono em e-commerce — e em tráfego pago é dinheiro do Meta indo
embora na porta.

**Virou:** compra sem cadastro. `handleBuy` vai direto pra `/checkout/:id`; o
checkout coleta e-mail/nome/CPF ali (o que já alimenta o Advanced Matching via
`identify`) e o download vai por e-mail. Um link discreto "já tenho conta"
continua permitindo vincular à conta. O `CheckoutReturn` já tratava o fluxo de
convidado, então é seguro — a conta virou "nice to have" pra re-download, não
pré-requisito da compra.

**Arquivos:** `pages/PackDetail.jsx`, `pages/Checkout.jsx`.

---

## 2. Pixel: evento `Lead` que nunca era disparado

**Era:** o helper `lead()` existia em `lib/pixel.js` mas não era chamado em lugar
nenhum. Nos funis de serviço, o clique no WhatsApp gerava no máximo `Contact`
(via listener global). Campanha de geração de lead **otimiza pelo evento
`Lead`** — sem ele, o algoritmo está no escuro.

**Virou:** nova camada `lib/leads.js` que dispara `Lead` + `Contact` com **valor
proxy** nos CTAs de alta intenção (formulário de orçamento, botão de WhatsApp do
herói e da barra mobile). Também passei a disparar `ViewContent` nas páginas de
serviço (`content_name: 'Criação de sites' / 'Vídeo & motion'`), pra você montar
público de remarketing por serviço e o Meta ter sinal de topo de funil.

**Arquivos:** `lib/leads.js` (novo), `components/QuoteForm.jsx`,
`components/MobileCtaBar.jsx`, `components/SitesHero.jsx`,
`components/MotionHero.jsx`, `pages/Sites.jsx`, `pages/Motion.jsx`.

> **Decisão que deixei com default (ajuste depois):** o valor proxy do lead está
> em `lib/leads.js → LEAD_VALUE` = `{ sites: 600, motion: 350 }`. É uma
> estimativa de quanto vale, em média, um lead qualificado de cada serviço
> (ticket médio × taxa de fechamento). **Não é receita real** — é um sinal pro
> Meta priorizar quem pede projeto maior. Troque assim que tiver seus números.

---

## 3. Formulário de briefing (QuoteForm) — captura mais e qualifica

**Era:** o único caminho de conversão dos serviços era o botão de WhatsApp. Isso
perde (a) quem está no desktop sem WhatsApp Web à mão, (b) quem tem receio de já
abrir conversa, e (c) a qualificação — chegava "oi" solto.

**Virou:** o bloco de CTA final dos serviços (`ServiceCta`) agora tem um
formulário curto — nome, faixa de orçamento e o que precisa. O submit **abre o
WhatsApp com a mensagem já montada** (nome + orçamento + briefing) e dispara
`Lead`. Todos os campos são opcionais menos o nome (menos campo = mais gente
termina). Embaixo ficam dois escape hatches: "ou só mandar um oi no WhatsApp"
(também conta como Lead) e "prefere ligar?" com o telefone.

As faixas de orçamento (`lib/leads.js → BUDGET_OPTIONS`) espelham os planos de
`content.js`, então o lead já chega ancorado numa faixa de preço.

**Arquivos:** `components/QuoteForm.jsx` (novo), `components/ServiceCta.jsx`.

---

## 4. Barra de ação fixa no mobile

**Era:** o CTA do cabeçalho é `hidden sm:inline-flex` — ou seja, **escondido no
celular**. No aparelho onde quase todo o tráfego de anúncio cai, a única forma de
converter era rolar até uma seção de CTA ou abrir o menu-sanduíche.

**Virou:** `MobileCtaBar` — barra fixa no rodapé, só no mobile. Aparece depois
que o herói sai da tela (pra não competir com o CTA do próprio herói) e **some
quando você chega no rodapé** (senão cobriria o formulário/botão de compra lá
embaixo). Em packs mostra âncora de preço + "Ver os packs"; em sites/motion
mostra "Planos" + "Chamar no WhatsApp" (dispara Lead).

**Arquivos:** `components/MobileCtaBar.jsx` (novo), plugado em `pages/Landing.jsx`,
`pages/Sites.jsx`, `pages/Motion.jsx`.

---

## 5. Prova social honesta (ProofStrip) — sem depoimento inventado

**Era:** Sites/Motion não tinham nenhuma prova social (os depoimentos ficam só na
home dos packs).

**Virou:** em vez de inventar review — que é fácil de farejar num estúdio solo e
quebra a confiança — adicionei uma **faixa de quebra de objeção com garantias
reais**: orçamento em 24h, 50% só na entrega, você é dono do código/domínio, nota
fiscal (sites); trilha licenciada, todos os cortes, fala direto comigo (motion).
Cada item é verdade e remove um motivo pra pessoa não te chamar. Fica logo antes
do preço/fechamento. A prova social forte dos sites continua sendo o projeto real
(Pedagogy) que já estava lá.

**Arquivos:** `components/ProofStrip.jsx` (novo), conteúdo em `data/screens.js`
(`sitesProof`, `motionProof`).

---

## 6. SEO e compartilhamento

**Era:** um único `<title>`/description pro SPA inteiro e **zero** Open Graph —
link compartilhado no WhatsApp/Insta aparecia sem card.

**Virou:** Open Graph + Twitter Card completos no `index.html` (título,
descrição, `og:image` apontando pra `/assets/preview.webp`, canonical, robots). E
um hook `useDocumentMeta` que ajusta `<title>` e description **por rota** — `/sites`
e `/motion` agora têm título/descrição próprios. Como o Google renderiza JS, ele
enxerga esses valores; e o título fica correto ao navegar no histórico.

**Arquivos:** `index.html`, `lib/useDocumentMeta.js` (novo), `data/screens.js`
(`pageMeta`), aplicado em `pages/Sites.jsx` e `pages/Motion.jsx`.

---

## 7. Performance — quem cai em /sites não baixa o checkout inteiro

**Era:** tudo num bundle só. Um anúncio caindo em `/sites` baixava Checkout,
CheckoutReturn (com o QR de Pix), Dashboard e Login sem precisar.

**Virou:** code-splitting por rota (`React.lazy` + `Suspense` em `App.jsx`). As
três telas de marketing ficam no bundle inicial (alvos de anúncio, sem flash de
loading); a loja/conta só baixa ao entrar no funil. Números do build:

```
Checkout ......... 20.7 kB (gzip 6.9)   ─┐
CheckoutReturn ... 31.9 kB (gzip 11.8)   ├─ agora chunks separados,
Dashboard ........ 15.8 kB (gzip 4.9)    │  NÃO carregam nas páginas
PackDetail ....... 7.0 kB               │  de marketing
Login ............ 3.1 kB   ─────────────┘
```

Também tirei os dois pesos mais leves da fonte de display (Grenze Gotisch só usa
600–900 no site) do `index.html`.

**Arquivos:** `App.jsx`, `index.html`.

---

## 8. Ajustes finos

- `FinalCta` (home) apontava o botão do Bundle pra `/login` — trocado pra
  `/pack/bundle`, que vende antes de pedir os dados.
- `ServiceCta` recebe `service="sites"|"motion"` pra usar o número de WhatsApp e
  as faixas de orçamento certas.

---

## Onde editar cada coisa (mapa rápido)

- **Preços dos packs e dos planos:** `src/data/content.js` (fonte única).
- **Números de WhatsApp:** `src/data/screens.js` (`SITES_WHATSAPP`,
  `MOTION_WHATSAPP`) e `src/data/content.js` (`contact`).
- **Valor proxy do lead e faixas de orçamento:** `src/lib/leads.js`.
- **Copy das telas de serviço (processo, FAQ, garantias, CTA):**
  `src/data/screens.js`.
- **Pixel ID:** `index.html` e `src/lib/pixel.js`.

---

## Recomendações que eu NÃO implementei (e por quê)

Coisas de alto impacto que dependem de decisão sua, backend ou mídia binária:

1. **Otimizar `public/assets/kids-learning.png` (2,9 MB).** É usado como
   thumbnail — 2,9 MB num thumb pesa no LCP da página de detalhes. Exportar em
   WebP a ~1200px de largura deve derrubar pra <150 kB. Fora do escopo aqui
   porque é reprocessamento de imagem; recomendo fazer no seu fluxo.

2. **Peso do `framer-motion` no bundle inicial (~126 kB gzip total).** É o maior
   peso restante. Não mexi porque a animação é parte da identidade e remover
   quebraria muita coisa. Se um dia o LCP mobile incomodar, dá pra migrar os
   componentes mais simples pra CSS/`@react-spring` menor.

3. **CAPI server-side com dedupe pro `Lead`.** Você já tem CAPI no Pedagogy. Aqui
   o `Lead` sai só pelo browser. Pra fechar atribuição (adblock, iOS), passe a
   emitir o mesmo `Lead` do servidor com um `eventID` compartilhado. O
   `lib/pixel.js` já aceita `options.eventID` no `track()` — falta o backend
   espelhar o evento.

4. **Persistir o lead no backend.** Hoje o QuoteForm só abre o WhatsApp. Um
   endpoint `/api/leads` guardando nome/faixa/briefing te daria um CRM mínimo e
   permitiria recuperar quem não terminou a conversa. A `lib/api.js` é o lugar de
   plugar.

5. **Gateway ainda em modo demonstração.** O checkout diz "gateway em modo
   demonstração" — antes de rodar tráfego de compra, confirme que o backend está
   com o Mercado Pago em produção, senão os `Purchase` são falsos.

6. **Catálogo com arquivo real.** Em `src/data/catalog.js`, Design/Bundle/Motion
   apontam todos pro mesmo `kids-learning-pack.zip` (tem `// TROCAR` marcado).
   Troque pelos `.zip` reais antes de vender.

7. **Destino dos anúncios.** Recomendo mandar cada conjunto de anúncio pra rota
   específica — sites → `/sites`, motion → `/motion`, bundle → `/pack/bundle` —
   em vez de tudo na home. Cada página agora é uma landing de conversão fechada.

---

## Como rodar

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # produção (dist/)
npm run preview  # servir o build
```
