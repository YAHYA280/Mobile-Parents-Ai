// app/Enfants/Performance/components/PerformanceFilterModal.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTimesCircle,
  faCalendarAlt,
  faChartLine,
  faCheck,
  faArrowRight,
  faSearch,
  faRobot,
  faBook,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

import { COLORS } from "../../../../constants/theme";
import { Child } from "../../../../data/Enfants/CHILDREN_DATA";

interface PerformanceFilterModalProps {
  showFilterModal: boolean;
  toggleFilterModal: () => void;
  activityDateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  showActivityCalendar: boolean;
  activityCalendarMode: "start" | "end";
  advancedFilters: {
    selectedSubjects: string[];
    selectedChapters: string[];
    selectedExercises: string[];
    selectedAssistants: string[];
    scoreRange?: {
      min: number;
      max: number;
    };
  };
  toggleActivityCalendar: (mode: "start" | "end") => void;
  handleActivityDayPress: (day: any) => void;
  setAdvancedFilters: (filters: any) => void;
  resetActivityFilters: () => void;
  childData: Child;
}

const PerformanceFilterModal: React.FC<PerformanceFilterModalProps> = ({
  showFilterModal,
  toggleFilterModal,
  activityDateRange,
  showActivityCalendar,
  activityCalendarMode,
  advancedFilters,
  toggleActivityCalendar,
  handleActivityDayPress,
  setAdvancedFilters,
  resetActivityFilters,
  childData,
}) => {
  const translateY = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Get available assistants
  const availableAssistants = ["J'Apprends", "Recherche", "Accueil", "Autre"];

  // Get available subjects
  const availableSubjects = [
    "Mathématiques",
    "Français",
    "Sciences",
    "Histoire",
    "Anglais",
  ];

  // Animation when modal opens/closes
  useEffect(() => {
    if (showFilterModal) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: Dimensions.get("window").height,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showFilterModal, opacity, translateY]);

  // Get title text based on calendar mode
  const getModeTitleText = () =>
    activityCalendarMode === "start"
      ? "Sélectionner une date de début"
      : "Sélectionner une date de fin";

  // Get marked dates for calendar
  const getMarkedDates = () => {
    const marked: { [date: string]: any } = {};

    // No dates selected
    if (!activityDateRange.startDate && !activityDateRange.endDate) {
      return marked;
    }

    // Only start date selected
    if (activityDateRange.startDate && !activityDateRange.endDate) {
      marked[activityDateRange.startDate] = {
        selected: true,
        startingDay: true,
        endingDay: true, // Single day selection looks like a complete circle
        color: COLORS.primary,
        textColor: "#FFFFFF",
      };
      return marked;
    }

    // Both dates selected - show full range
    if (activityDateRange.startDate && activityDateRange.endDate) {
      // Mark start date
      marked[activityDateRange.startDate] = {
        selected: true,
        startingDay: true,
        color: COLORS.primary,
        textColor: "#FFFFFF",
      };

      // Mark end date
      marked[activityDateRange.endDate] = {
        selected: true,
        endingDay: true,
        color: COLORS.primary,
        textColor: "#FFFFFF",
      };

      // Handle case where start == end (single day)
      if (activityDateRange.startDate === activityDateRange.endDate) {
        marked[activityDateRange.startDate].endingDay = true;
        return marked;
      }

      // Mark all days in between
      const start = new Date(activityDateRange.startDate);
      const end = new Date(activityDateRange.endDate);
      const current = new Date(start);
      current.setDate(current.getDate() + 1);

      while (current < end) {
        const dateStr = current.toISOString().split("T")[0];
        marked[dateStr] = {
          selected: true,
          color: `${COLORS.primary}80`, // Semi-transparent color for days in between
          textColor: "#FFFFFF",
        };
        current.setDate(current.getDate() + 1);
      }
    }

    return marked;
  };

  // Toggle selection of an assistant
  const toggleAssistantSelection = (assistant: string) => {
    const currentAssistants = advancedFilters.selectedAssistants || [];

    const newAssistants = currentAssistants.includes(assistant)
      ? currentAssistants.filter((a) => a !== assistant)
      : [...currentAssistants, assistant];

    setAdvancedFilters({ selectedAssistants: newAssistants });
  };

  // Toggle selection of a subject
  const toggleSubjectSelection = (subject: string) => {
    const currentSubjects = advancedFilters.selectedSubjects || [];

    const newSubjects = currentSubjects.includes(subject)
      ? currentSubjects.filter((s) => s !== subject)
      : [...currentSubjects, subject];

    setAdvancedFilters({ selectedSubjects: newSubjects });
  };

  // For score range slider
  const handleScoreRangeChange = (values: number[]) => {
    setAdvancedFilters({
      scoreRange: {
        min: values[0],
        max: values[1],
      },
    });
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Non défini";

    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Helper function to get assistant color
  const getAssistantColor = (
    assistant: string,
    isSelected: boolean
  ): string => {
    if (!isSelected) return "rgba(0,0,0,0.05)";

    switch (assistant) {
      case "J'Apprends":
        return "#4CAF50";
      case "Recherche":
        return "#2196F3";
      case "Accueil":
        return "#FF9800";
      default:
        return "#9C27B0";
    }
  };

  // Helper function to get assistant icon
  const getAssistantIcon = (assistant: string) => {
    switch (assistant) {
      case "J'Apprends":
        return faBook;
      case "Recherche":
        return faSearch;
      case "Accueil":
        return faBookOpen;
      default:
        return faRobot;
    }
  };

  // Helper function to get subject color
  const getSubjectColor = (subject: string, isSelected: boolean): string => {
    if (!isSelected) return "rgba(0,0,0,0.05)";

    switch (subject) {
      case "Mathématiques":
        return "#E91E63";
      case "Français":
        return "#3F51B5";
      case "Sciences":
        return "#009688";
      case "Histoire":
        return "#795548";
      case "Anglais":
        return "#673AB7";
      default:
        return "#607D8B";
    }
  };

  return (
    <Modal
      visible={showFilterModal}
      transparent
      animationType="none"
      onRequestClose={toggleFilterModal}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.backgroundOverlay, { opacity }]}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={toggleFilterModal}
          />
        </Animated.View>

        <Animated.View
          style={[styles.modalContainer, { transform: [{ translateY }] }]}
        >
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtres avancés</Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleFilterModal}
            >
              <FontAwesomeIcon icon={faTimesCircle} size={20} color="#333333" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Date Range Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Période</Text>

              <View style={styles.dateRangeContainer}>
                <View style={styles.dateSelectContainer}>
                  <Text style={styles.dateLabel}>Date de début</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => toggleActivityCalendar("start")}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        !activityDateRange.startDate && styles.placeholderText,
                      ]}
                    >
                      {activityDateRange.startDate
                        ? formatDate(activityDateRange.startDate)
                        : "Non défini"}
                    </Text>
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      size={16}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.dateArrowContainer}>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    size={16}
                    color="#999999"
                  />
                </View>

                <View style={styles.dateSelectContainer}>
                  <Text style={styles.dateLabel}>Date de fin</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => toggleActivityCalendar("end")}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        !activityDateRange.endDate && styles.placeholderText,
                      ]}
                    >
                      {activityDateRange.endDate
                        ? formatDate(activityDateRange.endDate)
                        : "Non défini"}
                    </Text>
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      size={16}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Calendar Section */}
              {showActivityCalendar && (
                <View style={styles.calendarContainer}>
                  <Text style={styles.calendarTitle}>{getModeTitleText()}</Text>

                  <Calendar
                    style={styles.calendar}
                    markedDates={getMarkedDates()}
                    onDayPress={handleActivityDayPress}
                    theme={{
                      backgroundColor: "#FFFFFF",
                      calendarBackground: "#FFFFFF",
                      textSectionTitleColor: "#333333",
                      selectedDayBackgroundColor: COLORS.primary,
                      selectedDayTextColor: "#FFFFFF",
                      todayTextColor: COLORS.primary,
                      dayTextColor: "#333333",
                      textDisabledColor: "#999999",
                      dotColor: COLORS.primary,
                      selectedDotColor: "#FFFFFF",
                      arrowColor: COLORS.primary,
                      monthTextColor: "#333333",
                      textMonthFontWeight: "bold",
                    }}
                  />
                </View>
              )}
            </View>

            {/* Assistants Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Assistants</Text>

              <View style={styles.filterChipsContainer}>
                {availableAssistants.map((assistant) => {
                  const isSelected = (
                    advancedFilters.selectedAssistants || []
                  ).includes(assistant);
                  const bgColor = getAssistantColor(assistant, isSelected);
                  const icon = getAssistantIcon(assistant);

                  return (
                    <TouchableOpacity
                      key={assistant}
                      style={[
                        styles.filterChip,
                        {
                          backgroundColor: isSelected
                            ? bgColor
                            : "rgba(0,0,0,0.05)",
                        },
                      ]}
                      onPress={() => toggleAssistantSelection(assistant)}
                    >
                      <FontAwesomeIcon
                        icon={icon}
                        size={14}
                        color={isSelected ? "#FFFFFF" : "#666666"}
                        style={styles.chipIcon}
                      />
                      <Text
                        style={[
                          styles.chipText,
                          { color: isSelected ? "#FFFFFF" : "#333333" },
                        ]}
                      >
                        {assistant}
                      </Text>
                      {isSelected && (
                        <View style={styles.checkContainer}>
                          <FontAwesomeIcon
                            icon={faCheck}
                            size={10}
                            color="#FFFFFF"
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Subjects Section - only if J'Apprends is selected */}
            {(advancedFilters.selectedAssistants || []).includes(
              "J'Apprends"
            ) && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Matières</Text>

                <View style={styles.filterChipsContainer}>
                  {availableSubjects.map((subject) => {
                    const isSelected = (
                      advancedFilters.selectedSubjects || []
                    ).includes(subject);
                    const bgColor = getSubjectColor(subject, isSelected);

                    return (
                      <TouchableOpacity
                        key={subject}
                        style={[
                          styles.filterChip,
                          {
                            backgroundColor: isSelected
                              ? bgColor
                              : "rgba(0,0,0,0.05)",
                          },
                        ]}
                        onPress={() => toggleSubjectSelection(subject)}
                      >
                        <FontAwesomeIcon
                          icon={faBook}
                          size={14}
                          color={isSelected ? "#FFFFFF" : "#666666"}
                          style={styles.chipIcon}
                        />
                        <Text
                          style={[
                            styles.chipText,
                            { color: isSelected ? "#FFFFFF" : "#333333" },
                          ]}
                        >
                          {subject}
                        </Text>
                        {isSelected && (
                          <View style={styles.checkContainer}>
                            <FontAwesomeIcon
                              icon={faCheck}
                              size={10}
                              color="#FFFFFF"
                            />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Score Range Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Plage de score</Text>

              <View style={styles.scoreRangeContainer}>
                <Text style={styles.scoreRangeText}>
                  {advancedFilters.scoreRange?.min || 0}% -{" "}
                  {advancedFilters.scoreRange?.max || 100}%
                </Text>

                <MultiSlider
                  values={[
                    advancedFilters.scoreRange?.min || 0,
                    advancedFilters.scoreRange?.max || 100,
                  ]}
                  min={0}
                  max={100}
                  step={5}
                  allowOverlap={false}
                  snapped
                  sliderLength={Dimensions.get("window").width - 100}
                  selectedStyle={{ backgroundColor: COLORS.primary }}
                  unselectedStyle={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                  containerStyle={styles.sliderContainer}
                  markerStyle={styles.sliderMarker}
                  onValuesChange={handleScoreRangeChange}
                />

                <View style={styles.scoreLabelsContainer}>
                  <Text style={styles.scoreLabel}>Faible</Text>
                  <Text style={styles.scoreLabel}>Moyen</Text>
                  <Text style={styles.scoreLabel}>Excellent</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetActivityFilters}
            >
              <Text style={styles.resetButtonText}>Réinitialiser</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={toggleFilterModal}
            >
              <Text style={styles.applyButtonText}>Appliquer les filtres</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  backgroundOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    maxHeight: "80%",
    paddingHorizontal: 20,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
  },
  dateRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateSelectContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
    padding: 12,
  },
  dateText: {
    fontSize: 14,
    color: "#333333",
  },
  placeholderText: {
    color: "#999999",
  },
  dateArrowContainer: {
    padding: 10,
  },
  calendarContainer: {
    marginTop: 16,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 12,
    padding: 16,
  },
  calendarTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12,
    textAlign: "center",
  },
  calendar: {
    borderRadius: 12,
    overflow: "hidden",
  },
  filterChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  chipIcon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  checkContainer: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
  },
  scoreRangeContainer: {
    alignItems: "center",
  },
  scoreRangeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 16,
  },
  sliderContainer: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
  sliderMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreLabelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  scoreLabel: {
    fontSize: 13,
    color: "#666666",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  resetButton: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
    paddingVertical: 15,
    marginRight: 10,
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666666",
  },
  applyButton: {
    flex: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default PerformanceFilterModal;
