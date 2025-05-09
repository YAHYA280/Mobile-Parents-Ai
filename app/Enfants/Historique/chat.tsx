import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState, useEffect } from "react";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
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
const ASSISTANT_THEME: {
  [key: string]: { colors: [string, string]; icon: string };
} = {
  "J'Apprends": {
    colors: ["#4CAF50", "#2E7D32"],
    icon: "chalkboard-teacher",
  },
  Recherche: {
    colors: ["#2196F3", "#1565C0"],
    icon: "search",
  },
  Accueil: {
    colors: ["#FF9800", "#F57C00"],
    icon: "home",
  },
  Autre: {
    colors: ["#9C27B0", "#7B1FA2"],
    icon: "robot",
  },
};

const ChatScreen = () => {
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
  }, [childId, activityId, router]); // Added router to the dependency array

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
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
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
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <FontAwesome5
            name="exclamation-circle"
            size={64}
            color={dark ? COLORS.white : COLORS.black}
          />
          <Text
            style={{ marginTop: 20, color: dark ? COLORS.white : COLORS.black }}
          >
            Conversation introuvable
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 20,
              backgroundColor: COLORS.primary,
              padding: 12,
              borderRadius: 8,
            }}
            onPress={handleBack}
          >
            <Text style={{ color: COLORS.white }}>Retour</Text>
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: dark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)",
            }}
          >
            <TouchableOpacity onPress={handleBack} style={{ marginRight: 16 }}>
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
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
              }}
            >
              <FontAwesome5 name={assistantTheme.icon} size={16} color="#FFF" />
            </LinearGradient>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: dark ? COLORS.white : COLORS.black,
                }}
              >
                Assistant {assistantName}
              </Text>
              <Text
                style={{
                  fontSize: 12,
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
              padding: 12,
              backgroundColor: dark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.03)",
              borderBottomWidth: 1,
              borderBottomColor: dark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  textAlign: "center",
                  color: dark ? COLORS.secondaryWhite : COLORS.gray3,
                  flex: 1,
                }}
              >
                {activity.activite}
              </Text>
              <TouchableOpacity
                onPress={() => setShowStatement(!showStatement)}
                style={{ padding: 8 }}
              >
                <FontAwesome5
                  name={showStatement ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={dark ? COLORS.secondaryWhite : COLORS.gray3}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Corrected Statement Section */}
          {showStatement && <Statement activity={activity} dark={dark} />}

          {/* Rest of the code remains the same... */}
          {/* Chat Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1, padding: 16 }}
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          >
            {conversation.map((msg, index) => (
              <View
                key={index}
                style={{
                  marginBottom: 16,
                  alignItems:
                    msg.sender === "assistant" ? "flex-start" : "flex-end",
                }}
              >
                <View
                  style={{
                    backgroundColor:
                      msg.sender === "assistant"
                        ? dark
                          ? "rgba(0, 149, 255, 0.2)"
                          : "rgba(0, 149, 255, 0.1)"
                        : dark
                          ? "rgba(66, 66, 66, 0.8)"
                          : "#E1E1E1",
                    padding: 16,
                    borderRadius: 16,
                    maxWidth: "80%",
                    borderTopLeftRadius: msg.sender === "assistant" ? 4 : 16,
                    borderTopRightRadius: msg.sender === "assistant" ? 16 : 4,
                  }}
                >
                  <Text
                    style={{
                      color:
                        msg.sender === "assistant"
                          ? dark
                            ? COLORS.white
                            : COLORS.primary
                          : dark
                            ? COLORS.white
                            : COLORS.black,
                      fontSize: 15,
                      lineHeight: 22,
                    }}
                  >
                    {msg.message}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: dark
                        ? "rgba(255, 255, 255, 0.5)"
                        : "rgba(0, 0, 0, 0.5)",
                      alignSelf: "flex-end",
                      marginTop: 4,
                    }}
                  >
                    {msg.timestamp}
                  </Text>
                </View>
              </View>
            ))}
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
                : "rgba(0,0,0,0.1)",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: dark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 8,
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
              padding: 12,
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
            <Text style={{ color: COLORS.primary, fontSize: 13 }}>
              Ceci est un historique de conversation en lecture seule
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
