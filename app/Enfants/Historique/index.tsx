// app/Enfants/Historique/index.tsx
import React, { useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "@/constants/theme";
import { useChildren } from "@/contexts/ChildrenContext";
import { useActivities } from "@/contexts/ActivitiesContext";
import { useFilters } from "@/contexts/FiltersContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Activity as InterfaceActivity } from "@/types/interfaces";

import Header from "@/components/ui/Header";
import ActivityCard from "@/components/activities/ActivityCard";
import ActivityFilter from "@/components/activities/ActivityFilters";

export default function AllActivitiesScreen() {
  const router = useRouter();
  const { childId } = useLocalSearchParams();
  const childIdNum = Number(childId);

  const { getChild } = useChildren();
  const {
    filteredActivities: contextActivities,
    loading,
    getChildActivities,
    getAvailableAssistants,
    getAvailableSubjects,
    getAvailableDifficulties,
  } = useActivities();

  const { filters, updateFilter, applyFilters, resetFilters } = useFilters();

  const { dark } = useTheme();

  const child = getChild(childIdNum);

  // Convert activities to the format expected by ActivityCard
  const filteredActivities: InterfaceActivity[] = contextActivities.map(
    (activity) => ({
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
    })
  );

  // Get all available filter options
  const availableAssistants = getAvailableAssistants();
  const availableSubjects = getAvailableSubjects();
  const availableDifficulties = getAvailableDifficulties();

  // Set initial activities
  useEffect(() => {
    // This approach would depend on how your context is set up
    // You may need to fetch or filter activities for this child
    getChildActivities(childIdNum);
  }, [childIdNum]);

  // Handle activity press
  const handleActivityPress = (activityId: number) => {
    // Fix the path to use absolute path instead of relative
    router.push(`./Enfants/Historique/${activityId}?childId=${childIdNum}`);
  };

  // Go back
  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: dark ? COLORS.dark1 : "#F8F8F8" },
        ]}
      >
        <Header title="Historique d'activités" onBackPress={handleBack} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: dark ? COLORS.dark1 : "#F8F8F8" },
      ]}
    >
      <Header
        title="Historique d'activités"
        subtitle={child ? child.name : ""}
        onBackPress={handleBack}
      />

      {/* Filters */}
      <ActivityFilter
        dateRange={filters.dateRange}
        selectedAssistants={filters.selectedAssistants}
        selectedSubjects={filters.selectedSubjects}
        selectedDifficulties={filters.selectedDifficulties}
        availableAssistants={availableAssistants}
        availableSubjects={availableSubjects}
        availableDifficulties={availableDifficulties}
        onFilterChange={(filterType, value) =>
          updateFilter(filterType as any, value)
        }
        onResetFilters={resetFilters}
        onApplyFilters={applyFilters}
      />

      {/* Activity List */}
      {filteredActivities.length > 0 ? (
        <FlatList
          data={filteredActivities}
          keyExtractor={(item) => `activity-${item.id}`}
          renderItem={({ item, index }) => (
            <ActivityCard
              activity={item}
              onPress={() => handleActivityPress(item.id as number)}
              index={index}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="search"
            size={64}
            color={dark ? COLORS.secondaryWhite : "#CCCCCC"}
          />
          <Text
            style={[
              styles.emptyText,
              { color: dark ? COLORS.secondaryWhite : "#757575" },
            ]}
          >
            Aucune activité ne correspond à vos filtres
          </Text>
          <TouchableOpacity
            style={styles.resetFiltersButton}
            onPress={resetFilters}
          >
            <Text style={styles.resetFiltersText}>
              Réinitialiser les filtres
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
    textAlign: "center",
  },
  resetFiltersButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  resetFiltersText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
