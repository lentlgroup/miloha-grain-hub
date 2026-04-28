import { ArrowRight } from "lucide-react";

export const LentlCTABand = () => {
  return (
    <section className="relative overflow-hidden bg-lentl-green py-20">
      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Accent glow */}
      <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-lentl-navy/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-4 text-center sm:px-6 lg:px-8">
        <p className="font-montserrat text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">
          Brand Promise
        </p>
        <h2 className="mt-4 font-montserrat text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
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
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/70">
          Join a growing network of farmers, buyers, logistics partners, and business
          collaborators under the MILOHA ecosystem.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-montserrat text-base font-bold text-lentl-green shadow-xl transition-transform hover:-translate-y-0.5"
          >
            Start a Conversation <ArrowRight size={18} />
          </a>
          <a
            href="#divisions"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 font-montserrat text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            View Our Divisions
          </a>
        </div>
      </div>
    </section>
  );
};
