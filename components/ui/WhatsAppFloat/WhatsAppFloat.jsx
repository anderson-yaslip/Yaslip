import { WHATSAPP_FLOAT_URL } from "@/lib/site";
import styles from "./WhatsAppFloat.module.scss";

// Botão fixo de WhatsApp, logo abaixo do "voltar ao topo".
export default function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_FLOAT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.float}
      aria-label="Falar com a Yaslip pelo WhatsApp"
      title="Falar pelo WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Zm4.4 12.5c-.2.5-1.1 1-1.6 1-.4.1-.9.1-2.9-.7-2.4-1-4-3.4-4.1-3.6-.1-.2-1-1.3-1-2.4s.6-1.7.8-1.9c.2-.2.5-.3.6-.3h.5c.2 0 .4 0 .6.4l.8 2c.1.2.1.3 0 .5l-.3.4-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1.1.9 2 1.2 2.3 1.3.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.2Z" />
      </svg>
    </a>
  );
}
