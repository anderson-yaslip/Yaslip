import styles from "./SitesDemo.module.scss";

/**
 * Demo 01 — uma página vazia ganha header, título, texto,
 * CTA e imagem; o cursor clica no botão e chega um contato.
 * Toda a linha do tempo está no SCSS (animation-delay).
 */
export default function SitesDemo() {
  return (
    <div className={styles.demo} aria-hidden="true">
      <div className={styles.browser}>
        <div className={styles.chrome}>
          <span className={styles.dots}>
            <i />
            <i />
            <i />
          </span>
          <span className={styles.url}>seunegocio.com.br</span>
        </div>

        <div className={styles.page}>
          <span className={styles.empty}>página em branco</span>

          <header className={styles.header}>
            <span className={styles.logo} />
            <span className={styles.nav}>
              <i />
              <i />
              <i />
            </span>
          </header>

          <div className={styles.hero}>
            <div className={styles.copy}>
              <p className={styles.title}>
                Seu negócio merece um site que vende.
              </p>
              <span className={styles.text}>
                <i />
                <i />
              </span>
              <span className={styles.ctaWrap}>
                <span className={styles.cta}>Quero meu site</span>
                <span className={styles.ripple} />
                <svg
                  className={styles.cursor}
                  viewBox="0 0 16 20"
                  width="16"
                  height="20"
                >
                  <path d="M1 1v15l4-3.6 2.6 6 2.4-1-2.6-5.9H13L1 1Z" />
                </svg>
              </span>
            </div>
            <div className={styles.visual}>
              <span className={styles.sun} />
              <span className={styles.hill} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.toast}>
        <span className={styles.check}>✓</span>
        Novo contato recebido
      </div>
    </div>
  );
}
