// components/child/ChildPerformance.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { Child, SubjectPerformance } from "@/types/interfaces"; // Import the interfaces

interface ChildPerformanceProps {
  child: Child;
}

const ChildPerformance: React.FC<ChildPerformanceProps> = ({ child }) => {
  // Calculate subject performance data
  const getSubjectPerformance = (): SubjectPerformance[] => {
    // This would typically come from processing activities
    // Here we'll create mock data based on the child's strengths and weaknesses
    const subjectPerformance: SubjectPerformance[] = [];

    // Add strong subjects
    child.matieresFortes.forEach((subject: string) => {
      subjectPerformance.push({
        name: subject,
        progress: Math.floor(Math.random() * 20) + 80, // 80-100%
      });
    });

    // Add subjects to improve
    child.matieresAmeliorer.forEach((subject: string) => {
      subjectPerformance.push({
        name: subject.replace(/^\?/, "").trim(),
        progress: Math.floor(Math.random() * 30) + 40, // 40-70%
      });
    });

    return subjectPerformance;
  };

  const subjectPerformance: SubjectPerformance[] = getSubjectPerformance();

  return (
    <View style={styles.container}>
      {/* Performance Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Performance globale</Text>

        <View style={styles.overallProgressContainer}>
          <View style={styles.progressCircleContainer}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressValue}>{child.progress}</Text>
            </View>
          </View>
        </View>

        {/* Subject Performance */}
        <View style={styles.subjectsContainer}>
          <Text style={styles.subjectsTitle}>Performance par matière</Text>

          {subjectPerformance.map(
            (subject: SubjectPerformance, index: number) => (
              <View key={index} style={styles.subjectItem}>
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

                <View style={styles.subjectProgressBarContainer}>
                  <View
                    style={[
                      styles.subjectProgressBar,
                      {
                        width: `${subject.progress}%`,
                        backgroundColor: getProgressColor(subject.progress),
                      },
                    ]}
                  />
                </View>
              </View>
            )
          )}
        </View>
      </View>

      {/* Statistics Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Statistiques d'apprentissage</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="time" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Temps total</Text>
              <Text style={styles.statValue}>14h 30min</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons
                name="checkmark-done"
                size={24}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Activités terminées</Text>
              <Text style={styles.statValue}>
                {child.activitesRecentes.length}
              </Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="star" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Score moyen</Text>
              <Text style={styles.statValue}>78%</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Recommendations */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recommandations</Text>

        <View style={styles.recommendationsContainer}>
          <View style={styles.recommendationItem}>
            <Ionicons
              name="book"
              size={24}
              color={COLORS.primary}
              style={styles.recommendationIcon}
            />
            <Text style={styles.recommendationText}>
              Encourager plus de pratique en{" "}
              {child.matieresAmeliorer[0]?.replace(/^\?/, "").trim() ||
                "mathématiques"}
            </Text>
          </View>

          <View style={styles.recommendationItem}>
            <Ionicons
              name="time"
              size={24}
              color={COLORS.primary}
              style={styles.recommendationIcon}
            />
            <Text style={styles.recommendationText}>
              Établir une routine d'étude de 30 minutes par jour
            </Text>
          </View>

          <View style={styles.recommendationItem}>
            <Ionicons
              name="star"
              size={24}
              color={COLORS.primary}
              style={styles.recommendationIcon}
            />
            <Text style={styles.recommendationText}>
              Féliciter les progrès en {child.matieresFortes[0] || "français"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Helper function to get color based on progress value
const getProgressColor = (value: number): string => {
  if (value >= 75) return "#4CAF50"; // Green
  if (value >= 50) return "#FFC107"; // Yellow
  if (value >= 25) return "#FF9800"; // Orange
  return "#F44336"; // Red
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
  },
  overallProgressContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  progressCircleContainer: {
    padding: 16,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,142,105,0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 8,
    borderColor: COLORS.primary,
  },
  progressValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  subjectsContainer: {
    marginBottom: 8,
  },
  subjectsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 16,
  },
  subjectItem: {
    marginBottom: 16,
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 14,
    color: "#333333",
  },
  subjectProgress: {
    fontSize: 14,
    fontWeight: "bold",
  },
  subjectProgressBarContainer: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  subjectProgressBar: {
    height: "100%",
    borderRadius: 4,
  },
  statsContainer: {
    marginBottom: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,142,105,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  recommendationsContainer: {
    marginBottom: 8,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  recommendationIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  recommendationText: {
    fontSize: 16,
    color: "#333333",
    flex: 1,
    lineHeight: 24,
  },
});

export default ChildPerformance;
