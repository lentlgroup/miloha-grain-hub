import { Target, Compass } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

export const LentlVisionMission = () => {
  const { ref, inView } = useScrollReveal<HTMLDivElement>(0.1);

  return (
    <section className="bg-lentl-navy py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section kicker */}
        <div
          ref={ref}
          className={cn("mb-12 text-center reveal", inView && "in-view")}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lentl-lime" />
            <span className="font-montserrat text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
              Vision &amp; Mission
            </span>
          </div>
          <h2 className="mt-6 font-montserrat text-4xl font-bold text-white lg:text-5xl">
            Where We Are Going
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Vision */}
          <div
            className={cn(
              "rounded-3xl border border-white/15 bg-white/[0.08] p-8 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.12] hover:-translate-y-1 reveal reveal-delay-1",
              inView && "in-view",
            )}
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-lentl-lime/20">
              <Target size={22} className="text-lentl-lime" />
            </div>
            <span className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.24em] text-lentl-lime/80">
              Vision
            </span>
            <h3 className="mt-2 font-montserrat text-xl font-bold text-white">
              A Leading Structured Enterprise Group in East Africa
            </h3>
            <p className="mt-4 text-base leading-8 text-white/65">
              To become a leading structured enterprise group in East Africa, recognized for
              excellence in food systems, logistics, and agricultural development — building
              lasting institutions that create generational value.
            </p>
          </div>

          {/* Mission */}
          <div
            className={cn(
              "rounded-3xl border border-white/15 bg-white/[0.08] p-8 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.12] hover:-translate-y-1 reveal reveal-delay-2",
              inView && "in-view",
            )}
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-lentl-gold/20">
              <Compass size={22} className="text-lentl-gold" />
            </div>
            <span className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.24em] text-lentl-gold/80">
              Mission
            </span>
            <h3 className="mt-2 font-montserrat text-xl font-bold text-white">
              Scalable, Disciplined, Trusted Businesses
            </h3>
            <p className="mt-4 text-base leading-8 text-white/65">
              To build scalable, disciplined, and trusted businesses under the MILOHA brand that
              create real value for customers, partners, communities, and the broader economy —
              through systems that last and relationships that matter.
            </p>
          </div>
        </div>

        {/* Values strip */}
        <div
          className={cn(
            "mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 reveal reveal-delay-3",
            inView && "in-view",
          )}
        >
          {["Integrity", "Discipline", "Growth", "Impact"].map((value) => (
            <div
              key={value}
              className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-center transition-colors hover:bg-white/[0.1]"
            >
              <p className="font-montserrat text-base font-bold text-white">{value}</p>
              <div className="mx-auto mt-2 h-px w-8 bg-lentl-lime/50" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
