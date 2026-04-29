import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Building2, Globe, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

type Metric = { value: string; numericValue: number; suffix: string; label: string; icon: React.ElementType };

const metrics: Metric[] = [
  { value: "3",  numericValue: 3,  suffix: "",  label: "Business Divisions", icon: Building2 },
  { value: "TZ", numericValue: 0,  suffix: "",  label: "Based in Tanzania",  icon: Globe },
  { value: "1+", numericValue: 1,  suffix: "+", label: "Years Growing",      icon: TrendingUp },
];

const divisions = ["Pure Grains", "Logistics", "Agro Solutions"];

/** Counts from 0 to `target` over `duration` ms, returns the current display value. */
function useCounter(target: number, duration = 800, start = false): number {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start || target === 0) return;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration, start]);

  return count;
}

const MetricItem = ({ metric, animate }: { metric: Metric; animate: boolean }) => {
  const counted = useCounter(metric.numericValue, 900, animate);
  const display = metric.numericValue === 0 ? metric.value : `${counted}${metric.suffix}`;

  return (
    <div className="px-4 first:pl-0">
      <metric.icon size={16} className="mb-2 text-lentl-lime" />
      <div className="font-montserrat text-2xl font-black text-white animate-count-up">
        {display}
      </div>
      <div className="mt-1 text-xs font-medium leading-snug text-white/50">{metric.label}</div>
    </div>
  );
};

export const LentlHero = () => {
  const metricsRef = useRef<HTMLDivElement>(null);
  const [metricsVisible, setMetricsVisible] = useState(false);

  useEffect(() => {
    const el = metricsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setMetricsVisible(true); observer.disconnect(); } },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden bg-lentl-navy">
      {/* Geometric grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial green accent blobs */}
      <div aria-hidden="true" className="absolute right-0 top-0 h-[60%] w-[45%] rounded-bl-full bg-lentl-green/20 blur-3xl pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-0 left-0 h-[40%] w-[35%] rounded-tr-full bg-lentl-lime/10 blur-3xl pointer-events-none" />
      {/* Extra accent for depth */}
      <div aria-hidden="true" className="absolute left-1/2 top-1/3 h-[30%] w-[20%] -translate-x-1/2 rounded-full bg-lentl-gold/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* ── Left: copy ── */}
          <div>
            {/* Brand chip */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-lentl-lime" />
              <span className="font-montserrat text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                LIMBU ENTERPRISES LIMITED
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-montserrat text-5xl font-black leading-[0.95] text-white sm:text-6xl lg:text-[72px]">
              Structured
              <br />
              for{" "}
              <span
                style={{
                  WebkitTextStroke: "2px #7FBF3F",
                  color: "transparent",
                }}
              >
                Growth.
              </span>
              <br />
              Built for
              <br />
              <span className="text-lentl-lime">Generations.</span>
            </h1>

            {/* Subheadline */}
            <p className="mt-8 max-w-xl text-lg leading-8 text-white/70">
              LeNTL Group is a diversified enterprise building scalable businesses across food,
              logistics, agriculture, and trade — through a unified system of brands led by{" "}
              <strong className="font-semibold text-white">MILOHA</strong>.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#divisions"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-montserrat text-base font-bold text-lentl-navy shadow-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
              >
                Explore Our Businesses <ArrowRight size={18} />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-4 font-montserrat text-base font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:border-white/50"
              >
                Contact Us
              </a>
            </div>

            {/* Metrics row */}
            <div
              ref={metricsRef}
              className="mt-14 grid grid-cols-3 divide-x divide-white/15"
            >
              {metrics.map((m) => (
                <MetricItem key={m.label} metric={m} animate={metricsVisible} />
              ))}
            </div>
          </div>

          {/* ── Right: corporate structure card ── */}
          <div className="hidden lg:block">
            <div className="rounded-3xl border border-white/15 bg-white/[0.08] p-8 backdrop-blur-sm shadow-2xl">
              <p className="mb-5 font-montserrat text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
                Corporate Structure
              </p>

              {/* Parent */}
              <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center">
                <div className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                  Parent Entity
                </div>
                <div className="mt-1 font-montserrat text-base font-bold text-white">
                  LIMBU ENTERPRISES LIMITED
                </div>
                <div className="mt-0.5 text-sm text-lentl-lime/90">LeNTL Group</div>
              </div>

              <div className="flex justify-center py-3">
                <div className="h-8 w-px bg-gradient-to-b from-white/30 to-transparent" />
              </div>

              {/* MILOHA */}
              <div className="rounded-2xl border border-lentl-lime/30 bg-lentl-green/30 px-5 py-4 text-center">
                <div className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.2em] text-lentl-lime/80">
                  Umbrella Brand
                </div>
                <div className="mt-1 font-montserrat text-2xl font-black text-white">MILOHA</div>
              </div>

              <div className="flex justify-center py-3">
                <div className="h-8 w-px bg-gradient-to-b from-white/30 to-transparent" />
              </div>

              {/* Divisions */}
              <div className="grid grid-cols-3 gap-2">
                {divisions.map((div) => (
                  <div
                    key={div}
                    className="rounded-xl border border-white/15 bg-white/[0.08] px-2 py-3 text-center transition-colors hover:bg-white/[0.14]"
                  >
                    <span className="font-montserrat text-xs font-semibold leading-snug text-white/80">
                      {div}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tagline badge */}
              <div className="mt-6 flex items-center justify-between rounded-2xl border border-lentl-lime/30 bg-lentl-lime/10 px-4 py-3">
                <span className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-lentl-lime">
                  One Foundation.
                </span>
                <span className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                  Many Engines of Growth.
                </span>
              </div>

              {/* MILOHA link */}
              <Link
                to="/miloha"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 font-montserrat text-sm font-semibold text-white transition-all hover:bg-white/20 hover:-translate-y-0.5"
              >
                Visit MILOHA Pure Grains <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/40">
        <span className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.22em]">
          Scroll to explore
        </span>
        <ChevronDown size={16} className="animate-bounce" />
      </div>
    </section>
  );
};
