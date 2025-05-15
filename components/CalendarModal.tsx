import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

const { width } = Dimensions.get("window");

interface CalendarModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDateRange: (startDate: Date | null, endDate: Date | null) => void;
  dark: boolean;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  visible,
  onClose,
  onSelectDateRange,
  dark,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectionMode, setSelectionMode] = useState<"start" | "end">("start");

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    // Create array with empty slots for days before the 1st of the month
    const days = Array(firstDayOfMonth).fill(null);

    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // Check if date is selected
  const isDateSelected = (date: Date | null) => {
    if (!date) return false;

    // Check if date is the start date
    if (
      selectedStartDate &&
      date.getDate() === selectedStartDate.getDate() &&
      date.getMonth() === selectedStartDate.getMonth() &&
      date.getFullYear() === selectedStartDate.getFullYear()
    ) {
      return true;
    }

    // Check if date is the end date
    if (
      selectedEndDate &&
      date.getDate() === selectedEndDate.getDate() &&
      date.getMonth() === selectedEndDate.getMonth() &&
      date.getFullYear() === selectedEndDate.getFullYear()
    ) {
      return true;
    }

    // Check if date is between start and end date
    if (
      selectedStartDate &&
      selectedEndDate &&
      date.getTime() > selectedStartDate.getTime() &&
      date.getTime() < selectedEndDate.getTime()
    ) {
      return true;
    }

    return false;
  };

  // Handle month navigation
  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Handle date selection
  const handleDateSelect = (date: Date | null) => {
    if (!date) return;

    if (selectionMode === "start") {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
      setSelectionMode("end");
    } else {
      // Ensure end date is after start date
      if (selectedStartDate && date.getTime() < selectedStartDate.getTime()) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(date);
      } else {
        setSelectedEndDate(date);
      }
      setSelectionMode("start");
    }
  };

  // Apply selected date range
  const applyDateRange = () => {
    onSelectDateRange(selectedStartDate, selectedEndDate);
    onClose();
  };

  // Clear selected dates
  const clearDates = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setSelectionMode("start");
  };

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get month name and year
  const getMonthYear = () => {
    return currentMonth.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });
  };

  // Week days
  const weekDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  const handleBackdropPress = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={handleBackdropPress}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={[
            styles.calendarCard,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
          {/* Calendar Header */}
          <View style={styles.calendarHeader}>
            <Text
              style={[
                styles.calendarTitle,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Sélectionner la période
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Ionicons
                name="close"
                size={24}
                color={dark ? COLORS.white : COLORS.black}
              />
            </TouchableOpacity>
          </View>

          {/* Month Navigation */}
          <View style={styles.monthNavigation}>
            <TouchableOpacity
              style={[
                styles.calendarNavButton,
                {
                  backgroundColor: dark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                },
              ]}
              onPress={goToPreviousMonth}
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color={dark ? COLORS.white : COLORS.black}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.monthYearText,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {getMonthYear()}
            </Text>
            <TouchableOpacity
              style={[
                styles.calendarNavButton,
                {
                  backgroundColor: dark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                },
              ]}
              onPress={goToNextMonth}
            >
              <Ionicons
                name="chevron-forward"
                size={20}
                color={dark ? COLORS.white : COLORS.black}
              />
            </TouchableOpacity>
          </View>

          {/* Selection Info */}
          <View style={styles.selectionInfo}>
            <Text
              style={[
                styles.selectionInfoText,
                { color: dark ? COLORS.gray2 : COLORS.gray3 },
              ]}
            >
              {selectionMode === "start"
                ? "Sélectionnez la date de début"
                : "Sélectionnez la date de fin"}
            </Text>
            {(selectedStartDate || selectedEndDate) && (
              <Text
                style={[
                  styles.dateRangeText,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                {selectedStartDate ? formatDate(selectedStartDate) : ""}
                {selectedStartDate && selectedEndDate ? " - " : ""}
                {selectedEndDate ? formatDate(selectedEndDate) : ""}
              </Text>
            )}
          </View>

          {/* Week days header */}
          <View style={styles.weekDaysRow}>
            {weekDays.map((day, index) => (
              <Text
                key={index}
                style={[
                  styles.weekDayText,
                  { color: dark ? COLORS.gray2 : COLORS.gray3 },
                ]}
              >
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {generateCalendarDays().map((date, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.calendarDay,
                  date &&
                    isDateSelected(date) && [
                      styles.selectedCalendarDay,
                      { backgroundColor: COLORS.primary },
                    ],
                  !date && { opacity: 0 }, // Hide empty slots
                ]}
                onPress={() => date && handleDateSelect(date)}
                disabled={!date} // Disable empty slots
              >
                {date && (
                  <Text
                    style={[
                      styles.calendarDayText,
                      {
                        color: isDateSelected(date)
                          ? COLORS.white
                          : dark
                            ? COLORS.white
                            : COLORS.black,
                      },
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Calendar Actions */}
          <View style={styles.calendarActions}>
            <TouchableOpacity
              style={[styles.clearButton, styles.clearButtonStyle]}
              onPress={clearDates}
            >
              <Text style={styles.clearButtonText}>Effacer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.applyButton,
                styles.applyButtonStyle,
                !selectedStartDate && styles.disabledButton,
              ]}
              onPress={applyDateRange}
              disabled={!selectedStartDate}
            >
              <Text
                style={[
                  styles.applyButtonText,
                  !selectedStartDate && styles.disabledButtonText,
                ]}
              >
                Appliquer
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  calendarCard: {
    width: width - 40,
    padding: 16,
    borderRadius: 20,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontFamily: "bold",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  monthNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  calendarNavigation: {
    flexDirection: "row",
  },
  calendarNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  monthYearText: {
    fontSize: 16,
    fontFamily: "medium",
  },
  selectionInfo: {
    marginBottom: 16,
  },
  selectionInfoText: {
    fontSize: 14,
    fontFamily: "regular",
    marginBottom: 4,
  },
  dateRangeText: {
    fontSize: 15,
    fontFamily: "medium",
  },
  weekDaysRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  weekDayText: {
    fontSize: 12,
    fontFamily: "medium",
    width: 32,
    textAlign: "center",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  calendarDay: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
  selectedCalendarDay: {
    backgroundColor: COLORS.primary,
  },
  calendarDayText: {
    fontSize: 14,
    fontFamily: "medium",
  },
  calendarActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  clearButton: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.gray3,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  clearButtonStyle: {
    backgroundColor: "transparent",
  },
  clearButtonText: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.gray3,
  },
  applyButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  applyButtonStyle: {
    backgroundColor: COLORS.primary,
  },
  applyButtonText: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.white,
  },
  disabledButton: {
    backgroundColor: COLORS.gray3,
    opacity: 0.5,
  },
  disabledButtonText: {
    color: "rgba(255,255,255,0.7)",
  },
});

export default CalendarModal;
