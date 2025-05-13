// components/children/OverviewTab/index.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import QuickStats from "./QuickStats";
import StrengthsPanel from "./StrengthsPanel";
import Card from "@/components/ui/Card";
import { COLORS, TYPOGRAPHY, SPACING } from "@/constants/theme";

interface OverviewTabProps {
  childId: number;
  childData: any;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ childId, childData }) => {
  const router = useRouter();

  // Calculate quick stats
  const quickStats = [
    {
      label: "Activités",
      value: "42",
      icon: "school-outline",
      color: COLORS.primary,
    },
    {
      label: "Heures",
      value: "18.5",
      icon: "time-outline",
      color: "#2196F3",
    },
    {
      label: "Badges",
      value: "12",
      icon: "trophy-outline",
      color: "#FFD700",
    },
    {
      label: "Niveau",
      value: "3",
      icon: "star-outline",
      color: "#FF9800",
    },
  ];

  // Prepare strengths and weaknesses
  const strengths = childData.matieresFortes.map((subject: any) => ({
    subject,
    color: "#4CAF50",
    icon: "checkmark-circle",
  }));

  const weaknesses = childData.matieresAmeliorer.map((subject: any) => ({
    subject: subject.replace(/^\?/, "").trim(),
    color: "#F44336",
    icon: "alert-circle",
  }));

  return (
    <View style={styles.container}>
      {/* Quick Stats Section */}
      <QuickStats stats={quickStats} />

      {/* Strengths and Weaknesses Section */}
      <StrengthsPanel strengths={strengths} weaknesses={weaknesses} />

      {/* Notes Section */}
      <Card style={styles.notesCard}>
        <View style={styles.notesContent}>
          <Text style={styles.notesTitle}>Notes</Text>
          <Text style={styles.notesText}>
            {childData.name} progresse bien dans ses matières favorites,
            particulièrement en {childData.matieresFortes[0]}. Il/Elle devrait
            consacrer plus de temps à{" "}
            {childData.matieresAmeliorer[0].replace(/^\?/, "").trim()}
            pour améliorer ses compétences dans cette matière.
          </Text>
        </View>
      </Card>

      {/* Latest Achievement */}
      <Card style={styles.achievementCard}>
        <View style={styles.achievementCardContent}>
          <View style={styles.achievementIconContainer}>
            <Ionicons name="trophy" size={30} color="#FFD700" />
          </View>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>Dernier badge obtenu</Text>
            <Text style={styles.achievementName}>
              Expert en {childData.matieresFortes[0]}
            </Text>
            <Text style={styles.achievementDate}>Obtenu il y a 3 jours</Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  notesCard: {
    marginTop: 16,
    padding: 16,
  },
  notesContent: {
    gap: 8,
  },
  notesTitle: {
    ...TYPOGRAPHY.h3,
    fontWeight: "bold",
  },
  notesText: {
    ...TYPOGRAPHY.body1,
    lineHeight: 22,
  },
  achievementCard: {
    marginTop: 16,
    padding: 16,
    overflow: "hidden",
  },
  achievementCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  achievementIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    ...TYPOGRAPHY.subtitle2,
    color: COLORS.gray3,
    marginBottom: 4,
  },
  achievementName: {
    ...TYPOGRAPHY.h3,
    marginBottom: 4,
  },
  achievementDate: {
    ...TYPOGRAPHY.body2,
    color: COLORS.gray3,
  },
});

export default OverviewTab;
