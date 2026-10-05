const ICONS = {
  sites: (
    <>
      <rect x="2" y="3" width="12" height="10" rx="2" />
      <path d="M2 6h12" />
    </>
  ),
  landing: (
    <>
      <rect x="4" y="1.5" width="8" height="13" rx="1.6" />
      <path d="M6 5h4M6 8h4M6 11h2" />
    </>
  ),
  seo: (
    <>
      <circle cx="7" cy="7" r="4.2" />
      <path d="m10.2 10.2 3.3 3.3" />
    </>
  ),
  organic: (
    <>
      <path d="M2 13.5h12" />
      <path d="m2.5 10.5 3.5-3.5 2.5 2.5 5-5" />
      <path d="M10 4.5h3.5V8" />
    </>
  ),
  performance: <path d="M9 1.5 3.5 9h4L7 14.5 12.5 7h-4L9 1.5Z" />,
};

/** Ícone 16x16 de cada serviço (traço usa currentColor). */
export default function ServiceIcon({ name }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}
