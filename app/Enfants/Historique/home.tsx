// app/Enfants/Historique/home.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MotiView } from "moti";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TYPOGRAPHY, COLORS, SPACING, RADIUS } from "@/constants/theme";
import { CHILDREN_DATA, enhanceActivity } from "@/data/Enfants/CHILDREN_DATA";
import ActivityCard from "@/components/cards/ActivityCard";
import ActivityFilter from "@/components/filters/ActivityFilter";

const HistoriqueActivites = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const childId =
    typeof params.childId === "string" ? parseInt(params.childId, 10) : 0;

  const [child, setChild] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);

  // Filter state
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [selectedAssistants, setSelectedAssistants] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const activitiesPerPage = 5;

  // Get child data and activities
  useEffect(() => {
    const foundChild = CHILDREN_DATA.find((c) => c.id === childId);
    if (foundChild) {
      setChild(foundChild);

      // Enhance activities with additional data
      const enhancedActivities = foundChild.activitesRecentes.map((activity) =>
        enhanceActivity(activity)
      );

      setActivities(enhancedActivities);
      setFilteredActivities(enhancedActivities);
    }
  }, [childId]);

  // Apply filters effect
  useEffect(() => {
    if (!activities.length) return;

    let filtered = [...activities];

    // Filter by date range
    if (dateRange.startDate) {
      filtered = filtered.filter((activity) => {
        const activityDate = new Date(activity.date);
        const startDate = new Date(dateRange.startDate!);
        return activityDate >= startDate;
      });
    }

    if (dateRange.endDate) {
      filtered = filtered.filter((activity) => {
        const activityDate = new Date(activity.date);
        const endDate = new Date(dateRange.endDate!);
        endDate.setDate(endDate.getDate() + 1); // Include end date
        return activityDate < endDate;
      });
    }

    // Filter by assistants
    if (selectedAssistants.length > 0) {
      filtered = filtered.filter(
        (activity) =>
          activity.assistant && selectedAssistants.includes(activity.assistant)
      );
    }

    // Filter by subjects
    if (selectedSubjects.length > 0) {
      filtered = filtered.filter(
        (activity) =>
          activity.matiere && selectedSubjects.includes(activity.matiere)
      );
    }

    setFilteredActivities(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [activities, dateRange, selectedAssistants, selectedSubjects]);

  const handleBack = () => {
    router.back();
  };

  // Handle activity press
  const handleActivityPress = (activityId: number) => {
    router.push(
      `/Enfants/Historique/historydetails?activityId=${activityId}&childId=${childId}`
    );
  };

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: any) => {
    switch (filterType) {
      case "dateRange":
        setDateRange(value);
        break;
      case "assistants":
        setSelectedAssistants(value);
        break;
      case "subjects":
        setSelectedSubjects(value);
        break;
      default:
        break;
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setDateRange({ startDate: null, endDate: null });
    setSelectedAssistants([]);
    setSelectedSubjects([]);
  };

  // Get unique assistants from activities
  const getAvailableAssistants = () => {
    const assistants = activities
      .map((activity) => activity.assistant)
      .filter((value, index, self) => value && self.indexOf(value) === index);
    return assistants;
  };

  // Get unique subjects from activities
  const getAvailableSubjects = () => {
    const subjects = activities
      .map((activity) => activity.matiere)
      .filter((value, index, self) => value && self.indexOf(value) === index);
    return subjects;
  };

  // Get paginated activities
  const getPaginatedActivities = () => {
    const startIndex = (currentPage - 1) * activitiesPerPage;
    const endIndex = startIndex + activitiesPerPage;
    return filteredActivities.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredActivities.length / activitiesPerPage);

  // Pagination controls
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (!child) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 300 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historique des activités</Text>
      </MotiView>

      <View style={styles.childInfoHeader}>
        <Text style={styles.childName}>{child.name}</Text>
        <Text style={styles.childDetails}>
          {child.classe} • {child.age} ans
        </Text>
      </View>

      <ActivityFilter
        dateRange={dateRange}
        selectedAssistants={selectedAssistants}
        selectedSubjects={selectedSubjects}
        availableAssistants={getAvailableAssistants()}
        availableSubjects={getAvailableSubjects()}
        onFilterChange={handleFilterChange}
        onResetFilters={resetFilters}
      />

      <View style={styles.content}>
        {filteredActivities.length === 0 ? (
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 18 }}
            style={styles.emptyStateContainer}
          >
            <Ionicons name="search" size={60} color="#CCCCCC" />
            <Text style={styles.emptyStateTitle}>Aucune activité trouvée</Text>
            <Text style={styles.emptyStateText}>
              Aucune activité ne correspond à vos critères de recherche.
            </Text>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetButtonText}>
                Réinitialiser les filtres
              </Text>
            </TouchableOpacity>
          </MotiView>
        ) : (
          <FlatList
            data={getPaginatedActivities()}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <ActivityCard
                activity={item}
                onPress={() => handleActivityPress(item.id)}
                index={index}
              />
            )}
            contentContainerStyle={styles.activitiesList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Pagination */}
      {filteredActivities.length > 0 && totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[
              styles.paginationButton,
              currentPage === 1 && styles.paginationButtonDisabled,
            ]}
            onPress={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={currentPage === 1 ? "#CCCCCC" : COLORS.primary}
            />
          </TouchableOpacity>

          <Text style={styles.paginationText}>
            Page {currentPage} sur {totalPages}
          </Text>

          <TouchableOpacity
            style={[
              styles.paginationButton,
              currentPage === totalPages && styles.paginationButtonDisabled,
            ]}
            onPress={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color={currentPage === totalPages ? "#CCCCCC" : COLORS.primary}
            />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...TYPOGRAPHY.h3,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: "#333",
  },
  childInfoHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  childName: {
    ...TYPOGRAPHY.h3,
    color: "#333",
  },
  childDetails: {
    ...TYPOGRAPHY.body2,
    color: "#666",
  },
  content: {
    flex: 1,
  },
  activitiesList: {
    paddingBottom: 16,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    marginTop: 40,
  },
  emptyStateTitle: {
    ...TYPOGRAPHY.h3,
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    ...TYPOGRAPHY.body1,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.xxl,
  },
  resetButtonText: {
    ...TYPOGRAPHY.button,
    color: "#FFFFFF",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  paginationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationText: {
    ...TYPOGRAPHY.body1,
    color: "#666",
    marginHorizontal: 16,
  },
});

export default HistoriqueActivites;
