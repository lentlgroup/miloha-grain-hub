import { Layers, Settings, TrendingUp, Globe } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const pillars = [
  {
    num: "01",
    icon: Layers,
    title: "Foundation",
    copy: "Built on reliable systems, verified relationships, and real-world operational discipline. Every LeNTL business starts with a strong, structured base.",
    accent: "bg-lentl-navy/[0.08] text-lentl-navy",
    numColor: "text-lentl-navy/20",
  },
  {
    num: "02",
    icon: Settings,
    title: "Structure",
    copy: "Every business division operates with clear processes, governance, and accountability. Structure is what separates sustainable businesses from temporary ones.",
    accent: "bg-lentl-green/[0.08] text-lentl-green",
    numColor: "text-lentl-green/20",
  },
  {
    num: "03",
    icon: TrendingUp,
    title: "Growth",
    copy: "We build for scale, designing systems that grow with demand and opportunity. Growth isn't accidental — it is the outcome of preparation and discipline.",
    accent: "bg-lentl-lime/10 text-lentl-green",
    numColor: "text-lentl-lime/30",
  },
  {
    num: "04",
    icon: Globe,
    title: "Impact",
    copy: "Our businesses solve real market problems for farmers, buyers, and communities. Every MILOHA division exists to create lasting, measurable value.",
    accent: "bg-lentl-gold/[0.08] text-lentl-gold",
    numColor: "text-lentl-gold/20",
  },
];

export const LentlPillars = () => {
  const { ref, inView } = useScrollReveal<HTMLDivElement>(0.1);

  return (
    <section id="pillars" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={ref}
          className={cn("mb-14 text-center reveal", inView && "in-view")}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-lentl-navy/15 bg-lentl-bg px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lentl-lime" />
            <span className="font-montserrat text-[11px] font-semibold uppercase tracking-[0.24em] text-lentl-navy">
              Why LeNTL Group
            </span>
          </div>

          <h2 className="mt-6 font-montserrat text-4xl font-bold text-lentl-navy lg:text-5xl">
            Our Operating Philosophy
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-lentl-charcoal/70">
            Four principles that guide every business decision across all LeNTL divisions.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              className={cn(
                "group relative rounded-3xl border border-lentl-navy/10 p-7 transition-all duration-300 hover:shadow-[0_16px_40px_-16px_rgba(28,53,94,0.12)] hover:-translate-y-1 reveal",
                i === 0 && "reveal-delay-1",
                i === 1 && "reveal-delay-2",
                i === 2 && "reveal-delay-3",
                i === 3 && "reveal-delay-4",
                inView && "in-view",
              )}
            >
              {/* Large background number */}
              <span className={cn("absolute right-5 top-4 font-montserrat text-5xl font-black select-none pointer-events-none", p.numColor)}>
                {p.num}
              </span>

              <div
                className={cn(
                  "relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl",
                  p.accent,
                )}
              >
                <p.icon size={22} />
              </div>
              <h3 className="font-montserrat text-lg font-bold text-lentl-navy">{p.title}</h3>
              <p className="mt-3 text-sm leading-7 text-lentl-charcoal/70">{p.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
