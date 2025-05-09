// app/Enfants/[id]/activites.tsx
import React from "react";
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "@/constants/theme";
import { useChildren } from "@/contexts/ChildrenContext";
import { useActivities } from "@/contexts/ActivitiesContext";
import { Activity as InterfaceActivity } from "@/types/interfaces";

import Header from "@/components/ui/Header";
import ActivitySummary from "@/components/children/ActivitiesTab/ActivitySummary";
import RecentActivities from "@/components/children/ActivitiesTab/RecentActivities";

export default function ChildActivitiesScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const childId = Number(id);
  const { getChild, getChildSummary, loading: childLoading } = useChildren();
  const { getChildActivities, loading: activitiesLoading } = useActivities();

  const child = getChild(childId);
  const summary = getChildSummary(childId);
  const contextActivities = getChildActivities(childId);

  // Convert activities to the format expected by RecentActivities
  const activities: InterfaceActivity[] = contextActivities.map((activity) => ({
    id: activity.id,
    activite: activity.activite,
    date: activity.date,
    duree: activity.duree,
    assistant: activity.assistant,
    matiere: activity.matiere,
    // Ensure score is a number or undefined, not a string
    score:
      typeof activity.score === "string"
        ? parseFloat(activity.score)
        : activity.score,
    // Add the type property which doesn't exist in the original Activity type
    type: activity.matiere || "Autre", // Use matiere as the type if available, otherwise "Autre"
  }));

  const loading = childLoading || activitiesLoading;

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: "#F8F8F8" }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!child || !summary) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: "#F8F8F8" }]}>
        <Header title="Activités" onBackPress={() => router.back()} />
        <View style={styles.errorContainer}>
          <Text style={{ color: COLORS.black }}>Enfant non trouvé</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#F8F8F8" }]}>
      <Header
        title="Activités"
        subtitle={child.name}
        onBackPress={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Activity Summary */}
        <ActivitySummary
          activityCount={summary.totalActivities}
          totalDuration={summary.totalDuration}
          lastActivityDate={summary.lastActivityDate}
          favoriteSubject={summary.favoriteSubject}
        />

        {/* Recent Activities */}
        <RecentActivities activities={activities} childId={childId} />
      </ScrollView>
    </SafeAreaView>
  );
}

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
