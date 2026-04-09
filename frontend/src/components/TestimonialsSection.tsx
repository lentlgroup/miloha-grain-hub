import { Quote, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useLanguage } from "@/hooks/useLanguage";
import { useSiteContent } from "@/hooks/useSiteContent";
import { createLocalizedText, getLocalizedText } from "@/lib/i18n";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const buyerTypes = [
  createLocalizedText("Households", "Nyumbani"),
  createLocalizedText("Mini-markets", "Mini-market"),
  createLocalizedText("Hotels & kitchens", "Hoteli na jikoni"),
  createLocalizedText("Wholesale buyers", "Wanunuzi wa jumla"),
  createLocalizedText("Institutions", "Taasisi"),
];

const StarRating = ({ rating = 5 }: { rating?: number }) => (
  <div className="mb-5 flex justify-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "fill-accent text-accent" : "fill-white/20 text-white/20"}
      />
    ))}
  </div>
);

const TestimonialsSection = () => {
  const { content } = useSiteContent();
  const { language, copy } = useLanguage();
  const { ref: headRef, isVisible: headVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: bodyRef, isVisible: bodyVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="buyers" className="section-shell py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div
          ref={headRef}
          className={cn("mx-auto mb-14 max-w-3xl text-center reveal-fade", headVisible && "is-visible")}
        >
          <div className="section-kicker">{copy.buyers.kicker}</div>

          <h2 className="mt-6 text-4xl font-bold text-foreground md:text-5xl">
            {copy.buyers.title}
          </h2>

          <p className="mt-4 text-lg text-muted-foreground">
            {copy.buyers.description}
          </p>
        </div>

        <div
          ref={bodyRef}
          className={cn("reveal-fade", bodyVisible && "is-visible")}
        >
          <div className="surface-panel mb-8 rounded-[1.85rem] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              {copy.buyers.groupsTitle}
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {buyerTypes.map((buyerType) => (
                <div
                  key={buyerType.en}
                  className="rounded-full border border-border bg-background px-5 py-2 text-sm font-semibold text-foreground/75 transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {getLocalizedText(buyerType, language)}
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel-dark rounded-[2.1rem] px-8 py-10 text-secondary-foreground">
            <Carousel opts={{ loop: true }} className="mx-auto max-w-4xl">
              <CarouselContent>
                {content.testimonials.map((item, index) => {
                  const quote = getLocalizedText(item.quote, language);
                  const role = getLocalizedText(item.role, language);
                  const name =
                    typeof item.name === "string"
                      ? item.name
                      : getLocalizedText(item.name, language);

                  return (
                    <CarouselItem key={`${index}-${quote}`}>
                      <div className="rounded-[1.75rem] bg-white/8 p-8 text-center">
                        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                          <Quote size={24} />
                        </div>

                        <StarRating rating={5} />

                        <p className="mx-auto max-w-3xl text-xl leading-relaxed text-white md:text-2xl">
                          "{quote}"
                        </p>

                        <div className="mt-6">
                          <p className="text-lg font-semibold text-white">{name}</p>
                          <p className="text-sm uppercase tracking-[0.18em] text-secondary-foreground/60">
                            {role}
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>

              <CarouselPrevious className="bottom-0 left-2 top-auto translate-y-0 border-white/10 bg-white/10 text-white hover:bg-white/20 md:-left-12 md:top-1/2 md:-translate-y-1/2" />
              <CarouselNext className="bottom-0 right-2 top-auto translate-y-0 border-white/10 bg-white/10 text-white hover:bg-white/20 md:-right-12 md:top-1/2 md:-translate-y-1/2" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
