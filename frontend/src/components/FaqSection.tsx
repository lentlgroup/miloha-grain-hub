import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/hooks/useLanguage";
import { useSiteContent } from "@/hooks/useSiteContent";
import { getLocalizedText } from "@/lib/i18n";
import { focusSearchTarget, SEARCH_NAVIGATION_EVENT, type SearchNavigationDetail } from "@/lib/site-search";

const FaqSection = () => {
  const { content } = useSiteContent();
  const { language, copy } = useLanguage();
  const [openItem, setOpenItem] = useState<string>("");
  const [pendingTarget, setPendingTarget] = useState<string | null>(null);

  useEffect(() => {
    const onNavigate = (event: Event) => {
      const detail = (event as CustomEvent<SearchNavigationDetail>).detail;

      if (detail.result.kind !== "faq") {
        return;
      }

      setOpenItem(detail.result.itemKey ?? "");
      setPendingTarget(detail.result.anchor);
    };

    window.addEventListener(SEARCH_NAVIGATION_EVENT, onNavigate as EventListener);

    return () => window.removeEventListener(SEARCH_NAVIGATION_EVENT, onNavigate as EventListener);
  }, []);

  useEffect(() => {
    if (!pendingTarget) {
      return;
    }

    const timeout = window.setTimeout(() => {
      focusSearchTarget(pendingTarget, "faq");
      setPendingTarget(null);
    }, 120);

    return () => window.clearTimeout(timeout);
  }, [openItem, pendingTarget]);

  return (
    <section id="faq" className="section-shell py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <div className="section-kicker">{copy.faq.kicker}</div>
            <h2 className="mt-6 text-4xl font-bold text-foreground md:text-5xl">
              {copy.faq.title}
            </h2>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              {copy.faq.description}
            </p>
            <div className="surface-panel mt-8 rounded-[1.8rem] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{copy.faq.tailoredTitle}</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {copy.faq.tailoredBody}
              </p>
            </div>
          </div>

          <div className="surface-panel rounded-[2rem] p-6">
            <Accordion type="single" collapsible className="w-full" value={openItem} onValueChange={setOpenItem}>
              {content.faqs.map((faq, index) => (
                <AccordionItem id={`faq-item-${index + 1}`} key={faq.question.en} value={`item-${index}`} className="border-border/70">
                  <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline">
                    {getLocalizedText(faq.question, language)}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                    {getLocalizedText(faq.answer, language)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
