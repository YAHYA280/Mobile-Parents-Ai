import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { COLORS } from "../../constants/theme";
import { useTheme } from "../../theme/ThemeProvider";

// Structure pour une matière
export type ISubject = {
  id: string;
  name: string;
  isSelected: boolean;
  icon: string;
};

// Structure pour l'abonnement
export type ISubscription = {
  id: string;
  title: string;
  nbr_children_access: number; // Nombre max d'enfants
  nbr_subjects: number; // Nombre total de matières à distribuer
};

// Structure pour un enfant dans l'API
export type IChildInfo = {
  id: number;
  name: string;
  subjectsAllocated: number; // Nombre de matières allouées à cet enfant
};

// Simuler l'API avec des matières disponibles
const AVAILABLE_SUBJECTS: ISubject[] = [
  { id: "1", name: "Mathématiques", isSelected: false, icon: "calculator" },
  { id: "2", name: "Français", isSelected: false, icon: "book" },
  { id: "3", name: "Histoire-Géographie", isSelected: false, icon: "globe" },
  { id: "4", name: "Sciences", isSelected: false, icon: "flask" },
  { id: "5", name: "Anglais", isSelected: false, icon: "language" },
  { id: "6", name: "Arts plastiques", isSelected: false, icon: "brush" },
  { id: "7", name: "Musique", isSelected: false, icon: "musical-notes" },
  { id: "8", name: "Éducation physique", isSelected: false, icon: "fitness" },
  { id: "9", name: "Informatique", isSelected: false, icon: "laptop" },
];

// Simuler un abonnement actif
const MOCK_SUBSCRIPTION: ISubscription = {
  id: "premium123",
  title: "Premium",
  nbr_children_access: 3, // Nombre max d'enfants
  nbr_subjects: 8, // Nombre total de matières à distribuer
};

// Données simulées pour tous les enfants (normalement récupérées de l'API)
const MOCK_CHILDREN: IChildInfo[] = [
  { id: 1, name: "Emma", subjectsAllocated: 3 },
  { id: 2, name: "Lucas", subjectsAllocated: 3 },
  { id: 3, name: "Chloé", subjectsAllocated: 2 },
];

// Simuler les matières déjà sélectionnées par l'enfant actuel
const MOCK_SELECTED_SUBJECTS = ["1", "3", "5"]; // IDs des matières sélectionnées

interface ChildSubjectsManagerProps {
  childId: number; // ID de l'enfant actuel
}

const ChildSubjectsManager: React.FC<ChildSubjectsManagerProps> = ({
  childId,
}) => {
  const { dark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [subscription] = useState<ISubscription>(MOCK_SUBSCRIPTION);
  const [allChildren] = useState<IChildInfo[]>(MOCK_CHILDREN);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Trouver l'enfant actuel
  const currentChild = allChildren.find((child) => child.id === childId);

  // Ne prendre en compte que les enfants dans la limite de l'abonnement
  const childrenWithinLimit = allChildren.slice(
    0,
    subscription.nbr_children_access
  );

  // Vérifier si l'enfant actuel est inclus dans la limite de l'abonnement
  const isCurrentChildWithinLimit = childrenWithinLimit.some(
    (child) => child.id === childId
  );

  // Calculer combien de matières sont déjà utilisées par les enfants dans la limite (sauf cet enfant)
  const otherChildrenSubjects = childrenWithinLimit.reduce(
    (sum, child) => sum + (child.id !== childId ? child.subjectsAllocated : 0),
    0
  );

  // Initialiser les matières avec celles déjà sélectionnées
  useEffect(() => {
    // Créer une copie des matières disponibles
    const initialSubjects = AVAILABLE_SUBJECTS.map((subject) => ({
      ...subject,
      isSelected: MOCK_SELECTED_SUBJECTS.includes(subject.id),
    }));

    setSubjects(initialSubjects);
  }, []);

  // Compter le nombre de matières sélectionnées pour cet enfant
  const selectedCount = subjects.filter((subject) => subject.isSelected).length;

  // Calculer le nombre maximum de matières que cet enfant peut avoir
  const remainingSubjects = subscription.nbr_subjects - otherChildrenSubjects;

  const toggleSubject = useCallback(
    (id: string) => {
      // Si l'enfant n'est pas dans la limite de l'abonnement, afficher un message d'erreur
      if (!isCurrentChildWithinLimit && !currentChild?.subjectsAllocated) {
        Alert.alert(
          "Limite d'enfants atteinte",
          `Votre abonnement ${subscription.title} vous permet d'avoir accès à ${subscription.nbr_children_access} enfants seulement.`,
          [{ text: "OK" }]
        );
        return;
      }

      setSubjects((currentSubjects) => {
        return currentSubjects.map((subject) => {
          if (subject.id === id) {
            // Si la matière est déjà sélectionnée, on peut toujours la désélectionner
            if (subject.isSelected) {
              return { ...subject, isSelected: false };
            }

            // Si on essaie de sélectionner une nouvelle matière mais qu'on a atteint la limite totale
            if (selectedCount >= remainingSubjects) {
              Alert.alert(
                "Limite atteinte",
                `Vous avez atteint la limite de ${subscription.nbr_subjects} matières pour tous vos enfants selon votre abonnement ${subscription.title}.`,
                [{ text: "OK" }]
              );
              return subject;
            }

            return { ...subject, isSelected: true };
          }
          return subject;
        });
      });
    },
    [
      selectedCount,
      remainingSubjects,
      subscription,
      isCurrentChildWithinLimit,
      currentChild,
    ]
  );

  const saveChanges = useCallback(() => {
    setIsLoading(true);

    // Ici, vous appelleriez votre API pour sauvegarder les matières
    setTimeout(() => {
      setIsLoading(false);
      console.log(
        `Matières sauvegardées pour l'enfant #${childId}:`,
        subjects.filter((s) => s.isSelected).map((s) => s.name)
      );

      Alert.alert(
        "Matières mises à jour",
        "Les matières ont été assignées avec succès.",
        [{ text: "OK", onPress: () => setModalVisible(false) }]
      );
    }, 1000);
  }, [childId, subjects]);

  // Afficher un message si aucun enfant correspondant n'est trouvé
  if (!currentChild) {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 600 }}
        style={[
          styles.container,
          { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          Platform.OS === "ios" && styles.iosShadow,
        ]}
      >
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={COLORS.error} />
          <Text
            style={[
              styles.errorText,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Enfant non trouvé. Veuillez vérifier l&apos;identifiant.
          </Text>
        </View>
      </MotiView>
    );
  }

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 600 }}
      style={[
        styles.container,
        { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
        Platform.OS === "ios" && styles.iosShadow,
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Ionicons name="library" size={24} color={COLORS.primary} />
          <Text
            style={[
              styles.sectionTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Matières
          </Text>
        </View>
        <TouchableOpacity
          style={styles.manageButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primary]}
            style={styles.manageButtonGradient}
          >
            <Ionicons name="settings" size={14} color={COLORS.white} />
            <Text style={styles.manageButtonText}>Gérer</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Ionicons name="information-circle" size={16} color={COLORS.primary} />
        <Text
          style={[
            styles.infoText,
            { color: dark ? COLORS.greyscale300 : COLORS.gray },
          ]}
        >
          Votre abonnement {subscription.title} permet d&apos;assigner un total
          de {subscription.nbr_subjects} matières pour{" "}
          {subscription.nbr_children_access} enfants.
        </Text>
      </View>

      {!isCurrentChildWithinLimit && currentChild.subjectsAllocated === 0 ? (
        <View style={styles.warningContainer}>
          <Ionicons name="warning" size={20} color="#FF6B6B" />
          <Text style={styles.warningText}>
            Cet enfant n&apos;est pas inclus dans votre limite d&apos;abonnement
            actuel ({subscription.nbr_children_access} enfants).
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text
                style={[
                  styles.statText,
                  { color: dark ? COLORS.greyscale300 : COLORS.gray },
                ]}
              >
                {selectedCount} / {subscription.nbr_subjects} matières
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <MotiView
                from={{ width: "0%" }}
                animate={{
                  width: `${(selectedCount / subscription.nbr_subjects) * 100}%`,
                }}
                transition={{ type: "timing", duration: 800, delay: 300 }}
                style={[
                  styles.progressBar,
                  {
                    backgroundColor:
                      selectedCount > 0 ? "#4CAF50" : COLORS.greyscale300,
                  },
                ]}
              />
            </View>
          </View>

          {selectedCount > 0 ? (
            <View style={styles.subjectsContainer}>
              {subjects
                .filter((s) => s.isSelected)
                .map((subject, index) => (
                  <MotiView
                    key={subject.id}
                    from={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      type: "spring",
                      delay: 100 * index,
                      damping: 15,
                    }}
                  >
                    <View style={styles.subjectTag}>
                      <LinearGradient
                        colors={["#4CAF50", "#66BB6A"]}
                        style={styles.subjectTagGradient}
                      >
                        <Ionicons
                          name={subject.icon as any}
                          size={14}
                          color={COLORS.white}
                        />
                        <Text style={styles.subjectTagText}>
                          {subject.name}
                        </Text>
                      </LinearGradient>
                    </View>
                  </MotiView>
                ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="school"
                size={48}
                color={dark ? COLORS.dark3 : COLORS.greyscale300}
              />
              <Text
                style={[
                  styles.emptyText,
                  { color: dark ? COLORS.greyscale300 : COLORS.gray },
                ]}
              >
                Aucune matière assignée
              </Text>
              <Text
                style={[
                  styles.emptySubtext,
                  { color: dark ? COLORS.greyscale400 : COLORS.gray },
                ]}
              >
                Ajoutez des matières pour personnaliser l&apos;apprentissage
              </Text>
            </View>
          )}
        </>
      )}

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <MotiView
            from={{ opacity: 0, scale: 0.9, translateY: 50 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{ type: "spring", damping: 15 }}
            style={[
              styles.modalContent,
              { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
            ]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <Ionicons name="settings" size={24} color={COLORS.primary} />
                <Text
                  style={[
                    styles.modalTitle,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  Gérer les matières
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={dark ? COLORS.white : COLORS.black}
                />
              </TouchableOpacity>
            </View>

            {!isCurrentChildWithinLimit &&
            currentChild.subjectsAllocated === 0 ? (
              <View style={styles.modalWarning}>
                <Ionicons name="warning" size={24} color="#FF6B6B" />
                <Text style={styles.modalWarningText}>
                  Vous avez atteint la limite de{" "}
                  {subscription.nbr_children_access} enfants de votre
                  abonnement. Veuillez mettre à niveau votre abonnement pour
                  ajouter plus d&apos;enfants.
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.modalSubtitleContainer}>
                  <Ionicons
                    name="information-circle"
                    size={16}
                    color={COLORS.primary}
                  />
                  <Text
                    style={[
                      styles.modalSubtitle,
                      { color: dark ? COLORS.greyscale300 : COLORS.gray },
                    ]}
                  >
                    Vous pouvez sélectionner jusqu&apos;à {remainingSubjects}{" "}
                    matières (sur {subscription.nbr_subjects} de votre
                    abonnement).
                  </Text>
                </View>

                <FlatList
                  data={subjects}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item, index }) => (
                    <MotiView
                      from={{ opacity: 0, translateX: -20 }}
                      animate={{ opacity: 1, translateX: 0 }}
                      transition={{
                        type: "timing",
                        duration: 300,
                        delay: 50 * index,
                      }}
                    >
                      <TouchableOpacity
                        style={[
                          styles.subjectItem,
                          {
                            backgroundColor: item.isSelected
                              ? "#4CAF5015"
                              : dark
                                ? COLORS.dark2
                                : COLORS.greyscale100,
                            borderColor: item.isSelected
                              ? "#4CAF50"
                              : dark
                                ? COLORS.dark3
                                : COLORS.greyscale300,
                          },
                        ]}
                        onPress={() => toggleSubject(item.id)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.subjectItemContent}>
                          <View
                            style={[
                              styles.subjectItemIcon,
                              {
                                backgroundColor: item.isSelected
                                  ? "#4CAF5020"
                                  : dark
                                    ? COLORS.dark3
                                    : COLORS.greyscale300,
                              },
                            ]}
                          >
                            <Ionicons
                              name={item.icon as any}
                              size={16}
                              color={
                                item.isSelected
                                  ? "#4CAF50"
                                  : dark
                                    ? COLORS.white
                                    : COLORS.gray
                              }
                            />
                          </View>
                          <Text
                            style={[
                              styles.subjectItemText,
                              { color: dark ? COLORS.white : COLORS.black },
                            ]}
                          >
                            {item.name}
                          </Text>
                        </View>

                        {item.isSelected && (
                          <View style={styles.checkmarkContainer}>
                            <Ionicons
                              name="checkmark-circle"
                              size={20}
                              color="#4CAF50"
                            />
                          </View>
                        )}
                      </TouchableOpacity>
                    </MotiView>
                  )}
                  contentContainerStyle={styles.subjectsList}
                  showsVerticalScrollIndicator={false}
                />

                <View style={styles.allocationInfo}>
                  <Ionicons name="pie-chart" size={16} color={COLORS.primary} />
                  <Text
                    style={[
                      styles.allocationInfoText,
                      { color: dark ? COLORS.greyscale300 : COLORS.gray },
                    ]}
                  >
                    Vous pouvez distribuer librement les{" "}
                    {subscription.nbr_subjects} matières de votre abonnement
                    entre vos {subscription.nbr_children_access} enfants.
                  </Text>
                </View>
              </>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  {
                    borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
                  },
                ]}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.8}
              >
                <View style={styles.cancelButtonContent}>
                  <Ionicons
                    name="close-outline"
                    size={18}
                    color={dark ? COLORS.white : COLORS.black}
                  />
                  <Text
                    style={[
                      styles.cancelButtonText,
                      { color: dark ? COLORS.white : COLORS.black },
                    ]}
                  >
                    Annuler
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (!isCurrentChildWithinLimit &&
                    currentChild.subjectsAllocated === 0) ||
                  isLoading
                    ? styles.disabledButton
                    : {},
                ]}
                onPress={saveChanges}
                disabled={
                  (!isCurrentChildWithinLimit &&
                    currentChild.subjectsAllocated === 0) ||
                  isLoading
                }
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    (!isCurrentChildWithinLimit &&
                      currentChild.subjectsAllocated === 0) ||
                    isLoading
                      ? ["#CCCCCC", "#CCCCCC"]
                      : ["#4CAF50", "#66BB6A"]
                  }
                  style={styles.saveButtonGradient}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color={COLORS.white} />
                      <Text style={styles.saveButtonText}>
                        Enregistrement...
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.saveButtonContent}>
                      <Ionicons
                        name="checkmark-outline"
                        size={18}
                        color={COLORS.white}
                      />
                      <Text style={styles.saveButtonText}>Enregistrer</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </MotiView>
        </View>
      </Modal>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
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
  errorContainer: {
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: "medium",
    textAlign: "center",
    marginTop: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginLeft: 12,
  },
  manageButton: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#FF9500",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  manageButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  manageButtonText: {
    color: COLORS.white,
    marginLeft: 6,
    fontSize: 14,
    fontFamily: "semibold",
  },
  infoContainer: {
    flexDirection: "row",
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: "flex-start",
  },
  infoText: {
    fontSize: 12,
    fontFamily: "regular",
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  warningContainer: {
    flexDirection: "row",
    backgroundColor: "#FF6B6B15",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  warningText: {
    color: "#FF6B6B",
    fontSize: 14,
    fontFamily: "medium",
    marginLeft: 8,
    flex: 1,
  },
  statsContainer: {
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statText: {
    fontSize: 14,
    fontFamily: "medium",
    marginLeft: 8,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: COLORS.greyscale300,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  subjectsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  subjectTag: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subjectTagGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  subjectTagText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "semibold",
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "medium",
    textAlign: "center",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: "regular",
    textAlign: "center",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    width: "100%",
    maxHeight: "90%",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "bold",
    marginLeft: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: "center",
    alignItems: "center",
  },
  modalSubtitleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  modalSubtitle: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  modalWarning: {
    flexDirection: "row",
    backgroundColor: "#FF6B6B15",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  modalWarningText: {
    color: "#FF6B6B",
    fontSize: 14,
    fontFamily: "medium",
    marginLeft: 12,
    flex: 1,
  },
  subjectsList: {
    paddingBottom: 20,
  },
  subjectItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  subjectItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  subjectItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  subjectItemText: {
    fontSize: 16,
    fontFamily: "medium",
    flex: 1,
  },
  checkmarkContainer: {
    marginLeft: 12,
  },
  allocationInfo: {
    flexDirection: "row",
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    alignItems: "flex-start",
  },
  allocationInfoText: {
    fontSize: 12,
    fontFamily: "regular",
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 16,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  cancelButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: "semibold",
    marginLeft: 6,
  },
  saveButton: {
    flex: 1,
    borderRadius: 16,
    height: 56,
    overflow: "hidden",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "semibold",
    marginLeft: 6,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    shadowOpacity: 0,
    elevation: 0,
  },
});

export default ChildSubjectsManager;
