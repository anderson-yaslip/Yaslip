import ScrollToTop from "@/components/ui/ScrollToTop/ScrollToTop";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat/WhatsAppFloat";
import styles from "./FloatingActions.module.scss";

// Uma coluna fixa no canto: WhatsApp em cima, "voltar ao topo" embaixo.
// Por estarem no mesmo fluxo, nunca ficam um por cima do outro.
export default function FloatingActions() {
  return (
    <div className={styles.stack}>
      <WhatsAppFloat />
      <ScrollToTop />
    </div>
  );
}
