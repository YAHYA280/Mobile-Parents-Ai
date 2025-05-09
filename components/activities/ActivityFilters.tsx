import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import { MotiView } from "moti";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, TYPOGRAPHY } from "@/constants/theme";

interface FilterState {
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  selectedAssistants: string[];
  selectedSubjects: string[];
  selectedDifficulties: string[];
}

interface ActivityFilterProps {
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  selectedAssistants: string[];
  selectedSubjects: string[];
  selectedDifficulties: string[];
  availableAssistants: string[];
  availableSubjects: string[];
  availableDifficulties: string[];
  onFilterChange: (filterType: string, value: any) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

const ActivityFilter: React.FC<ActivityFilterProps> = ({
  dateRange,
  selectedAssistants,
  selectedSubjects,
  selectedDifficulties,
  availableAssistants,
  availableSubjects,
  availableDifficulties,
  onFilterChange,
  onResetFilters,
  onApplyFilters,
}) => {
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarMode, setCalendarMode] = useState<"start" | "end">("start");
  const [activeFilterType, setActiveFilterType] = useState<
    "date" | "assistants" | "subjects" | "difficulties"
  >("date");
  const [searchQuery, setSearchQuery] = useState("");

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Sélectionner";

    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Handle day selection in calendar
  const handleDayPress = (day: any) => {
    const selectedDate = day.dateString;

    if (calendarMode === "start") {
      // If selecting start date after end date, reset end date
      if (
        dateRange.endDate &&
        new Date(selectedDate) > new Date(dateRange.endDate)
      ) {
        onFilterChange("dateRange", {
          startDate: selectedDate,
          endDate: null,
        });
      } else {
        onFilterChange("dateRange", {
          ...dateRange,
          startDate: selectedDate,
        });
      }
      setCalendarMode("end");
    } else {
      // If selecting end date before start date, update both
      if (
        dateRange.startDate &&
        new Date(selectedDate) < new Date(dateRange.startDate)
      ) {
        onFilterChange("dateRange", {
          startDate: selectedDate,
          endDate: selectedDate,
        });
      } else {
        onFilterChange("dateRange", {
          ...dateRange,
          endDate: selectedDate,
        });
      }
      setCalendarVisible(false);
    }
  };

  // Toggle item selection
  const toggleSelection = (item: string) => {
    switch (activeFilterType) {
      case "assistants":
        const newAssistants = selectedAssistants.includes(item)
          ? selectedAssistants.filter((a) => a !== item)
          : [...selectedAssistants, item];
        onFilterChange("selectedAssistants", newAssistants);
        break;

      case "subjects":
        const newSubjects = selectedSubjects.includes(item)
          ? selectedSubjects.filter((s) => s !== item)
          : [...selectedSubjects, item];
        onFilterChange("selectedSubjects", newSubjects);
        break;

      case "difficulties":
        const newDifficulties = selectedDifficulties.includes(item)
          ? selectedDifficulties.filter((d) => d !== item)
          : [...selectedDifficulties, item];
        onFilterChange("selectedDifficulties", newDifficulties);
        break;
    }
  };

  // Get filtered options based on search query
  const getFilteredOptions = () => {
    const query = searchQuery.toLowerCase();

    switch (activeFilterType) {
      case "assistants":
        return availableAssistants.filter((a) =>
          a.toLowerCase().includes(query)
        );
      case "subjects":
        return availableSubjects.filter((s) => s.toLowerCase().includes(query));
      case "difficulties":
        return availableDifficulties.filter((d) =>
          d.toLowerCase().includes(query)
        );
      default:
        return [];
    }
  };

  // Open modal with specific filter type
  const openFilterModal = (
    filterType: "date" | "assistants" | "subjects" | "difficulties"
  ) => {
    setActiveFilterType(filterType);
    setSearchQuery("");
    setModalVisible(true);

    if (filterType === "date") {
      setCalendarVisible(true);
      setCalendarMode("start");
    } else {
      setCalendarVisible(false);
    }
  };

  // Get the color for different filter types
  const getColorForType = (
    type: "assistants" | "subjects" | "difficulties",
    item: string
  ) => {
    if (type === "assistants") {
      switch (item.toLowerCase()) {
        case "j'apprends":
          return "#4CAF50";
        case "recherche":
          return "#2196F3";
        case "accueil":
          return "#FF9800";
        default:
          return "#9C27B0";
      }
    } else if (type === "subjects") {
      // This is a simplified mapping
      const subjects: Record<string, string> = {
        mathématiques: "#2196F3",
        français: "#4CAF50",
        histoire: "#FF9800",
        sciences: "#9C27B0",
      };

      for (const key in subjects) {
        if (item.toLowerCase().includes(key)) {
          return subjects[key];
        }
      }

      return "#607D8B";
    } else if (type === "difficulties") {
      switch (item.toLowerCase()) {
        case "facile":
          return "#4CAF50";
        case "moyen":
          return "#FF9800";
        case "difficile":
          return "#F44336";
        default:
          return "#607D8B";
      }
    }

    return "#607D8B";
  };

  // Count total active filters
  const totalActiveFilters =
    (dateRange.startDate ? 1 : 0) +
    selectedAssistants.length +
    selectedSubjects.length +
    selectedDifficulties.length;

  return (
    <MotiView
      from={{ opacity: 0, translateY: -10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 500 }}
      style={styles.container}
    >
      <View style={styles.filterButtonsRow}>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: COLORS.white }]}
          onPress={() => openFilterModal("date")}
        >
          <Ionicons
            name="calendar-outline"
            size={18}
            color={dateRange.startDate ? COLORS.primary : COLORS.gray3}
          />
          <Text
            style={[
              styles.filterButtonText,
              {
                color: dateRange.startDate ? COLORS.primary : COLORS.gray3,
              },
              dateRange.startDate && styles.activeFilterText,
            ]}
            numberOfLines={1}
          >
            {dateRange.startDate
              ? dateRange.endDate
                ? `${formatDate(dateRange.startDate).split(" ").slice(0, 2).join(" ")} - ${formatDate(dateRange.endDate).split(" ").slice(0, 2).join(" ")}`
                : formatDate(dateRange.startDate)
                    .split(" ")
                    .slice(0, 2)
                    .join(" ")
              : "Date"}
          </Text>
          {dateRange.startDate && <View style={styles.activeDot} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: COLORS.white }]}
          onPress={() => openFilterModal("assistants")}
        >
          <Ionicons
            name="people-outline"
            size={18}
            color={
              selectedAssistants.length > 0 ? COLORS.primary : COLORS.gray3
            }
          />
          <Text
            style={[
              styles.filterButtonText,
              {
                color:
                  selectedAssistants.length > 0 ? COLORS.primary : COLORS.gray3,
              },
              selectedAssistants.length > 0 && styles.activeFilterText,
            ]}
            numberOfLines={1}
          >
            {selectedAssistants.length > 0
              ? `Assistants (${selectedAssistants.length})`
              : "Assistants"}
          </Text>
          {selectedAssistants.length > 0 && <View style={styles.activeDot} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: COLORS.white }]}
          onPress={() => openFilterModal("subjects")}
        >
          <Ionicons
            name="book-outline"
            size={18}
            color={selectedSubjects.length > 0 ? COLORS.primary : COLORS.gray3}
          />
          <Text
            style={[
              styles.filterButtonText,
              {
                color:
                  selectedSubjects.length > 0 ? COLORS.primary : COLORS.gray3,
              },
              selectedSubjects.length > 0 && styles.activeFilterText,
            ]}
            numberOfLines={1}
          >
            {selectedSubjects.length > 0
              ? `Matières (${selectedSubjects.length})`
              : "Matières"}
          </Text>
          {selectedSubjects.length > 0 && <View style={styles.activeDot} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: COLORS.white }]}
          onPress={() => openFilterModal("difficulties")}
        >
          <Ionicons
            name="stats-chart-outline"
            size={18}
            color={
              selectedDifficulties.length > 0 ? COLORS.primary : COLORS.gray3
            }
          />
          <Text
            style={[
              styles.filterButtonText,
              {
                color:
                  selectedDifficulties.length > 0
                    ? COLORS.primary
                    : COLORS.gray3,
              },
              selectedDifficulties.length > 0 && styles.activeFilterText,
            ]}
            numberOfLines={1}
          >
            {selectedDifficulties.length > 0
              ? `Difficulté (${selectedDifficulties.length})`
              : "Difficulté"}
          </Text>
          {selectedDifficulties.length > 0 && <View style={styles.activeDot} />}
        </TouchableOpacity>
      </View>

      {/* Active filter chips */}
      {totalActiveFilters > 0 && (
        <MotiView
          from={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ type: "timing", duration: 300 }}
          style={styles.activeFiltersContainer}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activeFiltersScrollContent}
          >
            {dateRange.startDate && (
              <TouchableOpacity
                style={[
                  styles.activeFilterChip,
                  { backgroundColor: `${COLORS.primary}15` },
                ]}
                onPress={() => openFilterModal("date")}
              >
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={COLORS.primary}
                  style={styles.chipIcon}
                />
                <Text style={styles.chipText}>
                  {dateRange.endDate
                    ? `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`
                    : formatDate(dateRange.startDate)}
                </Text>
                <TouchableOpacity
                  style={styles.chipCloseButton}
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
              </TouchableOpacity>
            )}

            {selectedAssistants.map((assistant) => {
              const color = getColorForType("assistants", assistant);
              return (
                <TouchableOpacity
                  key={`assistant-${assistant}`}
                  style={[
                    styles.activeFilterChip,
                    { backgroundColor: color + "20" },
                  ]}
                  onPress={() => openFilterModal("assistants")}
                >
                  <Ionicons
                    name="people-outline"
                    size={14}
                    color={color}
                    style={styles.chipIcon}
                  />
                  <Text style={[styles.chipText, { color: color }]}>
                    {assistant}
                  </Text>
                  <TouchableOpacity
                    style={styles.chipCloseButton}
                    onPress={() => toggleSelection(assistant)}
                  >
                    <Ionicons name="close-circle" size={16} color={color} />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}

            {selectedSubjects.map((subject) => {
              const color = getColorForType("subjects", subject);
              return (
                <TouchableOpacity
                  key={`subject-${subject}`}
                  style={[
                    styles.activeFilterChip,
                    { backgroundColor: color + "20" },
                  ]}
                  onPress={() => openFilterModal("subjects")}
                >
                  <Ionicons
                    name="book-outline"
                    size={14}
                    color={color}
                    style={styles.chipIcon}
                  />
                  <Text style={[styles.chipText, { color: color }]}>
                    {subject}
                  </Text>
                  <TouchableOpacity
                    style={styles.chipCloseButton}
                    onPress={() => toggleSelection(subject)}
                  >
                    <Ionicons name="close-circle" size={16} color={color} />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}

            {selectedDifficulties.map((difficulty) => {
              const color = getColorForType("difficulties", difficulty);
              return (
                <TouchableOpacity
                  key={`difficulty-${difficulty}`}
                  style={[
                    styles.activeFilterChip,
                    { backgroundColor: color + "20" },
                  ]}
                  onPress={() => openFilterModal("difficulties")}
                >
                  <Ionicons
                    name="stats-chart-outline"
                    size={14}
                    color={color}
                    style={styles.chipIcon}
                  />
                  <Text style={[styles.chipText, { color: color }]}>
                    {difficulty}
                  </Text>
                  <TouchableOpacity
                    style={styles.chipCloseButton}
                    onPress={() => toggleSelection(difficulty)}
                  >
                    <Ionicons name="close-circle" size={16} color={color} />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}

            {totalActiveFilters > 0 && (
              <TouchableOpacity
                style={[
                  styles.resetButton,
                  {
                    backgroundColor: "rgba(0,0,0,0.05)",
                  },
                ]}
                onPress={onResetFilters}
              >
                <Text style={[styles.resetButtonText, { color: COLORS.black }]}>
                  Réinitialiser
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </MotiView>
      )}

      {/* Filter Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <MotiView
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "spring", damping: 18 }}
            style={[styles.modalContainer, { backgroundColor: COLORS.white }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: COLORS.black }]}>
                {activeFilterType === "date"
                  ? "Sélectionner la période"
                  : activeFilterType === "assistants"
                    ? "Filtrer par assistants"
                    : activeFilterType === "subjects"
                      ? "Filtrer par matières"
                      : "Filtrer par difficulté"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>

            {activeFilterType !== "date" && (
              <View style={styles.searchContainer}>
                <View
                  style={[
                    styles.searchInputContainer,
                    {
                      backgroundColor: "rgba(0,0,0,0.05)",
                    },
                  ]}
                >
                  <Ionicons name="search" size={20} color={COLORS.gray3} />
                  <TextInput
                    style={[styles.searchInput, { color: COLORS.black }]}
                    placeholder="Rechercher..."
                    placeholderTextColor={"rgba(0,0,0,0.3)"}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color={COLORS.gray3}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            <View style={styles.modalContent}>
              {/* Date Range Picker */}
              {activeFilterType === "date" && calendarVisible && (
                <View style={styles.calendarContainer}>
                  <View style={styles.dateSelectionHeader}>
                    <Text
                      style={[
                        styles.dateSelectionTitle,
                        { color: COLORS.black },
                      ]}
                    >
                      {calendarMode === "start"
                        ? "Sélectionnez la date de début"
                        : "Sélectionnez la date de fin"}
                    </Text>

                    <View style={styles.dateRangeDisplay}>
                      <View
                        style={[
                          styles.dateDisplay,
                          dateRange.startDate && styles.dateDisplayActive,
                          calendarMode === "start" &&
                            styles.dateDisplaySelected,
                          {
                            backgroundColor: "rgba(0,0,0,0.05)",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.dateLabel,
                            {
                              color: COLORS.gray3,
                            },
                          ]}
                        >
                          Début
                        </Text>
                        <Text
                          style={[styles.dateValue, { color: COLORS.black }]}
                        >
                          {dateRange.startDate
                            ? formatDate(dateRange.startDate)
                            : "Non défini"}
                        </Text>
                      </View>

                      <View style={styles.dateArrow}>
                        <Ionicons
                          name="arrow-forward"
                          size={16}
                          color={COLORS.gray3}
                        />
                      </View>

                      <View
                        style={[
                          styles.dateDisplay,
                          dateRange.endDate && styles.dateDisplayActive,
                          calendarMode === "end" && styles.dateDisplaySelected,
                          {
                            backgroundColor: "rgba(0,0,0,0.05)",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.dateLabel,
                            {
                              color: COLORS.gray3,
                            },
                          ]}
                        >
                          Fin
                        </Text>
                        <Text
                          style={[styles.dateValue, { color: COLORS.black }]}
                        >
                          {dateRange.endDate
                            ? formatDate(dateRange.endDate)
                            : "Non défini"}
                        </Text>
                      </View>
                    </View>
                  </View>

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
                      monthTextColor: COLORS.black,
                      textMonthFontWeight: "bold",
                      textDayHeaderFontWeight: "500",
                      textSectionTitleColor: COLORS.gray3,
                      backgroundColor: COLORS.white,
                      calendarBackground: COLORS.white,
                      dayTextColor: COLORS.black,
                    }}
                  />

                  <View style={styles.calendarActions}>
                    <TouchableOpacity
                      style={[
                        styles.calendarActionButton,
                        {
                          borderColor: "rgba(0,0,0,0.1)",
                        },
                      ]}
                      onPress={() =>
                        onFilterChange("dateRange", {
                          startDate: null,
                          endDate: null,
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.calendarActionButtonText,
                          { color: COLORS.black },
                        ]}
                      >
                        Effacer les dates
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Options Lists (Assistants, Subjects, Difficulties) */}
              {activeFilterType !== "date" && (
                <FlatList
                  data={getFilteredOptions()}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => {
                    const isSelected =
                      (activeFilterType === "assistants" &&
                        selectedAssistants.includes(item)) ||
                      (activeFilterType === "subjects" &&
                        selectedSubjects.includes(item)) ||
                      (activeFilterType === "difficulties" &&
                        selectedDifficulties.includes(item));

                    const color = getColorForType(
                      activeFilterType as any,
                      item
                    );

                    return (
                      <TouchableOpacity
                        style={[
                          styles.optionItem,
                          {
                            backgroundColor: isSelected
                              ? color + "20"
                              : "rgba(0,0,0,0.03)",
                            borderColor: isSelected ? color : "transparent",
                          },
                        ]}
                        onPress={() => toggleSelection(item)}
                      >
                        <View style={styles.optionItemContent}>
                          {activeFilterType === "assistants" && (
                            <View
                              style={[
                                styles.optionItemIcon,
                                {
                                  backgroundColor: isSelected
                                    ? color + "30"
                                    : "rgba(0,0,0,0.05)",
                                },
                              ]}
                            >
                              <Ionicons
                                name="people"
                                size={16}
                                color={isSelected ? color : COLORS.gray3}
                              />
                            </View>
                          )}

                          {activeFilterType === "subjects" && (
                            <View
                              style={[
                                styles.optionItemIcon,
                                {
                                  backgroundColor: isSelected
                                    ? color + "30"
                                    : "rgba(0,0,0,0.05)",
                                },
                              ]}
                            >
                              <Ionicons
                                name="book"
                                size={16}
                                color={isSelected ? color : COLORS.gray3}
                              />
                            </View>
                          )}

                          {activeFilterType === "difficulties" && (
                            <View
                              style={[
                                styles.optionItemIcon,
                                {
                                  backgroundColor: isSelected
                                    ? color + "30"
                                    : "rgba(0,0,0,0.05)",
                                },
                              ]}
                            >
                              <Ionicons
                                name="stats-chart"
                                size={16}
                                color={isSelected ? color : COLORS.gray3}
                              />
                            </View>
                          )}

                          <Text
                            style={[
                              styles.optionItemText,
                              { color: COLORS.black },
                            ]}
                          >
                            {item}
                          </Text>
                        </View>

                        {isSelected && (
                          <View
                            style={[
                              styles.checkmarkContainer,
                              { backgroundColor: color },
                            ]}
                          >
                            <Ionicons
                              name="checkmark"
                              size={14}
                              color="#FFFFFF"
                            />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  }}
                  ListEmptyComponent={() => (
                    <View style={styles.emptyListContainer}>
                      <Ionicons name="search" size={40} color={COLORS.gray3} />
                      <Text
                        style={[
                          styles.emptyListText,
                          {
                            color: COLORS.gray3,
                          },
                        ]}
                      >
                        Aucun résultat trouvé pour "{searchQuery}"
                      </Text>
                    </View>
                  )}
                  contentContainerStyle={styles.optionsList}
                />
              )}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[
                  styles.modalCancelButton,
                  {
                    borderColor: "rgba(0,0,0,0.1)",
                  },
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text
                  style={[
                    styles.modalCancelButtonText,
                    { color: COLORS.black },
                  ]}
                >
                  Annuler
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalApplyButton}
                onPress={() => {
                  onApplyFilters();
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalApplyButtonText}>Appliquer</Text>
              </TouchableOpacity>
            </View>
          </MotiView>
        </View>
      </Modal>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  filterButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: "relative",
    justifyContent: "center",
  },
  filterButtonText: {
    ...TYPOGRAPHY.caption,
    marginLeft: 6,
    fontWeight: "400",
  },
  activeFilterText: {
    fontWeight: "600",
  },
  activeDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  activeFiltersContainer: {
    marginTop: 12,
    marginBottom: 4,
    overflow: "hidden",
  },
  activeFiltersScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  activeFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  chipIcon: {
    marginRight: 4,
  },
  chipText: {
    ...TYPOGRAPHY.caption,
    fontWeight: "500",
  },
  chipCloseButton: {
    marginLeft: 4,
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  resetButtonText: {
    ...TYPOGRAPHY.caption,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
    fontWeight: "bold",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    height: 44,
    fontSize: 16,
  },
  modalContent: {
    flex: 1,
  },
  calendarContainer: {
    padding: 16,
  },
  dateSelectionHeader: {
    marginBottom: 16,
  },
  dateSelectionTitle: {
    ...TYPOGRAPHY.subtitle1,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  dateRangeDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  dateDisplay: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  dateDisplayActive: {
    backgroundColor: `${COLORS.primary}15`,
  },
  dateDisplaySelected: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  dateLabel: {
    ...TYPOGRAPHY.caption,
    marginBottom: 4,
  },
  dateValue: {
    ...TYPOGRAPHY.body2,
    fontWeight: "500",
  },
  dateArrow: {
    paddingHorizontal: 10,
  },
  calendarActions: {
    marginTop: 16,
    alignItems: "center",
  },
  calendarActionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
  },
  calendarActionButtonText: {
    ...TYPOGRAPHY.button,
  },
  optionsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  optionItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionItemText: {
    ...TYPOGRAPHY.body1,
  },
  checkmarkContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyListContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyListText: {
    ...TYPOGRAPHY.body2,
    marginTop: 12,
    textAlign: "center",
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
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
  },
  modalCancelButtonText: {
    ...TYPOGRAPHY.button,
  },
  modalApplyButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 8,
    backgroundColor: COLORS.primary,
  },
  modalApplyButtonText: {
    ...TYPOGRAPHY.button,
    color: "#FFFFFF",
  },
});

export default ActivityFilter;
