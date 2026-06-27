// Ícones inline no mesmo padrão do resto do projeto (viewBox 24, stroke 2,
// cantos retos). Sem dependência de biblioteca de ícones.
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
}

export const Lock = (props) => (
  <svg {...base} {...props}>
    <rect x="4.5" y="10.5" width="15" height="10" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
  </svg>
)

export const Shield = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)

export const Card = (props) => (
  <svg {...base} {...props}>
    <rect x="2.5" y="5" width="19" height="14" />
    <path d="M2.5 9.5h19" />
    <path d="M6 14.5h4" />
  </svg>
)

export const QrCode = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <path d="M14 14h3v3M21 14v0M17 21h4v-4M14 21h0" />
  </svg>
)

export const Barcode = (props) => (
  <svg {...base} {...props}>
    <path d="M4 6v12M8 6v12M11 6v12M14 6v12M17 6v12M20 6v12" />
  </svg>
)

export const Check = (props) => (
  <svg {...base} {...props}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </svg>
)

export const Copy = (props) => (
  <svg {...base} {...props}>
    <rect x="9" y="9" width="11" height="11" />
    <path d="M5 15H4V4h11v1" />
  </svg>
)

export const Chevron = (props) => (
  <svg {...base} {...props}>
    <path d="M6 9l6 6 6-6" />
  </svg>
)

export const ArrowLeft = (props) => (
  <svg {...base} {...props}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
)

export const Spinner = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)
