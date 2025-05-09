// app/Enfants/[id]/suivi.tsx
import React from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "@/constants/theme";
import { useChildren } from "@/contexts/ChildrenContext";

import Header from "@/components/ui/Header";
import PerformanceChart from "@/components/children/SuiviTab/PerformanceChart";
import SubjectProgress from "@/components/children/SuiviTab/SubjectProgress";

export default function ChildTrackingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const childId = Number(id);
  const { getChild, getChildPerformance, loading } = useChildren();

  const child = getChild(childId);
  const performance = getChildPerformance(childId);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: "#F8F8F8" }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!child || !performance) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: "#F8F8F8" }]}>
        <Header title="Suivi" onBackPress={() => router.back()} />
        <View style={styles.errorContainer}>
          <Text style={{ color: COLORS.black }}>Enfant non trouvé</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#F8F8F8" }]}>
      <Header
        title="Suivi de performance"
        subtitle={child.name}
        onBackPress={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Global Performance */}
        <PerformanceChart
          progress={performance.overall}
          evolutionRate={performance.evolution}
        />

        {/* Subject Progress */}
        <SubjectProgress subjects={performance.bySubject} />
      </ScrollView>
    </SafeAreaView>
  );
}

import { Text, ScrollView } from "react-native";

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
