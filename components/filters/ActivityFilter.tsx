// components/filters/ActivityFilter.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { MotiView } from "moti";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { TYPOGRAPHY, SPACING, RADIUS, COLORS } from "@/constants/theme";

interface ActivityFilterProps {
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  selectedAssistants: string[];
  selectedSubjects: string[];
  availableAssistants: string[];
  availableSubjects: string[];
  onFilterChange: (filterType: string, value: any) => void;
  onResetFilters: () => void;
}

const ActivityFilter: React.FC<ActivityFilterProps> = ({
  dateRange,
  selectedAssistants,
  selectedSubjects,
  availableAssistants,
  availableSubjects,
  onFilterChange,
  onResetFilters,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarMode, setCalendarMode] = useState<"start" | "end">("start");

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Sélectionner";

    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  // Handle day selection in calendar
  const handleDayPress = (day: any) => {
    const selectedDate = day.dateString;

    if (calendarMode === "start") {
      onFilterChange("dateRange", {
        ...dateRange,
        startDate: selectedDate,
      });
      setCalendarMode("end");
    } else {
      onFilterChange("dateRange", {
        ...dateRange,
        endDate: selectedDate,
      });
      setCalendarVisible(false);
    }
  };

  // Toggle assistant selection
  const toggleAssistant = (assistant: string) => {
    const newSelectedAssistants = selectedAssistants.includes(assistant)
      ? selectedAssistants.filter((a) => a !== assistant)
      : [...selectedAssistants, assistant];

    onFilterChange("assistants", newSelectedAssistants);
  };

  // Toggle subject selection
  const toggleSubject = (subject: string) => {
    const newSelectedSubjects = selectedSubjects.includes(subject)
      ? selectedSubjects.filter((s) => s !== subject)
      : [...selectedSubjects, subject];

    onFilterChange("subjects", newSelectedSubjects);
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: -10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 500 }}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="options-outline" size={20} color={COLORS.primary} />
        <Text style={styles.filterButtonText}>Filtres</Text>

        {/* Show badges if filters are active */}
        {(selectedAssistants.length > 0 ||
          selectedSubjects.length > 0 ||
          dateRange.startDate) && (
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>
              {selectedAssistants.length +
                selectedSubjects.length +
                (dateRange.startDate ? 1 : 0)}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Active filters display */}
      {(selectedAssistants.length > 0 ||
        selectedSubjects.length > 0 ||
        dateRange.startDate) && (
        <View style={styles.activeFiltersContainer}>
          {dateRange.startDate && (
            <View style={styles.activeFilterBadge}>
              <Text style={styles.activeFilterText}>
                {formatDate(dateRange.startDate)}
                {dateRange.endDate ? ` - ${formatDate(dateRange.endDate)}` : ""}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  onFilterChange("dateRange", {
                    startDate: null,
                    endDate: null,
                  })
                }
              >
                <Ionicons
                  name="close-circle"
                  size={16}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          )}

          {selectedAssistants.map((assistant) => (
            <View key={assistant} style={styles.activeFilterBadge}>
              <Text style={styles.activeFilterText}>{assistant}</Text>
              <TouchableOpacity onPress={() => toggleAssistant(assistant)}>
                <Ionicons
                  name="close-circle"
                  size={16}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          ))}

          {selectedSubjects.map((subject) => (
            <View key={subject} style={styles.activeFilterBadge}>
              <Text style={styles.activeFilterText}>{subject}</Text>
              <TouchableOpacity onPress={() => toggleSubject(subject)}>
                <Ionicons
                  name="close-circle"
                  size={16}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.resetButton} onPress={onResetFilters}>
            <Text style={styles.resetButtonText}>Réinitialiser</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtres</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              {/* Date Range Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Période</Text>
                <View style={styles.dateRangeContainer}>
                  <TouchableOpacity
                    style={styles.dateSelector}
                    onPress={() => {
                      setCalendarMode("start");
                      setCalendarVisible(true);
                    }}
                  >
                    <Text style={styles.dateSelectorText}>
                      {formatDate(dateRange.startDate)}
                    </Text>
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>

                  <Text style={styles.dateRangeSeparator}>à</Text>

                  <TouchableOpacity
                    style={styles.dateSelector}
                    onPress={() => {
                      setCalendarMode("end");
                      setCalendarVisible(true);
                    }}
                  >
                    <Text style={styles.dateSelectorText}>
                      {formatDate(dateRange.endDate)}
                    </Text>
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>

                {calendarVisible && (
                  <View style={styles.calendarContainer}>
                    <Calendar
                      onDayPress={handleDayPress}
                      markedDates={{
                        ...(dateRange.startDate
                          ? {
                              [dateRange.startDate]: {
                                selected: true,
                                startingDay: true,
                                color: COLORS.primary,
                              },
                            }
                          : {}),
                        ...(dateRange.endDate
                          ? {
                              [dateRange.endDate]: {
                                selected: true,
                                endingDay: true,
                                color: COLORS.primary,
                              },
                            }
                          : {}),
                      }}
                      theme={{
                        todayTextColor: COLORS.primary,
                        selectedDayBackgroundColor: COLORS.primary,
                        selectedDayTextColor: "#ffffff",
                        arrowColor: COLORS.primary,
                      }}
                    />
                  </View>
                )}
              </View>

              {/* Assistants Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Assistants</Text>
                <View style={styles.chipsContainer}>
                  {availableAssistants.map((assistant) => (
                    <TouchableOpacity
                      key={assistant}
                      style={[
                        styles.chip,
                        selectedAssistants.includes(assistant) &&
                          styles.selectedChip,
                      ]}
                      onPress={() => toggleAssistant(assistant)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selectedAssistants.includes(assistant) &&
                            styles.selectedChipText,
                        ]}
                      >
                        {assistant}
                      </Text>
                      {selectedAssistants.includes(assistant) && (
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color="#FFFFFF"
                          style={styles.chipIcon}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Subjects Filter - Only shown when J'Apprends is selected */}
              {selectedAssistants.includes("J'Apprends") && (
                <View style={styles.filterSection}>
                  <Text style={styles.filterTitle}>Matières</Text>
                  <View style={styles.chipsContainer}>
                    {availableSubjects.map((subject) => (
                      <TouchableOpacity
                        key={subject}
                        style={[
                          styles.chip,
                          selectedSubjects.includes(subject) &&
                            styles.selectedChip,
                        ]}
                        onPress={() => toggleSubject(subject)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            selectedSubjects.includes(subject) &&
                              styles.selectedChipText,
                          ]}
                        >
                          {subject}
                        </Text>
                        {selectedSubjects.includes(subject) && (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color="#FFFFFF"
                            style={styles.chipIcon}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={onResetFilters}
              >
                <Text style={styles.modalCancelButtonText}>Réinitialiser</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalApplyButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalApplyButtonText}>Appliquer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.xxl,
    alignSelf: "flex-start",
  },
  filterButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.primary,
    marginLeft: 8,
  },
  filterBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  filterBadgeText: {
    ...TYPOGRAPHY.caption,
    color: "#FFFFFF",
    fontFamily: "bold",
  },
  activeFiltersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    alignItems: "center",
  },
  activeFilterBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${COLORS.primary}10`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.xxl,
    marginRight: 8,
    marginBottom: 8,
  },
  activeFilterText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    marginRight: 8,
  },
  resetButton: {
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.xxl,
    marginBottom: 8,
  },
  resetButtonText: {
    ...TYPOGRAPHY.caption,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  modalTitle: {
    ...TYPOGRAPHY.h2,
    color: "#333",
  },
  modalContent: {
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterTitle: {
    ...TYPOGRAPHY.subtitle1,
    color: "#333",
    marginBottom: 12,
  },
  dateRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateSelector: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
  },
  dateSelectorText: {
    ...TYPOGRAPHY.body2,
    color: "#333",
  },
  dateRangeSeparator: {
    ...TYPOGRAPHY.body2,
    color: "#666",
    marginHorizontal: 12,
  },
  calendarContainer: {
    marginTop: 16,
    borderRadius: RADIUS.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.xxl,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: COLORS.primary,
  },
  chipText: {
    ...TYPOGRAPHY.body2,
    color: "#333",
  },
  selectedChipText: {
    color: "#FFFFFF",
  },
  chipIcon: {
    marginLeft: 4,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  modalCancelButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    marginRight: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  modalCancelButtonText: {
    ...TYPOGRAPHY.button,
    color: "#666",
  },
  modalApplyButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    marginLeft: 8,
    backgroundColor: COLORS.primary,
  },
  modalApplyButtonText: {
    ...TYPOGRAPHY.button,
    color: "#FFFFFF",
  },
});

export default ActivityFilter;
