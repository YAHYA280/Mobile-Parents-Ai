// components/aicalendar/EmptyState.tsx
import React from "react";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { Text, StyleSheet } from "react-native";

import { COLORS } from "@/constants";

const EmptyState: React.FC = () => {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 15 }}
      style={styles.container}
    >
      <Ionicons name="calendar-outline" size={64} color={COLORS.greyscale400} />
      <Text style={[styles.title, { color: COLORS.black }]}>
        Aucune suggestion pour ce jour
      </Text>
      <Text style={[styles.subtitle, { color: COLORS.greyscale600 }]}>
        L&apos;IA génère des recommandations basées sur les progrès et les
        besoins de vos enfants
      </Text>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 18,
    fontFamily: "bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "regular",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default EmptyState;
