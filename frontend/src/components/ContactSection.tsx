import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Mail, MapPin, MessageSquareText, Phone, Send, ShieldCheck, Truck } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { submitInquiry } from "@/lib/api";
import { createLocalizedText, getLocalizedText } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { useSiteContent } from "@/hooks/useSiteContent";

const buyerTypeOptions = [
  { id: "household", label: createLocalizedText("Household", "Nyumbani") },
  { id: "retail-shop", label: createLocalizedText("Retail Shop", "Duka la rejareja") },
  { id: "restaurant-hotel", label: createLocalizedText("Restaurant / Hotel", "Mgahawa / Hoteli") },
  { id: "wholesale-buyer", label: createLocalizedText("Wholesale Buyer", "Mnunuzi wa jumla") },
  { id: "institution", label: createLocalizedText("Institution", "Taasisi") },
];

const packagingOptions = [
  { id: "1kg", label: createLocalizedText("1kg", "1kg") },
  { id: "5kg", label: createLocalizedText("5kg", "5kg") },
  { id: "25kg", label: createLocalizedText("25kg", "25kg") },
  { id: "50kg", label: createLocalizedText("50kg", "50kg") },
  { id: "mixed", label: createLocalizedText("Mixed request", "Ombi la mchanganyiko") },
];

const guidanceCards = [
  {
    icon: ShieldCheck,
    title: createLocalizedText("Choose the closest buyer type", "Chagua aina ya mnunuzi inayokufaa"),
    desc: createLocalizedText(
      "That helps us suggest the right quantity range, pack sizes, and service level first.",
      "Hilo hutusaidia kupendekeza kiwango cha kiasi, saizi za vifungashio, na kiwango cha huduma kinachofaa kwanza.",
    ),
  },
  {
    icon: Truck,
    title: createLocalizedText("Add product, pack size, and location", "Ongeza bidhaa, saizi ya kifungashio, na eneo"),
    desc: createLocalizedText(
      "Those three details help us plan delivery or pickup without sending you through extra back-and-forth.",
      "Maelezo hayo matatu hutusaidia kupanga usafirishaji au kuchukua dukani bila kukuongezea mawasiliano ya ziada.",
    ),
  },
  {
    icon: Clock3,
    title: createLocalizedText("Leave the fastest contact method", "Acha njia ya mawasiliano ya haraka"),
    desc: createLocalizedText(
      "We can respond more clearly when we know how best to reach you for confirmation.",
      "Tunaweza kujibu kwa uwazi zaidi tukijua njia bora ya kukufikia kwa uthibitisho.",
    ),
  },
];

const fieldClasses =
  "w-full rounded-2xl border border-input/80 bg-background/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10";

type ContactFormState = {
  buyerType: string;
  productId: string;
  packaging: string;
  quantity: string;
  location: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

const createInitialForm = (productId = ""): ContactFormState => ({
  buyerType: buyerTypeOptions[0].id,
  productId,
  packaging: packagingOptions[0].id,
  quantity: "",
  location: "Dar es Salaam",
  name: "",
  email: "",
  phone: "",
  message: "",
});

const ContactSection = () => {
  const { toast } = useToast();
  const { content } = useSiteContent();
  const { language, copy } = useLanguage();
  const products = content.products;
  const defaultProductId = products[0]?.id ?? "";
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<ContactFormState>(() => createInitialForm(defaultProductId));

  const selectedBuyerType = buyerTypeOptions.find((option) => option.id === form.buyerType) ?? buyerTypeOptions[0];
  const selectedPackaging = packagingOptions.find((option) => option.id === form.packaging) ?? packagingOptions[0];
  const selectedProduct = products.find((product) => product.id === form.productId) ?? products[0];

  const steps = [
    { id: 1, label: copy.contact.steps.who },
    { id: 2, label: copy.contact.steps.what },
    { id: 3, label: copy.contact.steps.reach },
  ];

  const summary = useMemo(() => {
    const parts = [
      getLocalizedText(selectedBuyerType.label, language),
      selectedProduct ? getLocalizedText(selectedProduct.name, language) : "",
      getLocalizedText(selectedPackaging.label, language),
      form.quantity,
      form.location,
    ].filter(Boolean);

    return parts.join(" • ");
  }, [form.location, form.quantity, language, selectedBuyerType.label, selectedPackaging.label, selectedProduct]);

  const nextStep = () => setStep((current) => Math.min(current + 1, 3));
  const prevStep = () => setStep((current) => Math.max(current - 1, 1));

  useEffect(() => {
    if (!products.some((product) => product.id === form.productId) && defaultProductId) {
      setForm((current) => ({ ...current, productId: defaultProductId }));
    }
  }, [defaultProductId, form.productId, products]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedProduct) {
      return;
    }

    try {
      setIsSubmitting(true);
      await submitInquiry({
        buyerType: getLocalizedText(selectedBuyerType.label, language),
        product: getLocalizedText(selectedProduct.name, language),
        packaging: getLocalizedText(selectedPackaging.label, language),
        quantity: form.quantity,
        location: form.location,
        name: form.name,
        email: form.email,
        phone: form.phone,
        language,
        message: form.message,
      });

      toast({
        title: copy.contact.submittedTitle,
        description: copy.contact.submittedBody,
      });

      setForm(createInitialForm(defaultProductId));
      setStep(1);
    } catch (error) {
      toast({
        title: copy.contact.failedTitle,
        description: error instanceof Error ? error.message : copy.contact.failedBody,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-shell py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="section-kicker">{copy.contact.kicker}</div>
          <h2 className="mt-6 text-4xl font-bold text-foreground md:text-5xl">
            {copy.contact.title}
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {copy.contact.description}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <div className="surface-panel-dark rounded-[2rem] p-6 text-secondary-foreground md:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-accent">
                  <MessageSquareText size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary-foreground/60">{copy.contact.beforeSubmit}</p>
                  <h3 className="mt-2 text-3xl font-bold text-white">{copy.contact.beforeSubmitTitle}</h3>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {guidanceCards.map((item) => (
                  <div key={item.title.en} className="rounded-[1.4rem] border border-white/10 bg-white/8 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-accent">
                        <item.icon size={18} />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-white">{getLocalizedText(item.title, language)}</p>
                        <p className="mt-1 text-sm leading-6 text-secondary-foreground/72">{getLocalizedText(item.desc, language)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-panel rounded-[2rem] p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-muted/55 p-5">
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-primary" />
                    <p className="font-semibold text-foreground">{copy.contact.location}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">Tegeta Azania, Dar es Salaam, Tanzania</p>
                </div>
                <div className="rounded-[1.5rem] bg-muted/55 p-5">
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-primary" />
                    <p className="font-semibold text-foreground">{copy.contact.phone}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">+255 XXX XXX XXX</p>
                </div>
                <div className="rounded-[1.5rem] bg-muted/55 p-5 sm:col-span-2">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-primary" />
                    <p className="font-semibold text-foreground">{copy.contact.email}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">info@milohapuregrains.co.tz</p>
                </div>
              </div>
            </div>

            <div className="surface-panel overflow-hidden rounded-[2rem] aspect-video">
              <iframe
                title={`${copy.brand.short} ${copy.contact.location}`}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15840.5!2d39.25!3d-6.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNDUnMDAuMCJTIDM5wrAxNScwMC4wIkU!5e0!3m2!1sen!2stz!4v1600000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="surface-panel rounded-[2rem] p-6 shadow-xl md:p-8">
            <div className="grid gap-3 md:grid-cols-3">
              {steps.map((item) => {
                const isActive = step === item.id;
                const isComplete = step > item.id;

                return (
                  <div
                    key={item.id}
                    className={`rounded-[1.5rem] border px-4 py-4 ${isActive || isComplete
                      ? "border-secondary bg-secondary text-secondary-foreground"
                      : "border-border/70 bg-muted/45 text-muted-foreground"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-xs font-semibold">
                        {isComplete ? <CheckCircle2 size={15} /> : item.id}
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">
                          {copy.process.step} {item.id}
                        </p>
                        <p className="text-sm font-semibold">{item.label}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-[1.5rem] bg-muted/55 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">{copy.contact.currentRequest}</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {summary || copy.contact.currentRequestEmpty}
              </p>
            </div>

            {step === 1 && (
              <div className="mt-8 space-y-5">
                <div>
                  <label className="mb-3 block text-sm font-medium text-foreground">{copy.contact.buyerType}</label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {buyerTypeOptions.map((buyerType) => (
                      <button
                        key={buyerType.id}
                        type="button"
                        onClick={() => setForm((current) => ({ ...current, buyerType: buyerType.id }))}
                        className={`rounded-[1.4rem] border px-4 py-4 text-left text-sm transition-colors ${form.buyerType === buyerType.id
                          ? "border-secondary bg-secondary text-secondary-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          }`}
                      >
                        {getLocalizedText(buyerType.label, language)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="surface-soft rounded-[1.5rem] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">{copy.contact.whyStart}</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {copy.contact.whyStartBody}
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor="product" className="mb-2 block text-sm font-medium text-foreground">
                    {copy.contact.product}
                  </label>
                  <select
                    id="product"
                    value={form.productId}
                    onChange={(event) => setForm((current) => ({ ...current, productId: event.target.value }))}
                    className={fieldClasses}
                  >
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {getLocalizedText(product.name, language)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="packaging" className="mb-2 block text-sm font-medium text-foreground">
                    {copy.contact.packaging}
                  </label>
                  <select
                    id="packaging"
                    value={form.packaging}
                    onChange={(event) => setForm((current) => ({ ...current, packaging: event.target.value }))}
                    className={fieldClasses}
                  >
                    {packagingOptions.map((item) => (
                      <option key={item.id} value={item.id}>
                        {getLocalizedText(item.label, language)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="quantity" className="mb-2 block text-sm font-medium text-foreground">
                    {copy.contact.quantity}
                  </label>
                  <input
                    id="quantity"
                    type="text"
                    value={form.quantity}
                    onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))}
                    className={fieldClasses}
                    placeholder={copy.contact.quantityPlaceholder}
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="location" className="mb-2 block text-sm font-medium text-foreground">
                    {copy.contact.locationLabel}
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={form.location}
                    onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                    className={fieldClasses}
                    placeholder={copy.contact.locationPlaceholder}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                    {copy.contact.fullName}
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    className={fieldClasses}
                    placeholder={copy.contact.namePlaceholder}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-foreground">
                    {copy.contact.phoneLabel}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                    className={fieldClasses}
                    placeholder={copy.contact.phonePlaceholder}
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                    {copy.contact.emailLabel}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    className={fieldClasses}
                    placeholder={copy.contact.emailPlaceholder}
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">
                    {copy.contact.messageLabel}
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={form.message}
                    onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                    className={`${fieldClasses} min-h-[150px] resize-none`}
                    placeholder={copy.contact.messagePlaceholder}
                  />
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className="inline-flex h-12 items-center justify-center rounded-full border border-input bg-background px-6 text-sm font-medium text-foreground disabled:opacity-40"
              >
                {copy.contact.back}
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-secondary px-6 text-sm font-semibold text-secondary-foreground"
                >
                  {step === 1 ? copy.contact.nextOrder : copy.contact.nextContact}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-secondary px-6 text-sm font-semibold text-secondary-foreground"
                >
                  <Send size={16} className="text-accent" />
                  {isSubmitting ? copy.contact.submitting : copy.contact.submit}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
