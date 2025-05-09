import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeColors, Typography } from "@/types/ui";
import { COLORS, TYPOGRAPHY, RADIUS, SPACING } from "@/constants/theme";

type ThemeType = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeType;
  dark: boolean;
  colors: ThemeColors;
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
  // Ensure all properties required by ThemeColors type are included
  const activeColors: ThemeColors = {
    ...COLORS,
    // Add any missing properties
    gray1: COLORS.gray2 || "#E8E8E8",
    transparent: COLORS.transparentSecondary || "transparent",
    // You may need to add more properties if missing in COLORS
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
  // Ensure all properties required by Typography type are included
  const typography: Typography = {
    ...TYPOGRAPHY,
    // Add missing typography properties
    h4: TYPOGRAPHY.h4 || {
      fontSize: 18,
      fontWeight: "600",
      lineHeight: 26,
    },
    h5: TYPOGRAPHY.h5 || {
      fontSize: 16,
      fontWeight: "600",
      lineHeight: 24,
    },
    h6: TYPOGRAPHY.h6 || {
      fontSize: 14,
      fontWeight: "600",
      lineHeight: 22,
    },
    overline: {
      fontSize: 10,
      fontFamily: "medium",
      lineHeight: 14,
      letterSpacing: 1.5,
      textTransform: "uppercase",
    },
  };

  return {
    colors: {
      ...COLORS,
      gray1: COLORS.gray2 || "#E8E8E8",
      transparent: COLORS.transparentSecondary || "transparent",
    },
    typography,
    radius: RADIUS,
    spacing: SPACING,
    isDark,
  };
};

export default ThemeContext;
