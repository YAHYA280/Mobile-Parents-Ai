import React, { useState } from "react";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { COLORS, images, icons } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

// Import components
import EnhancedHeader from "@/components/home/EnhancedHeader";
import WelcomeCard from "@/components/home/WelcomeCard";
import QuickActionCard from "@/components/home/QuickActionCard";
import ChildProgressCard from "@/components/home/ChildProgressCard";
import RecentActivityCard from "@/components/home/RecentActivityCard";
import UpcomingHomeworkCard from "@/components/home/UpcomingHomeworkCard";

type Nav = {
  navigate: (value: string) => void;
};

const Index = () => {
  const { navigate } = useNavigation<Nav>();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data for child progress
  const childrenProgress = [
    {
      id: "1",
      name: "Thomas Dubois",
      progress: 75,
      profileImage: images.user7,
      lastActivity: "2 hours ago",
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
      lastActivity: "4 hours ago",
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
      time: "2 hours ago",
      score: "85%",
    },
    {
      id: "2",
      childName: "Marie Laurent",
      activity: "A commencé le chapitre Histoire - Moyen Âge",
      time: "4 hours ago",
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <EnhancedHeader
        userName="Andrew Ainsley"
        userImage={images.user7}
        onNotificationPress={() => navigate("notifications")}
        onProfilePress={() => navigate("profile")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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
          <Text style={styles.sectionTitle}>Accès rapide</Text>
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Progrès des enfants</Text>
            <TouchableOpacity onPress={() => navigate("Enfants")}>
              <Text style={styles.viewAllText}>Voir tout</Text>
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activités récentes</Text>
            <TouchableOpacity onPress={() => navigate("activities")}>
              <Text style={styles.viewAllText}>Voir tout</Text>
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Devoirs à venir</Text>
            <TouchableOpacity onPress={() => navigate("homework")}>
              <Text style={styles.viewAllText}>Voir tout</Text>
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
                onPress={() => navigate(`/homework/details?id=${homework.id}`)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: "#333",
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontFamily: "medium",
  },
  quickActionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
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
});

export default Index;
