import useSteps from "../hooks/useSteps";
import useTypewriter from "../hooks/useTypewriter";
import styles from "./SeoDemo.module.scss";

const QUERY = "empresa de criação de sites";
const COMPETITORS = [
  "agenciaexemplo.com.br",
  "sitesrapidos.com",
  "criarsite.net",
];

// Instantes (ms): resultados aparecem, Yaslip sobe 3 posições, selo final
const TIMELINE = [1750, 2600, 3200, 3800, 4300];

/**
 * Demo 03 — busca digitada → resultados → a Yaslip sobe
 * da 4ª para a 1ª posição (pesquisa → otimização → posição).
 */
export default function SeoDemo() {
  const { typed, done } = useTypewriter(QUERY, { delay: 350, speed: 42 });
  const step = useSteps(TIMELINE);

  const showResults = step >= 1;
  const yaslipPos = Math.max(3 - Math.max(step - 1, 0), 0); // 3 → 0
  const ranked = step >= 5;

  // concorrentes ocupam as posições livres, na ordem original
  const competitorPos = [0, 1, 2, 3].filter((p) => p !== yaslipPos);

  return (
    <div className={styles.demo} aria-hidden="true">
      <div className={styles.search}>
        <svg viewBox="0 0 16 16" width="15" height="15" className={styles.icon}>
          <circle cx="7" cy="7" r="4.5" />
          <path d="m10.5 10.5 3.5 3.5" />
        </svg>
        <span className={styles.query}>
          {typed}
          {!done && <span className={styles.caret} />}
        </span>
        <span className={`${styles.enter} ${done ? styles.enterOn : ""}`}>
          ↵
        </span>
      </div>

      <div className={`${styles.results} ${showResults ? styles.visible : ""}`}>
        <div className={styles.meta}>
          <span>Resultados</span>
          <span
            className={`${styles.status} ${ranked ? styles.statusDone : ""}`}
          >
            {ranked ? "1ª posição ✓" : "Otimizando SEO…"}
          </span>
        </div>

        <ol className={styles.list}>
          {COMPETITORS.map((site, i) => (
            <li
              key={site}
              className={styles.row}
              style={{ "--pos": competitorPos[i] }}
            >
              <span className={styles.favicon} />
              <span className={styles.rowBody}>
                <span className={styles.site}>{site}</span>
                <span className={styles.skeletonTitle} />
                <span className={styles.skeletonText} />
              </span>
            </li>
          ))}

          <li
            className={`${styles.row} ${styles.yaslip} ${ranked ? styles.top : ""}`}
            style={{ "--pos": yaslipPos }}
          >
            <span className={`${styles.favicon} ${styles.brand}`}>Y</span>
            <span className={styles.rowBody}>
              <span className={styles.site}>yaslip.com.br</span>
              <span className={styles.resultTitle}>
                Yaslip · Criação de Sites Profissionais
              </span>
              <span className={styles.resultText}>
                Sites rápidos, estratégicos e preparados para o Google.
              </span>
            </span>
            <span className={styles.badge}>Top 1</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
