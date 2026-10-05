"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sectionContent, services } from "./servicesData";
import ServiceIcon from "./ServiceIcon";
import useInView from "@/hooks/useInView";
import SitesDemo from "./demos/SitesDemo";
import LandingDemo from "./demos/LandingDemo";
import SeoDemo from "./demos/SeoDemo";
import OrganicDemo from "./demos/OrganicDemo";
import PerformanceDemo from "./demos/PerformanceDemo";
import styles from "./ServicesSection.module.scss";

const DEMOS = {
  sites: SitesDemo,
  landing: LandingDemo,
  seo: SeoDemo,
  organic: OrganicDemo,
  performance: PerformanceDemo,
};

const STEP_DURATION = 6000; // tempo de cada item (ms)
const SWAP_DURATION = 300; // fade-out da demo atual (ms) — igual ao SCSS

const cx = (...names) => names.filter(Boolean).join(" ");

/**
 * Como funciona o ciclo:
 * - A barra de progresso do item ativo é uma animação CSS de 6s.
 *   Quando ela termina (onAnimationEnd), avançamos para o próximo item.
 *   Não há setInterval: reiniciar o tempo = trocar a `key` da barra.
 * - `active` é o item selecionado; `shown` é a demo exibida.
 *   Eles diferem por ~300ms durante o fade-out da troca.
 * - Fora da tela, as animações ficam pausadas; ao voltar, o item reinicia.
 */
export default function ServicesSection() {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);
  const [cycle, setCycle] = useState(0); // reinicia a barra de progresso
  const [replay, setReplay] = useState(0); // reinicia a demo
  const [sectionRef, inView] = useInView({ threshold: 0.35 });
  const listRef = useRef(null);

  const restartCurrent = useCallback(() => {
    setCycle((c) => c + 1);
    setReplay((r) => r + 1);
  }, []);

  const goTo = useCallback(
    (index) => {
      if (index === active) return restartCurrent();
      setActive(index);
      setCycle((c) => c + 1);
    },
    [active, restartCurrent],
  );

  const goNext = useCallback(
    () => goTo((active + 1) % services.length),
    [active, goTo],
  );

  // Troca suave: espera o fade-out antes de montar a próxima demo
  useEffect(() => {
    if (active === shown) return;
    const timer = setTimeout(() => setShown(active), SWAP_DURATION);
    return () => clearTimeout(timer);
  }, [active, shown]);

  // Ao entrar na tela, recomeça o item atual do zero
  useEffect(() => {
    if (inView) restartCurrent();
  }, [inView, restartCurrent]);

  // Mobile: mantém a aba ativa visível na barra horizontal
  useEffect(() => {
    const list = listRef.current;
    if (!list || list.scrollWidth <= list.clientWidth) return;
    const tab = list.children[active];
    list.scrollTo({ left: tab.offsetLeft - 16, behavior: "smooth" });
  }, [active]);

  // Navegação por teclado entre as abas (setas)
  const handleKeyDown = (event) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const index =
      (active + keys[event.key] + services.length) % services.length;
    goTo(index);
    listRef.current?.children[index]?.focus();
  };

  const Demo = DEMOS[services[shown].id];
  const leaving = active !== shown;

  return (
    <section
      id="servicos"
      ref={sectionRef}
      className={cx(styles.services, !inView && styles.paused)}
      aria-labelledby="services-title"
    >
      <div className={styles.container}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>{sectionContent.eyebrow}</p>
          <h2 id="services-title" className={styles.heading}>
            {sectionContent.title}
          </h2>
        </header>

        <div className={styles.frame}>
          {/* Coluna esquerda: lista de serviços */}
          <div className={styles.listColumn}>
            <div
              ref={listRef}
              className={styles.list}
              role="tablist"
              aria-label="Serviços da Yaslip"
              onKeyDown={handleKeyDown}
            >
              {services.map((service, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={service.id}
                    id={`service-tab-${service.id}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="service-panel"
                    tabIndex={isActive ? 0 : -1}
                    className={cx(styles.item, isActive && styles.active)}
                    style={{ "--c": service.color, "--c-rgb": service.rgb }}
                    onClick={() => goTo(i)}
                  >
                    <span className={styles.key}>
                      <ServiceIcon name={service.id} />
                    </span>

                    <span className={styles.body}>
                      <span className={styles.title}>
                        <span className={styles.titleFull}>
                          {service.title}
                        </span>
                        <span className={styles.titleShort}>
                          {service.shortTitle}
                        </span>
                      </span>
                      <span className={styles.descriptionWrap}>
                        <span className={styles.description}>
                          {service.description}
                        </span>
                      </span>
                    </span>

                    <span className={styles.track} aria-hidden="true">
                      {isActive && (
                        <span
                          key={cycle}
                          className={styles.progress}
                          style={{ animationDuration: `${STEP_DURATION}ms` }}
                          onAnimationEnd={goNext}
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* No mobile a descrição sai da aba e aparece aqui */}
            <p className={styles.mobileDescription} aria-hidden="true">
              {services[active].description}
            </p>
          </div>

          {/* Coluna direita: demonstração */}
          <div
            id="service-panel"
            role="tabpanel"
            aria-labelledby={`service-tab-${services[shown].id}`}
            className={styles.stage}
            style={{
              "--tone": services[active].tone,
              "--c-rgb": services[active].rgb,
            }}
          >
            <button
              type="button"
              className={styles.replay}
              onClick={restartCurrent}
            >
              <svg
                viewBox="0 0 16 16"
                width="13"
                height="13"
                aria-hidden="true"
              >
                <path
                  d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5v2.8h2.8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Replay
            </button>

            <div
              key={`${shown}-${replay}`}
              className={cx(styles.demo, leaving && styles.leaving)}
            >
              <Demo />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
