import { ArrowRight, Building2, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  { label: "About LeNTL", href: "#about" },
  { label: "Our Structure", href: "#structure" },
  { label: "MILOHA Divisions", href: "#divisions" },
  { label: "Why Us", href: "#pillars" },
  { label: "Contact", href: "#contact" },
];

const divisions = [
  { label: "MILOHA Pure Grains", href: "/miloha", external: true },
  { label: "MILOHA Logistics", href: "#contact", external: false },
  { label: "MILOHA Agro Solutions", href: "#contact", external: false },
];

export const LentlFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-lentl-navy pt-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top CTA card */}
        <div className="mb-12 grid gap-6 rounded-3xl border border-white/15 bg-white/8 p-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.22em] text-lentl-lime/80">
              Next Step
            </p>
            <h3 className="mt-2 font-montserrat text-2xl font-bold text-white">
              Ready to Work with LeNTL Group?
            </h3>
            <p className="mt-3 max-w-md text-sm leading-7 text-white/65">
              Whether you are a buyer, investor, supplier, or strategic partner — reach out to
              explore how we can build something together.
            </p>
          </div>
          <div className="flex items-center">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-lentl-lime px-6 py-3.5 font-montserrat text-sm font-bold text-lentl-navy shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Contact Us <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Building2 size={18} className="text-lentl-lime" />
              </div>
              <div>
                <p className="font-montserrat text-base font-bold text-white">LeNTL Group</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  LIMBU ENTERPRISES
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-white/55">
              Structured for growth. Built for generations.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-4 font-montserrat text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Divisions */}
          <div>
            <h4 className="mb-4 font-montserrat text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
              MILOHA Divisions
            </h4>
            <ul className="space-y-2.5">
              {divisions.map((d) => (
                <li key={d.label}>
                  {d.external ? (
                    <Link
                      to={d.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {d.label}
                    </Link>
                  ) : (
                    <a
                      href={d.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {d.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-montserrat text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
              Contact
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-white/60">
                <MapPin size={15} className="mt-0.5 shrink-0 text-lentl-lime" />
                <span>Dar es Salaam, Tanzania</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <Phone size={15} className="shrink-0 text-lentl-lime" />
                <span>+255 XXX XXX XXX</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <Mail size={15} className="shrink-0 text-lentl-lime" />
                <span>info@lentlgroup.co.tz</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between">
            <p className="text-xs text-white/35">
              © {year} Limbu Enterprises Limited · LeNTL Group · All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-white/35">
              <Link to="/miloha" className="transition-colors hover:text-white/70">
                MILOHA Pure Grains
              </Link>
              <Link to="/admin/login" className="transition-colors hover:text-white/70">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
