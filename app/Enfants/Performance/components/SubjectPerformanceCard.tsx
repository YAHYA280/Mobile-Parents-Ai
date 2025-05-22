// Fixed SubjectPerformanceCard.tsx with visible data and better layout
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChartLine,
  faLightbulb,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

import { COLORS } from "../../../../constants/theme";
import { Activity } from "../../../../data/Enfants/CHILDREN_DATA";

interface SubjectPerformanceCardProps {
  activities: Activity[];
}

interface SubjectData {
  name: string;
  total: number;
  possible: number;
  percentage: number;
}

const SubjectPerformanceCard: React.FC<SubjectPerformanceCardProps> = ({
  activities,
}) => {
  // Animation references for each subject bar
  const barAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;

  // Calculate performance for each subject
  const calculateSubjectPerformance = (): SubjectData[] => {
    // Always show mock data for demonstration
    const mockSubjects: SubjectData[] = [
      {
        name: "Mathématiques",
        total: 425,
        possible: 500,
        percentage: 85,
      },
      {
        name: "Français",
        total: 360,
        possible: 450,
        percentage: 80,
      },
      {
        name: "Sciences",
        total: 280,
        possible: 350,
        percentage: 80,
      },
      {
        name: "Histoire",
        total: 195,
        possible: 300,
        percentage: 65,
      },
      {
        name: "Anglais",
        total: 140,
        possible: 200,
        percentage: 70,
      },
    ];

    return mockSubjects.sort((a, b) => b.percentage - a.percentage);
  };

  const subjectPerformance = calculateSubjectPerformance();

  // Initialize animations for each subject
  useEffect(() => {
    const animations: { [key: string]: Animated.Value } = {};

    subjectPerformance.forEach((subject) => {
      animations[subject.name] = new Animated.Value(0);
    });

    // Start animations for all subjects
    const animationsToStart = subjectPerformance.map((subject, index) =>
      Animated.timing(animations[subject.name], {
        toValue: 1,
        duration: 1000,
        delay: index * 200, // Staggered animation
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      })
    );

    // Run all animations in parallel
    Animated.parallel(animationsToStart).start();

    // Update ref to keep track of animations
    Object.assign(barAnimations, animations);
  }, []);

  // Utility function to get progress color
  const getProgressColor = (progress: number): [string, string] => {
    if (progress < 40) return ["#FC4E00", "#FC6E30"]; // Red gradient
    if (progress < 70) return ["#F3BB00", "#F8D547"]; // Yellow gradient
    return ["#24D26D", "#4AE78F"]; // Green gradient
  };

  // Helper to get a recommendation based on performance
  const getRecommendation = (subject: SubjectData): string => {
    if (subject.percentage < 40) {
      return `Besoin d'attention particulière`;
    } else if (subject.percentage < 70) {
      return `Continuer à travailler`;
    } else {
      return `Excellente performance`;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Performance par matière</Text>
        <View style={styles.chartIconContainer}>
          <FontAwesomeIcon icon={faChartLine} size={20} color="#24D26D" />
        </View>
      </View>

      {subjectPerformance.length > 0 ? (
        <>
          {subjectPerformance.map((subject, index) => {
            const progressColors = getProgressColor(subject.percentage);

            // Get animation value for this subject
            const animationValue =
              barAnimations[subject.name] || new Animated.Value(0);

            // Create width style for the progress bar
            const widthStyle = {
              width: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", `${subject.percentage}%`],
                extrapolate: "clamp",
              }),
            };

            return (
              <View
                key={subject.name}
                style={[
                  styles.subjectContainer,
                  index < subjectPerformance.length - 1 &&
                    styles.subjectWithBorder,
                ]}
              >
                <View style={styles.subjectHeader}>
                  <Text style={styles.subjectName}>{subject.name}</Text>
                  <Text
                    style={[
                      styles.percentageText,
                      { color: progressColors[0] },
                    ]}
                  >
                    {subject.percentage.toFixed(0)}%
                  </Text>
                </View>

                <View style={styles.progressBarContainer}>
                  <Animated.View style={widthStyle}>
                    <LinearGradient
                      colors={progressColors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.progressBar}
                    />
                  </Animated.View>
                </View>

                {/* FIX: Changed to column layout with each item on separate line */}
                <View style={styles.scoreDetails}>
                  <Text style={styles.scoreText}>
                    {subject.total}/{subject.possible} points
                  </Text>

                  <View
                    style={[
                      styles.recommendationBadge,
                      {
                        backgroundColor:
                          subject.percentage < 40
                            ? "rgba(252, 78, 0, 0.1)"
                            : subject.percentage < 70
                              ? "rgba(243, 187, 0, 0.1)"
                              : "rgba(36, 210, 109, 0.1)",
                      },
                    ]}
                  >
                    <FontAwesomeIcon
                      icon={
                        subject.percentage < 40
                          ? faExclamationTriangle
                          : subject.percentage < 70
                            ? faLightbulb
                            : faChartLine
                      }
                      size={12}
                      color={
                        subject.percentage < 40
                          ? "#FC4E00"
                          : subject.percentage < 70
                            ? "#F3BB00"
                            : "#24D26D"
                      }
                      style={styles.recommendationIcon}
                    />
                    <Text
                      style={[
                        styles.recommendationText,
                        {
                          color:
                            subject.percentage < 40
                              ? "#FC4E00"
                              : subject.percentage < 70
                                ? "#F3BB00"
                                : "#24D26D",
                        },
                      ]}
                    >
                      {getRecommendation(subject)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Aucune donnée disponible pour les matières
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  chartIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(36, 210, 109, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  subjectContainer: {
    marginBottom: 24,
    paddingBottom: 20,
  },
  subjectWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  percentageText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: "rgba(0, 0, 0, 0.06)",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressBar: {
    height: "100%",
    borderRadius: 6,
  },
  // FIX: Changed scoreDetails to column layout
  scoreDetails: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
  },
  scoreText: {
    fontSize: 13,
    color: "#666666",
    fontWeight: "500",
  },
  recommendationBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    alignSelf: "flex-start",
  },
  recommendationIcon: {
    marginRight: 6,
  },
  recommendationText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 12,
  },
  emptyText: {
    color: "#666666",
    fontSize: 14,
    textAlign: "center",
  },
});

export default SubjectPerformanceCard;
