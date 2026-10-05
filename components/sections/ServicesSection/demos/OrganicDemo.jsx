import useCountUp from "../hooks/useCountUp";
import styles from "./OrganicDemo.module.scss";

const METRICS = [
  { label: "Visitas", value: 1240, delay: 1100 },
  { label: "Cliques", value: 86, delay: 1300 },
  { label: "Leads", value: 12, delay: 1500, highlight: true },
];

const FLOW = ["Conteúdo", "Google", "Site", "Lead"];

// curva de crescimento (viewBox 300 x 60)
const TREND = "M0 52 C30 50 45 46 70 44 S110 40 130 34 S170 30 190 22 S240 14 260 9 S290 4 300 3";

const format = (n) => n.toLocaleString("pt-BR");

function Metric({ label, value, delay, highlight, index }) {
  const current = useCountUp(value, { delay, duration: 2000 });
  return (
    <div
      className={`${styles.metric} ${highlight ? styles.highlight : ""}`}
      style={{ "--i": index }}
    >
      <span className={styles.metricLabel}>{label}</span>
      <strong className={styles.metricValue}>{format(current)}</strong>
    </div>
  );
}

/**
 * Demo 04 — visitas orgânicas crescendo (sem anúncios), métricas
 * subindo e o caminho Conteúdo → Google → Site → Lead acendendo.
 */
export default function OrganicDemo() {
  return (
    <div className={styles.demo} aria-hidden="true">
      <div className={styles.panel}>
        <div className={styles.head}>
          <span className={styles.live} />
          <div className={styles.headText}>
            <strong>Tráfego orgânico</strong>
            <span>Últimos 30 dias · sem anúncios</span>
          </div>
          <span className={styles.growth}>↑ 64%</span>
        </div>

        <svg className={styles.chart} viewBox="0 0 300 60" preserveAspectRatio="none">
          <defs>
            <linearGradient id="organic-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#66418b" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#66418b" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className={styles.area} d={`${TREND} V60 H0 Z`} />
          <path className={styles.trend} d={TREND} pathLength="1" />
        </svg>

        <div className={styles.metrics}>
          {METRICS.map((metric, i) => (
            <Metric key={metric.label} index={i} {...metric} />
          ))}
        </div>
      </div>

      <div className={styles.flow}>
        <span className={styles.track}>
          <span className={styles.fill} />
        </span>
        {FLOW.map((label, i) => (
          <span key={label} className={styles.node} style={{ "--i": i }}>
            <span className={styles.nodeDot} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
