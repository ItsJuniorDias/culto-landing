# CULTO

Landing page de packs de assets para criadores — reconstruída em **React + Vite + Tailwind CSS + Framer Motion**.

Tema: pôster escuro, tipografia *blackletter* (Grenze Gotisch), grão de filme, vazamentos de luz e vermelho-sangue como acento.

## Rodando o projeto

Pré-requisito: **Node.js 18+**.

```bash
npm install      # instala as dependências
npm run dev      # ambiente de desenvolvimento (http://localhost:5173)
npm run build    # gera a build de produção em /dist
npm run preview  # serve a build de produção localmente
```

## Stack

- **React 18** + **Vite 5** — base e bundler.
- **Tailwind CSS 3.4** — estilização com tokens da marca (`tailwind.config.js`).
- **Framer Motion 11** — animações.

## Padrões de animação usados

- **Entrada orquestrada do hero** — eyebrow, título, lead, botões e métricas sobem em sequência no carregamento; uma barra vermelha faz *wipe* horizontal atrás da palavra (assinatura da página).
- **Reveal no scroll** — `whileInView` + `viewport={{ once: true }}` substitui o `IntersectionObserver`; grids usam `staggerChildren` para revelar item a item.
- **Micro-interações** — botões e cards reagem a `whileHover` / `whileTap`.
- **Accordion do FAQ** — `AnimatePresence` anima a altura de `0 → auto` em vez do `<details>` nativo.
- **Menu mobile** — abre/fecha com `AnimatePresence`.
- **Atmosfera** — os vazamentos de luz "respiram" em loop com `repeat: Infinity`.
- **Acessibilidade** — tudo respeita `prefers-reduced-motion` via o hook `useReducedMotion()`; foco visível e `scroll-behavior` desligado quando o usuário pede menos movimento.

Os *tokens* de animação (easing, durações e variants) ficam centralizados em `src/lib/motion.js`.

## Estrutura

```
src/
├── App.jsx                 # compõe as seções
├── main.jsx                # ponto de entrada
├── index.css               # base do Tailwind + texturas (grão, halftone)
├── lib/
│   └── motion.js           # easing + variants compartilhados
├── data/
│   └── content.js          # todo o conteúdo (packs, depoimentos, FAQ...)
└── components/
    ├── Decor.jsx           # Grain, Halftone, Rays, Burst
    ├── Reveal.jsx          # wrapper de reveal no scroll
    ├── Eyebrow.jsx
    ├── Button.jsx
    ├── Logo.jsx
    ├── Navbar.jsx
    ├── Hero.jsx
    ├── Compat.jsx
    ├── SectionHead.jsx
    ├── Inside.jsx
    ├── Packs.jsx
    ├── Steps.jsx
    ├── Voices.jsx
    ├── Faq.jsx
    ├── FinalCta.jsx
    └── Footer.jsx
```

## Editando o conteúdo

Quase todo o texto (packs, preços, depoimentos, FAQ, links do rodapé) vive em `src/data/content.js`. As categorias do "O que vem dentro" (com os ícones SVG) ficam em `src/components/Inside.jsx`.

As cores e fontes da marca estão em `tailwind.config.js` — mude ali para retematizar a página inteira.
