import React from "react";
import { Image } from "expo-image";
import { icons, COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface Objective {
  id: string;
  title: string;
  description: string;
  subject: string;
  priority: string;
  startDate: string;
  endDate: string;
  status: string;
  progress: number;
}

interface ObjectiveCardProps {
  objective: Objective;
  onEdit: () => void;
  onDelete: () => void;
}

const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  onEdit,
  onDelete,
}) => {
  const { dark } = useTheme();

  // Determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Atteint":
        return COLORS.greeen;
      case "En cours":
        return COLORS.primary;
      case "Non atteint":
        return COLORS.error;
      default:
        return COLORS.gray;
    }
  };

  // Determine progress color based on percentage
  const getProgressColor = (value: number) => {
    if (value >= 75) return COLORS.greeen;
    if (value >= 50) return COLORS.primary;
    if (value >= 25) return COLORS.secondary;
    return COLORS.error;
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: dark ? COLORS.dark3 : COLORS.greyscale100 },
      ]}
    >
      {/* Title and Action Buttons */}
      <View style={styles.headerRow}>
        <Text
          style={[styles.title, { color: dark ? COLORS.white : COLORS.black }]}
        >
          {objective.title}
        </Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={onEdit} style={styles.editButton}>
            <Image source={icons.editPencil} style={styles.actionIcon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Image source={icons.trash} style={styles.actionIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Description */}
      <Text
        style={[
          styles.description,
          { color: dark ? COLORS.greyscale300 : COLORS.gray },
        ]}
      >
        {objective.description}
      </Text>

      {/* Subject and Priority */}
      <View style={styles.detailsRow}>
        <View style={styles.detailChip}>
          <Text style={styles.detailChipText}>{objective.subject}</Text>
        </View>

        <View
          style={[
            styles.detailChip,
            {
              backgroundColor:
                objective.priority === "Élevée"
                  ? COLORS.error
                  : objective.priority === "Moyenne"
                    ? COLORS.primary
                    : COLORS.secondary,
            },
          ]}
        >
          <Text style={styles.detailChipText}>
            Priorité: {objective.priority}
          </Text>
        </View>
      </View>

      {/* Dates */}
      <View style={styles.datesRow}>
        <Text
          style={[
            styles.dateText,
            { color: dark ? COLORS.greyscale300 : COLORS.gray },
          ]}
        >
          Du {objective.startDate}
        </Text>

        <Text
          style={[
            styles.dateText,
            { color: dark ? COLORS.greyscale300 : COLORS.gray },
          ]}
        >
          Au {objective.endDate}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressRow}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(objective.status) },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(objective.status) },
              ]}
            >
              {objective.status}
            </Text>
          </View>

          <Text
            style={[
              styles.progressText,
              { color: getProgressColor(objective.progress) },
            ]}
          >
            {objective.progress}%
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${objective.progress}%`,
                backgroundColor: getProgressColor(objective.progress),
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: COLORS.greyscale100,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: "bold",
    flex: 1,
    marginRight: 8,
  },
  actionButtons: {
    flexDirection: "row",
  },
  editButton: {
    padding: 4,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  actionIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.primary,
  },
  description: {
    fontSize: 14,
    fontFamily: "regular",
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  detailChip: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  detailChipText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "medium",
  },
  datesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dateText: {
    fontSize: 12,
    fontFamily: "regular",
  },
  progressSection: {
    marginTop: 4,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "medium",
  },
  progressText: {
    fontSize: 12,
    fontFamily: "bold",
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: COLORS.grayscale200,
    borderRadius: 3,
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
});

export default ObjectiveCard;
