import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";

const { width } = Dimensions.get("window");

interface UpcomingHomeworkCardProps {
  subject: string;
  title: string;
  dueDate: string;
  childName: string;
  progress: number;
  onPress: () => void;
}

const UpcomingHomeworkCard: React.FC<UpcomingHomeworkCardProps> = ({
  subject,
  title,
  dueDate,
  childName,
  progress,
  onPress,
}) => {
  // Function to get color based on due date
  const getDueDateColor = (date: string) => {
    if (date.toLowerCase() === "demain") return "#F44336"; // Red for due tomorrow
    if (date.includes("1") || date.includes("2")) return "#FF9800"; // Orange for due in 1-2 days
    return "#4CAF50"; // Green for due later
  };

  // Function to get color based on progress
  const getProgressColor = (value: number) => {
    if (value === 0) return "#BBBBBB"; // Grey for not started
    if (value < 50) return "#FF9800"; // Orange for in progress
    return "#4CAF50"; // Green for almost done
  };

  // Get the appropriate icon for the subject
  const getSubjectIcon = (subjectName: string) => {
    switch (subjectName.toLowerCase()) {
      case "mathématiques":
        return "calculator-outline";
      case "français":
        return "book-outline";
      case "histoire":
        return "time-outline";
      case "géographie":
        return "globe-outline";
      case "sciences":
        return "flask-outline";
      case "anglais":
        return "language-outline";
      default:
        return "document-text-outline";
    }
  };

  const dueDateColor = getDueDateColor(dueDate);
  const progressColor = getProgressColor(progress);
  const subjectIcon = getSubjectIcon(subject);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.topSection}>
        <View style={styles.subjectSection}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${COLORS.primary}15` },
            ]}
          >
            <Ionicons
              name={subjectIcon as any}
              size={22}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.subjectText}>{subject}</Text>
            <Text style={styles.titleText}>{title}</Text>
          </View>
        </View>

        <View
          style={[
            styles.dueDateBadge,
            { backgroundColor: `${dueDateColor}15` },
          ]}
        >
          <Text style={[styles.dueDateText, { color: dueDateColor }]}>
            {dueDate}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomSection}>
        <Text style={styles.childNameText}>{childName}</Text>

        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            {progress === 0
              ? "Non commencé"
              : progress < 50
                ? "En cours"
                : "Presque terminé"}
          </Text>

          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${Math.max(5, progress)}%`,
                  backgroundColor: progressColor,
                },
              ]}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    padding: 16,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  subjectSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  subjectText: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.primary,
    marginBottom: 2,
  },
  titleText: {
    fontSize: 16,
    fontFamily: "bold",
    color: "#333",
  },
  dueDateBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  dueDateText: {
    fontSize: 12,
    fontFamily: "medium",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginBottom: 12,
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  childNameText: {
    fontSize: 14,
    fontFamily: "medium",
    color: "#666",
  },
  progressSection: {
    flex: 1,
    marginLeft: 16,
  },
  progressText: {
    fontSize: 12,
    fontFamily: "regular",
    color: "#888",
    textAlign: "right",
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
});

export default UpcomingHomeworkCard;
