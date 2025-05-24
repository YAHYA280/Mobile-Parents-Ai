import type { DateData } from "react-native-calendars";

import React, { useEffect } from "react";
import { Calendar } from "react-native-calendars";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faSearch,
  faCalendar,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  View,
  Text,
  Modal,
  Animated,
  TextInput,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { COLORS } from "@/constants/theme";

import AssistantTypeFilters from "./AssistantTypeFilters";

interface FilterModalProps {
  showActivityCalendar: boolean;
  toggleActivityCalendar: () => void;
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  uniqueAssistantTypes: string[];
  selectedAssistantTypes: string[];
  setSelectedAssistantTypes: (
    value: ((prev: string[]) => string[]) | string[]
  ) => void;
  activityCalendarMode: "start" | "end";
  activityDateRange: { startDate: string | null; endDate: string | null };
  handleActivityDayPress: (day: DateData) => void;
  resetAllFilters: () => void;
  availableSubjects: string[];
  availableChapters: string[];
  availableExercises: string[];
  advancedFilters: {
    selectedAssistants: string[];
    selectedSubjects: string[];
    selectedChapters: string[];
    selectedExercises: string[];
  };
  setAdvancedFilters: (filters: any) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  showActivityCalendar,
  toggleActivityCalendar,
  searchKeyword,
  setSearchKeyword,
  uniqueAssistantTypes,
  selectedAssistantTypes,
  setSelectedAssistantTypes,
  activityCalendarMode,
  activityDateRange,
  handleActivityDayPress,
  resetAllFilters,
  availableSubjects, // Now accepting these props even if not used
  availableChapters,
  availableExercises,
  advancedFilters,
  setAdvancedFilters,
}) => {
  const translateY = React.useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showActivityCalendar) {
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
  }, [showActivityCalendar, opacity, translateY]);

  const getModeTitleText = () =>
    activityCalendarMode === "start"
      ? "Sélectionner une date de début"
      : "Sélectionner une date de fin";

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
          color: `${COLORS.primary}80`, // Use semi-transparent color for days in between
          textColor: "#FFFFFF",
        };
        current.setDate(current.getDate() + 1);
      }
    }

    return marked;
  };

  return (
    <Modal
      visible={showActivityCalendar}
      transparent
      animationType="none"
      onRequestClose={toggleActivityCalendar}
    >
      <View style={styles.modalBackground}>
        <Animated.View style={[styles.backgroundOverlay, { opacity }]}>
          <TouchableOpacity
            style={styles.backgroundTouchable}
            activeOpacity={1}
            onPress={toggleActivityCalendar}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filtrer les activités</Text>
            <TouchableOpacity
              onPress={toggleActivityCalendar}
              style={styles.closeButton}
            >
              <FontAwesomeIcon
                icon={faTimesCircle}
                color={COLORS.black}
                size={18}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* SEARCH INPUT */}
            <View style={styles.searchContainer}>
              <FontAwesomeIcon
                icon={faSearch}
                color={COLORS.gray3}
                size={16}
                style={styles.searchIcon}
              />
              <TextInput
                placeholder="Rechercher..."
                placeholderTextColor={COLORS.gray3}
                value={searchKeyword}
                onChangeText={setSearchKeyword}
                style={styles.searchInput}
              />
              {searchKeyword && (
                <TouchableOpacity onPress={() => setSearchKeyword("")}>
                  <FontAwesomeIcon
                    icon={faTimesCircle}
                    color={COLORS.gray3}
                    size={16}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* CALENDAR SECTION */}
            <View style={styles.calendarSection}>
              <View style={styles.calendarHeader}>
                <FontAwesomeIcon
                  icon={faCalendar}
                  color={COLORS.primary}
                  size={18}
                  style={styles.calendarIcon}
                />
                <Text style={styles.calendarTitle}>{getModeTitleText()}</Text>
              </View>

              <View style={styles.calendarInfo}>
                <Text style={styles.calendarInfoText}>
                  {activityCalendarMode === "start"
                    ? "Choisissez une date de début pour la période"
                    : "Choisissez une date de fin pour la période"}
                </Text>

                {/* Show current selection status */}
                {activityDateRange.startDate && (
                  <Text style={styles.selectedDateText}>
                    Date de début:{" "}
                    {new Date(activityDateRange.startDate).toLocaleDateString(
                      "fr-FR",
                      { day: "numeric", month: "long", year: "numeric" }
                    )}
                  </Text>
                )}

                {activityDateRange.endDate && (
                  <Text style={styles.selectedDateText}>
                    Date de fin:{" "}
                    {new Date(activityDateRange.endDate).toLocaleDateString(
                      "fr-FR",
                      { day: "numeric", month: "long", year: "numeric" }
                    )}
                  </Text>
                )}

                {/* Instructions for second selection */}
                {activityCalendarMode === "end" &&
                  activityDateRange.startDate &&
                  !activityDateRange.endDate && (
                    <Text style={styles.instructionText}>
                      Sélectionnez maintenant une date de fin pour compléter la
                      période
                    </Text>
                  )}
              </View>

              <Calendar
                style={styles.calendar}
                theme={{
                  backgroundColor: "#FFFFFF",
                  calendarBackground: "#FFFFFF",
                  textSectionTitleColor: COLORS.black,
                  selectedDayBackgroundColor: COLORS.primary,
                  selectedDayTextColor: "#FFFFFF",
                  todayTextColor: COLORS.primary,
                  dayTextColor: COLORS.black,
                  textDisabledColor: "rgba(0,0,0,0.3)",
                  dotColor: COLORS.primary,
                  selectedDotColor: "#FFFFFF",
                  arrowColor: COLORS.primary,
                  monthTextColor: COLORS.black,
                  textMonthFontWeight: "bold",
                  textDayFontSize: 14,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 13,
                }}
                markingType="period"
                markedDates={getMarkedDates()}
                onDayPress={handleActivityDayPress}
                enableSwipeMonths
              />
            </View>

            {/* ASSISTANT TYPE FILTERS */}
            {uniqueAssistantTypes.length > 0 && (
              <AssistantTypeFilters
                uniqueAssistantTypes={uniqueAssistantTypes}
                selectedAssistantTypes={selectedAssistantTypes}
                setSelectedAssistantTypes={setSelectedAssistantTypes}
              />
            )}
          </ScrollView>

          {/* ACTION BUTTONS */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetAllFilters}
            >
              <Text style={styles.resetButtonText}>Réinitialiser</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={toggleActivityCalendar}
            >
              <Text style={styles.applyButtonText}>Appliquer</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  backgroundOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundTouchable: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  searchContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    color: COLORS.black,
    fontSize: 16,
  },
  calendarSection: {
    marginBottom: 24,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  calendarIcon: {
    marginRight: 10,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.black,
  },
  calendarInfo: {
    backgroundColor: "rgba(0, 149, 255, 0.08)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  calendarInfoText: {
    color: COLORS.primary,
    textAlign: "center",
    fontSize: 15,
  },
  selectedDateText: {
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 4,
    fontWeight: "500",
  },
  instructionText: {
    color: COLORS.gray3,
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
  calendar: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 16,
  },
  resetButton: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 8,
  },
  resetButtonText: {
    color: COLORS.black,
    fontWeight: "500",
    fontSize: 16,
  },
  applyButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginLeft: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  applyButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },
});

export default FilterModal;
