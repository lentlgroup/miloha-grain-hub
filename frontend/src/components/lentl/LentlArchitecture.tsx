import { Wheat, Truck, Leaf, ArrowDown, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const divisions = [
  {
    label: "MILOHA\nPure Grains",
    sublabel: "Food & Trade",
    icon: Wheat,
    accent: "text-lentl-gold",
    border: "border-lentl-gold/25",
    bg: "bg-lentl-gold/[0.06]",
    href: "/miloha",
    external: true,
  },
  {
    label: "MILOHA\nLogistics",
    sublabel: "Movement & Storage",
    icon: Truck,
    accent: "text-lentl-lime",
    border: "border-lentl-lime/25",
    bg: "bg-lentl-lime/[0.06]",
    href: "#contact",
    external: false,
  },
  {
    label: "MILOHA\nAgro Solutions",
    sublabel: "Agriculture",
    icon: Leaf,
    accent: "text-lentl-green",
    border: "border-lentl-green/25",
    bg: "bg-lentl-green/[0.06]",
    href: "#contact",
    external: false,
  },
];

export const LentlArchitecture = () => {
  const { ref, inView } = useScrollReveal<HTMLDivElement>(0.1);

  return (
    <section id="structure" className="bg-white py-24 overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={ref}
          className={cn("text-center reveal", inView && "in-view")}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-lentl-navy/15 bg-lentl-bg px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lentl-lime" />
            <span className="font-montserrat text-[11px] font-semibold uppercase tracking-[0.24em] text-lentl-navy">
              Brand Architecture
            </span>
          </div>

          <h2 className="mt-6 font-montserrat text-4xl font-bold text-lentl-navy lg:text-5xl">
            Our Business Structure
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-lentl-charcoal/70">
            A clear corporate hierarchy designed for scale — one parent, one umbrella brand,
            three focused divisions.
          </p>
        </div>

        {/* Diagram */}
        <div className="mt-16 flex flex-col items-center gap-0">
          {/* Level 1: Parent */}
          <div
            className={cn(
              "w-full max-w-lg reveal reveal-delay-1",
              inView && "in-view",
            )}
          >
            <div className="group rounded-2xl border-2 border-lentl-navy bg-lentl-navy px-6 py-5 text-center shadow-xl shadow-lentl-navy/20 transition-all duration-300 hover:shadow-2xl hover:shadow-lentl-navy/30 hover:-translate-y-0.5">
              <p className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">
                Parent Entity
              </p>
              <p className="mt-1 font-montserrat text-xl font-black text-white">
                LIMBU ENTERPRISES LIMITED
              </p>
              <p className="mt-0.5 font-montserrat text-sm font-semibold text-lentl-lime/90">
                LeNTL Group
              </p>
            </div>
          </div>

          {/* Connector */}
          <div className="flex flex-col items-center py-3">
            <div className="h-8 w-0.5 bg-gradient-to-b from-lentl-navy/50 to-lentl-green/50" />
            <ArrowDown size={16} className="text-lentl-navy/40 -mt-0.5" />
          </div>

          {/* Level 2: MILOHA */}
          <div
            className={cn(
              "w-full max-w-md reveal reveal-delay-2",
              inView && "in-view",
            )}
          >
            <div className="group rounded-2xl border-2 border-lentl-green bg-lentl-green px-6 py-5 text-center shadow-xl shadow-lentl-green/20 transition-all duration-300 hover:shadow-2xl hover:shadow-lentl-green/30 hover:-translate-y-0.5">
              <p className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">
                Umbrella Brand &amp; Platform
              </p>
              <p className="mt-1 font-montserrat text-3xl font-black text-white">MILOHA</p>
              <p className="mt-0.5 text-sm font-medium text-white/70">
                Market-facing operations across all divisions
              </p>
            </div>
          </div>

          {/* Connector with fan-out lines (visual) */}
          <div className="relative flex flex-col items-center py-3">
            <div className="h-8 w-0.5 bg-gradient-to-b from-lentl-green/50 to-lentl-navy/30" />
            <ArrowDown size={16} className="text-lentl-navy/40 -mt-0.5" />
          </div>

          {/* Level 3: Divisions */}
          <div className="grid w-full gap-4 sm:grid-cols-3">
            {divisions.map((div, i) => {
              const content = (
                <div
                  className={cn(
                    "group flex flex-col items-center rounded-2xl border p-5 text-center transition-all duration-300 lentl-card-hover",
                    div.border,
                    div.bg,
                    "reveal",
                    i === 0 && "reveal-delay-3",
                    i === 1 && "reveal-delay-4",
                    i === 2 && "reveal-delay-5",
                    inView && "in-view",
                  )}
                >
                  <div
                    className={cn(
                      "mb-3 flex h-12 w-12 items-center justify-center rounded-xl border",
                      div.border,
                      div.bg,
                    )}
                  >
                    <div.icon size={22} className={div.accent} />
                  </div>
                  <p className="font-montserrat text-sm font-bold leading-snug text-lentl-navy whitespace-pre-line">
                    {div.label}
                  </p>
                  <p className={cn("mt-1 text-[11px] font-semibold uppercase tracking-[0.16em]", div.accent)}>
                    {div.sublabel}
                  </p>
                  {div.external && (
                    <span className={cn("mt-3 inline-flex items-center gap-1 text-[11px] font-semibold", div.accent)}>
                      Visit <ExternalLink size={11} />
                    </span>
                  )}
                </div>
              );
              return div.external ? (
                <Link key={div.label} to={div.href}>{content}</Link>
              ) : (
                <a key={div.label} href={div.href}>{content}</a>
              );
            })}
          </div>
        </div>

        {/* Caption */}
        <p
          className={cn(
            "mt-10 text-center text-sm text-lentl-charcoal/50 reveal reveal-delay-6",
            inView && "in-view",
          )}
        >
          Each MILOHA division operates with shared systems, brand identity, and corporate governance from LeNTL Group.
        </p>
      </div>
    </section>
  );
};
