import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export const ThemeProvider = ({ children }: { children: ReactNode }) => (
  <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="miloha-theme">
    {children}
  </NextThemesProvider>
);
