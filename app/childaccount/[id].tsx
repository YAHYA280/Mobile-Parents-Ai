import { MotiView } from "moti";
import { Image } from "expo-image";
import React, { useState } from "react";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  SafeAreaView,
} from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  Modal,
  Platform,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import Header from "@/components/ui/Header";
import { useTheme } from "@/theme/ThemeProvider";
import { SIZES, COLORS, images } from "@/constants";
import ObjectiveCard from "@/components/ObjectiveCard";

import SubjectsManager from "../Enfants/SubjectsManager";

// --------------------------------------------------
// Mock Data
// --------------------------------------------------
const mockChildrenData = [
  {
    id: "1",
    name: "Thomas Dubois",
    age: 8,
    grade: "CE2",
    avatar: images.user7,
    isActive: true,
    timeSpent: "12h30",
    totalProgress: 75,
    subjectProgress: {
      math: 80,
      french: 65,
      science: 70,
      history: 60,
    },
  },
  {
    id: "2",
    name: "Marie Laurent",
    age: 10,
    grade: "CM2",
    avatar: images.user3,
    isActive: false,
    timeSpent: "8h45",
    totalProgress: 65,
    subjectProgress: {
      math: 70,
      french: 55,
      science: 62,
      history: 50,
    },
  },
  {
    id: "3",
    name: "Lucas Martin",
    age: 6,
    grade: "CP",
    avatar: images.user5,
    isActive: true,
    timeSpent: "5h20",
    totalProgress: 40,
    subjectProgress: {
      math: 50,
      french: 40,
      science: 35,
      history: 30,
    },
  },
];

const mockObjectives = [
  {
    id: "1",
    title: "Obtenir une moyenne de 80% en mathématiques",
    description:
      "Améliorer les performances en mathématiques en atteignant une moyenne d'au moins 80%",
    subject: "Mathématiques",
    priority: "Élevée",
    startDate: "26/02/2025 12:26 PM",
    endDate: "27/02/2025 12:00 AM",
    status: "En cours",
    progress: 65,
  },
  {
    id: "2",
    title: "Lecture de 3 livres",
    description: "Lire 3 livres adaptés à son âge pendant les vacances",
    subject: "Français",
    priority: "Moyenne",
    startDate: "26/02/2025 12:26 PM",
    endDate: "27/03/2025 12:00 AM",
    status: "En cours",
    progress: 33,
  },
  {
    id: "3",
    title: "Apprendre le vocabulaire des animaux",
    description: "Mémoriser les noms de 20 animaux en anglais",
    subject: "Anglais",
    priority: "Basse",
    startDate: "26/02/2025 12:26 PM",
    endDate: "28/02/2025 12:00 AM",
    status: "Atteint",
    progress: 100,
  },
];

// --------------------------------------------------
// ProgressBar Component
// --------------------------------------------------
interface ProgressBarProps {
  progress: number;
  color: string;
}
const ProgressBar = ({ progress, color }: ProgressBarProps) => (
  <View style={styles.progressBarContainer}>
    <MotiView
      from={{ width: "5%" }}
      animate={{ width: `${Math.max(5, progress)}%` }}
      transition={{ type: "timing", duration: 800, delay: 200 }}
      style={[styles.progressBar, { backgroundColor: color }]}
    />
  </View>
);

// --------------------------------------------------
// ChildAccount Screen
// --------------------------------------------------
const ChildAccount = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { colors } = useTheme();

  // 1. Call all Hooks at the top level, unconditionally:
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [message, setMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // 2. Get the childId from the route params:
  const params = useLocalSearchParams();
  const childId = (params.id as string) || "1";
  const childIdNumber = parseInt(params.id as string, 10) || 1;

  // 3. Find the correct child's data:
  const childData = mockChildrenData.find((child) => child.id === childId);

  // 4. If no child is found, return early *after* calling all hooks:
  if (!childData) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["top", "right", "left", "bottom"]}
      >
        <Header
          title="Enfant introuvable"
          onBackPress={() => navigation.goBack()}
        />
        <View style={{ padding: 16 }}>
          <Text style={{ color: COLORS.black }}>
            Désolé, aucune donnée trouvée pour cet enfant.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Helper to determine progress color
  const getProgressColor = (value: number) => {
    if (value >= 75) return "#4CAF50";
    if (value >= 50) return COLORS.primary;
    if (value >= 25) return "#FF9500";
    return COLORS.error;
  };

  // Handlers
  const handleDeleteAccount = () => {
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteAccount = () => {
    // In a real app, you'd actually delete the child account.
    setShowDeleteConfirmModal(false);
    navigation.goBack();
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      Alert.alert(
        "Message vide",
        "Veuillez entrer un message avant d'envoyer."
      );
      return;
    }

    setIsSendingMessage(true);

    // Simulate sending message
    setTimeout(() => {
      setIsSendingMessage(false);
      Alert.alert("Message envoyé", "Ton message a été envoyé à l'enfant !");
      setMessage("");
    }, 1000);
  };

  // --------------------------------------------------
  // Render Modals
  // --------------------------------------------------
  const renderSettingsModal = () => (
    <Modal
      animationType="slide"
      transparent
      visible={showSettingsModal}
      onRequestClose={() => setShowSettingsModal(false)}
    >
      <View style={styles.centeredView}>
        <MotiView
          from={{ opacity: 0, scale: 0.9, translateY: 20 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: "spring", damping: 15 }}
          style={[styles.modalView, { backgroundColor: COLORS.white }]}
        >
          <View style={styles.modalIconContainer}>
            <Ionicons name="settings" size={48} color={COLORS.primary} />
          </View>

          <Text style={[styles.modalTitle, { color: COLORS.black }]}>
            Paramètres du Compte Enfant
          </Text>

          {/* Navigate to childpreferences screen */}
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => {
              setShowSettingsModal(false);
              router.push({
                pathname: "/childpreferences/[id]",
                params: { id: childId },
              });
            }}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[COLORS.primary, "#4A90E2"]}
              style={styles.modalOptionIconContainer}
            >
              <Ionicons
                name="shield-checkmark"
                size={20}
                color={COLORS.white}
              />
            </LinearGradient>
            <Text style={[styles.modalOptionText, { color: COLORS.black }]}>
              Préférences et restrictions
            </Text>
          </TouchableOpacity>

          {/* Navigate to addobjective screen */}
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => {
              setShowSettingsModal(false);
              router.push({
                pathname: "/addobjective/[id]",
                params: { id: childId },
              });
            }}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={["#4CAF50", "#66BB6A"]}
              style={styles.modalOptionIconContainer}
            >
              <Ionicons name="add" size={20} color={COLORS.white} />
            </LinearGradient>
            <Text style={[styles.modalOptionText, { color: COLORS.black }]}>
              Ajouter un objectif
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalOption, { borderBottomWidth: 0 }]}
            onPress={() => {
              setShowSettingsModal(false);
              handleDeleteAccount();
            }}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[COLORS.error, "#FF6B6B"]}
              style={styles.modalOptionIconContainer}
            >
              <Ionicons name="trash" size={20} color={COLORS.white} />
            </LinearGradient>
            <Text style={[styles.modalOptionText, { color: COLORS.error }]}>
              Supprimer le compte
            </Text>
          </TouchableOpacity>

          {/* Enhanced Close Button */}
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowSettingsModal(false)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalCloseGradient}
            >
              <View style={styles.modalCloseContent}>
                <Ionicons name="close-outline" size={20} color={COLORS.white} />
                <Text style={styles.modalCloseText}>Fermer</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>
      </View>
    </Modal>
  );

  const renderDeleteConfirmModal = () => (
    <Modal
      animationType="fade"
      transparent
      visible={showDeleteConfirmModal}
      onRequestClose={() => setShowDeleteConfirmModal(false)}
    >
      <View style={styles.centeredView}>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
          style={[styles.confirmModalView, { backgroundColor: COLORS.white }]}
        >
          <View style={styles.modalIconContainer}>
            <Ionicons name="warning" size={48} color={COLORS.error} />
          </View>

          <Text style={[styles.confirmTitle, { color: COLORS.error }]}>
            Êtes-vous sûr de vouloir supprimer ce compte enfant ?
          </Text>

          <View style={styles.confirmButtonsContainer}>
            {/* Enhanced Cancel Button */}
            <TouchableOpacity
              style={[
                styles.confirmCancelButton,
                { borderColor: COLORS.greyscale300 },
              ]}
              onPress={() => setShowDeleteConfirmModal(false)}
              activeOpacity={0.8}
            >
              <View style={styles.confirmCancelContent}>
                <Ionicons name="close-outline" size={18} color={COLORS.black} />
                <Text
                  style={[styles.confirmCancelText, { color: COLORS.black }]}
                >
                  Annuler
                </Text>
              </View>
            </TouchableOpacity>

            {/* Enhanced Confirm Button */}
            <TouchableOpacity
              style={styles.confirmDeleteButton}
              onPress={confirmDeleteAccount}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.error, "#FF6B6B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.confirmDeleteGradient}
              >
                <View style={styles.confirmDeleteContent}>
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={COLORS.white}
                  />
                  <Text style={styles.confirmDeleteText}>Confirmer</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </MotiView>
      </View>
    </Modal>
  );

  // --------------------------------------------------
  // Main Render
  // --------------------------------------------------
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "right", "left", "bottom"]}
    >
      {/* Header + Settings button */}
      <Header
        title={childData.name}
        rightIcon="settings-outline"
        onRightIconPress={() => setShowSettingsModal(true)}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Child Info Card */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 600 }}
          style={[styles.infoCard, Platform.OS === "ios" && styles.iosShadow]}
        >
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image source={childData.avatar} style={styles.avatar} />
              {childData.isActive && (
                <View style={styles.statusDotWrapper}>
                  <View style={styles.statusDot} />
                </View>
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.childDetails, { color: COLORS.black }]}>
                {childData.age} ans • {childData.grade}
              </Text>
              <View style={styles.timeSpentContainer}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={COLORS.primary}
                />
                <Text style={styles.timeSpentText}>
                  Temps passé : {childData.timeSpent}
                </Text>
              </View>
            </View>
          </View>
        </MotiView>

        {/* Global progress */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 600, delay: 200 }}
          style={[
            styles.section,
            { backgroundColor: COLORS.white },
            Platform.OS === "ios" && styles.iosShadow,
          ]}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="trending-up" size={24} color={COLORS.primary} />
            <Text style={[styles.sectionTitle, { color: COLORS.black }]}>
              Progrès global
            </Text>
          </View>

          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Taux de réussite global</Text>
            <Text
              style={[
                styles.progressValue,
                { color: getProgressColor(childData.totalProgress) },
              ]}
            >
              {childData.totalProgress}%
            </Text>
          </View>

          <ProgressBar
            progress={childData.totalProgress}
            color={getProgressColor(childData.totalProgress)}
          />

          <TouchableOpacity
            style={styles.exportButton}
            onPress={() =>
              Alert.alert(
                "Export",
                "Cette fonctionnalité sera bientôt disponible"
              )
            }
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[`${COLORS.primary}15`, `${COLORS.primary}10`]}
              style={styles.exportGradient}
            >
              <Ionicons
                name="download-outline"
                size={16}
                color={COLORS.primary}
              />
              <Text style={styles.exportText}>Exporter les statistiques</Text>
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>

        <SubjectsManager childId={childIdNumber} />

        {/* Objectives */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 600, delay: 400 }}
          style={[
            styles.section,
            { backgroundColor: COLORS.white },
            Platform.OS === "ios" && styles.iosShadow,
          ]}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="flag" size={24} color={COLORS.primary} />
            <Text style={[styles.sectionTitle, { color: COLORS.black }]}>
              Objectifs d&apos;apprentissage
            </Text>
          </View>

          {mockObjectives.map((objective, index) => (
            <MotiView
              key={objective.id}
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: "timing", duration: 500, delay: 100 * index }}
            >
              <ObjectiveCard
                objective={objective}
                onEdit={() =>
                  router.push({
                    pathname: "/editobjective/[id]",
                    params: { id: objective.id },
                  })
                }
                onDelete={() =>
                  Alert.alert(
                    "Confirmation",
                    "Êtes-vous sûr de vouloir supprimer cet objectif ?",
                    [
                      { text: "Annuler", style: "cancel" },
                      {
                        text: "Supprimer",
                        style: "destructive",
                        onPress: () => {
                          // Delete objective logic
                          Alert.alert(
                            "Succès",
                            "Objectif supprimé avec succès"
                          );
                        },
                      },
                    ]
                  )
                }
              />
            </MotiView>
          ))}

          {/* Enhanced Add Objective Button */}
          <TouchableOpacity
            style={styles.addObjectiveButton}
            onPress={() =>
              router.push({
                pathname: "/addobjective/[id]",
                params: { id: childId },
              })
            }
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#4CAF50", "#66BB6A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addObjectiveGradient}
            >
              <View style={styles.addObjectiveContent}>
                <Ionicons name="add" size={20} color={COLORS.white} />
                <Text style={styles.addObjectiveText}>Ajouter un objectif</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>

        {/* Encouraging Message Section */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 600, delay: 600 }}
          style={[
            styles.section,
            { backgroundColor: COLORS.white },
            Platform.OS === "ios" && styles.iosShadow,
          ]}
        >
          <View style={styles.sectionHeader}>
            <Ionicons
              name="chatbubble-ellipses"
              size={24}
              color={COLORS.primary}
            />
            <Text style={[styles.sectionTitle, { color: COLORS.black }]}>
              Envoyer un message de soutien
            </Text>
          </View>

          <TextInput
            style={[
              styles.messageInput,
              {
                color: COLORS.black,
                borderColor: COLORS.grayscale200,
                backgroundColor: COLORS.greyscale100,
              },
            ]}
            onChangeText={(text) => setMessage(text)}
            value={message}
            placeholder="Écris ton message ici..."
            multiline
            placeholderTextColor={COLORS.grayscale400}
          />

          {/* Enhanced Send Button */}
          <TouchableOpacity
            style={[styles.sendButton, { opacity: isSendingMessage ? 0.8 : 1 }]}
            onPress={handleSendMessage}
            disabled={isSendingMessage}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sendButtonGradient}
            >
              {isSendingMessage ? (
                <View style={styles.sendingContainer}>
                  <ActivityIndicator size="small" color={COLORS.white} />
                  <Text style={styles.sendButtonText}>Envoi...</Text>
                </View>
              ) : (
                <View style={styles.sendButtonContent}>
                  <Ionicons name="send" size={18} color={COLORS.white} />
                  <Text style={styles.sendButtonText}>Envoyer</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>
      </ScrollView>

      {/* Render Modals */}
      {renderSettingsModal()}
      {renderDeleteConfirmModal()}
    </SafeAreaView>
  );
};

// --------------------------------------------------
// Styles
// --------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  iosShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  statusDotWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
  },
  profileInfo: {
    flex: 1,
  },
  childDetails: {
    fontSize: 16,
    fontFamily: "medium",
    marginBottom: 8,
  },
  timeSpentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeSpentText: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: "regular",
    marginLeft: 8,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginLeft: 12,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: "medium",
  },
  progressValue: {
    fontSize: 14,
    fontFamily: "bold",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.grayscale200,
    borderRadius: 4,
    marginBottom: 12,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  exportButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  exportGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  exportText: {
    fontSize: 14,
    color: COLORS.primary,
    fontFamily: "medium",
    marginLeft: 8,
  },
  addObjectiveButton: {
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addObjectiveGradient: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  addObjectiveContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addObjectiveText: {
    fontSize: 16,
    fontFamily: "semibold",
    color: COLORS.white,
    marginLeft: 8,
  },
  messageInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    fontFamily: "regular",
    marginBottom: 16,
    textAlignVertical: "top",
    minHeight: 80,
  },
  sendButton: {
    alignSelf: "flex-end",
    minWidth: 120,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sendButtonGradient: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    fontSize: 14,
    fontFamily: "semibold",
    color: COLORS.white,
    marginLeft: 8,
  },
  sendingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: SIZES.width * 0.9,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalIconContainer: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale200,
  },
  modalOptionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: "medium",
    flex: 1,
  },
  modalCloseButton: {
    marginTop: 20,
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modalCloseGradient: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseText: {
    fontSize: 16,
    fontFamily: "semibold",
    color: COLORS.white,
    marginLeft: 8,
  },
  confirmModalView: {
    width: SIZES.width * 0.9,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmTitle: {
    fontSize: 18,
    fontFamily: "medium",
    textAlign: "center",
    marginBottom: 20,
  },
  confirmButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  confirmCancelButton: {
    flex: 1,
    height: 48,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  confirmCancelContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmCancelText: {
    fontSize: 14,
    fontFamily: "semibold",
    marginLeft: 6,
  },
  confirmDeleteButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmDeleteGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmDeleteContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmDeleteText: {
    fontSize: 14,
    fontFamily: "semibold",
    color: COLORS.white,
    marginLeft: 6,
  },
});

export default ChildAccount;
