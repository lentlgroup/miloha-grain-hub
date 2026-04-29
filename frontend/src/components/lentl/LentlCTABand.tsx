import { ArrowRight, Building2, Globe, TrendingUp } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const stats = [
  { icon: Building2, value: "3", label: "MILOHA Divisions" },
  { icon: Globe,     value: "TZ", label: "Tanzania Operations" },
  { icon: TrendingUp, value: "1+", label: "Years Building" },
];

export const LentlCTABand = () => {
  const { ref, inView } = useScrollReveal<HTMLDivElement>(0.15);

  return (
    <section className="relative overflow-hidden bg-lentl-green py-20">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Accent glows */}
      <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-lentl-navy/30 to-transparent pointer-events-none" />
      <div className="absolute left-0 bottom-0 h-1/2 w-1/4 bg-gradient-to-r from-lentl-lime/10 to-transparent pointer-events-none" />

      <div ref={ref} className="relative z-10 mx-auto max-w-4xl px-4 py-4 text-center sm:px-6 lg:px-8">
        <p className={cn("font-montserrat text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60 reveal", inView && "in-view")}>
          Brand Promise
        </p>
        <h2 className={cn("mt-4 font-montserrat text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl reveal reveal-delay-1", inView && "in-view")}>
          Built to Structure
          <br />
          <span
            style={{
              WebkitTextStroke: "2px #7FBF3F",
              color: "transparent",
            }}
          >
            Growth.
          </span>
        </h2>
        <p className={cn("mx-auto mt-6 max-w-xl text-lg leading-8 text-white/70 reveal reveal-delay-2", inView && "in-view")}>
          Join a growing network of farmers, buyers, logistics partners, and business
          collaborators under the MILOHA ecosystem.
        </p>
        <div className={cn("mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center reveal reveal-delay-3", inView && "in-view")}>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-montserrat text-base font-bold text-lentl-green shadow-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
          >
            Start a Conversation <ArrowRight size={18} />
          </a>
          <a
            href="#divisions"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 font-montserrat text-base font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:border-white/50"
          >
            View Our Divisions
          </a>
        </div>

        {/* Stats strip */}
        <div className={cn("mt-14 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/15 reveal reveal-delay-4", inView && "in-view")}>
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center bg-lentl-green/50 py-5 px-4 backdrop-blur-sm">
              <s.icon size={16} className="mb-2 text-lentl-lime" />
              <span className="font-montserrat text-2xl font-black text-white">{s.value}</span>
              <span className="mt-1 text-xs font-medium text-white/55">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
