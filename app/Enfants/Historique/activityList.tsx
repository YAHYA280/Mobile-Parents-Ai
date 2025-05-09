// app/Enfants/Historique/activityList.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../../constants/theme";
import { useTheme } from "../../../theme/ThemeProvider";
import {
  CHILDREN_DATA,
  Child,
  Activity,
} from "../../../data/Enfants/CHILDREN_DATA";
import ActivityCard from "../../../components/cards/ActivityCard";
import EnhancedActivityFilter from "../../../components/filters/ActivityFilter";

// Define filter states interface
interface FilterState {
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  selectedAssistants: string[];
  selectedSubjects: string[];
  selectedDifficulties: string[];
}

const ActivityList = () => {
  const router = useRouter();
  const { dark, colors } = useTheme();
  const params = useLocalSearchParams();
  const childId = Number(params.childId);

  // States
  const [child, setChild] = useState<Child | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      startDate: null,
      endDate: null,
    },
    selectedAssistants: [],
    selectedSubjects: [],
    selectedDifficulties: [],
  });

  // Available filter options (will be populated from data)
  const [availableAssistants, setAvailableAssistants] = useState<string[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [availableDifficulties] = useState<string[]>([
    "Facile",
    "Moyen",
    "Difficile",
  ]);

  // Fetch data
  useEffect(() => {
    const fetchData = () => {
      try {
        setIsLoading(true);

        // Find child
        const foundChild = CHILDREN_DATA.find((c) => c.id === childId);
        if (!foundChild) {
          Alert.alert("Erreur", "Enfant non trouvé");
          router.back();
          return;
        }
        setChild(foundChild);

        // Get activities
        const childActivities = foundChild.activitesRecentes || [];
        setActivities(childActivities);
        setFilteredActivities(childActivities);

        // Extract unique filter options
        const assistants = Array.from(
          new Set(childActivities.map((a) => a.assistant).filter(Boolean))
        );
        const subjects = Array.from(
          new Set(childActivities.map((a) => a.matiere).filter(Boolean))
        );

        setAvailableAssistants(assistants as string[]);
        setAvailableSubjects(subjects as string[]);
      } catch (error) {
        console.error("Erreur:", error);
        Alert.alert("Erreur", "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [childId, router]);

  // Apply filters
  const applyFilters = () => {
    let result = [...activities];

    // Filter by date range
    if (filters.dateRange.startDate) {
      const startDate = new Date(filters.dateRange.startDate);
      result = result.filter((activity) => {
        const activityDate = new Date(activity.date);
        return activityDate >= startDate;
      });
    }

    if (filters.dateRange.endDate) {
      const endDate = new Date(filters.dateRange.endDate);
      endDate.setHours(23, 59, 59, 999); // End of day
      result = result.filter((activity) => {
        const activityDate = new Date(activity.date);
        return activityDate <= endDate;
      });
    }

    // Filter by assistants
    if (filters.selectedAssistants.length > 0) {
      result = result.filter((activity) =>
        filters.selectedAssistants.includes(activity.assistant || "")
      );
    }

    // Filter by subjects
    if (filters.selectedSubjects.length > 0) {
      result = result.filter((activity) =>
        filters.selectedSubjects.includes(activity.matiere || "")
      );
    }

    // Filter by difficulty
    if (filters.selectedDifficulties.length > 0) {
      result = result.filter(
        (activity) =>
          activity.difficulty &&
          filters.selectedDifficulties.includes(activity.difficulty)
      );
    }

    setFilteredActivities(result);
  };

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      dateRange: {
        startDate: null,
        endDate: null,
      },
      selectedAssistants: [],
      selectedSubjects: [],
      selectedDifficulties: [],
    });
    setFilteredActivities(activities);
  };

  // Navigate to activity details
  const handleActivityPress = (activityId: number) => {
    router.push(
      `/Enfants/Historique/historydetails?activityId=${activityId}&childId=${childId}`
    );
  };

  // Go back
  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text
            style={[
              styles.loadingText,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Chargement de l'historique...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={dark ? COLORS.white : COLORS.black}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: dark ? COLORS.white : COLORS.black },
          ]}
        >
          Historique d'activités
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Filters */}
      <EnhancedActivityFilter
        dateRange={filters.dateRange}
        selectedAssistants={filters.selectedAssistants}
        selectedSubjects={filters.selectedSubjects}
        selectedDifficulties={filters.selectedDifficulties}
        availableAssistants={availableAssistants}
        availableSubjects={availableSubjects}
        availableDifficulties={availableDifficulties}
        onFilterChange={handleFilterChange}
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
              onPress={() => handleActivityPress(item.id || 0)}
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
            color={dark ? COLORS.secondaryWhite : COLORS.gray3}
          />
          <Text
            style={[
              styles.emptyText,
              { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerRight: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
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
    color: COLORS.white,
    fontWeight: "bold",
  },
});

export default ActivityList;
