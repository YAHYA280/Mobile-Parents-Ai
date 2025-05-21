// app/Enfants/Historique/chat.tsx - With Bottom Padding
import React, { useRef, useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
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
  ActivityIndicator,
  KeyboardAvoidingView,
  Animated,
  StyleSheet,
  StatusBar,
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
  const [headerHeight, setHeaderHeight] = useState(0);

  // Get IDs
  const activityId = Number(params.activityId);
  const childId = Number(params.childId);
  const fromDetails = params.fromDetails === "true";

  // States
  const [child, setChild] = useState<Child | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showStatement, setShowStatement] = useState(false);

  const onHeaderLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

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

  // Data not found
  if (!activity || !child) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <Header title="Conversation" onBackPress={handleBack} />
        </View>
        <View style={styles.notFoundContainer}>
          <FontAwesomeIcon
            icon={"exclamation-circle" as IconProp}
            size={64}
            color={COLORS.black}
          />
          <Text style={styles.notFoundTitle}>Conversation introuvable</Text>
          <Text style={styles.notFoundSubtitle}>
            Les données que vous recherchez ne sont pas disponibles.
          </Text>
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        {/* Using the Header component */}
        <View style={styles.headerContainer} onLayout={onHeaderLayout}>
          <Header
            title={`Assistant ${assistantName}`}
            subtitle={formattedDate}
            onBackPress={handleBack}
            showBackButton={true}
            transparent={false}
          />
        </View>

        <Animated.View
          style={[
            styles.container,
            { opacity: fadeAnim },
            { paddingTop: headerHeight }, // Add padding to account for fixed header
          ]}
        >
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
            style={styles.chatContainer}
            contentContainerStyle={styles.chatContent}
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
            {/* Add extra space at the bottom */}
            <View style={styles.bottomSpacer} />
          </ScrollView>

          {/* Bottom Container - more visible with added padding */}
          <View style={styles.bottomContainer}>
            {/* Read-only Input */}
            <ReadOnlyInput />

            {/* Info Banner */}
            <InfoBanner />
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    zIndex: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  chatContent: {
    paddingBottom: 0, // Increased bottom padding
  },
  bottomSpacer: {
    height: 50, // Extra space at the bottom of the ScrollView
  },
  bottomContainer: {
    paddingBottom: 30, // Add some padding to the bottom container
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 20,
    color: COLORS.black,
    fontSize: 16,
    fontWeight: "500",
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 24,
    marginTop: 60, // To account for the header
  },
  notFoundTitle: {
    marginTop: 20,
    color: COLORS.black,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  notFoundSubtitle: {
    marginTop: 10,
    color: COLORS.gray3,
    textAlign: "center",
    marginBottom: 30,
  },
});

export default ChatScreen;
