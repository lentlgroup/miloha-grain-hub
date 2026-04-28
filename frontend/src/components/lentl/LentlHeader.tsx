import { useState, useEffect } from "react";
import { Building2, Menu, X, PhoneCall, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "About LeNTL", href: "#about" },
  { label: "Our Structure", href: "#structure" },
  { label: "MILOHA Divisions", href: "#divisions" },
  { label: "Why Us", href: "#pillars" },
  { label: "Contact", href: "#contact" },
];

export const LentlHeader = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = () => setOpen(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/97 backdrop-blur-xl shadow-[0_4px_30px_-8px_rgba(28,53,94,0.2)] border-b border-lentl-navy/10"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <a href="#home" className="group flex shrink-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lentl-navy text-white shadow-md transition-colors group-hover:bg-lentl-navy-dark">
              <Building2 size={20} />
            </div>
            <div>
              <span className="block font-montserrat text-lg font-bold leading-none tracking-tight text-lentl-navy">
                LeNTL Group
              </span>
              <span className="mt-0.5 hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-lentl-green sm:block">
                LIMBU ENTERPRISES LIMITED
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-semibold text-lentl-charcoal transition-colors hover:bg-lentl-bg hover:text-lentl-navy"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/miloha"
              className="flex items-center gap-1.5 rounded-full border border-lentl-green/30 px-4 py-2 text-sm font-semibold text-lentl-green transition-colors hover:bg-lentl-bg"
            >
              MILOHA
              <ArrowUpRight size={14} />
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-lentl-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-lentl-navy-dark"
            >
              <PhoneCall size={14} />
              Contact Us
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-lentl-navy/20 bg-white/80 text-lentl-navy md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-lentl-navy/10 bg-white shadow-xl md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <nav className="grid gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className="block rounded-xl px-4 py-3 text-sm font-semibold text-lentl-charcoal transition-colors hover:bg-lentl-bg hover:text-lentl-navy"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-4 grid gap-2 border-t border-lentl-navy/10 pt-4">
              <Link
                to="/miloha"
                onClick={handleNavClick}
                className="flex items-center justify-center gap-2 rounded-xl border border-lentl-green/30 px-4 py-3 text-sm font-semibold text-lentl-green transition-colors hover:bg-lentl-bg"
              >
                Visit MILOHA Pure Grains <ArrowUpRight size={14} />
              </Link>
              <a
                href="#contact"
                onClick={handleNavClick}
                className="block rounded-xl bg-lentl-navy px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-lentl-navy-dark"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
