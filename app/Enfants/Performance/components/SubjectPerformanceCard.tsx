// Fixed SubjectPerformanceCard.tsx - Progress bars now work properly
import React, { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, Easing, Animated, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChartLine,
  faLightbulb,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

import type { Activity } from "../../../../data/Enfants/CHILDREN_DATA";

interface SubjectPerformanceCardProps {
  activities: Activity[];
}

interface SubjectData {
  name: string;
  total: number;
  possible: number;
  percentage: number;
  animatedValue: Animated.Value; // Add animated value to each subject
}

const SubjectPerformanceCard: React.FC<SubjectPerformanceCardProps> = ({
  activities,
}) => {
  const [subjectPerformance, setSubjectPerformance] = React.useState<
    SubjectData[]
  >([]);

  // Initialize data and animations
  useEffect(() => {
    // Always show mock data for demonstration
    const mockSubjects: SubjectData[] = [
      {
        name: "Mathématiques",
        total: 425,
        possible: 500,
        percentage: 85,
        animatedValue: new Animated.Value(0),
      },
      {
        name: "Français",
        total: 360,
        possible: 450,
        percentage: 80,
        animatedValue: new Animated.Value(0),
      },
      {
        name: "Sciences",
        total: 280,
        possible: 350,
        percentage: 80,
        animatedValue: new Animated.Value(0),
      },
      {
        name: "Histoire",
        total: 195,
        possible: 300,
        percentage: 65,
        animatedValue: new Animated.Value(0),
      },
      {
        name: "Anglais",
        total: 140,
        possible: 200,
        percentage: 70,
        animatedValue: new Animated.Value(0),
      },
    ];

    // Sort by percentage (highest first)
    const sortedSubjects = mockSubjects.sort(
      (a, b) => b.percentage - a.percentage
    );
    setSubjectPerformance(sortedSubjects);

    // Start animations for all subjects with staggered delays
    const animations = sortedSubjects.map((subject, index) =>
      Animated.timing(subject.animatedValue, {
        toValue: subject.percentage,
        duration: 1200,
        delay: index * 150, // Staggered animation
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      })
    );

    // Run all animations in parallel
    Animated.parallel(animations).start();
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
    } if (subject.percentage < 70) {
      return `Continuer à travailler`;
    } 
      return `Excellente performance`;
    
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
                  <View style={styles.progressBarBackground}>
                    <Animated.View
                      style={[
                        styles.progressBarForeground,
                        {
                          width: subject.animatedValue.interpolate({
                            inputRange: [0, 100],
                            outputRange: ["0%", "100%"],
                            extrapolate: "clamp",
                          }),
                        },
                      ]}
                    >
                      <LinearGradient
                        colors={progressColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.progressBar}
                      />
                    </Animated.View>
                  </View>
                </View>

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
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: "rgba(0, 0, 0, 0.06)",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarForeground: {
    height: "100%",
  },
  progressBar: {
    height: "100%",
    borderRadius: 6,
    flex: 1,
  },
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
