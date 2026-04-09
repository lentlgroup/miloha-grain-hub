import { Compass, Eye, HeartHandshake, MapPin } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { createLocalizedText, getLocalizedText } from "@/lib/i18n";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const values = [
  {
    icon: Compass,
    title: createLocalizedText("Steady sourcing", "Upatikanaji thabiti"),
    desc: createLocalizedText(
      "We source with consistency in mind so repeat orders feel as dependable as first orders.",
      "Tunapata bidhaa kwa kuzingatia uthabiti ili oda za kurudia ziwe za kuaminika kama oda za kwanza.",
    ),
  },
  {
    icon: Eye,
    title: createLocalizedText("Visible quality", "Ubora unaoonekana"),
    desc: createLocalizedText(
      "From sorting to packaging, the product presentation is made to look clean, clear, and trustworthy.",
      "Kuanzia uchambuaji hadi ufungashaji, muonekano wa bidhaa umeundwa uonekane safi, wazi, na wa kuaminika.",
    ),
  },
  {
    icon: HeartHandshake,
    title: createLocalizedText("Helpful service", "Huduma yenye msaada"),
    desc: createLocalizedText(
      "Homes, shops, and bulk buyers get practical guidance instead of vague promises or hard-to-follow steps.",
      "Nyumba, maduka, na wanunuzi wa jumla hupata mwongozo wa vitendo badala ya ahadi zisizo wazi au hatua ngumu kufuata.",
    ),
  },
];

const operatingSignals = [
  createLocalizedText("Based in Tegeta Azania, Dar es Salaam", "Makao yako Tegeta Azania, Dar es Salaam"),
  createLocalizedText(
    "Supplying households, retail shelves, kitchens, and wholesale buyers",
    "Tunahudumia nyumba, rafu za rejareja, jikoni, na wanunuzi wa jumla",
  ),
  createLocalizedText(
    "Focused on grains that are clean, well packed, and easy to reorder",
    "Tunalenga nafaka zilizo safi, zimefungashwa vizuri, na rahisi kuagiza tena",
  ),
];

const AboutSection = () => {
  const { language, copy } = useLanguage();
  const { ref: leftRef, isVisible: leftVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: rightRef, isVisible: rightVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="about" className="section-shell section-alt py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div
            ref={leftRef}
            className={cn("reveal-fade-left", leftVisible && "is-visible")}
          >
            <div className="section-kicker">{copy.about.kicker}</div>
            <h2 className="mt-6 max-w-xl text-4xl font-bold text-foreground md:text-5xl">
              {copy.about.title}
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              {copy.about.description}
            </p>

            <div className="mt-8 space-y-3">
              {operatingSignals.map((signal) => (
                <div key={signal.en} className="surface-panel flex items-start gap-3 rounded-[1.4rem] px-4 py-4">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin size={16} />
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{getLocalizedText(signal, language)}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            ref={rightRef}
            className={cn("grid gap-6 md:grid-cols-3 reveal-fade-right", rightVisible && "is-visible")}
          >
            {values.map((value) => (
              <div key={value.title.en} className="surface-panel group rounded-[1.9rem] p-7 text-left transition-transform duration-300 hover:-translate-y-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-accent shadow-lg shadow-secondary/10 transition-transform duration-300 group-hover:scale-110">
                  <value.icon size={24} />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-foreground">{getLocalizedText(value.title, language)}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{getLocalizedText(value.desc, language)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
