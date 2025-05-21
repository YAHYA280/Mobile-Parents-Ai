// app/Enfants/Historique/historydetails.tsx
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Share,
  StyleSheet,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { LinearGradient } from "expo-linear-gradient";
import {
  faChalkboardTeacher,
  faSearch,
  faHome,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import type { Child, Activity } from "../../../data/Enfants/CHILDREN_DATA";

import { COLORS } from "../../../constants/theme";
import {
  CHILDREN_DATA,
  enhanceActivity,
} from "../../../data/Enfants/CHILDREN_DATA";

// Import the UI Header component
import Header from "../../../components/ui/Header";

// Import our custom components
import ActivityDetailsCard, {
  AssistantThemeObject,
} from "./components/ActivityDetailsCard";
import ConversationCard from "./components/ConversationCard";
import ParentFeedbackSection from "./components/ParentFeedbackSection";
import ResourcesSection from "./components/ResourcesSection";
import FeedbackModal from "./components/FeedbackModal";
import LoadingState from "./components/LoadingState";
import NotFoundState from "./components/NotFoundState";

// Define Assistant Type
type AssistantType = "J'Apprends" | "Recherche" | "Accueil" | "Autre";

// Define the ASSISTANT_THEME map
const ASSISTANT_THEME: Record<AssistantType, AssistantThemeObject> = {
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

// Helper function to safely get assistant theme
const getAssistantTheme = (name: string): AssistantThemeObject => {
  if (name === "J'Apprends" || name === "Recherche" || name === "Accueil") {
    return ASSISTANT_THEME[name as AssistantType];
  }
  return ASSISTANT_THEME.Autre;
};

const HistoryDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Add header height state
  const [headerHeight, setHeaderHeight] = useState(0);

  // Get IDs
  const activityId = Number(params.activityId);
  const childId = Number(params.childId);

  // States
  const [child, setChild] = useState<Child | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [feedback, setFeedback] = useState("");
  const [blocageIdentified, setBlockageIdentified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [parentFeedbacks, setParentFeedbacks] = useState<
    Array<{ text: string; date: Date }>
  >([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState("");
  const [editingFeedbackIndex, setEditingFeedbackIndex] = useState<
    number | null
  >(null);

  // onHeaderLayout function
  const onHeaderLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  // Load data
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

        // Enhance activity data
        setActivity(enhanceActivity(foundActivity));

        // Simulate feedbacks
        setParentFeedbacks([
          {
            text: "Bon travail sur cette activité. On voit des progrès significatifs dans la compréhension des fractions!",
            date: new Date(2025, 2, 22),
          },
        ]);

        // Start animations
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]).start();
        }, 100);
      } catch (error) {
        console.error("Erreur:", error);
        Alert.alert("Erreur", "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [childId, activityId, router, fadeAnim, slideAnim]);

  // Helper function for score color
  const getScoreColor = (score: string) => {
    if (!score || !score.includes("/")) return COLORS.primary;

    const [achieved, total] = score.split("/").map(Number);
    const percentage = (achieved / total) * 100;

    if (percentage < 30) return "#FC4E00"; // Rouge
    if (percentage <= 50) return "#EBB016"; // Orange
    if (percentage <= 70) return "#F3BB00"; // Jaune
    return "#24D26D"; // Vert
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Action handlers
  const handleBack = () => {
    router.back();
  };

  const addFeedback = () => {
    if (feedback.trim() === "") {
      Alert.alert("Erreur", "Veuillez saisir un commentaire");
      return;
    }

    setParentFeedbacks((prev) => [
      ...prev,
      { text: feedback, date: new Date() },
    ]);

    setFeedback("");
    Alert.alert("Succès", "Votre commentaire a été ajouté");
  };

  const toggleBlockageIdentification = () => {
    setBlockageIdentified(!blocageIdentified);
    if (!blocageIdentified) {
      Alert.alert(
        "Point de blocage identifié",
        "Cette activité a été marquée comme contenant un point de blocage."
      );
    }
  };

  const handleShare = async () => {
    if (!activity) return;

    try {
      await Share.share({
        message: `Voici une activité intéressante: ${activity.activite}`,
        title: activity.activite,
      });
    } catch (error) {
      console.error("Erreur lors du partage:", error);
    }
  };

  const openEditFeedbackModal = (index: number) => {
    setEditingFeedbackIndex(index);
    setEditingFeedback(parentFeedbacks[index].text);
    setShowFeedbackModal(true);
  };

  const updateFeedback = () => {
    if (editingFeedbackIndex === null || editingFeedback.trim() === "") return;

    const updatedFeedbacks = [...parentFeedbacks];
    updatedFeedbacks[editingFeedbackIndex] = {
      ...updatedFeedbacks[editingFeedbackIndex],
      text: editingFeedback,
    };

    setParentFeedbacks(updatedFeedbacks);
    setShowFeedbackModal(false);
    Alert.alert("Succès", "Votre commentaire a été modifié");
  };

  const deleteFeedback = () => {
    if (editingFeedbackIndex === null) return;

    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer ce commentaire ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          onPress: () => {
            const updatedFeedbacks = parentFeedbacks.filter(
              (_, index) => index !== editingFeedbackIndex
            );
            setParentFeedbacks(updatedFeedbacks);
            setShowFeedbackModal(false);
            Alert.alert("Succès", "Votre commentaire a été supprimé");
          },
          style: "destructive",
        },
      ]
    );
  };

  // Navigation functions
  const navigateToChat = () => {
    if (activity && child) {
      router.push(
        `/Enfants/Historique/chat?activityId=${activity.id}&childId=${child.id}&fromDetails=true`
      );
    }
  };

  const navigateToVideoDetails = () => {
    router.push(
      `/Enfants/Historique/Videodetails?resourceId=1&subject=${activity?.matiere || "Mathématiques"}`
    );
  };

  const navigateToFicheDetails = () => {
    router.push(
      `/Enfants/Historique/fichedetails?resourceId=1&subject=${activity?.matiere || "Mathématiques"}`
    );
  };

  // Render loading state
  if (isLoading) {
    return <LoadingState handleBack={handleBack} />;
  }

  // Render not found state
  if (!activity || !child) {
    return <NotFoundState handleBack={handleBack} />;
  }

  // Variables for display
  const assistantName = activity.assistant || "Autre";
  const assistantTheme = getAssistantTheme(assistantName);
  const formattedDate = formatDate(activity.date);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer} onLayout={onHeaderLayout}>
        <Header
          title="Détails de l'activité"
          subtitle={
            child ? `${child.name} • ${formattedDate.split(" ")[0]}` : ""
          }
          onBackPress={handleBack}
          showBackButton={true}
        />

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              blocageIdentified && styles.blockageButton,
            ]}
            onPress={toggleBlockageIdentification}
          >
            <FontAwesomeIcon
              icon="exclamation-circle"
              size={18}
              color={blocageIdentified ? "#FF3B30" : COLORS.gray3}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <FontAwesomeIcon icon="share-alt" size={18} color={COLORS.gray3} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: headerHeight + 16 },
        ]}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Activity Details Card */}
          <ActivityDetailsCard
            activity={activity}
            formattedDate={formattedDate}
            blocageIdentified={blocageIdentified}
            assistantTheme={assistantTheme}
            assistantName={assistantName}
            getScoreColor={getScoreColor}
          />

          {/* Conversation Card */}
          <ConversationCard
            conversation={activity.conversation || []}
            navigateToChat={navigateToChat}
          />

          {/* Parent Feedback Section */}
          <ParentFeedbackSection
            parentFeedbacks={parentFeedbacks}
            feedback={feedback}
            setFeedback={setFeedback}
            addFeedback={addFeedback}
            openEditFeedbackModal={openEditFeedbackModal}
          />

          {/* Resources Section - Only for J'Apprends assistant */}
          {assistantName === "J'Apprends" && (
            <ResourcesSection
              matiere={activity.matiere}
              navigateToVideoDetails={navigateToVideoDetails}
              navigateToFicheDetails={navigateToFicheDetails}
            />
          )}
        </Animated.View>
      </ScrollView>

      {/* Feedback Modal */}
      <FeedbackModal
        visible={showFeedbackModal}
        editingFeedback={editingFeedback}
        setEditingFeedback={setEditingFeedback}
        updateFeedback={updateFeedback}
        deleteFeedback={deleteFeedback}
        onClose={() => setShowFeedbackModal(false)}
      />
    </SafeAreaView>
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
    zIndex: 100,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  actionButtons: {
    position: "absolute",
    right: 16,
    top: 10,
    flexDirection: "row",
    zIndex: 10,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    marginLeft: 8,
  },
  blockageButton: {
    backgroundColor: "rgba(255, 0, 0, 0.2)",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
});

export default HistoryDetails;
