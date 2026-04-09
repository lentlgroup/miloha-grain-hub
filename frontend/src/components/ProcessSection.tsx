import { BadgeCheck, CircleDotDashed, PackageCheck, Sprout, Truck } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSiteContent } from "@/hooks/useSiteContent";
import { getLocalizedText } from "@/lib/i18n";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const icons = [Sprout, CircleDotDashed, BadgeCheck, PackageCheck, Truck];
const stepColors = [
  "bg-emerald-500/15 text-emerald-400",
  "bg-blue-500/15 text-blue-400",
  "bg-accent/15 text-accent",
  "bg-primary/15 text-primary",
  "bg-purple-500/15 text-purple-400",
];

const ProcessStep = ({
  step,
  index,
  language,
  totalSteps,
  sectionVisible,
}: {
  step: { title: { en: string; sw: string }; desc: { en: string; sw: string } };
  index: number;
  language: string;
  totalSteps: number;
  sectionVisible: boolean;
}) => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>(0.1);
  const Icon = icons[index % icons.length];
  const colorClass = stepColors[index % stepColors.length];
  const copy_step = language === "sw" ? "Hatua" : "Step";

  return (
    <div
      ref={ref}
      id={`process-step-${index + 1}`}
      className={cn(
        "surface-panel grid gap-5 rounded-[1.9rem] p-6 md:grid-cols-[96px_1fr] md:p-7 reveal-fade",
        (isVisible || sectionVisible) && "is-visible",
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative">
        <div className={cn("flex h-16 w-16 items-center justify-center rounded-[1.35rem] shadow-lg", colorClass)}>
          <Icon size={24} />
        </div>
        {index < totalSteps - 1 && (
          <div className="absolute left-[1.7rem] top-16 hidden h-[calc(100%+20px)] w-px step-connector md:block" />
        )}
      </div>
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-border/70 bg-muted/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/70">
            {copy_step} {index + 1}
          </span>
          <h3 className="text-2xl font-bold text-foreground">
            {getLocalizedText(step.title, language as "en" | "sw")}
          </h3>
        </div>
        <p className="max-w-3xl leading-8 text-muted-foreground">
          {getLocalizedText(step.desc, language as "en" | "sw")}
        </p>
      </div>
    </div>
  );
};

const ProcessSection = () => {
  const { content } = useSiteContent();
  const { language, copy } = useLanguage();
  const { ref: headRef, isVisible: headVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal<HTMLDivElement>(0.05);

  return (
    <section id="quality" className="section-shell py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div
          ref={headRef}
          className={cn("mx-auto mb-14 max-w-3xl text-center reveal-fade", headVisible && "is-visible")}
        >
          <div className="section-kicker">{copy.process.kicker}</div>
          <h2 className="mt-6 text-4xl font-bold text-foreground md:text-5xl">
            {copy.process.title}
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {copy.process.description}
          </p>
        </div>

        <div ref={sectionRef} className="relative grid gap-5">
          {content.processSteps.map((step, index) => (
            <ProcessStep
              key={step.title.en}
              step={step}
              index={index}
              language={language}
              totalSteps={content.processSteps.length}
              sectionVisible={sectionVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
