import { Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

export const COLORS = {
  text: "#000000", // Ajout de la couleur text (noir dans cet exemple)
  lightGray: "#d3d3d3", // Ajout de la couleur lightGray
  red: "#ff0000", // Ajout de la couleur rouge
  primary: "#ff8e69",
  secondary: "#fe7862",
  tertiary: "#6C4DDA",
  success: "#0ABE75",
  black: "#181A20",
  black2: "#1D272F",
  info: "#246BFD",
  warning: "#FACC15",
  error: "#F75555",
  disabled: "#D8D8D8",
  white: "#FFFFFF",
  secondaryWhite: "#F8F8F8",
  tertiaryWhite: "#F7F7F7",
  greeen: "#0ABE75",
  gray: "#9E9E9E",
  gray2: "#35383F",
  gray3: "#9E9E9E",
  dark1: "#000000",
  dark2: "#1F222A",
  dark3: "#35383F",
  greyscale900: "#212121",
  greyScale800: "#424242",
  greyScale700: "#4A4A4A",
  greyScale400: "#B0B0B0",
  greyScale100: "#EAEAEA",
  greyscale400: "#BDBDBD",
  greyscale100: "#F5F5F5",
  grayscale700: "#616161",
  grayscale400: "#BDBDBD",
  greyscale300: "#E0E0E0",
  greyscale500: "#FAFAFA",
  greyscale600: "#757575",
  grayscale200: "#EEEEEE",
  grayscale100: "#F5F5F5",
  tansparentPrimary: "rgba(51, 94, 247, 0.08)",
  transparentSecondary: "rgba(108,77,218, .15)",
  transparentTertiary: "rgba(51, 94, 247, .1)",
  transparentRed: "rgba(255,62,61, .15)",
  blackTie: "#474747",
  grayTie: "#BCBCBC",
};

export const SIZES = {
  // Global SIZES
  base: 8,
  font: 14,
  radius: 30,
  padding: 8,
  padding2: 12,
  padding3: 16,

  // FONTS Sizes
  largeTitle: 50,
  h1: 36,
  h2: 22,
  h3: 16,
  h4: 14,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,

  // App Dimensions
  width,
  height,
};

export const FONTS = {
  largeTitle: {
    fontFamily: "black",
    fontSize: SIZES.largeTitle,
    lineHeight: 55,
    color: "black",
  },
  h1: {
    fontFamily: "bold",
    fontSize: SIZES.h1,
    lineHeight: 36,
    color: "black",
  },
  h2: {
    fontFamily: "bold",
    fontSize: SIZES.h2,
    lineHeight: 30,
    color: "black",
  },
  h3: {
    fontFamily: "bold",
    fontSize: SIZES.h3,
    lineHeight: 22,
    color: "black",
  },
  h4: { fontFamily: "bold", fontSize: SIZES.h4, lineHeight: 20 },
  body1: {
    fontFamily: "regular",
    fontSize: SIZES.body1,
    lineHeight: 36,
    color: "black",
  },
  body2: {
    fontFamily: "regular",
    fontSize: SIZES.body2,
    lineHeight: 30,
    color: "black",
  },
  body3: {
    fontFamily: "regular",
    fontSize: SIZES.body3,
    lineHeight: 22,
    color: "black",
  },
  body4: {
    fontFamily: "regular",
    fontSize: SIZES.body4,
    lineHeight: 20,
    color: "black",
  },
};

export const COLOORS = {
  // Brand colors
  primary: {
    lighter: "#f9a99a",
    light: "#f28374",
    main: "#fe7862",
    dark: "#d75f4d",
    darker: "#b34e3a",
    contrastText: "#FFFFFF",
  },

  // Status colors
  status: {
    active: {
      light: "#DCFCE7",
      main: "#10B981",
      dark: "#047857",
      contrastText: "#FFFFFF",
    },
    suspended: {
      light: "#FEF3C7",
      main: "#F59E0B",
      dark: "#B45309",
      contrastText: "#FFFFFF",
    },
    expired: {
      light: "#FEE2E2",
      main: "#EF4444",
      dark: "#B91C1C",
      contrastText: "#FFFFFF",
    },
  },

  // Accent colors
  accent: {
    blue: {
      light: "#DBEAFE",
      main: "#3B82F6",
      dark: "#1E40AF",
    },
    purple: {
      light: "#EDE9FE",
      main: "#8B5CF6",
      dark: "#5B21B6",
    },
    green: {
      light: "#D1FAE5",
      main: "#10B981",
      dark: "#065F46",
    },
  },

  // Neutral colors
  background: {
    light: "#FFFFFF",
    dark: "#121212",
  },
  surface: {
    light: "#FFFFFF",
    dark: "#1E1E1E",
  },
  surfaceVariant: {
    light: "#F5F5F5",
    dark: "#2A2A2A",
  },

  // Text colors
  text: {
    light: {
      primary: "#121212",
      secondary: "#555555",
      disabled: "#999999",
    },
    dark: {
      primary: "#FFFFFF",
      secondary: "#AAAAAA",
      disabled: "#666666",
    },
  },

  // Legacy colors (for backward compatibility)
  white: "#FFFFFF",
  black: "#121212",
  gray2: "#AAAAAA",
  gray3: "#555555",
  dark2: "#1E1E1E",
  dark3: "#2A2A2A",
  greyscale900: "#121212",
};
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  base: 8,
  padding2: 16,
  padding3: 24,
};
export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  round: 999,
};

export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  button: {
    shadowColor: COLOORS.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const ANIMATIONS = {
  button: {
    scale: 0.96,
    duration: 100,
  },
  card: {
    from: { opacity: 0, translateY: 20 },
    to: { opacity: 1, translateY: 0 },
    config: { tension: 300, friction: 20 },
    delay: 200,
  },
  feature: {
    from: { opacity: 0, translateX: -10 },
    to: { opacity: 1, translateX: 0 },
    config: { duration: 300 },
    baseDelay: 200,
    perItemDelay: 50,
  },
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 26,
    fontFamily: "bold",
    lineHeight: 32,
    letterSpacing: 0.5,
  },
  h2: {
    fontSize: 22,
    fontFamily: "bold",
    lineHeight: 28,
    letterSpacing: 0.3,
  },
  h3: {
    fontSize: 18,
    fontFamily: "bold",
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  subtitle1: {
    fontSize: 16,
    fontFamily: "semibold",
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  subtitle2: {
    fontSize: 14,
    fontFamily: "semibold",
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  body1: {
    fontSize: 16,
    fontFamily: "regular",
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontFamily: "regular",
    lineHeight: 20,
  },
  button: {
    fontSize: 16,
    fontFamily: "semibold",
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  caption: {
    fontSize: 12,
    fontFamily: "medium",
    lineHeight: 16,
  },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
