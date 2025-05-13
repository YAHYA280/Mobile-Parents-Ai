// app/Enfants/Historique/home.tsx - Type fixes

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Animated,
  StatusBar,
  Modal,
  ListRenderItemInfo,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import type { Child, Activity } from "../../../data/Enfants/CHILDREN_DATA";

import { COLORS } from "../../../constants/theme";
import { useTheme } from "../../../theme/ThemeProvider";
import { useActivityFilters } from "./filtre";
import {
  SearchBar,
  DateRangeIndicator,
  AssistantTypeFilters,
  FilterModal,
} from "./filtres";

interface HistoriqueActivitesProps {
  isTabComponent?: boolean;
  childData: Child;
}

const HistoriqueActivites: React.FC<HistoriqueActivitesProps> = ({
  isTabComponent = false,
  childData,
}) => {
  const router = useRouter();
  const { dark } = useTheme();
  const flatListRef = useRef<FlatList<Activity>>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // States
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmptyTips, setShowEmptyTips] = useState(false);

  // Constants
  const ACTIVITIES_PER_PAGE = 4;

  // Activity filters
  const {
    searchKeyword,
    activityDateRange,
    showActivityCalendar,
    activityCalendarMode,
    advancedFilters,
    filteredActivities,
    availableSubjects,
    availableChapters,
    availableExercises,
    setSearchKeyword,
    setActivityDateRange,
    toggleActivityCalendar,
    handleActivityDayPress,
    setAdvancedFilters,
    resetActivityFilters,
    getUniqueAssistantTypes,
    hasActiveFilters,
  } = useActivityFilters(childData?.activitesRecentes || []);

  // Load data and start animations
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, 500);

    return () => clearTimeout(timer);
  }, [fadeAnim, slideAnim]);

  // Get unique assistant types
  const uniqueAssistantTypes = getUniqueAssistantTypes();

  // Go back
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // Handle page change
  const handlePageChange = useCallback(
    (newPage: number) => {
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
    (activity: Activity) => {
      if (activity.id === undefined) {
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

  // Toggle advanced filters
  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("fr-FR", { month: "short" }),
      weekday: date.toLocaleDateString("fr-FR", { weekday: "short" }),
      full: date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
  };

  // Helper function to get color based on difficulty level or score
  const getScoreColor = (score: string) => {
    if (!score || !score.includes("/")) return COLORS.primary;

    const [achieved, total] = score.split("/").map(Number);
    const percentage = (achieved / total) * 100;

    if (percentage < 30) return "#FC4E00"; // Rouge
    if (percentage <= 50) return "#EBB016"; // Orange
    if (percentage <= 70) return "#F3BB00"; // Jaune
    return "#24D26D"; // Vert
  };

  // Render an activity item
  const renderActivityItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Activity>) => {
      const formattedDate = formatDate(item.date);
      const assistant = item.assistant || "Autre";
      const assistantColors: { [key: string]: [string, string] } = {
        "J'Apprends": ["#4CAF50", "#2E7D32"],
        Recherche: ["#2196F3", "#1565C0"],
        Accueil: ["#FF9800", "#F57C00"],
        Autre: ["#9C27B0", "#7B1FA2"],
      };
      const colors = assistantColors[assistant] || assistantColors.Autre;

      return (
        <TouchableOpacity
          onPress={() => viewActivityDetails(item)}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
            overflow: "hidden",
          }}
        >
          {/* Top Bar with Assistant Type */}
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              paddingVertical: 4,
              paddingHorizontal: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "500",
                color: "#FFFFFF",
              }}
            >
              {assistant}
            </Text>
          </LinearGradient>

          <View style={{ padding: 16 }}>
            {/* Date and Content */}
            <View style={{ flexDirection: "row" }}>
              {/* Date Column */}
              <View style={{ alignItems: "center", marginRight: 16 }}>
                <LinearGradient
                  colors={colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "bold",
                      color: "#FFFFFF",
                    }}
                  >
                    {formattedDate.day}
                  </Text>
                </LinearGradient>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: "#666666",
                    textTransform: "capitalize",
                  }}
                >
                  {formattedDate.month}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#9E9E9E",
                    textTransform: "capitalize",
                  }}
                >
                  {formattedDate.weekday}
                </Text>
              </View>

              {/* Content Column */}
              <View style={{ flex: 1 }}>
                {/* Activity Title */}
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#333333",
                    marginBottom: 10,
                    lineHeight: 22,
                  }}
                >
                  {item.activite}
                </Text>

                {/* Tags Section */}
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginBottom: 12,
                    gap: 8,
                  }}
                >
                  {/* Duration */}
                  <View
                    style={{
                      backgroundColor: "rgba(0,0,0,0.05)",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 12,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={"clock" as IconProp}
                      size={12}
                      color={"#666666"}
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={{
                        color: "#666666",
                        fontSize: 12,
                      }}
                    >
                      {item.duree}
                    </Text>
                  </View>

                  {/* Score if available */}
                  {item.score && (
                    <View
                      style={{
                        backgroundColor: `${getScoreColor(item.score)}20`,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 12,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={"star" as IconProp}
                        size={12}
                        color={getScoreColor(item.score)}
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        style={{
                          color: getScoreColor(item.score),
                          fontSize: 12,
                          fontWeight: "600",
                        }}
                      >
                        {item.score}
                      </Text>
                    </View>
                  )}

                  {/* Subject if available */}
                  {item.matiere && (
                    <View
                      style={{
                        backgroundColor: "rgba(0,0,0,0.05)",
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 12,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={"book" as IconProp}
                        size={12}
                        color={"#666666"}
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        style={{
                          color: "#666666",
                          fontSize: 12,
                        }}
                      >
                        {item.matiere}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Comments if any */}
                {item.commentaires && (
                  <View
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.03)",
                      padding: 12,
                      borderRadius: 8,
                      marginBottom: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#666666",
                        lineHeight: 18,
                      }}
                    >
                      {item.commentaires.length > 100
                        ? `${item.commentaires.substring(0, 100)}...`
                        : item.commentaires}
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
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: `${colors[0]}15`,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 16,
                    }}
                    onPress={() => viewActivityDetails(item)}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "500",
                        color: colors[0],
                        marginRight: 4,
                      }}
                    >
                      Voir les détails
                    </Text>
                    <FontAwesomeIcon
                      icon={"chevron-right" as IconProp}
                      color={colors[0]}
                      size={12}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [viewActivityDetails]
  );

  // Calculate pagination
  const totalActivities = filteredActivities?.length || 0;
  const totalPages = Math.ceil(totalActivities / ACTIVITIES_PER_PAGE);
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
          padding: 16,
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "rgba(0,0,0,0.05)",
          elevation: 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }}
      >
        <TouchableOpacity
          onPress={handleBack}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "rgba(0,0,0,0.05)",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 16,
          }}
        >
          <FontAwesomeIcon
            icon={"arrow-left" as IconProp}
            size={18}
            color={COLORS.black}
          />
        </TouchableOpacity>

        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: COLORS.black,
            }}
          >
            Historique d'activités
          </Text>
          {childData && (
            <Text
              style={{
                fontSize: 14,
                color: "#666666",
              }}
            >
              {childData.name} • {childData.classe}
            </Text>
          )}
        </View>
      </View>
    );
  };

  // Empty activities view
  const renderEmptyActivities = () => (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
        backgroundColor: "rgba(0,0,0,0.02)",
        borderRadius: 16,
        marginBottom: 20,
      }}
    >
      <Text
        style={{
          color: COLORS.black,
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        Aucune activité trouvée
      </Text>
      <Text
        style={{
          color: COLORS.gray3,
          fontSize: 15,
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        {hasActiveFilters()
          ? "Essayez de modifier vos filtres pour voir plus d'activités."
          : "Il n'y a pas encore d'activités à afficher pour cet enfant."}
      </Text>

      {hasActiveFilters() && (
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 25,
            elevation: 2,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}
          onPress={resetActivityFilters}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
            Réinitialiser les filtres
          </Text>
        </TouchableOpacity>
      )}

      {!hasActiveFilters() && (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 5,
          }}
          onPress={() => setShowEmptyTips(true)}
        >
          <FontAwesomeIcon
            icon={"lightbulb" as IconProp}
            size={16}
            color={COLORS.primary}
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: COLORS.primary, fontWeight: "500" }}>
            Conseils pour démarrer
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Empty tips modal
  const renderEmptyTipsModal = () => (
    <Modal
      visible={showEmptyTips}
      transparent
      animationType="fade"
      onRequestClose={() => setShowEmptyTips(false)}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "90%",
            maxHeight: "80%",
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 20,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: COLORS.black,
              }}
            >
              Conseils pour démarrer
            </Text>
            <TouchableOpacity
              onPress={() => setShowEmptyTips(false)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: dark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon
                icon={"times" as IconProp}
                size={16}
                color={COLORS.black}
              />
            </TouchableOpacity>
          </View>

          <FlatList
            data={[
              {
                id: "1",
                title: "Encouragez l'utilisation des assistants",
                description:
                  "Les assistants intelligents proposent des exercices adaptés au niveau de l'enfant. Plus ils sont utilisés, plus l'historique sera riche.",
                icon: "robot" as IconProp,
              },
              {
                id: "2",
                title: "Planifiez des sessions régulières",
                description:
                  "Établissez un calendrier d'apprentissage régulier pour maintenir l'engagement et voir les progrès dans l'historique.",
                icon: "calendar-alt" as IconProp,
              },
              {
                id: "3",
                title: "Explorez différentes matières",
                description:
                  "Encouragez l'enfant à explorer diverses matières pour développer un apprentissage équilibré et varié.",
                icon: "book" as IconProp,
              },
              {
                id: "4",
                title: "Suivez les progrès régulièrement",
                description:
                  "Consultez régulièrement l'historique pour identifier les forces et les points à améliorer.",
                icon: "chart-line" as IconProp,
              },
            ]}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 16,
                  backgroundColor: "rgba(0,0,0,0.02)",
                  padding: 16,
                  borderRadius: 12,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: COLORS.primary,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 16,
                  }}
                >
                  <FontAwesomeIcon icon={item.icon} size={20} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: COLORS.black,
                      marginBottom: 6,
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.gray3,
                      lineHeight: 20,
                    }}
                  >
                    {item.description}
                  </Text>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />

          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: "center",
              marginTop: 10,
              elevation: 2,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            }}
            onPress={() => setShowEmptyTips(false)}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              Compris
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Main content
  // Fixed renderContent function to ensure all text is properly wrapped
  const renderContent = () => (
    <Animated.View
      style={{
        flex: 1,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      {/* Search and Filter Bar */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <SearchBar
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          activityDateRange={activityDateRange}
          toggleActivityCalendar={() => toggleActivityCalendar("start")}
          resetAllFilters={resetActivityFilters}
          hasFilters={hasActiveFilters()}
        />

        {/* Date Range Indicator */}
        {(activityDateRange.startDate || activityDateRange.endDate) && (
          <DateRangeIndicator
            activityDateRange={activityDateRange}
            setActivityDateRange={(range: {
              startDate: string | null;
              endDate: string | null;
            }) => {
              setActivityDateRange(range);
            }}
          />
        )}

        {/* Assistant Type Filters - ONLY KEEPING THIS FILTER */}
        {uniqueAssistantTypes.length > 0 && (
          <AssistantTypeFilters
            uniqueAssistantTypes={uniqueAssistantTypes}
            selectedAssistantTypes={advancedFilters.selectedAssistants}
            setSelectedAssistantTypes={(assistantsUpdater) => {
              if (typeof assistantsUpdater === "function") {
                const newAssistants = assistantsUpdater(
                  advancedFilters.selectedAssistants
                );
                setAdvancedFilters({ selectedAssistants: newAssistants });
              } else {
                setAdvancedFilters({ selectedAssistants: assistantsUpdater });
              }
            }}
          />
        )}

        {/* All other filters have been removed */}
      </View>

      {/* Activities List */}
      <View style={{ flex: 1, paddingHorizontal: 16, marginTop: 16 }}>
        {isLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.02)",
              borderRadius: 16,
              padding: 30,
              marginBottom: 20,
            }}
          >
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text
              style={{
                marginTop: 16,
                color: COLORS.black,
                fontSize: 16,
              }}
            >
              Chargement des activités...
            </Text>
          </View>
        ) : (
          <>
            {/* Results Counter */}
            {hasActiveFilters() && (
              <View
                style={{
                  backgroundColor: "rgba(255, 142, 105, 0.1)",
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: COLORS.primary,
                    fontWeight: "500",
                    fontSize: 14,
                  }}
                >
                  {filteredActivities.length}{" "}
                  {filteredActivities.length > 1
                    ? "activités trouvées"
                    : "activité trouvée"}
                </Text>
                <TouchableOpacity onPress={resetActivityFilters}>
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontWeight: "600",
                      fontSize: 14,
                    }}
                  >
                    Réinitialiser
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <FlatList
              ref={flatListRef}
              data={currentActivities}
              renderItem={renderActivityItem}
              keyExtractor={(item, index) => `activity-${item.id || index}`}
              contentContainerStyle={{
                paddingBottom: isTabComponent ? 100 : 20,
              }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderEmptyActivities}
            />

            {/* Pagination Controls - Only show if there are activities and multiple pages */}
            {totalActivities > 0 && totalPages > 1 && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 16,
                  backgroundColor: "transparent",
                }}
              >
                {/* Previous Page Button */}
                <TouchableOpacity
                  style={{
                    width: 44,
                    height: 44,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 22,
                    backgroundColor:
                      currentPage === 1
                        ? "rgba(0, 0, 0, 0.05)"
                        : "rgba(255, 142, 105, 0.1)",
                    opacity: currentPage === 1 ? 0.5 : 1,
                  }}
                  onPress={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <FontAwesomeIcon
                    icon={"chevron-left" as IconProp}
                    color={currentPage === 1 ? "#999999" : COLORS.primary}
                    size={18}
                  />
                </TouchableOpacity>

                {/* Page Number Indicator */}
                <View
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 25,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      color: COLORS.black,
                    }}
                  >
                    {`${currentPage} / ${totalPages}`}
                  </Text>
                </View>

                {/* Next Page Button */}
                <TouchableOpacity
                  style={{
                    width: 44,
                    height: 44,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 22,
                    backgroundColor:
                      currentPage === totalPages
                        ? "rgba(0, 0, 0, 0.05)"
                        : "rgba(255, 142, 105, 0.1)",
                    opacity: currentPage === totalPages ? 0.5 : 1,
                  }}
                  onPress={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  <FontAwesomeIcon
                    icon={"chevron-right" as IconProp}
                    color={
                      currentPage === totalPages ? "#999999" : COLORS.primary
                    }
                    size={18}
                  />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>

      {/* Use the fixed FilterModal component here */}
      <FilterModal
        showActivityCalendar={showActivityCalendar}
        toggleActivityCalendar={toggleActivityCalendar}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        uniqueAssistantTypes={uniqueAssistantTypes}
        selectedAssistantTypes={advancedFilters.selectedAssistants}
        setSelectedAssistantTypes={(assistantsUpdater) => {
          if (typeof assistantsUpdater === "function") {
            const newAssistants = assistantsUpdater(
              advancedFilters.selectedAssistants
            );
            setAdvancedFilters({ selectedAssistants: newAssistants });
          } else {
            setAdvancedFilters({ selectedAssistants: assistantsUpdater });
          }
        }}
        activityCalendarMode={activityCalendarMode}
        activityDateRange={activityDateRange}
        handleActivityDayPress={handleActivityDayPress}
        resetAllFilters={resetActivityFilters}
        availableSubjects={[]}
        availableChapters={[]}
        availableExercises={[]}
        advancedFilters={advancedFilters}
        setAdvancedFilters={setAdvancedFilters}
      />

      {/* Empty Tips Modal */}
      {renderEmptyTipsModal()}
    </Animated.View>
  );

  // Component layout varies based on isTabComponent
  if (isTabComponent) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F8F8F8",
        }}
      >
        {renderContent()}
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}
    >
      <StatusBar barStyle={"dark-content"} backgroundColor={"#FFFFFF"} />
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

export default HistoriqueActivites;
