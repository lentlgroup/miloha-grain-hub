import { CheckCircle2 } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const pillars = [
  "Practical, scalable businesses built for long-term value",
  "Disciplined operations with clear governance and accountability",
  "Trusted relationships with farmers, buyers, and communities",
  "Systems designed to grow across Tanzania and beyond",
];

export const LentlAbout = () => {
  const { ref: leftRef, inView: leftInView } = useScrollReveal<HTMLDivElement>(0.1);
  const { ref: rightRef, inView: rightInView } = useScrollReveal<HTMLDivElement>(0.1);

  return (
    <section id="about" className="bg-lentl-bg py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          {/* ── Left ── */}
          <div
            ref={leftRef}
            className={cn("reveal-right", leftInView && "in-view")}
          >
            {/* Kicker */}
            <div className="inline-flex items-center gap-2 rounded-full border border-lentl-navy/15 bg-lentl-card-bg px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-lentl-lime" />
              <span className="font-montserrat text-[11px] font-semibold uppercase tracking-[0.24em] text-lentl-navy">
                About LeNTL Group
              </span>
            </div>

            <h2 className="mt-6 font-montserrat text-4xl font-bold leading-tight text-lentl-navy lg:text-5xl">
              One Foundation.
              <br />
              <span className="text-lentl-green">Many Engines</span>
              <br />
              of Growth.
            </h2>

            <p className="mt-6 text-lg leading-8 text-lentl-charcoal/80">
              <strong className="font-semibold text-lentl-navy">
                LeNTL Group
              </strong>
              , legally operating as{" "}
              <strong className="font-semibold text-lentl-navy">
                Limbu Enterprises Limited
              </strong>
              , is a growing business group focused on building practical, scalable, and
              trusted enterprises across Tanzania and beyond.
            </p>

            <p className="mt-4 text-base leading-8 text-lentl-charcoal/70">
              The group is designed around a strong foundation, disciplined operations, and
              long-term expansion. Operating through the{" "}
              <strong className="font-semibold text-lentl-green">MILOHA</strong>{" "}
              umbrella brand, each business division is built to solve real market needs
              through trusted relationships and focused execution.
            </p>
          </div>

          {/* ── Right ── */}
          <div
            ref={rightRef}
            className={cn(
              "rounded-3xl border border-lentl-navy/10 bg-white p-8 shadow-[0_20px_60px_-24px_rgba(28,53,94,0.14)] reveal-left",
              rightInView && "in-view",
            )}
          >
            <p className="mb-5 font-montserrat text-[11px] font-semibold uppercase tracking-[0.22em] text-lentl-navy/50">
              Our Operating Principles
            </p>

            <ul className="space-y-4">
              {pillars.map((point, i) => (
                <li
                  key={point}
                  className={cn(
                    "flex items-start gap-3 reveal",
                    `reveal-delay-${i + 1}`,
                    rightInView && "in-view",
                  )}
                >
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-lentl-lime"
                  />
                  <span className="text-base font-medium leading-relaxed text-lentl-charcoal">
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            {/* Formal entity note */}
            <div className="mt-8 rounded-2xl border border-lentl-navy/10 bg-lentl-bg p-5">
              <p className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.22em] text-lentl-navy/50">
                Registered Entity
              </p>
              <p className="mt-2 font-montserrat text-lg font-bold text-lentl-navy">
                LIMBU ENTERPRISES LIMITED
              </p>
              <p className="mt-1 text-sm text-lentl-charcoal/60">
                Tanzania · Operating as LeNTL Group
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
