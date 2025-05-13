// components/children/PerformanceTab/index.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import PerformanceChart from "@/components/children/SuiviTab/PerformanceChart";
import SubjectProgress from "@/components/children/SuiviTab/SubjectProgress";
import Card from "@/components/ui/Card";
import { COLORS, TYPOGRAPHY, RADIUS } from "@/constants/theme";

interface PerformanceTabProps {
  childId: number;
  childData: any;
}

const PerformanceTab: React.FC<PerformanceTabProps> = ({
  childId,
  childData,
}) => {
  // Performance data
  const performanceData = {
    progress: childData.progress,
    evolutionRate: 5, // Mock evolution rate
    subjects: [
      // Strong subjects
      ...childData.matieresFortes.map((subject: any) => ({
        name: subject,
        progress: 75 + Math.floor(Math.random() * 25), // Random value between 75-100
      })),
      // Subjects to improve
      ...childData.matieresAmeliorer.map((subject: any) => ({
        name: subject.replace(/^\?/, "").trim(),
        progress: 25 + Math.floor(Math.random() * 40), // Random value between 25-65
      })),
    ],
  };

  // Time spent per subject (in minutes)
  const timeSpentData = [
    { subject: childData.matieresFortes[0], minutes: 120 },
    { subject: childData.matieresFortes[1] || "Histoire", minutes: 90 },
    {
      subject: childData.matieresAmeliorer[0].replace(/^\?/, "").trim(),
      minutes: 60,
    },
  ];

  // Calculate total time
  const totalMinutes = timeSpentData.reduce(
    (total, data) => total + data.minutes,
    0
  );

  return (
    <View style={styles.container}>
      {/* Global Performance Chart */}
      <PerformanceChart
        progress={performanceData.progress}
        evolutionRate={performanceData.evolutionRate}
      />

      {/* Subject Progress */}
      <SubjectProgress subjects={performanceData.subjects} />

      {/* Time Distribution */}
      <Card style={styles.timeCard}>
        <Text style={styles.timeCardTitle}>Temps par matière</Text>
        <Text style={styles.timeTotal}>
          Total: {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}min
        </Text>

        <View style={styles.timeBarsContainer}>
          {timeSpentData.map((data, index) => {
            const percentage = (data.minutes / totalMinutes) * 100;
            const barColor =
              index === 0 ? "#4CAF50" : index === 1 ? "#2196F3" : "#FF9800";

            return (
              <MotiView key={index} style={styles.timeBarItem}>
                <View style={styles.timeBarHeader}>
                  <Text style={styles.timeBarSubject}>{data.subject}</Text>
                  <Text style={styles.timeBarValue}>
                    {Math.floor(data.minutes / 60)}h {data.minutes % 60}min
                  </Text>
                </View>

                <View style={styles.timeBarContainer}>
                  <MotiView
                    from={{ width: "0%" }}
                    animate={{ width: `${percentage}%` }}
                    transition={{
                      type: "timing",
                      duration: 1000,
                      delay: 300 + index * 100,
                    }}
                    style={[styles.timeBar, { backgroundColor: barColor }]}
                  />
                </View>

                <Text style={styles.timeBarPercentage}>
                  {percentage.toFixed(0)}%
                </Text>
              </MotiView>
            );
          })}
        </View>
      </Card>

      {/* Recommendations */}
      <Card style={styles.recommendationsCard}>
        <Text style={styles.recommendationsTitle}>Recommandations</Text>

        <View style={styles.recommendationsList}>
          <View style={styles.recommendationItem}>
            <View
              style={[
                styles.recommendationIcon,
                { backgroundColor: "#4CAF5020" },
              ]}
            >
              <Ionicons name="trending-up" size={20} color="#4CAF50" />
            </View>
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationText}>
                Continuer à développer les compétences en{" "}
                {childData.matieresFortes[0]}
              </Text>
            </View>
          </View>

          <View style={styles.recommendationItem}>
            <View
              style={[
                styles.recommendationIcon,
                { backgroundColor: "#F4433620" },
              ]}
            >
              <Ionicons name="alert-circle" size={20} color="#F44336" />
            </View>
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationText}>
                Consacrer plus de temps à{" "}
                {childData.matieresAmeliorer[0].replace(/^\?/, "").trim()}
              </Text>
            </View>
          </View>

          <View style={styles.recommendationItem}>
            <View
              style={[
                styles.recommendationIcon,
                { backgroundColor: "#2196F320" },
              ]}
            >
              <Ionicons name="time" size={20} color="#2196F3" />
            </View>
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationText}>
                Prévoir des sessions d'étude plus régulières pour améliorer la
                rétention
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  timeCard: {
    marginTop: 16,
    padding: 16,
  },
  timeCardTitle: {
    ...TYPOGRAPHY.h3,
    fontWeight: "bold",
    marginBottom: 8,
  },
  timeTotal: {
    ...TYPOGRAPHY.subtitle2,
    color: COLORS.gray3,
    marginBottom: 16,
  },
  timeBarsContainer: {
    marginTop: 8,
  },
  timeBarItem: {
    marginBottom: 16,
  },
  timeBarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  timeBarSubject: {
    ...TYPOGRAPHY.body1,
  },
  timeBarValue: {
    ...TYPOGRAPHY.body2,
    color: COLORS.gray3,
  },
  timeBarContainer: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 4,
  },
  timeBar: {
    height: "100%",
    borderRadius: 5,
  },
  timeBarPercentage: {
    ...TYPOGRAPHY.caption,
    alignSelf: "flex-end",
    color: COLORS.gray3,
  },
  recommendationsCard: {
    marginTop: 16,
    padding: 16,
  },
  recommendationsTitle: {
    ...TYPOGRAPHY.h3,
    fontWeight: "bold",
    marginBottom: 16,
  },
  recommendationsList: {
    gap: 12,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  recommendationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationText: {
    ...TYPOGRAPHY.body1,
    lineHeight: 22,
  },
});

export default PerformanceTab;
