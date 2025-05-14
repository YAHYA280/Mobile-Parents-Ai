// app/Enfants/Performance/components/RecommendationsCard.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Modal,
  ScrollView,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faLightbulb,
  faPaperPlane,
  faPen,
  faTrashAlt,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

import { COLORS } from "../../../../constants/theme";
import { Child } from "../../../../data/Enfants/CHILDREN_DATA";

interface RecommendationsCardProps {
  childData: Child;
}

interface RecommendationItem {
  id: string;
  text: string;
  date: string;
  subject?: string;
  type: "system" | "parent";
}

const RecommendationsCard: React.FC<RecommendationsCardProps> = ({
  childData,
}) => {
  // States
  const [feedback, setFeedback] = useState("");
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([
    {
      id: "1",
      text: "Augmenter la fréquence des exercices de mathématiques pour renforcer les compétences en résolution de problèmes.",
      date: "15 avril 2025",
      subject: "Mathématiques",
      type: "system",
    },
    {
      id: "2",
      text: "Continuer les progrès en lecture avec des textes plus complexes pour améliorer la compréhension.",
      date: "10 avril 2025",
      subject: "Français",
      type: "system",
    },
    {
      id: "3",
      text: "Nous avons remarqué des progrès significatifs en orthographe. Continuons à travailler sur les dictées régulières à la maison.",
      date: "2 avril 2025",
      type: "parent",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<RecommendationItem | null>(null);
  const [editingText, setEditingText] = useState("");

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Handle adding new feedback
  const handleAddFeedback = () => {
    if (feedback.trim() === "") return;

    const newRecommendation: RecommendationItem = {
      id: Date.now().toString(),
      text: feedback,
      date: new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      type: "parent",
    };

    setRecommendations((prev) => [newRecommendation, ...prev]);
    setFeedback("");

    // Animate new item
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Handle editing recommendation
  const openEditModal = (recommendation: RecommendationItem) => {
    setSelectedRecommendation(recommendation);
    setEditingText(recommendation.text);
    setShowModal(true);
  };

  // Update recommendation
  const updateRecommendation = () => {
    if (!selectedRecommendation || editingText.trim() === "") return;

    setRecommendations((prev) =>
      prev.map((rec) =>
        rec.id === selectedRecommendation.id
          ? { ...rec, text: editingText }
          : rec
      )
    );

    setShowModal(false);
  };

  // Delete recommendation
  const deleteRecommendation = () => {
    if (!selectedRecommendation) return;

    setRecommendations((prev) =>
      prev.filter((rec) => rec.id !== selectedRecommendation.id)
    );

    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Recommandations</Text>
        <View style={styles.iconContainer}>
          <FontAwesomeIcon icon={faLightbulb} size={20} color="#F3BB00" />
        </View>
      </View>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Ajouter une recommandation..."
          value={feedback}
          onChangeText={setFeedback}
          multiline
          style={styles.textInput}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          onPress={handleAddFeedback}
          style={[
            styles.sendButton,
            { opacity: feedback.trim() === "" ? 0.5 : 1 },
          ]}
          disabled={feedback.trim() === ""}
        >
          <FontAwesomeIcon icon={faPaperPlane} size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Feedback Added Animation */}
      <Animated.View
        style={[styles.feedbackAddedIndicator, { opacity: fadeAnim }]}
      >
        <Text style={styles.feedbackAddedText}>Recommandation ajoutée !</Text>
      </Animated.View>

      {/* Recommendations List */}
      <View style={styles.recommendationsListContainer}>
        {recommendations.length > 0 ? (
          recommendations.map((recommendation, index) => (
            <View
              key={recommendation.id}
              style={[
                styles.recommendationItem,
                index < recommendations.length - 1 &&
                  styles.recommendationWithBorder,
              ]}
            >
              <View style={styles.recommendationHeader}>
                <View style={styles.recommendationMeta}>
                  <Text style={styles.recommendationDate}>
                    {recommendation.date}
                  </Text>
                  {recommendation.subject && (
                    <View style={styles.subjectBadge}>
                      <Text style={styles.subjectText}>
                        {recommendation.subject}
                      </Text>
                    </View>
                  )}
                  <View
                    style={[
                      styles.typeBadge,
                      {
                        backgroundColor:
                          recommendation.type === "system"
                            ? "rgba(33, 150, 243, 0.1)"
                            : "rgba(76, 175, 80, 0.1)",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeText,
                        {
                          color:
                            recommendation.type === "system"
                              ? "#2196F3"
                              : "#4CAF50",
                        },
                      ]}
                    >
                      {recommendation.type === "system" ? "Système" : "Parent"}
                    </Text>
                  </View>
                </View>

                {recommendation.type === "parent" && (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openEditModal(recommendation)}
                  >
                    <FontAwesomeIcon icon={faPen} size={14} color="#666666" />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.recommendationText}>
                {recommendation.text}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Aucune recommandation pour le moment.
            </Text>
          </View>
        )}
      </View>

      {/* Edit Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier la recommandation</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  size={20}
                  color="#666666"
                />
              </TouchableOpacity>
            </View>

            <TextInput
              value={editingText}
              onChangeText={setEditingText}
              multiline
              style={styles.editInput}
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={deleteRecommendation}
              >
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  size={16}
                  color="#FFFFFF"
                  style={styles.actionIcon}
                />
                <Text style={styles.deleteButtonText}>Supprimer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.updateButton}
                onPress={updateRecommendation}
              >
                <FontAwesomeIcon
                  icon={faPen}
                  size={16}
                  color="#FFFFFF"
                  style={styles.actionIcon}
                />
                <Text style={styles.updateButtonText}>Mettre à jour</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(243, 187, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: "flex-end",
  },
  textInput: {
    flex: 1,
    color: "#333333",
    fontSize: 15,
    minHeight: 80,
    maxHeight: 120,
    textAlignVertical: "top",
    paddingTop: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  feedbackAddedIndicator: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  feedbackAddedText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  recommendationsListContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    borderRadius: 12,
    padding: 16,
  },
  recommendationItem: {
    paddingBottom: 16,
    marginBottom: 16,
  },
  recommendationWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  recommendationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  recommendationMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    flex: 1,
  },
  recommendationDate: {
    fontSize: 12,
    color: "#666666",
    marginRight: 8,
  },
  subjectBadge: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  subjectText: {
    fontSize: 11,
    color: "#333333",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  typeText: {
    fontSize: 11,
    fontWeight: "500",
  },
  editButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333333",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    color: "#666666",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
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
    color: "#333333",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  editInput: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 12,
    padding: 16,
    color: "#333333",
    fontSize: 15,
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionIcon: {
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: 8,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginLeft: 8,
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
});

export default RecommendationsCard;
