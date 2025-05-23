// app/aicalendar.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useTheme } from "@/theme/ThemeProvider";
import { COLORS } from "@/constants";
import { MotiView } from "moti";
import { SafeAreaView } from "react-native-safe-area-context";

// Import components
import Header from "@/components/ui/Header";
import AIInfoCard from "@/components/aicalendar/AIInfoCard";
import MonthNavigation from "@/components/aicalendar/MonthNavigation";
import CalendarGrid from "@/components/aicalendar/CalendarGrid";
import type { CalendarDay } from "@/components/aicalendar/CalendarGrid";
import RecommendationCard from "@/components/aicalendar/RecommendationCard";
import type { AIRecommendation } from "@/components/aicalendar/RecommendationCard";
import EmptyState from "@/components/aicalendar/EmptyState";
import RecommendationDetailSheet from "@/components/aicalendar/RecommendationDetailSheet";

// Import children data
import { CHILDREN_DATA } from "@/data/Enfants/CHILDREN_DATA";

const { width } = Dimensions.get("window");

const AICalendar = () => {
  const navigation = useNavigation();
  const { colors, dark } = useTheme();
  const [selectedDate, setSelectedDate] = useState<number>(
    new Date().getDate()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<AIRecommendation | null>(null);
  const bottomSheetRef = useRef<any>(null);

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  // Generate AI recommendations based on children data
  const generateAIRecommendations = (date: number): AIRecommendation[] => {
    const recommendations: AIRecommendation[] = [];

    // Use actual children data to generate personalized recommendations
    CHILDREN_DATA.forEach((child) => {
      // Check child's weak subjects
      child.matieresAmeliorer.forEach((matiere, index) => {
        if (date % 3 === index % 3) {
          // Distribute recommendations across days
          recommendations.push({
            id: `${date}-${child.id}-${matiere}`,
            type: "study",
            title: `Session ${matiere}`,
            subject: matiere,
            duration: "45 min",
            description: `Révision recommandée en ${matiere} pour ${child.name}. L'IA a détecté des difficultés dans cette matière basées sur les activités récentes.`,
            priority: "high",
            childName: child.name,
            timeSlot: `${14 + index}:00 - ${14 + index}:45`,
          });
        }
      });

      // Add review sessions for strong subjects
      child.matieresFortes.forEach((matiere, index) => {
        if (date % 5 === (index + 2) % 5) {
          // Different distribution pattern
          recommendations.push({
            id: `${date}-${child.id}-review-${matiere}`,
            type: "review",
            title: `Révision ${matiere}`,
            subject: matiere,
            duration: "30 min",
            description: `Session de renforcement en ${matiere} pour maintenir le bon niveau de ${child.name}.`,
            priority: "medium",
            childName: child.name,
            timeSlot: `${16 + index}:00 - ${16 + index}:30`,
          });
        }
      });

      // Add activity recommendations based on engagement score
      if (
        child.engagementScore &&
        child.engagementScore < 50 &&
        date % 4 === 0
      ) {
        recommendations.push({
          id: `${date}-${child.id}-activity`,
          type: "activity",
          title: "Jeu éducatif",
          duration: "20 min",
          description: `Activité ludique recommandée pour augmenter l'engagement de ${child.name}. Score d'engagement actuel: ${child.engagementScore.toFixed(0)}%.`,
          priority: "medium",
          childName: child.name,
          timeSlot: "15:00 - 15:20",
        });
      }

      // Add break recommendations
      if (date % 2 === 0 && child.activitesRecentes.length > 3) {
        recommendations.push({
          id: `${date}-${child.id}-break`,
          type: "break",
          title: "Pause créative",
          duration: "15 min",
          description: `Pause recommandée pour ${child.name} après plusieurs sessions d'apprentissage.`,
          priority: "low",
          childName: child.name,
          timeSlot: "16:30 - 16:45",
        });
      }
    });

    // Sort recommendations by priority and time
    return recommendations
      .sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
      .slice(0, 4); // Limit to 4 recommendations per day
  };

  // Generate calendar days for current month
  const generateCalendarDays = (): CalendarDay[] => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    const today = new Date().getDate();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const days: CalendarDay[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({
        date: 0,
        isToday: false,
        isSelected: false,
        hasRecommendations: false,
        recommendations: [],
      });
    }

    // Add actual days
    for (let date = 1; date <= daysInMonth; date++) {
      const recommendations = generateAIRecommendations(date);
      days.push({
        date,
        isToday:
          date === today &&
          selectedMonth === currentMonth &&
          selectedYear === currentYear,
        isSelected: date === selectedDate,
        hasRecommendations: recommendations.length > 0,
        recommendations,
      });
    }

    return days;
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "study":
        return "book-outline";
      case "activity":
        return "game-controller-outline";
      case "review":
        return "refresh-outline";
      case "break":
        return "cafe-outline";
      default:
        return "time-outline";
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case "study":
        return "#2196F3";
      case "activity":
        return "#4CAF50";
      case "review":
        return "#FF9800";
      case "break":
        return "#9C27B0";
      default:
        return COLORS.primary;
    }
  };

  const calendarDays = generateCalendarDays();
  const selectedDayData = calendarDays.find((day) => day.date === selectedDate);

  const handleRecommendationPress = (recommendation: AIRecommendation) => {
    setSelectedRecommendation(recommendation);
    bottomSheetRef.current?.open();
  };

  const handleMonthChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  return (
    <>
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["top"]}
      >
        {/* Fixed Header */}
        <View style={styles.headerContainer}>
          <Header
            title="Calendrier IA"
            onBackPress={() => navigation.goBack()}
            // rightIcon="settings-outline"
            // onRightIconPress={() => console.log("Settings pressed")}
          />
        </View>

        {/* Main animation wrapper */}
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", damping: 15 }}
          style={styles.contentWrapper}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {/* AI Info Card */}
            <AIInfoCard />

            {/* Month Navigation */}
            <MonthNavigation
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              monthNames={monthNames}
              onMonthChange={handleMonthChange}
            />

            {/* Calendar Grid */}
            <CalendarGrid
              calendarDays={calendarDays}
              onDaySelect={setSelectedDate}
            />

            {/* AI Recommendations for Selected Day */}
            {selectedDayData && selectedDayData.hasRecommendations && (
              <View style={styles.recommendationsSection}>
                <MotiView
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: "timing", duration: 400, delay: 500 }}
                  style={styles.recommendationsHeader}
                >
                  <Text
                    style={[
                      styles.recommendationsTitle,
                      { color: dark ? COLORS.white : COLORS.black },
                    ]}
                  >
                    Suggestions IA pour le {selectedDate}{" "}
                    {monthNames[selectedMonth]}
                  </Text>
                  <View style={styles.aiLabelContainer}>
                    <Ionicons
                      name="sparkles"
                      size={16}
                      color={COLORS.primary}
                    />
                    <Text style={styles.aiLabel}>IA</Text>
                  </View>
                </MotiView>

                {selectedDayData.recommendations.map(
                  (recommendation, index) => (
                    <RecommendationCard
                      key={recommendation.id}
                      recommendation={recommendation}
                      index={index}
                      onPress={handleRecommendationPress}
                    />
                  )
                )}
              </View>
            )}

            {/* Empty State */}
            {selectedDayData && !selectedDayData.hasRecommendations && (
              <EmptyState />
            )}
          </ScrollView>
        </MotiView>

        {/* Bottom Sheet for Recommendation Details */}
        <RecommendationDetailSheet
          sheetRef={bottomSheetRef}
          selectedRecommendation={selectedRecommendation}
          getRecommendationIcon={getRecommendationIcon}
          getRecommendationColor={getRecommendationColor}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: "transparent",
  },
  contentWrapper: {
    flex: 1,
    marginTop: 80, // Space for fixed header
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  recommendationsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  recommendationsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontFamily: "bold",
    flex: 1,
  },
  aiLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiLabel: {
    fontSize: 12,
    fontFamily: "bold",
    color: COLORS.primary,
    marginLeft: 4,
  },
});

export default AICalendar;
