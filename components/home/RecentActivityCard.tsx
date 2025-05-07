import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";

const { width } = Dimensions.get("window");

interface RecentActivityCardProps {
  childName: string;
  activity: string;
  time: string;
  score: string | null;
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  childName,
  activity,
  time,
  score,
}) => {
  // Determine icon based on activity type (could be more sophisticated in a real app)
  const getActivityIcon = () => {
    if (activity.toLowerCase().includes("terminé")) {
      return "checkmark-circle";
    } else if (activity.toLowerCase().includes("commencé")) {
      return "play-circle-outline";
    } else {
      return "time-outline";
    }
  };

  // Determine card left border color based on activity
  const getActivityColor = () => {
    if (score) {
      const scoreValue = parseInt(score);
      if (scoreValue >= 80) return "#4CAF50";
      if (scoreValue >= 60) return "#2196F3";
      if (scoreValue >= 40) return "#FFC107";
      return "#FF5722";
    }

    if (activity.toLowerCase().includes("terminé")) {
      return "#4CAF50";
    } else if (activity.toLowerCase().includes("commencé")) {
      return "#2196F3";
    } else {
      return COLORS.primary;
    }
  };

  const activityIcon = getActivityIcon();
  const activityColor = getActivityColor();

  return (
    <MotiView
      from={{ opacity: 0, translateX: -10 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "timing", duration: 400 }}
    >
      <View style={[styles.container, { borderLeftColor: activityColor }]}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${activityColor}15` },
          ]}
        >
          <Ionicons name={activityIcon} size={24} color={activityColor} />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.childName}>{childName}</Text>
            <View style={styles.timeContainer}>
              <Ionicons
                name="time-outline"
                size={12}
                color="#888"
                style={styles.timeIcon}
              />
              <Text style={styles.timeText}>Il y a {time}</Text>
            </View>
          </View>

          <Text style={styles.activityText}>{activity}</Text>

          {score && (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Score:</Text>
              <View
                style={[
                  styles.scoreBadge,
                  { backgroundColor: `${activityColor}15` },
                ]}
              >
                <Text style={[styles.scoreValue, { color: activityColor }]}>
                  {score}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 4,
  },
  iconContainer: {
    marginRight: 16,
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  childName: {
    fontSize: 16,
    fontFamily: "bold",
    color: "#333",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeIcon: {
    marginRight: 4,
  },
  timeText: {
    fontSize: 12,
    fontFamily: "regular",
    color: "#888",
  },
  activityText: {
    fontSize: 14,
    fontFamily: "regular",
    color: "#444",
    marginBottom: 8,
    lineHeight: 20,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  scoreLabel: {
    fontSize: 13,
    fontFamily: "medium",
    color: "#666",
    marginRight: 8,
  },
  scoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreValue: {
    fontSize: 13,
    fontFamily: "bold",
  },
});

export default RecentActivityCard;
