import { Sparkles } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const MobileStickyBar = () => {
  const { copy } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/70 bg-background/92 px-4 py-3 backdrop-blur-md md:hidden">
      <a
        href="#contact"
        className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-3.5 text-sm font-semibold text-secondary-foreground shadow-md shadow-secondary/20"
      >
        <Sparkles size={16} className="text-accent" />
        {copy.nav.quote}
      </a>
    </div>
  );
};

export default MobileStickyBar;
