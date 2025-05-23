// components/enfants/historique/filtres/DateRangeIndicator.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCalendar, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

import { COLORS } from "@/constants/theme";

interface DateRangeIndicatorProps {
  activityDateRange: { startDate: string | null; endDate: string | null };
  setActivityDateRange: (value: {
    startDate: string | null;
    endDate: string | null;
  }) => void;
}

const DateRangeIndicator: React.FC<DateRangeIndicatorProps> = ({
  activityDateRange,
  setActivityDateRange,
}) => {
  if (!activityDateRange.startDate && !activityDateRange.endDate) return null;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const startDateFormatted = activityDateRange.startDate
    ? formatDate(activityDateRange.startDate)
    : "";
  const endDateFormatted = activityDateRange.endDate
    ? formatDate(activityDateRange.endDate)
    : "";

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <FontAwesomeIcon
          icon={faCalendar}
          color={COLORS.primary}
          size={16}
          style={styles.calendarIcon}
        />
        <Text style={styles.periodText}>
          Période: {startDateFormatted}
          {activityDateRange.endDate ? ` - ${endDateFormatted}` : ""}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => setActivityDateRange({ startDate: null, endDate: null })}
        style={styles.closeButton}
      >
        <FontAwesomeIcon
          icon={faTimesCircle}
          color={COLORS.primary}
          size={16}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0, 149, 255, 0.1)",
    borderRadius: 12,
    padding: 12,
    marginVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  calendarIcon: {
    marginRight: 10,
  },
  periodText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DateRangeIndicator;
