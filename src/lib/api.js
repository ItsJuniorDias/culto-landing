// Cliente da API de checkout (backend CULTO — Fastify).
//
// Centraliza todas as chamadas ao servidor num lugar só. A URL base vem de
// VITE_API_URL (.env); em dev cai no localhost:3333. Tudo aqui devolve o JSON
// já tratado e, em erro, lança um Error com a mensagem que o backend mandou
// (o backend responde { error: { code, message, details } }).

const RAW_BASE = import.meta.env.VITE_API_URL || "http://localhost:3333";
// Remove barra final pra não gerar "//api/...".
export const API_BASE = RAW_BASE.replace(/\/+$/, "");

/** Erro de API com o código do backend anexado (ex.: COUPON_INVALID, PACK_NOT_FOUND). */
export class ApiError extends Error {
  constructor(message, { code, status, details } = {}) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

async function request(path, { method = "GET", body, signal } = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch {
    // Falha de rede / servidor fora do ar.
    throw new ApiError(
      "Não foi possível falar com o servidor. Ele está rodando?",
      {
        code: "NETWORK_ERROR",
      },
    );
  }

  // 204 ou corpo vazio.
  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const err = data?.error || {};
    throw new ApiError(err.message || `Erro ${res.status}.`, {
      code: err.code,
      status: res.status,
      details: err.details,
    });
  }
  return data;
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export const api = {
  /** Catálogo com preços vindos do servidor (fonte da verdade). */
  getCatalog: (signal) => request("/api/catalog", { signal }),

  /** Detalhe de um pack. */
  getPack: (id, signal) =>
    request(`/api/catalog/${encodeURIComponent(id)}`, { signal }),

  /**
   * Valida um cupom contra um pack e devolve o preço já recalculado.
   * Retorna { valid, pricing }.
   */
  validateCoupon: ({ packId, code }, signal) =>
    request("/api/coupons/validate", {
      method: "POST",
      body: { packId, code },
      signal,
    }),

  /**
   * Cria a sessão de checkout (pedido + cobrança no gateway).
   * Retorna { order, payment, returnUrl }.
   */
  createCheckoutSession: (payload, signal) =>
    request("/api/checkout/sessions", {
      method: "POST",
      body: payload,
      signal,
    }),

  /** Estado atual do pedido (retorno + polling do Pix/boleto). Retorna { order }. */
  getCheckoutSession: (id, signal) =>
    request(`/api/checkout/sessions/${encodeURIComponent(id)}`, { signal }),

  /**
   * [DEV] Simula o webhook do gateway confirmando/alterando o pagamento.
   * Só funciona quando o backend está em modo mock + ENABLE_DEV_ROUTES.
   */
  simulateWebhook: ({ orderId, status }, signal) =>
    request("/api/dev/simulate-webhook", {
      method: "POST",
      body: { orderId, status },
      signal,
    }),
};

// Reais a partir de centavos (o backend trabalha em centavos inteiros).
export const centsToReais = (cents) => (Number(cents) || 0) / 100;
