import { BadgeCheck, CircleDotDashed, PackageCheck, Sprout, Truck } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSiteContent } from "@/hooks/useSiteContent";
import { getLocalizedText } from "@/lib/i18n";

const icons = [Sprout, CircleDotDashed, BadgeCheck, PackageCheck, Truck];

const ProcessSection = () => {
  const { content } = useSiteContent();
  const { language, copy } = useLanguage();

  return (
    <section id="quality" className="section-shell py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="section-kicker">{copy.process.kicker}</div>
          <h2 className="mt-6 text-4xl font-bold text-foreground md:text-5xl">
            {copy.process.title}
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {copy.process.description}
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-[1.7rem] top-8 hidden h-[calc(100%-4rem)] w-px bg-border md:block" />
          <div className="grid gap-5">
            {content.processSteps.map((step, index) => {
              const Icon = icons[index % icons.length];

              return (
                <div
                  key={step.title.en}
                  id={`process-step-${index + 1}`}
                  className="surface-panel grid gap-5 rounded-[1.9rem] p-6 md:grid-cols-[96px_1fr] md:p-7"
                >
                  <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[1.35rem] bg-secondary text-accent shadow-lg shadow-secondary/10">
                      <Icon size={24} />
                    </div>
                  </div>
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-border/70 bg-muted/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/70">
                        {copy.process.step} {index + 1}
                      </span>
                      <h3 className="text-2xl font-bold text-foreground">{getLocalizedText(step.title, language)}</h3>
                    </div>
                    <p className="max-w-3xl leading-8 text-muted-foreground">{getLocalizedText(step.desc, language)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
