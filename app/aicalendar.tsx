// app/aicalendar.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import { useTheme } from "@/theme/ThemeProvider";
import { COLORS } from "@/constants";
import { MotiView } from "moti";
import RBSheet from "react-native-raw-bottom-sheet";
import Header from "@/components/ui/Header";

const { width } = Dimensions.get("window");

// Types
interface AIRecommendation {
  id: string;
  type: "study" | "activity" | "review" | "break";
  title: string;
  subject?: string;
  duration: string;
  description: string;
  priority: "high" | "medium" | "low";
  childName: string;
  timeSlot: string;
}

interface CalendarDay {
  date: number;
  isToday: boolean;
  isSelected: boolean;
  hasRecommendations: boolean;
  recommendations: AIRecommendation[];
}

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

  // Mock AI recommendations data
  const generateAIRecommendations = (date: number): AIRecommendation[] => {
    const recommendations: AIRecommendation[] = [
      {
        id: `${date}-1`,
        type: "study",
        title: "Session Mathématiques",
        subject: "Mathématiques",
        duration: "45 min",
        description:
          "Révision des fractions et exercices pratiques. L'IA recommande cette session basée sur les difficultés récentes.",
        priority: "high",
        childName: "Emma",
        timeSlot: "14:00 - 14:45",
      },
      {
        id: `${date}-2`,
        type: "activity",
        title: "Jeu éducatif Français",
        subject: "Français",
        duration: "30 min",
        description:
          "Jeu de vocabulaire interactif pour améliorer l'orthographe. Personnalisé selon le niveau actuel.",
        priority: "medium",
        childName: "Emma",
        timeSlot: "15:30 - 16:00",
      },
      {
        id: `${date}-3`,
        type: "break",
        title: "Pause créative",
        duration: "20 min",
        description:
          "Temps de pause recommandé pour maintenir la concentration. Activité de dessin libre.",
        priority: "medium",
        childName: "Emma",
        timeSlot: "16:15 - 16:35",
      },
      {
        id: `${date}-4`,
        type: "review",
        title: "Révision Sciences",
        subject: "Sciences",
        duration: "25 min",
        description: "Révision rapide du système solaire avec quiz interactif.",
        priority: "low",
        childName: "Emma",
        timeSlot: "17:00 - 17:25",
      },
    ];

    // Return different recommendations based on date
    if (date % 3 === 0) return recommendations.slice(0, 2);
    if (date % 2 === 0) return recommendations.slice(0, 3);
    return recommendations;
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#F44336";
      case "medium":
        return "#FF9800";
      case "low":
        return "#4CAF50";
      default:
        return COLORS.primary;
    }
  };

  const calendarDays = generateCalendarDays();
  const selectedDayData = calendarDays.find((day) => day.date === selectedDate);
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

  const handleRecommendationPress = (recommendation: AIRecommendation) => {
    setSelectedRecommendation(recommendation);
    bottomSheetRef.current?.open();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Header
        title="Calendrier IA"
        onBackPress={() => navigation.goBack()}
        rightIcon="settings-outline"
        onRightIconPress={() => console.log("Settings pressed")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* AI Info Card */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", damping: 15 }}
          style={styles.aiInfoCard}
        >
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.aiInfoGradient}
          >
            <View style={styles.aiInfoContent}>
              <Ionicons name="bulb-outline" size={28} color="#FFFFFF" />
              <View style={styles.aiInfoText}>
                <Text style={styles.aiInfoTitle}>
                  Intelligence Artificielle
                </Text>
                <Text style={styles.aiInfoSubtitle}>
                  Suggestions personnalisées basées sur les progrès et
                  préférences de vos enfants
                </Text>
              </View>
            </View>
          </LinearGradient>
        </MotiView>

        {/* Month Navigation */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity
            style={styles.monthNavButton}
            onPress={() => {
              if (selectedMonth === 0) {
                setSelectedMonth(11);
                setSelectedYear(selectedYear - 1);
              } else {
                setSelectedMonth(selectedMonth - 1);
              }
            }}
          >
            <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
          </TouchableOpacity>

          <Text
            style={[
              styles.monthTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            {monthNames[selectedMonth]} {selectedYear}
          </Text>

          <TouchableOpacity
            style={styles.monthNavButton}
            onPress={() => {
              if (selectedMonth === 11) {
                setSelectedMonth(0);
                setSelectedYear(selectedYear + 1);
              } else {
                setSelectedMonth(selectedMonth + 1);
              }
            }}
          >
            <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View
          style={[
            styles.calendarContainer,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
          {/* Day headers */}
          <View style={styles.dayHeadersRow}>
            {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
              <Text
                key={day}
                style={[
                  styles.dayHeader,
                  { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
                ]}
              >
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Days */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  day.isToday && styles.todayCell,
                  day.isSelected && styles.selectedCell,
                  day.hasRecommendations && styles.hasRecommendationsCell,
                ]}
                onPress={() => day.date > 0 && setSelectedDate(day.date)}
                disabled={day.date === 0}
              >
                {day.date > 0 && (
                  <>
                    <Text
                      style={[
                        styles.dayText,
                        day.isToday && styles.todayText,
                        day.isSelected && styles.selectedText,
                        {
                          color:
                            day.date === 0
                              ? "transparent"
                              : dark
                                ? COLORS.white
                                : COLORS.black,
                        },
                      ]}
                    >
                      {day.date}
                    </Text>
                    {day.hasRecommendations && (
                      <View style={styles.recommendationDot} />
                    )}
                  </>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Recommendations for Selected Day */}
        {selectedDayData && selectedDayData.hasRecommendations && (
          <View style={styles.recommendationsSection}>
            <View style={styles.recommendationsHeader}>
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
                <Ionicons name="sparkles" size={16} color={COLORS.primary} />
                <Text style={styles.aiLabel}>IA</Text>
              </View>
            </View>

            {selectedDayData.recommendations.map((recommendation) => (
              <MotiView
                key={recommendation.id}
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: "spring", damping: 18, stiffness: 120 }}
              >
                <TouchableOpacity
                  style={[
                    styles.recommendationCard,
                    { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
                  ]}
                  onPress={() => handleRecommendationPress(recommendation)}
                  activeOpacity={0.8}
                >
                  <View style={styles.recommendationHeader}>
                    <View
                      style={[
                        styles.recommendationIconContainer,
                        {
                          backgroundColor: `${getRecommendationColor(recommendation.type)}15`,
                        },
                      ]}
                    >
                      <Ionicons
                        name={getRecommendationIcon(recommendation.type) as any}
                        size={20}
                        color={getRecommendationColor(recommendation.type)}
                      />
                    </View>

                    <View style={styles.recommendationInfo}>
                      <View style={styles.recommendationTitleRow}>
                        <Text
                          style={[
                            styles.recommendationTitle,
                            { color: dark ? COLORS.white : COLORS.black },
                          ]}
                        >
                          {recommendation.title}
                        </Text>
                        <View
                          style={[
                            styles.priorityBadge,
                            {
                              backgroundColor: `${getPriorityColor(recommendation.priority)}20`,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.priorityText,
                              {
                                color: getPriorityColor(
                                  recommendation.priority
                                ),
                              },
                            ]}
                          >
                            {recommendation.priority === "high"
                              ? "Priorité"
                              : recommendation.priority === "medium"
                                ? "Moyen"
                                : "Optionnel"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.recommendationDetails}>
                        <View style={styles.detailItem}>
                          <Ionicons
                            name="time-outline"
                            size={14}
                            color={COLORS.primary}
                          />
                          <Text
                            style={[
                              styles.detailText,
                              {
                                color: dark
                                  ? COLORS.greyscale500
                                  : COLORS.greyscale600,
                              },
                            ]}
                          >
                            {recommendation.timeSlot}
                          </Text>
                        </View>

                        <View style={styles.detailItem}>
                          <Ionicons
                            name="hourglass-outline"
                            size={14}
                            color={COLORS.primary}
                          />
                          <Text
                            style={[
                              styles.detailText,
                              {
                                color: dark
                                  ? COLORS.greyscale500
                                  : COLORS.greyscale600,
                              },
                            ]}
                          >
                            {recommendation.duration}
                          </Text>
                        </View>

                        <View style={styles.detailItem}>
                          <Ionicons
                            name="person-outline"
                            size={14}
                            color={COLORS.primary}
                          />
                          <Text
                            style={[
                              styles.detailText,
                              {
                                color: dark
                                  ? COLORS.greyscale500
                                  : COLORS.greyscale600,
                              },
                            ]}
                          >
                            {recommendation.childName}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity style={styles.moreButton}>
                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={[
                      styles.recommendationDescription,
                      {
                        color: dark ? COLORS.greyscale400 : COLORS.greyScale700,
                      },
                    ]}
                  >
                    {recommendation.description}
                  </Text>
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>
        )}

        {/* Empty State */}
        {selectedDayData && !selectedDayData.hasRecommendations && (
          <View style={styles.emptyState}>
            <Ionicons
              name="calendar-outline"
              size={64}
              color={COLORS.greyscale400}
            />
            <Text
              style={[
                styles.emptyStateTitle,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Aucune suggestion pour ce jour
            </Text>
            <Text
              style={[
                styles.emptyStateSubtitle,
                { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
              ]}
            >
              L'IA génère des recommandations basées sur les progrès et les
              besoins de vos enfants
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Sheet for Recommendation Details */}
      <RBSheet
        ref={bottomSheetRef}
        closeOnPressMask
        height={400}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          draggableIcon: {
            backgroundColor: dark ? COLORS.greyscale500 : COLORS.grayscale400,
            width: 40,
            height: 5,
          },
          container: {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            backgroundColor: dark ? COLORS.dark1 : COLORS.white,
            padding: 16,
            paddingBottom: 32,
          },
        }}
      >
        {selectedRecommendation && (
          <View style={styles.bottomSheetContent}>
            <View style={styles.bottomSheetHeader}>
              <View
                style={[
                  styles.bottomSheetIcon,
                  {
                    backgroundColor: `${getRecommendationColor(selectedRecommendation.type)}15`,
                  },
                ]}
              >
                <Ionicons
                  name={
                    getRecommendationIcon(selectedRecommendation.type) as any
                  }
                  size={24}
                  color={getRecommendationColor(selectedRecommendation.type)}
                />
              </View>
              <Text
                style={[
                  styles.bottomSheetTitle,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                {selectedRecommendation.title}
              </Text>
            </View>

            <View style={styles.bottomSheetDetails}>
              <View style={styles.detailRow}>
                <Text
                  style={[
                    styles.detailLabel,
                    { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
                  ]}
                >
                  Enfant:
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  {selectedRecommendation.childName}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text
                  style={[
                    styles.detailLabel,
                    { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
                  ]}
                >
                  Heure:
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  {selectedRecommendation.timeSlot}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text
                  style={[
                    styles.detailLabel,
                    { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
                  ]}
                >
                  Durée:
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  {selectedRecommendation.duration}
                </Text>
              </View>

              {selectedRecommendation.subject && (
                <View style={styles.detailRow}>
                  <Text
                    style={[
                      styles.detailLabel,
                      {
                        color: dark ? COLORS.greyscale500 : COLORS.greyscale600,
                      },
                    ]}
                  >
                    Matière:
                  </Text>
                  <Text
                    style={[
                      styles.detailValue,
                      { color: dark ? COLORS.white : COLORS.black },
                    ]}
                  >
                    {selectedRecommendation.subject}
                  </Text>
                </View>
              )}
            </View>

            <Text
              style={[
                styles.bottomSheetDescription,
                { color: dark ? COLORS.greyscale400 : COLORS.greyScale700 },
              ]}
            >
              {selectedRecommendation.description}
            </Text>

            <View style={styles.bottomSheetActions}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: COLORS.primary },
                ]}
              >
                <Text style={styles.actionButtonText}>
                  Commencer maintenant
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.secondaryButton,
                  {
                    backgroundColor: dark ? COLORS.dark3 : COLORS.greyscale100,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.actionButtonText,
                    styles.secondaryButtonText,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  Programmer plus tard
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  aiInfoCard: {
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  aiInfoGradient: {
    padding: 16,
  },
  aiInfoContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  aiInfoText: {
    flex: 1,
    marginLeft: 12,
  },
  aiInfoTitle: {
    fontSize: 16,
    fontFamily: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  aiInfoSubtitle: {
    fontSize: 13,
    fontFamily: "regular",
    color: "rgba(255,255,255,0.9)",
    lineHeight: 18,
  },
  monthNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  monthNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: `${COLORS.primary}10`,
  },
  monthTitle: {
    fontSize: 20,
    fontFamily: "bold",
  },
  calendarContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dayHeadersRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  dayHeader: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "medium",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 8,
  },
  todayCell: {
    backgroundColor: `${COLORS.primary}20`,
    borderRadius: 20,
  },
  selectedCell: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  hasRecommendationsCell: {
    borderWidth: 2,
    borderColor: `${COLORS.primary}40`,
    borderRadius: 20,
  },
  dayText: {
    fontSize: 16,
    fontFamily: "medium",
  },
  todayText: {
    color: COLORS.primary,
    fontFamily: "bold",
  },
  selectedText: {
    color: "#FFFFFF",
    fontFamily: "bold",
  },
  recommendationDot: {
    position: "absolute",
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
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
  recommendationCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  recommendationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  recommendationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 16,
    fontFamily: "bold",
    flex: 1,
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontFamily: "bold",
    textTransform: "uppercase",
  },
  recommendationDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    fontFamily: "medium",
    marginLeft: 4,
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: `${COLORS.primary}10`,
  },
  recommendationDescription: {
    fontSize: 14,
    fontFamily: "regular",
    lineHeight: 20,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 14,
    fontFamily: "regular",
    textAlign: "center",
    lineHeight: 20,
  },
  bottomSheetContent: {
    flex: 1,
  },
  bottomSheetHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  bottomSheetIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontFamily: "bold",
    textAlign: "center",
  },
  bottomSheetDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: "medium",
  },
  detailValue: {
    fontSize: 14,
    fontFamily: "bold",
  },
  bottomSheetDescription: {
    fontSize: 14,
    fontFamily: "regular",
    lineHeight: 20,
    marginBottom: 24,
  },
  bottomSheetActions: {
    gap: 12,
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: "semibold",
    color: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#333333",
  },
});

export default AICalendar;
