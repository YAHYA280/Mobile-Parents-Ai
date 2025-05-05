import type { NavigationProp } from "@react-navigation/native";

import React, { useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBook,
  faSave,
  faTimes,
  faCheck,
  faChild,
} from "@fortawesome/free-solid-svg-icons";
import {
  View,
  Text,
  Modal,
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";

import { COLORS } from "../constants/theme";
import { useTheme } from "../theme/ThemeProvider";

// Structure pour une matière
export type ISubject = {
  id: string;
  name: string;
  isSelected: boolean;
};

// Structure pour un enfant
export type IChild = {
  id: number;
  name: string;
  subjects: ISubject[];
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
const MOCK_SUBSCRIPTION = {
  id: "premium123",
  nbr_children_access: 3, // Nombre d'enfants max autorisés
  nbr_subjects: 8, // Nombre total de matières à répartir
  title: "Premium",
};

// Données des enfants (à remplacer par une vraie API)
const MOCK_CHILDREN: IChild[] = [
  { id: 1, name: "Emma", subjects: [] },
  { id: 2, name: "Lucas", subjects: [] },
  { id: 3, name: "Chloé", subjects: [] },
];

interface SubscriptionManagerProps {
  // Vous pourriez passer l'ID du parent ou autre information nécessaire
}

const SubscriptionManagerChildren: React.FC<SubscriptionManagerProps> = () => {
  const { dark } = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const [subscription] = useState(MOCK_SUBSCRIPTION);
  const [children, setChildren] = useState<IChild[]>(MOCK_CHILDREN);
  const [currentChildId, setCurrentChildId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [availableSubjects, setAvailableSubjects] = useState<ISubject[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Calcul du nombre total de matières sélectionnées pour tous les enfants
  const totalSubjectsSelected = children.reduce(
    (sum, child) => sum + child.subjects.filter((s) => s.isSelected).length,
    0
  );

  const remainingSubjectsToAllocate =
    subscription.nbr_subjects - totalSubjectsSelected;

  // Trouver l'enfant actuel quand currentChildId change
  const currentChild = children.find((child) => child.id === currentChildId);

  // Fonction pour effectuer la sauvegarde vers l'API
  const performSave = useCallback(async () => {
    try {
      setIsSaving(true);

      // Simuler un appel API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Ici, vous feriez votre appel API réel
      // Exemple: await api.saveChildrenSubjects(children);

      console.log("Données sauvegardées:", children);

      Alert.alert(
        "Sauvegarde réussie",
        "Les matières ont été correctement assignées à vos enfants.",
        [
          {
            text: "OK",
            onPress: () => {
              // Rediriger vers l'espace enfants
              navigation.navigate("(tabs)");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      Alert.alert(
        "Erreur",
        "Une erreur s'est produite lors de la sauvegarde. Veuillez réessayer."
      );
    } finally {
      setIsSaving(false);
    }
  }, [children, navigation]);

  // Ouvrir le modal pour gérer les matières d'un enfant
  const openSubjectsModal = useCallback(
    (childId: number) => {
      const child = children.find((c) => c.id === childId);
      if (!child) return;

      // Initialiser les matières disponibles avec celles déjà sélectionnées par l'enfant
      const childSubjects =
        child.subjects.length > 0
          ? [...child.subjects]
          : AVAILABLE_SUBJECTS.map((s) => ({ ...s, isSelected: false }));

      setAvailableSubjects(childSubjects);
      setCurrentChildId(childId);
      setModalVisible(true);
    },
    [children]
  );

  // Basculer la sélection d'une matière
  const toggleSubject = useCallback(
    (subjectId: string) => {
      if (!currentChild) return;

      setAvailableSubjects((currentSubjects) => {
        const subject = currentSubjects.find((s) => s.id === subjectId);
        if (!subject) return currentSubjects;

        // Si la matière est déjà sélectionnée, on peut toujours la désélectionner
        if (subject.isSelected) {
          return currentSubjects.map((s) =>
            s.id === subjectId ? { ...s, isSelected: false } : s
          );
        }

        // Calculer combien de matières sont déjà sélectionnées par tous les enfants
        const currentChildSelectedCount = currentSubjects.filter(
          (s) => s.isSelected
        ).length;

        // Calcul du nombre de matières sélectionnées par les autres enfants
        const otherChildrenSelectedCount = children.reduce(
          (sum, child) =>
            child.id !== currentChildId
              ? sum + child.subjects.filter((s) => s.isSelected).length
              : sum,
          0
        );

        // Vérifier si l'ajout de cette matière dépasserait la limite de l'abonnement
        if (
          otherChildrenSelectedCount + currentChildSelectedCount + 1 >
          subscription.nbr_subjects
        ) {
          Alert.alert(
            "Limite atteinte",
            `Votre abonnement permet un maximum de ${subscription.nbr_subjects} matières au total. Vous ne pouvez pas en ajouter davantage.`,
            [{ text: "OK" }]
          );
          return currentSubjects;
        }

        return currentSubjects.map((s) =>
          s.id === subjectId ? { ...s, isSelected: true } : s
        );
      });
    },
    [currentChild, currentChildId, children, subscription.nbr_subjects]
  );

  // Sauvegarder les matières sélectionnées pour l'enfant actuel
  const saveSubjectsChanges = useCallback(() => {
    if (!currentChild) return;

    setChildren((currentChildren) => {
      return currentChildren.map((child) => {
        if (child.id === currentChildId) {
          return {
            ...child,
            subjects: availableSubjects,
          };
        }
        return child;
      });
    });

    Alert.alert(
      "Matières mises à jour",
      `Les matières de ${currentChild.name} ont été assignées avec succès.`,
      [{ text: "OK", onPress: () => setModalVisible(false) }]
    );
  }, [currentChild, currentChildId, availableSubjects]);

  // Sauvegarder toutes les modifications et naviguer vers l'espace enfants
  const saveAllChangesAndNavigate = useCallback(() => {
    // Vérifier si l'utilisateur a alloué toutes les matières disponibles
    if (remainingSubjectsToAllocate > 0) {
      Alert.alert(
        "Matières non allouées",
        `Il vous reste ${remainingSubjectsToAllocate} matières à allouer. Souhaitez-vous continuer quand même ?`,
        [
          { text: "Annuler", style: "cancel" },
          { text: "Continuer", onPress: performSave },
        ]
      );
    } else {
      performSave();
    }
  }, [remainingSubjectsToAllocate, performSave]);

  return (
    <SafeAreaView
      style={[
        styles.area,
        { backgroundColor: dark ? COLORS.black : COLORS.white },
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, margin: 12, marginTop: 33 }}>
            <View>
              <Text style={{ fontSize: 24 }}>Gérer mon abonnement</Text>
            </View>

            <View style={styles.infoRow}>
              <Text
                style={[
                  styles.infoText,
                  { color: dark ? COLORS.secondaryWhite : COLORS.gray },
                ]}
              >
                Enfants: {children.length}/{subscription.nbr_children_access}
              </Text>
              <Text
                style={[
                  styles.infoText,
                  { color: dark ? COLORS.secondaryWhite : COLORS.gray },
                ]}
              >
                Matières: {totalSubjectsSelected}/{subscription.nbr_subjects}
              </Text>
              {remainingSubjectsToAllocate > 0 && (
                <Text style={[styles.warningText, { color: "#FFA500" }]}>
                  {remainingSubjectsToAllocate} matières non allouées
                </Text>
              )}
            </View>

            <Text
              style={[
                styles.childrenTitle,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Mes enfants
            </Text>

            {children.map((child) => (
              <View key={child.id} style={styles.childCard}>
                <View style={styles.childInfo}>
                  <FontAwesomeIcon
                    icon={faChild}
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.childName}>{child.name}</Text>
                  <Text style={styles.childSubjectsCount}>
                    {child.subjects.filter((s) => s.isSelected).length} matières
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.manageButton}
                  onPress={() => openSubjectsModal(child.id)}
                >
                  <Text style={styles.manageButtonText}>Gérer</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Bouton de sauvegarde globale */}
            <TouchableOpacity
              style={[styles.saveAllButton, isSaving && { opacity: 0.7 }]}
              onPress={saveAllChangesAndNavigate}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faSave}
                    size={18}
                    color={COLORS.white}
                  />
                  <Text style={styles.saveAllButtonText}>Enregistrer</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Modal pour gérer les matières d'un enfant */}
            <Modal
              animationType="slide"
              transparent
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View
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
                      Matières de {currentChild?.name}
                    </Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <FontAwesomeIcon
                        icon={faTimes}
                        size={20}
                        color={dark ? COLORS.white : COLORS.black}
                      />
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={[
                      styles.modalSubtitle,
                      { color: dark ? COLORS.secondaryWhite : COLORS.gray },
                    ]}
                  >
                    Sélectionnez des matières pour {currentChild?.name}
                    {remainingSubjectsToAllocate > 0 && (
                      <Text style={{ color: "#FFA500" }}>
                        {" "}
                        (Reste {remainingSubjectsToAllocate} sur{" "}
                        {subscription.nbr_subjects})
                      </Text>
                    )}
                  </Text>

                  <FlatList
                    data={availableSubjects}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.subjectItem,
                          {
                            backgroundColor: item.isSelected
                              ? "rgba(36, 210, 109, 0.1)"
                              : dark
                                ? COLORS.dark2
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
                            color={
                              item.isSelected
                                ? "#24D26D"
                                : dark
                                  ? COLORS.white
                                  : COLORS.gray
                            }
                          />
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

                  <View style={styles.modalFooter}>
                    <TouchableOpacity
                      style={[
                        styles.cancelButton,
                        {
                          borderColor: dark
                            ? "rgba(255,255,255,0.2)"
                            : "rgba(0,0,0,0.1)",
                        },
                      ]}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text
                        style={[
                          styles.cancelButtonText,
                          { color: dark ? COLORS.white : COLORS.black },
                        ]}
                      >
                        Annuler
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={saveSubjectsChanges}
                    >
                      <Text style={styles.saveButtonText}>Enregistrer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
    marginVertical: 22,
  },
  infoText: {
    fontSize: 14,
    fontFamily: "medium",
    marginRight: 15,
  },
  warningText: {
    fontSize: 14,
    fontFamily: "medium",
    fontStyle: "italic",
  },
  childrenTitle: {
    fontSize: 16,
    fontFamily: "bold",
    marginBottom: 10,
  },
  childCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(36, 210, 109, 0.05)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  childInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  childName: {
    fontSize: 15,
    fontFamily: "medium",
    color: COLORS.black,
    marginLeft: 10,
  },
  childSubjectsCount: {
    fontSize: 13,
    fontFamily: "regular",
    color: COLORS.gray,
    marginLeft: 10,
  },
  manageButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },
  manageButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontFamily: "medium",
  },
  saveAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
    marginBottom: 40,
  },
  saveAllButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "bold",
    marginLeft: 10,
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
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "medium",
  },
});

export default SubscriptionManagerChildren;
