import { Wheat, Truck, Leaf, ArrowDown } from "lucide-react";

const divisions = [
  { label: "MILOHA\nPure Grains", icon: Wheat, accent: "text-lentl-gold" },
  { label: "MILOHA\nLogistics", icon: Truck, accent: "text-lentl-lime" },
  { label: "MILOHA\nAgro Solutions", icon: Leaf, accent: "text-lentl-lime" },
];

export const LentlArchitecture = () => {
  return (
    <section id="structure" className="bg-white py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
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
          <div className="w-full max-w-lg">
            <div className="rounded-2xl border-2 border-lentl-navy bg-lentl-navy px-6 py-5 text-center shadow-xl shadow-lentl-navy/20">
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

          {/* Arrow */}
          <div className="flex flex-col items-center py-3">
            <div className="h-8 w-px bg-lentl-navy/30" />
            <ArrowDown size={16} className="text-lentl-navy/40" />
          </div>

          {/* Level 2: MILOHA */}
          <div className="w-full max-w-md">
            <div className="rounded-2xl border-2 border-lentl-green bg-lentl-green px-6 py-5 text-center shadow-xl shadow-lentl-green/20">
              <p className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">
                Umbrella Brand & Platform
              </p>
              <p className="mt-1 font-montserrat text-3xl font-black text-white">MILOHA</p>
              <p className="mt-0.5 text-sm font-medium text-white/70">
                Market-facing operations across all divisions
              </p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center py-3">
            <div className="h-8 w-px bg-lentl-navy/30" />
            <ArrowDown size={16} className="text-lentl-navy/40" />
          </div>

          {/* Level 3: Divisions */}
          <div className="grid w-full gap-3 sm:grid-cols-3">
            {divisions.map((div, i) => (
              <div
                key={i}
                className="rounded-2xl border border-lentl-navy/15 bg-lentl-bg p-5 text-center shadow-sm"
              >
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-lentl-navy/8 text-lentl-navy">
                  <div.icon size={20} className={div.accent} />
                </div>
                <p className="font-montserrat text-sm font-bold leading-snug text-lentl-navy whitespace-pre-line">
                  {div.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Caption */}
        <p className="mt-10 text-center text-sm text-lentl-charcoal/50">
          Each MILOHA division operates with shared systems, brand identity, and corporate governance from LeNTL Group.
        </p>
      </div>
    </section>
  );
};
