// components/cards/GradientCard.tsx
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { RADIUS, SHADOWS } from "@/constants/theme";

interface GradientCardProps {
  children: React.ReactNode;
  colors?: string[];
  style?: ViewStyle;
  index?: number; // For staggered animations
}

const GradientCard: React.FC<GradientCardProps> = ({
  children,

  style,
  index = 0,
}) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: "spring",
        damping: 18,
        stiffness: 120,
        delay: index * 100,
      }}
      style={[styles.cardOuterContainer, style]}
    >
      <LinearGradient
        colors={["#fe7862", "#ff8e69"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        {/* Decorative elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />

        {children}
      </LinearGradient>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  cardOuterContainer: {
    borderRadius: RADIUS.lg,
    marginBottom: 16,
    ...SHADOWS.medium,
    overflow: "hidden",
  },
  gradientContainer: {
    padding: 16,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    position: "relative",
  },
  decorativeCircle1: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    top: -50,
    right: -30,
  },
  decorativeCircle2: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    bottom: -20,
    left: 30,
  },
});

export default GradientCard;
