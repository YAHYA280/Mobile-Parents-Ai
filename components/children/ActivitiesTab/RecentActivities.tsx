import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, TYPOGRAPHY } from "@/constants/theme";
import { useTheme } from "@/theme/ThemeProvider";
import { Activity } from "@/types/interfaces";
import ActivityCard from "@/components/activities/ActivityCard";
import Card from "@/components/ui/Card";

interface RecentActivitiesProps {
  activities: Activity[];
  childId: number;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({
  activities,
  childId,
}) => {
  const router = useRouter();
  const { dark } = useTheme();

  // Navigate to activity details
  const handleActivityPress = (activityId: number | string) => {
    router.push(`./Enfants/Historique/${activityId}?childId=${childId}`);
  };

  // Navigate to all activities
  const viewAllActivities = () => {
    router.push(`./Enfants/Historique?childId=${childId}`);
  };

  return (
    <Card>
      <View style={styles.headerContainer}>
        <Text
          style={[
            styles.headerTitle,
            { color: dark ? COLORS.white : COLORS.black },
          ]}
        >
          Activités récentes
        </Text>

        <TouchableOpacity onPress={viewAllActivities}>
          <Text style={styles.viewAllText}>Voir tout</Text>
        </TouchableOpacity>
      </View>

      {activities.length > 0 ? (
        <>
          {activities.slice(0, 3).map((activity, index) => (
            <ActivityCard
              key={`recent-activity-${activity.id}`}
              activity={activity}
              onPress={() => handleActivityPress(activity.id)}
              index={index}
            />
          ))}

          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={viewAllActivities}
          >
            <Text style={styles.viewAllButtonText}>
              Voir toutes les activités
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="calendar-outline"
            size={60}
            color={dark ? COLORS.secondaryWhite : COLORS.gray3}
          />
          <Text
            style={[
              styles.emptyText,
              { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
            ]}
          >
            Aucune activité récente
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    fontWeight: "bold",
  },
  viewAllText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
  },
  viewAllButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  viewAllButtonText: {
    ...TYPOGRAPHY.button,
    color: "#FFFFFF",
    marginRight: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    ...TYPOGRAPHY.body1,
    marginTop: 16,
    textAlign: "center",
  },
});

export default RecentActivities;
