import riceImg from "@/assets/product-rice.jpg";
import maizeImg from "@/assets/product-maize.jpg";
import beansImg from "@/assets/product-beans.jpg";
import packagedImg from "@/assets/product-packaged.jpg";
import { createLocalizedText, type Language, type LocalizedText } from "@/lib/i18n";

export type ProductCategory = "retail" | "wholesale" | "packaged" | "bulk";
export type ProductImageKey = "rice" | "maize" | "beans" | "packaged";

export type NutritionFact = {
  label: LocalizedText;
  value: LocalizedText;
};

export type ApiProduct = {
  id: string;
  imageKey: ProductImageKey;
  name: LocalizedText;
  desc: LocalizedText;
  tag: LocalizedText;
  category: ProductCategory[];
  sizes: string[];
  uses: LocalizedText[];
  highlights: LocalizedText[];
  nutrition: NutritionFact[];
};

export type Product = ApiProduct & {
  img: string;
};

export type TrustMetric = {
  value: number;
  suffix: string;
  label: LocalizedText;
  detail: LocalizedText;
};

export type ProcessStep = {
  title: LocalizedText;
  desc: LocalizedText;
};

export type DeliveryZone = {
  zone: LocalizedText;
  eta: LocalizedText;
  note: LocalizedText;
};

export type Testimonial = {
  quote: LocalizedText;
  name: LocalizedText;
  role: LocalizedText;
};

export type Faq = {
  question: LocalizedText;
  answer: LocalizedText;
};

export type SearchKind = "section" | "product" | "faq" | "delivery" | "process" | "metric";

export type SiteSearchResult = {
  id: string;
  kind: SearchKind;
  anchor: string;
  sectionId: string;
  sectionLabel: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  itemKey?: string | null;
  matchedTerms?: string[];
  matchesAllTerms?: boolean;
};

export type SiteSearchResponse = {
  query: string;
  tokens: string[];
  results: SiteSearchResult[];
};

export type HeroSlide = {
  title: string;
  subtitle: string;
  badge: string;
  caption: string;
  cta_primary: string;
  cta_secondary: string;
  image_key: string;
};

export type SiteContentPayload = {
  products: ApiProduct[];
  trustMetrics: TrustMetric[];
  processSteps: ProcessStep[];
  deliveryZones: DeliveryZone[];
  testimonials: Testimonial[];
  buyerLogos: string[];
  faqs: Faq[];
  promoHighlights: LocalizedText[];
  heroSlides: HeroSlide[];
};

export type SiteContent = Omit<SiteContentPayload, "products"> & {
  products: Product[];
};

export type InquiryPayload = {
  buyerType: string;
  product: string;
  packaging: string;
  quantity: string;
  location: string;
  name: string;
  email: string;
  phone: string;
  language: Language;
  message: string;
};

export const productImageMap: Record<ProductImageKey, string> = {
  rice: riceImg,
  maize: maizeImg,
  beans: beansImg,
  packaged: packagedImg,
};

export const products: Product[] = [
  {
    id: "rice",
    imageKey: "rice",
    img: productImageMap.rice,
    name: createLocalizedText("Premium Rice", "Mchele Bora"),
    desc: createLocalizedText(
      "Grade A polished and unpolished rice varieties sourced from Tanzania's finest paddy fields.",
      "Aina za mchele wa daraja la A uliokobolewa na usiokobolewa kutoka mashamba bora ya mpunga Tanzania.",
    ),
    tag: createLocalizedText("Best Seller", "Inayouzwa Sana"),
    category: ["retail", "wholesale", "bulk"],
    sizes: ["1kg", "5kg", "25kg", "50kg"],
    uses: [
      createLocalizedText("Home cooking", "Mapishi ya nyumbani"),
      createLocalizedText("Hospitality supply", "Ugavi wa hoteli"),
      createLocalizedText("Bulk resale", "Biashara ya jumla"),
    ],
    highlights: [
      createLocalizedText("Low moisture handling", "Udhibiti mzuri wa unyevu"),
      createLocalizedText("Clean sorted grains", "Nafaka safi zilizochambuliwa"),
      createLocalizedText("Reliable supply consistency", "Upatikanaji wa uhakika"),
    ],
    nutrition: [
      { label: createLocalizedText("Energy", "Nishati"), value: createLocalizedText("365 kcal", "365 kcal") },
      { label: createLocalizedText("Protein", "Protini"), value: createLocalizedText("7g", "7g") },
      { label: createLocalizedText("Carbs", "Wanga"), value: createLocalizedText("80g", "80g") },
    ],
  },
  {
    id: "maize",
    imageKey: "maize",
    img: productImageMap.maize,
    name: createLocalizedText("Quality Maize", "Mahindi Bora"),
    desc: createLocalizedText(
      "Clean, dried and sorted maize kernels ideal for ugali, flour milling, and animal feed.",
      "Mahindi safi, yaliyokaushwa na kuchambuliwa yanayofaa kwa ugali, kusaga unga, na chakula cha mifugo.",
    ),
    tag: createLocalizedText("Popular", "Maarufu"),
    category: ["retail", "wholesale", "bulk"],
    sizes: ["5kg", "25kg", "50kg"],
    uses: [
      createLocalizedText("Ugali", "Ugali"),
      createLocalizedText("Flour milling", "Usagaji wa unga"),
      createLocalizedText("Feed programs", "Mipango ya chakula cha mifugo"),
    ],
    highlights: [
      createLocalizedText("Well-dried stock", "Yamekaushwa vizuri"),
      createLocalizedText("Batch inspected", "Yamekaguliwa kwa mafungu"),
      createLocalizedText("Flexible order volumes", "Kiasi cha oda ni rahisi kubadilika"),
    ],
    nutrition: [
      { label: createLocalizedText("Energy", "Nishati"), value: createLocalizedText("365 kcal", "365 kcal") },
      { label: createLocalizedText("Fiber", "Nyuzi"), value: createLocalizedText("7g", "7g") },
      { label: createLocalizedText("Protein", "Protini"), value: createLocalizedText("9g", "9g") },
    ],
  },
  {
    id: "beans",
    imageKey: "beans",
    img: productImageMap.beans,
    name: createLocalizedText("Mixed Beans", "Maharage Mchanganyiko"),
    desc: createLocalizedText(
      "Nutritious bean varieties - kidney, soy, black, and mixed - rich in protein and fiber.",
      "Aina mbalimbali za maharage kama red kidney, soya, black, na mchanganyiko zenye protini na nyuzi nyingi.",
    ),
    tag: createLocalizedText("Nutritious", "Yenye Lishe"),
    category: ["retail", "wholesale"],
    sizes: ["1kg", "5kg", "25kg"],
    uses: [
      createLocalizedText("Home meals", "Milo ya nyumbani"),
      createLocalizedText("School supply", "Ugavi wa shule"),
      createLocalizedText("Catering kitchens", "Jikoni za upishi"),
    ],
    highlights: [
      createLocalizedText("Protein-rich selection", "Chaguo lenye protini nyingi"),
      createLocalizedText("Color-sorted varieties", "Aina zimepangwa kwa rangi"),
      createLocalizedText("Retail-ready packaging", "Ufungashaji tayari kwa rejareja"),
    ],
    nutrition: [
      { label: createLocalizedText("Protein", "Protini"), value: createLocalizedText("21g", "21g") },
      { label: createLocalizedText("Fiber", "Nyuzi"), value: createLocalizedText("16g", "16g") },
      { label: createLocalizedText("Iron", "Madini ya Chuma"), value: createLocalizedText("5mg", "5mg") },
    ],
  },
  {
    id: "packaged",
    imageKey: "packaged",
    img: productImageMap.packaged,
    name: createLocalizedText("Packaged Products", "Bidhaa Zilizofungashwa"),
    desc: createLocalizedText(
      "Branded MILOHA packaged grains ready for retail shelves, available in 1kg, 5kg, and 25kg bags.",
      "Nafaka za MILOHA zilizofungashwa tayari kwa rafu za maduka, zinapatikana katika mifuko ya 1kg, 5kg, na 25kg.",
    ),
    tag: createLocalizedText("New", "Mpya"),
    category: ["packaged", "retail", "wholesale"],
    sizes: ["1kg", "5kg", "25kg"],
    uses: [
      createLocalizedText("Retail shelves", "Rafu za maduka"),
      createLocalizedText("Mini-markets", "Mini-market"),
      createLocalizedText("Promotional bundles", "Vifurushi vya promosheni"),
    ],
    highlights: [
      createLocalizedText("Shelf-ready branding", "Muonekano tayari kwa rafu"),
      createLocalizedText("Tamper-conscious packaging", "Ufungashaji unaozingatia usalama"),
      createLocalizedText("Consistent label presentation", "Muonekano thabiti wa lebo"),
    ],
    nutrition: [
      { label: createLocalizedText("Formats", "Aina"), value: createLocalizedText("3 sizes", "Saizi 3") },
      { label: createLocalizedText("Shelf Ready", "Tayari kwa Rafu"), value: createLocalizedText("Yes", "Ndiyo") },
      { label: createLocalizedText("Branding", "Chapa"), value: createLocalizedText("Custom", "Maalum") },
    ],
  },
];

export const trustMetrics: TrustMetric[] = [
  {
    value: 500,
    suffix: "+",
    label: createLocalizedText("Retail & wholesale orders supported", "Oda za rejareja na jumla zilizohudumiwa"),
    detail: createLocalizedText(
      "Flexible order handling for homes, retailers, and institutions.",
      "Huduma rahisi kwa nyumba, wauzaji wa rejareja, na taasisi.",
    ),
  },
  {
    value: 98,
    suffix: "%",
    label: createLocalizedText("Quality check pass confidence", "Uhakika wa kupita ukaguzi wa ubora"),
    detail: createLocalizedText(
      "Careful sorting, drying, and inspection before dispatch.",
      "Upangaji, ukaushaji, na ukaguzi wa makini kabla ya kusafirishwa.",
    ),
  },
  {
    value: 12,
    suffix: "",
    label: createLocalizedText("Packaging and bulk supply formats", "Aina za vifungashio na usambazaji wa jumla"),
    detail: createLocalizedText(
      "Structured for shelf-ready, household, and large-volume buyers.",
      "Imeandaliwa kwa rafu za maduka, matumizi ya nyumbani, na wanunuzi wa kiasi kikubwa.",
    ),
  },
  {
    value: 8,
    suffix: "+",
    label: createLocalizedText("Coverage zones around Dar es Salaam", "Maeneo ya huduma ndani na karibu na Dar es Salaam"),
    detail: createLocalizedText(
      "Fast response for city deliveries and arranged regional dispatch.",
      "Majibu ya haraka kwa usafirishaji wa jiji na mipango ya mikoani.",
    ),
  },
];

export const processSteps: ProcessStep[] = [
  {
    title: createLocalizedText("Farm Sourcing", "Upatikanaji Kutoka Mashambani"),
    desc: createLocalizedText(
      "We work with trusted farming networks and source grains aligned with our purity and consistency standards.",
      "Tunafanya kazi na mitandao ya wakulima wanaoaminika kupata nafaka zinazokidhi viwango vyetu vya usafi na uthabiti.",
    ),
  },
  {
    title: createLocalizedText("Cleaning & Sorting", "Usafishaji na Upangaji"),
    desc: createLocalizedText(
      "Batches are cleaned, graded, and sorted to remove impurities and improve uniformity.",
      "Bidhaa husafishwa, hupangwa kwa viwango, na kuchambuliwa ili kuondoa uchafu na kuongeza ulinganifu.",
    ),
  },
  {
    title: createLocalizedText("Quality Review", "Ukaguzi wa Ubora"),
    desc: createLocalizedText(
      "Moisture, freshness, and visual quality are checked before stock moves into packaging or bulk handling.",
      "Unyevu, ubichi, na mwonekano hukaguliwa kabla ya bidhaa kuingia kwenye ufungashaji au usimamizi wa jumla.",
    ),
  },
  {
    title: createLocalizedText("Packaging & Storage", "Ufungashaji na Uhifadhi"),
    desc: createLocalizedText(
      "Products are packed for household, retail, or wholesale channels and stored for freshness.",
      "Bidhaa hufungwa kwa matumizi ya nyumbani, rejareja, au jumla na kuhifadhiwa kwa ubora na ubichi.",
    ),
  },
  {
    title: createLocalizedText("Delivery & Fulfillment", "Usafirishaji na Utekelezaji"),
    desc: createLocalizedText(
      "Orders are coordinated for pickup, city delivery, or arranged up-country distribution.",
      "Oda huratibiwa kwa kuchukuliwa dukani, kupelekwa ndani ya jiji, au kusafirishwa mikoani.",
    ),
  },
];

export const deliveryZones: DeliveryZone[] = [
  {
    zone: createLocalizedText("Tegeta to City Center", "Tegeta hadi Katikati ya Jiji"),
    eta: createLocalizedText("Same day", "Siku hiyo hiyo"),
    note: createLocalizedText(
      "Fast turnaround for stocked items and repeat buyers.",
      "Huduma ya haraka kwa bidhaa zilizopo stoo na wanunuzi wa mara kwa mara.",
    ),
  },
  {
    zone: createLocalizedText("Kinondoni & Ubungo", "Kinondoni na Ubungo"),
    eta: createLocalizedText("Within 24 hours", "Ndani ya saa 24"),
    note: createLocalizedText(
      "Reliable coverage for homes, restaurants, and mini-markets.",
      "Huduma thabiti kwa nyumba, migahawa, na maduka madogo.",
    ),
  },
  {
    zone: createLocalizedText("Temeke & Kigamboni", "Temeke na Kigamboni"),
    eta: createLocalizedText("24-48 hours", "Saa 24-48"),
    note: createLocalizedText(
      "Scheduled dispatch with quantity-based planning.",
      "Usafirishaji uliopangwa kulingana na kiasi cha oda.",
    ),
  },
  {
    zone: createLocalizedText("Up-country supply", "Usambazaji wa Mikoani"),
    eta: createLocalizedText("Planned dispatch", "Usafirishaji uliopangwa"),
    note: createLocalizedText(
      "Bulk shipment support for institutions and wholesale partners.",
      "Msaada wa shehena kubwa kwa taasisi na washirika wa jumla.",
    ),
  },
];

export const testimonials: Testimonial[] = [
  {
    quote: createLocalizedText(
      "The packaging quality and grain consistency have made MILOHA easier for us to stock and recommend in-store.",
      "Ubora wa ufungashaji na uthabiti wa nafaka umeifanya MILOHA kuwa rahisi zaidi kwetu kuiweka dukani na kuipendekeza.",
    ),
    name: createLocalizedText("Retail Partner", "Mshirika wa Rejareja"),
    role: createLocalizedText("Mini-market buyer", "Mnunuzi wa mini-market"),
  },
  {
    quote: createLocalizedText(
      "Their delivery coordination is smooth, and the maize quality has stayed dependable across repeat orders.",
      "Uratibu wao wa usafirishaji ni mzuri, na ubora wa mahindi umeendelea kuwa wa kuaminika katika oda za kurudia.",
    ),
    name: createLocalizedText("Hospitality Client", "Mteja wa Huduma za Ukarimu"),
    role: createLocalizedText("Kitchen procurement lead", "Msimamizi wa manunuzi ya jikoni"),
  },
  {
    quote: createLocalizedText(
      "For wholesale supply, what stands out is how clearly they communicate sizes, availability, and dispatch timing.",
      "Kwa ugavi wa jumla, kinachoonekana zaidi ni jinsi wanavyowasilisha kwa uwazi saizi, upatikanaji, na muda wa usafirishaji.",
    ),
    name: createLocalizedText("Distributor", "Msambazaji"),
    role: createLocalizedText("Bulk supply customer", "Mteja wa ugavi wa kiasi kikubwa"),
  },
];

export const buyerLogos = ["Azania Retail", "Dar Fresh Mart", "Safari Kitchens", "EastBay Traders", "Karibu Stores"];

export const faqs: Faq[] = [
  {
    question: createLocalizedText("Do you support both small and bulk orders?", "Je, mnahudumia oda ndogo na kubwa?"),
    answer: createLocalizedText(
      "Yes. MILOHA serves household buyers, retail shelves, restaurants, institutions, and bulk wholesale customers with different packaging sizes.",
      "Ndiyo. MILOHA huhudumia wanunuzi wa nyumbani, rafu za rejareja, migahawa, taasisi, na wateja wa jumla kwa saizi tofauti za vifungashio.",
    ),
  },
  {
    question: createLocalizedText("Can I request delivery outside Dar es Salaam?", "Je, naweza kuomba usafirishaji nje ya Dar es Salaam?"),
    answer: createLocalizedText(
      "Yes. Regional and up-country delivery can be arranged based on quantity, destination, and dispatch planning.",
      "Ndiyo. Usafirishaji wa mikoani unaweza kupangwa kulingana na kiasi, eneo la kufikisha, na mpango wa usafirishaji.",
    ),
  },
  {
    question: createLocalizedText("Are packaged products available for retail shelves?", "Je, bidhaa zilizofungashwa zinapatikana kwa rafu za rejareja?"),
    answer: createLocalizedText(
      "Yes. Our branded packaged formats are designed for shelves and available in multiple sizes depending on the product line.",
      "Ndiyo. Bidhaa zetu zilizofungashwa kwa chapa zimeundwa kwa rafu za maduka na zinapatikana kwa saizi tofauti kulingana na mstari wa bidhaa.",
    ),
  },
  {
    question: createLocalizedText("How do I place a custom quote request?", "Ninawezaje kuomba bei maalum?"),
    answer: createLocalizedText(
      "Use the inquiry form to choose buyer type, product, packaging, and estimated quantity, or contact us directly through WhatsApp for faster coordination.",
      "Tumia fomu ya maombi kuchagua aina ya mnunuzi, bidhaa, kifungashio, na kiasi kinachokadiriwa, au wasiliana nasi moja kwa moja kupitia WhatsApp kwa uratibu wa haraka.",
    ),
  },
];

export const promoHighlights = [
  createLocalizedText(
    "New-season rice and maize sourcing now available for planned wholesale orders.",
    "Mchele na mahindi ya msimu mpya sasa yanapatikana kwa oda za jumla zilizopangwa.",
  ),
  createLocalizedText(
    "Retail-ready packaged grain bundles prepared for mini-markets and neighborhood shops.",
    "Vifurushi vya nafaka vilivyofungashwa tayari kwa rejareja vimeandaliwa kwa maduka madogo na ya jirani.",
  ),
  createLocalizedText(
    "Priority response for repeat customers placing weekly or monthly replenishment requests.",
    "Majibu ya kipaumbele kwa wateja wa kurudia wanaoweka oda za kila wiki au kila mwezi.",
  ),
];

export const fallbackSiteContent: SiteContent = {
  products,
  trustMetrics,
  processSteps,
  deliveryZones,
  testimonials,
  buyerLogos,
  faqs,
  promoHighlights,
  heroSlides: [
    {
      title: "Fresh Grains, Fair Prices",
      subtitle: "Reliable grain supply for homes, retailers, and institutions across Dar es Salaam and beyond.",
      badge: "Quality Assured",
      caption: "Sourced from Tanzania's finest paddy fields",
      cta_primary: "Explore Products",
      cta_secondary: "Get a Quote",
      image_key: "hero",
    },
  ],
};

export const hydrateSiteContent = (payload: SiteContentPayload): SiteContent => ({
  ...payload,
  products: payload.products.map((product) => ({
    ...product,
    img: productImageMap[product.imageKey] ?? productImageMap.packaged,
  })),
});
