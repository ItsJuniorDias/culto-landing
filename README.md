# CULTO

Marketplace de packs de assets para criadores — **React + Vite + Tailwind CSS + Framer Motion**.
Tema: pôster escuro, tipografia *blackletter* (Grenze Gotisch), grão de filme, vazamentos de luz e vermelho-sangue como acento.

**Landing page + login + dashboard + página de detalhes por pack.** Os downloads ficam **bloqueados até a compra**. O **checkout é integrado à API CULTO** (backend próprio em **Fastify + TypeScript**): o preço é **recalculado no servidor**, o cupom é **validado pela API** e o pedido é confirmado por **webhook do gateway**. Contas, sessão e biblioteca ainda ficam no navegador via `localStorage` (a API cobre só o fluxo de checkout).

## Rodando

Pré-requisito: **Node.js 18+**.

O front conversa com o backend de checkout (`culto-checkout-api`). Suba os dois:

```bash
# 1) Backend (em outra aba) — http://localhost:3333
cd ../culto-checkout-api
npm install && npm run dev

# 2) Front — http://localhost:5173
npm install      # (ou: bun install)
npm run dev
npm run build    # build de produção em /dist
npm run preview  # serve a build localmente
```

A URL da API vem de `VITE_API_URL` (veja `.env.example`); o padrão já aponta para `http://localhost:3333`. O CORS do backend já libera `http://localhost:5173`.

---

## 🔌 Integração com a API de checkout

O fluxo de pagamento foi ligado ao backend. O que mudou:

- **`src/lib/api.js`** — cliente da API (fetch + tratamento de erro). Toda chamada ao servidor passa por aqui. Base configurável via `VITE_API_URL`.
- **Checkout (`src/pages/Checkout.jsx`)** — ao aplicar um **cupom**, chama `POST /api/coupons/validate` e usa o preço que o servidor devolve. Ao finalizar, chama `POST /api/checkout/sessions` (o servidor cria o pedido + a cobrança e **recalcula o preço** — o cliente não dita valor) e redireciona para `/compra/retorno?order=<id>`.
- **Retorno (`src/pages/CheckoutReturn.jsx`)** — consulta `GET /api/checkout/sessions/:id` para saber o **status real** (não confia mais no status da URL). Pix/boleto pendente faz *polling* até confirmar; no modo dev há um botão para **simular a confirmação** (dispara o webhook do gateway via `POST /api/dev/simulate-webhook`).
- **Cartão (PCI):** o número cru **não** é enviado. O front manda um *token* de cartão de demonstração — em produção, troque pela tokenização do SDK do gateway (PradaPay), mantendo o PAN fora do seu servidor.

A liberação do pack na biblioteca continua no `localStorage` (via `AuthContext.purchase`), acionada quando o servidor confirma o pagamento — porque a API cobre só o checkout, não a conta do usuário.

---

## Páginas / rotas

- `/` — landing page (os CTAs de compra levam à página do pack).
- `/pack/:id` — **detalhes do pack**: galeria, o que vem dentro, e o botão de **download (bloqueado até comprar)** ou **Comprar**. Pública.
- `/checkout/:id` — **checkout integrado à API** (dados, cupom, cartão/Pix/boleto). Protegido (exige login).
- `/compra/retorno` — página de **retorno**: consulta o status do pedido na API e libera o pack. Pública.
- `/login` — entrar **ou** criar conta (mesmo formulário, com abas).
- `/dashboard` — biblioteca do usuário (rota protegida; sem sessão, redireciona pro login).

### Conta de demonstração

Já vem semeada e dona de **todos** os packs:

```
e-mail:  demo@culto.com
senha:   culto123
```

Contas novas (cadastro) começam só com o pack gratuito e desbloqueiam o resto comprando.

---

## 💳 Mercado Pago (configurar depois — só colar os links)

A estrutura já está pronta. Você só precisa criar os links e colá-los em **`src/data/payments.js`**.

**1. Crie um link de pagamento** para cada pack pago no painel do Mercado Pago
(*Seu negócio → Link de pagamento*, ou em **Checkout Pro**). Anote o link de cada um.

**2. Cole os links** em `src/data/payments.js`:

```js
export const MP_PAYMENT_LINKS = {
  design: 'https://mpago.la/SEU-LINK-DESIGN',
  motion: 'https://mpago.la/SEU-LINK-MOTION',
  bundle: 'https://mpago.la/SEU-LINK-BUNDLE',
}
```

**3. Configure as "URLs de retorno" (`back_urls`)** de cada link para apontar para a página de retorno do site, **incluindo o id do pack** na query. Ex.:

```
https://SEU-SITE.com/compra/retorno?pack=design
https://SEU-SITE.com/compra/retorno?pack=motion
https://SEU-SITE.com/compra/retorno?pack=bundle
```

> Importante: ative o **retorno automático** ("voltar para o site") no link. Quando o Mercado Pago aprova o pagamento, ele manda o cliente de volta para `/compra/retorno`, que lê o status (`status=approved` / `collection_status=approved`) e o `pack` e **libera o download automaticamente** na conta logada.

Enquanto um link estiver vazio, o botão **Comprar** mostra um aviso de "checkout em configuração" em vez de quebrar — então dá pra publicar antes de finalizar o Mercado Pago.

---

## 🛠️ Developer mode (testar o desbloqueio sem pagar)

Serve pra você simular "o cliente comprou" e ver o download destravar.

- Em **`npm run dev`** o painel já aparece sozinho (canto inferior direito).
- Em **produção** ele fica escondido. Para abrir: acesse o site com **`?dev=1`** na URL (ex. `https://SEU-SITE.com/?dev=1`). Para esconder de novo: **`?dev=0`**.

Com o dev mode **ligado** e uma conta logada, o painel deixa você:
- **Liberar / Bloquear** cada pack pago (simula a compra/estorno e persiste);
- **Resetar biblioteca** (volta a conta só com os packs gratuitos).

Na própria página do pack (`/pack/:id`), com o dev mode ligado, aparece um botão **"Simular compra (desbloquear)"** pra testar o fluxo de download na hora.

---

## Persistência (sem back-end)

Tudo via `localStorage` (hook `src/lib/useLocalStorage.js`), exposto pelo `AuthContext`:

- `culto:users` — contas cadastradas.
- `culto:session` — e-mail da sessão atual.
- `culto:library` — por usuário: packs adquiridos (`owned`) e contagem de `downloads`.
- `culto:devmode` / `culto:devpanel` — estado do developer mode.
- `culto:pendingPurchase` — pack aguardando confirmação do Mercado Pago.

> ⚠️ Por ser um site **estático**, o bloqueio de download é no nível da interface. O arquivo em `public/downloads/` é público se alguém souber a URL exata. Para proteção real seria preciso um back-end servindo o arquivo só após validar a compra (webhook do Mercado Pago). Para o uso atual (loja com checkout do MP), o fluxo de UI já entrega a experiência completa.

## Downloads e arquivos dos packs

- **Kid's Learning — Space Pack** (gratuito): usa as imagens enviadas como galeria (`public/assets/kids-space-0*.jpg`) e o download real é **`public/downloads/kids-learning-pack.zip`** (as 4 artes em alta + licença).
- **Packs pagos** (Design / Motion / Bundle): por enquanto o download aponta para o **mesmo zip de exemplo** (`kids-learning-pack.zip`), só como **placeholder**. Em `src/data/catalog.js` cada pack tem o campo `file` com um comentário **"TROCAR pelo arquivo real"** — é só colocar o zip definitivo em `public/downloads/` e atualizar o caminho.

## Estrutura (principais novidades em **negrito**)

```
src/
├── main.jsx                  # BrowserRouter + AuthProvider + DevModeProvider
├── App.jsx                   # rotas (+ /pack/:id, /compra/retorno) + <DevPanel/>
├── context/
│   ├── AuthContext.jsx       # login/cadastro/sessão + biblioteca (+ revoke, resetLibrary)
│   └── DevModeContext.jsx    # estado global do developer mode
├── lib/
│   ├── checkout.js           # inicia o checkout do MP, lê o retorno
│   ├── download.js           # disparo de download
│   ├── motion.js             # easing + variants
│   └── useLocalStorage.js    # hook de persistência
├── data/
│   ├── content.js            # conteúdo da landing
│   ├── catalog.js            # packs (galeria, "o que vem dentro", arquivos)
│   └── payments.js           # ← COLE AQUI OS LINKS DO MERCADO PAGO
├── pages/
│   ├── PackDetail.jsx        # página de detalhes + download bloqueado/comprar
│   ├── CheckoutReturn.jsx    # retorno do Mercado Pago (libera o pack)
│   └── ... (Landing, Login, Dashboard)
└── components/
    ├── DevPanel.jsx          # painel flutuante do developer mode
    ├── StoreNav.jsx          # topo compacto das páginas de pack/retorno
    ├── AssetCard.jsx         # card de pack (leva aos detalhes)
    └── ... (Button, Packs, Footer, Decor, etc.)
```

## Deploy estático (SPA)

Rotas client-side: o host precisa redirecionar tudo pro `index.html`.
- **Netlify**: incluso em `public/_redirects`.
- **Vercel**: incluso em `vercel.json`.
- `npm run preview` já faz esse *fallback* automaticamente.

Depois de publicar, lembre de apontar as `back_urls` dos links do Mercado Pago para `https://SEU-SITE.com/compra/retorno?pack=<id>`.
