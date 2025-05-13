// app/Enfants/Historique/chat.tsx
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import {
  faChalkboardTeacher,
  faSearch,
  faHome,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";

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
  Animated,
  Dimensions,
} from "react-native";

import type { Child, Activity } from "../../../data/Enfants/CHILDREN_DATA";

import Statement from "./statement";
import { COLORS } from "../../../constants/theme";
import { useTheme } from "../../../theme/ThemeProvider";
import {
  CHILDREN_DATA,
  enhanceActivity,
} from "../../../data/Enfants/CHILDREN_DATA";

// Assistant mapping with colors and icons
const ASSISTANT_THEME: Record<
  string,
  { colors: [string, string]; icon: IconProp }
> = {
  "J'Apprends": {
    colors: ["#4CAF50", "#2E7D32"],
    icon: faChalkboardTeacher,
  },
  Recherche: {
    colors: ["#2196F3", "#1565C0"],
    icon: faSearch,
  },
  Accueil: {
    colors: ["#FF9800", "#F57C00"],
    icon: faHome,
  },
  Autre: {
    colors: ["#9C27B0", "#7B1FA2"],
    icon: faRobot,
  },
};

const ChatScreen = () => {
  const router = useRouter();
  const { dark, colors } = useTheme();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Get IDs
  const activityId = Number(params.activityId);
  const childId = Number(params.childId);
  const fromDetails = params.fromDetails === "true";

  // States
  const [child, setChild] = useState<Child | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showStatement, setShowStatement] = useState(false);

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

        // Animate appearance
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }).start();
        }, 100);
      } catch (error) {
        console.error("Erreur:", error);
        Alert.alert("Erreur", "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [childId, activityId, router, fadeAnim]);

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

  // Loading display
  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: dark ? COLORS.dark1 : "#F8F8F8" }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: dark ? COLORS.dark1 : "#FFFFFF",
          }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text
            style={{
              marginTop: 20,
              color: dark ? COLORS.white : COLORS.black,
              fontSize: 16,
              fontFamily: "medium",
            }}
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
      <SafeAreaView
        style={{ flex: 1, backgroundColor: dark ? COLORS.dark1 : "#F8F8F8" }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: dark ? COLORS.dark1 : "#FFFFFF",
            padding: 24,
          }}
        >
          <FontAwesomeIcon
            icon="exclamation-circle"
            size={64}
            color={dark ? COLORS.white : COLORS.black}
          />
          <Text
            style={{
              marginTop: 20,
              color: dark ? COLORS.white : COLORS.black,
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Conversation introuvable
          </Text>
          <Text
            style={{
              marginTop: 10,
              color: dark ? COLORS.secondaryWhite : COLORS.gray3,
              textAlign: "center",
              marginBottom: 30,
            }}
          >
            Les données que vous recherchez ne sont pas disponibles.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              paddingVertical: 14,
              paddingHorizontal: 30,
              borderRadius: 25,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 5,
              elevation: 4,
            }}
            onPress={handleBack}
          >
            <Text
              style={{
                color: COLORS.white,
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              Retour
            </Text>
          </TouchableOpacity>
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

  // Prepare timestamp for bubble
  const formatTime = (timestamp: string) => {
    if (!timestamp || !timestamp.includes(":")) return "";
    const parts = timestamp.split(":");
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return timestamp;
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: dark ? COLORS.dark1 : "#F8F8F8" }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
            backgroundColor: dark ? COLORS.dark1 : "#F8F8F8",
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: dark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
              backgroundColor: dark ? COLORS.dark1 : "#FFFFFF",
              elevation: 2,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
            }}
          >
            <TouchableOpacity
              onPress={handleBack}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: dark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
              }}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={dark ? COLORS.white : COLORS.black}
              />
            </TouchableOpacity>

            <LinearGradient
              colors={assistantTheme.colors as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 3,
              }}
            >
              <FontAwesomeIcon
                icon={assistantTheme.icon}
                size={20}
                color="#FFF"
              />
            </LinearGradient>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: dark ? COLORS.white : COLORS.black,
                }}
              >
                Assistant {assistantName}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: dark ? COLORS.secondaryWhite : COLORS.gray3,
                }}
              >
                {formattedDate}
              </Text>
            </View>
          </View>

          {/* Activity Title */}
          <View
            style={{
              paddingVertical: 14,
              paddingHorizontal: 16,
              backgroundColor: dark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.02)",
              borderBottomWidth: 1,
              borderBottomColor: dark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: dark ? COLORS.secondaryWhite : COLORS.gray3,
                  flex: 1,
                }}
              >
                {activity.activite}
              </Text>
              <TouchableOpacity
                onPress={() => setShowStatement(!showStatement)}
                style={{
                  padding: 8,
                  backgroundColor: dark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                  borderRadius: 20,
                  width: 36,
                  height: 36,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesomeIcon
                  icon={showStatement ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={dark ? COLORS.secondaryWhite : COLORS.gray3}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Corrected Statement Section */}
          {showStatement && <Statement activity={activity} dark={dark} />}

          {/* Chat Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8 }}
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          >
            {conversation.map((msg, index) => {
              const isAssistant = msg.sender === "assistant";
              const prevMsgSameSender =
                index > 0 && conversation[index - 1].sender === msg.sender;
              const nextMsgSameSender =
                index < conversation.length - 1 &&
                conversation[index + 1].sender === msg.sender;

              // Calculate spacing and bubble styles based on message sequence
              const topMargin = prevMsgSameSender ? 6 : 16;
              const bottomMargin = nextMsgSameSender ? 6 : 16;

              // Customize border radius based on position in sequence
              let borderRadiusStyle = {};
              if (isAssistant) {
                borderRadiusStyle = {
                  borderTopLeftRadius: prevMsgSameSender ? 18 : 4,
                  borderBottomLeftRadius: nextMsgSameSender ? 18 : 4,
                  borderTopRightRadius: 18,
                  borderBottomRightRadius: 18,
                };
              } else {
                borderRadiusStyle = {
                  borderTopLeftRadius: 18,
                  borderBottomLeftRadius: 18,
                  borderTopRightRadius: prevMsgSameSender ? 18 : 4,
                  borderBottomRightRadius: nextMsgSameSender ? 18 : 4,
                };
              }

              return (
                <View
                  key={index}
                  style={{
                    marginTop: topMargin,
                    marginBottom: bottomMargin,
                    alignItems: isAssistant ? "flex-start" : "flex-end",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: isAssistant
                        ? dark
                          ? "rgba(0, 149, 255, 0.2)"
                          : "rgba(0, 149, 255, 0.08)"
                        : dark
                          ? "rgba(66, 66, 66, 0.8)"
                          : "#F0F0F0",
                      padding: 16,
                      maxWidth: "85%",
                      minWidth: 80,
                      ...borderRadiusStyle,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    <Text
                      style={{
                        color: isAssistant
                          ? dark
                            ? COLORS.white
                            : "#0066CC"
                          : dark
                            ? COLORS.white
                            : COLORS.black,
                        fontSize: 15,
                        lineHeight: 22,
                        fontWeight: isAssistant ? "normal" : "500",
                      }}
                    >
                      {msg.message}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        color: dark
                          ? "rgba(255, 255, 255, 0.5)"
                          : "rgba(0, 0, 0, 0.4)",
                        alignSelf: "flex-end",
                        marginTop: 6,
                      }}
                    >
                      {formatTime(msg.timestamp)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Message Input (Just for UI, not functional) */}
          <View
            style={{
              flexDirection: "row",
              padding: 12,
              backgroundColor: dark ? COLORS.dark1 : COLORS.white,
              borderTopWidth: 1,
              borderTopColor: dark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: dark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.03)",
                borderRadius: 25,
                paddingHorizontal: 16,
                paddingVertical: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TextInput
                placeholder="Ce chat est en lecture seule..."
                placeholderTextColor={
                  dark ? COLORS.secondaryWhite : COLORS.gray3
                }
                style={{
                  flex: 1,
                  color: dark ? COLORS.white : COLORS.black,
                  fontSize: 15,
                }}
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
            style={{
              backgroundColor: dark
                ? "rgba(0, 149, 255, 0.1)"
                : "rgba(0, 149, 255, 0.05)",
              padding: 14,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="information-circle"
              size={18}
              color={COLORS.primary}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                color: COLORS.primary,
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              Ceci est un historique de conversation en lecture seule
            </Text>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
