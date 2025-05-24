import type { ReactNode } from "react";

import React, { useMemo, useContext, createContext } from "react";

import { lightColors } from "./colors";

interface ThemeContextType {
  colors: typeof lightColors;
}

const defaultThemeContext: ThemeContextType = {
  colors: lightColors,
};

export const ThemeContext =
  createContext<ThemeContextType>(defaultThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = useMemo(
    () => ({
      colors: lightColors,
    }),
    []
  );

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
