import { ViewStyle, TextStyle, ImageStyle } from "react-native";

export interface ThemeColors {
  primary: string;
  secondary: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  white: string;
  black: string;
  dark1: string;
  dark2: string;
  gray1: string;
  gray2: string;
  gray3: string;
  secondaryWhite: string;
  transparent: string;
}

export interface Typography {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  h5: TextStyle;
  h6: TextStyle;
  subtitle1: TextStyle;
  subtitle2: TextStyle;
  body1: TextStyle;
  body2: TextStyle;
  button: TextStyle;
  caption: TextStyle;
  overline: TextStyle;
}

export interface BorderRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface Theme {
  colors: ThemeColors;
  typography: Typography;
  radius: BorderRadius;
  spacing: Spacing;
  isDark: boolean;
}

export type StylesObject<T = any> = {
  [key in keyof T]: ViewStyle | TextStyle | ImageStyle;
};

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
}

export interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: "primary" | "secondary" | "outline" | "text";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export interface HeaderProps {
  title: string;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  style?: ViewStyle;
  transparent?: boolean;
}
