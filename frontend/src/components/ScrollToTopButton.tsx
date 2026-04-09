import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={cn(
        "fixed bottom-24 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-card/90 text-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-primary/20",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none",
      )}
    >
      <ArrowUp size={18} />
    </button>
  );
};

export default ScrollToTopButton;
