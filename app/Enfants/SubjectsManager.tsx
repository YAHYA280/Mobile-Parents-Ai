import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBook,
  faPlus,
  faInfo,
  faTimes,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import {
  View,
  Text,
  Modal,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { COLORS } from "../../constants/theme";

// Structure pour une matière
export type ISubject = {
  id: string;
  name: string;
  isSelected: boolean;
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
  { id: "1", name: "Mathématiques", isSelected: false },
  { id: "2", name: "Français", isSelected: false },
  { id: "3", name: "Histoire-Géographie", isSelected: false },
  { id: "4", name: "Sciences", isSelected: false },
  { id: "5", name: "Anglais", isSelected: false },
  { id: "6", name: "Arts plastiques", isSelected: false },
  { id: "7", name: "Musique", isSelected: false },
  { id: "8", name: "Éducation physique", isSelected: false },
  { id: "9", name: "Informatique", isSelected: false },
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
  const [modalVisible, setModalVisible] = useState(false);
  const [subscription] = useState<ISubscription>(MOCK_SUBSCRIPTION);
  const [allChildren] = useState<IChildInfo[]>(MOCK_CHILDREN);
  const [subjects, setSubjects] = useState<ISubject[]>([]);

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
    // Ici, vous appelleriez votre API pour sauvegarder les matières
    console.log(
      `Matières sauvegardées pour l'enfant #${childId}:`,
      subjects.filter((s) => s.isSelected).map((s) => s.name)
    );

    Alert.alert(
      "Matières mises à jour",
      "Les matières ont été assignées avec succès.",
      [{ text: "OK", onPress: () => setModalVisible(false) }]
    );
  }, [childId, subjects]);

  // Afficher un message si aucun enfant correspondant n'est trouvé
  if (!currentChild) {
    return (
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Text style={[styles.errorText, { color: COLORS.black }]}>
          Enfant non trouvé. Veuillez vérifier l&apos;identifiant.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: COLORS.white }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: COLORS.black }]}>
          Matières
        </Text>
        <TouchableOpacity
          style={styles.manageButton}
          onPress={() => setModalVisible(true)}
        >
          <FontAwesomeIcon icon={faPlus} size={14} color={COLORS.white} />
          <Text style={styles.manageButtonText}>Gérer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <FontAwesomeIcon icon={faInfo} size={14} color={COLORS.gray} />
        <Text style={[styles.infoText, { color: COLORS.gray }]}>
          Votre abonnement {subscription.title} permet d&apos;assigner un total
          de {subscription.nbr_subjects} matières pour{" "}
          {subscription.nbr_children_access} enfants.
        </Text>
      </View>

      {!isCurrentChildWithinLimit && currentChild.subjectsAllocated === 0 ? (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            Cet enfant n&apos;est pas inclus dans votre limite d&apos;abonnement
            actuel ({subscription.nbr_children_access} enfants).
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.counterContainer}>
            <Text style={[styles.counter, { color: COLORS.gray }]}>
              {selectedCount} matières utilisées sur {subscription.nbr_subjects}{" "}
              disponibles
            </Text>
          </View>

          {selectedCount > 0 ? (
            <View style={styles.subjectsContainer}>
              {subjects
                .filter((s) => s.isSelected)
                .map((subject) => (
                  <View key={subject.id} style={styles.subjectTag}>
                    <FontAwesomeIcon
                      icon={faBook}
                      size={14}
                      color="#24D26D"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.subjectTagText}>{subject.name}</Text>
                  </View>
                ))}
            </View>
          ) : (
            <Text style={[styles.emptyText, { color: COLORS.gray }]}>
              Aucune matière assignée. Ajoutez des matières pour personnaliser
              l&apos;apprentissage.
            </Text>
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
          <View
            style={[styles.modalContent, { backgroundColor: COLORS.white }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: COLORS.black }]}>
                Gérer les matières
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <FontAwesomeIcon
                  icon={faTimes}
                  size={20}
                  color={COLORS.black}
                />
              </TouchableOpacity>
            </View>

            {!isCurrentChildWithinLimit &&
            currentChild.subjectsAllocated === 0 ? (
              <View style={styles.modalWarning}>
                <Text style={styles.modalWarningText}>
                  Vous avez atteint la limite de{" "}
                  {subscription.nbr_children_access} enfants de votre
                  abonnement. Veuillez mettre à niveau votre abonnement pour
                  ajouter plus d&apos;enfants.
                </Text>
              </View>
            ) : (
              <>
                <Text style={[styles.modalSubtitle, { color: COLORS.gray }]}>
                  Vous pouvez sélectionner jusqu&apos;à {remainingSubjects}{" "}
                  matières (sur {subscription.nbr_subjects} de votre
                  abonnement).
                </Text>

                <FlatList
                  data={subjects}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.subjectItem,
                        {
                          backgroundColor: item.isSelected
                            ? "rgba(36, 210, 109, 0.1)"
                            : COLORS.greyScale100,
                          borderColor: item.isSelected
                            ? "#24D26D"
                            : "transparent",
                        },
                      ]}
                      onPress={() => toggleSubject(item.id)}
                    >
                      <View style={styles.subjectItemContent}>
                        <FontAwesomeIcon
                          icon={faBook}
                          size={16}
                          color={item.isSelected ? "#24D26D" : COLORS.gray}
                        />
                        <Text
                          style={[
                            styles.subjectItemText,
                            { color: COLORS.black },
                          ]}
                        >
                          {item.name}
                        </Text>
                      </View>

                      {item.isSelected && (
                        <FontAwesomeIcon
                          icon={faCheck}
                          size={16}
                          color="#24D26D"
                        />
                      )}
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.subjectsList}
                />

                <View style={styles.allocationInfo}>
                  <Text
                    style={[styles.allocationInfoText, { color: COLORS.gray }]}
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
                    borderColor: "rgba(0,0,0,0.1)",
                  },
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text
                  style={[styles.cancelButtonText, { color: COLORS.black }]}
                >
                  Annuler
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  !isCurrentChildWithinLimit &&
                  currentChild.subjectsAllocated === 0
                    ? styles.disabledButton
                    : {},
                ]}
                onPress={saveChanges}
                disabled={
                  !isCurrentChildWithinLimit &&
                  currentChild.subjectsAllocated === 0
                }
              >
                <Text style={styles.saveButtonText}>Enregistrer</Text>
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "bold",
  },
  manageButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  manageButtonText: {
    color: COLORS.white,
    marginLeft: 5,
    fontSize: 14,
    fontFamily: "medium",
  },
  infoContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    alignItems: "flex-start",
  },
  infoText: {
    fontSize: 12,
    fontFamily: "regular",
    marginLeft: 8,
    flex: 1,
  },
  warningContainer: {
    backgroundColor: "rgba(255, 90, 90, 0.1)",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  warningText: {
    color: "#FF5A5A",
    fontSize: 14,
    fontFamily: "medium",
  },
  counterContainer: {
    marginBottom: 15,
  },
  counter: {
    fontSize: 14,
    fontFamily: "regular",
  },
  subjectsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  subjectTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(36, 210, 109, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  subjectTagText: {
    color: "#24D26D",
    fontSize: 14,
    fontFamily: "medium",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "regular",
    fontStyle: "italic",
  },
  errorText: {
    fontSize: 16,
    fontFamily: "medium",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "bold",
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  modalWarning: {
    backgroundColor: "rgba(255, 90, 90, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  modalWarningText: {
    color: "#FF5A5A",
    fontSize: 14,
    fontFamily: "medium",
  },
  subjectsList: {
    paddingBottom: 20,
  },
  subjectItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  subjectItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  subjectItemText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "medium",
  },
  allocationInfo: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  allocationInfoText: {
    fontSize: 12,
    fontFamily: "italic",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: "medium",
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "medium",
  },
});

export default ChildSubjectsManager;
