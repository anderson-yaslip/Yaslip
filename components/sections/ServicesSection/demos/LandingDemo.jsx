import styles from "./LandingDemo.module.scss";

/**
 * Demo 02 — landing page vertical; cada bloco-chave é destacado
 * em sequência (Headline → CTA → Formulário → Conversão) e no
 * final aparece o indicador de crescimento.
 */
const Marker = ({ step, children }) => (
  <span className={styles.marker} style={{ "--step": step }}>
    <b>{step}</b>
    {children}
  </span>
);

export default function LandingDemo() {
  return (
    <div className={styles.demo} aria-hidden="true">
      <div className={styles.stack}>
        <div className={styles.phone}>
          <div
            className={`${styles.block} ${styles.headline}`}
            style={{ "--step": 1 }}
          >
            <p>Mais clientes em 30 dias</p>
            <span className={styles.line} />
            <Marker step={1}>Headline</Marker>
          </div>

          <div
            className={`${styles.block} ${styles.ctaBlock}`}
            style={{ "--step": 2 }}
          >
            <span className={styles.cta}>Quero saber mais</span>
            <Marker step={2}>CTA</Marker>
          </div>

          <div className={styles.proof}>
            <span className={styles.avatars}>
              <i />
              <i />
              <i />
            </span>
            <span className={styles.stars}>★★★★★</span>
          </div>

          <div
            className={`${styles.block} ${styles.form}`}
            style={{ "--step": 3 }}
          >
            <span className={styles.input}>
              <i />
            </span>
            <span className={styles.input}>
              <i />
            </span>
            <span className={styles.submit}>Enviar</span>
            <Marker step={3}>Formulário</Marker>
          </div>

          <ul className={styles.benefits}>
            <li />
            <li />
            <li />
          </ul>
        </div>

        <div className={styles.result}>
          <span className={styles.resultLabel}>Conversão</span>
          <strong>
            <span className={styles.arrow}>↑</span> +38%
          </strong>
          <span className={styles.leads}>+ Leads</span>
        </div>
      </div>
    </div>
  );
}
