// components/cards/ActivityCard.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from "@/constants/theme";
import { Activity } from "@/data/Enfants/CHILDREN_DATA";

interface ActivityCardProps {
  activity: Activity;
  onPress: () => void;
  index: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onPress,
  index,
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  // Determine colors based on activity type/assistant
  const getAssistantColors = (assistant: string = "Autre") => {
    switch (assistant.toLowerCase()) {
      case "j'apprends":
        return "#4CAF50";
      case "recherche":
        return "#2196F3";
      case "accueil":
        return "#FF9800";
      default:
        return "#9C27B0";
    }
  };

  // Get assistant icon
  const getAssistantIcon = (assistant: string = "Autre"): string => {
    switch (assistant.toLowerCase()) {
      case "j'apprends":
        return "school-outline";
      case "recherche":
        return "search-outline";
      case "accueil":
        return "home-outline";
      default:
        return "apps-outline";
    }
  };

  const assistantColor = getAssistantColors(activity.assistant);
  const assistantIcon = getAssistantIcon(activity.assistant);
  const formattedDate = formatDate(activity.date);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.dateColumn}>
        <Text style={styles.dateDay}>{formattedDate.split(" ")[0]}</Text>
        <Text style={styles.dateMonth}>{formattedDate.split(" ")[1]}</Text>
        <View
          style={[
            styles.activityIndicator,
            { backgroundColor: assistantColor },
          ]}
        />
      </View>

      <View style={styles.contentColumn}>
        <View style={styles.headerRow}>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: `${assistantColor}20` },
            ]}
          >
            <Ionicons
              name={assistantIcon as any}
              size={14}
              color={assistantColor}
            />
            <Text style={[styles.typeText, { color: assistantColor }]}>
              {activity.assistant || "Autre"}
            </Text>
          </View>

          {activity.score && (
            <View style={styles.scoreContainer}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.scoreText}>{activity.score}</Text>
            </View>
          )}
        </View>

        <Text style={styles.activityTitle} numberOfLines={2}>
          {activity.activite}
        </Text>

        <View style={styles.metadataRow}>
          <View style={styles.metadataItem}>
            <Ionicons name="time-outline" size={12} color="#757575" />
            <Text style={styles.metadataText}>{activity.duree}</Text>
          </View>

          {activity.matiere && (
            <View style={styles.metadataItem}>
              <Ionicons name="book-outline" size={12} color="#757575" />
              <Text style={styles.metadataText}>{activity.matiere}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.detailsButton} onPress={onPress}>
          <Text style={styles.detailsText}>Voir les détails</Text>
          <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  dateColumn: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.02)",
    paddingVertical: 16,
    position: "relative",
  },
  dateDay: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  dateMonth: {
    fontSize: 12,
    color: "#757575",
    textTransform: "uppercase",
  },
  activityIndicator: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  contentColumn: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333333",
    marginLeft: 4,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  metadataRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metadataText: {
    fontSize: 12,
    color: "#757575",
    marginLeft: 4,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  detailsText: {
    fontSize: 12,
    color: COLORS.primary,
    marginRight: 4,
  },
});

export default ActivityCard;
