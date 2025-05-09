import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme } from "@/types/ui";
import { COLORS, TYPOGRAPHY, RADIUS, SPACING } from "@/constants/theme";

type ThemeType = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeType;
  dark: boolean;
  colors: typeof COLORS;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeType;
}

const THEME_STORAGE_KEY = "@app_theme";

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "system",
}) => {
  const colorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);

  // Determine if dark mode is active
  const isDarkMode =
    theme === "system" ? colorScheme === "dark" : theme === "dark";

  // Get appropriate color palette
  const activeColors = {
    ...COLORS,
    // Override any colors that might change in dark mode
  };

  // Load theme preference from storage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setThemeState(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Set theme
  const setTheme = async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    if (theme === "system") {
      // If system, switch to opposite of system preference
      setTheme(colorScheme === "dark" ? "light" : "dark");
    } else {
      // Toggle between light and dark
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  const value = {
    theme,
    dark: isDarkMode,
    colors: activeColors,
    setTheme,
    toggleTheme,
  };

  // Don't render until theme is loaded from storage
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Helper function to get a fully constructed theme object
export const getTheme = (isDark: boolean): Theme => {
  return {
    colors: COLORS,
    typography: TYPOGRAPHY,
    radius: RADIUS,
    spacing: SPACING,
    isDark,
  };
};

export default ThemeContext;
