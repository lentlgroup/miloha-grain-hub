import { useEffect, useRef, useState } from "react";

/**
 * Returns a ref to attach to any element and a boolean `inView`
 * that becomes true once the element enters the viewport.
 * The element stays "in view" once triggered (no reset).
 */
export function useScrollReveal<T extends Element>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
