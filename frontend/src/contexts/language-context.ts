import { createContext } from "react";
import { type Language, uiText } from "@/lib/i18n";

export type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  copy: (typeof uiText)[Language];
};

export const LanguageContext = createContext<LanguageContextValue | null>(null);
