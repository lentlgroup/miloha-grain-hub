export type Language = "en" | "sw";

export type LocalizedText = {
  en: string;
  sw: string;
};

export const createLocalizedText = (en: string, sw: string): LocalizedText => ({ en, sw });

export const getLocalizedText = (value: LocalizedText, language: Language) => value[language] ?? value.en;

export const getLocalizedTextList = (values: LocalizedText[], language: Language) =>
  values.map((value) => getLocalizedText(value, language));

const normalizeSearchValue = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase()
    .trim();

export const matchesLanguageSearch = (query: string, ...values: Array<string | LocalizedText | null | undefined>) => {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return true;
  }

  return values.some((value) => {
    if (!value) {
      return false;
    }

    const haystack =
      typeof value === "string"
        ? value
        : `${value.en} ${value.sw}`;

    return normalizeSearchValue(haystack).includes(normalizedQuery);
  });
};

export const languageOptions: Array<{ value: Language; label: LocalizedText }> = [
  { value: "en", label: createLocalizedText("English", "Kiingereza") },
  { value: "sw", label: createLocalizedText("Kiswahili", "Kiswahili") },
];

export const categoryLabels = {
  all: createLocalizedText("All Products", "Bidhaa Zote"),
  retail: createLocalizedText("Retail", "Rejareja"),
  wholesale: createLocalizedText("Wholesale", "Jumla"),
  packaged: createLocalizedText("Packaged", "Zilizofungashwa"),
  bulk: createLocalizedText("Bulk", "Kiasi Kikubwa"),
} as const;

export const uiText = {
  en: {
    brand: {
      short: "MILOHA",
      tagline: "Pure Grains",
      hub: "Dar es Salaam Hub",
    },
    nav: {
      home: "Home",
      about: "About",
      products: "Products",
      delivery: "Delivery",
      services: "Services",
      contact: "Contact",
      hubSummary: "Clean grains for homes, shops, and bulk buyers",
      quote: "Get a Quote",
      language: "Language",
      toggleMenu: "Toggle menu",
      mobileSupportTitle: "Friendly support",
      mobileSupportBody: "Tell us the product, pack size, and delivery area. We will guide the best next step.",
    },
    search: {
      label: "Site search",
      placeholder: "Search products, delivery, FAQs, or sections",
      empty: "No matching results yet.",
      helper: "Search works in English and Kiswahili.",
      searching: "Searching...",
      foundIn: "Found in",
      allTerms: "All words matched",
      products: "Product",
      faq: "FAQ",
      section: "Section",
      delivery: "Delivery",
      process: "Process",
      metric: "Metric",
      open: "Open result",
    },
    theme: {
      label: "Theme",
      switch: "Toggle theme",
      light: "Light",
      dark: "Dark",
    },
    hero: {
      kicker: "MILOHA Pure Grains",
      titleStart: "Clean grains for homes, shops,",
      titleAccent: " kitchens, and bulk buyers",
      description:
        "Browse rice, maize, beans, and packaged products in a layout that makes it easy to compare sizes, understand delivery options, and request a quote without confusion.",
      explore: "Explore Products",
      customQuote: "Get a Custom Quote",
      statsLabel: "At a glance",
      scrollHint: "Scroll to compare products, delivery options, and the quote form",
      searchResults: "Search results",
      imageBadge: "Ready for everyday and trade supply",
      imageKicker: "Made to be easy to buy",
      imageTitle: "Clear product views, practical sizes, and straightforward next steps.",
      orderStepsTitle: "How ordering works",
      highlightsTitle: "What buyers usually ask first",
    },
    about: {
      kicker: "About MILOHA",
      title: "Straightforward supply with a cleaner, more modern buying experience",
      description:
        "MILOHA Pure Grains is a division of LIMBU ENTERPRISES LIMITED (LENTL GROUP), built for buyers who want better product clarity, dependable handling, and faster support.",
    },
    trust: {
      kicker: "Quick Snapshot",
      title: "The key buying signals, kept simple",
      description: "Useful numbers help visitors understand quality, formats, and delivery reach without reading too much first.",
    },
    products: {
      kicker: "Products",
      title: "Pick a product, check the sizes, and move to a quote",
      description: "The catalog is organized for fast scanning, whether someone needs a household pack or a larger recurring supply order.",
      selectedView: "Selected View",
      optionsAvailable: "options available",
      viewDetails: "View sizes and details",
      availableSizes: "Available Sizes",
      bestFor: "Best For",
      whyChoose: "Why Buyers Choose It",
      nutrition: "Quick Nutrition Snapshot",
      request: "Request This Product",
      keepBrowsing: "Keep Browsing",
    },
    process: {
      kicker: "Quality Journey",
      title: "From sourcing to dispatch, every step stays visible",
      description: "Buyers should not have to guess how products are handled. This flow shows the stages that protect consistency before delivery.",
      step: "Step",
    },
    delivery: {
      kicker: "Coverage & Delivery",
      title: "Delivery options that are easy to understand",
      description: "Buyers can quickly see what can be picked up, what can be delivered in Dar es Salaam, and what needs planned regional dispatch.",
      pickupTitle: "Pickup from Tegeta Azania",
      pickupBody: "Our base supports order collection, dispatch preparation, and city delivery coordination.",
      windowsTitle: "Delivery windows with context",
      windowsBody: "Timing depends on order size, route, and packaging readiness, so the expectation stays practical.",
      deliveryView: "Delivery View",
      planningKicker: "Before We Quote",
      planningTitle: "What helps us plan faster",
      askDelivery: "Ask About Delivery",
    },
    services: {
      kicker: "Services",
      title: "Support that matches how buyers actually order",
      description: "First-time household buyers and repeat business clients should both be able to understand the offer quickly and act with confidence.",
    },
    buyers: {
      kicker: "Buyer Fit",
      title: "Built for the buyers most likely to compare, ask, and reorder",
      description: "A simple audience view and a few testimonials help visitors understand who the brand serves without adding noise.",
      groupsTitle: "Common buyer groups",
    },
    faq: {
      kicker: "FAQ",
      title: "Answers to the questions buyers ask most",
      description: "These answers cover quantity, delivery, packaged formats, and quote requests in plain language.",
      tailoredTitle: "Need a specific answer?",
      tailoredBody: "Use the quote form to share the product, pack size, and location so the team can reply with a more exact recommendation.",
    },
    contact: {
      kicker: "Contact & Quotes",
      title: "Request a quote in three simple steps",
      description: "The form keeps the process short: tell us who you are, what you need, and where it should go.",
      beforeSubmit: "Before You Submit",
      beforeSubmitTitle: "Share the basics and we will guide the next step.",
      location: "Our Location",
      phone: "Phone",
      email: "Email",
      steps: {
        who: "Who You Are",
        what: "What You Need",
        reach: "How To Reach You",
      },
      currentRequest: "Current Request",
      currentRequestEmpty: "Start by choosing the buyer type that best matches this request.",
      buyerType: "Buyer Type",
      whyStart: "Why we start here",
      whyStartBody:
        "Different buyer types usually need different quantities, packaging, and delivery planning. Starting here keeps the quote more relevant from the beginning.",
      product: "Product",
      packaging: "Packaging",
      quantity: "Estimated Quantity",
      quantityPlaceholder: "e.g. 100 bags / 250kg",
      locationLabel: "Delivery Area",
      locationPlaceholder: "Neighborhood, city, or region",
      fullName: "Full Name",
      namePlaceholder: "Your name",
      phoneLabel: "Phone Number",
      phonePlaceholder: "+255...",
      emailLabel: "Email Address",
      emailPlaceholder: "you@example.com",
      messageLabel: "Extra Request Details",
      messagePlaceholder: "Share timing, budget range, special packaging, or repeat-order needs.",
      back: "Back",
      nextOrder: "Next: Order Details",
      nextContact: "Next: Contact Details",
      submit: "Send Quote Request",
      submitting: "Submitting...",
      submittedTitle: "Inquiry Submitted",
      submittedBody: "Your quote request has been saved in the Laravel backend for follow-up.",
      failedTitle: "Submission Failed",
      failedBody: "Start the Laravel backend and confirm the database is migrated.",
    },
    footer: {
      nextStep: "Fastest next step",
      title: "Request a quote with the product, pack size, and delivery area",
      body: "The guided form helps us reply with a practical supply and delivery option faster.",
      cta: "Get a Quote",
      navigate: "Navigate",
      range: "Core Range",
      location: "Location",
      contact: "Contact",
      summary:
        "Clean grains, clearer product choices, and practical support for homes, shops, kitchens, and bulk buyers. A brand of LIMBU ENTERPRISES LIMITED (LENTL GROUP).",
      rights: "All rights reserved.",
    },
    whatsapp: {
      label: "Chat on WhatsApp",
      cta: "Ask on WhatsApp",
      text: "Hello MILOHA, I would like to request a grain order quote.",
    },
    notFound: {
      title: "Oops! Page not found",
      cta: "Return to Home",
    },
  },
  sw: {
    brand: {
      short: "MILOHA",
      tagline: "Nafaka Safi",
      hub: "Kituo cha Dar es Salaam",
    },
    nav: {
      home: "Mwanzo",
      about: "Kuhusu",
      products: "Bidhaa",
      delivery: "Usafirishaji",
      services: "Huduma",
      contact: "Wasiliana",
      hubSummary: "Nafaka safi kwa nyumba, maduka, na wanunuzi wa jumla",
      quote: "Pata Bei",
      language: "Lugha",
      toggleMenu: "Badili menyu",
      mobileSupportTitle: "Huduma rafiki",
      mobileSupportBody: "Tuambie bidhaa, saizi ya kifungashio, na eneo la kupeleka. Tutakuongoza hatua inayofuata.",
    },
    search: {
      label: "Tafuta kwenye tovuti",
      placeholder: "Tafuta bidhaa, usafirishaji, maswali, au sehemu",
      empty: "Hakuna matokeo yanayofanana bado.",
      helper: "Utafutaji unafanya kazi kwa English na Kiswahili.",
      searching: "Inatafuta...",
      foundIn: "Imepatikana kwenye",
      allTerms: "Maneno yote yamepatikana",
      products: "Bidhaa",
      faq: "Swali",
      section: "Sehemu",
      delivery: "Usafirishaji",
      process: "Mchakato",
      metric: "Kipimo",
      open: "Fungua matokeo",
    },
    theme: {
      label: "Mwonekano",
      switch: "Badili mwonekano",
      light: "Mwanga",
      dark: "Giza",
    },
    hero: {
      kicker: "MILOHA Pure Grains",
      titleStart: "Nafaka safi kwa nyumba, maduka,",
      titleAccent: " jikoni, na wanunuzi wa jumla",
      description:
        "Tazama mchele, mahindi, maharage, na bidhaa zilizofungashwa katika mpangilio unaorahisisha kulinganisha saizi, kuelewa usafirishaji, na kuomba bei bila mkanganyiko.",
      explore: "Chunguza Bidhaa",
      customQuote: "Pata Bei Maalum",
      statsLabel: "Kwa ufupi",
      scrollHint: "Shuka chini kulinganisha bidhaa, usafirishaji, na fomu ya kuomba bei",
      searchResults: "Matokeo ya utafutaji",
      imageBadge: "Tayari kwa mahitaji ya kila siku na biashara",
      imageKicker: "Imeundwa iwe rahisi kununua",
      imageTitle: "Muonekano wazi wa bidhaa, saizi zinazofaa, na hatua zinazofuata zilizo wazi.",
      orderStepsTitle: "Jinsi ya kuagiza",
      highlightsTitle: "Maswali ambayo wanunuzi huuliza kwanza",
    },
    about: {
      kicker: "Kuhusu MILOHA",
      title: "Ugavi ulio wazi wenye uzoefu wa ununuzi safi na wa kisasa zaidi",
      description:
        "MILOHA Pure Grains ni kitengo cha LIMBU ENTERPRISES LIMITED (LENTL GROUP), kilichoundwa kwa wanunuzi wanaotaka maelezo bora ya bidhaa, ushughulikiaji wa kuaminika, na msaada wa haraka.",
    },
    trust: {
      kicker: "Muhtasari wa Haraka",
      title: "Ishara muhimu za ununuzi, zimewekwa kwa urahisi",
      description: "Namba muhimu huwasaidia wageni kuelewa ubora, aina za vifungashio, na maeneo ya huduma bila kusoma sana mwanzo.",
    },
    products: {
      kicker: "Bidhaa",
      title: "Chagua bidhaa, angalia saizi, kisha omba bei",
      description: "Katalogi imepangwa ili iwe rahisi kuchunguza haraka, iwe unahitaji kifurushi cha nyumbani au oda kubwa ya kurudiwa.",
      selectedView: "Mwonekano Uliochaguliwa",
      optionsAvailable: "chaguo zinapatikana",
      viewDetails: "Angalia saizi na maelezo",
      availableSizes: "Saizi Zinazopatikana",
      bestFor: "Inafaa Kwa",
      whyChoose: "Kwa Nini Wanunuzi Huchagua",
      nutrition: "Muhtasari wa Haraka wa Lishe",
      request: "Omba Bidhaa Hii",
      keepBrowsing: "Endelea Kuchunguza",
    },
    process: {
      kicker: "Safari ya Ubora",
      title: "Kutoka upatikanaji hadi usafirishaji, kila hatua inaonekana",
      description: "Wanunuzi hawapaswi kubashiri jinsi bidhaa zinavyoshughulikiwa. Mlolongo huu unaonyesha hatua zinazolinda uthabiti kabla ya kufikishwa.",
      step: "Hatua",
    },
    delivery: {
      kicker: "Maeneo na Usafirishaji",
      title: "Chaguo za usafirishaji zilizo rahisi kueleweka",
      description: "Wanunuzi wanaweza kuona kwa haraka kinachoweza kuchukuliwa, kinachoweza kupelekwa Dar es Salaam, na kinachohitaji mpango wa mikoani.",
      pickupTitle: "Chukua Tegeta Azania",
      pickupBody: "Kituo chetu kinaunga mkono kuchukua oda, maandalizi ya kusafirisha, na uratibu wa usafirishaji wa jiji.",
      windowsTitle: "Madirisha ya usafirishaji yenye maelezo",
      windowsBody: "Muda hutegemea kiasi cha oda, njia, na utayari wa ufungashaji ili matarajio yabaki halisi.",
      deliveryView: "Mwonekano wa Usafirishaji",
      planningKicker: "Kabla ya Kutoa Bei",
      planningTitle: "Kinachotusaidia kupanga kwa haraka",
      askDelivery: "Ulizia Usafirishaji",
    },
    services: {
      kicker: "Huduma",
      title: "Huduma inayoendana na jinsi wanunuzi wanavyoagiza",
      description: "Wanunuzi wa kwanza wa nyumbani na wateja wa biashara wa kurudia wote wanapaswa kuelewa ofa kwa haraka na kuchukua hatua kwa uhakika.",
    },
    buyers: {
      kicker: "Aina za Wanunuzi",
      title: "Imejengwa kwa wanunuzi wanaolinganisha, kuuliza, na kurudia oda",
      description: "Muhtasari rahisi wa hadhira na ushuhuda wachache humsaidia mgeni kuelewa chapa hii inamhudumia nani bila kelele nyingi.",
      groupsTitle: "Makundi ya kawaida ya wanunuzi",
    },
    faq: {
      kicker: "Maswali",
      title: "Majibu kwa maswali ambayo wanunuzi huuliza zaidi",
      description: "Majibu haya yanaeleza kiasi, usafirishaji, bidhaa zilizofungashwa, na maombi ya bei kwa lugha rahisi.",
      tailoredTitle: "Unahitaji jibu maalum?",
      tailoredBody: "Tumia fomu ya kuomba bei kueleza bidhaa, saizi ya kifungashio, na eneo ili timu iweze kujibu kwa usahihi zaidi.",
    },
    contact: {
      kicker: "Mawasiliano na Bei",
      title: "Omba bei kwa hatua tatu rahisi",
      description: "Fomu hii inaweka mchakato mfupi: tuambie wewe ni nani, unahitaji nini, na oda inapaswa kwenda wapi.",
      beforeSubmit: "Kabla ya Kutuma",
      beforeSubmitTitle: "Shiriki taarifa za msingi nasi tukuongoze hatua inayofuata.",
      location: "Mahali Petu",
      phone: "Simu",
      email: "Barua pepe",
      steps: {
        who: "Wewe ni Nani",
        what: "Unahitaji Nini",
        reach: "Njia ya Kuwasiliana",
      },
      currentRequest: "Ombi la Sasa",
      currentRequestEmpty: "Anza kwa kuchagua aina ya mnunuzi inayofanana zaidi na ombi hili.",
      buyerType: "Aina ya Mnunuzi",
      whyStart: "Kwa nini tunaanza hapa",
      whyStartBody:
        "Aina tofauti za wanunuzi huhitaji kiasi, vifungashio, na mpango wa usafirishaji tofauti. Kuanzia hapa hufanya bei iwe husika zaidi tangu mwanzo.",
      product: "Bidhaa",
      packaging: "Kifungashio",
      quantity: "Kiasi Kinachokadiriwa",
      quantityPlaceholder: "mf. mifuko 100 / 250kg",
      locationLabel: "Eneo la Kupeleka",
      locationPlaceholder: "Mtaa, jiji, au mkoa",
      fullName: "Jina Kamili",
      namePlaceholder: "Jina lako",
      phoneLabel: "Namba ya Simu",
      phonePlaceholder: "+255...",
      emailLabel: "Anwani ya Barua Pepe",
      emailPlaceholder: "wewe@example.com",
      messageLabel: "Maelezo ya Ziada ya Ombi",
      messagePlaceholder: "Shiriki muda, bajeti, ufungashaji maalum, au mahitaji ya oda za kurudia.",
      back: "Rudi",
      nextOrder: "Ifuatayo: Maelezo ya Oda",
      nextContact: "Ifuatayo: Maelezo ya Mawasiliano",
      submit: "Tuma Ombi la Bei",
      submitting: "Inatuma...",
      submittedTitle: "Ombi Limetumwa",
      submittedBody: "Ombi lako la bei limehifadhiwa kwenye Laravel backend kwa ufuatiliaji.",
      failedTitle: "Utumaji Umeshindikana",
      failedBody: "Washa Laravel backend na uhakikishe database imekamilisha migration.",
    },
    footer: {
      nextStep: "Hatua ya haraka zaidi",
      title: "Omba bei kwa bidhaa, saizi ya kifungashio, na eneo la kupeleka",
      body: "Fomu hii iliyopangwa hutusaidia kujibu haraka kwa chaguo la ugavi na usafirishaji linalofaa.",
      cta: "Pata Bei",
      navigate: "Nenda",
      range: "Bidhaa Kuu",
      location: "Mahali",
      contact: "Mawasiliano",
      summary:
        "Nafaka safi, chaguo wazi zaidi za bidhaa, na msaada wa vitendo kwa nyumba, maduka, jikoni, na wanunuzi wa jumla. Chapa ya LIMBU ENTERPRISES LIMITED (LENTL GROUP).",
      rights: "Haki zote zimehifadhiwa.",
    },
    whatsapp: {
      label: "Ongea nasi WhatsApp",
      cta: "Uliza kupitia WhatsApp",
      text: "Habari MILOHA, ningependa kuomba bei ya oda ya nafaka.",
    },
    notFound: {
      title: "Samahani! Ukurasa haujapatikana",
      cta: "Rudi Mwanzo",
    },
  },
} as const;
