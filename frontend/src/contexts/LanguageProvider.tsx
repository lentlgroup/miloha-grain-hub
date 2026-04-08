import { useEffect, useMemo, useState, type ReactNode } from "react";
import { type Language, uiText } from "@/lib/i18n";
import { LanguageContext } from "@/contexts/language-context";

const STORAGE_KEY = "miloha-language";

const readStoredLanguage = (): Language => {
  if (typeof window === "undefined") {
    return "en";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  return stored === "sw" ? "sw" : "en";
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(readStoredLanguage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language === "sw" ? "sw-TZ" : "en";
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      copy: uiText[language],
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
