import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { sitesShowcase } from "../data/content";
import { fadeUp, scaleIn, staggerContainer, viewportOnce } from "../lib/motion";

/* Coruja mascote — a cara do Pedagogy, no palette quente dele. Fica só como
   fallback ilustrado caso o screenshot do site real não carregue. */
function Owl({ className = "" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d="M26 26 L34 14 L40 30 Z" fill="#4B3F72" />
      <path d="M74 26 L66 14 L60 30 Z" fill="#4B3F72" />
      <path
        d="M50 22c-17 0-27 12-27 30 0 16 12 26 27 26s27-10 27-26c0-18-10-30-27-30Z"
        fill="#5A4FCF"
      />
      <path
        d="M50 46c-9 0-15 7-15 17 0 8 7 13 15 13s15-5 15-13c0-10-6-17-15-17Z"
        fill="#FBF7EC"
        opacity="0.9"
      />
      <circle cx="39" cy="45" r="12" fill="#FBF7EC" />
      <circle cx="61" cy="45" r="12" fill="#FBF7EC" />
      <circle
        cx="39"
        cy="45"
        r="12"
        fill="none"
        stroke="#E9A23B"
        strokeWidth="2.4"
      />
      <circle
        cx="61"
        cy="45"
        r="12"
        fill="none"
        stroke="#E9A23B"
        strokeWidth="2.4"
      />
      <circle cx="41" cy="46" r="5" fill="#2A2340" />
      <circle cx="59" cy="46" r="5" fill="#2A2340" />
      <circle cx="43" cy="44" r="1.6" fill="#fff" />
      <circle cx="61" cy="44" r="1.6" fill="#fff" />
      <path d="M50 52 l5 7 -10 0 Z" fill="#E9A23B" />
      <path
        d="M43 78v5M47 78v5M53 78v5M57 78v5"
        stroke="#E9A23B"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Fallback ilustrado (a "cara" desenhada do site) — só entra em cena se todos
   os provedores de screenshot falharem. Assim a seção nunca fica quebrada. */
function IllustratedPreview({ s, reduce }) {
  return (
    <div className="relative h-full w-full bg-[radial-gradient(120%_90%_at_50%_0%,#FFFDF6_0%,#FBF7EC_60%,#F3ECDA_100%)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(90,79,207,0.18) 1px, transparent 1.4px)",
          backgroundSize: "14px 14px",
        }}
      />
      <span className="absolute left-[12%] top-[16%] text-[#E9A23B]">✦</span>
      <span className="absolute right-[14%] top-[26%] text-[#5A4FCF]/50">
        ✦
      </span>
      <span className="absolute right-[22%] bottom-[18%] text-[#E9A23B]/70">
        ✦
      </span>

      <div className="absolute left-5 top-4 flex items-center gap-2">
        <Owl className="h-6 w-6" />
        <span className="text-[15px] font-extrabold tracking-tight text-[#3A3160]">
          {s.name}
        </span>
      </div>

      <div className="flex h-full flex-col items-center justify-center px-6 pt-6 text-center">
        <motion.div
          animate={reduce ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Owl className="mb-3 h-[76px] w-[76px] drop-shadow-[0_10px_18px_rgba(90,79,207,0.25)]" />
        </motion.div>

        <h4 className="max-w-[16ch] text-[19px] font-extrabold leading-tight text-[#2C2450] sm:text-[22px]">
          {s.headline}
        </h4>
        <p className="mt-2 max-w-[26ch] text-[12.5px] leading-snug text-[#6A628C]">
          {s.sub}
        </p>

        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {s.pills.map((p) => (
            <span
              key={p}
              className="rounded-full border border-[#5A4FCF]/25 bg-white/60 px-2.5 py-1 text-[10.5px] font-semibold text-[#4B3F72]"
            >
              {p}
            </span>
          ))}
        </div>

        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#5A4FCF] px-5 py-2 text-[12px] font-bold text-[#FBF7EC] shadow-[0_10px_20px_-8px_rgba(90,79,207,0.7)]">
          {s.cta}
        </span>
      </div>
    </div>
  );
}

/*
 * Prova social da seção de sites: o Pedagogy REAL, num screenshot ao vivo dentro
 * de um mock de navegador. Screenshot em vez de iframe de propósito — não dispara
 * o Pixel/CAPI do Pedagogy (mantém a atribuição dele limpa), não sofre com
 * X-Frame-Options e não rouba o scroll da página.
 *
 * Carregamento em cascata (a 1ª fonte que devolver um print válido vence):
 *   1. /assets/preview.webp  → print local, a FONTE DEFINITIVA. O arquivo mora em
 *      public/assets/preview.webp e o Vite serve /public a partir da raiz, então o
 *      endereço correto é /assets/preview.webp. Instantâneo, sem depender de
 *      terceiro, qualidade que você escolhe. Pra trocar o print é só substituir esse
 *      arquivo. Se ele sumir (404), cai automaticamente pros geradores abaixo.
 *   2. thum.io   → gera o print sob demanda e devolve a imagem final (sem tela de
 *      "generating…" como o mShots, que era o bug anterior).
 *   3. microlink → segundo gerador, backup.
 *   4. ilustração → último recurso, pra seção nunca ficar quebrada.
 */
export default function SitesShowcase() {
  const reduce = useReducedMotion();
  const s = sitesShowcase;
  const liveUrl = s.live.replace(/\/+$/, "") + "/";

  const [src, setSrc] = useState(null);
  const [status, setStatus] = useState("loading"); // 'loading' | 'ready' | 'failed'

  useEffect(() => {
    const target = s.live.replace(/\/+$/, ""); // https://pedagogy.com.br

    const sources = [
      // Print local — fonte definitiva. No Vite, tudo em /public é servido a partir
      // da RAIZ, então o arquivo public/assets/preview.webp responde em /assets/…
      // (o prefixo /public/ caía no fallback do SPA e devolvia o index.html, por isso
      // a imagem "carregava" mas nunca virava screenshot). Instantâneo e sem terceiros.
      { url: "/assets/preview.webp", timeout: 2500 },
      {
        url: `https://image.thum.io/get/width/1280/crop/880/wait/4/noanimate/${target}`,
        timeout: 15000,
      },
      {
        url: `https://api.microlink.io/?url=${encodeURIComponent(
          target,
        )}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1280&viewport.height=880&viewport.deviceScaleFactor=2`,
        timeout: 15000,
      },
    ];

    let cancelled = false;
    let idx = 0;
    let timer;

    function attempt() {
      if (cancelled) return;
      if (idx >= sources.length) {
        setStatus("failed");
        return;
      }
      const { url, timeout } = sources[idx];
      const probe = new Image();
      let settled = false;

      const next = () => {
        if (settled || cancelled) return;
        settled = true;
        clearTimeout(timer);
        idx += 1;
        attempt();
      };

      timer = setTimeout(next, timeout); // essa fonte demorou demais → próxima
      probe.onload = () => {
        if (settled || cancelled) return;
        // descarta respostas-erro minúsculas (1x1, ícone de falha dos geradores)
        if (probe.naturalWidth < 200 || probe.naturalHeight < 120) {
          next();
          return;
        }
        settled = true;
        clearTimeout(timer);
        setSrc(url);
        setStatus("ready");
      };
      probe.onerror = next;
      probe.src = url;
    }

    attempt();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [s.live]);

  return (
    <motion.div
      className="grid grid-cols-1 items-center gap-9 md:grid-cols-[1.15fr_1fr]"
      variants={staggerContainer(0.12)}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={viewportOnce}
    >
      {/* mock de navegador */}
      <motion.div
        variants={reduce ? undefined : scaleIn}
        className="group relative overflow-hidden border border-line bg-panel shadow-[0_40px_90px_-50px_rgba(0,0,0,0.9)]"
      >
        <div className="flex items-center gap-3 border-b border-line bg-panel-2 px-4 py-3">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="h-[9px] w-[9px] rounded-full bg-faint/70" />
            <span className="h-[9px] w-[9px] rounded-full bg-faint/50" />
            <span className="h-[9px] w-[9px] rounded-full bg-faint/30" />
          </span>
          <span className="font-util ml-2 inline-flex items-center gap-2 rounded-sm border border-line bg-ink/60 px-3 py-1 text-[11px] tracking-[0.08em] text-ash">
            <svg
              viewBox="0 0 24 24"
              className="h-3 w-3 fill-none stroke-ash"
              strokeWidth="2"
            >
              <rect x="5" y="11" width="14" height="9" rx="1.5" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            {s.url}
          </span>
        </div>

        {/* viewport: screenshot do site real, com shimmer no load e overlay ao vivo */}
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir ${s.url} em nova aba`}
          className="relative block aspect-[16/9] overflow-hidden bg-panel-2"
        >
          {status === "ready" ? (
            <motion.img
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={src}
              alt={`Screenshot do site ${s.url} no ar`}
              className="h-full w-full object-cover object-top"
            />
          ) : status === "failed" ? (
            <IllustratedPreview s={s} reduce={reduce} />
          ) : (
            <div className="absolute inset-0">
              <div className="h-full w-full animate-pulse bg-[linear-gradient(110deg,#16151B_8%,#1d1c23_18%,#16151B_33%)] bg-[length:200%_100%]" />
              <span className="font-util absolute bottom-3 left-4 text-[10.5px] uppercase tracking-[0.16em] text-faint">
                Carregando o site ao vivo…
              </span>
            </div>
          )}

          {/* selo "ao vivo" */}
          <span className="pointer-events-none absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-line bg-ink/80 px-2.5 py-1 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blood opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blood" />
            </span>
            <span className="font-util text-[10px] font-bold uppercase tracking-[0.16em] text-bone">
              No ar
            </span>
          </span>

          {/* overlay de hover → convite pra abrir ao vivo */}
          <span className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="font-util mb-5 inline-flex items-center gap-2 rounded-full border border-blood/50 bg-ink/85 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-bone shadow-glow-sm">
              Abrir {s.url}
              <span aria-hidden="true">↗</span>
            </span>
          </span>
        </a>
      </motion.div>

      {/* copy */}
      <motion.div variants={reduce ? undefined : fadeUp}>
        <div className="font-util text-xs uppercase tracking-[0.2em] text-blood">
          {s.kicker}
        </div>
        <h3 className="font-display mt-2 text-[34px] font-extrabold leading-[0.95]">
          {s.name} — leitura infantil no ar.
        </h3>
        <p className="mt-4 max-w-[46ch] text-[15.5px] text-ash">
          Um exemplo de entrega ponta a ponta: da landing ao funil de conversão,
          com atribuição server-side funcionando mesmo com as travas da Kids
          Category da Apple.
        </p>

        <ul className="mt-6 flex flex-col gap-[13px]">
          {s.bullets.map((b) => (
            <li key={b} className="flex gap-[11px] text-[14.5px]">
              <svg
                viewBox="0 0 24 24"
                className="mt-[3px] h-[16px] w-[16px] flex-none fill-none stroke-blood"
                strokeWidth="2.6"
              >
                <path d="M4 12l5 5L20 6" />
              </svg>
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          {s.stack.map((t) => (
            <span
              key={t}
              className="font-util border border-line bg-panel px-2.5 py-[6px] text-[10.5px] uppercase tracking-[0.1em] text-ash"
            >
              {t}
            </span>
          ))}
        </div>

        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-util mt-7 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-bone transition-colors hover:text-blood"
        >
          Ver o site ao vivo
          <span aria-hidden="true">↗</span>
        </a>
      </motion.div>
    </motion.div>
  );
}
