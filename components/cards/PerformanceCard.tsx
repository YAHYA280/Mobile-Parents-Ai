// components/cards/PerformanceCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { TYPOGRAPHY, SPACING, RADIUS, COLORS } from "@/constants/theme";

interface SubjectPerformance {
  name: string;
  progress: number;
}

interface PerformanceCardProps {
  overallProgress: number;
  subjects: SubjectPerformance[];
  index?: number;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({
  overallProgress,
  subjects,
  index = 0,
}) => {
  // Function to determine color based on progress
  const getProgressColor = (value: number) => {
    if (value >= 75) return "#4CAF50"; // Green
    if (value >= 50) return "#FFC107"; // Yellow
    if (value >= 25) return "#FF9800"; // Orange
    return "#F44336"; // Red
  };

  const progressColor = getProgressColor(overallProgress);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", damping: 18, delay: index * 100 }}
      style={styles.container}
    >
      <LinearGradient
        colors={[progressColor, lightenColor(progressColor, 15)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>Performance Globale</Text>

        <View style={styles.circularProgress}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressValue}>{overallProgress}%</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.contentContainer}>
        <Text style={styles.subjectsTitle}>Performance par matière</Text>

        {subjects.map((subject, idx) => (
          <View key={idx} style={styles.subjectItem}>
            <View style={styles.subjectHeader}>
              <Text style={styles.subjectName}>{subject.name}</Text>
              <Text
                style={[
                  styles.subjectProgress,
                  { color: getProgressColor(subject.progress) },
                ]}
              >
                {subject.progress}%
              </Text>
            </View>

            <View style={styles.progressBarContainer}>
              <MotiView
                from={{ width: "0%" }}
                animate={{ width: `${subject.progress}%` }}
                transition={{
                  type: "timing",
                  duration: 1000,
                  delay: 300 + idx * 100,
                }}
                style={[
                  styles.progressBar,
                  { backgroundColor: getProgressColor(subject.progress) },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </MotiView>
  );
};

// Helper function to lighten a color
const lightenColor = (color: string, amount: number) => {
  // Simple implementation for demo
  return color;
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  headerGradient: {
    padding: 24,
    alignItems: "center",
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  circularProgress: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 6,
    borderColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressValue: {
    ...TYPOGRAPHY.h1,
    color: "#FFFFFF",
  },
  contentContainer: {
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  subjectsTitle: {
    ...TYPOGRAPHY.h3,
    color: "#333",
    marginBottom: 16,
  },
  subjectItem: {
    marginBottom: 16,
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  subjectName: {
    ...TYPOGRAPHY.subtitle1,
    color: "#333",
  },
  subjectProgress: {
    ...TYPOGRAPHY.subtitle1,
    fontFamily: "bold",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
});

export default PerformanceCard;
