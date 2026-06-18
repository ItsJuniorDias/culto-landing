# CULTO

Marketplace de packs de assets para criadores — **React + Vite + Tailwind CSS + Framer Motion**.
Tema: pôster escuro, tipografia *blackletter* (Grenze Gotisch), grão de filme, vazamentos de luz e vermelho-sangue como acento.

Agora com **landing page + login + dashboard** e botões de download dos assets. **Sem back-end**: contas, sessão e biblioteca ficam salvas no navegador via `localStorage`.

## Rodando

Pré-requisito: **Node.js 18+**.

```bash
npm install      # (ou: bun install)
npm run dev      # http://localhost:5173
npm run build    # build de produção em /dist
npm run preview  # serve a build localmente
```

## Páginas / rotas

- `/` — landing page (os CTAs de compra levam ao login).
- `/login` — entrar **ou** criar conta (mesmo formulário, com abas).
- `/dashboard` — biblioteca do usuário (rota protegida; sem sessão, redireciona pro login).

### Conta de demonstração

Já vem semeada e dona de **todos** os packs:

```
e-mail:  demo@culto.com
senha:   culto123
```

Na tela de login há um botão **"Preencher automaticamente"**. Contas novas (cadastro) começam só com o pack gratuito e desbloqueiam o resto.

## "Persist storage" (sem back-end)

Toda a persistência usa `localStorage` através do hook `src/lib/useLocalStorage.js`, exposto pelo `AuthContext`:

- `culto:users` — contas cadastradas.
- `culto:session` — e-mail da sessão atual.
- `culto:library` — por usuário: packs adquiridos (`owned`) e contagem de `downloads`.

O hook sincroniza entre abas (evento `storage`). As **compras são simuladas** (sem cobrança): *Desbloquear* só adiciona o pack à biblioteca e persiste. Limpar os dados do site zera tudo.

## Downloads

Cada pack aponta para um arquivo real em `public/downloads/*.zip`, então os botões **Baixar** funcionam offline. O **Kid's Learning — Space Pack** usa a imagem enviada (`public/assets/kids-learning.png`) como thumbnail e dentro do zip. Os outros packs trazem amostras geradas + licença.

## Estrutura

```
src/
├── main.jsx                # BrowserRouter + AuthProvider
├── App.jsx                 # rotas (/, /login, /dashboard)
├── context/AuthContext.jsx # login/cadastro/sessão + biblioteca (localStorage)
├── lib/
│   ├── motion.js           # easing + variants do Framer Motion
│   ├── useLocalStorage.js  # hook de persistência
│   └── download.js         # disparo de download
├── data/
│   ├── content.js          # conteúdo da landing
│   └── catalog.js          # packs do dashboard/loja
├── pages/                  # Landing, Login, Dashboard
└── components/
    ├── Button.jsx          # polimórfico: <a> | <Link> | <button>
    ├── Field.jsx           # input do formulário
    ├── ProtectedRoute.jsx  # guarda da rota /dashboard
    ├── AssetCard.jsx       # card de pack (download / desbloquear)
    ├── PosterTile.jsx      # thumbnail de marca p/ packs sem foto
    ├── DashboardHeader.jsx # topo do dashboard (usuário + sair)
    └── ... (Navbar, Hero, Packs, Faq, Decor, Footer, etc.)
```

## Deploy estático (SPA)

Por usar rotas client-side, hosts estáticos precisam redirecionar tudo pro `index.html`:
- **Netlify**: incluso em `public/_redirects`.
- **Vercel**: incluso em `vercel.json`.
- `npm run preview` já faz esse *fallback* automaticamente.
