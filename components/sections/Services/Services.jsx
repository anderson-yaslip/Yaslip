import Image from "next/image";
import WhatsAppCta from "@/components/ui/WhatsAppCta/WhatsAppCta";
import styles from "./Services.module.scss";

// Coordenadas no viewBox 1200 x 440. O lado direito é o espelho do esquerdo.
const VB_W = 1200;
const VB_H = 440;

const PATHS = {
  outer:
    "M600,220 C470,130 300,50 189,50 C90,50 40,130 40,220 C40,310 90,391 189,391 C300,391 470,310 600,220",
  inner:
    "M600,220 C540,170 440,135 370,135 C310,135 282,175 282,220 C282,265 310,305 370,305 C440,305 540,270 600,220",
  crossTop: "M85,77 C260,110 450,170 600,220",
  crossBottom: "M85,363 C260,330 450,270 600,220",
};

const NODES = [
  { label: "1 Página", x: 85, y: 77, side: "in" },
  { label: "Sem Custo por Click", x: 282, y: 220, side: "in" },
  { label: "SEO", x: 85, y: 363, side: "in" },
  { label: "Mais Visibilidade", x: 1115, y: 77, side: "out" },
  { label: "Tráfego Orgânico", x: 918, y: 220, side: "out" },
  { label: "Encontrado no Google", x: 1115, y: 363, side: "out" },
];

// Pontos que viajam pelas curvas: [path, duração, atraso, reverso, destaque]
const DOTS = [
  ["outer", 9, 0, false, false],
  ["outer", 9, -4.5, false, true],
  ["inner", 6, -1, true, true],
  ["crossTop", 4.5, 0, false, true],
  ["crossBottom", 5, -2.5, false, false],
];

// Versão vertical (celular): mesmo desenho girado, trocando x por y.
// O eixo vertical é comprimido (V_K) para o diagrama caber numa tela de celular.
const V_K = 0.6;
const V_H = VB_W * V_K;
const transpose = (d) =>
  d.replace(/(-?[\d.]+),(-?[\d.]+)/g, (_, x, y) => `${y},${(x * V_K).toFixed(1)}`);
const PATHS_V = Object.fromEntries(Object.entries(PATHS).map(([k, d]) => [k, transpose(d)]));

function Side({ id, paths = PATHS }) {
  return (
    <g>
      {Object.entries(paths).map(([key, d]) => (
        <path key={key} id={`${id}-${key}`} d={d} className={styles.curve} />
      ))}
      {DOTS.map(([key, dur, begin, reverse, accent], i) => (
        <circle key={i} r={accent ? 5 : 3.6} className={accent ? styles.dotAccent : styles.dot}>
          <animateMotion
            dur={`${dur}s`}
            begin={`${begin}s`}
            repeatCount="indefinite"
            keyPoints={reverse ? "1;0" : "0;1"}
            keyTimes="0;1"
            calcMode="linear"
          >
            <mpath href={`#${id}-${key}`} />
          </animateMotion>
        </circle>
      ))}
    </g>
  );
}

export function LogoOrb({ className = "" }) {
  return (
    <div className={`${styles.orb} ${className}`}>
      <span className={styles.orbDashed} aria-hidden="true" />
      <span className={styles.orbPulse} aria-hidden="true" />
      <span className={styles.orbRing} aria-hidden="true" />
      <span className={styles.orbCore}>
        <Image src="/images/logo-yaslip.png" alt="Yaslip" width={309} height={123} sizes="120px" />
      </span>
    </div>
  );
}


export default function Services() {
  return (
    <section id="servicos" className={styles.services} data-header-theme="dark">
      <div className={styles.inner}>
        <header className={styles.head}>
          <div>
            <p className={styles.eyebrow}>Marketing operacional para internet</p>
            <h2 className={styles.title}>
              <span className="initial">T</span>ransformamos cliques em páginas que geram <span>clientes.</span>
            </h2>
          </div>
          <p className={styles.lead}>
            Criamos sites e landing pages pensadas para atrair, convencer e converter, unindo
            design, performance e estratégia.
          </p>
        </header>

        <div className={styles.diagram}>
          <svg
            className={styles.svg}
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <Side id="l" />
            <g transform={`translate(${VB_W} 0) scale(-1 1)`}>
              <Side id="r" />
            </g>
          </svg>

          {NODES.map((node) => (
            <span
              key={node.label}
              className={`${styles.pill} ${node.side === "out" && node.y !== 220 ? styles.pillActive : ""}`}
              style={{ left: `${(node.x / VB_W) * 100}%`, top: `${(node.y / VB_H) * 100}%`, "--pct": (node.x / VB_W) * 100 }}
            >
              {node.label}
            </span>
          ))}

          <LogoOrb className={styles.center} />
        </div>

        {/* Celular: o mesmo diagrama na vertical (entradas em cima, resultados embaixo) */}
        <div className={`${styles.diagram} ${styles.diagramV}`}>
          <svg
            className={styles.svg}
            viewBox={`0 0 ${VB_H} ${V_H}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <Side id="vt" paths={PATHS_V} />
            <g transform={`translate(0 ${V_H}) scale(1 -1)`}>
              <Side id="vb" paths={PATHS_V} />
            </g>
          </svg>

          {NODES.map((node) => (
            <span
              key={node.label}
              className={`${styles.pill} ${node.side === "out" && node.y !== 220 ? styles.pillActive : ""} ${
                node.y !== 220 ? `${styles.pillEdge} ${node.y < 220 ? styles.pillEdgeA : styles.pillEdgeB}` : ""
              }`}
              style={{ left: `${(node.y / VB_H) * 100}%`, top: `${(node.x / VB_W) * 100}%`, "--pct": (node.y / VB_H) * 100 }}
            >
              {node.label}
            </span>
          ))}

          <LogoOrb className={styles.center} />
        </div>

        <div className={styles.cta}>
          <WhatsAppCta variant="secondary" tone="dark" message="conversion">
            Quero falar com a Yaslip
          </WhatsAppCta>
        </div>
      </div>
    </section>
  );
}
