import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { COLORS, TYPOGRAPHY } from "@/constants/theme";
import { useTheme } from "@/theme/ThemeProvider";
import Card from "@/components/ui/Card";

interface SubjectData {
  name: string;
  progress: number;
}

interface SubjectProgressProps {
  subjects: SubjectData[];
}

const SubjectProgress: React.FC<SubjectProgressProps> = ({ subjects }) => {
  const { dark } = useTheme();

  // Get color based on progress value
  const getProgressColor = (value: number) => {
    if (value >= 75) return "#4CAF50"; // Green
    if (value >= 50) return "#FFC107"; // Yellow
    if (value >= 25) return "#FF9800"; // Orange
    return "#F44336"; // Red
  };

  return (
    <Card>
      <Text
        style={[styles.title, { color: dark ? COLORS.white : COLORS.black }]}
      >
        Performance par matière
      </Text>

      {subjects.map((subject, index) => (
        <MotiView
          key={`subject-${index}`}
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{
            type: "spring",
            damping: 18,
            delay: index * 100,
          }}
          style={styles.subjectItem}
        >
          <View style={styles.subjectHeader}>
            <Text
              style={[
                styles.subjectName,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {subject.name}
            </Text>
            <Text
              style={[
                styles.subjectProgress,
                { color: getProgressColor(subject.progress) },
              ]}
            >
              {subject.progress}%
            </Text>
          </View>

          <View
            style={[
              styles.progressBarContainer,
              {
                backgroundColor: dark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
          >
            <MotiView
              from={{ width: "0%" }}
              animate={{ width: `${subject.progress}%` }}
              transition={{
                type: "timing",
                duration: 1000,
                delay: 300 + index * 100,
              }}
              style={[
                styles.progressBar,
                { backgroundColor: getProgressColor(subject.progress) },
              ]}
            />
          </View>
        </MotiView>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    ...TYPOGRAPHY.h3,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subjectItem: {
    marginBottom: 16,
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  subjectName: {
    ...TYPOGRAPHY.body1,
  },
  subjectProgress: {
    ...TYPOGRAPHY.subtitle2,
    fontWeight: "bold",
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
});

export default SubjectProgress;
