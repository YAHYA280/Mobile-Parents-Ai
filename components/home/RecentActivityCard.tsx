import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";

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
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={score ? "checkmark-circle" : "time-outline"}
          size={26}
          color={score ? "#4CAF50" : COLORS.primary}
        />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.childName}>{childName}</Text>
          <Text style={styles.timeText}>{time}</Text>
        </View>

        <Text style={styles.activityText}>{activity}</Text>

        {score && (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Score:</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.03)",
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
    marginBottom: 4,
  },
  childName: {
    fontSize: 15,
    fontFamily: "bold",
    color: "#333",
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
    marginBottom: 4,
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
    marginRight: 4,
  },
  scoreValue: {
    fontSize: 13,
    fontFamily: "bold",
    color: "#4CAF50",
  },
});

export default RecentActivityCard;
