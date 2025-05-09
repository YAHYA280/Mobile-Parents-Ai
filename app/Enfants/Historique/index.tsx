// app/Enfants/Historique/index.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { CHILDREN_DATA } from "@/data/Enfants/CHILDREN_DATA";

// Import the ActivityFilter component we'll use later
// import ActivityFilter from "@/components/activities/ActivityFilters";

export default function AllActivitiesScreen() {
  const router = useRouter();
  const { childId } = useLocalSearchParams();
  const childIdNum = Number(childId);

  const [child, setChild] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    dateRange: {
      startDate: null,
      endDate: null,
    },
    selectedAssistants: [],
    selectedSubjects: [],
    selectedDifficulties: [],
  });

  useEffect(() => {
    const fetchData = () => {
      try {
        setIsLoading(true);

        // Find child
        const foundChild = CHILDREN_DATA.find((c) => c.id === childIdNum);
        if (!foundChild) {
          console.error("Child not found");
          router.back();
          return;
        }

        setChild(foundChild);
        setActivities(foundChild.activitesRecentes);
        setFilteredActivities(foundChild.activitesRecentes);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [childIdNum]);

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

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
    router.push(`/Enfants/Historique/${activityId}?childId=${childIdNum}`);
  };

  // Go back
  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement de l'historique...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historique d'activités</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Filters - to be added as a component later */}
      {/* <ActivityFilter
        dateRange={filters.dateRange}
        selectedAssistants={filters.selectedAssistants}
        selectedSubjects={filters.selectedSubjects}
        selectedDifficulties={filters.selectedDifficulties}
        availableAssistants={[]}
        availableSubjects={[]}
        availableDifficulties={[]}
        onFilterChange={handleFilterChange}
        onResetFilters={resetFilters}
        onApplyFilters={applyFilters}
      /> */}

      {/* Activity List */}
      {filteredActivities.length > 0 ? (
        <FlatList
          data={filteredActivities}
          keyExtractor={(item) => `activity-${item.id}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.activityCard}
              onPress={() => handleActivityPress(item.id)}
            >
              <View style={styles.activityHeader}>
                <Text style={styles.activityTitle}>{item.activite}</Text>
                <Text style={styles.activityDate}>
                  {new Date(item.date).toLocaleDateString("fr-FR")}
                </Text>
              </View>

              <View style={styles.activityDetails}>
                {item.matiere && (
                  <View style={styles.detailItem}>
                    <Ionicons name="book-outline" size={16} color="#757575" />
                    <Text style={styles.detailText}>{item.matiere}</Text>
                  </View>
                )}

                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={16} color="#757575" />
                  <Text style={styles.detailText}>{item.duree}</Text>
                </View>

                {item.assistant && (
                  <View style={styles.detailItem}>
                    <Ionicons name="person-outline" size={16} color="#757575" />
                    <Text style={styles.detailText}>{item.assistant}</Text>
                  </View>
                )}
              </View>

              <View style={styles.activityFooter}>
                <Text style={styles.viewDetailsText}>Voir les détails</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={COLORS.primary}
                />
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={64} color="#CCCCCC" />
          <Text style={styles.emptyText}>
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
    backgroundColor: "#F8F8F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
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
    color: "#333333",
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
    color: "#333333",
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
    color: "#757575",
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
  activityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    flex: 1,
    marginRight: 8,
  },
  activityDate: {
    fontSize: 12,
    color: "#757575",
  },
  activityDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#757575",
    marginLeft: 8,
  },
  activityFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  viewDetailsText: {
    fontSize: 14,
    color: COLORS.primary,
    marginRight: 4,
  },
});
