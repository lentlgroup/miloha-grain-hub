import type { InquiryPayload, SiteContentPayload, SiteSearchResponse } from "@/data/siteContent";

const API_BASE_URL = "/api";

const readJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    ...init,
  });

  const raw = await response.text();
  let data: unknown = null;

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data && typeof data.message === "string"
        ? data.message
        : `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data as T;
};

export const fetchSiteContent = () => readJson<SiteContentPayload>("/site-content");

export const fetchSiteSearch = (query: string, signal?: AbortSignal) =>
  readJson<SiteSearchResponse>(`/site-search?q=${encodeURIComponent(query)}`, {
    signal,
  });

export const submitInquiry = (payload: InquiryPayload) =>
  readJson<{ message: string; id: number }>("/inquiries", {
    method: "POST",
    body: JSON.stringify(payload),
  });
