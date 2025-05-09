// components/dashboard/PerformanceDashboard.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { TYPOGRAPHY, COLORS, RADIUS } from "@/constants/theme";
import { useTheme } from "@/theme/ThemeProvider";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.8;

interface SubjectPerformance {
  subject: string;
  progress: number;
  recentActivities: number;
  icon?: string;
  color?: [string, string]; // Gradient colors
  lastActivity?: string; // Date of last activity
  streak?: number; // Consecutive days of activity
  grade?: string; // Letter grade based on performance
  improvement?: number; // Percentage improvement from last assessment
}

interface OverallStats {
  totalActivities: number;
  totalTimeSpent: string; // Format: "10h 45m"
  averageScore: number;
  completionRate: number;
  longestStreak: number;
}

interface PerformanceDashboardProps {
  childName: string;
  childClass: string;
  overallProgress: number;
  subjects: SubjectPerformance[];
  stats: OverallStats;
  onSubjectPress?: (subject: string) => void;
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  childName,
  childClass,
  overallProgress,
  subjects,
  stats,
  onSubjectPress,
}) => {
  const { dark } = useTheme();
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "week" | "month" | "year"
  >("month");
  const [expandedStats, setExpandedStats] = useState(false);

  // Get subject icon
  const getSubjectIcon = (subject: string, customIcon?: string): string => {
    if (customIcon) return customIcon;

    const subjectIcons: Record<string, string> = {
      mathématiques: "calculator",
      français: "book",
      histoire: "time",
      géographie: "globe",
      sciences: "flask",
      physique: "flask",
      chimie: "flask",
      biologie: "leaf",
      anglais: "language",
      langues: "language",
      informatique: "hardware-chip",
      arts: "color-palette",
      musique: "musical-notes",
      sport: "fitness",
      philosophie: "school",
    };

    const lowerSubject = subject.toLowerCase();

    // Try to find a matching subject
    for (const key of Object.keys(subjectIcons)) {
      if (lowerSubject.includes(key)) {
        return subjectIcons[key];
      }
    }

    // Default icon
    return "book";
  };

  // Get subject color
  const getSubjectColor = (
    subject: string,
    customColor?: [string, string]
  ): [string, string] => {
    if (customColor) return customColor;

    const subjectColors: Record<string, [string, string]> = {
      mathématiques: ["#2196F3", "#1565C0"],
      français: ["#4CAF50", "#2E7D32"],
      histoire: ["#FF9800", "#F57C00"],
      géographie: ["#FF9800", "#F57C00"],
      sciences: ["#9C27B0", "#7B1FA2"],
      physique: ["#00BCD4", "#0097A7"],
      chimie: ["#00BCD4", "#0097A7"],
      biologie: ["#8BC34A", "#689F38"],
      anglais: ["#E91E63", "#C2185B"],
      langues: ["#E91E63", "#C2185B"],
      informatique: ["#607D8B", "#455A64"],
      arts: ["#FF5722", "#E64A19"],
      musique: ["#673AB7", "#512DA8"],
      sport: ["#FF9800", "#F57C00"],
      philosophie: ["#795548", "#4E342E"],
    };

    const lowerSubject = subject.toLowerCase();

    // Try to find a matching subject
    for (const key of Object.keys(subjectColors)) {
      if (lowerSubject.includes(key)) {
        return subjectColors[key];
      }
    }

    // Default color
    return ["#9E9E9E", "#616161"];
  };

  // Get grade color
  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case "A+":
      case "A":
        return "#4CAF50"; // Green
      case "B+":
      case "B":
        return "#8BC34A"; // Light Green
      case "C+":
      case "C":
        return "#FFEB3B"; // Yellow
      case "D+":
      case "D":
        return "#FF9800"; // Orange
      default:
        return "#F44336"; // Red
    }
  };

  // Get an appropriate color for the progress bar based on progress
  const getProgressColor = (progress: number): [string, string] => {
    if (progress >= 80) return ["#4CAF50", "#2E7D32"]; // Green
    if (progress >= 60) return ["#8BC34A", "#689F38"]; // Light Green
    if (progress >= 40) return ["#FFEB3B", "#FBC02D"]; // Yellow
    if (progress >= 20) return ["#FF9800", "#F57C00"]; // Orange
    return ["#F44336", "#D32F2F"]; // Red
  };

  // Get improvement icon and color
  const getImprovementDisplay = (improvement?: number) => {
    if (!improvement) return { icon: "remove", color: COLORS.gray3 };

    if (improvement > 0) {
      return {
        icon: improvement > 10 ? "trending-up" : "arrow-up",
        color: "#4CAF50", // Green
      };
    } else if (improvement < 0) {
      return {
        icon: improvement < -10 ? "trending-down" : "arrow-down",
        color: "#F44336", // Red
      };
    }

    return { icon: "remove", color: COLORS.gray3 };
  };

  return (
    <View style={styles.container}>
      {/* Header with overall progress */}
      <LinearGradient
        colors={getProgressColor(overallProgress)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Text style={styles.childName}>{childName}</Text>
          <Text style={styles.childClass}>{childClass}</Text>

          <View style={styles.progressSection}>
            <View style={styles.progressHeaderRow}>
              <Text style={styles.progressLabel}>Progression globale</Text>
              <Text style={styles.progressValue}>{overallProgress}%</Text>
            </View>

            <View style={styles.progressBarContainer}>
              <View
                style={[styles.progressBar, { width: `${overallProgress}%` }]}
              />
            </View>
          </View>

          <View style={styles.timeframeSelector}>
            <TouchableOpacity
              style={[
                styles.timeframeButton,
                selectedTimeframe === "week" && styles.selectedTimeframe,
              ]}
              onPress={() => setSelectedTimeframe("week")}
            >
              <Text
                style={[
                  styles.timeframeText,
                  selectedTimeframe === "week" && styles.selectedTimeframeText,
                ]}
              >
                Semaine
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.timeframeButton,
                selectedTimeframe === "month" && styles.selectedTimeframe,
              ]}
              onPress={() => setSelectedTimeframe("month")}
            >
              <Text
                style={[
                  styles.timeframeText,
                  selectedTimeframe === "month" && styles.selectedTimeframeText,
                ]}
              >
                Mois
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.timeframeButton,
                selectedTimeframe === "year" && styles.selectedTimeframe,
              ]}
              onPress={() => setSelectedTimeframe("year")}
            >
              <Text
                style={[
                  styles.timeframeText,
                  selectedTimeframe === "year" && styles.selectedTimeframeText,
                ]}
              >
                Année
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Statistics Overview */}
      <TouchableOpacity
        style={[
          styles.statsCard,
          { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
        ]}
        onPress={() => setExpandedStats(!expandedStats)}
        activeOpacity={0.9}
      >
        <View style={styles.statsCardHeader}>
          <Text
            style={[
              styles.statsCardTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Statistiques d'apprentissage
          </Text>

          <MotiView
            animate={{
              rotate: expandedStats ? "180deg" : "0deg",
            }}
            transition={{
              type: "timing",
              duration: 300,
            }}
          >
            <Ionicons
              name="chevron-down"
              size={20}
              color={dark ? COLORS.white : COLORS.black}
            />
          </MotiView>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View
              style={[
                styles.statIconContainer,
                {
                  backgroundColor: dark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(33, 150, 243, 0.1)",
                },
              ]}
            >
              <Ionicons
                name="checkmark-done"
                size={20}
                color={COLORS.primary}
              />
            </View>
            <Text
              style={[
                styles.statValue,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {stats.totalActivities}
            </Text>
            <Text
              style={[
                styles.statLabel,
                { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
              ]}
            >
              Activités
            </Text>
          </View>

          <View style={styles.statItem}>
            <View
              style={[
                styles.statIconContainer,
                {
                  backgroundColor: dark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(33, 150, 243, 0.1)",
                },
              ]}
            >
              <Ionicons name="time" size={20} color={COLORS.primary} />
            </View>
            <Text
              style={[
                styles.statValue,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {stats.totalTimeSpent}
            </Text>
            <Text
              style={[
                styles.statLabel,
                { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
              ]}
            >
              Temps total
            </Text>
          </View>

          <View style={styles.statItem}>
            <View
              style={[
                styles.statIconContainer,
                {
                  backgroundColor: dark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(33, 150, 243, 0.1)",
                },
              ]}
            >
              <Ionicons name="star" size={20} color={COLORS.primary} />
            </View>
            <Text
              style={[
                styles.statValue,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {stats.averageScore}%
            </Text>
            <Text
              style={[
                styles.statLabel,
                { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
              ]}
            >
              Note moyenne
            </Text>
          </View>
        </View>

        {expandedStats && (
          <MotiView
            from={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ type: "timing", duration: 300 }}
          >
            <View style={styles.expandedStatsSection}>
              <View
                style={[
                  styles.expandedStatRow,
                  {
                    borderBottomColor: dark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.05)",
                  },
                ]}
              >
                <View style={styles.expandedStatItem}>
                  <Ionicons
                    name="flame"
                    size={20}
                    color="#FF9800"
                    style={styles.expandedStatIcon}
                  />
                  <View>
                    <Text
                      style={[
                        styles.expandedStatLabel,
                        { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                      ]}
                    >
                      Série actuelle
                    </Text>
                    <Text
                      style={[
                        styles.expandedStatValue,
                        { color: dark ? COLORS.white : COLORS.black },
                      ]}
                    >
                      {stats.longestStreak} jours
                    </Text>
                  </View>
                </View>

                <View style={styles.expandedStatItem}>
                  <Ionicons
                    name="speedometer"
                    size={20}
                    color="#4CAF50"
                    style={styles.expandedStatIcon}
                  />
                  <View>
                    <Text
                      style={[
                        styles.expandedStatLabel,
                        { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                      ]}
                    >
                      Taux de complétion
                    </Text>
                    <Text
                      style={[
                        styles.expandedStatValue,
                        { color: dark ? COLORS.white : COLORS.black },
                      ]}
                    >
                      {stats.completionRate}%
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.calendarStatsContainer}>
                <Text
                  style={[
                    styles.calendarStatsTitle,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  Activité cette semaine
                </Text>

                <View style={styles.activityCalendar}>
                  {Array.from({ length: 7 }).map((_, index) => {
                    // Randomly generate activity level for demo
                    const activityLevel = Math.floor(Math.random() * 4); // 0-3

                    // Get day name (Mon, Tue, etc.)
                    const date = new Date();
                    date.setDate(date.getDate() - (6 - index));
                    const dayName = date
                      .toLocaleDateString("fr-FR", { weekday: "short" })
                      .slice(0, 3);

                    return (
                      <View key={index} style={styles.calendarDay}>
                        <View
                          style={[
                            styles.activityDot,
                            {
                              backgroundColor:
                                activityLevel === 0
                                  ? "rgba(0,0,0,0.1)"
                                  : activityLevel === 1
                                    ? "rgba(76, 175, 80, 0.3)"
                                    : activityLevel === 2
                                      ? "rgba(76, 175, 80, 0.6)"
                                      : "rgba(76, 175, 80, 1)",
                            },
                          ]}
                        />
                        <Text
                          style={[
                            styles.dayLabel,
                            {
                              color: dark
                                ? COLORS.secondaryWhite
                                : COLORS.gray3,
                            },
                          ]}
                        >
                          {dayName}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </MotiView>
        )}
      </TouchableOpacity>

      {/* Subjects Performance */}
      <View style={styles.subjectsSection}>
        <Text
          style={[
            styles.sectionTitle,
            { color: dark ? COLORS.white : COLORS.black },
          ]}
        >
          Performance par matière
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subjectsScrollContent}
          snapToInterval={CARD_WIDTH + 16} // Card width + gap
          decelerationRate="fast"
        >
          {subjects.map((subject, index) => {
            const colors = getSubjectColor(subject.subject, subject.color);
            const icon = getSubjectIcon(subject.subject, subject.icon);
            const improvement = getImprovementDisplay(subject.improvement);

            return (
              <MotiView
                key={`${subject.subject}-${index}`}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  damping: 15,
                  delay: index * 100,
                  stiffness: 100,
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.subjectCard,
                    { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
                  ]}
                  onPress={() =>
                    onSubjectPress && onSubjectPress(subject.subject)
                  }
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.subjectCardHeader}
                  >
                    <View style={styles.subjectIconContainer}>
                      <Ionicons name={icon as any} size={24} color="#FFFFFF" />
                    </View>

                    <Text style={styles.subjectName}>{subject.subject}</Text>

                    {subject.grade && (
                      <View
                        style={[
                          styles.gradeBadge,
                          {
                            backgroundColor:
                              getGradeColor(subject.grade) + "30",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.gradeText,
                            { color: getGradeColor(subject.grade) },
                          ]}
                        >
                          {subject.grade}
                        </Text>
                      </View>
                    )}
                  </LinearGradient>

                  <View style={styles.subjectCardContent}>
                    <View style={styles.subjectProgressSection}>
                      <View style={styles.subjectProgressHeader}>
                        <Text
                          style={[
                            styles.subjectProgressLabel,
                            {
                              color: dark
                                ? COLORS.secondaryWhite
                                : COLORS.gray3,
                            },
                          ]}
                        >
                          Progression
                        </Text>
                        <Text
                          style={[
                            styles.subjectProgressValue,
                            { color: dark ? COLORS.white : COLORS.black },
                          ]}
                        >
                          {subject.progress}%
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.subjectProgressBarContainer,
                          {
                            backgroundColor: dark
                              ? "rgba(255,255,255,0.1)"
                              : "rgba(0,0,0,0.05)",
                          },
                        ]}
                      >
                        <LinearGradient
                          colors={colors}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[
                            styles.subjectProgressBar,
                            { width: `${subject.progress}%` },
                          ]}
                        />
                      </View>
                    </View>

                    <View style={styles.subjectStatsSection}>
                      <View style={styles.subjectStatItem}>
                        <Ionicons
                          name="layers"
                          size={16}
                          color={colors[0]}
                          style={styles.subjectStatIcon}
                        />
                        <Text
                          style={[
                            styles.subjectStatValue,
                            { color: dark ? COLORS.white : COLORS.black },
                          ]}
                        >
                          {subject.recentActivities}
                        </Text>
                        <Text
                          style={[
                            styles.subjectStatLabel,
                            {
                              color: dark
                                ? COLORS.secondaryWhite
                                : COLORS.gray3,
                            },
                          ]}
                        >
                          Activités
                        </Text>
                      </View>

                      {subject.streak !== undefined && (
                        <View style={styles.subjectStatItem}>
                          <Ionicons
                            name="flame"
                            size={16}
                            color="#FF9800"
                            style={styles.subjectStatIcon}
                          />
                          <Text
                            style={[
                              styles.subjectStatValue,
                              { color: dark ? COLORS.white : COLORS.black },
                            ]}
                          >
                            {subject.streak}
                          </Text>
                          <Text
                            style={[
                              styles.subjectStatLabel,
                              {
                                color: dark
                                  ? COLORS.secondaryWhite
                                  : COLORS.gray3,
                              },
                            ]}
                          >
                            Jours
                          </Text>
                        </View>
                      )}

                      {subject.improvement !== undefined && (
                        <View style={styles.subjectStatItem}>
                          <Ionicons
                            name={improvement.icon as any}
                            size={16}
                            color={improvement.color}
                            style={styles.subjectStatIcon}
                          />
                          <Text
                            style={[
                              styles.subjectStatValue,
                              { color: dark ? COLORS.white : COLORS.black },
                            ]}
                          >
                            {subject.improvement > 0 ? "+" : ""}
                            {subject.improvement}%
                          </Text>
                          <Text
                            style={[
                              styles.subjectStatLabel,
                              {
                                color: dark
                                  ? COLORS.secondaryWhite
                                  : COLORS.gray3,
                              },
                            ]}
                          >
                            Evolution
                          </Text>
                        </View>
                      )}
                    </View>

                    {subject.lastActivity && (
                      <Text
                        style={[
                          styles.lastActivityText,
                          {
                            color: dark ? COLORS.secondaryWhite : COLORS.gray3,
                          },
                        ]}
                      >
                        Dernière activité: {subject.lastActivity}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              </MotiView>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  headerGradient: {
    borderRadius: 24,
    marginHorizontal: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  headerContent: {
    padding: 20,
  },
  childName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  childClass: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 16,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
  },
  progressValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
  },
  timeframeSelector: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 4,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    borderRadius: 16,
  },
  selectedTimeframe: {
    backgroundColor: "#FFFFFF",
  },
  timeframeText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  selectedTimeframeText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  statsCard: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: -20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  statsCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statsCardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  expandedStatsSection: {
    marginTop: 16,
  },
  expandedStatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
  },
  expandedStatItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  expandedStatIcon: {
    marginRight: 12,
  },
  expandedStatLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  expandedStatValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  calendarStatsContainer: {
    marginBottom: 8,
  },
  calendarStatsTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  activityCalendar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  calendarDay: {
    alignItems: "center",
  },
  activityDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 4,
  },
  dayLabel: {
    fontSize: 12,
  },
  subjectsSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  subjectsScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  subjectCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    marginRight: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subjectCardHeader: {
    padding: 16,
  },
  subjectIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  gradeBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  gradeText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  subjectCardContent: {
    padding: 16,
  },
  subjectProgressSection: {
    marginBottom: 16,
  },
  subjectProgressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  subjectProgressLabel: {
    fontSize: 14,
  },
  subjectProgressValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  subjectProgressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  subjectProgressBar: {
    height: "100%",
    borderRadius: 4,
  },
  subjectStatsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  subjectStatItem: {
    alignItems: "center",
    flex: 1,
  },
  subjectStatIcon: {
    marginBottom: 4,
  },
  subjectStatValue: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  subjectStatLabel: {
    fontSize: 12,
  },
  lastActivityText: {
    fontSize: 12,
    fontStyle: "italic",
  },
});

export default PerformanceDashboard;
