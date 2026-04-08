import { useEffect, useState } from "react";
import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

const ThemeToggle = ({ className }: { className?: string }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const { copy } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-full border border-border/70 bg-background/75 px-3 py-2 shadow-sm",
        className,
      )}
    >
      <SunMedium size={16} className={cn("text-muted-foreground transition-colors", !isDark && "text-primary")} />
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label={copy.theme.switch}
      />
      <MoonStar size={16} className={cn("text-muted-foreground transition-colors", isDark && "text-primary")} />
      <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground xl:inline">
        {isDark ? copy.theme.dark : copy.theme.light}
      </span>
    </div>
  );
};

export default ThemeToggle;
