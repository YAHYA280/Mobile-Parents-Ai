// components/child/ChildOverview.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS } from "@/constants/theme";
import ActivityCard from "@/components/cards/ActivityCard";
import { Child, Activity } from "@/types/interfaces"; // Import the interfaces

interface ChildOverviewProps {
  child: Child;
}

const ChildOverview: React.FC<ChildOverviewProps> = ({ child }) => {
  const router = useRouter();

  // Navigate to activity details
  const handleActivityPress = (activityId: string | number) => {
    router.push(
      `/Enfants/Historique/historydetails?activityId=${activityId}&childId=${child.id}`
    );
  };

  // Navigate to full activity history
  const viewAllActivities = () => {
    router.push(`/Enfants/Historique/home?childId=${child.id}`);
  };

  return (
    <View style={styles.container}>
      {/* Strengths & Weaknesses */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Matières</Text>
        </View>

        <View style={styles.strengthsContainer}>
          <View style={styles.strengthsColumn}>
            <Text style={styles.columnTitle}>Points forts</Text>
            {child.matieresFortes.map((matiere: string, index: number) => (
              <View key={index} style={styles.strengthItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="#4CAF50"
                  style={styles.strengthIcon}
                />
                <Text style={styles.strengthText}>{matiere}</Text>
              </View>
            ))}
          </View>

          <View style={styles.strengthsColumn}>
            <Text style={styles.columnTitle}>À améliorer</Text>
            {child.matieresAmeliorer.map((matiere: string, index: number) => (
              <View key={index} style={styles.improvementItem}>
                <Ionicons
                  name="alert-circle"
                  size={20}
                  color="#F44336"
                  style={styles.improvementIcon}
                />
                <Text style={styles.improvementText}>
                  {matiere.replace(/^\?/, "").trim()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Recent Activities */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Activités récentes</Text>
          <TouchableOpacity onPress={viewAllActivities}>
            <Text style={styles.viewAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {child.activitesRecentes
          .slice(0, 3)
          .map((activity: Activity, index: number) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onPress={() => handleActivityPress(activity.id)}
              index={index}
            />
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  strengthsContainer: {
    flexDirection: "row",
  },
  strengthsColumn: {
    flex: 1,
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#757575",
    marginBottom: 12,
  },
  strengthItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  strengthIcon: {
    marginRight: 8,
  },
  strengthText: {
    fontSize: 14,
    color: "#333333",
    flex: 1,
  },
  improvementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  improvementIcon: {
    marginRight: 8,
  },
  improvementText: {
    fontSize: 14,
    color: "#333333",
    flex: 1,
  },
});

export default ChildOverview;
