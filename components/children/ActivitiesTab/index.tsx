// components/children/ActivitiesTab/index.tsx
import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import ActivitySummary from "./ActivitySummary";
import RecentActivities from "./RecentActivities";
import { COLORS, TYPOGRAPHY, RADIUS } from "@/constants/theme";

// Mock activity data - in a real app this would come from an API or context
const mockActivities = [
  {
    id: 1,
    activite: "Conversation sur les fractions",
    date: "2025-05-10T10:30:00",
    duree: "25 min",
    assistant: "J'apprends",
    matiere: "Mathématiques",
    score: "85%",
    childId: 1,
  },
  {
    id: 2,
    activite: "Lecture et compréhension de texte",
    date: "2025-05-09T14:20:00",
    duree: "30 min",
    assistant: "Recherche",
    matiere: "Français",
    childId: 1,
  },
  {
    id: 3,
    activite: "Quiz sur la géographie mondiale",
    date: "2025-05-07T16:45:00",
    duree: "15 min",
    assistant: "J'apprends",
    matiere: "Géographie",
    score: "90%",
    childId: 1,
  },
];

interface ActivitiesTabProps {
  childId: number;
  childData: any;
}

const ActivitiesTab: React.FC<ActivitiesTabProps> = ({
  childId,
  childData,
}) => {
  const router = useRouter();

  // Filter activities for this child
  const childActivities = mockActivities.filter(
    (activity) => activity.childId === childId
  );

  // Activity summary stats
  const activitySummary = {
    activityCount: childActivities.length,
    totalDuration: "1h 10min",
    lastActivityDate: childActivities[0]?.date || new Date().toISOString(),
    favoriteSubject: childData.matieresFortes[0],
  };

  // Navigate to all activities (history)
  const viewAllActivities = () => {
    router.push(`/Enfants/Historique?childId=${childId}`);
  };

  // Navigate to conversation with AI
  const startNewConversation = () => {
    router.push(`./Chat?childId=${childId}`);
  };

  return (
    <View style={styles.container}>
      {/* Activity Summary */}
      <ActivitySummary
        activityCount={activitySummary.activityCount}
        totalDuration={activitySummary.totalDuration}
        lastActivityDate={activitySummary.lastActivityDate}
        favoriteSubject={activitySummary.favoriteSubject}
      />

      {/* Chat with AI Card */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "spring", damping: 18, delay: 200 }}
        style={styles.chatCardContainer}
      >
        <TouchableOpacity
          style={styles.chatCard}
          onPress={startNewConversation}
          activeOpacity={0.9}
        >
          <View style={styles.chatCardContent}>
            <View style={styles.chatIconContainer}>
              <Ionicons
                name="chatbubbles-outline"
                size={30}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.chatTextContainer}>
              <Text style={styles.chatTitle}>Parler avec l'IA</Text>
              <Text style={styles.chatSubtitle}>
                Démarrer une nouvelle conversation pour aider {childData.name}
              </Text>
            </View>
          </View>
          <View style={styles.chatArrowContainer}>
            <Ionicons
              name="arrow-forward-circle"
              size={30}
              color={COLORS.primary}
            />
          </View>
        </TouchableOpacity>
      </MotiView>

      {/* Recent Activities */}
      <RecentActivities activities={childActivities as any} childId={childId} />

      {/* View All Activities Button */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "spring", damping: 18, delay: 400 }}
      >
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={viewAllActivities}
        >
          <Text style={styles.viewAllButtonText}>Voir tout l'historique</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </MotiView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  chatCardContainer: {
    marginTop: 16,
  },
  chatCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.lg,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chatCardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  chatIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  chatTextContainer: {
    flex: 1,
  },
  chatTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: 4,
  },
  chatSubtitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.gray3,
  },
  chatArrowContainer: {
    padding: 8,
  },
  viewAllButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  viewAllButtonText: {
    color: "#FFFFFF",
    fontFamily: "medium",
    fontSize: 16,
    marginRight: 8,
  },
});

export default ActivitiesTab;
