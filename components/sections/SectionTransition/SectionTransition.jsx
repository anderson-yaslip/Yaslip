"use client";

import { useEffect, useRef } from "react";
import styles from "./SectionTransition.module.scss";

// Intensidade do efeito por faixa de tela (valores no progresso = 1).
const PRESETS = {
  desktop: { width: 0.42, height: 0.56, radius: 40, shift: -90, scale: 0.62, next: 120 },
  tablet: { width: 0.7, height: 0.72, radius: 32, shift: -60, scale: 0.84, next: 80 },
  mobile: { width: 0.86, height: 0.84, radius: 24, shift: -30, scale: 0.84, next: 48 },
};

const clamp01 = (v) => Math.min(1, Math.max(0, v));

export default function SectionTransition({ first, second }) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    const frame = frameRef.current;
    const next = nextRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let cfg = null;

    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const preset = vw <= 640 ? PRESETS.mobile : vw <= 1024 ? PRESETS.tablet : PRESETS.desktop;
      const content = frame.querySelector("[data-transition-content]");
      const cw = content ? content.offsetWidth : 0;
      const ch = content ? content.offsetHeight : 0;

      // Em telas baixas o conteúdo é reduzido um pouco para caber inteiro na tela
      // (descontando header e respiro). Só em telas minúsculas o efeito desliga.
      const base = ch > 0 ? Math.min(1, (vh - 170) / ch) : 1;
      const isStatic = reduceMotion.matches || base < 0.6;
      root.dataset.static = String(isStatic);

      if (isStatic) {
        cfg = null;
        return;
      }

      // Garante que headline e CTAs nunca fiquem cortados pelo recorte.
      const endScale = base * preset.scale;
      const colW = Math.min(300, Math.max(230, vw * 0.19));
      const sidePad = vw <= 640 ? 24 : vw <= 960 ? 96 : 2 * (colW * endScale * 0.4 + 28);
      const widthEnd = Math.min(1, Math.max(preset.width, (cw * endScale + sidePad) / vw));
      const heightEnd = Math.min(1, Math.max(preset.height, (ch * endScale + 72) / vh));

      cfg = {
        ...preset,
        base,
        cw,
        vh,
        widthEnd,
        heightEnd,
        distance: Math.max(1, track.offsetHeight - stage.offsetHeight),
      };
    };

    const render = () => {
      raf = 0;

      if (!cfg) {
        stage.removeAttribute("style");
        next.removeAttribute("style");
        stage.dataset.headerTheme = "light";
        return;
      }

      const p = clamp01(-track.getBoundingClientRect().top / cfg.distance);
      // Suaviza início e fim sem perder a relação direta com o scroll.
      const e = p * p * (3 - 2 * p);
      // Recorte e cantos respondem já no início, para a seção não ficar
      // encostada nas bordas da tela depois de rolar um pouco.
      const eo = 1 - Math.pow(1 - p, 3);

      const insetX = ((1 - cfg.widthEnd) / 2) * 100 * eo;
      const insetY = ((1 - cfg.heightEnd) / 2) * 100 * e;

      stage.style.setProperty("--progress", p.toFixed(4));
      // Largura real do texto: os cards laterais se posicionam colados a ele.
      stage.style.setProperty("--content-w", `${cfg.cw}px`);
      stage.style.setProperty("--inset-x", `${insetX.toFixed(3)}%`);
      stage.style.setProperty("--inset-y", `${insetY.toFixed(3)}%`);
      stage.style.setProperty("--radius", `${(cfg.radius * eo).toFixed(2)}px`);
      stage.style.setProperty("--shift", `${(cfg.shift * e).toFixed(2)}px`);
      stage.style.setProperty("--content-scale", (cfg.base * (1 - (1 - cfg.scale) * eo)).toFixed(4));
      stage.style.setProperty("--cards-opacity", (1 - 0.55 * clamp01(p * 1.3)).toFixed(3));

      // A segunda seção sobe e ganha presença conforme entra na tela.
      const nextTop = next.getBoundingClientRect().top;
      const q = clamp01((cfg.vh - nextTop) / (cfg.vh * 0.65));
      next.style.setProperty("--next-y", `${(cfg.next * (1 - q)).toFixed(2)}px`);
      next.style.setProperty("--next-opacity", (0.65 + 0.35 * q).toFixed(3));

      // O header fica escuro quando o fundo roxo já aparece atrás dele.
      const cardTop = (insetY / 100) * cfg.vh + cfg.shift * e;
      const theme = cardTop > 36 || e > 0.25 ? "dark" : "light";
      if (stage.dataset.headerTheme !== theme) {
        stage.dataset.headerTheme = theme;
        window.dispatchEvent(new Event("headerthemechange"));
      }
    };

    const requestRender = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    const refresh = () => {
      measure();
      requestRender();
    };

    refresh();

    const ro = new ResizeObserver(refresh);
    ro.observe(frame.querySelector("[data-transition-content]") || frame);

    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", refresh);
    window.addEventListener("orientationchange", refresh);
    reduceMotion.addEventListener("change", refresh);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("orientationchange", refresh);
      reduceMotion.removeEventListener("change", refresh);
    };
  }, []);

  return (
    // O id fica no bloco externo (que começa no topo da página): ao clicar em "Início",
    // a página volta ao estado completo, e não para no meio da transição.
    <div ref={rootRef} id="inicio" className={styles.wrapper} data-static="false">
      <div ref={trackRef} className={styles.track}>
        <div ref={stageRef} className={styles.stage} data-header-theme="light">
          <div className={styles.shadow} aria-hidden="true" />
          <div ref={frameRef} className={styles.frame}>
            {first}
          </div>
        </div>
      </div>

      <div ref={nextRef} className={styles.next}>
        {second}
      </div>
    </div>
  );
}
