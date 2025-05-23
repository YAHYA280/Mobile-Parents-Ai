// components/aicalendar/MonthNavigation.tsx
import React from "react";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

import { COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";

interface MonthNavigationProps {
  selectedMonth: number;
  selectedYear: number;
  monthNames: string[];
  onMonthChange: (month: number, year: number) => void;
}

const MonthNavigation: React.FC<MonthNavigationProps> = ({
  selectedMonth,
  selectedYear,
  monthNames,
  onMonthChange,
}) => {
  const { dark } = useTheme();

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      onMonthChange(11, selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1, selectedYear);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      onMonthChange(0, selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1, selectedYear);
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: -10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 400, delay: 300 }}
      style={styles.container}
    >
      <TouchableOpacity style={styles.navButton} onPress={handlePreviousMonth}>
        <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
      </TouchableOpacity>

      <Text
        style={[
          styles.monthTitle,
          { color: dark ? COLORS.white : COLORS.black },
        ]}
      >
        {monthNames[selectedMonth]} {selectedYear}
      </Text>

      <TouchableOpacity style={styles.navButton} onPress={handleNextMonth}>
        <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: `${COLORS.primary}10`,
  },
  monthTitle: {
    fontSize: 20,
    fontFamily: "bold",
  },
});

export default MonthNavigation;
