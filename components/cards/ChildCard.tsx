// components/cards/ChildCard.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from "@/constants/theme";
import GradientCard from "./GradientCard";

interface ChildCardProps {
  child: {
    id: number;
    name: string;
    age: number;
    classe: string;
    progress: string;
    profileImage: any;
    matieresFortes: string[];
    matieresAmeliorer: string[];
  };
  onPress: () => void;
  index?: number;
}

const ChildCard: React.FC<ChildCardProps> = ({ child, onPress, index = 0 }) => {
  const progressValue = parseFloat(child.progress.replace("%", ""));

  // Function to determine progress color
  const getProgressColor = (value: number) => {
    if (value >= 75) return "#4CAF50"; // Green
    if (value >= 50) return "#FFC107"; // Yellow
    if (value >= 25) return "#FF9800"; // Orange
    return "#F44336"; // Red
  };

  const progressColor = getProgressColor(progressValue);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.container}
    >
      <GradientCard
        colors={[progressColor, getAdjustedColor(progressColor, 15)]}
        index={index}
      >
        <View style={styles.cardContent}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={child.profileImage}
                style={styles.avatar}
                contentFit="cover"
              />
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.name}>{child.name}</Text>
              <Text style={styles.classInfo}>
                {child.classe} • {child.age} ans
              </Text>

              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>Progression globale</Text>
                <View style={styles.progressBarContainer}>
                  <MotiView
                    from={{ width: "0%" }}
                    animate={{ width: `${progressValue}%` }}
                    transition={{ type: "timing", duration: 1000, delay: 300 }}
                    style={[styles.progressBar, { backgroundColor: "white" }]}
                  />
                </View>
                <Text style={styles.progressValue}>{child.progress}</Text>
              </View>
            </View>
          </View>

          <View style={styles.subjectsContainer}>
            <View style={styles.subjectSection}>
              <Text style={styles.subjectSectionTitle}>Points forts</Text>
              <View style={styles.tagContainer}>
                {child.matieresFortes.map((matiere, idx) => (
                  <View key={idx} style={[styles.tag, styles.strongTag]}>
                    <Ionicons
                      name="checkmark-circle"
                      size={14}
                      color="#4CAF50"
                      style={styles.tagIcon}
                    />
                    <Text style={styles.tagText}>{matiere}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.subjectSection}>
              <Text style={styles.subjectSectionTitle}>À améliorer</Text>
              <View style={styles.tagContainer}>
                {child.matieresAmeliorer.map((matiere, idx) => (
                  <View key={idx} style={[styles.tag, styles.weakTag]}>
                    <Ionicons
                      name="alert-circle"
                      size={14}
                      color="#F44336"
                      style={styles.tagIcon}
                    />
                    <Text style={styles.tagText}>
                      {matiere.replace(/^\?/, "").trim()}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.actionContainer}>
            <Text style={styles.actionText}>Voir les détails</Text>
            <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
          </View>
        </View>
      </GradientCard>
    </TouchableOpacity>
  );
};

// Helper function to lighten or darken a color
const getAdjustedColor = (hex: string, percent: number) => {
  // This is a simple implementation for demo purposes
  // In production, use a proper color manipulation library
  return hex;
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  cardContent: {
    zIndex: 1,
  },
  profileSection: {
    flexDirection: "row",
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    borderRadius: 40,
    height: 80,
    width: 80,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    ...TYPOGRAPHY.h2,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  classInfo: {
    ...TYPOGRAPHY.body2,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    ...TYPOGRAPHY.caption,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  progressValue: {
    ...TYPOGRAPHY.subtitle2,
    color: "#FFFFFF",
    alignSelf: "flex-end",
  },
  subjectsContainer: {
    marginTop: 8,
  },
  subjectSection: {
    marginBottom: 12,
  },
  subjectSectionTitle: {
    ...TYPOGRAPHY.subtitle2,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.xxl,
    marginRight: 8,
    marginBottom: 8,
  },
  strongTag: {
    backgroundColor: "rgba(76, 175, 80, 0.3)",
  },
  weakTag: {
    backgroundColor: "rgba(244, 67, 54, 0.3)",
  },
  tagIcon: {
    marginRight: 4,
  },
  tagText: {
    ...TYPOGRAPHY.caption,
    color: "#FFFFFF",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: RADIUS.xxl,
    marginTop: 16,
    alignSelf: "center",
  },
  actionText: {
    ...TYPOGRAPHY.button,
    color: "#FFFFFF",
    marginRight: 8,
  },
});

export default ChildCard;
