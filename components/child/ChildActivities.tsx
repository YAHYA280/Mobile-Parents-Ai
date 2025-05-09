// components/child/ChildActivities.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import ActivityCard from "@/components/cards/ActivityCard";
import { Child, Activity } from "@/types/interfaces"; // Import the interfaces

interface ChildActivitiesProps {
  child: Child;
}

const ChildActivities: React.FC<ChildActivitiesProps> = ({ child }) => {
  const router = useRouter();

  // Handle activity press
  const handleActivityPress = (activityId: string | number) => {
    router.push(
      `/Enfants/Historique/historydetails?activityId=${activityId}&childId=${child.id}`
    );
  };

  // View all activities history
  const viewAllActivities = () => {
    router.push(`/Enfants/Historique/home?childId=${child.id}`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.viewAllButton}
        onPress={viewAllActivities}
      >
        <Text style={styles.viewAllButtonText}>Voir tout l'historique</Text>
        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      {child.activitesRecentes.length > 0 ? (
        child.activitesRecentes.map((activity: Activity, index: number) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onPress={() => handleActivityPress(activity.id)}
            index={index}
          />
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color="#CCCCCC" />
          <Text style={styles.emptyText}>Aucune activité récente</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  viewAllButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
  },
});

export default ChildActivities;
