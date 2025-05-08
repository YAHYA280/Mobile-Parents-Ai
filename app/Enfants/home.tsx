// app/Enfants/home.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { MotiView } from "moti";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TYPOGRAPHY, COLORS, SPACING, RADIUS } from "@/constants/theme";
import { CHILDREN_DATA } from "@/data/Enfants/CHILDREN_DATA";
import ActivityCard from "@/components/cards/ActivityCard";
import PerformanceCard from "@/components/cards/PerformanceCard";

const tabs = ["Aperçu", "Activités", "Suivi"];

const ChildHome = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const childId =
    typeof params.childId === "string" ? parseInt(params.childId, 10) : 0;

  const [child, setChild] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Get child data
  useEffect(() => {
    const foundChild = CHILDREN_DATA.find((c) => c.id === childId);
    setChild(foundChild);
  }, [childId]);

  const handleBack = () => {
    router.back();
  };

  // Handle tab change
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  // Navigate to activity details
  const handleActivityPress = (activityId: number) => {
    router.push(
      `/Enfants/Historique/historydetails?activityId=${activityId}&childId=${childId}`
    );
  };

  // Navigate to full activity history
  const viewAllActivities = () => {
    router.push(`/Enfants/Historique/home?childId=${childId}`);
  };

  // Calculate subject performance data
  const getSubjectPerformance = () => {
    // This would typically come from processing activities
    // Here we'll create mock data
    return [
      { name: "Mathématiques", progress: 85 },
      { name: "Français", progress: 70 },
      { name: "Sciences", progress: 65 },
      { name: "Histoire", progress: 45 },
    ];
  };

  if (!child) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Parse progress as number
  const progressValue = parseFloat(child.progress.replace("%", ""));

  return (
    <SafeAreaView style={styles.container}>
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 300 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil de l'enfant</Text>
      </MotiView>

      <View style={styles.profileHeader}>
        <MotiView
          from={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          style={styles.avatarContainer}
        >
          <Image
            source={child.profileImage}
            style={styles.avatar}
            contentFit="cover"
          />
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", damping: 18, delay: 200 }}
          style={styles.profileInfo}
        >
          <Text style={styles.childName}>{child.name}</Text>
          <Text style={styles.childDetails}>
            {child.classe} • {child.age} ans
          </Text>
        </MotiView>
      </View>

      {/* Tab Navigation */}
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
            {activeTab === index && (
              <MotiView
                from={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ type: "spring", damping: 20 }}
                style={styles.activeIndicator}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Overview Tab */}
        {activeTab === 0 && (
          <View>
            <PerformanceCard
              overallProgress={progressValue}
              subjects={getSubjectPerformance()}
            />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Activités récentes</Text>
              <TouchableOpacity onPress={viewAllActivities}>
                <Text style={styles.viewAllText}>Voir tout</Text>
              </TouchableOpacity>
            </View>

            {child.activitesRecentes
              .slice(0, 3)
              .map((activity: any, index: number) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onPress={() => handleActivityPress(activity.id)}
                  index={index}
                />
              ))}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Points forts</Text>
            </View>

            <View style={styles.strengthsContainer}>
              {child.matieresFortes.map((matiere: any, index: number) => (
                <MotiView
                  key={index}
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{
                    type: "spring",
                    damping: 18,
                    delay: index * 100,
                  }}
                  style={styles.strengthItem}
                >
                  <View style={styles.strengthIconContainer}>
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#4CAF50"
                    />
                  </View>
                  <Text style={styles.strengthText}>{matiere}</Text>
                </MotiView>
              ))}
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Points à améliorer</Text>
            </View>

            <View style={styles.strengthsContainer}>
              {child.matieresAmeliorer.map((matiere: any, index: number) => (
                <MotiView
                  key={index}
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{
                    type: "spring",
                    damping: 18,
                    delay: index * 100,
                  }}
                  style={styles.improvementItem}
                >
                  <View style={styles.improvementIconContainer}>
                    <Ionicons name="alert-circle" size={24} color="#F44336" />
                  </View>
                  <Text style={styles.improvementText}>
                    {matiere.replace(/^\?/, "").trim()}
                  </Text>
                </MotiView>
              ))}
            </View>
          </View>
        )}

        {/* Activities Tab */}
        {activeTab === 1 && (
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

            {child.activitesRecentes.map((activity: any, index: number) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onPress={() => handleActivityPress(activity.id)}
                index={index}
              />
            ))}
          </View>
        )}

        {/* Performance Tab */}
        {activeTab === 2 && (
          <View>
            <PerformanceCard
              overallProgress={progressValue}
              subjects={getSubjectPerformance()}
            />

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "spring", damping: 18, delay: 200 }}
              style={styles.statsCard}
            >
              <Text style={styles.statsTitle}>
                Statistiques d'apprentissage
              </Text>

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
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "spring", damping: 18, delay: 300 }}
              style={styles.recommendationsCard}
            >
              <Text style={styles.recommendationsTitle}>Recommandations</Text>

              <View style={styles.recommendationItem}>
                <Ionicons
                  name="book-outline"
                  size={24}
                  color={COLORS.primary}
                  style={styles.recommendationIcon}
                />
                <Text style={styles.recommendationText}>
                  Encourager plus de pratique en mathématiques
                </Text>
              </View>

              <View style={styles.recommendationItem}>
                <Ionicons
                  name="time-outline"
                  size={24}
                  color={COLORS.primary}
                  style={styles.recommendationIcon}
                />
                <Text style={styles.recommendationText}>
                  Établir une routine d'étude de 30 minutes par jour
                </Text>
              </View>

              <View style={styles.recommendationItem}>
                <Ionicons
                  name="star-outline"
                  size={24}
                  color={COLORS.primary}
                  style={styles.recommendationIcon}
                />
                <Text style={styles.recommendationText}>
                  Féliciter les progrès en français
                </Text>
              </View>
            </MotiView>
          </View>
        )}
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
    ...TYPOGRAPHY.h3,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: "#333",
  },
  profileHeader: {
    alignItems: "center",
    paddingBottom: 16,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: COLORS.primary,
    overflow: "hidden",
    marginBottom: 16,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  profileInfo: {
    alignItems: "center",
  },
  childName: {
    ...TYPOGRAPHY.h1,
    color: "#333",
    marginBottom: 4,
  },
  childDetails: {
    ...TYPOGRAPHY.body1,
    color: "#666",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 16,
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
    // Style changes are handled through the indicator and text
  },
  tabText: {
    ...TYPOGRAPHY.subtitle1,
    color: "#666",
  },
  activeTabText: {
    color: COLORS.primary,
    fontFamily: "bold",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    width: "80%",
    height: 3,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: "#333",
  },
  viewAllText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
  },
  strengthsContainer: {
    paddingHorizontal: 16,
  },
  strengthItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    padding: 16,
    borderRadius: RADIUS.md,
    marginBottom: 8,
  },
  strengthIconContainer: {
    marginRight: 16,
  },
  strengthText: {
    ...TYPOGRAPHY.body1,
    color: "#333",
    flex: 1,
  },
  improvementItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    padding: 16,
    borderRadius: RADIUS.md,
    marginBottom: 8,
  },
  improvementIconContainer: {
    marginRight: 16,
  },
  improvementText: {
    ...TYPOGRAPHY.body1,
    color: "#333",
    flex: 1,
  },
  viewAllActivitiesButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
  },
  viewAllActivitiesText: {
    ...TYPOGRAPHY.button,
    color: "#FFFFFF",
    marginRight: 8,
  },
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.lg,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  statsTitle: {
    ...TYPOGRAPHY.h3,
    color: "#333",
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    ...TYPOGRAPHY.body2,
    color: "#666",
    marginBottom: 4,
  },
  statValue: {
    ...TYPOGRAPHY.h3,
    color: "#333",
  },
  recommendationsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.lg,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  recommendationsTitle: {
    ...TYPOGRAPHY.h3,
    color: "#333",
    marginBottom: 16,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  recommendationIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  recommendationText: {
    ...TYPOGRAPHY.body1,
    color: "#333",
    flex: 1,
  },
});

export default ChildHome;
