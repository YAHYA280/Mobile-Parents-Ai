// components/aicalendar/RecommendationCard.tsx
import React from "react";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";

export interface AIRecommendation {
  id: string;
  type: "study" | "activity" | "review" | "break";
  title: string;
  subject?: string;
  duration: string;
  description: string;
  priority: "high" | "medium" | "low";
  childName: string;
  timeSlot: string;
}

interface RecommendationCardProps {
  recommendation: AIRecommendation;
  index: number;
  onPress: (recommendation: AIRecommendation) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  index,
  onPress,
}) => {
  const { dark } = useTheme();

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "study":
        return "book-outline";
      case "activity":
        return "game-controller-outline";
      case "review":
        return "refresh-outline";
      case "break":
        return "cafe-outline";
      default:
        return "time-outline";
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case "study":
        return "#2196F3";
      case "activity":
        return "#4CAF50";
      case "review":
        return "#FF9800";
      case "break":
        return "#9C27B0";
      default:
        return COLORS.primary;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#F44336";
      case "medium":
        return "#FF9800";
      case "low":
        return "#4CAF50";
      default:
        return COLORS.primary;
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{
        type: "spring",
        damping: 18,
        stiffness: 120,
        delay: index * 100,
      }}
    >
      <TouchableOpacity
        style={[
          styles.container,
          { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
        ]}
        onPress={() => onPress(recommendation)}
        activeOpacity={0.8}
      >
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: `${getRecommendationColor(recommendation.type)}15`,
              },
            ]}
          >
            <Ionicons
              name={getRecommendationIcon(recommendation.type) as any}
              size={20}
              color={getRecommendationColor(recommendation.type)}
            />
          </View>

          <View style={styles.info}>
            <View style={styles.titleRow}>
              <Text
                style={[
                  styles.title,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                {recommendation.title}
              </Text>
              <View
                style={[
                  styles.priorityBadge,
                  {
                    backgroundColor: `${getPriorityColor(recommendation.priority)}20`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.priorityText,
                    {
                      color: getPriorityColor(recommendation.priority),
                    },
                  ]}
                >
                  {recommendation.priority === "high"
                    ? "Priorité"
                    : recommendation.priority === "medium"
                      ? "Moyen"
                      : "Optionnel"}
                </Text>
              </View>
            </View>

            <View style={styles.details}>
              <View style={styles.detailItem}>
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={COLORS.primary}
                />
                <Text
                  style={[
                    styles.detailText,
                    {
                      color: dark ? COLORS.greyscale500 : COLORS.greyscale600,
                    },
                  ]}
                >
                  {recommendation.timeSlot}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons
                  name="hourglass-outline"
                  size={14}
                  color={COLORS.primary}
                />
                <Text
                  style={[
                    styles.detailText,
                    {
                      color: dark ? COLORS.greyscale500 : COLORS.greyscale600,
                    },
                  ]}
                >
                  {recommendation.duration}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons
                  name="person-outline"
                  size={14}
                  color={COLORS.primary}
                />
                <Text
                  style={[
                    styles.detailText,
                    {
                      color: dark ? COLORS.greyscale500 : COLORS.greyscale600,
                    },
                  ]}
                >
                  {recommendation.childName}
                </Text>
              </View>
            </View>
          </View>

          {/* <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
          </TouchableOpacity> */}
        </View>

        <Text
          style={[
            styles.description,
            {
              color: dark ? COLORS.greyscale400 : COLORS.greyScale700,
            },
          ]}
        >
          {recommendation.description}
        </Text>
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: "bold",
    flex: 1,
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontFamily: "bold",
    textTransform: "uppercase",
  },
  details: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    fontFamily: "medium",
    marginLeft: 4,
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: `${COLORS.primary}10`,
  },
  description: {
    fontSize: 14,
    fontFamily: "regular",
    lineHeight: 20,
  },
});

export default RecommendationCard;
