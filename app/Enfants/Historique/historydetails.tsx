// app/Enfants/Historique/historydetails.tsx

import React, { useState, useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChalkboardTeacher,
  faSearch,
  faHome,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

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
} from "react-native";

import type { Child, Activity } from "../../../data/Enfants/CHILDREN_DATA";

import { COLORS } from "../../../constants/theme";
import { useTheme } from "../../../theme/ThemeProvider";
import {
  CHILDREN_DATA,
  enhanceActivity,
} from "../../../data/Enfants/CHILDREN_DATA";

// Assistant theme object
const ASSISTANT_THEME: Record<
  string,
  { colors: [string, string]; icon: IconDefinition }
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

const HistoryDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Récupérer les IDs
  const activityId = Number(params.activityId);
  const childId = Number(params.childId);

  // États
  const [child, setChild] = useState<Child | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [feedback, setFeedback] = useState("");
  const [blocageIdentified, setBlockageIdentified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [parentFeedbacks, setParentFeedbacks] = useState<
    Array<{ text: string; date: Date }>
  >([]);
  const [showAllChat, setShowAllChat] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState("");
  const [editingFeedbackIndex, setEditingFeedbackIndex] = useState<
    number | null
  >(null);

  // Récupérer les données
  useEffect(() => {
    const fetchData = () => {
      try {
        setIsLoading(true);

        // Trouver l'enfant
        const foundChild = CHILDREN_DATA.find((c) => c.id === childId);
        if (!foundChild) {
          Alert.alert("Erreur", "Enfant non trouvé");
          router.back();
          return;
        }
        setChild(foundChild);

        // Trouver l'activité
        const foundActivity = foundChild.activitesRecentes.find(
          (a) => a.id === activityId
        );
        if (!foundActivity) {
          Alert.alert("Erreur", "Activité non trouvée");
          router.back();
          return;
        }

        // Enrichir les données
        const enhancedActivity = enhanceActivity(foundActivity);
        setActivity(enhancedActivity);

        // Simuler des feedbacks
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

  // Helper function to get color based on difficulty level or score
  const getScoreColor = (score: string) => {
    if (!score || !score.includes("/")) return COLORS.primary;

    const [achieved, total] = score.split("/").map(Number);
    const percentage = (achieved / total) * 100;

    if (percentage < 30) return "#FC4E00"; // Rouge
    if (percentage <= 50) return "#EBB016"; // Orange
    if (percentage <= 70) return "#F3BB00"; // Jaune
    return "#24D26D"; // Vert
  };

  // Ajouter un feedback
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

  // Marquer un point de blocage
  const toggleBlockageIdentification = () => {
    setBlockageIdentified(!blocageIdentified);
    if (!blocageIdentified) {
      Alert.alert(
        "Point de blocage identifié",
        "Cette activité a été marquée comme contenant un point de blocage."
      );
    }
  };

  // Retour
  const handleBack = () => {
    router.back();
  };

  // Share activity
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

  // Ouvrir modal pour éditer un feedback
  const openEditFeedbackModal = (index: number) => {
    setEditingFeedbackIndex(index);
    setEditingFeedback(parentFeedbacks[index].text);
    setShowFeedbackModal(true);
  };

  // Mettre à jour un feedback
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

  // Supprimer un feedback
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

  // Navigate to chat
  const navigateToChat = () => {
    if (activity && child) {
      router.push(
        `/Enfants/Historique/chat?activityId=${activity.id}&childId=${child.id}&fromDetails=true`
      );
    }
  };

  // Navigate to video details
  const navigateToVideoDetails = () => {
    router.push(
      `/Enfants/Historique/Videodetails?resourceId=1&subject=${activity?.matiere || "Mathématiques"}`
    );
  };

  // Navigate to fiche details
  const navigateToFicheDetails = () => {
    router.push(
      `/Enfants/Historique/fichedetails?resourceId=1&subject=${activity?.matiere || "Mathématiques"}`
    );
  };

  // Affichage du chargement
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            backgroundColor: "#FFFFFF",
            borderBottomWidth: 1,
            borderBottomColor: "rgba(0,0,0,0.05)",
          }}
        >
          <TouchableOpacity
            onPress={handleBack}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(0,0,0,0.05)",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <FontAwesomeIcon icon="arrow-left" size={18} color={COLORS.black} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: COLORS.black,
            }}
          >
            Détails de l&apos;activité
          </Text>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text
            style={{
              marginTop: 20,
              color: COLORS.black,
              fontSize: 16,
            }}
          >
            Chargement des détails...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Données introuvables
  if (!activity || !child) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            backgroundColor: "#FFFFFF",
            borderBottomWidth: 1,
            borderBottomColor: "rgba(0,0,0,0.05)",
          }}
        >
          <TouchableOpacity
            onPress={handleBack}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(0,0,0,0.05)",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <FontAwesomeIcon icon="arrow-left" size={18} color={COLORS.black} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: COLORS.black,
            }}
          >
            Détails de l&apos;activité
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
        >
          <FontAwesomeIcon
            icon="exclamation-circle"
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
            Données introuvables
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

  // Variables pour le thème
  const assistantName = activity.assistant || "Autre";
  const assistantTheme =
    ASSISTANT_THEME[assistantName] || ASSISTANT_THEME.Autre;

  // Date formatée
  const activityDate = new Date(activity.date);
  const formattedDate = activityDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Messages de conversation limités (3 premiers)
  const limitedConversation = activity.conversation
    ? activity.conversation.slice(0, 3)
    : [];

  const renderFeedbackModal = () => (
    <Modal visible={showFeedbackModal} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            width: "90%",
            backgroundColor: COLORS.white,
            borderRadius: 16,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: COLORS.black,
              }}
            >
              Éditer le commentaire
            </Text>
            <TouchableOpacity
              onPress={() => setShowFeedbackModal(false)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "rgba(0,0,0,0.05)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon icon="times" size={16} color={COLORS.black} />
            </TouchableOpacity>
          </View>

          <TextInput
            value={editingFeedback}
            onChangeText={setEditingFeedback}
            multiline
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.03)",
              borderRadius: 12,
              padding: 16,
              color: COLORS.black,
              marginBottom: 20,
              minHeight: 120,
              textAlignVertical: "top",
              fontSize: 16,
            }}
            placeholder="Votre commentaire..."
            placeholderTextColor={"rgba(0,0,0,0.3)"}
          />

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              onPress={deleteFeedback}
              style={{
                backgroundColor: "#FF3B30",
                padding: 16,
                borderRadius: 12,
                flex: 0.48,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon
                icon="trash-alt"
                size={16}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: COLORS.white, fontWeight: "600" }}>
                Supprimer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={updateFeedback}
              style={{
                backgroundColor: COLORS.primary,
                padding: 16,
                borderRadius: 12,
                flex: 0.48,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon
                icon="save"
                size={16}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: COLORS.white, fontWeight: "600" }}>
                Enregistrer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <View style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            backgroundColor: "#FFFFFF",
            borderBottomWidth: 1,
            borderBottomColor: "rgba(0,0,0,0.05)",
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
              backgroundColor: "rgba(0,0,0,0.05)",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <FontAwesomeIcon icon="arrow-left" size={18} color={COLORS.black} />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: COLORS.black,
              }}
            >
              Détails de l&apos;activité
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: COLORS.gray3,
              }}
            >
              {child.name} • {formattedDate.split(" ")[0]}
            </Text>
          </View>

          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: blocageIdentified
                ? "rgba(255, 0, 0, 0.2)"
                : "rgba(0,0,0,0.05)",
              marginLeft: 8,
            }}
            onPress={toggleBlockageIdentification}
          >
            <FontAwesomeIcon
              icon="exclamation-circle"
              size={18}
              color={blocageIdentified ? "#FF3B30" : COLORS.gray3}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.05)",
              marginLeft: 8,
            }}
            onPress={handleShare}
          >
            <FontAwesomeIcon icon="share-alt" size={18} color={COLORS.gray3} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Carte principale de l'activité */}
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 16,
                padding: 20,
                marginBottom: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              {/* En-tête avec type d'assistant */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <LinearGradient
                  colors={assistantTheme.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                  }}
                >
                  <FontAwesomeIcon
                    icon={assistantTheme.icon}
                    size={16}
                    color="#FFF"
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      color: "#FFF",
                      fontWeight: "600",
                      fontSize: 14,
                    }}
                  >
                    {assistantName}
                  </Text>
                </LinearGradient>

                <Text
                  style={{
                    color: COLORS.gray3,
                    fontSize: 14,
                  }}
                >
                  {formattedDate}
                </Text>
              </View>

              {/* Titre de l'activité */}
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: COLORS.black,
                  marginBottom: 16,
                  lineHeight: 30,
                }}
              >
                {activity.activite}
              </Text>

              {/* Détails de l'activité */}
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginBottom: 16,
                  gap: 8,
                }}
              >
                <View
                  style={{
                    backgroundColor: "rgba(0,0,0,0.05)",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                  }}
                >
                  <FontAwesomeIcon
                    icon="clock"
                    size={14}
                    color={COLORS.gray3}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={{
                      color: COLORS.gray3,
                    }}
                  >
                    {activity.duree}
                  </Text>
                </View>

                {activity.score && (
                  <View
                    style={{
                      backgroundColor: `${getScoreColor(activity.score)}20`,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 16,
                    }}
                  >
                    <FontAwesomeIcon
                      icon="star"
                      size={14}
                      color={getScoreColor(activity.score)}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={{
                        color: getScoreColor(activity.score),
                        fontWeight: "600",
                      }}
                    >
                      {activity.score}
                    </Text>
                  </View>
                )}

                {activity.matiere && (
                  <View
                    style={{
                      backgroundColor: "rgba(0,0,0,0.05)",
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 16,
                    }}
                  >
                    <FontAwesomeIcon
                      icon="book"
                      size={14}
                      color={COLORS.gray3}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={{
                        color: COLORS.gray3,
                      }}
                    >
                      {activity.matiere}
                    </Text>
                  </View>
                )}

                {activity.chapitre && (
                  <View
                    style={{
                      backgroundColor: "rgba(0,0,0,0.05)",
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 16,
                    }}
                  >
                    <FontAwesomeIcon
                      icon="bookmark"
                      size={14}
                      color={COLORS.gray3}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={{
                        color: COLORS.gray3,
                      }}
                    >
                      {activity.chapitre}
                    </Text>
                  </View>
                )}
              </View>

              {blocageIdentified && (
                <View
                  style={{
                    backgroundColor: "rgba(255, 59, 48, 0.1)",
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 16,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <FontAwesomeIcon
                    icon="exclamation-triangle"
                    size={16}
                    color="#FF3B30"
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={{
                      color: "#FF3B30",
                      fontSize: 14,
                      flex: 1,
                    }}
                  >
                    Point de blocage identifié pour cette activité. Une
                    attention particulière est recommandée.
                  </Text>
                </View>
              )}

              {/* Commentaires et recommandations */}
              {activity.commentaires && (
                <View style={{ marginBottom: 16 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <FontAwesomeIcon
                      icon="comment-alt"
                      size={16}
                      color={COLORS.primary}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: COLORS.black,
                      }}
                    >
                      Commentaires
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "rgba(0,0,0,0.03)",
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.gray3,
                        lineHeight: 22,
                        fontSize: 15,
                      }}
                    >
                      {activity.commentaires}
                    </Text>
                  </View>
                </View>
              )}

              {activity.recommandations &&
                activity.recommandations.length > 0 && (
                  <View style={{ marginBottom: 16 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <FontAwesomeIcon
                        icon="lightbulb"
                        size={16}
                        color={COLORS.primary}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: COLORS.black,
                        }}
                      >
                        Recommandations
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "rgba(0,0,0,0.03)",
                        borderRadius: 12,
                        padding: 16,
                      }}
                    >
                      {activity.recommandations.map((rec, index) => (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            marginBottom:
                              index < activity.recommandations!.length - 1
                                ? 12
                                : 0,
                          }}
                        >
                          <View
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 12,
                              backgroundColor: "#24D26D",
                              justifyContent: "center",
                              alignItems: "center",
                              marginRight: 12,
                              marginTop: 2,
                            }}
                          >
                            <FontAwesomeIcon
                              icon="check"
                              size={12}
                              color="#FFFFFF"
                            />
                          </View>
                          <Text
                            style={{
                              color: COLORS.gray3,
                              lineHeight: 22,
                              flex: 1,
                              fontSize: 15,
                            }}
                          >
                            {rec}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

              {/* Exercices */}
              {activity.exercices && activity.exercices.length > 0 && (
                <View style={{ marginBottom: 16 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <FontAwesomeIcon
                      icon="tasks"
                      size={16}
                      color={COLORS.primary}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: COLORS.black,
                      }}
                    >
                      Exercices
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "rgba(0,0,0,0.03)",
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    {activity.exercices.map((ex, index) => (
                      <View
                        key={index}
                        style={{
                          marginBottom:
                            index < activity.exercices!.length - 1 ? 16 : 0,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 6,
                          }}
                        >
                          <View
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 12,
                              backgroundColor: ex.reussite
                                ? "#24D26D"
                                : "#FF3B30",
                              justifyContent: "center",
                              alignItems: "center",
                              marginRight: 12,
                            }}
                          >
                            <FontAwesomeIcon
                              icon={ex.reussite ? "check" : "times"}
                              size={12}
                              color="#FFFFFF"
                            />
                          </View>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: "500",
                              color: COLORS.black,
                            }}
                          >
                            Exercice {index + 1}
                          </Text>
                          <View
                            style={{
                              marginLeft: "auto",
                              backgroundColor: ex.reussite
                                ? "rgba(36, 210, 109, 0.1)"
                                : "rgba(255, 59, 48, 0.1)",
                              paddingHorizontal: 10,
                              paddingVertical: 3,
                              borderRadius: 12,
                            }}
                          >
                            <Text
                              style={{
                                color: ex.reussite ? "#24D26D" : "#FF3B30",
                                fontSize: 13,
                                fontWeight: "500",
                              }}
                            >
                              {ex.reussite ? "Réussi" : "Échoué"}
                            </Text>
                          </View>
                        </View>
                        {ex.commentaire && (
                          <View
                            style={{
                              backgroundColor: "rgba(0,0,0,0.05)",
                              borderRadius: 8,
                              padding: 12,
                              marginLeft: 36,
                            }}
                          >
                            <Text
                              style={{
                                color: COLORS.gray3,
                                fontSize: 14,
                                lineHeight: 20,
                              }}
                            >
                              {ex.commentaire}
                            </Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Conversations Card */}
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 16,
                padding: 20,
                marginBottom: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesomeIcon
                    icon="comments"
                    size={16}
                    color={COLORS.primary}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: COLORS.black,
                    }}
                  >
                    Conversation avec l&apos;assistant
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={navigateToChat}
                  style={{
                    backgroundColor: COLORS.primary,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      marginRight: 4,
                      fontSize: 13,
                      fontWeight: "500",
                    }}
                  >
                    Voir tout
                  </Text>
                  <FontAwesomeIcon
                    icon="chevron-right"
                    size={12}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              </View>

              {limitedConversation.length > 0 ? (
                <View
                  style={{
                    backgroundColor: "rgba(0,0,0,0.03)",
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  {limitedConversation.map((msg, index) => {
                    const isAssistant = msg.sender === "assistant";
                    return (
                      <View
                        key={index}
                        style={{
                          marginBottom:
                            index < limitedConversation.length - 1 ? 16 : 0,
                          alignItems: isAssistant ? "flex-start" : "flex-end",
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: isAssistant
                              ? "rgba(0, 149, 255, 0.08)"
                              : "#F0F0F0",
                            padding: 12,
                            borderRadius: 16,
                            maxWidth: "85%",
                            borderTopLeftRadius: isAssistant ? 4 : 16,
                            borderTopRightRadius: isAssistant ? 16 : 4,
                          }}
                        >
                          <Text
                            style={{
                              color: isAssistant ? "#0066CC" : COLORS.black,
                              fontSize: 14,
                              lineHeight: 20,
                            }}
                          >
                            {msg.message}
                          </Text>
                          <Text
                            style={{
                              fontSize: 11,
                              color: "rgba(0, 0, 0, 0.4)",
                              alignSelf: "flex-end",
                              marginTop: 4,
                            }}
                          >
                            {msg.timestamp}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: "rgba(0,0,0,0.03)",
                    borderRadius: 12,
                    padding: 16,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.gray3,
                      fontStyle: "italic",
                    }}
                  >
                    Aucune conversation enregistrée pour cette activité
                  </Text>
                </View>
              )}
            </View>

            {/* Parent Feedback Card */}
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 16,
                padding: 20,
                marginBottom: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <FontAwesomeIcon
                  icon="comment-dots"
                  size={16}
                  color={COLORS.primary}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: COLORS.black,
                  }}
                >
                  Commentaires des parents
                </Text>
              </View>

              {parentFeedbacks.length > 0 ? (
                <View>
                  {parentFeedbacks.map((fb, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        backgroundColor: "rgba(0,0,0,0.03)",
                        borderRadius: 12,
                        padding: 16,
                        marginBottom:
                          index < parentFeedbacks.length - 1 ? 12 : 16,
                      }}
                      onPress={() => openEditFeedbackModal(index)}
                    >
                      <Text
                        style={{
                          color: COLORS.gray3,
                          lineHeight: 22,
                          fontSize: 15,
                        }}
                      >
                        {fb.text}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            color: "rgba(0, 0, 0, 0.4)",
                          }}
                        >
                          {fb.date.toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </Text>
                        <View
                          style={{
                            backgroundColor: "rgba(0,0,0,0.07)",
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 12,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <FontAwesomeIcon
                            icon="pen"
                            size={10}
                            color={COLORS.gray3}
                            style={{ marginRight: 4 }}
                          />
                          <Text
                            style={{
                              fontSize: 11,
                              color: COLORS.gray3,
                            }}
                          >
                            Modifier
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: "rgba(0,0,0,0.03)",
                    borderRadius: 12,
                    padding: 16,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.gray3,
                      fontStyle: "italic",
                    }}
                  >
                    Aucun commentaire pour le moment
                  </Text>
                </View>
              )}

              {/* Add Feedback Input */}
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,0.03)",
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <TextInput
                  placeholder="Ajouter un commentaire..."
                  placeholderTextColor={"rgba(0,0,0,0.3)"}
                  value={feedback}
                  onChangeText={setFeedback}
                  multiline
                  style={{
                    color: COLORS.black,
                    fontSize: 15,
                    minHeight: 80,
                    textAlignVertical: "top",
                  }}
                />

                <TouchableOpacity
                  onPress={addFeedback}
                  style={{
                    backgroundColor: COLORS.primary,
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    borderRadius: 25,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "flex-end",
                    marginTop: 12,
                    opacity: feedback.trim() === "" ? 0.6 : 1,
                  }}
                  disabled={feedback.trim() === ""}
                >
                  <FontAwesomeIcon
                    icon="paper-plane"
                    size={16}
                    color="#FFFFFF"
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      color: COLORS.white,
                      fontWeight: "600",
                      fontSize: 15,
                    }}
                  >
                    Envoyer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Ressources pédagogiques */}
            {assistantName === "J'Apprends" && (
              <View
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 16,
                  padding: 20,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <FontAwesomeIcon
                    icon="graduation-cap"
                    size={16}
                    color={COLORS.primary}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: COLORS.black,
                    }}
                  >
                    Ressources pédagogiques
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={navigateToFicheDetails}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.03)",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                  }}
                >
                  <LinearGradient
                    colors={["#FF8E69", "#FF7862"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 16,
                    }}
                  >
                    <FontAwesomeIcon
                      icon="file-pdf"
                      size={22}
                      color="#FFFFFF"
                    />
                  </LinearGradient>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        color: COLORS.black,
                        marginBottom: 4,
                      }}
                    >
                      Fiche pédagogique - {activity.matiere || "Mathématiques"}
                    </Text>
                    <Text
                      style={{
                        color: COLORS.gray3,
                        fontSize: 14,
                      }}
                    >
                      Ressource complémentaire pour approfondir
                    </Text>
                  </View>

                  <FontAwesomeIcon
                    icon="chevron-right"
                    size={16}
                    color={COLORS.gray3}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={navigateToVideoDetails}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.03)",
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <LinearGradient
                    colors={["#2196F3", "#1565C0"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 16,
                    }}
                  >
                    <FontAwesomeIcon
                      icon="play-circle"
                      size={22}
                      color="#FFFFFF"
                    />
                  </LinearGradient>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        color: COLORS.black,
                        marginBottom: 4,
                      }}
                    >
                      Vidéo explicative - {activity.matiere || "Mathématiques"}
                    </Text>
                    <Text
                      style={{
                        color: COLORS.gray3,
                        fontSize: 14,
                      }}
                    >
                      10:24 minutes
                    </Text>
                  </View>

                  <FontAwesomeIcon
                    icon="chevron-right"
                    size={16}
                    color={COLORS.gray3}
                  />
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </ScrollView>
        {renderFeedbackModal()}
      </View>
    </SafeAreaView>
  );
};

export default HistoryDetails;
