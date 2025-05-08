import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState, useEffect } from "react";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MotiView } from "moti";
import {
  View,
  Text,
  Alert,
  Platform,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Dimensions,
  StyleSheet,
  StatusBar,
} from "react-native";

import type { Child, Activity } from "../../../data/Enfants/CHILDREN_DATA";

import Statement from "./statement";
import { COLORS } from "../../../constants/theme";
import { useTheme } from "../../../theme/ThemeProvider";
import {
  CHILDREN_DATA,
  enhanceActivity,
} from "../../../data/Enfants/CHILDREN_DATA";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Assistant mapping with colors and icons
const ASSISTANT_THEME: {
  [key: string]: {
    colors: [string, string];
    icon: string;
    displayName: string;
  };
} = {
  "J'Apprends": {
    colors: ["#4CAF50", "#2E7D32"],
    icon: "school",
    displayName: "Éducation",
  },
  Recherche: {
    colors: ["#2196F3", "#1565C0"],
    icon: "search",
    displayName: "Recherche",
  },
  Accueil: {
    colors: ["#FF9800", "#F57C00"],
    icon: "home",
    displayName: "Accueil",
  },
  Autre: {
    colors: ["#9C27B0", "#7B1FA2"],
    icon: "apps",
    displayName: "Assistant",
  },
};

const EnhancedChatScreen = () => {
  const router = useRouter();
  const { dark, colors } = useTheme();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);

  // Get IDs
  const activityId = Number(params.activityId);
  const childId = Number(params.childId);
  const fromDetails = params.fromDetails === "true";

  // States
  const [child, setChild] = useState<Child | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showStatement, setShowStatement] = useState(false);
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(
    null
  );

  // Fetch data
  useEffect(() => {
    const fetchData = () => {
      try {
        setIsLoading(true);

        // Find child
        const foundChild = CHILDREN_DATA.find((c) => c.id === childId);
        if (!foundChild) {
          Alert.alert("Erreur", "Enfant non trouvé");
          router.back();
          return;
        }
        setChild(foundChild);

        // Find activity
        const foundActivity = foundChild.activitesRecentes.find(
          (a) => a.id === activityId
        );
        if (!foundActivity) {
          Alert.alert("Erreur", "Activité non trouvée");
          router.back();
          return;
        }

        // Enhance data
        const enhancedActivity = enhanceActivity(foundActivity);
        setActivity(enhancedActivity);
      } catch (error) {
        console.error("Erreur:", error);
        Alert.alert("Erreur", "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [childId, activityId, router]);

  // Scroll to bottom when conversation changes
  useEffect(() => {
    // Wait for rendering to complete
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    return () => clearTimeout(timer);
  }, [activity?.conversation]);

  // Go back
  const handleBack = () => {
    if (fromDetails) {
      router.back();
    } else {
      router.push(
        `/Enfants/Historique/historydetails?activityId=${activityId}&childId=${childId}`
      );
    }
  };

  // Toggle message expansion
  const toggleMessageExpansion = (messageId: string) => {
    if (expandedMessageId === messageId) {
      setExpandedMessageId(null);
    } else {
      setExpandedMessageId(messageId);
    }
  };

  // Loading display
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar barStyle={dark ? "light-content" : "dark-content"} />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 800, loop: true }}
          >
            <ActivityIndicator size="large" color={COLORS.primary} />
          </MotiView>
          <Text
            style={{ marginTop: 20, color: dark ? COLORS.white : COLORS.black }}
          >
            Chargement de la conversation...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Data not found
  if (!activity || !child) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar barStyle={dark ? "light-content" : "dark-content"} />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 13 }}
          >
            <FontAwesome5
              name="exclamation-circle"
              size={64}
              color={dark ? COLORS.white : COLORS.black}
            />
            <Text style={styles.notFoundTitle}>Conversation introuvable</Text>
            <TouchableOpacity
              style={styles.backButtonLarge}
              onPress={handleBack}
            >
              <Text style={styles.backButtonText}>Retour</Text>
            </TouchableOpacity>
          </MotiView>
        </View>
      </SafeAreaView>
    );
  }

  // Theme variables
  const assistantName = activity.assistant || "Autre";
  const assistantTheme =
    ASSISTANT_THEME[assistantName] || ASSISTANT_THEME.Autre;

  // Formatted date
  const activityDate = new Date(activity.date);
  const formattedDate = activityDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Get full conversation
  const conversation = activity.conversation || [];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View
            style={[
              styles.header,
              {
                borderBottomColor: dark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
              },
            ]}
          >
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={dark ? COLORS.white : COLORS.black}
              />
            </TouchableOpacity>

            <LinearGradient
              colors={assistantTheme.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.assistantIconContainer}
            >
              <Ionicons name={assistantTheme.icon} size={20} color="#FFF" />
            </LinearGradient>

            <View style={styles.headerInfo}>
              <Text
                style={[
                  styles.assistantName,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Assistant {assistantTheme.displayName}
              </Text>
              <Text
                style={[
                  styles.assistantDate,
                  { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                ]}
              >
                {formattedDate}
              </Text>
            </View>
          </View>

          {/* Activity Title Banner */}
          <TouchableOpacity
            style={[
              styles.titleBanner,
              {
                backgroundColor: dark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.03)",
                borderBottomColor: dark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
              },
            ]}
            onPress={() => setShowStatement(!showStatement)}
          >
            <View style={styles.titleBannerContent}>
              <MotiView
                animate={{
                  rotate: showStatement ? "180deg" : "0deg",
                }}
                transition={{
                  type: "timing",
                  duration: 300,
                }}
                style={styles.titleBannerIcon}
              >
                <FontAwesome5
                  name="chevron-down"
                  size={16}
                  color={dark ? COLORS.secondaryWhite : COLORS.gray3}
                />
              </MotiView>

              <Text
                style={[
                  styles.titleBannerText,
                  { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                ]}
              >
                {activity.activite}
              </Text>

              <View
                style={[
                  styles.subjectTag,
                  { backgroundColor: getSubjectColor(activity.matiere || "") },
                ]}
              >
                <Text style={styles.subjectTagText}>{activity.matiere}</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Statement Section - Animated */}
          {showStatement && (
            <MotiView
              from={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ type: "timing", duration: 300 }}
            >
              <Statement activity={activity} dark={dark} />
            </MotiView>
          )}

          {/* Chat Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {conversation.map((msg, index) => {
              const isAssistant = msg.sender === "assistant";
              const messageId = `${index}-${msg.timestamp}`;
              const isExpanded = expandedMessageId === messageId;
              const hasLongMessage = msg.message.length > 150;

              return (
                <MotiView
                  key={index}
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{
                    type: "spring",
                    damping: 18,
                    delay: index * 50,
                    stiffness: 100,
                  }}
                  style={[
                    styles.messageContainer,
                    isAssistant
                      ? styles.assistantMessageContainer
                      : styles.userMessageContainer,
                  ]}
                >
                  {isAssistant && (
                    <LinearGradient
                      colors={assistantTheme.colors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.messageBubbleIcon}
                    >
                      <Ionicons
                        name={assistantTheme.icon}
                        size={14}
                        color="#FFF"
                      />
                    </LinearGradient>
                  )}

                  <View
                    style={[
                      styles.messageBubble,
                      isAssistant
                        ? [
                            styles.assistantBubble,
                            {
                              backgroundColor: dark
                                ? "rgba(0, 149, 255, 0.2)"
                                : "rgba(0, 149, 255, 0.1)",
                            },
                          ]
                        : [
                            styles.userBubble,
                            {
                              backgroundColor: dark
                                ? "rgba(66, 66, 66, 0.8)"
                                : "#E9E9E9",
                            },
                          ],
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        {
                          color: isAssistant
                            ? dark
                              ? COLORS.white
                              : COLORS.primary
                            : dark
                              ? COLORS.white
                              : COLORS.black,
                        },
                      ]}
                    >
                      {hasLongMessage && !isExpanded
                        ? `${msg.message.substring(0, 150)}...`
                        : msg.message}
                    </Text>

                    {hasLongMessage && (
                      <TouchableOpacity
                        style={styles.expandButton}
                        onPress={() => toggleMessageExpansion(messageId)}
                      >
                        <Text style={styles.expandButtonText}>
                          {isExpanded ? "Voir moins" : "Voir plus"}
                        </Text>
                      </TouchableOpacity>
                    )}

                    <Text style={styles.messageTime}>{msg.timestamp}</Text>
                  </View>
                </MotiView>
              );
            })}
          </ScrollView>

          {/* Message Input (Disabled but looks interactive) */}
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: dark ? COLORS.dark1 : COLORS.white,
                borderTopColor: dark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
              },
            ]}
          >
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: dark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                },
              ]}
            >
              <TextInput
                placeholder="Ce chat est en lecture seule..."
                placeholderTextColor={
                  dark ? COLORS.secondaryWhite : COLORS.gray3
                }
                style={[
                  styles.input,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
                editable={false}
              />
              <Ionicons
                name="lock-closed"
                size={18}
                color={dark ? COLORS.secondaryWhite : COLORS.gray3}
              />
            </View>
          </View>

          {/* Info Banner */}
          <View
            style={[
              styles.infoBanner,
              {
                backgroundColor: dark
                  ? "rgba(0, 149, 255, 0.1)"
                  : "rgba(0, 149, 255, 0.05)",
              },
            ]}
          >
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
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Helper function to get color based on subject
const getSubjectColor = (subject: string): string => {
  const subjectLower = subject?.toLowerCase() || "";

  if (subjectLower.includes("math")) return "#2196F3";
  if (subjectLower.includes("français") || subjectLower.includes("francais"))
    return "#4CAF50";
  if (subjectLower.includes("histoire") || subjectLower.includes("géo"))
    return "#FF9800";
  if (subjectLower.includes("science")) return "#9C27B0";
  if (subjectLower.includes("anglais")) return "#F44336";

  // Default color
  return COLORS.primary;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  assistantIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  headerInfo: {
    flex: 1,
  },
  assistantName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  assistantDate: {
    fontSize: 13,
  },
  titleBanner: {
    padding: 14,
    borderBottomWidth: 1,
  },
  titleBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleBannerIcon: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBannerText: {
    flex: 1,
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  subjectTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subjectTagText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
    maxWidth: "85%",
  },
  assistantMessageContainer: {
    alignSelf: "flex-start",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
  },
  messageBubbleIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  messageBubble: {
    borderRadius: 18,
    padding: 12,
    paddingHorizontal: 16,
  },
  assistantBubble: {
    borderTopLeftRadius: 4,
  },
  userBubble: {
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  expandButton: {
    marginTop: 6,
    alignSelf: "flex-start",
  },
  expandButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "500",
  },
  messageTime: {
    fontSize: 12,
    color: "rgba(150, 150, 150, 0.8)",
    alignSelf: "flex-end",
    marginTop: 6,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    alignItems: "center",
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 15,
    marginRight: 8,
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
    color: COLORS.primary,
    fontSize: 13,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 24,
  },
  backButtonLarge: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EnhancedChatScreen;
