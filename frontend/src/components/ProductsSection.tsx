import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Package2, ShoppingBag } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import { type ProductCategory } from "@/data/siteContent";
import { useSiteContent } from "@/hooks/useSiteContent";
import { categoryLabels, createLocalizedText, getLocalizedText } from "@/lib/i18n";
import { focusSearchTarget, SEARCH_NAVIGATION_EVENT, type SearchNavigationDetail } from "@/lib/site-search";

const categories: { value: ProductCategory | "all"; desc: ReturnType<typeof createLocalizedText> }[] = [
  { value: "all", desc: createLocalizedText("See the full range in one view.", "Ona bidhaa zote kwa mwonekano mmoja.") },
  { value: "retail", desc: createLocalizedText("Smaller quantities for households and walk-in buying.", "Kiasi kidogo kwa matumizi ya nyumbani na ununuzi wa kawaida.") },
  { value: "wholesale", desc: createLocalizedText("Regular restocking for shops, kitchens, and institutions.", "Ujazaji wa mara kwa mara kwa maduka, jikoni, na taasisi.") },
  { value: "packaged", desc: createLocalizedText("Shelf-ready branded packs for modern retail display.", "Vifungashio vya chapa tayari kwa rafu za maduka ya kisasa.") },
  { value: "bulk", desc: createLocalizedText("Larger-volume handling for trade, milling, and distribution.", "Usimamizi wa kiasi kikubwa kwa biashara, kusaga, na usambazaji.") },
];

const selectionGuides = [
  {
    title: createLocalizedText("Small orders", "Oda ndogo"),
    desc: createLocalizedText(
      "Start with retail and packaged options if you are buying for home use or a small shop.",
      "Anza na chaguo za rejareja na zilizofungashwa kama unanunua kwa nyumbani au duka dogo.",
    ),
  },
  {
    title: createLocalizedText("Regular restocking", "Ujazaji wa mara kwa mara"),
    desc: createLocalizedText(
      "Use wholesale sizes when you need reliable replenishment for kitchens, stores, or institutions.",
      "Tumia saizi za jumla unapohitaji ujazaji wa kuaminika kwa jikoni, maduka, au taasisi.",
    ),
  },
  {
    title: createLocalizedText("High-volume planning", "Mipango ya kiasi kikubwa"),
    desc: createLocalizedText(
      "Choose bulk when quantity, route coordination, and dispatch timing matter most.",
      "Chagua kiasi kikubwa pale ambapo kiwango, njia, na muda wa usafirishaji vina umuhimu mkubwa.",
    ),
  },
];

const ProductsSection = () => {
  const { content } = useSiteContent();
  const { language, copy } = useLanguage();
  const products = content.products;
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [pendingTarget, setPendingTarget] = useState<string | null>(null);

  useEffect(() => {
    if (!products.some((product) => product.id === selectedProductId)) {
      setSelectedProductId(products[0]?.id ?? "");
    }
  }, [products, selectedProductId]);

  useEffect(() => {
    const onNavigate = (event: Event) => {
      const detail = (event as CustomEvent<SearchNavigationDetail>).detail;

      if (detail.result.kind !== "product") {
        return;
      }

      setSelectedCategory("all");
      setSelectedProductId(detail.result.itemKey ?? "");
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
      focusSearchTarget(pendingTarget, "products");
      setPendingTarget(null);
    }, 120);

    return () => window.clearTimeout(timeout);
  }, [pendingTarget, selectedCategory]);

  const filteredProducts = useMemo(
    () =>
      selectedCategory === "all"
        ? products
        : products.filter((product) => product.category.includes(selectedCategory)),
    [products, selectedCategory],
  );

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ??
    filteredProducts[0] ??
    products[0];

  if (!products.length) {
    return null;
  }

  return (
    <section id="products" className="section-shell py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="section-kicker">{copy.products.kicker}</div>
            <h2 className="mt-6 text-4xl font-bold text-foreground md:text-5xl">
              {copy.products.title}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {copy.products.description}
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {selectionGuides.map((guide) => (
              <div key={guide.title.en} className="surface-panel rounded-[1.6rem] p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{getLocalizedText(guide.title, language)}</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{getLocalizedText(guide.desc, language)}</p>
              </div>
            ))}
          </div>
        </div>

        <Tabs
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as ProductCategory | "all")}
          className="w-full"
        >
          <div className="mb-8 flex justify-center">
            <TabsList className="surface-panel h-auto flex-wrap gap-2 rounded-[1.6rem] p-2">
              {categories.map((category) => (
                <TabsTrigger key={category.value} value={category.value} className="rounded-xl px-4 py-2.5">
                  {getLocalizedText(categoryLabels[category.value], language)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => (
            <TabsContent key={category.value} value={category.value} className="mt-0">
              {(() => {
                const productsForTab =
                  category.value === "all"
                    ? products
                    : products.filter((product) => product.category.includes(category.value));

                return (
                  <>
                    <div className="surface-panel mb-8 rounded-3xl p-5">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.18em] text-primary">{copy.products.selectedView}</p>
                          <p className="mt-2 text-2xl font-semibold text-foreground">{getLocalizedText(categoryLabels[category.value], language)}</p>
                        </div>
                        <div className="md:max-w-xl md:text-right">
                          <p className="text-base text-muted-foreground">{getLocalizedText(category.desc, language)}</p>
                          <p className="mt-2 text-sm font-semibold text-primary">
                            {productsForTab.length} {copy.products.optionsAvailable}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                      {productsForTab.map((product, index) => (
                        <Drawer key={product.id}>
                          <DrawerTrigger asChild>
                            <button
                              id={`product-${product.id}`}
                              type="button"
                              onClick={() => setSelectedProductId(product.id)}
                              className={`group surface-panel overflow-hidden rounded-[1.9rem] text-left transition-all hover:-translate-y-1 hover:shadow-[0_32px_80px_-44px_rgba(20,31,27,0.55)] ${
                                index === 0 ? "xl:col-span-2" : ""
                              }`}
                            >
                              <div className={`relative overflow-hidden ${index === 0 ? "aspect-[1.6/1]" : "aspect-square"}`}>
                                <img
                                  src={product.img}
                                  alt={getLocalizedText(product.name, language)}
                                  loading="lazy"
                                  width={900}
                                  height={900}
                                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-secondary/85 via-secondary/15 to-transparent" />
                                <div className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-sm">
                                  {getLocalizedText(product.tag, language)}
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                  <div className="mb-2 flex flex-wrap gap-2">
                                    {product.category.map((item) => (
                                      <span
                                        key={item}
                                        className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-white"
                                      >
                                        {getLocalizedText(categoryLabels[item], language)}
                                      </span>
                                    ))}
                                  </div>
                                  <h3 className="text-2xl font-bold text-white">{getLocalizedText(product.name, language)}</h3>
                                </div>
                              </div>
                              <div className="space-y-4 p-5">
                                <p className="text-sm leading-7 text-muted-foreground">{getLocalizedText(product.desc, language)}</p>
                                <div className="flex flex-wrap gap-2">
                                  {product.sizes.map((size) => (
                                    <span key={size} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground/80">
                                      {size}
                                    </span>
                                  ))}
                                </div>
                                <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                                  {copy.products.viewDetails} <ArrowRight size={16} />
                                </div>
                              </div>
                            </button>
                          </DrawerTrigger>

                          {selectedProduct && selectedProduct.id === product.id && (
                            <DrawerContent className="max-h-[92vh] rounded-t-[2rem] bg-background/96 backdrop-blur-xl">
                              <div className="mx-auto w-full max-w-5xl overflow-y-auto">
                                <div className="grid gap-8 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
                                  <div>
                                    <div className="relative aspect-[1.35/1] overflow-hidden rounded-[1.75rem]">
                                      <img
                                        src={selectedProduct.img}
                                        alt={getLocalizedText(selectedProduct.name, language)}
                                        width={1200}
                                        height={900}
                                        className="h-full w-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/65 to-transparent" />
                                    </div>
                                  </div>

                                  <div>
                                    <DrawerHeader className="px-0 pt-0 text-left">
                                      <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                                        <Package2 size={14} />
                                        {getLocalizedText(selectedProduct.tag, language)}
                                      </div>
                                      <DrawerTitle className="text-3xl font-bold">{getLocalizedText(selectedProduct.name, language)}</DrawerTitle>
                                      <DrawerDescription className="mt-3 text-base leading-relaxed">
                                        {getLocalizedText(selectedProduct.desc, language)}
                                      </DrawerDescription>
                                    </DrawerHeader>

                                    <div className="mt-6 grid gap-6">
                                      <div>
                                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">{copy.products.availableSizes}</p>
                                        <div className="flex flex-wrap gap-2">
                                          {selectedProduct.sizes.map((size) => (
                                            <span key={size} className="rounded-full border border-border bg-muted px-3 py-1.5 text-sm font-medium">
                                              {size}
                                            </span>
                                          ))}
                                        </div>
                                      </div>

                                      <div>
                                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">{copy.products.bestFor}</p>
                                        <div className="grid gap-2">
                                          {selectedProduct.uses.map((use) => (
                                            <div key={use.en} className="flex items-center gap-2 text-sm text-muted-foreground">
                                              <CheckCircle2 size={16} className="text-primary" />
                                              {getLocalizedText(use, language)}
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      <div>
                                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">{copy.products.whyChoose}</p>
                                        <div className="grid gap-3">
                                          {selectedProduct.highlights.map((highlight) => (
                                            <div key={highlight.en} className="surface-soft rounded-2xl p-4 text-sm text-muted-foreground">
                                              {getLocalizedText(highlight, language)}
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      <div className="surface-panel-dark rounded-3xl p-5 text-secondary-foreground">
                                        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-secondary-foreground/70">{copy.products.nutrition}</p>
                                        <div className="grid grid-cols-3 gap-3">
                                          {selectedProduct.nutrition.map((item) => (
                                            <div key={item.label.en} className="rounded-2xl bg-white/8 p-3">
                                              <p className="text-xs uppercase tracking-[0.14em] text-secondary-foreground/60">{getLocalizedText(item.label, language)}</p>
                                              <p className="mt-2 text-lg font-semibold text-white">{getLocalizedText(item.value, language)}</p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>

                                    <DrawerFooter className="px-0">
                                      <a
                                        href="#contact"
                                        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-secondary px-6 text-sm font-semibold text-secondary-foreground"
                                      >
                                        <ShoppingBag size={16} className="text-accent" />
                                        {copy.products.request}
                                      </a>
                                      <DrawerClose className="rounded-full border border-input px-6 py-2.5 text-sm font-medium">
                                        {copy.products.keepBrowsing}
                                      </DrawerClose>
                                    </DrawerFooter>
                                  </div>
                                </div>
                              </div>
                            </DrawerContent>
                          )}
                        </Drawer>
                      ))}
                    </div>
                  </>
                );
              })()}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default ProductsSection;
