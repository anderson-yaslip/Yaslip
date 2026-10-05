const ICONS = {
  // lupa sobre gráfico — análise
  analysis: (
    <>
      <circle cx="7" cy="7" r="4.5" />
      <path d="m10.3 10.3 3.2 3.2M5 8.2V7.4M7 8.2V5.8M9 8.2V6.8" />
    </>
  ),
  // alvo — estratégia
  strategy: (
    <>
      <circle cx="8" cy="8" r="5.8" />
      <circle cx="8" cy="8" r="2.6" />
      <circle cx="8" cy="8" r="0.4" />
    </>
  ),
  // código — desenvolvimento
  development: <path d="M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5M9 3 7 13" />,
  // globo — site no ar
  launch: (
    <>
      <circle cx="8" cy="8" r="6" />
      <path d="M2 8h12M8 2c1.8 1.7 2.7 3.7 2.7 6S9.8 12.3 8 14C6.2 12.3 5.3 10.3 5.3 8S6.2 3.7 8 2Z" />
    </>
  ),
  check: <path d="m3.5 8.3 2.8 2.7 6.2-6.3" />,
};

/** Ícones 16x16 da DigitalFlow (traço em currentColor). */
export default function FlowIcon({ name, size = 16 }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}
