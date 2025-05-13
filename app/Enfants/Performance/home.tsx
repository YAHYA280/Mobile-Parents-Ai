import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCheckCircle,
  faFilter,
  faTrophy,
  faChartLine,
  faClock,
  faRocket,
  faPaperPlane,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

import { COLORS } from "../../../constants/theme";
import { useActivityFilters } from "./activityFilters";
import type { Child, Activity } from "../../../data/Enfants/CHILDREN_DATA";

// Utility function to get progress color
function getProgressColor(progress: number): string {
  if (progress < 30) return "#FC4E00"; // Red
  if (progress <= 50) return "#EBB016"; // Orange
  if (progress <= 70) return "#F3BB00"; // Yellow
  return "#24D26D"; // Green
}

// Feedback item interface
interface FeedbackItem {
  id: string;
  text: string;
  date: string;
  childName: string;
  filters: {
    assistants: string[];
    subjects: string[];
    dateRange: {
      startDate: string | null;
      endDate: string | null;
    };
  };
}

// Performance calculation result interface
interface PerformanceData {
  averagePercentage: string;
  subjectPerformance: Record<string, { total: number; possible: number }>;
  recentActivities: Activity[];
}

// Performance component props
interface PerformanceHomeProps {
  childData: Child;
  isTabComponent?: boolean;
}

const PerformanceHome: React.FC<PerformanceHomeProps> = ({
  childData,
  isTabComponent = false,
}) => {
  // State for feedback functionality
  const [feedback, setFeedback] = useState<string>("");
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(
    null
  );
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [editingFeedback, setEditingFeedback] = useState<string>("");

  // Handle filters using the activity filters hook
  const {
    advancedFilters,
    activityDateRange,
    filteredActivities,
    setAdvancedFilters,
    resetActivityFilters,
  } = useActivityFilters(childData.activitesRecentes);

  // Save feedback
  const saveFeedback = useCallback((): void => {
    if (feedback.trim() === "") return;

    const newFeedback: FeedbackItem = {
      id: Date.now().toString(),
      text: feedback,
      date: new Date().toLocaleDateString(),
      childName: childData.name,
      filters: {
        assistants: advancedFilters.selectedAssistants,
        subjects: advancedFilters.selectedSubjects,
        dateRange: activityDateRange,
      },
    };

    setFeedbackHistory((prev) => [newFeedback, ...prev]);
    setFeedback("");
  }, [feedback, childData.name, advancedFilters, activityDateRange]);

  // Performance calculation function based on filtered activities
  const calculatePerformance = useCallback((): PerformanceData => {
    if (!childData)
      return {
        averagePercentage: "0",
        subjectPerformance: {},
        recentActivities: [],
      };

    // Performance calculation logic
    let totalScore = 0;
    let totalPossible = 0;
    const subjectPerformance: Record<
      string,
      { total: number; possible: number }
    > = {};

    filteredActivities.forEach((activity) => {
      if (!activity.score || !activity.score.includes("/")) return;

      const [score, possible] = activity.score
        .split("/")
        .map((num) => parseInt(num, 10));

      totalScore += score;
      totalPossible += possible;

      if (activity.matiere) {
        if (!subjectPerformance[activity.matiere]) {
          subjectPerformance[activity.matiere] = { total: 0, possible: 0 };
        }
        subjectPerformance[activity.matiere].total += score;
        subjectPerformance[activity.matiere].possible += possible;
      }
    });

    const averagePercentage =
      totalPossible > 0 ? ((totalScore / totalPossible) * 100).toFixed(1) : "0";

    return {
      averagePercentage,
      subjectPerformance,
      recentActivities: filteredActivities.slice(0, 3),
    };
  }, [childData, filteredActivities]);

  // Memoize performance data
  const performanceData = calculatePerformance();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: isTabComponent ? 90 : 40,
          paddingTop: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Global Performance Card */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", color: "#333333" }}
            >
              Performance Globale
            </Text>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(255, 142, 105, 0.1)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon
                icon={faTrophy}
                size={18}
                color={COLORS.primary}
              />
            </View>
          </View>

          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 40,
                fontWeight: "bold",
                color: getProgressColor(
                  parseFloat(performanceData.averagePercentage)
                ),
                marginBottom: 8,
              }}
            >
              {performanceData.averagePercentage}%
            </Text>
            <Text style={{ fontSize: 14, color: "#666666" }}>
              Score moyen sur toutes les activités
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "rgba(255, 142, 105, 0.1)",
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                marginRight: 8,
              }}
            >
              <FontAwesomeIcon
                icon={faFilter}
                size={16}
                color={COLORS.primary}
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
                Filtres avancés
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                marginLeft: 8,
              }}
              onPress={resetActivityFilters}
            >
              <FontAwesomeIcon
                icon={faTimesCircle}
                size={16}
                color="#666666"
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: "#666666", fontWeight: "600" }}>
                Réinitialiser
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Subject Performance Card */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", color: "#333333" }}
            >
              Performance par matière
            </Text>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(36, 210, 109, 0.1)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon icon={faChartLine} size={18} color="#24D26D" />
            </View>
          </View>

          {Object.entries(performanceData.subjectPerformance).length > 0 ? (
            Object.entries(performanceData.subjectPerformance).map(
              ([subject, data], index) => {
                const percentage = ((data.total / data.possible) * 100).toFixed(
                  1
                );
                const progressColor = getProgressColor(parseFloat(percentage));

                return (
                  <View
                    key={index}
                    style={{
                      marginBottom:
                        index <
                        Object.entries(performanceData.subjectPerformance)
                          .length -
                          1
                          ? 16
                          : 0,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#333333",
                        }}
                      >
                        {subject}
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: progressColor,
                        }}
                      >
                        {percentage}%
                      </Text>
                    </View>
                    <View
                      style={{
                        height: 10,
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        borderRadius: 5,
                        overflow: "hidden",
                      }}
                    >
                      <LinearGradient
                        colors={[progressColor, `${progressColor}80`]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                          width: `${parseFloat(percentage)}%`,
                          height: "100%",
                          borderRadius: 5,
                        }}
                      />
                    </View>
                  </View>
                );
              }
            )
          ) : (
            <View style={{ alignItems: "center", padding: 20 }}>
              <Text style={{ color: "#666666" }}>Aucune donnée disponible</Text>
            </View>
          )}
        </View>

        {/* Quick Stats Card */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", color: "#333333" }}
            >
              Statistiques rapides
            </Text>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {/* Engagement Score */}
            <View
              style={{
                backgroundColor: "rgba(36, 210, 109, 0.1)",
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
                flex: 1,
                marginRight: 8,
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: "rgba(36, 210, 109, 0.2)",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <FontAwesomeIcon icon={faRocket} size={20} color="#24D26D" />
              </View>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#24D26D",
                  marginBottom: 4,
                }}
              >
                {childData?.engagementScore
                  ? `${childData.engagementScore.toFixed(1)}%`
                  : "N/A"}
              </Text>
              <Text
                style={{ fontSize: 14, color: "#666666", textAlign: "center" }}
              >
                Engagement
              </Text>
            </View>

            {/* Evolution Rate */}
            <View
              style={{
                backgroundColor: "rgba(33, 150, 243, 0.1)",
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
                flex: 1,
                marginLeft: 8,
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: "rgba(33, 150, 243, 0.2)",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <FontAwesomeIcon icon={faChartLine} size={20} color="#2196F3" />
              </View>
              {childData?.evolutionRate !== undefined ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color:
                        childData.evolutionRate > 0 ? "#24D26D" : "#FC4E00",
                      marginBottom: 4,
                    }}
                  >
                    {childData.evolutionRate > 0 ? "+" : ""}
                    {childData.evolutionRate.toFixed(1)}%
                  </Text>
                </View>
              ) : (
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: "#2196F3",
                    marginBottom: 4,
                  }}
                >
                  N/A
                </Text>
              )}
              <Text
                style={{ fontSize: 14, color: "#666666", textAlign: "center" }}
              >
                Évolution
              </Text>
            </View>
          </View>
        </View>

        {/* Time Distribution Card */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", color: "#333333" }}
            >
              Répartition du temps
            </Text>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(255, 193, 7, 0.1)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon icon={faClock} size={18} color="#FFC107" />
            </View>
          </View>

          {/* Placeholder for time distribution chart */}
          <View
            style={{
              height: 200,
              backgroundColor: "rgba(0, 0, 0, 0.03)",
              borderRadius: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#666666" }}>
              Graphique de répartition du temps
            </Text>
          </View>
        </View>

        {/* Recommendations Card */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", color: "#333333" }}
            >
              Recommandations
            </Text>
          </View>

          {/* Add Feedback Input */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "rgba(0, 0, 0, 0.03)",
              borderRadius: 12,
              padding: 12,
              marginBottom: 16,
            }}
          >
            <TextInput
              placeholder="Ajouter une recommandation..."
              value={feedback}
              onChangeText={setFeedback}
              multiline
              style={{
                flex: 1,
                color: "#333333",
                maxHeight: 100,
                paddingTop: 0,
                paddingBottom: 0,
              }}
            />
            <TouchableOpacity
              onPress={saveFeedback}
              disabled={feedback.trim() === ""}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor:
                  feedback.trim() === ""
                    ? "rgba(0, 0, 0, 0.05)"
                    : COLORS.primary,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "flex-end",
              }}
            >
              <FontAwesomeIcon
                icon={faPaperPlane}
                size={16}
                color={feedback.trim() === "" ? "#666666" : "#FFFFFF"}
              />
            </TouchableOpacity>
          </View>

          {/* Feedback History */}
          {feedbackHistory.length > 0 ? (
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#333333",
                  marginBottom: 12,
                }}
              >
                Historique des recommandations
              </Text>

              {feedbackHistory.map((item) => (
                <View
                  key={item.id}
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.03)",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#333333",
                      }}
                    >
                      {item.date}
                    </Text>
                    {item.filters.assistants.length > 0 && (
                      <Text style={{ fontSize: 12, color: COLORS.primary }}>
                        {item.filters.assistants.join(", ")}
                      </Text>
                    )}
                  </View>
                  <Text style={{ fontSize: 14, color: "#666666" }}>
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={{ alignItems: "center", padding: 16 }}>
              <Text style={{ color: "#666666" }}>
                Aucune recommandation pour le moment
              </Text>
            </View>
          )}
        </View>

        {/* Export PDF Button */}
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            paddingVertical: 14,
            paddingHorizontal: 20,
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesomeIcon
            icon={faRocket}
            size={18}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "600" }}>
            Exporter rapport PDF
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PerformanceHome;
