import { useDeferredValue, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, LoaderCircle, Search } from "lucide-react";
import type { SiteSearchResult } from "@/data/siteContent";
import { useLanguage } from "@/hooks/useLanguage";
import { fetchSiteSearch } from "@/lib/api";
import { createLocalizedText, getLocalizedText } from "@/lib/i18n";
import { dispatchSearchNavigation, focusSearchTarget, rankSearchResults, tokenizeSearchQuery } from "@/lib/site-search";

const staticSearchEntries: SiteSearchResult[] = [
  {
    id: "section-about",
    kind: "section",
    anchor: "about",
    sectionId: "about",
    sectionLabel: createLocalizedText("About", "Kuhusu"),
    title: createLocalizedText("About MILOHA", "Kuhusu MILOHA"),
    description: createLocalizedText(
      "Learn who MILOHA serves and how the brand is positioned for homes, shops, and wholesale buyers.",
      "Fahamu MILOHA inamhudumia nani na jinsi chapa ilivyojipanga kwa nyumba, maduka, na wanunuzi wa jumla.",
    ),
  },
  {
    id: "section-quality",
    kind: "section",
    anchor: "quality",
    sectionId: "quality",
    sectionLabel: createLocalizedText("Quality Journey", "Safari ya Ubora"),
    title: createLocalizedText("Quality Journey", "Safari ya Ubora"),
    description: createLocalizedText(
      "Follow the product flow from sourcing and sorting to packaging and dispatch.",
      "Fuata mtiririko wa bidhaa kutoka upatikanaji na uchambuaji hadi ufungashaji na usafirishaji.",
    ),
  },
  {
    id: "section-services",
    kind: "section",
    anchor: "services",
    sectionId: "services",
    sectionLabel: createLocalizedText("Services", "Huduma"),
    title: createLocalizedText("Retail support and wholesale supply", "Huduma ya rejareja na ugavi wa jumla"),
    description: createLocalizedText(
      "Explore retail support, wholesale supply, delivery coordination, and quality assurance.",
      "Chunguza huduma ya rejareja, ugavi wa jumla, uratibu wa usafirishaji, na uhakikisho wa ubora.",
    ),
  },
  {
    id: "section-buyers",
    kind: "section",
    anchor: "buyers",
    sectionId: "buyers",
    sectionLabel: createLocalizedText("Buyer Fit", "Aina za Wanunuzi"),
    title: createLocalizedText("Buyer groups and testimonials", "Makundi ya wanunuzi na ushuhuda"),
    description: createLocalizedText(
      "See the households, shops, kitchens, and institutions MILOHA is built to support.",
      "Ona nyumba, maduka, jikoni, na taasisi ambazo MILOHA imeundwa kuzihudumia.",
    ),
  },
  {
    id: "section-contact",
    kind: "section",
    anchor: "contact",
    sectionId: "contact",
    sectionLabel: createLocalizedText("Contact", "Wasiliana"),
    title: createLocalizedText("Quote request form", "Fomu ya kuomba bei"),
    description: createLocalizedText(
      "Share buyer type, product, packaging, and delivery area for a faster quote response.",
      "Shiriki aina ya mnunuzi, bidhaa, kifungashio, na eneo la kupeleka kwa majibu ya haraka ya bei.",
    ),
  },
];

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightText = (text: string, terms: string[]) => {
  if (!terms.length) {
    return text;
  }

  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  const loweredTerms = terms.map((term) => term.toLocaleLowerCase());

  return text.split(pattern).map((part, index) =>
    loweredTerms.includes(part.toLocaleLowerCase()) ? (
      <mark key={`${part}-${index}`} className="rounded bg-primary/12 px-1 py-0.5 text-foreground">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
};

const SiteSearch = () => {
  const { language, copy } = useLanguage();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim());
  const searchTokens = useMemo(() => tokenizeSearchQuery(query), [query]);
  const deferredTokens = useMemo(() => tokenizeSearchQuery(deferredQuery), [deferredQuery]);

  const searchRequest = useQuery({
    queryKey: ["site-search", deferredQuery],
    queryFn: ({ signal }) => fetchSiteSearch(deferredQuery, signal),
    enabled: deferredTokens.length > 0,
    staleTime: 30_000,
  });

  const results = useMemo(
    () => rankSearchResults([...staticSearchEntries, ...(searchRequest.data?.results ?? [])], searchTokens).slice(0, 8),
    [searchRequest.data?.results, searchTokens],
  );

  const kindLabel: Record<SiteSearchResult["kind"], string> = {
    section: copy.search.section,
    product: copy.search.products,
    faq: copy.search.faq,
    delivery: copy.search.delivery,
    process: copy.search.process,
    metric: copy.search.metric,
  };

  const handleOpenResult = (result: SiteSearchResult) => {
    dispatchSearchNavigation({
      query,
      tokens: searchTokens,
      result,
    });

    const delay = result.kind === "product" || result.kind === "faq" ? 180 : 0;

    window.setTimeout(() => {
      focusSearchTarget(result.anchor, result.sectionId);
    }, delay);

    setQuery("");
  };

  return (
    <div className="relative mt-6 max-w-2xl">
      <label htmlFor="site-search" className="text-sm font-semibold text-foreground">
        {copy.search.label}
      </label>
      <div className="relative mt-3">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          id="site-search"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={copy.search.placeholder}
          className="w-full rounded-[1.4rem] border border-border/80 bg-card/80 py-4 pl-12 pr-4 text-sm text-foreground shadow-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
        />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{copy.search.helper}</p>

      {query.trim() && (
        <div className="surface-panel absolute inset-x-0 top-full z-20 mt-4 rounded-[1.7rem] p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{copy.hero.searchResults}</p>
            {searchRequest.isFetching && (
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <LoaderCircle size={14} className="animate-spin" />
                {copy.search.searching}
              </span>
            )}
          </div>

          <div className="mt-4 grid gap-3">
            {results.length ? (
              results.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => handleOpenResult(result)}
                  className="rounded-[1.3rem] border border-border/70 bg-background/80 p-4 text-left transition-colors hover:border-primary/40 hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                          {kindLabel[result.kind]}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                          {copy.search.foundIn}: {getLocalizedText(result.sectionLabel, language)}
                        </span>
                        {result.matchesAllTerms && (
                          <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground">
                            {copy.search.allTerms}
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-base font-semibold text-foreground">
                        {highlightText(getLocalizedText(result.title, language), searchTokens)}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {highlightText(getLocalizedText(result.description, language), searchTokens)}
                      </p>
                    </div>

                    <ArrowRight size={18} className="mt-1 shrink-0 text-primary" />
                  </div>
                </button>
              ))
            ) : (
              <p className="rounded-[1.3rem] bg-muted/55 px-4 py-4 text-sm text-muted-foreground">{copy.search.empty}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteSearch;
