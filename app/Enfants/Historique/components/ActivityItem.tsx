import type { IconProp } from "@fortawesome/fontawesome-svg-core";

// Historique home component/ActivityItem.tsx
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import type { Activity } from "../../../../data/Enfants/CHILDREN_DATA";

import { COLORS } from "../../../../constants/theme";

interface ActivityItemProps {
  item: Activity;
  index: number;
  onViewDetails: (activity: Activity) => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  item,
  index,
  onViewDetails,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("fr-FR", { month: "short" }),
      weekday: date.toLocaleDateString("fr-FR", { weekday: "short" }),
      full: date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
  };

  const getScoreColor = (score: string) => {
    if (!score || !score.includes("/")) return COLORS.primary;

    const [achieved, total] = score.split("/").map(Number);
    const percentage = (achieved / total) * 100;

    if (percentage < 30) return "#FC4E00"; // Rouge
    if (percentage <= 50) return "#EBB016"; // Orange
    if (percentage <= 70) return "#F3BB00"; // Jaune
    return "#24D26D"; // Vert
  };

  const formattedDate = formatDate(item.date);
  const assistant = item.assistant || "Autre";
  const assistantColors: { [key: string]: [string, string] } = {
    "J'Apprends": ["#4CAF50", "#2E7D32"],
    Recherche: ["#2196F3", "#1565C0"],
    Accueil: ["#FF9800", "#F57C00"],
    Autre: ["#9C27B0", "#7B1FA2"],
  };
  const colors = assistantColors[assistant] || assistantColors.Autre;

  return (
    <TouchableOpacity
      onPress={() => onViewDetails(item)}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        overflow: "hidden",
      }}
    >
      {/* Top Bar with Assistant Type */}
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingVertical: 4,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "500",
            color: "#FFFFFF",
          }}
        >
          {assistant}
        </Text>
      </LinearGradient>

      <View style={{ padding: 16 }}>
        {/* Date and Content */}
        <View style={{ flexDirection: "row" }}>
          {/* Date Column */}
          <View style={{ alignItems: "center", marginRight: 16 }}>
            <LinearGradient
              colors={colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "#FFFFFF",
                }}
              >
                {formattedDate.day}
              </Text>
            </LinearGradient>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: "#666666",
                textTransform: "capitalize",
              }}
            >
              {formattedDate.month}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#9E9E9E",
                textTransform: "capitalize",
              }}
            >
              {formattedDate.weekday}
            </Text>
          </View>

          {/* Content Column */}
          <View style={{ flex: 1 }}>
            {/* Activity Title */}
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#333333",
                marginBottom: 10,
                lineHeight: 22,
              }}
            >
              {item.activite}
            </Text>

            {/* Tags Section */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginBottom: 12,
                gap: 8,
              }}
            >
              {/* Duration */}
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,0.05)",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon
                  icon={"clock" as IconProp}
                  size={12}
                  color="#666666"
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={{
                    color: "#666666",
                    fontSize: 12,
                  }}
                >
                  {item.duree}
                </Text>
              </View>

              {/* Score if available */}
              {item.score && (
                <View
                  style={{
                    backgroundColor: `${getScoreColor(item.score)}20`,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <FontAwesomeIcon
                    icon={"star" as IconProp}
                    size={12}
                    color={getScoreColor(item.score)}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={{
                      color: getScoreColor(item.score),
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    {item.score}
                  </Text>
                </View>
              )}

              {/* Subject if available */}
              {item.matiere && (
                <View
                  style={{
                    backgroundColor: "rgba(0,0,0,0.05)",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <FontAwesomeIcon
                    icon={"book" as IconProp}
                    size={12}
                    color="#666666"
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={{
                      color: "#666666",
                      fontSize: 12,
                    }}
                  >
                    {item.matiere}
                  </Text>
                </View>
              )}
            </View>

            {/* Comments if any */}
            {item.commentaires && (
              <View
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.03)",
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    color: "#666666",
                    lineHeight: 18,
                  }}
                >
                  {item.commentaires.length > 100
                    ? `${item.commentaires.substring(0, 100)}...`
                    : item.commentaires}
                </Text>
              </View>
            )}

            {/* View Details Button */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: `${colors[0]}15`,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                }}
                onPress={() => onViewDetails(item)}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "500",
                    color: colors[0],
                    marginRight: 4,
                  }}
                >
                  Voir les détails
                </Text>
                <FontAwesomeIcon
                  icon={"chevron-right" as IconProp}
                  color={colors[0]}
                  size={12}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ActivityItem;
