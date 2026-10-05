"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./ScrollToTop.module.scss";

const SHOW_AFTER = 500;

export default function ScrollToTop() {
  const slotRef = useRef(null);
  const buttonRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const slot = slotRef.current;
    const button = buttonRef.current;
    const ring = progressRef.current;
    let raf = 0;
    let visible = null;

    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, scrollTop / max)) : 0;

      // pathLength = 100, então o offset é direto em porcentagem.
      ring.style.strokeDashoffset = String(100 - progress * 100);
      // Com linecap round, 0% ainda desenharia um ponto; escondemos nesse caso.
      ring.style.opacity = progress > 0.004 ? "1" : "0";

      const shouldShow = scrollTop > SHOW_AFTER;
      if (shouldShow !== visible) {
        visible = shouldShow;
        slot.dataset.visible = String(shouldShow);
        button.tabIndex = shouldShow ? 0 : -1;
        button.setAttribute("aria-hidden", String(!shouldShow));
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // A altura da página muda (imagens, fontes); recalcula o progresso.
    const ro = new ResizeObserver(onScroll);
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    // O espaço (slot) abre quando o botão aparece e fecha quando some,
    // então o WhatsApp acima dele desce/sobe junto, sem sobrepor.
    <div ref={slotRef} className={styles.slot} data-visible="false">
    <button
      ref={buttonRef}
      type="button"
      className={styles.scrollTop}
      onClick={goTop}
      aria-label="Voltar ao topo"
      title="Voltar ao topo"
      tabIndex={-1}
      aria-hidden="true"
    >
      <svg className={styles.ring} viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <linearGradient id="stt-progress" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff4fd8" />
            <stop offset="55%" stopColor="#f542c8" />
            <stop offset="100%" stopColor="#e93dcc" />
          </linearGradient>
        </defs>
        {/* Trilha e progresso: mesmo centro, mesmo raio, mesma espessura. */}
        <circle className={styles.track} cx="50" cy="50" r="46" />
        <circle
          ref={progressRef}
          className={styles.progress}
          cx="50"
          cy="50"
          r="46"
          pathLength="100"
          stroke="url(#stt-progress)"
        />
      </svg>

      <span className={styles.core}>
        <span className={styles.logo}>
          <Image src="/images/logo-yaslip.png" alt="" width={309} height={123} sizes="60px" />
        </span>
        <svg className={styles.arrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 19V5M6 11l6-6 6 6" />
        </svg>
      </span>
    </button>
    </div>
  );
}
