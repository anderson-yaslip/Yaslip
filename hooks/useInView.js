import { useEffect, useRef, useState } from "react";

export default function useInView({ threshold = 0.35 } = {}) {
  const elementRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return [elementRef, inView];
}
