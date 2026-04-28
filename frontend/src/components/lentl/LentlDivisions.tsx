import { ArrowRight, Wheat, Truck, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

type Division = {
  icon: React.ElementType;
  color: string;
  borderColor: string;
  bgColor: string;
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
    color: "text-lentl-gold",
    borderColor: "border-lentl-gold/30",
    bgColor: "bg-lentl-gold/8",
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
    color: "text-lentl-lime",
    borderColor: "border-lentl-lime/30",
    bgColor: "bg-lentl-lime/8",
    badge: "Movement & Storage",
    title: "MILOHA Logistics",
    sub: "Reliable Movement. On Time.",
    copy: "Reliable movement, storage, and delivery solutions supporting trade, supply chains, and business operations across Tanzania and the region.",
    cta: "Explore Logistics",
    ctaHref: "#contact",
  },
  {
    icon: Leaf,
    color: "text-lentl-green",
    borderColor: "border-lentl-green/30",
    bgColor: "bg-lentl-green/8",
    badge: "Agriculture",
    title: "MILOHA Agro Solutions",
    sub: "Supporting Farmers. Building Systems.",
    copy: "Agricultural support solutions designed to strengthen farmers, supply systems, and market access — building the foundation for sustainable food production.",
    cta: "Explore Agro Solutions",
    ctaHref: "#contact",
  },
];

export const LentlDivisions = () => {
  return (
    <section id="divisions" className="bg-lentl-bg py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
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
          {divisionsList.map((div) => (
            <div
              key={div.title}
              className="group flex flex-col rounded-3xl border border-lentl-navy/10 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(28,53,94,0.15)]"
            >
              {/* Icon */}
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${div.bgColor} ${div.borderColor} border`}
              >
                <div.icon size={24} className={div.color} />
              </div>

              {/* Badge */}
              <span
                className={`mt-5 inline-flex w-fit items-center rounded-full px-3 py-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] ${div.bgColor} ${div.color}`}
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
              {div.external ? (
                <Link
                  to={div.ctaHref}
                  className={`mt-8 inline-flex items-center gap-2 font-montserrat text-sm font-bold transition-colors ${div.color} hover:opacity-80`}
                >
                  {div.cta} <ArrowRight size={15} />
                </Link>
              ) : (
                <a
                  href={div.ctaHref}
                  className={`mt-8 inline-flex items-center gap-2 font-montserrat text-sm font-bold transition-colors ${div.color} hover:opacity-80`}
                >
                  {div.cta} <ArrowRight size={15} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
