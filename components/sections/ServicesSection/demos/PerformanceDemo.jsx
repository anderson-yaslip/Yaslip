import useCountUp from "../hooks/useCountUp";
import styles from "./PerformanceDemo.module.scss";

const SCORE = 98;
const CHECKS = ["Velocidade", "SEO", "Mobile", "Experiência"];

// círculo do indicador: r = 34 → circunferência ≈ 213.6
const RADIUS = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Demo 05 — página carrega rápido, nota de performance sobe
 * até 98 e os indicadores recebem checks em sequência.
 */
export default function PerformanceDemo() {
  const score = useCountUp(SCORE, { delay: 1700, duration: 1400 });

  return (
    <div className={styles.demo} aria-hidden="true">
      <div className={styles.browser}>
        <div className={styles.chrome}>
          <span className={styles.url}>seunegocio.com.br</span>
          <span className={styles.time}>0,8s</span>
        </div>
        <span className={styles.loader} />
        <div className={styles.page}>
          <span className={styles.block} />
          <span className={styles.lines}>
            <i />
            <i />
          </span>
          <span className={styles.thumbs}>
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>

      <div className={styles.report}>
        <div className={styles.gauge}>
          <svg viewBox="0 0 80 80" width="80" height="80">
            <defs>
              <linearGradient id="perf-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#66418b" />
                <stop offset="100%" stopColor="#9900cc" />
              </linearGradient>
            </defs>
            <circle className={styles.gaugeTrack} cx="40" cy="40" r={RADIUS} />
            <circle
              className={styles.gaugeFill}
              cx="40"
              cy="40"
              r={RADIUS}
              style={{
                "--circ": CIRCUMFERENCE,
                "--target": CIRCUMFERENCE * (1 - SCORE / 100),
              }}
            />
          </svg>
          <strong className={styles.score}>{score}</strong>
        </div>

        <ul className={styles.checks}>
          {CHECKS.map((label, i) => (
            <li key={label} style={{ "--i": i }}>
              <span className={styles.tick}>
                <svg viewBox="0 0 12 12" width="10" height="10">
                  <path d="M2.5 6.2 5 8.5l4.5-5" />
                </svg>
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.done}>
        <span>⚡</span> Performance otimizada
      </div>
    </div>
  );
}
