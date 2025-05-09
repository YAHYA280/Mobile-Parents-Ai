// app/Enfants/[id]/suivi.tsx
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { COLORS } from "@/constants/theme";
import { CHILDREN_DATA } from "@/data/Enfants/CHILDREN_DATA";

export default function ChildTrackingScreen() {
  const { id } = useLocalSearchParams();
  const childId = Number(id);
  const [child, setChild] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Generate mock subject performance data
  const getSubjectPerformance = (strengths: string[], weaknesses: string[]) => {
    return [
      ...strengths.map((subject) => ({
        name: subject,
        progress: Math.floor(Math.random() * 15) + 75, // 75-90%
      })),
      ...weaknesses.map((subject) => ({
        name: subject.replace(/^\?/, "").trim(),
        progress: Math.floor(Math.random() * 25) + 40, // 40-65%
      })),
    ];
  };

  useEffect(() => {
    // Fetch child data
    const foundChild = CHILDREN_DATA.find((c) => c.id === childId);
    setChild(foundChild);
    setLoading(false);
  }, [childId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!child) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Enfant non trouvé</Text>
        </View>
      </SafeAreaView>
    );
  }

  const subjectPerformance = getSubjectPerformance(
    child.matieresFortes,
    child.matieresAmeliorer
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Suivi de performance</Text>
        </View>

        {/* Overall Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance globale</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressText}>{child.progress}</Text>
            </View>
          </View>
        </View>

        {/* Subject Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance par matière</Text>

          {subjectPerformance.map((subject, index) => (
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

              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${subject.progress}%`,
                      backgroundColor: getProgressColor(subject.progress),
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Activity Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistiques d'apprentissage</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {child.activitesRecentes.length}
              </Text>
              <Text style={styles.statLabel}>Activités</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>14h</Text>
              <Text style={styles.statLabel}>Temps total</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Trophées</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper function to get color based on progress value
function getProgressColor(value: number): string {
  if (value >= 75) return "#4CAF50"; // Green
  if (value >= 50) return "#FFC107"; // Yellow
  if (value >= 25) return "#FF9800"; // Orange
  return "#F44336"; // Red
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#333",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
  },
  header: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 8,
    borderColor: COLORS.primary,
  },
  progressText: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
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
    fontSize: 16,
    color: "#333",
  },
  subjectProgress: {
    fontSize: 16,
    fontWeight: "bold",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#757575",
  },
});
