import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, PhoneCall, Sparkles, Wheat, X, LayoutDashboard } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { getLocalizedText, languageOptions } from "@/lib/i18n";

const navLinks = [
  { key: "home", href: "#home" },
  { key: "about", href: "#about" },
  { key: "products", href: "#products" },
  { key: "delivery", href: "#coverage" },
  { key: "services", href: "#services" },
  { key: "contact", href: "#contact" },
];

const Navbar = () => {
  const { language, setLanguage, copy } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#home");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter((section): section is HTMLElement => section instanceof HTMLElement);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveHref(`#${visibleEntry.target.id}`);
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.2, 0.45, 0.7] },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div
        className={cn(
          "container rounded-[1.75rem] border transition-all duration-300",
          isScrolled
            ? "border-border/80 bg-card/85 shadow-[0_22px_70px_-42px_rgba(20,31,27,0.65)] backdrop-blur-2xl"
            : "border-border/70 bg-background/78 backdrop-blur-xl",
        )}
      >
        <div className="flex min-h-[78px] items-center justify-between gap-4 px-4 md:px-6">
          <a href="#home" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-accent shadow-lg shadow-secondary/20">
              <Wheat size={19} />
            </div>
            <div>
              <span className="block text-lg font-serif font-semibold leading-none text-foreground">MILOHA</span>
              <span className="mt-1 hidden text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground sm:block">
                {copy.brand.tagline}
              </span>
            </div>
          </a>

          <ul className="hidden items-center gap-2 rounded-full border border-border/70 bg-background/75 px-3 py-2 shadow-sm md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
              <a
                  href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                    activeHref === link.href
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/70 hover:bg-muted/80 hover:text-foreground",
                )}
              >
                  {copy.nav[link.key as keyof typeof copy.nav]}
              </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <div className="hidden items-center gap-1 rounded-full border border-border/70 bg-background/70 p-1 xl:flex">
              {languageOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setLanguage(option.value)}
                  className={cn(
                    "rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
                    language === option.value
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/65 hover:bg-muted hover:text-foreground",
                  )}
                  aria-label={`${copy.nav.language}: ${getLocalizedText(option.label, language)}`}
                >
                  {option.value.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="hidden rounded-full border border-border/70 bg-background/70 px-4 py-2 xl:block">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">{copy.brand.hub}</p>
              <p className="mt-1 text-sm text-muted-foreground">{copy.nav.hubSummary}</p>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <Sparkles size={16} className="text-accent" />
              {copy.nav.quote}
            </a>
            {isAuthenticated && (
              <Link
                to="/admin"
                className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                title="Admin Panel"
              >
                <LayoutDashboard size={13} className="text-primary" />
                Admin
              </Link>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-background/80 text-foreground md:hidden"
            aria-label={copy.nav.toggleMenu}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="border-t border-border/70 px-4 pb-4 pt-2 md:hidden">
            <div className="rounded-[1.6rem] bg-background/80 p-3">
              <div className="mb-3 flex items-center justify-between rounded-2xl border border-border/70 bg-card/75 px-4 py-3">
                <p className="text-sm font-semibold text-foreground">{copy.theme.label}</p>
                <ThemeToggle className="border-0 bg-transparent px-0 py-0 shadow-none" />
              </div>

              <div className="mb-3 flex items-center justify-between rounded-2xl border border-border/70 bg-card/75 px-4 py-3">
                <p className="text-sm font-semibold text-foreground">{copy.nav.language}</p>
                <div className="flex items-center gap-1 rounded-full bg-muted/70 p-1">
                  {languageOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setLanguage(option.value)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
                        language === option.value
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground/65 hover:bg-background hover:text-foreground",
                      )}
                    >
                      {option.value.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <ul className="grid gap-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block rounded-2xl px-4 py-3 text-sm font-semibold transition-colors",
                        activeHref === link.href
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground/80 hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {copy.nav[link.key as keyof typeof copy.nav]}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="my-3 subtle-divider" />

              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground"
              >
                <Sparkles size={16} />
                {copy.nav.quote}
              </a>

              <div className="mt-3 flex items-start gap-3 rounded-2xl border border-border/70 bg-card/75 px-4 py-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <PhoneCall size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{copy.nav.mobileSupportTitle}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {copy.nav.mobileSupportBody}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
