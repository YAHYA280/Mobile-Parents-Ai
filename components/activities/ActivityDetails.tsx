import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, RADIUS } from "@/constants/theme";

interface ActivityDetailsProps {
  activity: any;
  onChatPress: () => void;
  onVideoPress: () => void;
}

const ActivityDetails: React.FC<ActivityDetailsProps> = ({
  activity,
  onChatPress,
  onVideoPress,
}) => {
  // Get subject theme
  const getSubjectTheme = (subject: string = "Autre") => {
    const themes: Record<string, { colors: string[]; icon: string }> = {
      Mathématiques: {
        colors: ["#2196F3", "#1565C0"],
        icon: "calculator-outline",
      },
      Français: {
        colors: ["#4CAF50", "#2E7D32"],
        icon: "book-outline",
      },
      Histoire: {
        colors: ["#FF9800", "#F57C00"],
        icon: "time-outline",
      },
      Sciences: {
        colors: ["#9C27B0", "#7B1FA2"],
        icon: "flask-outline",
      },
      Autre: {
        colors: ["#607D8B", "#455A64"],
        icon: "school-outline",
      },
    };

    return themes[subject] || themes.Autre;
  };

  // Get assistant theme
  const getAssistantTheme = (assistant: string = "Autre") => {
    const themes: Record<string, { colors: string[]; icon: string }> = {
      "J'Apprends": {
        colors: ["#4CAF50", "#2E7D32"],
        icon: "school-outline",
      },
      Recherche: {
        colors: ["#2196F3", "#1565C0"],
        icon: "search-outline",
      },
      Accueil: {
        colors: ["#FF9800", "#F57C00"],
        icon: "home-outline",
      },
      Autre: {
        colors: ["#9C27B0", "#7B1FA2"],
        icon: "apps-outline",
      },
    };

    return themes[assistant] || themes.Autre;
  };

  const subjectTheme = getSubjectTheme(activity.matiere);
  const assistantTheme = getAssistantTheme(activity.assistant);

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Limit conversation preview
  const limitedConversation = activity.conversation
    ? activity.conversation.slice(0, 2)
    : [];

  return (
    <View style={[styles.container, { backgroundColor: COLORS.white }]}>
      {/* Header with type and date */}
      <View style={styles.header}>
        <LinearGradient
          colors={assistantTheme.colors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.assistantBadge}
        >
          <Ionicons
            name={assistantTheme.icon as any}
            size={14}
            color="#FFFFFF"
            style={styles.assistantIcon}
          />
          <Text style={styles.assistantText}>{activity.assistant}</Text>
        </LinearGradient>

        <Text style={[styles.dateText, { color: COLORS.gray3 }]}>
          {formatDate(activity.date)}
        </Text>
      </View>

      {/* Title with subject icon */}
      <View style={styles.titleContainer}>
        <LinearGradient
          colors={subjectTheme.colors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.subjectIconContainer}
        >
          <Ionicons name={subjectTheme.icon as any} size={16} color="#FFFFFF" />
        </LinearGradient>

        <Text style={[styles.title, { color: COLORS.black }]} numberOfLines={2}>
          {activity.activite}
        </Text>
      </View>

      {/* Activity details */}
      <View
        style={[
          styles.detailsContainer,
          {
            backgroundColor: "rgba(0,0,0,0.03)",
          },
        ]}
      >
        <View style={styles.detailItem}>
          <Ionicons
            name="time-outline"
            size={16}
            color={COLORS.primary}
            style={styles.detailIcon}
          />
          <Text style={[styles.detailText, { color: COLORS.gray3 }]}>
            Durée: {activity.duree}
          </Text>
        </View>

        {activity.score && (
          <View style={styles.detailItem}>
            <Ionicons
              name="star-outline"
              size={16}
              color={COLORS.primary}
              style={styles.detailIcon}
            />
            <Text style={[styles.detailText, { color: COLORS.gray3 }]}>
              Score: {activity.score}
            </Text>
          </View>
        )}

        {activity.difficulty && (
          <View style={styles.detailItem}>
            <Ionicons
              name="stats-chart-outline"
              size={16}
              color={COLORS.primary}
              style={styles.detailIcon}
            />
            <Text style={[styles.detailText, { color: COLORS.gray3 }]}>
              Difficulté: {activity.difficulty}
            </Text>
          </View>
        )}
      </View>

      {/* Comments section */}
      {activity.commentaires && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS.black }]}>
            Commentaires
          </Text>
          <View
            style={[
              styles.commentContainer,
              {
                backgroundColor: "rgba(0,0,0,0.03)",
              },
            ]}
          >
            <Text style={[styles.commentText, { color: COLORS.black }]}>
              {activity.commentaires}
            </Text>
          </View>
        </View>
      )}

      {/* Recommendations section */}
      {activity.recommandations && activity.recommandations.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS.black }]}>
            Recommandations
          </Text>
          {activity.recommandations.map((rec: string, index: number) => (
            <View key={index} style={styles.recommendationItem}>
              <Ionicons
                name="checkmark-circle"
                size={18}
                color="#4CAF50"
                style={styles.recommendationIcon}
              />
              <Text
                style={[styles.recommendationText, { color: COLORS.black }]}
              >
                {rec}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Chat preview */}
      {activity.conversation && activity.conversation.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: COLORS.black }]}>
              Conversation
            </Text>
            <TouchableOpacity onPress={onChatPress}>
              <Text style={styles.viewAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.chatContainer,
              {
                backgroundColor: "rgba(0,0,0,0.03)",
              },
            ]}
          >
            {limitedConversation.map((msg: any, idx: number) => (
              <View
                key={idx}
                style={[
                  styles.chatBubble,
                  msg.sender === "assistant"
                    ? styles.assistantBubble
                    : styles.userBubble,
                  {
                    backgroundColor:
                      msg.sender === "assistant"
                        ? "rgba(33, 150, 243, 0.1)"
                        : "#E1E1E1",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chatText,
                    {
                      color:
                        msg.sender === "assistant"
                          ? COLORS.primary
                          : COLORS.black,
                    },
                  ]}
                >
                  {msg.message}
                </Text>
                <Text style={styles.chatTimestamp}>{msg.timestamp}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.viewButton, { backgroundColor: COLORS.primary }]}
            onPress={onChatPress}
          >
            <Text style={styles.viewButtonText}>
              Voir la conversation complète
            </Text>
            <Ionicons name="chatbubbles-outline" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* Educational resources */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: COLORS.black }]}>
          Ressources pédagogiques
        </Text>

        <TouchableOpacity
          style={[
            styles.resourceButton,
            {
              backgroundColor: "rgba(0,0,0,0.03)",
            },
          ]}
          onPress={onVideoPress}
        >
          <Ionicons
            name="play-circle-outline"
            size={24}
            color={COLORS.primary}
            style={styles.resourceIcon}
          />

          <View style={styles.resourceContent}>
            <Text style={[styles.resourceTitle, { color: COLORS.black }]}>
              Vidéo explicative - {activity.matiere || "Sujet"}
            </Text>
            <Text style={[styles.resourceSubtitle, { color: COLORS.gray3 }]}>
              Ressource complémentaire
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color={COLORS.gray3} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  assistantBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  assistantIcon: {
    marginRight: 6,
  },
  assistantText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  dateText: {
    fontSize: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  subjectIconContainer: {
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  detailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  detailIcon: {
    marginRight: 4,
  },
  detailText: {
    fontSize: 14,
  },
  section: {
    marginTop: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  viewAllText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  commentContainer: {
    borderRadius: 8,
    padding: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
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
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  chatContainer: {
    borderRadius: 8,
    padding: 12,
  },
  chatBubble: {
    padding: 12,
    borderRadius: 12,
    maxWidth: "80%",
    marginBottom: 8,
  },
  assistantBubble: {
    alignSelf: "flex-start",
    borderTopLeftRadius: 4,
  },
  userBubble: {
    alignSelf: "flex-end",
    borderTopRightRadius: 4,
  },
  chatText: {
    fontSize: 14,
    lineHeight: 20,
  },
  chatTimestamp: {
    fontSize: 10,
    color: "rgba(0, 0, 0, 0.5)",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  viewButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginRight: 8,
  },
  resourceButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    padding: 12,
  },
  resourceIcon: {
    marginRight: 12,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  resourceSubtitle: {
    fontSize: 12,
  },
});

export default ActivityDetails;
