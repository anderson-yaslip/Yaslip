"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import WhatsAppCta from "@/components/ui/WhatsAppCta/WhatsAppCta";
import styles from "./DigitalFlow.module.scss";

const STEP_TIME = 5000; // tempo de cada etapa no ciclo automático
const END_HOLD = 5500; // pausa em "Nova oportunidade" antes de recomeçar
const RESUME_AFTER_CLICK = 6000; // depois de um clique, espera antes de seguir

function Icon({ children }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const flowSteps = [
  {
    id: "analysis",
    label: "Análise",
    event: "Diagnóstico concluído",
    detail: "Oportunidades do negócio mapeadas",
    icon: (
      <Icon>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </Icon>
    ),
  },
  {
    id: "development",
    label: "Desenvolvimento",
    event: "Página publicada",
    detail: "Site no ar e pronto para receber visitas",
    icon: (
      <Icon>
        <rect x="3" y="4" width="18" height="16" rx="2.5" />
        <path d="M3 9h18M10 13l-2 2 2 2M14 13l2 2-2 2" />
      </Icon>
    ),
  },
  {
    id: "optimization",
    label: "Otimização",
    event: "Página otimizada",
    detail: "Preparada para ser encontrada no Google",
    icon: (
      <Icon>
        <path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12z" />
      </Icon>
    ),
  },
  {
    id: "contact",
    label: "Contato",
    event: "Contato iniciado",
    detail: "Um novo cliente em potencial chegou",
    icon: (
      <Icon>
        <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12Z" />
      </Icon>
    ),
  },
];

const ANALYSIS = ["Público", "Concorrência", "Palavras-chave"];
const OPTIMIZATION = ["SEO", "Velocidade", "Mobile", "Indexação"];

export default function DigitalFlow() {
  const sectionRef = useRef(null);
  const timer = useRef(0);
  const stepsRef = useRef(null);
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0); // reinicia as animações internas de cada volta
  const [visible, setVisible] = useState(false);
  const [inView, setInView] = useState(false);
  // Tempo agendado da etapa atual: o contorno das abas (celular) fecha a volta junto.
  const [trace, setTrace] = useState({ ms: STEP_TIME, key: 0 });

  // Entrada da seção e pausa do fluxo fora da tela.
  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.25 }
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  // Ciclo automático: Aquisição → Experiência → Interesse → Contato → recomeça.
  const schedule = useCallback((from, delay) => {
    clearTimeout(timer.current);
    setTrace((t) => ({ ms: delay, key: t.key + 1 }));
    timer.current = setTimeout(() => {
      if (from >= flowSteps.length - 1) {
        setActive(0);
        setCycle((c) => c + 1);
        schedule(0, STEP_TIME);
      } else {
        setActive(from + 1);
        schedule(from + 1, from + 1 === flowSteps.length - 1 ? END_HOLD : STEP_TIME);
      }
    }, delay);
  }, []);

  useEffect(() => {
    if (!inView) {
      clearTimeout(timer.current);
      return undefined;
    }
    // Começa um pouco depois da entrada do painel.
    schedule(active, active === 0 ? STEP_TIME + 600 : STEP_TIME);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, schedule]);

  // Celular: mantém a aba ativa visível na barra horizontal.
  useEffect(() => {
    const list = stepsRef.current;
    const tab = list?.children[active];
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: tab.offsetLeft - 12, behavior: "smooth" });
  }, [active]);

  const goTo = (index) => {
    setActive(index);
    setCycle((c) => c + 1);
    schedule(index, RESUME_AFTER_CLICK);
  };

  const state = (i) => (i === active ? styles.isActive : i < active ? styles.isDone : styles.isIdle);

  return (
    <section id="processo" ref={sectionRef} className={`${styles.section} ${visible ? styles.visible : ""}`} data-header-theme="dark">
      <header className={styles.head}>
        <h2 className={styles.title}>
          <span className="initial">D</span>a análise ao contato com sua empresa.
        </h2>
        <div className={styles.leadWrap}>
          <p className={styles.lead}>Veja como cada etapa do trabalho se conecta até gerar um contato real.</p>
          <WhatsAppCta variant="secondary" tone="dark" message="conversion">
            Quero começar
          </WhatsAppCta>
        </div>
      </header>

      <div className={styles.window} style={{ "--active": active }}>
        <div className={styles.titleBar}>
          <span className={styles.dots} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>

        <div className={styles.body}>
          {/* Navegação das etapas */}
          <nav className={styles.sidebar} aria-label="Etapas do fluxo">
            <p className={styles.sideTitle}>Etapas</p>
            <ol ref={stepsRef} className={styles.steps}>
              {flowSteps.map((step, i) => (
                <li key={step.id}>
                  <button
                    type="button"
                    className={`${styles.stepButton} ${state(i)}`}
                    aria-current={i === active ? "step" : undefined}
                    onClick={() => goTo(i)}
                  >
                    <span className={styles.stepIcon}>{step.icon}</span>
                    <span className={styles.stepLabel}>{step.label}</span>
                    <span className={styles.stepCheck} aria-hidden="true">
                      ✓
                    </span>
                    {i === active && (
                      <svg className={styles.tabRing} aria-hidden="true">
                        <rect
                          key={trace.key}
                          width="100%"
                          height="100%"
                          rx="19"
                          ry="19"
                          pathLength="100"
                          style={{ animationDuration: `${trace.ms}ms`, animationPlayState: inView ? "running" : "paused" }}
                        />
                      </svg>
                    )}
                  </button>
                </li>
              ))}
            </ol>

            <div className={styles.sideFoot}>
              <span>Progresso</span>
              <div className={styles.sideBar}>
                <i style={{ transform: `scaleX(${(active + 1) / flowSteps.length})` }} />
              </div>
            </div>
          </nav>

          {/* Área principal: módulos conectados */}
          <div className={styles.main}>
            <div key={cycle} className={styles.board}>
              {/* 1. Análise */}
              <article className={`${styles.module} ${state(0)}`}>
                <header className={styles.moduleHead}>
                  <span>01 · Análise</span>
                </header>
                <strong className={styles.moduleTitle}>Diagnóstico do negócio</strong>
                <ul className={styles.analysis}>
                  {ANALYSIS.map((item, i) => (
                    <li key={item} style={{ "--i": i }}>
                      <span>{item}</span>
                      <i className={styles.meter}>
                        <b />
                      </i>
                    </li>
                  ))}
                </ul>
              </article>

              <span className={`${styles.link} ${active >= 1 ? styles.linkOn : ""}`} aria-hidden="true">
                {active === 1 && <i className={styles.traveler} />}
              </span>

              {/* 2. Desenvolvimento */}
              <article className={`${styles.module} ${state(1)}`}>
                <header className={styles.moduleHead}>
                  <span>02 · Desenvolvimento</span>
                </header>
                <div className={styles.browser}>
                  <div className={styles.browserBar}>
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className={styles.page}>
                    <strong>Sua solução começa aqui</strong>
                    <span className={styles.line} />
                    <span className={`${styles.line} ${styles.short}`} />
                    <span className={styles.pageCta}>Começar agora</span>
                    {active >= 1 && <i className={styles.landing} />}
                  </div>
                </div>
              </article>

              <span className={`${styles.link} ${active >= 2 ? styles.linkOn : ""}`} aria-hidden="true">
                {active === 2 && <i className={styles.traveler} />}
              </span>

              {/* 3. Otimização */}
              <article className={`${styles.module} ${state(2)}`}>
                <header className={styles.moduleHead}>
                  <span>03 · Otimização</span>
                </header>
                <ul className={styles.actions}>
                  {OPTIMIZATION.map((item, i) => (
                    <li key={item} style={{ "--i": i }}>
                      <span className={styles.actionDot} />
                      {item}
                    </li>
                  ))}
                </ul>
                <span className={styles.interested}>Pronto para o Google</span>
              </article>

              <span className={`${styles.link} ${active >= 3 ? styles.linkOn : ""}`} aria-hidden="true">
                {active === 3 && <i className={styles.traveler} />}
              </span>

              {/* 4. Contato */}
              <article className={`${styles.module} ${styles.contactModule} ${state(3)}`}>
                <header className={styles.moduleHead}>
                  <span>04 · Contato</span>
                </header>
                <div className={styles.contact}>
                  <span className={styles.whats}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Zm4.4 12.5c-.2.5-1.1 1-1.6 1-.4.1-.9.1-2.9-.7-2.4-1-4-3.4-4.1-3.6-.1-.2-1-1.3-1-2.4s.6-1.7.8-1.9c.2-.2.5-.3.6-.3h.5c.2 0 .4 0 .6.4l.8 2c.1.2.1.3 0 .5l-.3.4-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1.1.9 2 1.2 2.3 1.3.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.2Z" />
                    </svg>
                  </span>
                  <div>
                    <strong>Nova oportunidade</strong>
                    <small>Contato recebido · WhatsApp</small>
                  </div>
                </div>
                <p className={styles.bubble}>Olá! Vim pelo site e quero saber mais.</p>
              </article>
            </div>

            {/* Resultado de cada etapa: um bloco por módulo, aparecendo conforme o fluxo avança */}
            <ul className={styles.results}>
              {flowSteps.map((step, i) => (
                <li key={step.id} className={i <= active ? styles.resultOn : ""}>
                  <div className={styles.resultCard}>
                    <span className={styles.resultIcon}>{step.icon}</span>
                    <div>
                      <strong>{step.event}</strong>
                      <small>{step.detail}</small>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
