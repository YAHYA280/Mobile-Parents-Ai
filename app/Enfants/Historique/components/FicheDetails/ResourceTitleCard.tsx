// components/enfants/historique/ResourceTitleCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { COLORS } from "@/constants/theme";

interface ResourceTitleCardProps {
  title: string;
  subject: string;
  difficulty: "Facile" | "Moyen" | "Difficile";
  duration: string;
  description: string;
}

const ResourceTitleCard: React.FC<ResourceTitleCardProps> = ({
  title,
  subject,
  difficulty,
  duration,
  description,
}) => {
  // Helper function to get color based on difficulty
  const getDifficultyColor = (difficultyLevel: string) => {
    switch (difficultyLevel) {
      case "Facile":
        return "#24D26D";
      case "Moyen":
        return "#F3BB00";
      case "Difficile":
        return "#FC4E00";
      default:
        return "#24D26D";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.badgesContainer}>
        <View style={styles.subjectBadge}>
          <FontAwesomeIcon
            icon="book"
            size={14}
            color={COLORS.gray3}
            style={styles.badgeIcon}
          />
          <Text style={styles.subjectText}>{subject}</Text>
        </View>

        <View
          style={[
            styles.difficultyBadge,
            { backgroundColor: `${getDifficultyColor(difficulty)}20` },
          ]}
        >
          <View
            style={[
              styles.difficultyDot,
              { backgroundColor: getDifficultyColor(difficulty) },
            ]}
          />
          <Text
            style={[
              styles.difficultyText,
              { color: getDifficultyColor(difficulty) },
            ]}
          >
            {difficulty}
          </Text>
        </View>

        <View style={styles.durationBadge}>
          <FontAwesomeIcon
            icon="clock"
            size={14}
            color={COLORS.gray3}
            style={styles.badgeIcon}
          />
          <Text style={styles.durationText}>{duration}</Text>
        </View>
      </View>

      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 16,
  },
  badgesContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  subjectBadge: {
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  durationBadge: {
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  badgeIcon: {
    marginRight: 6,
  },
  subjectText: {
    color: COLORS.gray3,
    fontWeight: "500",
    fontSize: 14,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  difficultyText: {
    fontWeight: "600",
    fontSize: 14,
  },
  durationText: {
    color: COLORS.gray3,
    fontWeight: "500",
    fontSize: 14,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.gray3,
  },
});

export default ResourceTitleCard;
