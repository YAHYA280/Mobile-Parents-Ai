// components/aicalendar/CalendarGrid.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MotiView } from "moti";
import { COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";

export interface CalendarDay {
  date: number;
  isToday: boolean;
  isSelected: boolean;
  hasRecommendations: boolean;
  recommendations: any[];
}

interface CalendarGridProps {
  calendarDays: CalendarDay[];
  onDaySelect: (date: number) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  calendarDays,
  onDaySelect,
}) => {
  const { dark } = useTheme();

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 18, delay: 400 }}
      style={[
        styles.container,
        { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
      ]}
    >
      {/* Day headers */}
      <View style={styles.dayHeadersRow}>
        {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
          <Text
            key={day}
            style={[
              styles.dayHeader,
              { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
            ]}
          >
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar Days */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayCell,
              day.isToday && styles.todayCell,
              day.isSelected && styles.selectedCell,
              day.hasRecommendations && styles.hasRecommendationsCell,
            ]}
            onPress={() => day.date > 0 && onDaySelect(day.date)}
            disabled={day.date === 0}
          >
            {day.date > 0 && (
              <>
                <Text
                  style={[
                    styles.dayText,
                    day.isToday && styles.todayText,
                    day.isSelected && styles.selectedText,
                    {
                      color:
                        day.date === 0
                          ? "transparent"
                          : dark
                            ? COLORS.white
                            : COLORS.black,
                    },
                  ]}
                >
                  {day.date}
                </Text>
                {day.hasRecommendations && (
                  <View style={styles.recommendationDot} />
                )}
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dayHeadersRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  dayHeader: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "medium",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 8,
  },
  todayCell: {
    backgroundColor: `${COLORS.primary}20`,
    borderRadius: 20,
  },
  selectedCell: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  hasRecommendationsCell: {
    borderWidth: 2,
    borderColor: `${COLORS.primary}40`,
    borderRadius: 20,
  },
  dayText: {
    fontSize: 16,
    fontFamily: "medium",
  },
  todayText: {
    color: COLORS.primary,
    fontFamily: "bold",
  },
  selectedText: {
    color: "#FFFFFF",
    fontFamily: "bold",
  },
  recommendationDot: {
    position: "absolute",
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
});

export default CalendarGrid;
