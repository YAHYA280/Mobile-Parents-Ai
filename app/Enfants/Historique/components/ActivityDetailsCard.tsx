import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Activity } from "../../../../data/Enfants/CHILDREN_DATA";
import { COLORS } from "../../../../constants/theme";
import ExerciseItem from "./ExerciseItem";
import RecommendationItem from "./RecommendationItem";

// Define the AssistantThemeObject type
export type AssistantThemeObject = {
  colors: [string, string];
  icon: IconDefinition;
};

interface ActivityDetailsCardProps {
  activity: Activity;
  formattedDate: string;
  blocageIdentified: boolean;
  assistantTheme: AssistantThemeObject;
  assistantName: string;
  getScoreColor: (score: string) => string;
}

const ActivityDetailsCard: React.FC<ActivityDetailsCardProps> = ({
  activity,
  formattedDate,
  blocageIdentified,
  assistantTheme,
  assistantName,
  getScoreColor,
}) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* En-tête avec type d'assistant */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <LinearGradient
          colors={assistantTheme.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 20,
          }}
        >
          <FontAwesomeIcon
            icon={assistantTheme.icon}
            size={16}
            color="#FFF"
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              color: "#FFF",
              fontWeight: "600",
              fontSize: 14,
            }}
          >
            {assistantName}
          </Text>
        </LinearGradient>

        <Text
          style={{
            color: COLORS.gray3,
            fontSize: 14,
          }}
        >
          {formattedDate}
        </Text>
      </View>

      {/* Titre de l'activité */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: COLORS.black,
          marginBottom: 16,
          lineHeight: 30,
        }}
      >
        {activity.activite}
      </Text>

      {/* Détails de l'activité */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginBottom: 16,
          gap: 8,
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.05)",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
          }}
        >
          <FontAwesomeIcon
            icon="clock"
            size={14}
            color={COLORS.gray3}
            style={{ marginRight: 6 }}
          />
          <Text
            style={{
              color: COLORS.gray3,
            }}
          >
            {activity.duree}
          </Text>
        </View>

        {activity.score && (
          <View
            style={{
              backgroundColor: `${getScoreColor(activity.score)}20`,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
            }}
          >
            <FontAwesomeIcon
              icon="star"
              size={14}
              color={getScoreColor(activity.score)}
              style={{ marginRight: 6 }}
            />
            <Text
              style={{
                color: getScoreColor(activity.score),
                fontWeight: "600",
              }}
            >
              {activity.score}
            </Text>
          </View>
        )}

        {activity.matiere && (
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.05)",
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
            }}
          >
            <FontAwesomeIcon
              icon="book"
              size={14}
              color={COLORS.gray3}
              style={{ marginRight: 6 }}
            />
            <Text
              style={{
                color: COLORS.gray3,
              }}
            >
              {activity.matiere}
            </Text>
          </View>
        )}

        {activity.chapitre && (
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.05)",
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
            }}
          >
            <FontAwesomeIcon
              icon="bookmark"
              size={14}
              color={COLORS.gray3}
              style={{ marginRight: 6 }}
            />
            <Text
              style={{
                color: COLORS.gray3,
              }}
            >
              {activity.chapitre}
            </Text>
          </View>
        )}
      </View>

      {/* Blocage warning */}
      {blocageIdentified && (
        <View
          style={{
            backgroundColor: "rgba(255, 59, 48, 0.1)",
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon
            icon="exclamation-triangle"
            size={16}
            color="#FF3B30"
            style={{ marginRight: 10 }}
          />
          <Text
            style={{
              color: "#FF3B30",
              fontSize: 14,
              flex: 1,
            }}
          >
            Point de blocage identifié pour cette activité. Une attention
            particulière est recommandée.
          </Text>
        </View>
      )}

      {/* Commentaires */}
      {activity.commentaires && (
        <View style={{ marginBottom: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <FontAwesomeIcon
              icon="comment-alt"
              size={16}
              color={COLORS.primary}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: COLORS.black,
              }}
            >
              Commentaires
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.03)",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <Text
              style={{
                color: COLORS.gray3,
                lineHeight: 22,
                fontSize: 15,
              }}
            >
              {activity.commentaires}
            </Text>
          </View>
        </View>
      )}

      {/* Recommandations */}
      {activity.recommandations && activity.recommandations.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <FontAwesomeIcon
              icon="lightbulb"
              size={16}
              color={COLORS.primary}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: COLORS.black,
              }}
            >
              Recommandations
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.03)",
              borderRadius: 12,
              padding: 16,
            }}
          >
            {activity.recommandations.map((rec, index) => (
              <RecommendationItem
                key={index}
                recommendation={rec}
                isLast={index === activity.recommandations!.length - 1}
              />
            ))}
          </View>
        </View>
      )}

      {/* Exercices */}
      {activity.exercices && activity.exercices.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <FontAwesomeIcon
              icon="tasks"
              size={16}
              color={COLORS.primary}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: COLORS.black,
              }}
            >
              Exercices
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.03)",
              borderRadius: 12,
              padding: 16,
            }}
          >
            {activity.exercices.map((ex, index) => (
              <ExerciseItem
                key={index}
                exercise={{
                  reussite: ex.reussite,
                  commentaire: ex.commentaire,
                }}
                index={index}
                isLast={index === activity.exercices!.length - 1}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default ActivityDetailsCard;
