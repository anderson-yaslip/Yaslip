import { useEffect, useState } from "react";
import useReducedMotion from "./useReducedMotion";

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

/** Conta de 0 até `target` com requestAnimationFrame. */
export default function useCountUp(target, { delay = 0, duration = 1600 } = {}) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduced) return;
    let frame;
    let startTime;

    const tick = (now) => {
      startTime ??= now;
      const progress = Math.min((now - startTime) / duration, 1);
      setValue(Math.round(target * easeOut(progress)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    const timer = setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [target, delay, duration, reduced]);

  return reduced ? target : value;
}
