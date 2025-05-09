// app/Enfants/Historique/[activityId]/chat.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "@/constants/theme";
import { useChildren } from "@/contexts/ChildrenContext";
import { useActivities } from "@/contexts/ActivitiesContext";
import { useTheme } from "@/contexts/ThemeContext";

import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import ConversationView from "@/components/chat/ConversationView";
import Header from "@/components/ui/Header";

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

  const { getChild } = useChildren();
  const { getActivity, loading } = useActivities();
  const { dark } = useTheme();

  const [showStatement, setShowStatement] = useState(false);

  const child = getChild(childIdNum);
  const activity = getActivity(activityIdNum, childIdNum);

  const handleBack = () => {
    router.back();
  };

  const toggleStatement = () => {
    setShowStatement(!showStatement);
  };

  // Get assistant theme
  const assistantName = activity?.assistant || "Autre";
  const assistantTheme =
    ASSISTANT_THEME[assistantName] || ASSISTANT_THEME.Autre;

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: dark ? COLORS.dark1 : "#F8F8F8" },
        ]}
      >
        <Header title="Conversation" onBackPress={handleBack} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text
            style={[
              styles.loadingText,
              { color: dark ? COLORS.white : "#333333" },
            ]}
          >
            Chargement de la conversation...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!activity || !child) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: dark ? COLORS.dark1 : "#F8F8F8" },
        ]}
      >
        <Header title="Conversation" onBackPress={handleBack} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#FF3B30" />
          <Text
            style={[
              styles.errorText,
              { color: dark ? COLORS.white : "#333333" },
            ]}
          >
            Conversation introuvable
          </Text>
          <TouchableOpacity style={styles.errorButton} onPress={handleBack}>
            <Text style={styles.errorButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: dark ? COLORS.dark1 : "#F8F8F8" },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        {/* Custom Header */}
        <View
          style={[
            styles.header,
            { backgroundColor: dark ? COLORS.dark2 : "#FFFFFF" },
          ]}
        >
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={dark ? COLORS.white : "#333333"}
            />
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
            <Text
              style={[
                styles.assistantName,
                { color: dark ? COLORS.white : "#333333" },
              ]}
            >
              Assistant {assistantName}
            </Text>
            <Text
              style={[
                styles.activityDate,
                { color: dark ? COLORS.secondaryWhite : "#757575" },
              ]}
            >
              {formattedDate}
            </Text>
          </View>
        </View>

        {/* Activity Title */}
        <View
          style={[
            styles.activityTitleContainer,
            {
              backgroundColor: dark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.03)",
            },
          ]}
        >
          <View style={styles.activityTitleContent}>
            <Text
              style={[
                styles.activityTitle,
                { color: dark ? COLORS.secondaryWhite : "#757575" },
              ]}
              numberOfLines={1}
            >
              {activity.activite}
            </Text>
            <TouchableOpacity
              onPress={toggleStatement}
              style={styles.toggleButton}
            >
              <Ionicons
                name={showStatement ? "chevron-up" : "chevron-down"}
                size={16}
                color={dark ? COLORS.secondaryWhite : "#757575"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Statement Section */}
        {showStatement && (
          <View
            style={[
              styles.statementContainer,
              {
                backgroundColor: dark
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(0,0,0,0.02)",
              },
            ]}
          >
            <Text
              style={[
                styles.statementTitle,
                { color: dark ? COLORS.white : "#333333" },
              ]}
            >
              Énoncé de l'exercice
            </Text>
            <Text
              style={[
                styles.statementText,
                { color: dark ? COLORS.secondaryWhite : "#333333" },
              ]}
            >
              {activity.commentaires ||
                "L'élève a travaillé sur un exercice qui utilise l'application d'IA pour apprendre."}
            </Text>

            {activity.recommandations &&
              activity.recommandations.length > 0 && (
                <View style={styles.recommendationsContainer}>
                  <Text
                    style={[
                      styles.recommendationsTitle,
                      { color: dark ? COLORS.white : "#333333" },
                    ]}
                  >
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
                        <Text
                          style={[
                            styles.recommendationText,
                            { color: dark ? COLORS.secondaryWhite : "#333333" },
                          ]}
                        >
                          {rec}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              )}
          </View>
        )}

        {/* Chat Messages */}
        <ConversationView
          messages={conversation}
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
        />

        {/* Message Input (Read-only) */}
        <ChatInput
          placeholder="Ce chat est en lecture seule..."
          disabled={true}
        />

        {/* Info Banner */}
        <View
          style={[
            styles.infoBanner,
            {
              backgroundColor: dark
                ? "rgba(33, 150, 243, 0.1)"
                : "rgba(33, 150, 243, 0.05)",
            },
          ]}
        >
          <Ionicons
            name="information-circle"
            size={18}
            color={COLORS.primary}
            style={styles.infoIcon}
          />
          <Text style={[styles.infoText, { color: COLORS.primary }]}>
            Ceci est un historique de conversation en lecture seule
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
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
  },
  activityDate: {
    fontSize: 12,
  },
  activityTitleContainer: {
    padding: 12,
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
    flex: 1,
    textAlign: "center",
  },
  toggleButton: {
    padding: 8,
  },
  statementContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  statementTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  statementText: {
    fontSize: 14,
    marginBottom: 12,
  },
  recommendationsContainer: {
    marginTop: 8,
  },
  recommendationsTitle: {
    fontSize: 15,
    fontWeight: "600",
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
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
  },
  infoBanner: {
    padding: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 13,
  },
});
