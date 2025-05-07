import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  ColorValue,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  TYPOGRAPHY,
  RADIUS,
  SHADOWS,
  COLOORS,
} from "@/constants/theme";

type GradientTuple = readonly [ColorValue, ColorValue, ...ColorValue[]];

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";
export type ButtonSize = "small" | "medium" | "large";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradientColors?: GradientTuple;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  gradientColors,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const base: ViewStyle = {
      ...styles.button,
      ...styles[`${size}Button`],
      opacity: disabled ? 0.6 : 1,
      width: fullWidth ? "100%" : undefined,
      backgroundColor:
        variant === "primary" || variant === "danger"
          ? undefined
          : getBackgroundColor(),
    };
    return base;
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case "secondary":
        return COLOORS.surfaceVariant.light;
      case "outline":
      case "ghost":
        return "transparent";
      default:
        return COLOORS.primary.main;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "primary":
        return COLOORS.primary.contrastText;
      case "danger":
        return COLOORS.status.expired.contrastText;
      case "outline":
      case "ghost":
        return COLOORS.primary.main;
      case "secondary":
        return COLOORS.text.light.primary;
      default:
        return COLOORS.primary.contrastText;
    }
  };

  const getBorderStyle = () =>
    variant === "outline"
      ? { borderWidth: 1, borderColor: COLOORS.primary.main }
      : {};

  const getIconSize = () =>
    size === "small" ? 16 : size === "large" ? 24 : 20;

  const renderContent = () =>
    loading ? (
      <ActivityIndicator
        size={size === "small" ? "small" : "small"}
        color={getTextColor()}
      />
    ) : (
      <>
        {leftIcon && (
          <Ionicons
            name={leftIcon as any}
            size={getIconSize()}
            color={getTextColor()}
            style={styles.leftIcon}
          />
        )}
        <Text
          style={[
            styles.buttonText,
            styles[`${size}Text`],
            { color: getTextColor() },
            textStyle,
          ]}
        >
          {label}
        </Text>
        {rightIcon && (
          <Ionicons
            name={rightIcon as any}
            size={getIconSize()}
            color={getTextColor()}
            style={styles.rightIcon}
          />
        )}
      </>
    );

  const usesGradient =
    (variant === "primary" || variant === "danger") && !disabled;

  if (usesGradient) {
    const defaultGradient: GradientTuple =
      variant === "primary"
        ? [COLOORS.primary.main, COLOORS.primary.dark]
        : [COLOORS.status.expired.main, COLOORS.status.expired.dark];

    const gradientArray: GradientTuple = gradientColors ?? defaultGradient;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        disabled={disabled || loading}
        style={[getButtonStyle(), getBorderStyle(), style, SHADOWS.button]}
      >
        <LinearGradient
          colors={gradientArray}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyle(), getBorderStyle(), style]}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.xxl,
    overflow: "hidden",
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    ...TYPOGRAPHY.button,
  },
  smallText: { fontSize: 14 },
  mediumText: { fontSize: 16 },
  largeText: { fontSize: 18 },
  gradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  leftIcon: { marginRight: 8 },
  rightIcon: { marginLeft: 8 },
});

export default Button;
