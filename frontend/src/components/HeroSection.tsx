import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, Mouse, PackageCheck, Sparkles, Truck, Wheat } from "lucide-react";
import heroImage from "@/assets/hero-grains.jpg";
import SiteSearch from "@/components/SiteSearch";
import { useLanguage } from "@/hooks/useLanguage";
import { useSiteContent } from "@/hooks/useSiteContent";
import { createLocalizedText, getLocalizedText } from "@/lib/i18n";

const heroStats = [
  {
    value: createLocalizedText("Homes to Bulk", "Nyumbani hadi Jumla"),
    label: createLocalizedText(
      "Pack sizes that work for daily buying and larger restocking.",
      "Saizi za vifungashio zinazofaa kwa ununuzi wa kila siku na ujazaji wa kiasi kikubwa.",
    ),
  },
  {
    value: createLocalizedText("City + Regional", "Jiji + Mikoani"),
    label: createLocalizedText(
      "Pickup, Dar delivery, and planned dispatch outside the city.",
      "Kuchukua dukani, usafirishaji Dar, na mpango wa kusafirisha nje ya jiji.",
    ),
  },
  {
    value: createLocalizedText("Clean & Sorted", "Safi na Zilizochambuliwa"),
    label: createLocalizedText(
      "Careful handling that keeps products easy to trust and reorder.",
      "Ushughulikiaji wa makini unaofanya bidhaa ziwe rahisi kuamini na kuagiza tena.",
    ),
  },
];

const buyerGroups = [
  createLocalizedText("Households", "Nyumbani"),
  createLocalizedText("Retail shops", "Maduka ya rejareja"),
  createLocalizedText("Restaurants", "Migahawa"),
  createLocalizedText("Wholesale buyers", "Wanunuzi wa jumla"),
];

const orderSteps = [
  {
    icon: PackageCheck,
    title: createLocalizedText("Choose a grain", "Chagua nafaka"),
    desc: createLocalizedText(
      "Browse rice, maize, beans, and packaged options by size and buying style.",
      "Tazama mchele, mahindi, maharage, na bidhaa zilizofungashwa kulingana na saizi na mtindo wa ununuzi.",
    ),
  },
  {
    icon: BadgeCheck,
    title: createLocalizedText("Share the basics", "Shiriki taarifa za msingi"),
    desc: createLocalizedText(
      "Tell us the pack size, quantity, and location so we can shape the right option.",
      "Tuambie saizi ya kifungashio, kiasi, na eneo ili tukuandalie chaguo linalofaa.",
    ),
  },
  {
    icon: Truck,
    title: createLocalizedText("Get a clear quote", "Pata bei iliyo wazi"),
    desc: createLocalizedText(
      "We reply with product guidance, delivery planning, and the next action to take.",
      "Tunajibu kwa ushauri wa bidhaa, mpango wa usafirishaji, na hatua inayofuata.",
    ),
  },
];

const HeroSection = () => {
  const [offsetY, setOffsetY] = useState(0);
  const { content } = useSiteContent();
  const { language, copy } = useLanguage();

  useEffect(() => {
    const onScroll = () => setOffsetY(Math.min(window.scrollY * 0.14, 36));

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="home" className="section-shell relative overflow-hidden px-4 pb-14 pt-32 md:pb-20 md:pt-36">
      <div className="absolute inset-0 grain-grid opacity-25" />
      <div className="absolute right-[-4rem] top-24 h-48 w-48 rounded-full bg-accent/20 blur-3xl md:h-72 md:w-72" />
      <div className="absolute bottom-10 left-[-5rem] h-56 w-56 rounded-full bg-primary/15 blur-3xl md:h-72 md:w-72" />

      <div className="container relative z-10 px-0">
        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <div className="section-kicker">
              <Wheat size={15} />
              {copy.hero.kicker}
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[0.96] text-foreground sm:text-6xl lg:text-7xl">
              {copy.hero.titleStart}
              <span className="text-gradient">{copy.hero.titleAccent}</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
              {copy.hero.description}
            </p>

            <SiteSearch />

            <div className="mt-6 flex flex-wrap gap-3">
              {buyerGroups.map((group) => (
                <span
                  key={group.en}
                  className="rounded-full border border-border/70 bg-card/75 px-4 py-2 text-sm font-semibold text-foreground/80"
                >
                  {getLocalizedText(group, language)}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row">
              <a
                href="#products"
                className="inline-flex items-center gap-2 rounded-full bg-secondary px-7 py-3.5 text-base font-semibold text-secondary-foreground shadow-lg shadow-secondary/15 transition-transform hover:-translate-y-0.5"
              >
                {copy.hero.explore} <ArrowRight size={18} className="text-accent" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/75 px-7 py-3.5 text-base font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {copy.hero.customQuote}
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.value.en} className="surface-panel rounded-[1.65rem] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">{copy.hero.statsLabel}</p>
                  <p className="mt-3 text-2xl font-serif font-semibold text-foreground">{getLocalizedText(stat.value, language)}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{getLocalizedText(stat.label, language)}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
              <Mouse size={16} className="text-primary" />
              {copy.hero.scrollHint}
            </div>
          </div>

          <div className="relative">
            <div className="surface-panel-dark rounded-[2.2rem] p-4 md:p-5">
              <div className="relative overflow-hidden rounded-[1.8rem] border border-white/10">
                <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                  <Sparkles size={14} className="text-accent" />
                  {copy.hero.imageBadge}
                </div>
                <img
                  src={heroImage}
                  alt={copy.hero.kicker}
                  width={1920}
                  height={1080}
                  className="h-[420px] w-full object-cover md:h-[500px]"
                  style={{ transform: `translateY(${offsetY}px) scale(1.06)` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 rounded-[1.6rem] border border-white/10 bg-black/20 p-5 backdrop-blur-md">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">{copy.hero.imageKicker}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{copy.hero.imageTitle}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[1.7rem] border border-white/10 bg-white/8 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/65">{copy.hero.orderStepsTitle}</p>
                  <div className="mt-4 grid gap-4">
                    {orderSteps.map((step, index) => (
                      <div key={step.title.en} className="flex items-start gap-3">
                        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-accent">
                          <step.icon size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                              0{index + 1}
                            </span>
                            <p className="text-base font-semibold text-white">{getLocalizedText(step.title, language)}</p>
                          </div>
                          <p className="mt-1 text-sm leading-6 text-white/72">{getLocalizedText(step.desc, language)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.7rem] border border-white/10 bg-white/8 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/65">{copy.hero.highlightsTitle}</p>
                  <div className="mt-4 grid gap-3">
                    {content.promoHighlights.map((item) => (
                      <div key={item.en} className="rounded-2xl bg-white/8 px-4 py-4 text-sm leading-6 text-white/80">
                        {getLocalizedText(item, language)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
