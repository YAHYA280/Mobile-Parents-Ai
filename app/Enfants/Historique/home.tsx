// app/Enfants/Historique/home.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from "@/constants/theme";
import { CHILDREN_DATA } from "@/data/Enfants/CHILDREN_DATA";
import ActivityCard from "@/components/cards/ActivityCard";
import { Child, Activity } from "@/types/interfaces"; // Import from our centralized interfaces

const tabs = ["Aperçu", "Activités", "Suivi"];

const ChildHome: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const childId =
    typeof params.childId === "string" ? parseInt(params.childId, 10) : 0;

  const [child, setChild] = useState<Child | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  // Get child data
  useEffect(() => {
    const foundChild = CHILDREN_DATA.find((c) => c.id === childId) as Child;
    setChild(foundChild || null);
  }, [childId]);

  const handleBack = () => {
    router.back();
  };

  // Handle tab change
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  // Navigate to activity details
  const handleActivityPress = (activityId: string | number) => {
    router.push(
      `/Enfants/Historique/historydetails?activityId=${activityId}&childId=${childId}`
    );
  };

  // Navigate to full activity history
  const viewAllActivities = () => {
    router.push(`/Enfants/Historique/home?childId=${childId}`);
  };

  if (!child) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Parse progress as number
  const progressValue = parseFloat(child.progress.toString().replace("%", ""));

  // Helper function to get progress color
  const getProgressColor = (value: number): string => {
    if (value >= 75) return "#4CAF50"; // Green
    if (value >= 50) return "#FFC107"; // Yellow
    if (value >= 25) return "#FF9800"; // Orange
    return "#F44336"; // Red
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 0: // Aperçu
        return (
          <View>
            {/* Performance Overview */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Progrès Global</Text>
              <View style={styles.progressCircleContainer}>
                <View
                  style={[
                    styles.progressCircle,
                    { borderColor: getProgressColor(progressValue) },
                  ]}
                >
                  <Text
                    style={[
                      styles.progressCircleText,
                      { color: getProgressColor(progressValue) },
                    ]}
                  >
                    {child.progress}
                  </Text>
                </View>
              </View>
            </View>

            {/* Recent Activities */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Activités récentes</Text>
                <TouchableOpacity onPress={viewAllActivities}>
                  <Text style={styles.viewAllText}>Voir tout</Text>
                </TouchableOpacity>
              </View>

              {child.activitesRecentes
                .slice(0, 3)
                .map((activity: Activity, index: number) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onPress={() => handleActivityPress(activity.id)}
                    index={index}
                  />
                ))}
            </View>

            {/* Strengths */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Points forts</Text>

              <View style={styles.strengthsContainer}>
                {child.matieresFortes.map((matiere: string, index: number) => (
                  <View key={index} style={styles.strengthItem}>
                    <View style={styles.strengthIconContainer}>
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#4CAF50"
                      />
                    </View>
                    <Text style={styles.strengthText}>{matiere}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Improvements */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Points à améliorer</Text>

              <View style={styles.strengthsContainer}>
                {child.matieresAmeliorer.map(
                  (matiere: string, index: number) => (
                    <View key={index} style={styles.improvementItem}>
                      <View style={styles.improvementIconContainer}>
                        <Ionicons
                          name="alert-circle"
                          size={24}
                          color="#F44336"
                        />
                      </View>
                      <Text style={styles.improvementText}>
                        {matiere.replace(/^\?/, "").trim()}
                      </Text>
                    </View>
                  )
                )}
              </View>
            </View>
          </View>
        );

      case 1: // Activities
        return (
          <View>
            <TouchableOpacity
              style={styles.viewAllActivitiesButton}
              onPress={viewAllActivities}
            >
              <Text style={styles.viewAllActivitiesText}>
                Voir tout l'historique
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            {child.activitesRecentes.map(
              (activity: Activity, index: number) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onPress={() => handleActivityPress(activity.id)}
                  index={index}
                />
              )
            )}
          </View>
        );

      case 2: // Performance
        return (
          <View>
            {/* Overall Progress */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Performance globale</Text>
              <View style={styles.progressCircleContainer}>
                <View
                  style={[
                    styles.progressCircle,
                    { borderColor: getProgressColor(progressValue) },
                  ]}
                >
                  <Text
                    style={[
                      styles.progressCircleText,
                      { color: getProgressColor(progressValue) },
                    ]}
                  >
                    {child.progress}
                  </Text>
                </View>
              </View>
            </View>

            {/* Subject Performance */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Performance par matière</Text>

              {/* Dynamically create subject cards with progress */}
              {[...child.matieresFortes, ...child.matieresAmeliorer].map(
                (matiere, index) => {
                  const isStrength = child.matieresFortes.includes(matiere);
                  const progress = isStrength
                    ? Math.floor(Math.random() * 20) + 80 // 80-100% for strengths
                    : Math.floor(Math.random() * 30) + 45; // 45-75% for improvements

                  return (
                    <View key={index} style={styles.subjectCard}>
                      <View style={styles.subjectHeader}>
                        <Text style={styles.subjectName}>
                          {matiere.replace(/^\?/, "").trim()}
                        </Text>
                        <Text
                          style={[
                            styles.subjectScore,
                            { color: getProgressColor(progress) },
                          ]}
                        >
                          {progress}%
                        </Text>
                      </View>
                      <View style={styles.subjectProgressContainer}>
                        <View
                          style={[
                            styles.subjectProgress,
                            {
                              width: `${progress}%`,
                              backgroundColor: getProgressColor(progress),
                            },
                          ]}
                        />
                      </View>
                    </View>
                  );
                }
              )}
            </View>

            {/* Statistics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Statistiques d'apprentissage
              </Text>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Ionicons
                      name="time-outline"
                      size={24}
                      color={COLORS.primary}
                    />
                  </View>
                  <View style={styles.statContent}>
                    <Text style={styles.statLabel}>Temps total</Text>
                    <Text style={styles.statValue}>14h 30min</Text>
                  </View>
                </View>

                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Ionicons
                      name="checkmark-done-outline"
                      size={24}
                      color={COLORS.primary}
                    />
                  </View>
                  <View style={styles.statContent}>
                    <Text style={styles.statLabel}>Activités terminées</Text>
                    <Text style={styles.statValue}>
                      {child.activitesRecentes.length}
                    </Text>
                  </View>
                </View>

                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Ionicons
                      name="star-outline"
                      size={24}
                      color={COLORS.primary}
                    />
                  </View>
                  <View style={styles.statContent}>
                    <Text style={styles.statLabel}>Score moyen</Text>
                    <Text style={styles.statValue}>78%</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil de l'enfant</Text>
      </View>

      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image
            source={child.profileImage}
            style={styles.avatar}
            contentFit="cover"
          />
        </View>
        <Text style={styles.childName}>{child.name}</Text>
        <Text style={styles.childDetails}>
          {child.classe} • {child.age} ans
        </Text>
      </View>

      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, activeTab === index && styles.activeTab]}
            onPress={() => handleTabChange(index)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
            {activeTab === index && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    color: "#333333",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.primary,
    overflow: "hidden",
    marginBottom: 12,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  childName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  childDetails: {
    fontSize: 16,
    color: "#757575",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    position: "relative",
  },
  activeTab: {
    // Style changes are handled through the indicator
  },
  tabText: {
    fontSize: 14,
    color: "#757575",
    fontWeight: "normal",
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    width: 30,
    height: 3,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  progressCircleContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 10,
    borderColor: COLORS.primary,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  progressCircleText: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  strengthsContainer: {
    marginBottom: 8,
  },
  strengthItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  strengthIconContainer: {
    marginRight: 16,
  },
  strengthText: {
    fontSize: 16,
    color: "#333333",
    flex: 1,
  },
  improvementItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  improvementIconContainer: {
    marginRight: 16,
  },
  improvementText: {
    fontSize: 16,
    color: "#333333",
    flex: 1,
  },
  viewAllActivitiesButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  viewAllActivitiesText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 8,
  },
  subjectCard: {
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  subjectScore: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subjectProgressContainer: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
  },
  subjectProgress: {
    height: "100%",
    borderRadius: 4,
  },
  statsContainer: {
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,142,105,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
});

export default ChildHome;
