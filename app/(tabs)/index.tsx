import React, { useState, useRef } from "react";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { COLORS, images, icons } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  StatusBar,
  Dimensions,
} from "react-native";

// Import components
import EnhancedHeader from "@/components/home/EnhancedHeader";
import WelcomeCard from "@/components/home/WelcomeCard";
import QuickActionCard from "@/components/home/QuickActionCard";
import ChildProgressCard from "@/components/home/ChildProgressCard";
import RecentActivityCard from "@/components/home/RecentActivityCard";
import UpcomingHomeworkCard from "@/components/home/UpcomingHomeworkCard";

const { width, height } = Dimensions.get("window");

type Nav = {
  navigate: (value: string) => void;
};

const Index = () => {
  const { navigate } = useNavigation<Nav>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollY = useSharedValue(0);

  // Mock data for child progress
  const childrenProgress = [
    {
      id: "1",
      name: "Thomas Dubois",
      progress: 75,
      profileImage: images.user7,
      lastActivity: "2 heures",
      subjects: [
        { name: "Mathématiques", progress: 80 },
        { name: "Français", progress: 65 },
      ],
    },
    {
      id: "2",
      name: "Marie Laurent",
      progress: 65,
      profileImage: images.user3,
      lastActivity: "4 heures",
      subjects: [
        { name: "Histoire", progress: 70 },
        { name: "Sciences", progress: 60 },
      ],
    },
  ];

  // Mock data for recent activities
  const recentActivities = [
    {
      id: "1",
      childName: "Thomas Dubois",
      activity: "A terminé un exercice de mathématiques",
      time: "2 heures",
      score: "85%",
    },
    {
      id: "2",
      childName: "Marie Laurent",
      activity: "A commencé le chapitre Histoire - Moyen Âge",
      time: "4 heures",
      score: null,
    },
  ];

  // Mock data for upcoming homework
  const upcomingHomework = [
    {
      id: "1",
      subject: "Mathématiques",
      title: "Équations du second degré",
      dueDate: "Demain",
      childName: "Thomas Dubois",
      progress: 20,
    },
    {
      id: "2",
      subject: "Français",
      title: "Dissertation sur Victor Hugo",
      dueDate: "3 jours",
      childName: "Marie Laurent",
      progress: 0,
    },
  ];

  // Quick actions data
  const quickActions = [
    {
      id: "1",
      title: "Devoirs",
      icon: "book-outline",
      color: "#4CAF50",
      onPress: () => navigate("homework"),
    },
    {
      id: "2",
      title: "Messages",
      icon: "chatbubble-outline",
      color: "#2196F3",
      onPress: () => navigate("messages"),
    },
    {
      id: "3",
      title: "Calendrier",
      icon: "calendar-outline",
      color: "#FF9800",
      onPress: () => navigate("calendar"),
    },
    {
      id: "4",
      title: "Progrès",
      icon: "trending-up-outline",
      color: "#F44336",
      onPress: () => navigate("progress"),
    },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [-20, 0, 100],
        [120, 100, 70],
        Extrapolate.CLAMP
      ),
      opacity: interpolate(
        scrollY.value,
        [0, 50, 100],
        [1, 0.9, 0.8],
        Extrapolate.CLAMP
      ),
    };
  });

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <EnhancedHeader
            userName="Andrew Ainsley"
            userImage={images.user7}
            onNotificationPress={() => navigate("notifications")}
            onProfilePress={() => navigate("profile")}
          />
        </Animated.View>

        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          {/* Welcome Card with App Banner */}
          <WelcomeCard
            userName="Andrew"
            discount="20%"
            discountName="SUMMER SPECIAL"
            bottomTitle="Abonnement Premium"
            bottomSubtitle="Accès illimité à toutes les matières"
            onPress={() => navigate("abonnementcatalogue")}
          />

          {/* Quick Actions Grid */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderWithIcon}>
              <View style={styles.titleWithIcon}>
                <Ionicons
                  name="flash-outline"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.sectionTitle}>Accès rapide</Text>
              </View>
            </View>
            <View style={styles.quickActionsContainer}>
              {quickActions.map((action) => (
                <QuickActionCard
                  key={action.id}
                  title={action.title}
                  iconName={action.icon}
                  color={action.color}
                  onPress={action.onPress}
                />
              ))}
            </View>
          </View>

          {/* Children Progress Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderWithIcon}>
              <View style={styles.titleWithIcon}>
                <Ionicons
                  name="people-outline"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.sectionTitle}>Progrès des enfants</Text>
              </View>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => navigate("Enfants")}
              >
                <Text style={styles.viewAllText}>Voir tout</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.childrenCardsContainer}>
              {childrenProgress.map((child) => (
                <ChildProgressCard
                  key={child.id}
                  childName={child.name}
                  progress={child.progress}
                  profileImage={child.profileImage}
                  lastActivity={child.lastActivity}
                  subjects={child.subjects}
                  onPress={() => navigate(`/Enfants/home?childId=${child.id}`)}
                />
              ))}
            </View>
          </View>

          {/* Recent Activity Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderWithIcon}>
              <View style={styles.titleWithIcon}>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.sectionTitle}>Activités récentes</Text>
              </View>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => navigate("activities")}
              >
                <Text style={styles.viewAllText}>Voir tout</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.activitiesContainer}>
              {recentActivities.map((activity) => (
                <RecentActivityCard
                  key={activity.id}
                  childName={activity.childName}
                  activity={activity.activity}
                  time={activity.time}
                  score={activity.score}
                />
              ))}
            </View>
          </View>

          {/* Upcoming Homework Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderWithIcon}>
              <View style={styles.titleWithIcon}>
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.sectionTitle}>Devoirs à venir</Text>
              </View>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => navigate("homework")}
              >
                <Text style={styles.viewAllText}>Voir tout</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.homeworkContainer}>
              {upcomingHomework.map((homework) => (
                <UpcomingHomeworkCard
                  key={homework.id}
                  subject={homework.subject}
                  title={homework.title}
                  dueDate={homework.dueDate}
                  childName={homework.childName}
                  progress={homework.progress}
                  onPress={() =>
                    navigate(`/homework/details?id=${homework.id}`)
                  }
                />
              ))}
            </View>
          </View>

          {/* Additional Motivational Card */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.motivationalCardContainer}
          >
            <LinearGradient
              colors={["#8e2de2", "#4a00e0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.motivationalCard}
            >
              <View style={styles.motivationalContent}>
                <View style={styles.motivationalIconContainer}>
                  <Ionicons name="trophy-outline" size={28} color="#fff" />
                </View>
                <View style={styles.motivationalTextContainer}>
                  <Text style={styles.motivationalTitle}>
                    Récompenses hebdomadaires
                  </Text>
                  <Text style={styles.motivationalSubtitle}>
                    Les enfants ont gagné 5 badges cette semaine !
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#fff",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeaderWithIcon: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: "#333",
    marginLeft: 8,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontFamily: "medium",
    marginRight: 4,
  },
  quickActionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  childrenCardsContainer: {
    marginTop: 10,
  },
  activitiesContainer: {
    marginTop: 10,
  },
  homeworkContainer: {
    marginTop: 10,
  },
  motivationalCardContainer: {
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#8e2de2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  motivationalCard: {
    borderRadius: 16,
    padding: 20,
  },
  motivationalContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  motivationalIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  motivationalTextContainer: {
    flex: 1,
  },
  motivationalTitle: {
    fontSize: 16,
    fontFamily: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  motivationalSubtitle: {
    fontSize: 13,
    fontFamily: "medium",
    color: "rgba(255,255,255,0.85)",
  },
});

export default Index;
