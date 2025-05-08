// components/cards/EnhancedActivityCard.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { TYPOGRAPHY, COLORS, RADIUS } from "@/constants/theme";
import { useTheme } from "@/theme/ThemeProvider";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
    completion?: number; // Percentage of completion (0-100)
    difficulty?: "Facile" | "Moyen" | "Difficile";
  };
  onPress: () => void;
  onChatPress?: () => void; // Optional callback to directly open chat
  index: number;
  compact?: boolean; // If true, show a more compact version
}

const EnhancedActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onPress,
  onChatPress,
  index,
  compact = false,
}) => {
  const { dark } = useTheme();

  // Determine colors based on activity type/assistant
  const getAssistantColors = (assistant: string = "Autre") => {
    switch (assistant.toLowerCase()) {
      case "j'apprends":
        return ["#4CAF50", "#2E7D32"]; // Green
      case "recherche":
        return ["#2196F3", "#1565C0"]; // Blue
      case "accueil":
        return ["#FF9800", "#F57C00"]; // Orange
      default:
        return ["#9C27B0", "#7B1FA2"]; // Purple
    }
  };

  // Get assistant icon
  const getAssistantIcon = (assistant: string = "Autre") => {
    switch (assistant.toLowerCase()) {
      case "j'apprends":
        return "school";
      case "recherche":
        return "search";
      case "accueil":
        return "home";
      default:
        return "apps";
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    // For compact mode, use short format
    if (compact) {
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      });
    }

    // Full format
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Get difficulty color and label
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "Facile":
        return "#4CAF50"; // Green
      case "Moyen":
        return "#FF9800"; // Orange
      case "Difficile":
        return "#F44336"; // Red
      default:
        return "#607D8B"; // Blue Grey
    }
  };

  const assistantColors = getAssistantColors(activity.assistant);
  const assistantIcon = getAssistantIcon(activity.assistant);

  // Calculate completion percentage for display
  const completionPercentage = activity.completion || 100; // Default to 100% if not provided

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: "spring",
        damping: 18,
        delay: index * 80,
        stiffness: 100,
      }}
      style={styles.container}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[
          styles.card,
          { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
        ]}
      >
        <LinearGradient
          colors={assistantColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.cardHeader, compact && styles.compactCardHeader]}
        >
          <View style={styles.headerContent}>
            <View style={styles.assistantContainer}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={assistantIcon}
                  size={compact ? 16 : 20}
                  color="#FFFFFF"
                />
              </View>

              <View style={styles.headerInfo}>
                <Text
                  style={[styles.assistantType, compact && styles.compactText]}
                >
                  {activity.assistant || "Assistant"}
                </Text>
                <Text style={styles.dateText}>{formatDate(activity.date)}</Text>
              </View>
            </View>

            {activity.score && !compact && (
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{activity.score}</Text>
              </View>
            )}
          </View>

          {/* Progress bar indicating completion */}
          {!compact && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${completionPercentage}%` },
                  ]}
                />
              </View>
            </View>
          )}
        </LinearGradient>

        <View style={styles.cardContent}>
          <View style={styles.titleContainer}>
            <Text
              style={[
                styles.activityTitle,
                { color: dark ? COLORS.white : COLORS.black },
                compact && styles.compactTitle,
              ]}
              numberOfLines={compact ? 1 : 2}
            >
              {activity.activite}
            </Text>

            {activity.difficulty && !compact && (
              <View
                style={[
                  styles.difficultyBadge,
                  {
                    backgroundColor:
                      getDifficultyColor(activity.difficulty) + "20",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    { color: getDifficultyColor(activity.difficulty) },
                  ]}
                >
                  {activity.difficulty}
                </Text>
              </View>
            )}
          </View>

          {activity.matiere && (
            <View
              style={[
                styles.subjectBadge,
                compact && styles.compactSubjectBadge,
                {
                  backgroundColor: dark
                    ? "rgba(255,255,255,0.1)"
                    : `${COLORS.primary}15`,
                },
              ]}
            >
              <Text
                style={[
                  styles.subjectText,
                  { color: dark ? COLORS.white : COLORS.primary },
                ]}
              >
                {activity.matiere}
              </Text>
            </View>
          )}

          <View style={styles.metadataContainer}>
            <View style={styles.metadataItem}>
              <Ionicons
                name="time-outline"
                size={compact ? 14 : 16}
                color={COLORS.primary}
              />
              <Text
                style={[
                  styles.metadataText,
                  { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                  compact && styles.compactMetadata,
                ]}
              >
                {activity.duree}
              </Text>
            </View>

            {activity.score && compact && (
              <View style={styles.metadataItem}>
                <Ionicons
                  name="star-outline"
                  size={compact ? 14 : 16}
                  color={COLORS.primary}
                />
                <Text
                  style={[
                    styles.metadataText,
                    { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                    compact && styles.compactMetadata,
                  ]}
                >
                  {activity.score}
                </Text>
              </View>
            )}
          </View>

          {!compact && activity.commentaires && (
            <View
              style={[
                styles.commentContainer,
                {
                  backgroundColor: dark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.03)",
                },
              ]}
            >
              <Text
                style={[
                  styles.commentText,
                  { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                ]}
                numberOfLines={2}
              >
                {activity.commentaires}
              </Text>
            </View>
          )}

          {!compact &&
            activity.recommandations &&
            activity.recommandations.length > 0 && (
              <View style={styles.recommendationsContainer}>
                <Text
                  style={[
                    styles.recommendationsTitle,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  Recommandations:
                </Text>
                {activity.recommandations.slice(0, 2).map((rec, idx) => (
                  <View key={idx} style={styles.recommendationItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={COLORS.primary}
                      style={styles.recommendationIcon}
                    />
                    <Text
                      style={[
                        styles.recommendationText,
                        { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                      ]}
                      numberOfLines={1}
                    >
                      {rec}
                    </Text>
                  </View>
                ))}
                {activity.recommandations.length > 2 && (
                  <Text
                    style={[
                      styles.moreRecommendations,
                      { color: COLORS.primary },
                    ]}
                  >
                    +{activity.recommandations.length - 2} autres...
                  </Text>
                )}
              </View>
            )}

          <View style={styles.actionContainer}>
            <Text style={[styles.viewDetailsText, { color: COLORS.primary }]}>
              Voir les détails
            </Text>

            <View style={styles.actionButtons}>
              {onChatPress && (
                <TouchableOpacity
                  style={[
                    styles.chatButton,
                    { backgroundColor: `${COLORS.primary}15` },
                  ]}
                  onPress={onChatPress}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={18}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              )}

              <Ionicons
                name="chevron-forward"
                size={compact ? 16 : 18}
                color={COLORS.primary}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    borderRadius: RADIUS.lg,
    overflow: "hidden",
  },
  cardHeader: {
    padding: 16,
  },
  compactCardHeader: {
    padding: 12,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  assistantContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  compactText: {
    fontSize: 14,
  },
  dateText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  scoreContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  scoreText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBackground: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
  cardContent: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  compactTitle: {
    fontSize: 16,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "600",
  },
  subjectBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.xxl,
    marginBottom: 12,
  },
  compactSubjectBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  subjectText: {
    fontSize: 13,
    fontWeight: "500",
  },
  metadataContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metadataText: {
    fontSize: 14,
    marginLeft: 4,
  },
  compactMetadata: {
    fontSize: 12,
  },
  commentContainer: {
    padding: 12,
    borderRadius: RADIUS.md,
    marginBottom: 12,
  },
  commentText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  recommendationsContainer: {
    marginBottom: 12,
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  recommendationIcon: {
    marginRight: 6,
    marginTop: 2,
  },
  recommendationText: {
    fontSize: 13,
    flex: 1,
  },
  moreRecommendations: {
    fontSize: 13,
    alignSelf: "flex-end",
    marginTop: 4,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
});

export default EnhancedActivityCard;
