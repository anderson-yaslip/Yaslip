import { useEffect, useState } from "react";
import useReducedMotion from "./useReducedMotion";

/**
 * Linha do tempo simples: recebe instantes em ms e retorna
 * quantas etapas já aconteceram. Com movimento reduzido,
 * retorna direto a última etapa.
 *   const step = useSteps([800, 1600, 2400]);
 */
export default function useSteps(times) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const key = times.join(",");

  useEffect(() => {
    if (reduced) return;
    const timers = times.map((time, i) => setTimeout(() => setStep(i + 1), time));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, reduced]);

  return reduced ? times.length : step;
}
