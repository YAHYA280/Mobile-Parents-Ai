import React from "react";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { COLORS } from "@/constants";

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
  // Determine status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Atteint":
        return {
          color: "#4CAF50",
          icon: "checkmark-circle",
          bgColor: "#4CAF5015",
        };
      case "En cours":
        return {
          color: COLORS.primary,
          icon: "time",
          bgColor: `${COLORS.primary}15`,
        };
      case "Non atteint":
      case "Non commencé":
        return {
          color: "#FF9500",
          icon: "pause-circle",
          bgColor: "#FF950015",
        };
      default:
        return {
          color: COLORS.gray,
          icon: "help-circle",
          bgColor: `${COLORS.gray}15`,
        };
    }
  };

  // Determine priority color and gradient
  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case "Élevée":
        return {
          colors: ["#FF6B6B", "#FF8E53"],
          textColor: COLORS.white,
        };
      case "Moyenne":
        return {
          colors: [COLORS.primary, COLORS.primary],
          textColor: COLORS.white,
        };
      case "Basse":
        return {
          colors: ["#4CAF50", "#66BB6A"],
          textColor: COLORS.white,
        };
      default:
        return {
          colors: [COLORS.gray, COLORS.gray],
          textColor: COLORS.white,
        };
    }
  };

  // Determine progress color based on percentage
  const getProgressColor = (value: number) => {
    if (value >= 75) return "#4CAF50";
    if (value >= 50) return COLORS.primary;
    if (value >= 25) return "#FF9500";
    return "#FF6B6B";
  };

  const statusInfo = getStatusInfo(objective.status);
  const priorityInfo = getPriorityInfo(objective.priority);

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 15 }}
      style={[
        styles.container,
        {
          backgroundColor: COLORS.white,
          borderColor: COLORS.greyscale300,
        },
        Platform.OS === "ios" && styles.iosShadow,
      ]}
    >
      {/* Header with Status Badge */}
      <View style={styles.headerSection}>
        <View style={styles.statusBadge}>
          <View
            style={[
              styles.statusContainer,
              { backgroundColor: statusInfo.bgColor },
            ]}
          >
            <Ionicons
              name={statusInfo.icon as any}
              size={14}
              color={statusInfo.color}
            />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {objective.status}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={onEdit}
            style={styles.editButton}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={["#FF9500", "#FFB84D"]}
              style={styles.actionButtonGradient}
            >
              <Ionicons name="pencil" size={14} color={COLORS.white} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDelete}
            style={styles.deleteButton}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={["#FF6B6B", "#FF8E53"]}
              style={styles.actionButtonGradient}
            >
              <Ionicons name="trash" size={14} color={COLORS.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: COLORS.black }]} numberOfLines={2}>
        {objective.title}
      </Text>

      {/* Description */}
      <Text
        style={[styles.description, { color: COLORS.gray }]}
        numberOfLines={3}
      >
        {objective.description}
      </Text>

      {/* Subject and Priority Chips */}
      <View style={styles.chipsRow}>
        <View style={styles.subjectChip}>
          <Ionicons name="school" size={12} color={COLORS.primary} />
          <Text style={[styles.subjectText, { color: COLORS.primary }]}>
            {objective.subject}
          </Text>
        </View>

        <TouchableOpacity style={styles.priorityChip} activeOpacity={0.8}>
          <LinearGradient
            colors={priorityInfo.colors as any}
            style={styles.priorityGradient}
          >
            <Ionicons name="flag" size={12} color={priorityInfo.textColor} />
            <Text
              style={[styles.priorityText, { color: priorityInfo.textColor }]}
            >
              {objective.priority}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Dates Section */}
      <View style={styles.datesSection}>
        <View style={styles.dateItem}>
          <Ionicons name="play" size={12} color={COLORS.gray} />
          <Text style={[styles.dateText, { color: COLORS.gray }]}>
            {objective.startDate}
          </Text>
        </View>

        <View style={styles.dateSeparator}>
          <View style={styles.separatorLine} />
          <Ionicons name="arrow-forward" size={12} color={COLORS.gray} />
          <View style={styles.separatorLine} />
        </View>

        <View style={styles.dateItem}>
          <Ionicons name="flag" size={12} color={COLORS.gray} />
          <Text style={[styles.dateText, { color: COLORS.gray }]}>
            {objective.endDate}
          </Text>
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: COLORS.black }]}>
            Progression
          </Text>
          <View style={styles.progressPercentage}>
            <Text
              style={[
                styles.progressText,
                { color: getProgressColor(objective.progress) },
              ]}
            >
              {objective.progress}%
            </Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <MotiView
            from={{ width: "0%" }}
            animate={{ width: `${Math.max(2, objective.progress)}%` }}
            transition={{ type: "timing", duration: 1000, delay: 300 }}
            style={[
              styles.progressBar,
              { backgroundColor: getProgressColor(objective.progress) },
            ]}
          />
        </View>
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  iosShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    flex: 1,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 12,
    fontFamily: "semibold",
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    borderRadius: 14,
    overflow: "hidden",
  },
  deleteButton: {
    borderRadius: 14,
    overflow: "hidden",
  },
  actionButtonGradient: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontFamily: "bold",
    marginBottom: 8,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    fontFamily: "regular",
    marginBottom: 16,
    lineHeight: 20,
  },
  chipsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  subjectChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${COLORS.primary}30`,
  },
  subjectText: {
    fontSize: 12,
    fontFamily: "semibold",
    marginLeft: 4,
  },
  priorityChip: {
    borderRadius: 16,
    overflow: "hidden",
  },
  priorityGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  priorityText: {
    fontSize: 12,
    fontFamily: "semibold",
    marginLeft: 4,
  },
  datesSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
    backgroundColor: `${COLORS.primary}08`,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dateText: {
    fontSize: 11,
    fontFamily: "medium",
    marginLeft: 6,
  },
  dateSeparator: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  separatorLine: {
    width: 8,
    height: 1,
    backgroundColor: COLORS.greyscale300,
  },
  progressSection: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: "semibold",
  },
  progressPercentage: {
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 12,
    fontFamily: "bold",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.grayscale200,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
});

export default ObjectiveCard;
