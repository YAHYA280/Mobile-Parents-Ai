import { Image } from "expo-image";
import React, { useState } from "react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { useTheme } from "@/theme/ThemeProvider";
import ObjectiveCard from "@/components/ObjectiveCard";
import { SIZES, icons, COLORS, images } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  Alert,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

// Mock data for objectives
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
    status: "En cours", // Atteint, En cours, Non atteint
    progress: 65, // Percentage
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

// Mock data for the current child
const mockChildData = {
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
};

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

const ChildAccount = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { colors, dark } = useTheme();
  const params = useLocalSearchParams();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  // In a real app, you would fetch the child data using the id from params
  const childId = (params.id as string) || "1";
  const childData = mockChildData; // This would be fetched based on childId

  const handleDeleteAccount = () => {
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteAccount = () => {
    // In a real app, you would delete the account here
    setShowDeleteConfirmModal(false);
    navigation.goBack();
  };

  // Determine progress color based on percentage
  const getProgressColor = (value: number) => {
    if (value >= 75) return COLORS.greeen;
    if (value >= 50) return COLORS.primary;
    if (value >= 25) return COLORS.secondary;
    return COLORS.error;
  };

  // Settings modal content
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

          {/* Updated: Navigate to childpreferences screen */}
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

          {/* Updated: Navigate to addobjective screen */}
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
            onPress={() => setShowSettingsModal(false)}
            style={styles.closeButton}
          />
        </View>
      </View>
    </Modal>
  );

  // Delete confirmation modal
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
            Êtes-vous sûr de vouloir supprimer votre compte enfant ?
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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Header title={childData.name} />
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setShowSettingsModal(true)}
        >
          <Image source={icons.settings} style={styles.settingsIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
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
                Temps passé: {childData.timeSpent}
              </Text>
            </View>
          </View>
        </View>

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
            Progrès par matière
          </Text>

          {Object.entries(childData.subjectProgress).map(
            ([subject, progress], index) => (
              <View key={index} style={styles.subjectProgressContainer}>
                <View style={styles.progressRow}>
                  <Text style={styles.progressLabel}>
                    {subject.charAt(0).toUpperCase() + subject.slice(1)}
                  </Text>
                  <Text
                    style={[
                      styles.progressValue,
                      { color: getProgressColor(progress) },
                    ]}
                  >
                    {progress}%
                  </Text>
                </View>
                <ProgressBar
                  progress={progress}
                  color={getProgressColor(progress)}
                />
              </View>
            )
          )}
        </View>

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
            Objectifs d&apos;apprentissage
          </Text>

          {/* Updated: ObjectiveCard onEdit and onDelete */}
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
                        // Logique de suppression d'objectif
                        Alert.alert("Succès", "Objectif supprimé avec succès");
                      },
                    },
                  ]
                )
              }
            />
          ))}

          {/* Updated: Navigate to addobjective screen */}
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
      </ScrollView>

      {renderSettingsModal()}
      {renderDeleteConfirmModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 16,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
  },
  settingsIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
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
  subjectProgressContainer: {
    marginBottom: 16,
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
});

export default ChildAccount;
