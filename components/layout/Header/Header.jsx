"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { NAV_LINKS, WHATSAPP_URL } from "@/lib/site";
import styles from "./Header.module.scss";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Header() {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  // Fundo translúcido ao rolar + contraste automático sobre seções escuras.
  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);

      const probe = (headerRef.current?.offsetHeight || 80) / 2;
      let isDark = false;
      document.querySelectorAll("[data-header-theme]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom >= probe && el.dataset.headerTheme === "dark") isDark = true;
      });
      setDark(isDark);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("headerthemechange", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("headerthemechange", onScroll);
    };
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Trava o scroll, fecha com ESC e mantém o foco dentro do menu.
  useEffect(() => {
    if (!open) return undefined;

    const toggle = toggleRef.current;
    const menu = menuRef.current;
    document.body.classList.add("is-locked");
    // Foca o próprio menu (sem contorno visível); Tab segue para os links.
    const focusTimer = setTimeout(() => menu.focus({ preventScroll: true }), 60);

    const onKey = (e) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = [...menu.querySelectorAll(FOCUSABLE)];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === menu)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(focusTimer);
      document.body.classList.remove("is-locked");
      document.removeEventListener("keydown", onKey);
      toggle?.focus({ preventScroll: true, focusVisible: false });
    };
  }, [open, close]);

  const headerClass = [styles.header, scrolled && styles.scrolled, dark && styles.dark]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header ref={headerRef} className={headerClass}>
        <a href="#inicio" className={styles.logo} aria-label="Yaslip — voltar ao início">
          <Image src="/images/logo-yaslip.png" alt="Yaslip" width={309} height={123} priority sizes="120px" />
        </a>

        <button
          ref={toggleRef}
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(true)}
        >
          <span className={styles.toggleLabel}>Menu</span>
          <span className={styles.lines} aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </header>

      <div
        ref={menuRef}
        id="site-menu"
        className={`${styles.menu} ${open ? styles.open : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
        aria-hidden={!open}
        inert={!open}
        tabIndex={-1}
      >
        <div className={styles.menuTop}>
          <span className={styles.menuBrand}>
            YASLIP <em>/</em> DIGITAL
          </span>
          <button type="button" className={styles.close} onClick={close} aria-label="Fechar menu">
            <span>Fechar</span>
            <span className={styles.closeIcon} aria-hidden="true" />
          </button>
        </div>

        <nav className={styles.nav} aria-label="Principal">
          <ol>
            {NAV_LINKS.map((link, i) => (
              <li key={link.href} style={{ "--i": i }}>
                <a href={link.href} onClick={close}>
                  <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.label}>{link.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className={styles.menuFoot}>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.menuCta}>
            Falar no WhatsApp <span aria-hidden="true">→</span> 
          </a>
          <p>© 2026 Yaslip</p>
        </div>
      </div>
    </>
  );
}
