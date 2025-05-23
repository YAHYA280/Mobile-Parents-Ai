import type { ReactNode } from "react";

import React, { useMemo, useContext, createContext } from "react";

import { lightColors } from "./colors";

interface ThemeContextType {
  dark: boolean;
  colors: typeof lightColors;
  setScheme: (scheme: "light" | "dark") => void;
}

const defaultThemeContext: ThemeContextType = {
  dark: false,
  colors: lightColors,
  setScheme: () => {},
};

export const ThemeContext =
  createContext<ThemeContextType>(defaultThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const isDark = false;

  const theme = useMemo(
    () => ({
      dark: isDark,
      colors: lightColors,
      setScheme: () => {},
    }),
    []
  );

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
