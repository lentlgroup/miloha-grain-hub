import { useQuery } from "@tanstack/react-query";
import { fallbackSiteContent, hydrateSiteContent, type SiteContent, type SiteContentPayload } from "@/data/siteContent";
import { fetchSiteContent } from "@/lib/api";

export const useSiteContent = () => {
  const query = useQuery<SiteContentPayload, Error, SiteContent>({
    queryKey: ["site-content"],
    queryFn: fetchSiteContent,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    select: hydrateSiteContent,
  });

  return {
    ...query,
    content: query.data ?? fallbackSiteContent,
  };
};
