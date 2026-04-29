import { ArrowRight, Wheat, Truck, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

type Division = {
  icon: React.ElementType;
  accentColor: string;
  borderColor: string;
  bgColor: string;
  topAccent: string;
  badge: string;
  title: string;
  sub: string;
  copy: string;
  cta: string;
  ctaHref: string;
  external?: boolean;
};

const divisionsList: Division[] = [
  {
    icon: Wheat,
    accentColor: "text-lentl-gold",
    borderColor: "border-lentl-gold/30",
    bgColor: "bg-lentl-gold/[0.06]",
    topAccent: "from-lentl-gold/40 to-transparent",
    badge: "Food & Trade",
    title: "MILOHA Pure Grains",
    sub: "Quality Grains. Reliable Supply.",
    copy: "Quality food grains sourcing, trading, packaging, and distribution for households, retailers, and institutions. Rice, maize, beans, and packaged products across Tanzania.",
    cta: "Explore Pure Grains",
    ctaHref: "/miloha",
    external: true,
  },
  {
    icon: Truck,
    accentColor: "text-lentl-lime",
    borderColor: "border-lentl-lime/30",
    bgColor: "bg-lentl-lime/[0.06]",
    topAccent: "from-lentl-lime/40 to-transparent",
    badge: "Movement & Storage",
    title: "MILOHA Logistics",
    sub: "Reliable Movement. On Time.",
    copy: "Reliable movement, storage, and delivery solutions supporting trade, supply chains, and business operations across Tanzania and the region.",
    cta: "Explore Logistics",
    ctaHref: "#contact",
  },
  {
    icon: Leaf,
    accentColor: "text-lentl-green",
    borderColor: "border-lentl-green/30",
    bgColor: "bg-lentl-green/[0.06]",
    topAccent: "from-lentl-green/40 to-transparent",
    badge: "Agriculture",
    title: "MILOHA Agro Solutions",
    sub: "Supporting Farmers. Building Systems.",
    copy: "Agricultural support solutions designed to strengthen farmers, supply systems, and market access — building the foundation for sustainable food production.",
    cta: "Explore Agro Solutions",
    ctaHref: "#contact",
  },
];

export const LentlDivisions = () => {
  const { ref, inView } = useScrollReveal<HTMLDivElement>(0.1);

  return (
    <section id="divisions" className="bg-lentl-bg py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={ref}
          className={cn("mb-14 text-center reveal", inView && "in-view")}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-lentl-navy/15 bg-white px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lentl-lime" />
            <span className="font-montserrat text-[11px] font-semibold uppercase tracking-[0.24em] text-lentl-navy">
              MILOHA Divisions
            </span>
          </div>
          <h2 className="mt-5 font-montserrat text-4xl font-bold text-lentl-navy lg:text-5xl">
            Our Business Divisions
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-lentl-charcoal/70">
            Three focused businesses, each solving specific market needs — operating under the
            shared MILOHA brand.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {divisionsList.map((div, i) => {
            const card = (
              <div
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-3xl border border-lentl-navy/10 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_28px_64px_-20px_rgba(28,53,94,0.18)] reveal",
                  i === 0 && "reveal-delay-1",
                  i === 1 && "reveal-delay-2",
                  i === 2 && "reveal-delay-3",
                  inView && "in-view",
                )}
              >
                {/* Top accent gradient bar */}
                <div
                  className={cn(
                    "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
                    div.topAccent,
                  )}
                />

                {/* Icon */}
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl border",
                    div.bgColor,
                    div.borderColor,
                  )}
                >
                  <div.icon size={24} className={div.accentColor} />
                </div>

                {/* Badge */}
                <span
                  className={cn(
                    "mt-5 inline-flex w-fit items-center rounded-full px-3 py-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.2em]",
                    div.bgColor,
                    div.accentColor,
                  )}
                >
                  {div.badge}
                </span>

                {/* Title */}
                <h3 className="mt-3 font-montserrat text-xl font-bold text-lentl-navy">
                  {div.title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-lentl-charcoal/50">{div.sub}</p>

                {/* Copy */}
                <p className="mt-4 flex-1 text-base leading-7 text-lentl-charcoal/70">{div.copy}</p>

                {/* CTA */}
                <div
                  className={cn(
                    "mt-8 inline-flex items-center gap-2 font-montserrat text-sm font-bold transition-all duration-200 group-hover:gap-3",
                    div.accentColor,
                  )}
                >
                  {div.cta} <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            );

            return div.external ? (
              <Link key={div.title} to={div.ctaHref}>{card}</Link>
            ) : (
              <a key={div.title} href={div.ctaHref}>{card}</a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
