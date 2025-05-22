import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { MotiView } from "moti";

interface ProgressCardProps {
  progress: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ progress }) => {
  const progressValue = parseFloat(progress.replace("%", ""));

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9, translateX: -50 }}
      animate={{ opacity: 1, scale: 1, translateX: 0 }}
      transition={{ type: "spring", delay: 1000, damping: 15 }}
    >
      <LinearGradient
        colors={["#FF8E69", "#FF7862"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Progression Globale</Text>
          <View style={styles.iconContainer}>
            <FontAwesomeIcon icon={faStar} size={18} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.progressSection}>
          <MotiView
            from={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 1200, damping: 10 }}
          >
            <Text style={styles.progressText}>{progress}</Text>
          </MotiView>

          <View style={styles.progressBarContainer}>
            <MotiView
              style={[styles.progressBar, { width: `${progressValue}%` }]}
              from={{ width: "0%" }}
              animate={{ width: `${progressValue}%` }}
              transition={{ type: "timing", delay: 1400, duration: 1000 }}
            />
          </View>
        </View>
      </LinearGradient>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#FF8E69",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  iconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  progressSection: {
    marginTop: 16,
  },
  progressText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
  },
});

export default ProgressCard;
