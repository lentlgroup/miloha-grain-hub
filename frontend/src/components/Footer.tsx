import { ArrowRight, Mail, MapPin, Phone, Wheat } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const Footer = () => {
  const { language, copy } = useLanguage();

  const quickLinks = [
    { label: copy.nav.home, href: "#home" },
    { label: copy.nav.about, href: "#about" },
    { label: copy.nav.products, href: "#products" },
    { label: copy.nav.delivery, href: "#coverage" },
    { label: copy.nav.services, href: "#services" },
  ];

  const coreRange = language === "sw"
    ? ["Mchele bora", "Mahindi bora", "Maharage mchanganyiko", "Bidhaa zilizofungashwa"]
    : ["Premium rice", "Quality maize", "Mixed beans", "Packaged grains"];

  return (
    <footer className="section-shell bg-secondary py-14 text-secondary-foreground">
      <div className="container mx-auto px-4">
        <div className="mb-10 grid gap-8 rounded-[2rem] border border-white/10 bg-white/6 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-accent">
                <Wheat size={20} />
              </div>
              <div>
                <p className="text-2xl font-serif font-semibold text-white">{copy.brand.short}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-foreground/60">{copy.brand.tagline}</p>
              </div>
            </div>
            <p className="mt-5 max-w-xl text-sm leading-7 text-secondary-foreground/70">
              {copy.footer.summary}
            </p>
          </div>

          <div className="rounded-[1.7rem] border border-white/10 bg-white/6 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{copy.footer.nextStep}</p>
            <h3 className="mt-3 text-2xl font-bold text-white">{copy.footer.title}</h3>
            <p className="mt-3 text-sm leading-7 text-secondary-foreground/70">
              {copy.footer.body}
            </p>
            <a
              href="#contact"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              {copy.footer.cta} <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary-foreground/55">{copy.footer.navigate}</h4>
            <ul className="mt-4 space-y-3 text-sm text-secondary-foreground/70">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary-foreground/55">{copy.footer.range}</h4>
            <ul className="mt-4 space-y-3 text-sm text-secondary-foreground/70">
              {coreRange.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary-foreground/55">{copy.footer.location}</h4>
            <div className="mt-4 flex items-start gap-3 text-sm text-secondary-foreground/70">
              <MapPin size={16} className="mt-0.5 shrink-0 text-accent" />
              <p>Tegeta Azania, Dar es Salaam, Tanzania</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary-foreground/55">{copy.footer.contact}</h4>
            <div className="mt-4 space-y-3 text-sm text-secondary-foreground/70">
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-accent" />
                <span>+255 XXX XXX XXX</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-accent" />
                <span>info@milohapuregrains.co.tz</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-secondary-foreground/40">
          © {new Date().getFullYear()} {copy.brand.short}. {copy.footer.rights}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
