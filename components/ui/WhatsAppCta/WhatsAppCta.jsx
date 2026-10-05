import { whatsappUrl } from "@/lib/site";
import styles from "./WhatsAppCta.module.scss";

/**
 * CTA de WhatsApp com três intensidades:
 * - "primary":   botão cheio (#9900CC), para seções comerciais;
 * - "secondary": contorno roxo, menor, depois de seções de explicação;
 * - "link":      link contextual pequeno, para seções visuais/animadas.
 * `tone="dark"` ajusta as cores para fundos escuros.
 * `message` é a chave da mensagem pré-preenchida em lib/site.js.
 */
export default function WhatsAppCta({
  children,
  message = "hero",
  variant = "link",
  tone = "light",
  className = "",
}) {
  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.cta} ${styles[variant]} ${styles[tone]} ${className}`}
    >
      <span>{children}</span>
      <svg className={styles.arrow} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </a>
  );
}
