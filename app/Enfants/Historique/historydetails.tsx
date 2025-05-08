import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { MotiView } from "moti";
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
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import {
  faStar,
  faBook,
  faClock,
  faClose,
  faArrowLeft,
  faPaperPlane,
  faPlayCircle,
  faCheckCircle,
  faTimesCircle,
  faChevronRight,
  faExclamationCircle,
  faCommentAlt,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

import type { Child, Activity } from "../../../data/Enfants/CHILDREN_DATA";

import { COLORS } from "../../../constants/theme";
import { useTheme } from "../../../theme/ThemeProvider";
import {
  CHILDREN_DATA,
  enhanceActivity,
} from "../../../data/Enfants/CHILDREN_DATA";
import {
  SUBJECT_THEME,
  ASSISTANT_THEME,
} from "../../../data/Enfants/historydetails";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Define an interface for the theme
interface ThemeItem {
  colors: readonly [string, string];
  icon: IconDefinition;
}

interface AssistantThemeType {
  colors: string[];
  icon: any;
}

interface SubjectThemeType {
  colors: string[];
  icon: any;
}

const EnhancedHistoryDetails = () => {
  const router = useRouter();
  const { dark, colors } = useTheme();
  const params = useLocalSearchParams();

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
  const [showAllChat, setShowAllChat] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "conversation"
  );
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState("");
  const [editingFeedbackIndex, setEditingFeedbackIndex] = useState<
    number | null
  >(null);

  // Get data
  useEffect(() => {
    const fetchData = () => {
      try {
        setIsLoading(true);

        // Find the child
        const foundChild = CHILDREN_DATA.find((c) => c.id === childId);
        if (!foundChild) {
          Alert.alert("Erreur", "Enfant non trouvé");
          router.back();
          return;
        }
        setChild(foundChild);

        // Find the activity
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

        // Simulate feedback
        setParentFeedbacks([
          {
            text: "Bon travail sur cette activité. On voit des progrès!",
            date: new Date(2025, 2, 22),
          },
        ]);
      } catch (error) {
        console.error("Erreur:", error);
        Alert.alert("Erreur", "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [childId, activityId, router]);

  // Add feedback
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

  // Toggle blocage identification
  const toggleBlockageIdentification = () => {
    setBlockageIdentified(!blocageIdentified);
    if (!blocageIdentified) {
      Alert.alert(
        "Point de blocage identifié",
        "Cette activité a été marquée comme contenant un point de blocage."
      );
    }
  };

  // Go back
  const handleBack = () => {
    router.back();
  };

  // Navigate to chat
  const handleViewChat = () => {
    router.push(
      `/Enfants/Historique/chat?activityId=${activityId}&childId=${childId}&fromDetails=true`
    );
  };

  // Open modal to edit feedback
  const openEditFeedbackModal = (index: number) => {
    setEditingFeedbackIndex(index);
    setEditingFeedback(parentFeedbacks[index].text);
    setShowFeedbackModal(true);
  };

  // Update feedback
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

  // Delete feedback
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

  // Toggle section expansion
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Loading display
  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <StatusBar barStyle={dark ? "light-content" : "dark-content"} />
        <View style={styles.loadingContainer}>
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 800, loop: true }}
          >
            <ActivityIndicator size="large" color={COLORS.primary} />
          </MotiView>
          <Text
            style={[
              styles.loadingText,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Chargement des détails...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Data not found
  if (!activity || !child) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <StatusBar barStyle={dark ? "light-content" : "dark-content"} />
        <View style={styles.errorContainer}>
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 13 }}
          >
            <FontAwesomeIcon
              icon={faExclamationCircle}
              size={64}
              color={dark ? COLORS.white : COLORS.black}
            />
            <Text
              style={[
                styles.errorText,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Données introuvables
            </Text>
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
  const subjectName = activity.matiere || "Autre";
  const subjectTheme = SUBJECT_THEME[subjectName] || SUBJECT_THEME.Autre;

  // Formatted date
  const activityDate = new Date(activity.date);
  const formattedDate = activityDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Limited conversation (3 first)
  const limitedConversation = activity.conversation
    ? activity.conversation.slice(0, 3)
    : [];

  const renderFeedbackModal = () => (
    <Modal visible={showFeedbackModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", damping: 15 }}
          style={[
            styles.modalContent,
            { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text
              style={[
                styles.modalTitle,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Éditer le commentaire
            </Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowFeedbackModal(false)}
            >
              <FontAwesomeIcon
                icon={faClose}
                size={24}
                color={dark ? COLORS.white : COLORS.black}
              />
            </TouchableOpacity>
          </View>

          <TextInput
            value={editingFeedback}
            onChangeText={setEditingFeedback}
            multiline
            style={[
              styles.modalTextInput,
              {
                backgroundColor: dark
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.03)",
                color: dark ? COLORS.white : COLORS.black,
              },
            ]}
            placeholderTextColor={
              dark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"
            }
            placeholder="Entrez votre commentaire..."
          />

          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              onPress={updateFeedback}
              style={styles.updateButton}
            >
              <FontAwesomeIcon
                icon={faCheckCircle}
                size={16}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
              <Text style={styles.updateButtonText}>Mettre à jour</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={deleteFeedback}
              style={styles.deleteButton}
            >
              <FontAwesomeIcon
                icon={faTimesCircle}
                size={16}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
              <Text style={styles.deleteButtonText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </MotiView>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <FontAwesomeIcon
            icon={faArrowLeft}
            size={24}
            color={dark ? COLORS.white : COLORS.black}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            { color: dark ? COLORS.white : COLORS.black },
          ]}
        >
          Détails de l'activité
        </Text>

        <TouchableOpacity
          style={[
            styles.blockageButton,
            blocageIdentified ? styles.blockageButtonActive : {},
          ]}
          onPress={toggleBlockageIdentification}
        >
          <FontAwesomeIcon
            icon={faExclamationCircle}
            size={24}
            color={
              blocageIdentified
                ? "#FF3B30"
                : dark
                  ? COLORS.secondaryWhite
                  : COLORS.gray3
            }
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Activity Card */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", damping: 18, delay: 100 }}
          style={[
            styles.activityCard,
            { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
          ]}
        >
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <LinearGradient
              colors={assistantTheme.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.assistantBadge}
            >
              <FontAwesomeIcon
                icon={assistantTheme.icon}
                size={14}
                color="#FFF"
                style={styles.assistantIcon}
              />
              <Text style={styles.assistantText}>{assistantName}</Text>
            </LinearGradient>

            <Text
              style={[
                styles.dateText,
                { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
              ]}
            >
              {formattedDate}
            </Text>
          </View>

          {/* Activity Title */}
          <View style={styles.activityTitleContainer}>
            <LinearGradient
              colors={subjectTheme.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.subjectIconContainer}
            >
              <FontAwesomeIcon
                icon={subjectTheme.icon}
                size={16}
                color="#FFF"
              />
            </LinearGradient>

            <Text
              style={[
                styles.activityTitle,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {activity.activite}
            </Text>
          </View>

          {/* Activity Metadata */}
          <View
            style={[
              styles.metadataContainer,
              {
                backgroundColor: dark
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.03)",
              },
            ]}
          >
            <View style={styles.metadataItem}>
              <FontAwesomeIcon
                icon={faClock}
                size={16}
                color={COLORS.primary}
                style={styles.metadataIcon}
              />
              <Text
                style={[
                  styles.metadataText,
                  { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                ]}
              >
                {activity.duree}
              </Text>
            </View>

            {activity.score && (
              <View style={styles.metadataItem}>
                <FontAwesomeIcon
                  icon={faStar}
                  size={16}
                  color={COLORS.primary}
                  style={styles.metadataIcon}
                />
                <Text
                  style={[
                    styles.metadataText,
                    { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                  ]}
                >
                  {activity.score}
                </Text>
              </View>
            )}

            {subjectName && (
              <View style={styles.metadataItem}>
                <FontAwesomeIcon
                  icon={faBook}
                  size={16}
                  color={COLORS.primary}
                  style={styles.metadataIcon}
                />
                <Text
                  style={[
                    styles.metadataText,
                    { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                  ]}
                >
                  {subjectName}
                </Text>
              </View>
            )}
          </View>
        </MotiView>

        {/* Conversation Section */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", damping: 18, delay: 200 }}
          style={[
            styles.sectionCard,
            { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
          ]}
        >
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection("conversation")}
          >
            <View style={styles.sectionTitleContainer}>
              <FontAwesomeIcon
                icon={faCommentAlt}
                size={18}
                color={COLORS.primary}
                style={styles.sectionIcon}
              />
              <Text
                style={[
                  styles.sectionTitle,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Conversation avec l'assistant
              </Text>
            </View>

            <FontAwesomeIcon
              icon={
                expandedSection === "conversation"
                  ? faChevronRight
                  : faChevronRight
              }
              size={16}
              color={dark ? COLORS.white : COLORS.black}
              style={[
                styles.expandIcon,
                expandedSection === "conversation"
                  ? styles.expandIconRotated
                  : {},
              ]}
            />
          </TouchableOpacity>

          {expandedSection === "conversation" && (
            <MotiView
              from={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ type: "timing", duration: 300 }}
              style={styles.sectionContent}
            >
              <TouchableOpacity
                onPress={handleViewChat}
                style={styles.viewAllChatButton}
              >
                <FontAwesomeIcon
                  icon={faEye}
                  size={16}
                  color={COLORS.primary}
                  style={styles.viewChatIcon}
                />
                <Text style={styles.viewAllChatText}>
                  Voir la conversation complète
                </Text>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  size={16}
                  color={COLORS.primary}
                />
              </TouchableOpacity>

              <View
                style={[
                  styles.chatPreviewContainer,
                  {
                    backgroundColor: dark
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.03)",
                  },
                ]}
              >
                {limitedConversation.length > 0 ? (
                  limitedConversation.map((msg, index) => (
                    <View
                      key={index}
                      style={[
                        styles.messageContainer,
                        msg.sender === "assistant"
                          ? styles.assistantMessageContainer
                          : styles.userMessageContainer,
                      ]}
                    >
                      <View
                        style={[
                          styles.messageBubble,
                          msg.sender === "assistant"
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
                                    : "#E1E1E1",
                                },
                              ],
                        ]}
                      >
                        <Text
                          style={[
                            styles.messageText,
                            {
                              color:
                                msg.sender === "assistant"
                                  ? dark
                                    ? COLORS.white
                                    : COLORS.primary
                                  : dark
                                    ? COLORS.white
                                    : COLORS.black,
                            },
                          ]}
                        >
                          {msg.message}
                        </Text>
                        <Text style={styles.messageTime}>{msg.timestamp}</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text
                    style={[
                      styles.emptyText,
                      { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                    ]}
                  >
                    Aucun message dans cette conversation
                  </Text>
                )}
              </View>
            </MotiView>
          )}
        </MotiView>

        {/* Comments & Recommendations */}
        {(activity.commentaires ||
          (activity.recommandations &&
            activity.recommandations.length > 0)) && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "spring", damping: 18, delay: 300 }}
            style={[
              styles.sectionCard,
              { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
            ]}
          >
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("feedback")}
            >
              <View style={styles.sectionTitleContainer}>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  size={18}
                  color={COLORS.primary}
                  style={styles.sectionIcon}
                />
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  Commentaires et Recommandations
                </Text>
              </View>

              <FontAwesomeIcon
                icon={
                  expandedSection === "feedback"
                    ? faChevronRight
                    : faChevronRight
                }
                size={16}
                color={dark ? COLORS.white : COLORS.black}
                style={[
                  styles.expandIcon,
                  expandedSection === "feedback"
                    ? styles.expandIconRotated
                    : {},
                ]}
              />
            </TouchableOpacity>

            {expandedSection === "feedback" && (
              <MotiView
                from={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ type: "timing", duration: 300 }}
                style={styles.sectionContent}
              >
                {activity.commentaires && (
                  <View
                    style={[
                      styles.commentsContainer,
                      {
                        backgroundColor: dark
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.03)",
                      },
                    ]}
                  >
                    <Text style={styles.commentsTitle}>Commentaires:</Text>
                    <Text
                      style={[
                        styles.commentsText,
                        { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                      ]}
                    >
                      {activity.commentaires}
                    </Text>
                  </View>
                )}

                {activity.recommandations &&
                  activity.recommandations.length > 0 && (
                    <View style={styles.recommendationsContainer}>
                      <Text style={styles.recommendationsTitle}>
                        Recommandations:
                      </Text>
                      <View style={styles.recommendationsList}>
                        {activity.recommandations.map((rec, index) => (
                          <View key={index} style={styles.recommendationItem}>
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              size={18}
                              color={COLORS.primary}
                              style={styles.recommendationIcon}
                            />
                            <Text
                              style={[
                                styles.recommendationText,
                                {
                                  color: dark
                                    ? COLORS.secondaryWhite
                                    : COLORS.gray3,
                                },
                              ]}
                            >
                              {rec}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
              </MotiView>
            )}
          </MotiView>
        )}

        {/* Exercises */}
        {activity.exercices && activity.exercices.length > 0 && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "spring", damping: 18, delay: 400 }}
            style={[
              styles.sectionCard,
              { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
            ]}
          >
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("exercises")}
            >
              <View style={styles.sectionTitleContainer}>
                <FontAwesomeIcon
                  icon={faBook}
                  size={18}
                  color={COLORS.primary}
                  style={styles.sectionIcon}
                />
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  Exercices
                </Text>
              </View>

              <FontAwesomeIcon
                icon={
                  expandedSection === "exercises"
                    ? faChevronRight
                    : faChevronRight
                }
                size={16}
                color={dark ? COLORS.white : COLORS.black}
                style={[
                  styles.expandIcon,
                  expandedSection === "exercises"
                    ? styles.expandIconRotated
                    : {},
                ]}
              />
            </TouchableOpacity>

            {expandedSection === "exercises" && (
              <MotiView
                from={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ type: "timing", duration: 300 }}
                style={styles.sectionContent}
              >
                <View
                  style={[
                    styles.exercisesContainer,
                    {
                      backgroundColor: dark
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.03)",
                    },
                  ]}
                >
                  {activity.exercices.map((ex, index) => (
                    <View key={index} style={styles.exerciseItem}>
                      <View style={styles.exerciseHeader}>
                        <FontAwesomeIcon
                          icon={ex.reussite ? faCheckCircle : faTimesCircle}
                          size={18}
                          color={ex.reussite ? "#4CAF50" : "#F44336"}
                          style={styles.exerciseIcon}
                        />
                        <Text
                          style={[
                            styles.exerciseStatus,
                            {
                              color: ex.reussite ? "#4CAF50" : "#F44336",
                            },
                          ]}
                        >
                          {ex.reussite ? "Réussi" : "Échoué"}
                        </Text>
                      </View>

                      {ex.commentaire && (
                        <Text
                          style={[
                            styles.exerciseComment,
                            {
                              color: dark
                                ? COLORS.secondaryWhite
                                : COLORS.gray3,
                            },
                          ]}
                        >
                          {ex.commentaire}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              </MotiView>
            )}
          </MotiView>
        )}

        {/* Parent Feedback Section */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", damping: 18, delay: 500 }}
          style={[
            styles.sectionCard,
            { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
          ]}
        >
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection("parentFeedback")}
          >
            <View style={styles.sectionTitleContainer}>
              <FontAwesomeIcon
                icon={faCommentAlt}
                size={18}
                color={COLORS.primary}
                style={styles.sectionIcon}
              />
              <Text
                style={[
                  styles.sectionTitle,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Commentaires des parents
              </Text>
            </View>

            <FontAwesomeIcon
              icon={
                expandedSection === "parentFeedback"
                  ? faChevronRight
                  : faChevronRight
              }
              size={16}
              color={dark ? COLORS.white : COLORS.black}
              style={[
                styles.expandIcon,
                expandedSection === "parentFeedback"
                  ? styles.expandIconRotated
                  : {},
              ]}
            />
          </TouchableOpacity>

          {expandedSection === "parentFeedback" && (
            <MotiView
              from={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ type: "timing", duration: 300 }}
              style={styles.sectionContent}
            >
              <View
                style={[
                  styles.parentFeedbackContainer,
                  {
                    backgroundColor: dark
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.03)",
                  },
                ]}
              >
                {parentFeedbacks.length > 0 ? (
                  parentFeedbacks.map((fb, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.feedbackItem}
                      onPress={() => openEditFeedbackModal(index)}
                    >
                      <Text
                        style={[
                          styles.feedbackText,
                          {
                            color: dark ? COLORS.secondaryWhite : COLORS.gray3,
                          },
                        ]}
                      >
                        {fb.text}
                      </Text>
                      <Text style={styles.feedbackDate}>
                        {fb.date.toLocaleDateString()}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text
                    style={[
                      styles.emptyFeedbackText,
                      { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                    ]}
                  >
                    Aucun commentaire pour le moment
                  </Text>
                )}

                {/* Add feedback */}
                <View style={styles.addFeedbackContainer}>
                  <TextInput
                    placeholder="Ajouter un commentaire..."
                    placeholderTextColor={
                      dark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"
                    }
                    value={feedback}
                    onChangeText={setFeedback}
                    multiline
                    style={[
                      styles.feedbackInput,
                      {
                        backgroundColor: dark
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(255, 255, 255, 0.5)",
                        color: dark ? COLORS.white : COLORS.black,
                      },
                    ]}
                  />

                  <TouchableOpacity
                    onPress={addFeedback}
                    style={[
                      styles.addFeedbackButton,
                      feedback.trim() === "" ? styles.disabledButton : {},
                    ]}
                    disabled={feedback.trim() === ""}
                  >
                    <FontAwesomeIcon
                      icon={faPaperPlane}
                      size={20}
                      color="#FFF"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </MotiView>
          )}
        </MotiView>

        {/* Educational Resources */}
        {assistantName === "J'Apprends" && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "spring", damping: 18, delay: 600 }}
            style={[
              styles.sectionCard,
              { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
            ]}
          >
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("resources")}
            >
              <View style={styles.sectionTitleContainer}>
                <FontAwesomeIcon
                  icon={faBook}
                  size={18}
                  color={COLORS.primary}
                  style={styles.sectionIcon}
                />
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  Ressources pédagogiques
                </Text>
              </View>

              <FontAwesomeIcon
                icon={
                  expandedSection === "resources"
                    ? faChevronRight
                    : faChevronRight
                }
                size={16}
                color={dark ? COLORS.white : COLORS.black}
                style={[
                  styles.expandIcon,
                  expandedSection === "resources"
                    ? styles.expandIconRotated
                    : {},
                ]}
              />
            </TouchableOpacity>

            {expandedSection === "resources" && (
              <MotiView
                from={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ type: "timing", duration: 300 }}
                style={styles.sectionContent}
              >
                <TouchableOpacity
                  onPress={() =>
                    router.push(
                      `/Enfants/Historique/fichedetails?resourceId=1&subject=${subjectName}`
                    )
                  }
                  style={[
                    styles.resourceItem,
                    {
                      backgroundColor: dark
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.03)",
                    },
                  ]}
                >
                  <FontAwesomeIcon
                    icon={faBook}
                    size={24}
                    color={COLORS.primary}
                    style={styles.resourceIcon}
                  />
                  <View style={styles.resourceInfo}>
                    <Text
                      style={[
                        styles.resourceTitle,
                        { color: dark ? COLORS.white : COLORS.black },
                      ]}
                    >
                      Fiche pédagogique - {subjectName}
                    </Text>
                    <Text
                      style={[
                        styles.resourceDescription,
                        { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                      ]}
                    >
                      Ressource complémentaire pour approfondir
                    </Text>
                  </View>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    size={24}
                    color={dark ? COLORS.secondaryWhite : COLORS.gray3}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/Enfants/Historique/Videodetails",
                      params: {
                        resourceId: "1",
                        subject: subjectName,
                      },
                    })
                  }
                  style={[
                    styles.resourceItem,
                    {
                      backgroundColor: dark
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.03)",
                    },
                  ]}
                >
                  <FontAwesomeIcon
                    icon={faPlayCircle}
                    size={24}
                    color={COLORS.primary}
                    style={styles.resourceIcon}
                  />
                  <View style={styles.resourceInfo}>
                    <Text
                      style={[
                        styles.resourceTitle,
                        { color: dark ? COLORS.white : COLORS.black },
                      ]}
                    >
                      Vidéo explicative - {subjectName}
                    </Text>
                    <Text
                      style={[
                        styles.resourceDescription,
                        { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                      ]}
                    >
                      10:24 minutes
                    </Text>
                  </View>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    size={24}
                    color={dark ? COLORS.secondaryWhite : COLORS.gray3}
                  />
                </TouchableOpacity>
              </MotiView>
            )}
          </MotiView>
        )}
      </ScrollView>

      {renderFeedbackModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  blockageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  blockageButtonActive: {
    backgroundColor: "rgba(255, 0, 0, 0.2)",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  backButtonLarge: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  activityCard: {
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 16,
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
  assistantText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  dateText: {
    fontSize: 14,
  },
  activityTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  subjectIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  metadataContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: 8,
    padding: 12,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  metadataIcon: {
    marginRight: 4,
  },
  metadataText: {
    fontSize: 14,
  },
  sectionCard: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  expandIcon: {
    transform: [{ rotate: "0deg" }],
  },
  expandIconRotated: {
    transform: [{ rotate: "90deg" }],
  },
  sectionContent: {
    padding: 16,
  },
  viewAllChatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 149, 255, 0.1)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  viewChatIcon: {
    marginRight: 8,
  },
  viewAllChatText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  chatPreviewContainer: {
    borderRadius: 8,
    padding: 12,
  },
  messageContainer: {
    maxWidth: "90%",
    marginBottom: 12,
  },
  assistantMessageContainer: {
    alignSelf: "flex-start",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
  },
  assistantBubble: {
    borderTopLeftRadius: 4,
  },
  userBubble: {
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 12,
    color: "rgba(150, 150, 150, 0.8)",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    padding: 16,
  },
  commentsContainer: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 8,
  },
  commentsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  recommendationsContainer: {
    marginBottom: 8,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 8,
  },
  recommendationsList: {
    marginLeft: 4,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  recommendationIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  exercisesContainer: {
    borderRadius: 8,
    padding: 12,
  },
  exerciseItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    paddingBottom: 12,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  exerciseIcon: {
    marginRight: 8,
  },
  exerciseStatus: {
    fontSize: 15,
    fontWeight: "600",
  },
  exerciseComment: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 26,
  },
  parentFeedbackContainer: {
    borderRadius: 8,
    padding: 12,
  },
  feedbackItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  feedbackDate: {
    fontSize: 12,
    color: "rgba(150, 150, 150, 0.8)",
    alignSelf: "flex-end",
  },
  emptyFeedbackText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 16,
  },
  addFeedbackContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  feedbackInput: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 48,
    marginRight: 8,
    fontSize: 14,
  },
  addFeedbackButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  resourceIcon: {
    marginRight: 16,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalCloseButton: {
    padding: 4,
  },
  modalTextInput: {
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    fontSize: 16,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default EnhancedHistoryDetails;
