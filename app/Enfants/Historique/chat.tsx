// app/Enfants/Historique/chat.tsx - Refactored
import React, { useRef, useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
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
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Animated,
} from "react-native";

import type { Child, Activity } from "../../../data/Enfants/CHILDREN_DATA";

import Statement from "./statement";
import { COLORS } from "../../../constants/theme";
import Header from "../../../components/ui/Header";
import {
  CHILDREN_DATA,
  enhanceActivity,
} from "../../../data/Enfants/CHILDREN_DATA";

// Import components
import {
  ActivityTitleBar,
  MessageBubble,
  ReadOnlyInput,
  InfoBanner,
} from "./components";

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

const ChatScreen: React.FC = () => {
  const router = useRouter();
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

  // Toggle statement view
  const toggleStatement = () => {
    setShowStatement(!showStatement);
  };

  // Loading display
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
          }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text
            style={{
              marginTop: 20,
              color: COLORS.black,
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
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            padding: 24,
          }}
        >
          <FontAwesomeIcon
            icon={"exclamation-circle" as IconProp}
            size={64}
            color={COLORS.black}
          />
          <Text
            style={{
              marginTop: 20,
              color: COLORS.black,
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
              color: COLORS.gray3,
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

  // Custom header with the assistant icon
  const renderHeaderLeftAccessory = () => (
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
      <FontAwesomeIcon icon={assistantTheme.icon} size={20} color="#FFF" />
    </LinearGradient>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
            backgroundColor: "#F8F8F8",
          }}
        >
          {/* Header with Custom Left Accessory */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              elevation: 2,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              borderBottomWidth: 1,
              borderBottomColor: "rgba(0,0,0,0.05)",
            }}
          >
            <View style={{ width: 40, height: 40, marginLeft: 16 }}>
              <TouchableOpacity
                onPress={handleBack}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "rgba(0,0,0,0.05)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon
                  icon={"arrow-left" as IconProp}
                  size={18}
                  color={COLORS.black}
                />
              </TouchableOpacity>
            </View>

            {renderHeaderLeftAccessory()}

            <View style={{ paddingVertical: 16 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: COLORS.black,
                }}
              >
                Assistant {assistantName}
              </Text>
              <Text style={{ fontSize: 13, color: COLORS.gray3 }}>
                {formattedDate}
              </Text>
            </View>
          </View>

          {/* Activity Title */}
          <ActivityTitleBar
            activity={activity}
            showStatement={showStatement}
            toggleStatement={toggleStatement}
          />

          {/* Statement Section */}
          {showStatement && <Statement activity={activity} />}

          {/* Chat Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8 }}
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          >
            {conversation.map((msg, index) => (
              <MessageBubble
                key={index}
                message={msg}
                index={index}
                conversation={conversation}
              />
            ))}
          </ScrollView>

          {/* Read-only Input */}
          <ReadOnlyInput />

          {/* Info Banner */}
          <InfoBanner />
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
