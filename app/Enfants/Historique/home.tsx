// Type fixes for app/Enfants/Historique/home.tsx

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  ListRenderItemInfo,
  ColorValue,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowLeft,
  faArrowRight,
  faStar,
  faClock,
  faSearch,
  faFilter,
  faCalendar,
  faTimesCircle,
  faChevronRight,
  faHourglassEmpty,
} from "@fortawesome/free-solid-svg-icons";

import { COLORS } from "../../../constants/theme";
import { enhanceActivity } from "../../../data/Enfants/CHILDREN_DATA";
import type { Child, Activity } from "../../../data/Enfants/CHILDREN_DATA";

// Interface for date range
interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

// Interface for activity theme with proper ColorValue and IconProp types
interface ActivityTheme {
  colors: readonly [ColorValue, ColorValue];
  icon: IconProp;
}

// Interface for theme result
interface ThemeResult {
  assistant: ActivityTheme;
  subject: ActivityTheme;
}

// Helper to get activity theme colors
const getActivityTheme = (activity: Activity): ThemeResult => {
  // Default colors for various activities
  const assistantThemes: Record<string, ActivityTheme> = {
    "J'Apprends": {
      colors: ["#4CAF50", "#2E7D32"] as readonly [ColorValue, ColorValue],
      icon: "chalkboard-teacher" as IconProp,
    },
    Recherche: {
      colors: ["#2196F3", "#1565C0"] as readonly [ColorValue, ColorValue],
      icon: "search" as IconProp,
    },
    Accueil: {
      colors: ["#FF9800", "#F57C00"] as readonly [ColorValue, ColorValue],
      icon: "home" as IconProp,
    },
    Autre: {
      colors: ["#9C27B0", "#7B1FA2"] as readonly [ColorValue, ColorValue],
      icon: "robot" as IconProp,
    },
  };

  const subjectThemes: Record<string, ActivityTheme> = {
    Mathématiques: {
      colors: ["#E91E63", "#C2185B"] as readonly [ColorValue, ColorValue],
      icon: "calculator" as IconProp,
    },
    Français: {
      colors: ["#3F51B5", "#303F9F"] as readonly [ColorValue, ColorValue],
      icon: "book" as IconProp,
    },
    Sciences: {
      colors: ["#009688", "#00796B"] as readonly [ColorValue, ColorValue],
      icon: "flask" as IconProp,
    },
    Histoire: {
      colors: ["#795548", "#5D4037"] as readonly [ColorValue, ColorValue],
      icon: "landmark" as IconProp,
    },
    Anglais: {
      colors: ["#673AB7", "#512DA8"] as readonly [ColorValue, ColorValue],
      icon: "language" as IconProp,
    },
    Autre: {
      colors: ["#607D8B", "#455A64"] as readonly [ColorValue, ColorValue],
      icon: "book-open" as IconProp,
    },
  };

  // Determine assistant type
  let assistantName = "Autre";
  if (activity.activite.toLowerCase().includes("j'apprends")) {
    assistantName = "J'Apprends";
  } else if (activity.activite.toLowerCase().includes("recherche")) {
    assistantName = "Recherche";
  } else if (activity.activite.toLowerCase().includes("accueil")) {
    assistantName = "Accueil";
  }

  // Determine subject
  let subjectName = "Autre";
  const activityLower = activity.activite.toLowerCase();
  if (
    activityLower.includes("mathématiques") ||
    activityLower.includes("géométrie")
  ) {
    subjectName = "Mathématiques";
  } else if (
    activityLower.includes("français") ||
    activityLower.includes("lecture") ||
    activityLower.includes("vocabulaire") ||
    activityLower.includes("conjugaison") ||
    activityLower.includes("grammaire")
  ) {
    subjectName = "Français";
  } else if (
    activityLower.includes("sciences") ||
    activityLower.includes("écologie")
  ) {
    subjectName = "Sciences";
  } else if (activityLower.includes("histoire")) {
    subjectName = "Histoire";
  } else if (activityLower.includes("anglais")) {
    subjectName = "Anglais";
  }

  return {
    assistant: assistantThemes[assistantName] || assistantThemes.Autre,
    subject: subjectThemes[subjectName] || subjectThemes.Autre,
  };
};

// Type guard to check if activity has a valid ID
const isValidActivity = (
  activity: Activity
): activity is Activity & { id: number | string } => {
  return activity.id !== undefined && activity.id !== null;
};

// Props interface for component
interface HistoriqueActivitesProps {
  isTabComponent?: boolean;
  childData: Child;
}

// Main Component
const HistoriqueActivites: React.FC<HistoriqueActivitesProps> = ({
  isTabComponent = false,
  childData,
}) => {
  const router = useRouter();
  const flatListRef = useRef<FlatList<Activity>>(null);

  // Base states
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Date filter states
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  // Constants
  const ACTIVITIES_PER_PAGE = 3;

  // Initialize activities from childData
  useEffect(() => {
    if (childData?.activitesRecentes) {
      setIsLoading(true);

      // Map activities and enhance them
      const enhancedActivities = childData.activitesRecentes.map((activity) =>
        enhanceActivity(activity)
      );

      setActivities(enhancedActivities);
      setFilteredActivities(enhancedActivities);
      setIsLoading(false);
    }
  }, [childData]);

  // Apply filters when search or date range changes
  useEffect(() => {
    if (!activities.length) return;

    let result = [...activities];

    // Apply search filter
    if (searchKeyword.trim() !== "") {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(
        (activity) =>
          activity.activite.toLowerCase().includes(keyword) ||
          (activity.matiere && activity.matiere.toLowerCase().includes(keyword))
      );
    }

    // Apply date range filter
    if (dateRange.startDate && dateRange.endDate) {
      result = result.filter((activity) => {
        const activityDate = new Date(activity.date);
        const startDate = new Date(dateRange.startDate as string);
        const endDate = new Date(dateRange.endDate as string);
        endDate.setHours(23, 59, 59, 999); // Include the entire end date

        return activityDate >= startDate && activityDate <= endDate;
      });
    } else if (dateRange.startDate) {
      result = result.filter((activity) => {
        const activityDate = new Date(activity.date);
        const startDate = new Date(dateRange.startDate as string);

        return activityDate >= startDate;
      });
    } else if (dateRange.endDate) {
      result = result.filter((activity) => {
        const activityDate = new Date(activity.date);
        const endDate = new Date(dateRange.endDate as string);
        endDate.setHours(23, 59, 59, 999); // Include the entire end date

        return activityDate <= endDate;
      });
    }

    setFilteredActivities(result);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchKeyword, dateRange, activities]);

  // Reset filters
  const resetFilters = useCallback((): void => {
    setSearchKeyword("");
    setDateRange({ startDate: null, endDate: null });
  }, []);

  // Go back
  const handleBack = useCallback((): void => {
    router.back();
  }, [router]);

  // Handle page change
  const handlePageChange = useCallback(
    (newPage: number): void => {
      if (newPage === currentPage) return;

      setCurrentPage(newPage);

      // Scroll to top when page changes
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        }
      }, 100);
    },
    [currentPage]
  );

  // View activity details
  const viewActivityDetails = useCallback(
    (activity: Activity): void => {
      // Use the type guard to check for valid ID
      if (!isValidActivity(activity)) {
        console.warn("Activity missing ID, cannot navigate to details");
        return;
      }

      router.push({
        pathname: "/Enfants/Historique/historydetails",
        params: {
          activityId: activity.id.toString(),
          childId: childData?.id?.toString() || "0",
        },
      });
    },
    [router, childData]
  );

  // Render an activity item
  const renderActivityItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Activity>) => {
      const theme = getActivityTheme(item);
      const dateObj = new Date(item.date);
      const formattedDate = dateObj.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      });
      const dayName = dateObj.toLocaleDateString("fr-FR", { weekday: "short" });

      return (
        <TouchableOpacity
          onPress={() => viewActivityDetails(item)}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            marginBottom: 16,
            padding: 16,
            flexDirection: "row",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          {/* Date Column */}
          <View style={{ marginRight: 16, alignItems: "center" }}>
            <LinearGradient
              colors={theme.assistant.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "#FFFFFF" }}
              >
                {formattedDate.split(" ")[0]}
              </Text>
            </LinearGradient>
            <Text style={{ fontSize: 12, fontWeight: "500", color: "#666666" }}>
              {formattedDate.split(" ")[1]}
            </Text>
            <Text style={{ fontSize: 12, color: "#9E9E9E" }}>{dayName}</Text>
          </View>

          {/* Content Column */}
          <View style={{ flex: 1 }}>
            {/* Subject Badge */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <LinearGradient
                colors={theme.subject.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                  marginRight: 8,
                }}
              >
                <FontAwesomeIcon
                  icon={theme.subject.icon}
                  color="#FFFFFF"
                  size={12}
                />
              </LinearGradient>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: "#333333",
                  flex: 1,
                }}
              >
                {item.activite}
              </Text>
            </View>

            {/* Duration and Score */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <FontAwesomeIcon
                icon={faClock as IconProp}
                color={COLORS.primary}
                size={14}
                style={{ marginRight: 6 }}
              />
              <Text style={{ fontSize: 14, color: "#666666" }}>
                {item.duree}
              </Text>

              {item.score && (
                <>
                  <View
                    style={{
                      width: 1,
                      height: 12,
                      backgroundColor: "#E0E0E0",
                      marginHorizontal: 8,
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faStar as IconProp}
                    color={COLORS.primary}
                    size={14}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: COLORS.primary,
                    }}
                  >
                    {item.score}
                  </Text>
                </>
              )}
            </View>

            {/* Comments if any */}
            {item.commentaires && (
              <View
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.03)",
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 14, color: "#666666" }}>
                  {item.commentaires}
                </Text>
              </View>
            )}

            {/* View Details Button */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: COLORS.primary,
                  marginRight: 6,
                }}
              >
                Voir les détails
              </Text>
              <FontAwesomeIcon
                icon={faChevronRight as IconProp}
                color={COLORS.primary}
                size={12}
              />
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [viewActivityDetails]
  );

  // Calculate pagination
  const totalPages = Math.ceil(
    (filteredActivities?.length || 0) / ACTIVITIES_PER_PAGE
  );
  const currentActivities = filteredActivities.slice(
    (currentPage - 1) * ACTIVITIES_PER_PAGE,
    currentPage * ACTIVITIES_PER_PAGE
  );

  // Header - not shown in tab mode
  const renderHeader = () => {
    if (isTabComponent) return null;

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <TouchableOpacity
          onPress={handleBack}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.05)",
            marginRight: 16,
          }}
        >
          <FontAwesomeIcon
            icon={faArrowLeft as IconProp}
            size={20}
            color="#333333"
          />
        </TouchableOpacity>

        <View>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#333333" }}>
            Historique d'activités
          </Text>
          {childData && (
            <Text style={{ fontSize: 14, color: "#666666" }}>
              {childData.name} • {childData.classe}
            </Text>
          )}
        </View>
      </View>
    );
  };

  // Main content
  const renderContent = () => (
    <View style={{ flex: 1 }}>
      {/* Search and Filter Bar */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 12,
          padding: 16,
          marginHorizontal: 16,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {/* Search Box */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.05)",
            borderRadius: 8,
            paddingHorizontal: 12,
            marginBottom: 12,
          }}
        >
          <FontAwesomeIcon
            icon={faSearch as IconProp}
            color="#9E9E9E"
            size={16}
          />
          <TextInput
            placeholder="Rechercher une activité..."
            value={searchKeyword}
            onChangeText={setSearchKeyword}
            style={{
              flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 12,
              color: "#333333",
            }}
          />
          {searchKeyword ? (
            <TouchableOpacity onPress={() => setSearchKeyword("")}>
              <FontAwesomeIcon
                icon={faTimesCircle as IconProp}
                color="#9E9E9E"
                size={16}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Buttons */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.05)",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              marginRight: 8,
              flex: 1,
            }}
          >
            <FontAwesomeIcon
              icon={faCalendar as IconProp}
              color="#9E9E9E"
              size={16}
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: "#666666", fontSize: 14 }}>
              Filtrer par date
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.05)",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              marginLeft: 8,
              flex: 1,
            }}
          >
            <FontAwesomeIcon
              icon={faFilter as IconProp}
              color="#9E9E9E"
              size={16}
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: "#666666", fontSize: 14 }}>
              Plus de filtres
            </Text>
          </TouchableOpacity>
        </View>

        {/* Active Filters - show only if filters are applied */}
        {(searchKeyword || dateRange.startDate || dateRange.endDate) && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "rgba(255, 142, 105, 0.1)",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            <Text style={{ color: COLORS.primary, fontSize: 14 }}>
              {filteredActivities.length} résultat(s) trouvé(s)
            </Text>
            <TouchableOpacity onPress={resetFilters}>
              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Réinitialiser
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Activities List */}
      <View
        style={{
          flex: 1,
          marginHorizontal: 16,
          backgroundColor: isLoading ? "transparent" : "#FFFFFF",
          borderRadius: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={{ marginTop: 16, color: "#666666" }}>
              Chargement des activités...
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              ref={flatListRef}
              data={currentActivities}
              renderItem={renderActivityItem}
              keyExtractor={(item) => `activity-${item.id || "unknown"}`}
              contentContainerStyle={{
                padding: 16,
                paddingBottom: isTabComponent ? 80 : 16,
              }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 30,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faHourglassEmpty as IconProp}
                    size={50}
                    color="#CCCCCC"
                  />
                  <Text
                    style={{ marginTop: 16, color: "#666666", fontSize: 16 }}
                  >
                    Aucune activité trouvée
                  </Text>
                </View>
              )}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderTopWidth: 1,
                  borderTopColor: "rgba(0, 0, 0, 0.05)",
                  backgroundColor: "#FFFFFF",
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                }}
              >
                {/* Previous Page Button */}
                <TouchableOpacity
                  style={{
                    width: 40,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 20,
                    backgroundColor:
                      currentPage === 1
                        ? "rgba(0, 0, 0, 0.05)"
                        : "rgba(255, 142, 105, 0.1)",
                  }}
                  onPress={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <FontAwesomeIcon
                    icon={faArrowLeft as IconProp}
                    color={currentPage === 1 ? "#CCCCCC" : COLORS.primary}
                    size={16}
                  />
                </TouchableOpacity>

                {/* Page Number Indicator */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 16,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#333333",
                    }}
                  >
                    {currentPage} / {totalPages}
                  </Text>
                </View>

                {/* Next Page Button */}
                <TouchableOpacity
                  style={{
                    width: 40,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 20,
                    backgroundColor:
                      currentPage === totalPages
                        ? "rgba(0, 0, 0, 0.05)"
                        : "rgba(255, 142, 105, 0.1)",
                  }}
                  onPress={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  <FontAwesomeIcon
                    icon={faArrowRight as IconProp}
                    color={
                      currentPage === totalPages ? "#CCCCCC" : COLORS.primary
                    }
                    size={16}
                  />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>

      {/* Bottom space for tab mode */}
      {isTabComponent && <View style={{ height: 80 }} />}
    </View>
  );

  // Component layout varies based on isTabComponent
  if (isTabComponent) {
    return <>{renderContent()}</>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

export default HistoriqueActivites;
