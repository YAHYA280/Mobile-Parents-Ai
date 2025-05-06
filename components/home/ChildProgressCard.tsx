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
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
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
            <Text style={styles.lastActivity}>Actif {lastActivity}</Text>
          </View>
        </View>

        <View style={styles.progressBadge}>
          <Text style={[styles.progressText, { color: progressColor }]}>
            {progress}%
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.subjectsSection}>
        <Text style={styles.subjectsTitle}>Matières</Text>

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
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${subject.progress}%`,
                    backgroundColor: getProgressColor(subject.progress),
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.detailsButton} onPress={onPress}>
        <Text style={styles.detailsButtonText}>Voir les détails</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    padding: 16,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  statusIndicator: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
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
    fontSize: 16,
    fontFamily: "bold",
    color: "#333",
    marginBottom: 2,
  },
  lastActivity: {
    fontSize: 12,
    fontFamily: "regular",
    color: "#888",
  },
  progressBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  progressText: {
    fontSize: 14,
    fontFamily: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginBottom: 16,
  },
  subjectsSection: {
    marginBottom: 16,
  },
  subjectsTitle: {
    fontSize: 14,
    fontFamily: "medium",
    color: "#555",
    marginBottom: 8,
  },
  subjectItem: {
    marginBottom: 10,
  },
  subjectInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  subjectName: {
    fontSize: 13,
    fontFamily: "medium",
    color: "#444",
  },
  subjectProgress: {
    fontSize: 13,
    fontFamily: "bold",
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  detailsButton: {
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  detailsButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "medium",
  },
});

export default ChildProgressCard;
