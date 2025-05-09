// app/Enfants/Historique/[activityId]/index.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/theme";
import { CHILDREN_DATA } from "@/data/Enfants/CHILDREN_DATA";

// These would be imported from proper files in the full implementation
const SUBJECT_THEME: Record<string, any> = {
  Mathématiques: {
    colors: ["#2196F3", "#1565C0"],
    icon: "calculator-outline",
  },
  Français: {
    colors: ["#4CAF50", "#2E7D32"],
    icon: "book-outline",
  },
  Histoire: {
    colors: ["#FF9800", "#F57C00"],
    icon: "time-outline",
  },
  Sciences: {
    colors: ["#9C27B0", "#7B1FA2"],
    icon: "flask-outline",
  },
  Autre: {
    colors: ["#607D8B", "#455A64"],
    icon: "school-outline",
  },
};

const ASSISTANT_THEME: Record<string, any> = {
  "J'Apprends": {
    colors: ["#4CAF50", "#2E7D32"],
    icon: "school-outline",
  },
  Recherche: {
    colors: ["#2196F3", "#1565C0"],
    icon: "search-outline",
  },
  Accueil: {
    colors: ["#FF9800", "#F57C00"],
    icon: "home-outline",
  },
  Autre: {
    colors: ["#9C27B0", "#7B1FA2"],
    icon: "apps-outline",
  },
};

export default function ActivityDetailsScreen() {
  const router = useRouter();
  const { activityId, childId } = useLocalSearchParams();
  const activityIdNum = Number(activityId);
  const childIdNum = Number(childId);

  const [child, setChild] = useState<any>(null);
  const [activity, setActivity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [parentFeedback, setParentFeedback] = useState("");
  const [parentFeedbacks, setParentFeedbacks] = useState<any[]>([]);
  const [blocageIdentified, setBlockageIdentified] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      try {
        setIsLoading(true);

        // Find child
        const foundChild = CHILDREN_DATA.find((c) => c.id === childIdNum);
        if (!foundChild) {
          console.error("Child not found");
          router.back();
          return;
        }

        // Find activity
        const foundActivity = foundChild.activitesRecentes.find(
          (a: any) => a.id === activityIdNum
        );

        if (!foundActivity) {
          console.error("Activity not found");
          router.back();
          return;
        }

        setChild(foundChild);
        setActivity(foundActivity);

        // Simulate existing feedback
        setParentFeedbacks([
          {
            text: "Bon travail sur cette activité. On voit des progrès!",
            date: new Date(2023, 2, 22),
          },
        ]);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activityIdNum, childIdNum]);

  const handleBack = () => {
    router.back();
  };

  const navigateToChat = () => {
    router.push(`/Enfants/Historique/${activityId}/chat?childId=${childId}`);
  };

  const navigateToVideo = () => {
    router.push(`/Enfants/Historique/${activityId}/video?childId=${childId}`);
  };

  const toggleBlockageIdentification = () => {
    setBlockageIdentified(!blocageIdentified);
  };

  const addFeedback = () => {
    if (parentFeedback.trim() === "") {
      return;
    }

    setParentFeedbacks((prev) => [
      ...prev,
      { text: parentFeedback, date: new Date() },
    ]);

    setParentFeedback("");
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement des détails...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!activity || !child) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#FF3B30" />
          <Text style={styles.errorText}>Activité non trouvée</Text>
          <TouchableOpacity style={styles.errorButton} onPress={handleBack}>
            <Text style={styles.errorButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Get theme based on activity
  const subjectName = activity.matiere || "Autre";
  const subjectTheme = SUBJECT_THEME[subjectName] || SUBJECT_THEME.Autre;

  const assistantName = activity.assistant || "Autre";
  const assistantTheme =
    ASSISTANT_THEME[assistantName] || ASSISTANT_THEME.Autre;

  // Format date
  const activityDate = new Date(activity.date);
  const formattedDate = activityDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails de l&apos;activité</Text>
        <TouchableOpacity
          style={[
            styles.blockageButton,
            blocageIdentified && styles.blockageIdentified,
          ]}
          onPress={toggleBlockageIdentification}
        >
          <Ionicons
            name="alert-circle"
            size={24}
            color={blocageIdentified ? "#FF3B30" : "#CCCCCC"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Activity Card */}
        <View style={styles.activityCard}>
          {/* Assistant Type and Date */}
          <View style={styles.cardHeader}>
            <LinearGradient
              colors={assistantTheme.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.assistantBadge}
            >
              <Ionicons
                name={assistantTheme.icon}
                size={14}
                color="#FFFFFF"
                style={styles.assistantIcon}
              />
              <Text style={styles.assistantName}>{assistantName}</Text>
            </LinearGradient>
            <Text style={styles.activityDate}>{formattedDate}</Text>
          </View>

          {/* Activity Title with Subject Icon */}
          <View style={styles.titleContainer}>
            <LinearGradient
              colors={subjectTheme.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.subjectIconContainer}
            >
              <Ionicons name={subjectTheme.icon} size={16} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.activityTitle}>{activity.activite}</Text>
          </View>

          {/* Activity Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={16} color={COLORS.primary} />
              <Text style={styles.detailText}>Durée: {activity.duree}</Text>
            </View>

            {activity.difficulty && (
              <View style={styles.detailItem}>
                <Ionicons
                  name="stats-chart-outline"
                  size={16}
                  color={COLORS.primary}
                />
                <Text style={styles.detailText}>
                  Niveau: {activity.difficulty}
                </Text>
              </View>
            )}

            {activity.score && (
              <View style={styles.detailItem}>
                <Ionicons
                  name="star-outline"
                  size={16}
                  color={COLORS.primary}
                />
                <Text style={styles.detailText}>Score: {activity.score}</Text>
              </View>
            )}
          </View>

          {/* Chat Preview */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              Conversation avec l&apos;assistant
            </Text>

            <TouchableOpacity
              style={styles.viewAllLink}
              onPress={navigateToChat}
            >
              <Text style={styles.viewAllText}>Voir tout</Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={COLORS.primary}
              />
            </TouchableOpacity>

            <View style={styles.chatPreviewContainer}>
              {activity.conversation &&
                activity.conversation
                  .slice(0, 2)
                  .map((msg: any, index: number) => (
                    <View
                      key={index}
                      style={[
                        styles.chatBubble,
                        msg.sender === "assistant"
                          ? styles.assistantBubble
                          : styles.userBubble,
                      ]}
                    >
                      <Text style={styles.chatText}>{msg.message}</Text>
                      <Text style={styles.chatTimestamp}>{msg.timestamp}</Text>
                    </View>
                  ))}
            </View>

            <TouchableOpacity
              style={styles.chatFullButton}
              onPress={navigateToChat}
            >
              <Text style={styles.chatFullButtonText}>
                Voir la conversation complète
              </Text>
              <Ionicons name="chatbubbles-outline" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Comments and Recommendations */}
          {activity.commentaires && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Commentaires</Text>
              <View style={styles.commentContainer}>
                <Text style={styles.commentText}>{activity.commentaires}</Text>
              </View>
            </View>
          )}

          {activity.recommandations && activity.recommandations.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Recommandations</Text>
              {activity.recommandations.map((rec: string, index: number) => (
                <View key={index} style={styles.recommendationItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color="#4CAF50"
                    style={styles.recommendationIcon}
                  />
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Educational Resources */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Ressources pédagogiques</Text>

            <TouchableOpacity
              style={styles.resourceButton}
              onPress={navigateToVideo}
            >
              <Ionicons
                name="play-circle-outline"
                size={24}
                color={COLORS.primary}
                style={styles.resourceIcon}
              />
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>
                  Vidéo explicative - {subjectName}
                </Text>
                <Text style={styles.resourceSubtitle}>
                  Ressource complémentaire
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#757575" />
            </TouchableOpacity>
          </View>

          {/* Parent Feedback */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Commentaires des parents</Text>
            <View style={styles.feedbackContainer}>
              {parentFeedbacks.map((feedback, index) => (
                <View key={index} style={styles.feedbackItem}>
                  <Text style={styles.feedbackText}>{feedback.text}</Text>
                  <Text style={styles.feedbackDate}>
                    {feedback.date.toLocaleDateString()}
                  </Text>
                </View>
              ))}

              <View style={styles.addFeedbackContainer}>
                <TextInput
                  placeholder="Ajouter un commentaire..."
                  placeholderTextColor="#999999"
                  value={parentFeedback}
                  onChangeText={setParentFeedback}
                  style={styles.feedbackInput}
                  multiline
                />
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    !parentFeedback.trim() && styles.disabledButton,
                  ]}
                  onPress={addFeedback}
                  disabled={!parentFeedback.trim()}
                >
                  <Ionicons name="send" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    marginTop: 16,
    fontSize: 16,
    color: "#333333",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: "#333333",
    marginTop: 16,
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  errorButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  blockageButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  blockageIdentified: {
    backgroundColor: "rgba(255,59,48,0.2)",
  },
  scrollView: {
    flex: 1,
  },
  activityCard: {
    margin: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  assistantBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  assistantIcon: {
    marginRight: 6,
  },
  assistantName: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  activityDate: {
    fontSize: 12,
    color: "#757575",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  subjectIconContainer: {
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    flex: 1,
  },
  detailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    color: "#757575",
    marginLeft: 4,
    fontSize: 14,
  },
  sectionContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  viewAllLink: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  viewAllText: {
    color: COLORS.primary,
    marginRight: 4,
    fontSize: 14,
  },
  chatPreviewContainer: {
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 8,
    padding: 12,
  },
  chatBubble: {
    padding: 12,
    borderRadius: 12,
    maxWidth: "80%",
    marginBottom: 8,
  },
  assistantBubble: {
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    alignSelf: "flex-start",
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: "#E1E1E1",
    alignSelf: "flex-end",
    borderTopRightRadius: 4,
  },
  chatText: {
    fontSize: 14,
    color: "#333333",
  },
  chatTimestamp: {
    fontSize: 10,
    color: "#757575",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  chatFullButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  chatFullButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginRight: 8,
  },
  commentContainer: {
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 8,
    padding: 12,
  },
  commentText: {
    fontSize: 14,
    color: "#333333",
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  recommendationIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    fontSize: 14,
    color: "#333333",
    flex: 1,
  },
  resourceButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 8,
    padding: 12,
  },
  resourceIcon: {
    marginRight: 12,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 2,
  },
  resourceSubtitle: {
    fontSize: 12,
    color: "#757575",
  },
  feedbackContainer: {
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 8,
    padding: 12,
  },
  feedbackItem: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  feedbackText: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 4,
  },
  feedbackDate: {
    fontSize: 10,
    color: "#757575",
    alignSelf: "flex-end",
  },
  addFeedbackContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  feedbackInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 8,
    minHeight: 40,
    maxHeight: 80,
    fontSize: 14,
    color: "#333333",
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  TextInput: {
    // Just to make TypeScript happy
  },
});
