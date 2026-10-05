"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CONTACT, SOCIAL, whatsappUrl } from "@/lib/site";
import WhatsAppCta from "@/components/ui/WhatsAppCta/WhatsAppCta";
import styles from "./Footer.module.scss";

const MENU = [
  { href: "#inicio", label: "Início" },
  { href: "#servicos", label: "Sobre" },
  { href: "#como-funciona", label: "Serviços" },
  { href: "#processo", label: "Processo" },
  { href: "#contato", label: "Contato" },
];

const Arrow = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const SOCIAL_ICONS = [
  {
    id: "instagram",
    name: "Instagram",
    label: "Instagram da Yaslip",
    href: SOCIAL.instagram,
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    label: "LinkedIn da Yaslip",
    href: SOCIAL.linkedin,
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M5 3.5A1.75 1.75 0 1 1 5 7a1.75 1.75 0 0 1 0-3.5ZM3.5 9h3v11.5h-3V9Zm5.5 0h2.9v1.6h.05c.4-.75 1.4-1.85 3.15-1.85 3.4 0 4 2.2 4 5.1v6.65h-3v-5.9c0-1.4 0-3.2-1.95-3.2-1.95 0-2.25 1.5-2.25 3.1v6h-2.9V9Z" />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    label: "WhatsApp da Yaslip",
    href: whatsappUrl("hero"),
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
        <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Zm4.4 12.5c-.2.5-1.1 1-1.6 1-.4.1-.9.1-2.9-.7-2.4-1-4-3.4-4.1-3.6-.1-.2-1-1.3-1-2.4s.6-1.7.8-1.9c.2-.2.5-.3.6-.3h.5c.2 0 .4 0 .6.4l.8 2c.1.2.1.3 0 .5l-.3.4-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1.1.9 2 1.2 2.3 1.3.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.2Z" />
      </svg>
    ),
  },
  {
    id: "youtube",
    name: "YouTube",
    label: "Canal da Yaslip no YouTube",
    href: SOCIAL.youtube,
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
        <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const ref = useRef(null);
  const heroRef = useRef(null);
  const mediaRef = useRef(null);
  const wordRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Parallax: a imagem anda mais devagar que a rolagem (só transform, via rAF).
  useEffect(() => {
    const hero = heroRef.current;
    const media = mediaRef.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = hero.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      // -1 quando o bloco entra por baixo, +1 quando sai por cima.
      const p = (vh - r.top) / (vh + r.height) * 2 - 1;
      media.style.transform = `translate3d(0, ${(p * -14).toFixed(2)}%, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Spotlight no "YASLIP": a máscara da camada de luz segue o cursor (só mouse).
  useEffect(() => {
    const word = wordRef.current;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let target = null;
    let pos = null;
    const tick = () => {
      raf = 0;
      if (!target) return;
      // Suaviza o movimento; com movimento reduzido, segue o cursor direto.
      pos = !pos || reduce
        ? { ...target }
        : { x: pos.x + (target.x - pos.x) * 0.22, y: pos.y + (target.y - pos.y) * 0.22 };
      const r = word.getBoundingClientRect();
      word.style.setProperty("--glow-x", `${(pos.x - r.left).toFixed(1)}px`);
      word.style.setProperty("--glow-y", `${(pos.y - r.top).toFixed(1)}px`);
      if (Math.abs(target.x - pos.x) > 0.5 || Math.abs(target.y - pos.y) > 0.5) {
        raf = requestAnimationFrame(tick);
      }
    };
    const onMove = (e) => {
      target = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onEnter = (e) => {
      // Começa já na posição do cursor, sem "deslizar" da posição anterior.
      pos = null;
      onMove(e);
      word.classList.add(styles.wordLit);
    };
    const onLeave = () => word.classList.remove(styles.wordLit);

    word.addEventListener("pointerenter", onEnter);
    word.addEventListener("pointermove", onMove);
    word.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      word.removeEventListener("pointerenter", onEnter);
      word.removeEventListener("pointermove", onMove);
      word.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <footer id="contato" ref={ref} className={`${styles.footer} ${visible ? styles.visible : ""}`} data-header-theme="dark">
      {/* ---------- CTA sobre a imagem ---------- */}
      <div ref={heroRef} className={styles.hero}>
        <div ref={mediaRef} className={styles.heroMedia} aria-hidden="true">
          <Image src="/YaslipGoogle.png" alt="" fill sizes="100vw" className={styles.heroImage} />
        </div>
        <div className={styles.heroOverlay} aria-hidden="true" />

        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Seu site na 1ª página do Google</span>
          <h2>
            <span className="initial">P</span>ronto para transformar sua presença digital?
          </h2>
          <p>Fale com a Yaslip e descubra como podemos criar uma estrutura digital mais forte para sua empresa.</p>
          <a
            href={whatsappUrl("conversion")}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.heroButton}
            aria-label="Falar com a Yaslip pelo WhatsApp"
          >
            Falar com a Yaslip
            <span className={styles.heroArrow}>
              <Arrow />
            </span>
          </a>
        </div>
      </div>

      {/* ---------- Informações ---------- */}
      <div className={styles.main}>
        <div className={styles.grid}>
          <div className={`${styles.col} ${styles.brand}`}>
            <h3 className={styles.brandName}>Yaslip</h3>
            <p>Soluções digitais para empresas que querem crescer, aparecer e converter mais.</p>
            {/* Mesmo estilo do CTA "Quero começar" (contorno, para fundo escuro). */}
            <WhatsAppCta variant="secondary" tone="dark" message="hero" className={styles.whatsButton}>
              Falar no WhatsApp
            </WhatsAppCta>
            <ul className={styles.social}>
              {SOCIAL_ICONS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`${styles.socialLink} ${styles[s.id]}`}
                  >
                    {s.icon}
                    <span className={styles.tooltip} aria-hidden="true">
                      {s.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav className={styles.col} aria-label="Menu do rodapé">
            <h3>Menu</h3>
            <ul className={styles.links}>
              {MENU.map((item) => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.col}>
            <h3>Contato</h3>
            <ul className={styles.contact}>
              <li>
                <small>E-mail</small>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </li>
              {CONTACT.phones.map((phone) => (
                <li key={phone.display}>
                  <small>{phone.label}</small>
                  <a
                    href={phone.href}
                    {...(phone.whatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    aria-label={`${phone.label}: ${phone.display}`}
                  >
                    {phone.display}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h3>Localização</h3>
            <address className={styles.address}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" />
                <circle cx="12" cy="9.5" r="2.5" />
              </svg>
              <span>
                {CONTACT.address.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </span>
            </address>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Yaslip. Todos os direitos reservados.</span>
          <div className={styles.legal}>
            {/* <a href="#">Política de Privacidade</a>
            <a href="#">Termos de Uso</a> */}
          </div>
        </div>
      </div>

      {/* ---------- Palavra gigante ---------- */}
      <div ref={wordRef} className={styles.word} aria-hidden="true">
        <span className={styles.wordBase}>YASLIP</span>
        <span className={styles.wordGlow}>YASLIP</span>
      </div>
    </footer>
  );
}
