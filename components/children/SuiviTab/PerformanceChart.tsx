import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { COLORS, TYPOGRAPHY } from "@/constants/theme";
import { useTheme } from "@/theme/ThemeProvider";
import Card from "@/components/ui/Card";

interface PerformanceChartProps {
  progress: number | string;
  evolutionRate?: number;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  progress,
  evolutionRate,
}) => {
  const { dark } = useTheme();

  // Normalize progress to number
  const progressValue =
    typeof progress === "string"
      ? parseFloat(progress.replace("%", ""))
      : progress;

  // Get progress color
  const getProgressColor = (value: number) => {
    if (value >= 75) return "#4CAF50"; // Green
    if (value >= 50) return "#FFC107"; // Yellow
    if (value >= 25) return "#FF9800"; // Orange
    return "#F44336"; // Red
  };

  const progressColor = getProgressColor(progressValue);

  return (
    <Card>
      <Text
        style={[styles.title, { color: dark ? COLORS.white : COLORS.black }]}
      >
        Performance globale
      </Text>

      <View style={styles.chartContainer}>
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
          style={styles.circleContainer}
        >
          <View style={[styles.circle, { borderColor: progressColor }]}>
            <Text style={[styles.progressText, { color: progressColor }]}>
              {typeof progress === "string" ? progress : `${progress}%`}
            </Text>

            {evolutionRate !== undefined && (
              <Text
                style={[
                  styles.evolutionText,
                  {
                    color: evolutionRate >= 0 ? "#4CAF50" : "#F44336",
                  },
                ]}
              >
                {evolutionRate >= 0 ? "+" : ""}
                {evolutionRate}%
              </Text>
            )}
          </View>
        </MotiView>
      </View>

      {evolutionRate !== undefined && (
        <View style={styles.evolutionContainer}>
          <Text
            style={[
              styles.evolutionLabel,
              { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
            ]}
          >
            Évolution par rapport à la période précédente
          </Text>
          <Text
            style={[
              styles.evolutionValue,
              {
                color: evolutionRate >= 0 ? "#4CAF50" : "#F44336",
              },
            ]}
          >
            {evolutionRate >= 0 ? "+" : ""}
            {evolutionRate}%
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    ...TYPOGRAPHY.h3,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  circleContainer: {
    padding: 16,
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    ...TYPOGRAPHY.h1,
    fontWeight: "bold",
  },
  evolutionText: {
    ...TYPOGRAPHY.subtitle2,
    marginTop: 4,
  },
  evolutionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  evolutionLabel: {
    ...TYPOGRAPHY.body2,
  },
  evolutionValue: {
    ...TYPOGRAPHY.subtitle1,
    fontWeight: "bold",
  },
});

export default PerformanceChart;
