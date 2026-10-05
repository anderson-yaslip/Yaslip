"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./StatsSection.module.scss";

const STATS = [
  { value: 30, label: "Anos de empresa" },
  { value: 100, label: "Clientes" },
  { value: 300, label: "Parâmetros de otimização" },
];

const DURATION = 1900;
const STAGGER = 120;

function Counter({ value, run, delay, reduced }) {
  const [n, setN] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setN(value);
      return undefined;
    }
    // Saiu da seção: volta a zero para contar de novo na próxima entrada.
    if (!run) {
      setN(0);
      return undefined;
    }
    let raf;
    let t0;
    const tick = (now) => {
      if (!t0) t0 = now;
      const p = Math.min(1, Math.max(0, (now - t0 - delay) / DURATION));
      const e = 1 - Math.pow(1 - p, 3); // desacelera no fim
      setN(Math.round(value * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, value, delay, reduced]);

  return (
    <span className={styles.number} aria-hidden="true">
      +{n}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const [run, setRun] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    // Entrou (≈40% visível) → conta; saiu por completo → reseta. Vale descendo e subindo.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.4) setRun(true);
        else if (!entry.isIntersecting) setRun(false);
      },
      { threshold: [0, 0.4] }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className={`${styles.section} ${run || reduced ? styles.visible : ""}`} data-header-theme="light">
      <ul className={styles.grid}>
        {STATS.map((stat, i) => (
          <li key={stat.label} className={styles.item} style={{ "--d": `${i * STAGGER}ms` }}>
            <span className="sr-only">
              {stat.value}+ {stat.label}
            </span>
            <Counter value={stat.value} run={run} delay={i * STAGGER} reduced={reduced} />
            <span className={styles.label}>{stat.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
