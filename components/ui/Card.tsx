import type {
  ViewStyle,
  ViewProps,
  StyleProp,
  ColorValue} from "react-native";

import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  StyleSheet
} from "react-native";

import { useTheme } from "@/theme/ThemeProvider";
import { RADIUS, COLOORS, SHADOWS } from "@/constants/theme";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

type GradientTuple = readonly [ColorValue, ColorValue, ...ColorValue[]];

interface CardProps extends ViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  gradient?: boolean;
  gradientColors?: GradientTuple;
  elevated?: boolean;
  shadowLevel?: "small" | "medium" | "large";
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

const Card: React.FC<CardProps> = ({
  children,
  style,
  gradient = false,
  gradientColors = [
    COLOORS.primary.main,
    COLOORS.primary.dark,
  ] as GradientTuple,
  elevated = true,
  shadowLevel = "medium",
  ...props
}) => {
  const { dark } = useTheme();

  const cardStyle = [
    styles.card,
    elevated && SHADOWS[shadowLevel],
    { backgroundColor: dark ? COLOORS.surface.dark : COLOORS.surface.light },
    style,
  ];

  if (gradient) {
    return (
      <View style={[cardStyle, { overflow: "hidden" }]} {...props}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {children}
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    padding: 16,
  },
});

export default Card;
