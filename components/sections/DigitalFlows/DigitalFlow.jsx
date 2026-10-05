"use client";

import { useEffect, useRef, useState } from "react";
import useInView from "@/hooks/useInView";
import {
  flowContent,
  flowSteps,
  auditItems,
  strategyItems,
  launchInfo,
} from "./flowData";
import FlowIcon from "./FlowIcon";
import styles from "./DigitalFlow.module.scss";

const MANUAL_HOLD = 2500; // tempo extra numa etapa escolhida pelo clique (ms)

const cx = (...names) => names.filter(Boolean).join(" ");

/* ---------- Conteúdo de cada módulo ----------
   Elementos com .reveal usam --d (delay) e só animam quando o módulo
   está ativo; concluídos ficam no estado final, pendentes ficam ocultos. */

function AnalysisModule() {
  return (
    <>
      <p className={styles.modTitle}>
        <span className={styles.live} /> Análise em andamento
      </p>
      <ul className={styles.sources}>
        {auditItems.map((item, i) => (
          <li key={item.label} style={{ "--i": i, "--level": item.level }}>
            <span>{item.label}</span>
            <i className={styles.meter}>
              <b />
            </i>
          </li>
        ))}
      </ul>
      {/* linha de varredura percorrendo o módulo */}
      <span className={styles.scan} aria-hidden="true" />
      <span
        className={cx(styles.chip, styles.reveal)}
        style={{ "--d": "1.6s" }}
      >
        Análise aprovada
      </span>
    </>
  );
}

function StrategyModule() {
  return (
    <>
      <p className={styles.modTitle}>Plano do projeto</p>
      <ul className={styles.actions}>
        {strategyItems.map((item, i) => (
          <li key={item} style={{ "--d": `${0.9 + i * 0.5}s` }}>
            <span className={styles.check}>
              <FlowIcon name="check" size={10} />
            </span>
            {item}
          </li>
        ))}
      </ul>
      <span
        className={cx(styles.chip, styles.chipStrong, styles.reveal)}
        style={{ "--d": "2.8s" }}
      >
        Estratégia aprovada
      </span>
    </>
  );
}

function DevelopmentModule() {
  return (
    <>
      <div className={styles.browser}>
        <div className={styles.browserBar}>
          <i />
          <i />
          <i />
          <span>{launchInfo.domain}</span>
        </div>
        <div className={styles.page}>
          <p
            className={cx(styles.pageTitle, styles.reveal)}
            style={{ "--d": "0.9s" }}
          >
            Sua solução começa aqui
          </p>
          <span
            className={cx(styles.skeleton, styles.reveal)}
            style={{ "--d": "1.05s" }}
          />
          <span
            className={cx(styles.skeleton, styles.short, styles.reveal)}
            style={{ "--d": "1.15s" }}
          />
          <span
            className={cx(styles.pageButton, styles.reveal)}
            style={{ "--d": "1.3s" }}
          >
            Fale conosco
          </span>
        </div>
      </div>
      <span className={cx(styles.chip, styles.reveal)} style={{ "--d": "2s" }}>
        Páginas prontas
      </span>
    </>
  );
}

function LaunchModule() {
  return (
    <>
      <div
        className={cx(styles.contactHead, styles.reveal)}
        style={{ "--d": "0.8s" }}
      >
        <span className={styles.online}>
          <FlowIcon name="launch" size={14} />
        </span>
        <span>
          <strong>Site publicado</strong>
          <small>{launchInfo.domain}</small>
        </span>
      </div>
      <p className={cx(styles.bubble, styles.reveal)} style={{ "--d": "1.3s" }}>
        {launchInfo.message}
      </p>
      <span
        className={cx(styles.chip, styles.chipDone, styles.reveal)}
        style={{ "--d": "2s" }}
      >
        <FlowIcon name="check" size={11} /> Site no ar
      </span>
    </>
  );
}

const MODULES = {
  analysis: AnalysisModule,
  strategy: StrategyModule,
  development: DevelopmentModule,
  launch: LaunchModule,
};

/**
 * Fluxo: um único `step` controla tudo.
 * - cada etapa fica `duration` ms ativa e avança sozinha (loop);
 * - clique na navegação vai direto para a etapa e reinicia o tempo dela;
 * - o timer só roda com a seção visível e é limpo a cada troca.
 */
export default function DigitalFlow() {
  const [sectionRef, inView] = useInView({ threshold: 0.3 });
  const [entered, setEntered] = useState(false);
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0); // muda para reiniciar timer/animações da etapa
  const manualRef = useRef(false);
  const stepsRef = useRef(null);

  useEffect(() => {
    if (inView) setEntered(true);
  }, [inView]);

  useEffect(() => {
    if (!inView) return;
    const hold = manualRef.current ? MANUAL_HOLD : 0;
    manualRef.current = false;
    const timer = setTimeout(
      () => setStep((current) => (current + 1) % flowSteps.length),
      flowSteps[step].duration + hold,
    );
    return () => clearTimeout(timer);
  }, [step, run, inView]);

  // mobile: mantém a etapa ativa visível na barra horizontal
  useEffect(() => {
    const list = stepsRef.current;
    if (!list || list.scrollWidth <= list.clientWidth) return;
    const item = list.children[step];
    list.scrollTo({ left: item.offsetLeft - 8, behavior: "smooth" });
  }, [step]);

  const goTo = (index) => {
    manualRef.current = true;
    setStep(index);
    setRun((r) => r + 1);
  };

  const stateOf = (i) =>
    i < step ? "done" : i === step ? "active" : "pending";
  const progress = step / (flowSteps.length - 1);

  return (
    <section
      id="processo"
      data-header-theme="dark"
      ref={sectionRef}
      className={cx(
        styles.flow,
        entered && styles.entered,
        !inView && styles.paused,
      )}
      aria-labelledby="flow-title"
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 id="flow-title" className={styles.title}>
            {flowContent.title}
          </h2>
          <p className={styles.description}>{flowContent.description}</p>
        </header>

        <div className={styles.window}>
          {/* barra da janela */}
          <div className={styles.windowBar}>
            <span className={styles.windowDots} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className={styles.windowTitle}>
              {flowContent.windowTitle}
            </span>
            {/* <span className={styles.livePill}>
              <span className={styles.live} /> Ao vivo
            </span> */}
          </div>

          <div className={styles.workspace} style={{ "--progress": progress }}>
            {/* navegação das etapas */}
            <nav className={styles.nav} aria-label="Etapas do projeto">
              <div className={styles.steps}>
                <span className={styles.rail} aria-hidden="true">
                  <span className={styles.railFill} />
                  <span className={styles.railDot} />
                </span>
                <ol ref={stepsRef}>
                  {flowSteps.map((s, i) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        className={styles.navItem}
                        data-state={stateOf(i)}
                        aria-current={i === step ? "step" : undefined}
                        onClick={() => goTo(i)}
                      >
                        <span className={styles.navIcon}>
                          <FlowIcon
                            name={i < step ? "check" : s.id}
                            size={14}
                          />
                        </span>
                        <span className={styles.navText}>
                          <strong>{s.label}</strong>
                          <small>{s.caption}</small>
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>

            {/* área principal */}
            <div className={styles.main}>
              <div className={styles.board}>
                {flowSteps.map((s, i) => {
                  const Module = MODULES[s.id];
                  const state = stateOf(i);
                  const flowing = step === i + 1;
                  return (
                    <div key={s.id} className={styles.slot} data-state={state}>
                      <article
                        key={state === "active" ? `${s.id}-${run}` : s.id}
                        className={styles.module}
                        data-state={state}
                        aria-hidden={state === "pending" || undefined}
                      >
                        <header className={styles.modHeader}>
                          <span className={styles.modIcon}>
                            <FlowIcon name={s.id} size={13} />
                          </span>
                          <span>
                            {String(i + 1).padStart(2, "0")} · {s.label}
                          </span>
                        </header>
                        <Module />
                      </article>

                      {/* conexão até o próximo módulo, com o "visitante" passando */}
                      {i < flowSteps.length - 1 && (
                        <span
                          key={flowing ? `c-${run}-${step}` : `c-${i}`}
                          className={styles.connector}
                          data-state={
                            flowing ? "flowing" : step > i + 1 ? "lit" : "idle"
                          }
                          aria-hidden="true"
                        >
                          <span className={styles.connectorFill} />
                          <span className={styles.connectorTrack}>
                            <i />
                          </span>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* feed de atividade */}
              <div className={styles.feed}>
                <p className={styles.feedTitle}>Atividade</p>
                <ol>
                  {flowSteps.map((s, i) => (
                    <li key={s.id} data-state={stateOf(i)}>
                      <span className={styles.feedDot} />
                      <strong>{s.event.title}</strong>
                      <span className={styles.feedDetail}>
                        {s.event.detail}
                      </span>
                      <time>{i === step ? "agora" : "há instantes"}</time>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
