import React from "react";
import { MotiView } from "moti";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCheck,
  faGraduationCap,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

import { COLORS } from "@/constants/theme";

interface SubjectsCardProps {
  strongSubjects: string[];
  improvementSubjects: string[];
}

const SubjectsCard: React.FC<SubjectsCardProps> = ({
  strongSubjects,
  improvementSubjects,
}) => {
  const renderSubjectTag = (
    subject: string,
    isStrong: boolean,
    index: number
  ) => {
    const tagColor = isStrong ? "#24D26D" : "#FC4E00";
    const tagBgColor = isStrong
      ? "rgba(36, 210, 109, 0.1)"
      : "rgba(252, 78, 0, 0.1)";

    return (
      <MotiView
        key={subject}
        style={[styles.subjectTag, { backgroundColor: tagBgColor }]}
        from={{ opacity: 0, scale: 0.5, translateY: 20 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        transition={{
          type: "spring",
          delay: 1600 + index * 100,
          damping: 15,
        }}
      >
        <FontAwesomeIcon
          icon={isStrong ? faCheck : faExclamationTriangle}
          color={tagColor}
          size={16}
          style={styles.tagIcon}
        />
        <Text style={[styles.tagText, { color: tagColor }]}>{subject}</Text>
      </MotiView>
    );
  };

  return (
    <MotiView
      style={styles.container}
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", delay: 1200, damping: 15 }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Domaines d&apos;Apprentissage</Text>
        <View style={styles.iconContainer}>
          <FontAwesomeIcon
            icon={faGraduationCap}
            size={18}
            color={COLORS.primary}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Points Forts</Text>
        <View style={styles.tagsContainer}>
          {strongSubjects.map((subject, index) =>
            renderSubjectTag(subject, true, index)
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: "#FC4E00" }]}>
          À Améliorer
        </Text>
        <View style={styles.tagsContainer}>
          {improvementSubjects.map((subject, index) =>
            renderSubjectTag(
              subject.replace(/^\?/, "").trim(),
              false,
              index + strongSubjects.length
            )
          )}
        </View>
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  iconContainer: {
    backgroundColor: "rgba(255, 142, 105, 0.1)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#24D26D",
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  subjectTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagIcon: {
    marginRight: 5,
  },
  tagText: {
    fontWeight: "600",
  },
});

export default SubjectsCard;
