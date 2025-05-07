import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

interface SubjectProgress {
  name: string;
  progress: number;
}

interface ChildProgressCardProps {
  childName: string;
  progress: number;
  profileImage: any;
  lastActivity: string;
  subjects: SubjectProgress[];
  onPress: () => void;
}

const ChildProgressCard: React.FC<ChildProgressCardProps> = ({
  childName,
  progress,
  profileImage,
  lastActivity,
  subjects,
  onPress,
}) => {
  // Function to determine color based on progress percentage
  const getProgressColor = (value: number) => {
    if (value >= 75) return "#4CAF50"; // Green for excellent progress
    if (value >= 50) return COLORS.primary; // Primary color for good progress
    if (value >= 25) return "#FFC107"; // Yellow/amber for medium progress
    return "#F44336"; // Red for low progress
  };

  const progressColor = getProgressColor(progress);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", damping: 18, stiffness: 120 }}
    >
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.95}
      >
        <View style={styles.progressArc}>
          <View style={styles.progressCircle}>
            <Text style={[styles.progressPercentage, { color: progressColor }]}>
              {progress}%
            </Text>
            <Text style={styles.progressLabel}>Global</Text>
          </View>
          {/* Decorative arc that could be replaced with a proper progress arc in a production app */}
          <View
            style={[styles.arcIndicator, { backgroundColor: progressColor }]}
          />
        </View>

        <View style={styles.headerSection}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={profileImage}
                style={styles.avatar}
                contentFit="cover"
              />
              <View style={styles.statusIndicator} />
            </View>

            <View style={styles.nameContainer}>
              <Text style={styles.childName}>{childName}</Text>
              <View style={styles.activityContainer}>
                <View style={styles.activeDot} />
                <Text style={styles.lastActivity}>
                  Actif il y a {lastActivity}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.subjectsSection}>
          <Text style={styles.subjectsTitle}>Matières principales</Text>

          {subjects.map((subject, index) => (
            <View key={index} style={styles.subjectItem}>
              <View style={styles.subjectInfo}>
                <Text style={styles.subjectName}>{subject.name}</Text>
                <Text
                  style={[
                    styles.subjectProgress,
                    { color: getProgressColor(subject.progress) },
                  ]}
                >
                  {subject.progress}%
                </Text>
              </View>

              <View style={styles.progressBarContainer}>
                <LinearGradient
                  colors={[
                    getProgressColor(subject.progress),
                    getProgressColor(subject.progress) + "80",
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.progressBar,
                    {
                      width: `${subject.progress}%`,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.detailsButton} onPress={onPress}>
          <Text style={styles.detailsButtonText}>Voir les détails</Text>
          <Ionicons
            name="arrow-forward"
            size={16}
            color="#FFFFFF"
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    padding: 20,
  },
  progressArc: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressPercentage: {
    fontSize: 18,
    fontFamily: "bold",
  },
  progressLabel: {
    fontSize: 10,
    fontFamily: "regular",
    color: "#888",
    marginTop: -2,
  },
  arcIndicator: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    right: 0,
    top: 10,
  },
  headerSection: {
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#f0f0f0",
  },
  statusIndicator: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    bottom: 0,
    right: 0,
  },
  nameContainer: {
    justifyContent: "center",
  },
  childName: {
    fontSize: 18,
    fontFamily: "bold",
    color: "#333",
    marginBottom: 4,
  },
  activityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4CAF50",
    marginRight: 6,
  },
  lastActivity: {
    fontSize: 13,
    fontFamily: "regular",
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginBottom: 16,
  },
  subjectsSection: {
    marginBottom: 20,
  },
  subjectsTitle: {
    fontSize: 15,
    fontFamily: "semibold",
    color: "#555",
    marginBottom: 12,
  },
  subjectItem: {
    marginBottom: 12,
  },
  subjectInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  subjectName: {
    fontSize: 14,
    fontFamily: "medium",
    color: "#444",
  },
  subjectProgress: {
    fontSize: 14,
    fontFamily: "bold",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  detailsButton: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
  },
  detailsButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "semibold",
    marginRight: 6,
  },
  buttonIcon: {
    marginTop: 1,
  },
});

export default ChildProgressCard;
