import { useEffect, useState } from "react";
import useReducedMotion from "./useReducedMotion";

/** Digita `text` letra a letra depois de `delay` ms. */
export default function useTypewriter(text, { delay = 0, speed = 45 } = {}) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduced) return;
    let interval;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        setCount((current) => {
          if (current >= text.length) {
            clearInterval(interval);
            return current;
          }
          return current + 1;
        });
      }, speed);
    }, delay);

    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [text, delay, speed, reduced]);

  const typed = reduced ? text : text.slice(0, count);
  return { typed, done: typed.length === text.length };
}
