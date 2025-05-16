import { Image } from "expo-image";
import React, { useState } from "react";
import Header from "@/components/ui/Header";
import Button from "@/components/Button";
import { useNavigation } from "expo-router";
import { useTheme } from "@/theme/ThemeProvider";
import ObjectiveCard from "@/components/ObjectiveCard";
import { SIZES, icons, COLORS, images } from "@/constants";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  Modal,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

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
    <View
      style={[
        styles.progressBar,
        { width: `${progress}%`, backgroundColor: color },
      ]}
    />
  </View>
);

// --------------------------------------------------
// ChildAccount Screen
// --------------------------------------------------
const ChildAccount = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { colors, dark } = useTheme();

  // 1. Call all Hooks at the top level, unconditionally:
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [message, setMessage] = useState("");

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
      >
        <Header
          title="Enfant introuvable"
          onBackPress={() => navigation.goBack()}
        />
        <View style={{ padding: 16 }}>
          <Text style={{ color: dark ? COLORS.white : COLORS.black }}>
            Désolé, aucune donnée trouvée pour cet enfant.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Helper to determine progress color
  const getProgressColor = (value: number) => {
    if (value >= 75) return COLORS.greeen;
    if (value >= 50) return COLORS.primary;
    if (value >= 25) return COLORS.secondary;
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
        <View
          style={[
            styles.modalView,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
          <Text
            style={[
              styles.modalTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
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
          >
            <Image source={icons.settings} style={styles.modalIcon} />
            <Text
              style={[
                styles.modalOptionText,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
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
          >
            <Image source={icons.plus} style={styles.modalIcon} />
            <Text
              style={[
                styles.modalOptionText,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Ajouter un objectif
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalOption, { borderBottomWidth: 0 }]}
            onPress={() => {
              setShowSettingsModal(false);
              handleDeleteAccount();
            }}
          >
            <Image
              source={icons.trash}
              style={[styles.modalIcon, { tintColor: COLORS.error }]}
            />
            <Text style={[styles.modalOptionText, { color: COLORS.error }]}>
              Supprimer le compte
            </Text>
          </TouchableOpacity>

          <Button
            title="Fermer"
            textColor={COLORS.white}
            onPress={() => setShowSettingsModal(false)}
            style={styles.closeButton}
          />
        </View>
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
        <View
          style={[
            styles.confirmModalView,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
          <Text style={[styles.confirmTitle, { color: COLORS.error }]}>
            Êtes-vous sûr de vouloir supprimer ce compte enfant ?
          </Text>

          <View style={styles.confirmButtonsContainer}>
            <Button
              title="Annuler"
              onPress={() => setShowDeleteConfirmModal(false)}
              style={[
                styles.confirmButton,
                {
                  backgroundColor: dark ? COLORS.dark3 : COLORS.greyscale300,
                  borderWidth: 0,
                },
              ]}
              textColor={dark ? COLORS.white : COLORS.black}
            />
            <Button
              title="Confirmer"
              onPress={confirmDeleteAccount}
              style={[
                styles.confirmButton,
                {
                  backgroundColor: COLORS.error,
                  borderColor: COLORS.error,
                },
              ]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  // --------------------------------------------------
  // Main Render
  // --------------------------------------------------
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["right", "bottom", "left"]}
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
        {/* Child Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={childData.avatar} style={styles.avatar} />
            {childData.isActive && <View style={styles.statusDot} />}
          </View>
          <View style={styles.profileInfo}>
            <Text
              style={[
                styles.childDetails,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {childData.age} ans • {childData.grade}
            </Text>
            <View style={styles.timeSpentContainer}>
              <Image source={icons.time} style={styles.timeIcon} />
              <Text style={styles.timeSpentText}>
                Temps passé : {childData.timeSpent}
              </Text>
            </View>
          </View>
        </View>

        {/* Global progress */}
        <View
          style={[
            styles.section,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Progrès global
          </Text>

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
          >
            <Image source={icons.download} style={styles.exportIcon} />
            <Text style={styles.exportText}>Exporter les statistiques</Text>
          </TouchableOpacity>
        </View>
        <SubjectsManager childId={childIdNumber} />

        {/* Objectives */}
        <View
          style={[
            styles.section,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Objectifs d’apprentissage
          </Text>

          {mockObjectives.map((objective) => (
            <ObjectiveCard
              key={objective.id}
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
                        Alert.alert("Succès", "Objectif supprimé avec succès");
                      },
                    },
                  ]
                )
              }
            />
          ))}

          <Button
            title="Ajouter un objectif"
            style={styles.addObjectiveButton}
            onPress={() =>
              router.push({
                pathname: "/addobjective/[id]",
                params: { id: childId },
              })
            }
            filled
          />
        </View>

        {/* Encouraging Message Section */}
        <View
          style={[
            styles.section,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Envoyer un message de soutien
          </Text>

          <TextInput
            style={[
              styles.messageInput,
              {
                color: dark ? COLORS.white : COLORS.black,
                borderColor: dark ? COLORS.greyscale300 : COLORS.grayscale200,
              },
            ]}
            onChangeText={(text) => setMessage(text)}
            value={message}
            placeholder="Écris ton message ici..."
            multiline
            placeholderTextColor={
              dark ? COLORS.greyscale400 : COLORS.grayscale400
            }
          />

          <Button
            title="Envoyer"
            onPress={() => {
              Alert.alert(
                "Message envoyé",
                "Ton message a été envoyé à l'enfant !"
              );
              setMessage("");
            }}
            style={styles.addObjectiveButton}
            filled
          />
        </View>
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
    padding: 16,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
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
  statusDot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: COLORS.greeen,
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: COLORS.white,
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
  timeIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.gray,
    marginRight: 8,
  },
  timeSpentText: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: "regular",
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 16,
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
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    padding: 8,
    backgroundColor: COLORS.greyscale100,
    borderRadius: 8,
  },
  exportIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.primary,
    marginRight: 8,
  },
  exportText: {
    fontSize: 14,
    color: COLORS.primary,
    fontFamily: "medium",
  },
  addObjectiveButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
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
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  modalIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
    tintColor: COLORS.primary,
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: "medium",
  },
  closeButton: {
    marginTop: 20,
    width: "100%",
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  confirmModalView: {
    width: SIZES.width * 0.9,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
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
  },
  confirmButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  messageInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    fontFamily: "regular",
    marginBottom: 16,
    textAlignVertical: "top",
    minHeight: 80,
  },
});

export default ChildAccount;
