import type { ReactNode } from "react";

import { useColorScheme } from "react-native";
import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
  createContext,
} from "react";

import { darkColors, lightColors } from "./colors";

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
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === "dark");

  useEffect(() => {
    setIsDark(colorScheme === "dark");
  }, [colorScheme]);

  const theme = useMemo(
    () => ({
      dark: isDark,
      colors: isDark ? darkColors : lightColors,
      setScheme: (scheme: "light" | "dark") => setIsDark(scheme === "dark"),
    }),
    [isDark]
  );

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
