import { useEffect, useRef, useState } from "react";

/**
 * Returns a ref to attach to a DOM element, and a boolean `isVisible`
 * that turns true once the element enters the viewport.
 */
export function useScrollReveal<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
