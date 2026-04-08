import { useEffect, useMemo, useRef, useState } from "react";
import { BarChart3, ShieldCheck, Truck, Users } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSiteContent } from "@/hooks/useSiteContent";
import { getLocalizedText } from "@/lib/i18n";

const icons = [Users, ShieldCheck, BarChart3, Truck];

const TrustMetricsSection = () => {
  const { content } = useSiteContent();
  const { language, copy } = useLanguage();
  const metrics = content.trustMetrics;
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState(() => metrics.map(() => 0));

  useEffect(() => {
    setCounts(metrics.map(() => 0));
  }, [metrics]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const duration = 1200;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);

      setCounts(metrics.map((metric) => Math.round(metric.value * progress)));

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      }
    };

    const frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [isVisible, metrics]);

  const values = useMemo(
    () =>
      metrics.map((metric, index) => ({
        ...metric,
        display: counts[index] ?? 0,
      })),
    [counts, metrics],
  );

  return (
    <section id="trust" ref={sectionRef} className="section-shell py-14">
      <div className="container mx-auto px-4">
        <div className="surface-panel-dark rounded-[2.2rem] px-6 py-8 text-secondary-foreground md:px-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary-foreground/65">{copy.trust.kicker}</p>
              <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
                {copy.trust.title}
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-secondary-foreground/70">
              {copy.trust.description}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {values.map((metric, index) => {
              const Icon = icons[index % icons.length];

              return (
                <div id={`trust-metric-${index + 1}`} key={metric.label.en} className="rounded-[1.6rem] border border-white/10 bg-white/7 p-5">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <Icon size={22} />
                  </div>
                  <p className="text-4xl font-bold text-white">
                    {metric.display}
                    {metric.suffix}
                  </p>
                  <p className="mt-2 text-base font-semibold text-secondary-foreground">{getLocalizedText(metric.label, language)}</p>
                  <p className="mt-2 text-sm leading-relaxed text-secondary-foreground/70">{getLocalizedText(metric.detail, language)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustMetricsSection;
