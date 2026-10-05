"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ServicesShowcase.module.scss";

/* ---------- Hooks de tempo ---------- */

// Avança um "passo" em cada instante (ms). Com reduced motion vai direto ao final.
function useTimeline(times, reduced) {
  const [step, setStep] = useState(reduced ? times.length : 0);

  useEffect(() => {
    if (reduced) return undefined;
    const ids = times.map((t, i) => setTimeout(() => setStep(i + 1), t));
    return () => ids.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return step;
}

function useTyping(text, { start = 300, speed = 55, reduced }) {
  const [count, setCount] = useState(reduced ? text.length : 0);

  useEffect(() => {
    if (reduced) return undefined;
    let id;
    const startId = setTimeout(() => {
      id = setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            clearInterval(id);
            return c;
          }
          return c + 1;
        });
      }, speed);
    }, start);
    return () => {
      clearTimeout(startId);
      clearInterval(id);
    };
  }, [text, start, speed, reduced]);

  return text.slice(0, count);
}

function useCounter(target, { duration = 1800, delay = 300, reduced }) {
  const [value, setValue] = useState(reduced ? target : 0);

  useEffect(() => {
    if (reduced) return undefined;
    let raf;
    let t0;
    const tick = (now) => {
      if (!t0) t0 = now;
      const p = Math.min(1, Math.max(0, (now - t0 - delay) / duration));
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay, reduced]);

  return value;
}

// Anima suavemente do valor atual até o novo alvo sempre que ele muda.
function useTween(target, { duration = 600, reduced }) {
  const [value, setValue] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    if (reduced) {
      current.current = target;
      setValue(target);
      return undefined;
    }
    let raf;
    let t0;
    const from = current.current;
    const tick = (now) => {
      if (!t0) t0 = now;
      const p = Math.min(1, (now - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      current.current = Math.round(from + (target - from) * e);
      setValue(current.current);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduced]);

  return value;
}

function Cursor({ on, click }) {
  return (
    <svg
      className={`${styles.cursor} ${on ? styles.cursorOn : ""} ${click ? styles.cursorClick : ""}`}
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
    >
      <path d="M5 3l14 7-6 2-2 6z" fill="#1b1424" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function BrowserBar({ url }) {
  return (
    <div className={styles.browserBar}>
      <i />
      <i />
      <i />
      <span>{url}</span>
    </div>
  );
}

/* 01 — Sites que convertem */
export function SitesDemo({ reduced }) {
  // header, título, texto, CTA, imagem, cursor, clique
  const step = useTimeline([250, 650, 1050, 1450, 1850, 2700, 3500], reduced);
  const on = (n) => (step >= n ? styles.in : "");

  return (
    <div className={`${styles.browser} ${styles.sites}`}>
      <BrowserBar url="seunegocio.com.br" />
      <div className={styles.sitesBody}>
        <div className={`${styles.reveal} ${styles.siteHeader} ${on(1)}`}>
          <span className={styles.siteLogo} />
          <span className={styles.siteNav}>
            <i />
            <i />
            <i />
          </span>
        </div>

        <div className={styles.siteHero}>
          <div className={styles.siteCopy}>
            <h4 className={`${styles.reveal} ${on(2)}`}>Seu negócio merece um site que vende.</h4>
            <span className={`${styles.reveal} ${styles.textLine} ${on(3)}`} />
            <span className={`${styles.reveal} ${styles.textLine} ${styles.short} ${on(3)}`} />
            <span className={`${styles.reveal} ${styles.ctaWrap} ${on(4)}`}>
              <span className={`${styles.cta} ${step >= 7 ? styles.pressed : ""}`}>Quero meu site</span>
              <Cursor on={step >= 6} click={step >= 7} />
            </span>
          </div>
          <div className={`${styles.reveal} ${styles.siteImage} ${on(5)}`}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 16 5-5 4 4 3-3 6 6" />
              <circle cx="16" cy="9" r="1.6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 02 — Landing Pages */
const LP_MARKS = ["Headline", "CTA", "Formulário"];

export function LandingDemo({ reduced }) {
  // monta a página, depois destaca headline → CTA → formulário → conversão
  const step = useTimeline([200, 450, 700, 950, 1200, 1900, 2700, 3500, 4300], reduced);
  const on = (n) => (step >= n ? styles.in : "");
  // Destaques acumulativos: Headline → + CTA → + Formulário; nada se apaga até reiniciar.
  const isMarked = (i) => step >= 6 + i;
  const marked = (i) => (isMarked(i) ? styles.marked : "");

  return (
    <div className={styles.landing}>
      <div className={styles.phone}>
        <div className={`${styles.reveal} ${styles.lpBlock} ${on(1)} ${marked(0)}`}>
          <span className={styles.lpHeadline} />
          <span className={`${styles.lpHeadline} ${styles.short}`} />
          {isMarked(0) && <em className={styles.markTag}>{LP_MARKS[0]}</em>}
        </div>

        <div className={`${styles.reveal} ${styles.lpBlock} ${on(2)} ${marked(1)}`}>
          <span className={styles.lpCta}>Quero saber mais</span>
          {isMarked(1) && <em className={styles.markTag}>{LP_MARKS[1]}</em>}
        </div>

        <div className={`${styles.reveal} ${styles.lpBlock} ${styles.lpForm} ${on(3)} ${marked(2)}`}>
          <span className={styles.lpInput} />
          <span className={styles.lpInput} />
          <span className={styles.lpSend} />
          {isMarked(2) && <em className={styles.markTag}>{LP_MARKS[2]}</em>}
        </div>

        <div className={`${styles.reveal} ${styles.lpBlock} ${styles.lpProof} ${on(4)}`}>
          <span className={styles.avatars}>
            <i />
            <i />
            <i />
          </span>
          <span className={styles.stars}>★★★★★</span>
        </div>

        <div className={`${styles.reveal} ${styles.lpBlock} ${styles.lpBenefits} ${on(5)}`}>
          {[0, 1, 2].map((i) => (
            <span key={i}>
              <b>✓</b>
              <i />
            </span>
          ))}
        </div>
      </div>

      <div className={`${styles.reveal} ${styles.conversion} ${on(9)}`}>
        {/* Gráfico subindo dentro de um círculo escuro */}
        <span className={styles.conversionIcon}>
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 17l6-6 4 4 8-8" />
            <path d="M15 7h6v6" />
          </svg>
        </span>
        <div>
          <strong>Conversão</strong>
          <small>+ Leads</small>
        </div>
      </div>
    </div>
  );
}

/* 03 — SEO estratégico */
const SEO_QUERY = "empresa de criação de sites";
// Outros resultados são só blocos visuais neutros, sem nome nem domínio.
const SEO_ROWS = [{ id: "r1" }, { id: "r2" }, { id: "r3" }, { id: "r4" }, { id: "yaslip", mine: true }];
const LAST = SEO_ROWS.length - 1;

export function SeoDemo({ reduced }) {
  const typed = useTyping(SEO_QUERY, { start: 300, speed: 55, reduced });
  // resultados → Yaslip sobe 5º → 4º → 3º → 2º → 1º → selo TOP 1
  const step = useTimeline([2300, 3100, 3800, 4500, 5200, 5700], reduced);
  const myPos = LAST - Math.min(Math.max(step - 1, 0), LAST);
  const others = SEO_ROWS.filter((r) => !r.mine);
  const positionOf = (row) => {
    if (row.mine) return myPos;
    const idx = others.indexOf(row);
    return idx >= myPos ? idx + 1 : idx;
  };
  const isTop = step >= 6;

  return (
    <div className={styles.seo}>
      <div className={styles.searchBar}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span className={styles.searchText}>
          {typed}
          {typed.length < SEO_QUERY.length && <i className={styles.caret} />}
        </span>
      </div>

      <div className={`${styles.rankList} ${step >= 1 ? styles.in : ""}`} style={{ "--rows": SEO_ROWS.length }}>
        {SEO_ROWS.map((row) => {
          const pos = positionOf(row);
          return (
            <div
              key={row.id}
              className={`${styles.result} ${row.mine ? styles.resultMine : ""}`}
              style={{ "--pos": pos }}
            >
              {row.mine ? (
                <div className={styles.resultBody}>
                  <strong>Yaslip — Criação de Sites Profissionais</strong>
                  <small>Sites rápidos, estratégicos e preparados para o Google.</small>
                </div>
              ) : (
                <div className={styles.skeleton} aria-hidden="true">
                  <i />
                  <i />
                </div>
              )}

              {/* Posição fora do card, à direita: 5º → 2º e, no topo, TOP 1. */}
              {row.mine && (
                <span className={`${styles.posBadge} ${isTop ? styles.posTop : ""}`}>
                  <span key={isTop ? "top" : pos} className={styles.posText}>
                    {isTop ? "TOP 1" : `${pos + 1}º`}
                  </span>
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* 04 — Alta Performance */
const PERF = ["Velocidade", "SEO", "Mobile", "Experiência"];
// Mesma escala roxo → rosa da lista de serviços.
const PERF_TONES = ["#66418B", "#9900CC", "#B83AA8", "#E0559A"];

export function PerformanceDemo({ reduced }) {
  const load = useCounter(100, { delay: 250, duration: 900, reduced });
  // página carregada → um indicador por vez (cumulativo) → "Performance otimizada"
  const step = useTimeline([1250, 1900, 2600, 3300, 4000, 4700], reduced);
  const active = Math.max(0, Math.min(step - 1, PERF.length)); // nº de itens ativos
  // O círculo sobe 25% a cada item ativado: 0 → 25 → 50 → 75 → 100.
  const score = useTween(active * 25, { duration: 650, reduced });

  return (
    <div className={styles.perf}>
      <div className={styles.browser}>
        <BrowserBar url="seunegocio.com.br" />
        <span className={styles.loadBar} style={{ transform: `scaleX(${load / 100})`, opacity: load >= 100 ? 0 : 1 }} />
        <div className={`${styles.perfPage} ${step >= 1 ? styles.in : ""}`}>
          <span className={styles.lpHeadline} />
          <span className={`${styles.textLine} ${styles.short}`} />
          <div className={styles.perfTiles}>
            <i />
            <i />
            <i />
          </div>
        </div>
        <span className={styles.loadTime}>{load < 100 ? `${load}%` : "0,8s"}</span>
      </div>

      {/* Indicadores + círculo alinhados à esquerda: o olhar começa em "Velocidade". */}
      <div className={styles.perfFoot}>
        <ul className={styles.checks}>
          {PERF.map((label, i) => (
            <li key={label} className={i < active ? styles.checked : ""} style={{ "--tone": PERF_TONES[i] }}>
              <span className={styles.checkIcon}>✓</span>
              {label}
            </li>
          ))}
        </ul>

        <div className={styles.ringRow}>
          <div
            className={`${styles.ring} ${score >= 100 ? styles.ringDone : ""}`}
            // O brilho assume a cor do último indicador ativado.
            style={{ "--glow": PERF_TONES[Math.max(active - 1, 0)] }}
          >
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <defs>
                <linearGradient id="perf-ring-brand" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#66418B" />
                  <stop offset="35%" stopColor="#9900CC" />
                  <stop offset="70%" stopColor="#B83AA8" />
                  <stop offset="100%" stopColor="#E0559A" />
                </linearGradient>
              </defs>
              <circle className={styles.ringTrack} cx="60" cy="60" r="50" />
              {/* Borda e número usam o mesmo valor. */}
              <circle
                className={styles.ringFill}
                cx="60"
                cy="60"
                r="50"
                pathLength="100"
                stroke="url(#perf-ring-brand)"
                style={{ strokeDashoffset: 100 - score, opacity: score > 0 ? 1 : 0 }}
              />
            </svg>
            <strong className={styles.ringValue}>
              {score}
              <span>%</span>
            </strong>
          </div>

          <span className={`${styles.reveal} ${styles.ready} ${step >= 6 ? styles.in : ""}`}>Performance otimizada</span>
        </div>
      </div>
    </div>
  );
}
