import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import AssetCard from "../components/AssetCard";
import Eyebrow from "../components/Eyebrow";
import Button from "../components/Button";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";
import { useAuth } from "../context/AuthContext";
import { catalog, byId } from "../data/catalog";
import { downloadFile } from "../lib/download";
import { staggerContainer, viewportOnce, EASE } from "../lib/motion";

function FeaturedPack({ pack }) {
  const reduce = useReducedMotion();
  const { recordDownload, downloads } = useAuth();
  const count = downloads[pack.id] || 0;

  const handleDownload = () => {
    downloadFile(pack.file, pack.fileName);
    recordDownload(pack.id);
  };

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
      className="relative overflow-hidden border border-blood bg-[linear-gradient(180deg,#181014,#121116)] shadow-featured"
    >
      <div className="grid gap-0 md:grid-cols-[300px_1fr]">
        {/* poster */}
        <div className="relative h-[340px] overflow-hidden border-b border-line md:h-auto md:border-b-0 md:border-r">
          <img
            src={pack.thumb}
            alt={pack.title}
            className="h-full w-full object-cover object-top"
          />
          <span className="font-util absolute left-0 top-0 bg-blood px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-bone">
            {pack.price}
          </span>
        </div>

        {/* details */}
        <div className="flex flex-col p-7 sm:p-9">
          <span className="font-util text-[11px] uppercase tracking-[0.2em] text-blood">
            Em destaque · {pack.kind}
          </span>
          <h2 className="font-display mt-2 text-[34px] font-black leading-[0.95] sm:text-[40px]">
            {pack.title}
          </h2>
          <p className="mt-4 max-w-[52ch] text-[15px] text-ash">{pack.desc}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {pack.badges.map((b) => (
              <span
                key={b}
                className="font-util border border-line px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-ash"
              >
                {b}
              </span>
            ))}
          </div>

          <div className="font-util mt-5 grid grid-cols-3 gap-4 border-t border-line pt-5 text-bone">
            <div>
              <div className="font-display text-xl font-extrabold">+50</div>
              <div className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-faint">
                histórias e jogos
              </div>
            </div>
            <div>
              <div className="font-display text-xl font-extrabold">
                {pack.spec.split("·")[0].trim()}
              </div>
              <div className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-faint">
                resolução
              </div>
            </div>
            <div>
              <div className="font-display text-xl font-extrabold">
                {pack.size}
              </div>
              <div className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-faint">
                tamanho
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-4 pt-7">
            <Button as="button" onClick={handleDownload}>
              Baixar pack ↓
            </Button>
            <Link
              to={`/pack/${pack.id}`}
              className="font-util text-[12px] font-semibold uppercase tracking-[0.14em] text-ash transition-colors hover:text-bone"
            >
              Ver detalhes →
            </Link>
            <span className="font-util text-[11px] uppercase tracking-[0.14em] text-faint">
              {count > 0
                ? `${count} ${count === 1 ? "download" : "downloads"}`
                : "PNG + JPEG · grátis na sua conta"}
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default function Dashboard() {
  const reduce = useReducedMotion();
  const { user, ownedCount, totalDownloads } = useAuth();

  const featured = byId("kids-space");
  const rest = catalog.filter((p) => p.id !== "kids-space");
  // The visually centered card in the 3-up grid stays highlighted (hover always on).
  const middleIndex = Math.floor(rest.length / 2);
  const firstName = (user?.name || "").split(" ")[0] || "criador";

  const stats = [
    { num: ownedCount, lbl: "Packs na biblioteca" },
    { num: totalDownloads, lbl: "Downloads" },
    { num: "∞", lbl: "Acesso vitalício" },
  ];

  return (
    <>
      <DashboardHeader />

      <main className="mx-auto max-w-wrap px-6 pb-24 pt-12 sm:pt-16">
        {/* greeting */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Eyebrow solo>Sua biblioteca</Eyebrow>
          <h1 className="font-display mt-3 text-[44px] font-black leading-[0.9] sm:text-[56px]">
            Olá, {firstName}.
          </h1>
          <p className="mt-3 max-w-[52ch] text-[16px] text-ash">
            Baixe seus packs, desbloqueie o resto do catálogo e leve tudo direto
            pro seu editor.
          </p>

          <div className="mt-7 flex flex-wrap gap-x-12 gap-y-6 border-y border-line py-6">
            {stats.map((s) => (
              <div key={s.lbl}>
                <div className="font-display text-[34px] font-extrabold leading-none">
                  {typeof s.num === "number" ? (
                    <CountUp to={s.num} duration={1.1} />
                  ) : (
                    s.num
                  )}
                </div>
                <div className="font-util mt-1.5 text-[11px] uppercase tracking-[0.2em] text-faint">
                  {s.lbl}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* featured showcase */}
        <div className="mt-10">
          <FeaturedPack pack={featured} />
        </div>

        {/* the rest of the catalog */}
        <div className="mt-14">
          <Reveal>
            <Eyebrow>Resto do catálogo</Eyebrow>
            <h2 className="font-display mt-3 text-[30px] font-extrabold leading-none sm:text-[36px]">
              Desbloqueie e baixe.
            </h2>
          </Reveal>

          <motion.div
            className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer(0.08)}
            initial={reduce ? false : "hidden"}
            whileInView={reduce ? undefined : "show"}
            viewport={viewportOnce}
          >
            {rest.map((pack, i) => (
              <AssetCard key={pack.id} pack={pack} active={i === middleIndex} />
            ))}
          </motion.div>
        </div>

        {/* persistence note */}
        <p className="mt-12 max-w-[64ch] text-[12px] leading-relaxed text-faint">
          O pagamento dos packs é feito pelo Pradapay. Depois da compra
          aprovada, o pack desbloqueia na sua conta e o download fica liberado.
          Sua conta, biblioteca e downloads ficam salvos neste navegador
          (armazenamento local) — limpar os dados do site zera tudo.
        </p>
      </main>
    </>
  );
}
