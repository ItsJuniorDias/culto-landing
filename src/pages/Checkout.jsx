import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import StoreNav from "../components/StoreNav";
import Footer from "../components/Footer";
import Eyebrow from "../components/Eyebrow";
import Button from "../components/Button";
import { Halftone } from "../components/Decor";
import OrderSummary from "../components/checkout/OrderSummary";
import CheckoutInput from "../components/checkout/CheckoutInput";
import {
  Card,
  QrCode,
  Barcode,
  Lock,
  Shield,
  Check,
  Chevron,
  ArrowLeft,
  Spinner,
} from "../components/checkout/icons";
import { useAuth } from "../context/AuthContext";
import { byId } from "../data/catalog";
import { writePending, writePayment } from "../lib/checkout";
import { api, centsToReais } from "../lib/api";
import { formatBRL, installmentOptions } from "../lib/money";
import { EASE } from "../lib/motion";
import {
  onlyDigits,
  detectBrand,
  brandLabel,
  cvcLength,
  maskCardNumber,
  maskExpiry,
  maskCPF,
  maskPhone,
  cardNumberValid,
  expiryValid,
  cvcValid,
  nameValid,
  emailValid,
  cpfValid,
  phoneValid,
} from "../lib/forms";

// Os cupons são validados pela API (fonte da verdade). Veja applyCoupon.
// Os detalhes de Pix/boleto NÃO são mais simulados aqui: eles vêm na resposta
// de criação da sessão e são exibidos na página de retorno (/compra/retorno).

function MethodTab({ active, onClick, icon: Icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-1 flex-col items-center gap-1.5 border px-2 py-3.5 transition-colors ${
        active
          ? "border-blood bg-blood/10 text-bone"
          : "border-line text-ash hover:border-faint hover:text-bone"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-util text-[11px] font-semibold uppercase tracking-[0.14em]">
        {label}
      </span>
    </button>
  );
}

function SectionTitle({ n, children }) {
  return (
    <h2 className="font-util mb-4 flex items-center gap-3 text-[12px] uppercase tracking-[0.2em] text-bone">
      <span className="grid h-6 w-6 place-items-center border border-blood text-[11px] font-semibold text-blood">
        {n}
      </span>
      {children}
    </h2>
  );
}

// Painel informativo do método sem cartão. O artefato real (QR do Pix, código
// de barras do boleto) é gerado no servidor ao confirmar e aparece na próxima
// tela — então aqui só explicamos o que vai acontecer.
function MethodInfo({ icon: Icon, title, children, note }) {
  return (
    <div className="border border-line bg-ink/40 p-6">
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center border border-line text-bone">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display text-[20px] font-extrabold leading-tight">
            {title}
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ash">{children}</p>
          {note && (
            <span className="font-util mt-3 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-faint">
              <Lock className="h-3.5 w-3.5" /> {note}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { user, ownsPack } = useAuth();
  const pack = byId(id);

  // ── Estado (todos os hooks antes de qualquer return) ──
  const [method, setMethod] = useState("card");
  const [email, setEmail] = useState(user?.email || "");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvc: "" });
  const [installments, setInstallments] = useState(1);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle");
  const [summaryOpen, setSummaryOpen] = useState(false);

  // cupom — validado e precificado pela API (centavos → reais para exibir)
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, label }
  const [serverPricing, setServerPricing] = useState(null); // PricingBreakdown da API
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  // erro ao criar a sessão de checkout (ex.: API fora do ar, cartão desabilitado)
  const [submitError, setSubmitError] = useState("");

  const subtotal = pack?.priceValue || 0;
  const discount = serverPricing ? centsToReais(serverPricing.discountCents) : 0;
  const total = serverPricing ? centsToReais(serverPricing.totalCents) : subtotal;

  const brand = detectBrand(card.number);
  const installmentList = useMemo(() => installmentOptions(total), [total]);
  const selN = Math.min(installments, installmentList.length);
  const selectedInstallment = installmentList[selN - 1];

  const errors = {
    email: emailValid(email) ? "" : "E-mail inválido",
    cpf: cpfValid(cpf) ? "" : "CPF inválido",
    phone: phoneValid(phone) ? "" : "Telefone inválido (com DDD)",
    number: cardNumberValid(card.number, brand) ? "" : "Número do cartão inválido",
    name: nameValid(card.name) ? "" : "Informe nome e sobrenome",
    exp: expiryValid(card.exp) ? "" : "Validade inválida",
    cvc: cvcValid(card.cvc, brand) ? "" : "CVV inválido",
  };
  const baseValid = !errors.email && !errors.cpf && !errors.phone;
  const isValid =
    method === "card"
      ? baseValid &&
        !errors.number &&
        !errors.name &&
        !errors.exp &&
        !errors.cvc
      : baseValid;

  // ── Guards ──
  if (!pack) return <Navigate to="/" replace />;
  if (pack.free) return <Navigate to={`/pack/${pack.id}`} replace />;
  if (!user)
    return (
      <Navigate to="/login" state={{ from: `/checkout/${pack.id}` }} replace />
    );
  if (ownsPack(pack.id)) return <Navigate to={`/pack/${pack.id}`} replace />;

  // ── Handlers ──
  const blur = (f) => setTouched((t) => ({ ...t, [f]: true }));

  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code || couponLoading) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      // A API valida o cupom contra o pack e devolve o preço já recalculado.
      const { pricing } = await api.validateCoupon({ packId: pack.id, code });
      setAppliedCoupon(pricing.coupon || { code, label: "Cupom aplicado" });
      setServerPricing(pricing);
    } catch (err) {
      const msg =
        err?.code === "COUPON_INVALID"
          ? "Cupom inválido ou expirado"
          : (err?.message ?? "Não foi possível validar o cupom");
      setCouponError(msg);
      setAppliedCoupon(null);
      setServerPricing(null);
    } finally {
      setCouponLoading(false);
    }
  };
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setServerPricing(null);
    setCouponError("");
    setCouponInput("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (status === "processing") return;

    const t = { email: true, cpf: true, phone: true };
    if (method === "card")
      Object.assign(t, { number: true, name: true, exp: true, cvc: true });
    setTouched(t);
    if (!isValid) return;

    setStatus("processing");
    setSubmitError("");

    // Monta o payload pra API. CPF/telefone vão só com dígitos; o preço NÃO é
    // enviado — o servidor recalcula a partir do pack + cupom (cliente não dita
    // valor). O telefone é obrigatório na PradaPay.
    const payload = {
      packId: pack.id,
      paymentMethod: method,
      customer: {
        email: email.trim(),
        cpf: onlyDigits(cpf),
        phone: onlyDigits(phone),
      },
      ...(appliedCoupon ? { couponCode: appliedCoupon.code } : {}),
    };

    if (method === "card") {
      const digits = onlyDigits(card.number);
      const [mm = "", yy = ""] = card.exp.split("/");
      payload.installments = selN;
      if (nameValid(card.name)) payload.customer.name = card.name.trim();

      // Cartão CRU — exigido pela PradaPay (não há tokenização). Só é usado pelo
      // backend quando PRADAPAY_ENABLE_CARD=true; caso contrário ele recusa com
      // uma mensagem clara. PCI-DSS: ver README do backend.
      payload.card = {
        holder: card.name.trim(),
        number: digits,
        expMonth: mm.trim(),
        expYear: yy.trim(),
        cvv: onlyDigits(card.cvc),
      };
      // Token de demonstração — caminho usado pelo gateway mock (sem PAN cru).
      payload.cardToken = `tok_mock_${digits.slice(-4) || "0000"}_${Date.now()}`;
    }

    try {
      const { order, payment } = await api.createCheckoutSession(payload);
      // Fallbacks de exibição na página de retorno (resistem a refresh).
      writePending(pack.id);
      writePayment(order.id, payment);

      // Fluxo redirect (cartão/boleto na PradaPay): concluir no ambiente do
      // adquirente/banco. Ao voltar, a back_url cai em /compra/retorno.
      if (payment?.redirectUrl) {
        window.location.href = payment.redirectUrl;
        return;
      }

      // Pix / boleto inline (ou mock já aprovado): a página de retorno exibe o
      // QR/linha e faz polling do status real no servidor.
      navigate(`/compra/retorno?order=${order.id}`, { state: { payment } });
    } catch (err) {
      setStatus("idle");
      setSubmitError(
        err?.message ?? "Não foi possível concluir o pagamento. Tente de novo.",
      );
    }
  };

  // rótulos contextuais
  const payLabel =
    method === "card"
      ? `Pagar ${formatBRL(total)}`
      : method === "pix"
        ? "Gerar Pix"
        : "Gerar boleto";
  const installmentLabel =
    method === "card"
      ? selectedInstallment?.label
      : method === "pix"
        ? "Pix à vista · aprovação na hora"
        : "Boleto à vista · vence em 3 dias";

  const summary = (
    <OrderSummary
      pack={pack}
      subtotal={subtotal}
      discount={discount}
      total={total}
      couponInput={couponInput}
      onCouponInputChange={setCouponInput}
      appliedCoupon={appliedCoupon}
      couponError={couponError}
      onApplyCoupon={applyCoupon}
      onRemoveCoupon={removeCoupon}
      installmentLabel={installmentLabel}
    />
  );

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, ease: EASE },
      };

  return (
    <>
      <StoreNav />

      <main className="relative overflow-hidden">
        <Halftone className="opacity-40" />

        <div className="relative z-[2] mx-auto max-w-wrap px-6 pb-24 pt-8 sm:pt-12">
          <Link
            to={`/pack/${pack.id}`}
            className="font-util inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-faint transition-colors hover:text-bone"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar ao pack
          </Link>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-6"
          >
            <Eyebrow solo>Checkout seguro</Eyebrow>
            <h1 className="font-display mt-3 text-[44px] font-black leading-[0.9] sm:text-[54px]">
              Finalizar compra
            </h1>
          </motion.div>

          {/* resumo recolhível — mobile */}
          <div className="mt-7 lg:hidden">
            <button
              type="button"
              onClick={() => setSummaryOpen((v) => !v)}
              className="flex w-full items-center justify-between border border-line bg-panel px-4 py-3.5"
            >
              <span className="font-util text-[12px] uppercase tracking-[0.18em] text-ash">
                Resumo do pedido
              </span>
              <span className="flex items-center gap-2">
                <span className="font-display text-[20px] font-extrabold">
                  {formatBRL(total)}
                </span>
                <Chevron
                  className={`h-4 w-4 text-faint transition-transform ${summaryOpen ? "rotate-180" : ""}`}
                />
              </span>
            </button>
            {summaryOpen && <div className="mt-3">{summary}</div>}
          </div>

          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_390px]">
            {/* ── formulário ── */}
            <form onSubmit={submit} className="min-w-0">
              {/* 01 — dados */}
              <section className="border border-line bg-panel p-6 sm:p-7">
                <SectionTitle n="01">Seus dados</SectionTitle>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <CheckoutInput
                      label="E-mail"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      onBlur={() => blur("email")}
                      show={touched.email}
                      error={errors.email}
                      placeholder="voce@email.com"
                      autoComplete="email"
                      inputMode="email"
                      hint="recibo e acesso"
                    />
                  </div>
                  <CheckoutInput
                    label="CPF"
                    value={cpf}
                    onChange={(v) => setCpf(maskCPF(v))}
                    onBlur={() => blur("cpf")}
                    show={touched.cpf}
                    error={errors.cpf}
                    placeholder="000.000.000-00"
                    inputMode="numeric"
                    maxLength={14}
                  />
                  <CheckoutInput
                    label="Celular"
                    value={phone}
                    onChange={(v) => setPhone(maskPhone(v))}
                    onBlur={() => blur("phone")}
                    show={touched.phone}
                    error={errors.phone}
                    placeholder="(11) 90000-0000"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={16}
                    hint="confirmação do pagamento"
                  />
                </div>
              </section>

              {/* 02 — pagamento */}
              <section className="mt-5 border border-line bg-panel p-6 sm:p-7">
                <SectionTitle n="02">Pagamento</SectionTitle>

                <div className="flex gap-2.5">
                  <MethodTab
                    active={method === "card"}
                    onClick={() => setMethod("card")}
                    icon={Card}
                    label="Cartão"
                  />
                  <MethodTab
                    active={method === "pix"}
                    onClick={() => setMethod("pix")}
                    icon={QrCode}
                    label="Pix"
                  />
                  <MethodTab
                    active={method === "boleto"}
                    onClick={() => setMethod("boleto")}
                    icon={Barcode}
                    label="Boleto"
                  />
                </div>

                {/* cartão */}
                {method === "card" && (
                  <motion.div {...fade} className="mt-6 grid gap-4">
                    <CheckoutInput
                      label="Número do cartão"
                      value={card.number}
                      onChange={(v) => {
                        const b = detectBrand(v);
                        setCard((c) => ({ ...c, number: maskCardNumber(v, b) }));
                      }}
                      onBlur={() => blur("number")}
                      show={touched.number}
                      error={errors.number}
                      placeholder="0000 0000 0000 0000"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      maxLength={19}
                      right={
                        brand ? (
                          <span className="font-util border border-line px-1.5 py-0.5 text-[9px] uppercase tracking-[0.1em] text-ash">
                            {brandLabel(brand)}
                          </span>
                        ) : null
                      }
                    />
                    <CheckoutInput
                      label="Nome no cartão"
                      value={card.name}
                      onChange={(v) => setCard((c) => ({ ...c, name: v }))}
                      onBlur={() => blur("name")}
                      show={touched.name}
                      error={errors.name}
                      placeholder="Como está impresso"
                      autoComplete="cc-name"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <CheckoutInput
                        label="Validade"
                        value={card.exp}
                        onChange={(v) =>
                          setCard((c) => ({ ...c, exp: maskExpiry(v) }))
                        }
                        onBlur={() => blur("exp")}
                        show={touched.exp}
                        error={errors.exp}
                        placeholder="MM/AA"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        maxLength={5}
                      />
                      <CheckoutInput
                        label="CVV"
                        value={card.cvc}
                        onChange={(v) =>
                          setCard((c) => ({
                            ...c,
                            cvc: onlyDigits(v).slice(0, cvcLength(brand)),
                          }))
                        }
                        onBlur={() => blur("cvc")}
                        show={touched.cvc}
                        error={errors.cvc}
                        placeholder={brand === "amex" ? "0000" : "000"}
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        maxLength={4}
                      />
                    </div>

                    {/* parcelas */}
                    <label className="block">
                      <span className="font-util mb-2 block text-[11px] uppercase tracking-[0.2em] text-faint">
                        Parcelas
                      </span>
                      <div className="relative">
                        <select
                          value={selN}
                          onChange={(e) =>
                            setInstallments(Number(e.target.value))
                          }
                          className="w-full appearance-none border border-line bg-ink px-4 py-3 pr-10 text-[15px] text-bone focus:border-blood focus:outline-none"
                        >
                          {installmentList.map((opt) => (
                            <option
                              key={opt.n}
                              value={opt.n}
                              className="bg-panel text-bone"
                            >
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <Chevron className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
                      </div>
                    </label>
                  </motion.div>
                )}

                {/* pix */}
                {method === "pix" && (
                  <motion.div {...fade} className="mt-6">
                    <MethodInfo
                      icon={QrCode}
                      title="Pagamento via Pix"
                      note="QR válido por 30 min"
                    >
                      Ao confirmar, geramos o QR Code e o código copia e cola. É
                      só abrir o app do seu banco, pagar, e o pack libera na hora
                      — esta tela acompanha a confirmação sozinha.
                    </MethodInfo>
                  </motion.div>
                )}

                {/* boleto */}
                {method === "boleto" && (
                  <motion.div {...fade} className="mt-6">
                    <MethodInfo icon={Barcode} title="Pagamento via boleto">
                      Ao confirmar, geramos o boleto com código de barras e PDF
                      para download. Vence em 3 dias úteis; a compensação leva
                      até 2 dias e o pack libera automaticamente quando o
                      pagamento cair.
                    </MethodInfo>
                  </motion.div>
                )}
              </section>

              {/* CTA */}
              <div className="mt-6">
                {submitError && (
                  <div className="mb-4 border border-blood/50 bg-blood/10 px-4 py-3 text-[13px] text-bone">
                    {submitError}
                  </div>
                )}
                <Button type="submit" full disabled={status === "processing"}>
                  {status === "processing" ? (
                    <>
                      <Spinner
                        className={`h-4 w-4 ${reduce ? "" : "animate-spin"}`}
                      />
                      Processando…
                    </>
                  ) : (
                    payLabel
                  )}
                </Button>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-faint">
                  <span className="font-util inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em]">
                    <Shield className="h-3.5 w-3.5" /> Compra 100% segura
                  </span>
                  <span className="font-util inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em]">
                    <Check className="h-3.5 w-3.5" /> Garantia de 7 dias
                  </span>
                </div>
                <p className="font-util mt-3 text-center text-[10px] uppercase tracking-[0.12em] text-faint/70">
                  Pagamento processado com segurança pelo nosso gateway
                </p>
              </div>
            </form>

            {/* ── resumo (desktop, sticky) ── */}
            <aside className="hidden lg:block">
              <div className="lg:sticky lg:top-[90px]">{summary}</div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
