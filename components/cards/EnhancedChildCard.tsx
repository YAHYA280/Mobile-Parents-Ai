// components/cards/EnhancedChildCard.tsx
import React from "react";
import { Image } from "expo-image";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

const { width } = Dimensions.get("window");

interface Child {
  id: number;
  name: string;
  progress: string;
  age: number;
  classe: string;
  matieresFortes: string[];
  matieresAmeliorer: string[];
  profileImage: any;
}

interface ChildCardProps {
  child: Child;
  onPress: () => void;
}

const EnhancedChildCard: React.FC<ChildCardProps> = ({ child, onPress }) => {
  // Parse progress value
  const progressValue = parseFloat(child.progress.replace("%", ""));

  // Get progress color based on value
  const getProgressColor = (value: number) => {
    if (value >= 75) return "#4CAF50"; // Green
    if (value >= 50) return "#FFC107"; // Yellow
    if (value >= 25) return "#FF9800"; // Orange
    return "#F44336"; // Red
  };

  const progressColor = getProgressColor(progressValue);

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.cardHeader}>
        <View style={styles.profileContainer}>
          <Image
            source={child.profileImage}
            style={styles.profileImage}
            contentFit="cover"
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.childName}>{child.name}</Text>
          <Text style={styles.childDetails}>
            {child.age} ans • {child.classe}
          </Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progrès global</Text>
          <Text style={[styles.progressValue, { color: progressColor }]}>
            {child.progress}
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${progressValue}%`,
                backgroundColor: progressColor,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.skillsSection}>
        <View style={styles.skillsRow}>
          <View style={styles.skillColumn}>
            <Text style={styles.skillsLabel}>Points forts</Text>
            <View style={styles.skillTags}>
              {child.matieresFortes.slice(0, 2).map((matiere, index) => (
                <View key={index} style={styles.skillTag}>
                  <Ionicons name="checkmark-circle" size={12} color="#4CAF50" />
                  <Text style={styles.skillTagText}>{matiere}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.skillColumn}>
            <Text style={styles.skillsLabel}>À améliorer</Text>
            <View style={styles.skillTags}>
              {child.matieresAmeliorer.slice(0, 2).map((matiere, index) => (
                <View key={index} style={[styles.skillTag, styles.improveTag]}>
                  <Ionicons name="alert-circle" size={12} color="#F44336" />
                  <Text style={[styles.skillTagText, styles.improveTagText]}>
                    {matiere.replace(/^\?/, "").trim()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>Accéder aux détails</Text>
        <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  childDetails: {
    fontSize: 14,
    color: "#757575",
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: "#757575",
    fontWeight: "500",
  },
  progressValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  skillsSection: {
    marginBottom: 16,
  },
  skillsRow: {
    flexDirection: "row",
  },
  skillColumn: {
    flex: 1,
  },
  skillsLabel: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 8,
    fontWeight: "500",
  },
  skillTags: {
    flexDirection: "column",
    gap: 6,
  },
  skillTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  improveTag: {
    backgroundColor: "rgba(244, 67, 54, 0.1)",
  },
  skillTagText: {
    fontSize: 12,
    color: "#4CAF50",
    marginLeft: 4,
  },
  improveTagText: {
    color: "#F44336",
  },
  detailsButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  detailsButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
    marginRight: 4,
  },
});

export default EnhancedChildCard;
