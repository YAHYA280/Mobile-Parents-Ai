// app/Enfants/Historique/[activityId]/chat.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/theme";
import { CHILDREN_DATA } from "@/data/Enfants/CHILDREN_DATA";

// Assistant themes for colors and icons
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

export default function ChatScreen() {
  const router = useRouter();
  const { activityId, childId } = useLocalSearchParams();
  const activityIdNum = Number(activityId);
  const childIdNum = Number(childId);

  const scrollViewRef = useRef<ScrollView>(null);
  const [child, setChild] = useState<any>(null);
  const [activity, setActivity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showStatement, setShowStatement] = useState(false);

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
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activityIdNum, childIdNum]);

  // Scroll to bottom when conversation changes
  useEffect(() => {
    if (!isLoading && activity?.conversation) {
      // Wait for rendering to complete
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isLoading, activity?.conversation]);

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>
            Chargement de la conversation...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!activity || !child) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#FF3B30" />
          <Text style={styles.errorText}>Conversation introuvable</Text>
          <TouchableOpacity style={styles.errorButton} onPress={handleBack}>
            <Text style={styles.errorButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Get assistant theme
  const assistantName = activity.assistant || "Autre";
  const assistantTheme =
    ASSISTANT_THEME[assistantName] || ASSISTANT_THEME.Autre;

  // Format date
  const activityDate = new Date(activity.date);
  const formattedDate = activityDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Get conversation
  const conversation = activity.conversation || [];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>

          <LinearGradient
            colors={assistantTheme.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.assistantIconContainer}
          >
            <Ionicons name={assistantTheme.icon} size={16} color="#FFFFFF" />
          </LinearGradient>

          <View style={styles.headerTextContainer}>
            <Text style={styles.assistantName}>Assistant {assistantName}</Text>
            <Text style={styles.activityDate}>{formattedDate}</Text>
          </View>
        </View>

        {/* Activity Title */}
        <View style={styles.activityTitleContainer}>
          <View style={styles.activityTitleContent}>
            <Text style={styles.activityTitle} numberOfLines={1}>
              {activity.activite}
            </Text>
            <TouchableOpacity
              onPress={() => setShowStatement(!showStatement)}
              style={styles.toggleButton}
            >
              <Ionicons
                name={showStatement ? "chevron-up" : "chevron-down"}
                size={16}
                color="#757575"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Statement Section */}
        {showStatement && (
          <View style={styles.statementContainer}>
            <Text style={styles.statementTitle}>Énoncé de l'exercice</Text>
            <Text style={styles.statementText}>
              {activity.commentaires ||
                "L'élève a travaillé sur un exercice qui utilise l'application d'IA pour apprendre."}
            </Text>

            {activity.recommandations &&
              activity.recommandations.length > 0 && (
                <View style={styles.recommendationsContainer}>
                  <Text style={styles.recommendationsTitle}>
                    Recommandations:
                  </Text>
                  {activity.recommandations.map(
                    (rec: string, index: number) => (
                      <View key={index} style={styles.recommendationItem}>
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color={COLORS.primary}
                          style={styles.recommendationIcon}
                        />
                        <Text style={styles.recommendationText}>{rec}</Text>
                      </View>
                    )
                  )}
                </View>
              )}
          </View>
        )}

        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {conversation.map((msg: any, index: number) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                msg.sender === "assistant"
                  ? styles.assistantBubble
                  : styles.userBubble,
              ]}
            >
              <Text style={styles.messageText}>{msg.message}</Text>
              <Text style={styles.messageTimestamp}>{msg.timestamp}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Message Input (Read-only) */}
        <View style={styles.inputContainer}>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Ce chat est en lecture seule..."
              placeholderTextColor="#757575"
              style={styles.textInput}
              editable={false}
            />
            <Ionicons name="lock-closed" size={18} color="#757575" />
          </View>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons
            name="information-circle"
            size={18}
            color={COLORS.primary}
            style={styles.infoIcon}
          />
          <Text style={styles.infoText}>
            Ceci est un historique de conversation en lecture seule
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  keyboardAvoidingContainer: {
    flex: 1,
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
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  backButton: {
    marginRight: 16,
  },
  assistantIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  assistantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  activityDate: {
    fontSize: 12,
    color: "#757575",
  },
  activityTitleContainer: {
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  activityTitleContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activityTitle: {
    fontSize: 15,
    color: "#757575",
    flex: 1,
    textAlign: "center",
  },
  toggleButton: {
    padding: 8,
  },
  statementContainer: {
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  statementTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  statementText: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 12,
  },
  recommendationsContainer: {
    marginTop: 8,
  },
  recommendationsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
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
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  chatContent: {
    paddingBottom: 16,
  },
  messageBubble: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    maxWidth: "80%",
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
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333333",
  },
  messageTimestamp: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.5)",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    alignItems: "center",
  },
  inputBox: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    color: "#333333",
    fontSize: 15,
  },
  infoBanner: {
    backgroundColor: "rgba(33, 150, 243, 0.05)",
    padding: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    color: COLORS.primary,
    fontSize: 13,
  },
});
