// components/cards/ActivityCard.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { TYPOGRAPHY, SPACING, RADIUS, COLORS } from "@/constants/theme";

interface ActivityCardProps {
  activity: {
    id: number;
    activite: string;
    date: string;
    duree: string;
    score?: string;
    assistant?: string;
    matiere?: string;
    commentaires?: string;
    recommandations?: string[];
  };
  onPress: () => void;
  index: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onPress,
  index,
}) => {
  // Determine colors based on activity type/assistant
  const getAssistantColors = (assistant: string = "Autre") => {
    switch (assistant.toLowerCase()) {
      case "j'apprends":
        return ["#4CAF50", "#2E7D32"];
      case "recherche":
        return ["#2196F3", "#1565C0"];
      case "accueil":
        return ["#FF9800", "#F57C00"];
      default:
        return ["#9C27B0", "#7B1FA2"];
    }
  };

  // Get assistant icon
  const getAssistantIcon = (assistant: string = "Autre") => {
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

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const assistantColors = getAssistantColors(activity.assistant);
  const assistantIcon = getAssistantIcon(activity.assistant);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", damping: 18, delay: index * 100 }}
      style={styles.container}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={styles.touchable}
      >
        <LinearGradient
          colors={assistantColors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              <Ionicons name={assistantIcon} size={20} color="#FFFFFF" />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.assistantType}>
                {activity.assistant || "Assistant"}
              </Text>
              <Text style={styles.dateText}>{formatDate(activity.date)}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.contentContainer}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>{activity.activite}</Text>
            {activity.matiere && (
              <View style={styles.subjectBadge}>
                <Text style={styles.subjectText}>{activity.matiere}</Text>
              </View>
            )}
          </View>

          <View style={styles.metadataContainer}>
            <View style={styles.metadataItem}>
              <Ionicons name="time-outline" size={16} color={COLORS.primary} />
              <Text style={styles.metadataText}>{activity.duree}</Text>
            </View>

            {activity.score && (
              <View style={styles.metadataItem}>
                <Ionicons
                  name="star-outline"
                  size={16}
                  color={COLORS.primary}
                />
                <Text style={styles.metadataText}>{activity.score}</Text>
              </View>
            )}
          </View>

          {activity.commentaires && (
            <View style={styles.commentContainer}>
              <Text style={styles.commentText}>{activity.commentaires}</Text>
            </View>
          )}

          {activity.recommandations && activity.recommandations.length > 0 && (
            <View style={styles.recommendationsContainer}>
              <Text style={styles.recommendationsTitle}>Recommandations:</Text>
              {activity.recommandations.map((rec, idx) => (
                <View key={idx} style={styles.recommendationItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={COLORS.primary}
                    style={styles.recommendationIcon}
                  />
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.actionContainer}>
            <Text style={styles.actionText}>Voir les détails</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
          </View>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  touchable: {
    flex: 1,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
  },
  headerGradient: {
    padding: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  assistantType: {
    ...TYPOGRAPHY.subtitle1,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  dateText: {
    ...TYPOGRAPHY.caption,
    color: "rgba(255,255,255,0.8)",
  },
  contentContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  activityHeader: {
    marginBottom: 12,
  },
  activityTitle: {
    ...TYPOGRAPHY.h3,
    color: "#333",
    marginBottom: 8,
  },
  subjectBadge: {
    alignSelf: "flex-start",
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.xxl,
  },
  subjectText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
  },
  metadataContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metadataText: {
    ...TYPOGRAPHY.body2,
    color: "#666",
    marginLeft: 4,
  },
  commentContainer: {
    backgroundColor: "rgba(0,0,0,0.03)",
    padding: 12,
    borderRadius: RADIUS.md,
    marginBottom: 16,
  },
  commentText: {
    ...TYPOGRAPHY.body2,
    color: "#555",
    fontStyle: "italic",
  },
  recommendationsContainer: {
    marginBottom: 16,
  },
  recommendationsTitle: {
    ...TYPOGRAPHY.subtitle2,
    color: "#333",
    marginBottom: 8,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  recommendationIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    ...TYPOGRAPHY.body2,
    color: "#555",
    flex: 1,
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${COLORS.primary}10`,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: RADIUS.xxl,
    alignSelf: "center",
  },
  actionText: {
    ...TYPOGRAPHY.button,
    color: COLORS.primary,
    marginRight: 8,
  },
});

export default ActivityCard;
