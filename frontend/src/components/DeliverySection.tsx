import { Clock3, MapPinned, Route, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSiteContent } from "@/hooks/useSiteContent";
import { createLocalizedText, getLocalizedText } from "@/lib/i18n";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const planningSteps = [
  createLocalizedText(
    "Choose the product, quantity, and pack size you need.",
    "Chagua bidhaa, kiasi, na saizi ya kifungashio unachohitaji.",
  ),
  createLocalizedText(
    "Share whether you want pickup, city delivery, or regional dispatch.",
    "Shiriki kama unahitaji kuchukua dukani, usafirishaji wa jiji, au usafirishaji wa mikoani.",
  ),
  createLocalizedText(
    "We confirm availability, route, and a realistic delivery window.",
    "Tunathibitisha upatikanaji, njia, na muda halisi wa kufikisha.",
  ),
  createLocalizedText(
    "Repeat clients can align recurring orders for faster approval and dispatch.",
    "Wateja wa kurudia wanaweza kupanga oda za mara kwa mara kwa idhini na usafirishaji wa haraka.",
  ),
];

const DeliverySection = () => {
  const { content } = useSiteContent();
  const { language, copy } = useLanguage();
  const { ref: leftRef, isVisible: leftVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: rightRef, isVisible: rightVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="coverage" className="section-shell py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div
            ref={leftRef}
            className={cn("reveal-fade-left", leftVisible && "is-visible")}
          >
            <div className="section-kicker">{copy.delivery.kicker}</div>
            <h2 className="mt-6 text-4xl font-bold text-foreground md:text-5xl">
              {copy.delivery.title}
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              {copy.delivery.description}
            </p>

            <div className="surface-panel-dark mt-8 rounded-[2rem] p-6 text-secondary-foreground">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-white/8 p-5">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <MapPinned size={22} />
                  </div>
                  <p className="text-xl font-semibold text-white">{copy.delivery.pickupTitle}</p>
                  <p className="mt-2 text-sm leading-relaxed text-secondary-foreground/70">
                    {copy.delivery.pickupBody}
                  </p>
                </div>
                <div className="rounded-[1.5rem] bg-white/8 p-5">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <ShieldCheck size={22} />
                  </div>
                  <p className="text-xl font-semibold text-white">{copy.delivery.windowsTitle}</p>
                  <p className="mt-2 text-sm leading-relaxed text-secondary-foreground/70">
                    {copy.delivery.windowsBody}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/8 p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-secondary-foreground/70">
                  <Route size={16} />
                  {copy.delivery.deliveryView}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {content.deliveryZones.map((zone, index) => (
                    <div id={`delivery-zone-${index + 1}`} key={zone.zone.en} className="rounded-2xl bg-secondary/70 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-white">{getLocalizedText(zone.zone, language)}</p>
                        <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                          {getLocalizedText(zone.eta, language)}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-secondary-foreground/70">{getLocalizedText(zone.note, language)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            ref={rightRef}
            className={cn("surface-panel rounded-[2rem] p-6 reveal-fade-right", rightVisible && "is-visible")}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Clock3 size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">{copy.delivery.planningKicker}</p>
                <h3 className="text-2xl font-bold text-foreground">{copy.delivery.planningTitle}</h3>
              </div>
            </div>

            <div className="space-y-4">
              {planningSteps.map((item, index) => (
                <div key={item.en} className="flex gap-4 rounded-2xl bg-muted/60 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-sm leading-relaxed text-muted-foreground">{getLocalizedText(item, language)}</p>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              {copy.delivery.askDelivery}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliverySection;
