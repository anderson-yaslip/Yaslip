import { SITE_URL, whatsappUrl } from "@/lib/site";
import styles from "./Hero.module.scss";

const LEFT_CARDS = [
  "Landing pages desenvolvidas para gerar oportunidades.",
  "Design que fortalece a presença da sua empresa.",
  "Cada detalhe pensado para virar contato.",
  "Site moderno, rápido e preparado para converter.",
  "Estratégia digital pensada desde o primeiro clique.",
];

const RIGHT_CARDS = [
  "Páginas leves que carregam em poucos segundos.",
  "Do primeiro acesso ao primeiro orçamento.",
  "Presença digital com acabamento profissional.",
  "Tecnologia aplicada para transformar acessos em contatos.",
  "Sites responsivos preparados para qualquer dispositivo.",
];

const TILTS = [-3, 2, -1.5, 2.5, -2];

// Cópias idênticas da lista. A animação desloca exatamente uma cópia (1/4 da
// faixa), então o loop não tem emenda e sempre há cards cobrindo telas altas/largas.
const COPIES = 4;

function CardColumn({ items, side }) {
  return (
    <div className={`${styles.column} ${styles[side]}`} aria-hidden="true">
      <div className={styles.track}>
        {Array.from({ length: COPIES }, (_, copy) => (
          <div key={copy} className={styles.group}>
            {items.map((text, i) => (
              <figure
                key={i}
                className={styles.card}
                style={{ "--tilt": `${TILTS[i % TILTS.length] * (side === "right" ? -1 : 1)}deg` }}
              >
                <span className={styles.quote}>”</span>
                <blockquote>{text}</blockquote>
                <figcaption>— Yaslip</figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.beam} aria-hidden="true" />

      <div className={styles.cards}>
        <CardColumn items={LEFT_CARDS} side="left" />
        <CardColumn items={RIGHT_CARDS} side="right" />
      </div>

      <div className={styles.content} data-transition-content>
        <span className={styles.badge}>
          <span className={styles.dot} />
          Seu site na 1ª página do Google
        </span>

        <h1 className={styles.title}>
          <span className="initial">S</span>ua empresa merece mais do que apenas um site.{" "}
          <span className={styles.highlight}>Merece uma presença digital que gera resultados.</span>
        </h1>

        <p className={styles.lead}>
          A Yaslip une design, tecnologia, SEO e estratégia para transformar sua presença digital
          em novas oportunidades de negócio.
        </p>

        <div className={styles.actions}>
          <a className={styles.primary} href={whatsappUrl("hero")} target="_blank" rel="noopener noreferrer">
            Falar no WhatsApp
            <span className={styles.arrow} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </a>
          <a className={styles.secondary} href={SITE_URL} target="_blank" rel="noopener noreferrer">
            Conhecer a Yaslip
          </a>
        </div>

        {/* No celular os cards aparecem só aqui, abaixo dos botões. */}
        <div className={styles.mobileCards}>
          <CardColumn items={[...LEFT_CARDS, ...RIGHT_CARDS]} side="right" />
        </div>
      </div>
    </section>
  );
}
