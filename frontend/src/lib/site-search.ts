import type { SiteSearchResult } from "@/data/siteContent";

export const SEARCH_NAVIGATION_EVENT = "miloha:site-search-navigate";

export type SearchNavigationDetail = {
  query: string;
  tokens: string[];
  result: SiteSearchResult;
};

const normalizeSearchText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase()
    .trim();

export const tokenizeSearchQuery = (query: string) =>
  Array.from(
    new Set(
      normalizeSearchText(query)
        .split(/[^\p{L}\p{N}]+/u)
        .filter(Boolean),
    ),
  );

const scoreResult = (result: SiteSearchResult, tokens: string[]) => {
  const haystack = normalizeSearchText(
    [
      result.title.en,
      result.title.sw,
      result.description.en,
      result.description.sw,
      result.sectionLabel.en,
      result.sectionLabel.sw,
    ].join(" "),
  );
  const title = normalizeSearchText(`${result.title.en} ${result.title.sw}`);
  const description = normalizeSearchText(`${result.description.en} ${result.description.sw}`);
  const matchedTerms = result.matchedTerms?.length ? result.matchedTerms : tokens.filter((token) => haystack.includes(token));

  if (!matchedTerms.length) {
    return null;
  }

  const phrase = tokens.join(" ");
  const titleHits = tokens.filter((token) => title.includes(token)).length;
  const descriptionHits = tokens.filter((token) => description.includes(token)).length;
  const matchesAllTerms = result.matchesAllTerms ?? matchedTerms.length === tokens.length;

  return (matchedTerms.length * 12)
    + (titleHits * 18)
    + (descriptionHits * 6)
    + (title.includes(phrase) ? 24 : 0)
    + (haystack.includes(phrase) ? 12 : 0)
    + (matchesAllTerms ? 30 : 0);
};

export const rankSearchResults = (results: SiteSearchResult[], tokens: string[]) => {
  const seen = new Set<string>();

  return results
    .filter((result) => {
      if (seen.has(result.id)) {
        return false;
      }

      seen.add(result.id);

      return true;
    })
    .map((result) => ({
      result,
      score: scoreResult(result, tokens),
    }))
    .filter((entry): entry is { result: SiteSearchResult; score: number } => entry.score !== null)
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.result);
};

export const dispatchSearchNavigation = (detail: SearchNavigationDetail) => {
  window.dispatchEvent(new CustomEvent<SearchNavigationDetail>(SEARCH_NAVIGATION_EVENT, { detail }));
};

export const focusSearchTarget = (targetId: string, fallbackId?: string) => {
  const element = document.getElementById(targetId) ?? (fallbackId ? document.getElementById(fallbackId) : null);

  if (!element) {
    return false;
  }

  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });

  element.classList.remove("search-target-active");
  void element.clientWidth;
  element.classList.add("search-target-active");

  window.setTimeout(() => {
    element.classList.remove("search-target-active");
  }, 2200);

  const hash = `#${targetId}`;
  if (window.location.hash !== hash) {
    window.history.replaceState(null, "", hash);
  }

  return true;
};
