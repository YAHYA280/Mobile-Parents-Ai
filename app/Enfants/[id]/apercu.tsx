// app/Enfants/[id]/apercu.tsx
import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "@/constants/theme";
import { useChildren } from "@/contexts/ChildrenContext";
import { useTheme } from "@/contexts/ThemeContext";

import Header from "@/components/ui/Header";
import StrengthsPanel from "@/components/children/OverviewTab/StrengthsPanel";
import QuickStats from "@/components/children/OverviewTab/QuickStats";
import { useRouter } from "expo-router";

export default function ChildOverviewScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const childId = Number(id);
  const { getChild, getChildSummary, loading } = useChildren();
  const { dark } = useTheme();

  const child = getChild(childId);
  const summary = getChildSummary(childId);

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: dark ? COLORS.dark1 : "#F8F8F8" },
        ]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!child || !summary) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: dark ? COLORS.dark1 : "#F8F8F8" },
        ]}
      >
        <Header title="Aperçu" onBackPress={() => router.back()} />
        <View style={styles.errorContainer}>
          <Text style={{ color: dark ? COLORS.white : COLORS.black }}>
            Enfant non trouvé
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Format strengths and weaknesses
  const strengths = child.matieresFortes.map((subject) => ({
    subject,
    color: "#4CAF50",
  }));

  const weaknesses = child.matieresAmeliorer.map((subject) => ({
    subject: subject.replace(/^\?/, "").trim(),
    color: "#FF5722",
  }));

  // Quick stats
  const stats = [
    {
      label: "Activités",
      value: summary.totalActivities,
      icon: "list-outline",
      color: COLORS.primary,
    },
    {
      label: "Temps total",
      value: summary.totalDuration,
      icon: "time-outline",
      color: "#FF9800",
    },
    {
      label: "Dernière activité",
      value: new Date(summary.lastActivityDate).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      }),
      icon: "calendar-outline",
      color: "#2196F3",
    },
    {
      label: "Progrès",
      value:
        typeof summary.progress === "string"
          ? summary.progress
          : `${summary.progress}%`,
      icon: "trending-up-outline",
      color: "#4CAF50",
    },
  ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: dark ? COLORS.dark1 : "#F8F8F8" },
      ]}
    >
      <Header
        title={child.name}
        subtitle="Aperçu général"
        onBackPress={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Progress Overview */}
        <QuickStats stats={stats} />

        {/* Strengths and Weaknesses */}
        <StrengthsPanel strengths={strengths} weaknesses={weaknesses} />
      </ScrollView>
    </SafeAreaView>
  );
}

import { Text } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
