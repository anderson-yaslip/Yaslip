"use client";

import { useEffect, useRef, useState } from "react";
import { LandingDemo, PerformanceDemo, SeoDemo, SitesDemo } from "./demos";
import WhatsAppCta from "@/components/ui/WhatsAppCta/WhatsAppCta";
import styles from "./ServicesShowcase.module.scss";

const DURATION = 6000; // tempo padrão de cada serviço
const SWAP = 260; // fade-out antes de trocar a demonstração

// Ícones de traço simples, todos no mesmo estilo.
function Icon({ children }) {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const ICONS = {
  sites: (
    <Icon>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M10 13l-2 2 2 2M14 13l2 2-2 2" />
    </Icon>
  ),
  landing: (
    <Icon>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M9 7h6M9 10.5h4M9 15h6" />
    </Icon>
  ),
  seo: (
    <Icon>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </Icon>
  ),
  performance: (
    <Icon>
      <path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12z" />
    </Icon>
  ),
};

// Escala contínua roxo → rosa: cada item continua o tom do anterior.
const TONES = ["#66418B", "#9900CC", "#B83AA8", "#E0559A"];
// Opacidade pela distância até o item ativo: o vizinho fica mais visível que os seguintes.
const FADE = [1, 0.7, 0.5, 0.38];

const services = [
  {
    id: "sites",
    icon: ICONS.sites,
    title: "Seu site na 1ª página do Google",
    short: "Sites",
    cta: { label: "Quero um site assim", message: "sites" },
    description: "Seu cliente encontra sua empresa 24h por dia, 7 dias por semana, 365 dias por ano.",
    bg: "#fcf0f5",
    Demo: SitesDemo,
  },
  {
    id: "landing",
    icon: ICONS.landing,
    title: "Landing Pages",
    short: "Landing Pages",
    cta: { label: "Quero uma Landing Page", message: "landing" },
    description: "Páginas focadas em uma única ação, otimizadas para gerar mais contatos e vendas.",
    bg: "#edf6f0",
    Demo: LandingDemo,
  },
  {
    id: "seo",
    icon: ICONS.seo,
    title: "SEO estratégico",
    short: "SEO",
    cta: { label: "Quero melhorar meu posicionamento", message: "seo" },
    description: "Estrutura e conteúdo preparados para sua empresa ser encontrada no Google.",
    bg: "#f2eefa",
    duration: 8000, // a subida até o TOP 1 precisa de mais tempo
    Demo: SeoDemo,
  },
  {
    id: "performance",
    icon: ICONS.performance,
    title: "Alta Performance",
    short: "Performance",
    cta: { label: "Quero melhorar meu site", message: "performance" },
    description: "Carregamento rápido, estabilidade e uma ótima experiência em qualquer dispositivo.",
    bg: "#faf4e8",
    duration: 7500, // tempo para os 4 itens e o círculo chegarem a 100%
    Demo: PerformanceDemo,
  },
];

export default function ServicesShowcase() {
  const sectionRef = useRef(null);
  const tabsRef = useRef(null);
  const swapTimer = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0); // item selecionado (lista + progresso)
  const [shownIndex, setShownIndex] = useState(0); // demonstração exibida
  const [leaving, setLeaving] = useState(false);
  const [run, setRun] = useState(0); // reinicia progresso e/ou demo
  const [inView, setInView] = useState(false);
  const [seen, setSeen] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);

    // O autoplay só corre com a seção na tela.
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setSeen(true);
      },
      { threshold: 0.3 }
    );
    io.observe(sectionRef.current);

    return () => {
      mq.removeEventListener("change", update);
      io.disconnect();
      clearTimeout(swapTimer.current);
    };
  }, []);

  // Mantém a aba ativa visível na barra horizontal (mobile).
  useEffect(() => {
    const tabs = tabsRef.current;
    const tab = tabs?.children[activeIndex];
    if (!tabs || !tab || tabs.scrollWidth <= tabs.clientWidth) return;
    tabs.scrollTo({ left: tab.offsetLeft - 16, behavior: reduced ? "auto" : "smooth" });
  }, [activeIndex, reduced]);

  const select = (index) => {
    clearTimeout(swapTimer.current);
    setActiveIndex(index);
    setRun((r) => r + 1);

    if (index === shownIndex && !leaving) return;
    if (reduced) {
      setShownIndex(index);
      return;
    }
    // Fade-out da demo atual; a próxima entra (e começa a animar) depois.
    setLeaving(true);
    swapTimer.current = setTimeout(() => {
      setShownIndex(index);
      setLeaving(false);
    }, SWAP);
  };

  const next = () => select((activeIndex + 1) % services.length);

  const { Demo } = services[shownIndex];
  const playing = inView && !reduced;

  return (
    <section id="como-funciona" ref={sectionRef} className={styles.section} data-header-theme="light">
      <header className={styles.head}>
        <p className={styles.eyebrow}>Seu site na 1ª página do Google</p>
        <h2 className={styles.title}>Como a Yaslip faz sua empresa crescer na internet.</h2>
      </header>

      <div className={styles.layout}>
        <nav className={styles.nav} aria-label="Serviços">
          <ul ref={tabsRef} className={styles.list}>
            {services.map((service, i) => {
              const isActive = i === activeIndex;
              return (
                <li
                  key={service.id}
                  className={`${styles.item} ${isActive ? styles.active : ""}`}
                  style={{
                    "--tone": TONES[i],
                    "--tone-next": TONES[i + 1] || TONES[i],
                    "--fade": FADE[Math.abs(i - activeIndex)],
                  }}
                >
                  <button
                    type="button"
                    className={styles.itemButton}
                    aria-pressed={isActive}
                    aria-controls="showcase-demo"
                    onClick={() => select(i)}
                  >
                    <span className={styles.key}>{service.icon}</span>
                    <span className={styles.itemTitle}>{service.title}</span>
                    <span className={styles.itemShort}>{service.short}</span>
                  </button>
                  <div className={styles.itemBody} aria-hidden={!isActive}>
                    <div className={styles.itemInner}>
                      <p>{service.description}</p>
                      <WhatsAppCta message={service.cta.message} className={styles.itemCta}>
                        {service.cta.label}
                      </WhatsAppCta>
                    </div>
                  </div>
                  {/* Celular: o progresso percorre o contorno inteiro da aba, no mesmo tempo. */}
                  {isActive && (
                    <svg className={styles.tabRing} aria-hidden="true">
                      <rect
                        key={run}
                        width="100%"
                        height="100%"
                        rx="21"
                        ry="21"
                        pathLength="100"
                        style={{
                          animationDuration: `${service.duration || DURATION}ms`,
                          animationPlayState: playing ? "running" : "paused",
                        }}
                        onAnimationEnd={next}
                      />
                    </svg>
                  )}
                  <span className={styles.progress} aria-hidden="true">
                    {isActive && (
                      <span
                        key={run}
                        className={styles.progressBar}
                        style={{
                          animationDuration: `${service.duration || DURATION}ms`,
                          animationPlayState: playing ? "running" : "paused",
                        }}
                        onAnimationEnd={next}
                      />
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className={styles.mobileText} aria-live="polite" style={{ "--tone": TONES[activeIndex] }}>
            <p>{services[activeIndex].description}</p>
            <WhatsAppCta message={services[activeIndex].cta.message} className={styles.itemCta}>{services[activeIndex].cta.label}</WhatsAppCta>
          </div>
        </nav>

        <div
          id="showcase-demo"
          className={styles.panel}
          style={{ background: services[activeIndex].bg }}
        >
          <span className={`${styles.corner} ${styles.tl}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.tr}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.bl}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.br}`} aria-hidden="true" />

          <button type="button" className={styles.replay} onClick={() => setRun((r) => r + 1)}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Replay
          </button>

          <div className={`${styles.demoStage} ${leaving ? styles.leaving : ""}`}>
            {(seen || reduced) && <Demo key={`${shownIndex}-${run}`} reduced={reduced} />}
          </div>
        </div>
      </div>
    </section>
  );
}
