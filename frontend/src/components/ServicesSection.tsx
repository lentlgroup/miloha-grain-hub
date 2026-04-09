import { Package, ShieldCheck, Store, Truck } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { createLocalizedText, getLocalizedText } from "@/lib/i18n";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: Store,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    borderColor: "hover:border-blue-500/30",
    title: createLocalizedText("Retail support", "Msaada wa rejareja"),
    desc: createLocalizedText(
      "Buy in smaller household or shop-ready quantities without losing product quality or clarity.",
      "Nunua kwa kiasi kidogo cha nyumbani au tayari kwa duka bila kupoteza ubora au uwazi wa bidhaa.",
    ),
  },
  {
    icon: Package,
    color: "bg-primary/10 text-primary",
    borderColor: "hover:border-primary/30",
    title: createLocalizedText("Wholesale supply", "Ugavi wa jumla"),
    desc: createLocalizedText(
      "Structured supply for resellers, restaurants, hospitality teams, and institutions that restock regularly.",
      "Ugavi uliopangwa kwa wauzaji, migahawa, timu za huduma, na taasisi zinazojaza stoo mara kwa mara.",
    ),
  },
  {
    icon: Truck,
    color: "bg-accent/15 text-accent-foreground dark:text-accent",
    borderColor: "hover:border-accent/30",
    title: createLocalizedText("Delivery coordination", "Uratibu wa usafirishaji"),
    desc: createLocalizedText(
      "Dispatch options are shaped around quantity, route, and location so delivery expectations stay practical.",
      "Chaguo za usafirishaji hupangwa kulingana na kiasi, njia, na eneo ili matarajio yawe ya vitendo.",
    ),
  },
  {
    icon: ShieldCheck,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    borderColor: "hover:border-emerald-500/30",
    title: createLocalizedText("Quality assurance", "Uhakiki wa ubora"),
    desc: createLocalizedText(
      "Batch handling focuses on cleanliness, freshness, and consistency before products reach customers.",
      "Ushughulikiaji wa mafungu huzingatia usafi, ubichi, na uthabiti kabla ya bidhaa kuwafikia wateja.",
    ),
  },
];

const ServiceCard = ({
  service,
  index,
  language,
}: {
  service: (typeof services)[number];
  index: number;
  language: string;
}) => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>(0.08);
  return (
    <div
      ref={ref}
      className={cn(
        "surface-panel group rounded-[1.9rem] p-7 card-elevated text-left border border-transparent transition-all duration-300",
        service.borderColor,
        "reveal-fade",
        isVisible && "is-visible",
      )}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110",
          service.color,
        )}
      >
        <service.icon size={26} />
      </div>
      <h3 className="mt-6 text-2xl font-bold text-foreground">
        {getLocalizedText(service.title, language as "en" | "sw")}
      </h3>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        {getLocalizedText(service.desc, language as "en" | "sw")}
      </p>
    </div>
  );
};

const ServicesSection = () => {
  const { language, copy } = useLanguage();
  const { ref: headRef, isVisible: headVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="services" className="section-shell section-alt py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div
          ref={headRef}
          className={cn("mx-auto mb-16 max-w-3xl text-center reveal-fade", headVisible && "is-visible")}
        >
          <div className="section-kicker">{copy.services.kicker}</div>
          <h2 className="mt-6 text-4xl font-bold text-foreground md:text-5xl">
            {copy.services.title}
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {copy.services.description}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <ServiceCard key={service.title.en} service={service} index={index} language={language} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
