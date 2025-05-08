import React, { useState, useEffect, useCallback } from "react";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  Modal,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  ActivityIndicator,
  Dimensions,
} from "react-native";

import { COLORS } from "../../constants/theme";
import { useTheme } from "../../theme/ThemeProvider";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Structure for a subject
export type ISubject = {
  id: string;
  name: string;
  isSelected: boolean;
  icon?: string;
  description?: string;
};

// Structure for subscription
export type ISubscription = {
  id: string;
  title: string;
  nbr_children_access: number; // Max number of children
  nbr_subjects: number; // Total number of subjects
};

// Structure for a child
export type IChildInfo = {
  id: number;
  name: string;
  subjectsAllocated: number; // Number of subjects allocated to this child
};

// Subject icons mapping
const SUBJECT_ICONS: { [key: string]: string } = {
  Mathématiques: "calculator-outline",
  Français: "book-outline",
  "Histoire-Géographie": "globe-outline",
  Sciences: "flask-outline",
  Anglais: "language-outline",
  "Arts plastiques": "color-palette-outline",
  Musique: "musical-notes-outline",
  "Éducation physique": "fitness-outline",
  Informatique: "hardware-chip-outline",
  "Physique-Chimie": "flask-outline",
  SVT: "leaf-outline",
  Philosophie: "school-outline",
  Économie: "cash-outline",
};

// Subject colors mapping
const SUBJECT_COLORS: { [key: string]: [string, string] } = {
  Mathématiques: ["#2196F3", "#1565C0"],
  Français: ["#4CAF50", "#2E7D32"],
  "Histoire-Géographie": ["#FF9800", "#F57C00"],
  Sciences: ["#9C27B0", "#7B1FA2"],
  Anglais: ["#F44336", "#C62828"],
  "Arts plastiques": ["#E91E63", "#AD1457"],
  Musique: ["#673AB7", "#4527A0"],
  "Éducation physique": ["#FF5722", "#D84315"],
  Informatique: ["#607D8B", "#455A64"],
  "Physique-Chimie": ["#00BCD4", "#00838F"],
  SVT: ["#8BC34A", "#558B2F"],
  Philosophie: ["#795548", "#4E342E"],
  Économie: ["#009688", "#00695C"],
};

// Mock available subjects
const AVAILABLE_SUBJECTS: ISubject[] = [
  {
    id: "1",
    name: "Mathématiques",
    isSelected: false,
    description: "Algèbre, géométrie, statistiques et plus",
  },
  {
    id: "2",
    name: "Français",
    isSelected: false,
    description: "Grammaire, orthographe, littérature et expression écrite",
  },
  {
    id: "3",
    name: "Histoire-Géographie",
    isSelected: false,
    description: "Histoire du monde et géographie",
  },
  {
    id: "4",
    name: "Sciences",
    isSelected: false,
    description: "Physique, chimie et sciences de la vie",
  },
  {
    id: "5",
    name: "Anglais",
    isSelected: false,
    description: "Grammaire, vocabulaire et conversation",
  },
  {
    id: "6",
    name: "Arts plastiques",
    isSelected: false,
    description: "Dessin, peinture et arts visuels",
  },
  {
    id: "7",
    name: "Musique",
    isSelected: false,
    description: "Théorie musicale et histoire de la musique",
  },
  {
    id: "8",
    name: "Éducation physique",
    isSelected: false,
    description: "Sports et activité physique",
  },
  {
    id: "9",
    name: "Informatique",
    isSelected: false,
    description: "Programmation et principes d'informatique",
  },
  {
    id: "10",
    name: "Physique-Chimie",
    isSelected: false,
    description: "Lois physiques et réactions chimiques",
  },
  {
    id: "11",
    name: "SVT",
    isSelected: false,
    description: "Sciences de la vie et de la Terre",
  },
  {
    id: "12",
    name: "Philosophie",
    isSelected: false,
    description: "Pensée critique et grands courants philosophiques",
  },
  {
    id: "13",
    name: "Économie",
    isSelected: false,
    description: "Principes économiques et finance",
  },
];

// Mock subscription
const MOCK_SUBSCRIPTION: ISubscription = {
  id: "premium123",
  title: "Premium",
  nbr_children_access: 3, // Max number of children
  nbr_subjects: 8, // Total number of subjects
};

// Mock children data
const MOCK_CHILDREN: IChildInfo[] = [
  { id: 1, name: "Emma", subjectsAllocated: 3 },
  { id: 2, name: "Lucas", subjectsAllocated: 3 },
  { id: 3, name: "Chloé", subjectsAllocated: 2 },
];

// Mock selected subjects
const MOCK_SELECTED_SUBJECTS = ["1", "3", "5"]; // IDs of selected subjects

interface ChildSubjectsManagerProps {
  childId: number; // Current child ID
}

const EnhancedSubjectsManager: React.FC<ChildSubjectsManagerProps> = ({
  childId,
}) => {
  const { dark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [subscription] = useState<ISubscription>(MOCK_SUBSCRIPTION);
  const [allChildren] = useState<IChildInfo[]>(MOCK_CHILDREN);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAdvancedSettings, setIsAdvancedSettings] = useState(false);
  const [isAutoDistribute, setIsAutoDistribute] = useState(false);

  // Find current child
  const currentChild = allChildren.find((child) => child.id === childId);

  // Consider only children within subscription limit
  const childrenWithinLimit = allChildren.slice(
    0,
    subscription.nbr_children_access
  );

  // Check if current child is within subscription limit
  const isCurrentChildWithinLimit = childrenWithinLimit.some(
    (child) => child.id === childId
  );

  // Calculate how many subjects are already used by other children
  const otherChildrenSubjects = childrenWithinLimit.reduce(
    (sum, child) => sum + (child.id !== childId ? child.subjectsAllocated : 0),
    0
  );

  // Initialize subjects with already selected ones
  useEffect(() => {
    setLoadingSubjects(true);
    // Simulate delay for loading animation
    setTimeout(() => {
      // Create a copy of available subjects
      const initialSubjects = AVAILABLE_SUBJECTS.map((subject) => ({
        ...subject,
        isSelected: MOCK_SELECTED_SUBJECTS.includes(subject.id),
        icon: SUBJECT_ICONS[subject.name] || "book-outline",
      }));

      setSubjects(initialSubjects);
      setLoadingSubjects(false);
    }, 800);
  }, []);

  // Count selected subjects for this child
  const selectedCount = subjects.filter((subject) => subject.isSelected).length;

  // Calculate remaining subjects
  const remainingSubjects = subscription.nbr_subjects - otherChildrenSubjects;

  // Filter subjects based on search query and category
  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (subject.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      (selectedCategory === "selected" && subject.isSelected) ||
      (selectedCategory === "unselected" && !subject.isSelected);

    return matchesSearch && matchesCategory;
  });

  // Group subjects by category for displaying in sections
  const getSubjectsByCategory = () => {
    const categories: { [key: string]: ISubject[] } = {};

    filteredSubjects.forEach((subject) => {
      // Simplified categorization based on subject name
      let category = subject.name.split(" ")[0]; // Take first word as category

      // Some special cases
      if (subject.name.includes("Mathématiques")) category = "Mathématiques";
      if (
        subject.name.includes("Histoire") ||
        subject.name.includes("Géographie")
      )
        category = "Histoire-Géo";
      if (
        subject.name.includes("Science") ||
        subject.name.includes("SVT") ||
        subject.name.includes("Physique")
      )
        category = "Sciences";
      if (
        subject.name.includes("Langue") ||
        subject.name.includes("Anglais") ||
        subject.name.includes("Français")
      )
        category = "Langues";
      if (subject.name.includes("Art") || subject.name.includes("Musique"))
        category = "Arts";

      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(subject);
    });

    return categories;
  };

  const toggleSubject = useCallback(
    (id: string) => {
      // If child is not within subscription limit, show error message
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
            // If subject is already selected, we can always deselect it
            if (subject.isSelected) {
              return { ...subject, isSelected: false };
            }

            // If trying to select a new subject but reached the total limit
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
    // Here you would call your API to save subjects
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

  // Auto-distribute subjects (advanced feature)
  const handleAutoDistribute = () => {
    Alert.alert(
      "Distribution automatique",
      "Cette fonction va répartir automatiquement les matières disponibles entre tous les enfants en fonction de leur âge et niveau. Continuer ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Continuer",
          onPress: () => {
            // Simulate auto-distribution
            const newSubjects = [...subjects];
            // Reset all selections
            newSubjects.forEach((subject) => {
              subject.isSelected = false;
            });

            // Select some subjects for demo
            const subjectCount = Math.min(3, remainingSubjects);
            for (let i = 0; i < subjectCount; i++) {
              const randomIndex = Math.floor(
                Math.random() * newSubjects.length
              );
              newSubjects[randomIndex].isSelected = true;
            }

            setSubjects(newSubjects);
            Alert.alert(
              "Distribution terminée",
              `${subjectCount} matières ont été attribuées automatiquement.`
            );
          },
        },
      ]
    );
  };

  // Toggle details view
  const toggleDetailsView = () => {
    setShowAllDetails(!showAllDetails);
  };

  // Display error if no child found
  if (!currentChild) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: dark ? COLORS.black : COLORS.white },
        ]}
      >
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
          style={styles.errorContainer}
        >
          <Ionicons
            name="alert-circle-outline"
            size={60}
            color={dark ? COLORS.white : COLORS.black}
          />
          <Text
            style={[
              styles.errorText,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Enfant non trouvé. Veuillez vérifier l'identifiant.
          </Text>
        </MotiView>
      </View>
    );
  }

  // Get colors for the progress bar
  const getProgressColor = (percentage: number) => {
    if (percentage > 90) return ["#FF3B30", "#FF6B66"]; // Red (almost full)
    if (percentage > 75) return ["#FF9500", "#FFCA7A"]; // Orange
    if (percentage > 50) return ["#FFCC00", "#FFE066"]; // Yellow
    return ["#34C759", "#77E697"]; // Green (plenty of space)
  };

  // Calculate percentage of used subjects
  const usedPercentage = (selectedCount / subscription.nbr_subjects) * 100;
  const progressColors = getProgressColor(usedPercentage);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: dark ? COLORS.black : COLORS.white },
      ]}
    >
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "spring", damping: 18 }}
      >
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.sectionTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Matières
          </Text>
          <TouchableOpacity
            style={styles.manageButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add-outline" size={18} color={COLORS.white} />
            <Text style={styles.manageButtonText}>Gérer</Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.infoContainer,
            {
              backgroundColor: dark
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.03)",
            },
          ]}
        >
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={dark ? COLORS.secondaryWhite : COLORS.gray}
            style={styles.infoIcon}
          />
          <Text
            style={[
              styles.infoText,
              { color: dark ? COLORS.secondaryWhite : COLORS.gray },
            ]}
          >
            Votre abonnement {subscription.title} permet d'assigner un total de{" "}
            {subscription.nbr_subjects} matières pour{" "}
            {subscription.nbr_children_access} enfants.
          </Text>
        </View>

        {!isCurrentChildWithinLimit && currentChild.subjectsAllocated === 0 ? (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "spring", damping: 15, delay: 300 }}
            style={styles.warningContainer}
          >
            <Ionicons
              name="warning-outline"
              size={24}
              color="#FF3B30"
              style={styles.warningIcon}
            />
            <Text style={styles.warningText}>
              Cet enfant n'est pas inclus dans votre limite d'abonnement actuel
              ({subscription.nbr_children_access} enfants).
            </Text>
          </MotiView>
        ) : (
          <>
            <MotiView
              from={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ type: "timing", duration: 500 }}
              style={styles.progressSection}
            >
              <View style={styles.progressHeader}>
                <Text
                  style={[
                    styles.progressTitle,
                    { color: dark ? COLORS.secondaryWhite : COLORS.gray },
                  ]}
                >
                  Matières utilisées
                </Text>
                <Text
                  style={[
                    styles.progressCounter,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  {selectedCount} / {subscription.nbr_subjects}
                </Text>
              </View>

              <View
                style={[
                  styles.progressBarContainer,
                  {
                    backgroundColor: dark
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.05)",
                  },
                ]}
              >
                <LinearGradient
                  colors={progressColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.progressBar,
                    {
                      width: `${Math.min(100, (selectedCount / subscription.nbr_subjects) * 100)}%`,
                    },
                  ]}
                />
              </View>
            </MotiView>

            {selectedCount > 0 ? (
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "spring", damping: 15, delay: 400 }}
                style={styles.subjectsContainer}
              >
                <View style={styles.subjectsHeaderRow}>
                  <Text
                    style={[
                      styles.subjectsSubtitle,
                      { color: dark ? COLORS.white : COLORS.black },
                    ]}
                  >
                    Matières assignées
                  </Text>
                  <TouchableOpacity onPress={toggleDetailsView}>
                    <Text style={{ color: COLORS.primary, fontSize: 14 }}>
                      {showAllDetails ? "Masquer détails" : "Voir détails"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.selectedSubjectsGrid}>
                  {subjects
                    .filter((s) => s.isSelected)
                    .map((subject) => (
                      <View
                        key={subject.id}
                        style={[
                          styles.subjectCard,
                          {
                            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                          },
                        ]}
                      >
                        <LinearGradient
                          colors={
                            SUBJECT_COLORS[subject.name] || [
                              "#607D8B",
                              "#455A64",
                            ]
                          }
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.subjectIconContainer}
                        >
                          <Ionicons
                            name={(subject.icon as any) || "book-outline"}
                            size={20}
                            color="#FFFFFF"
                          />
                        </LinearGradient>

                        <View style={styles.subjectContent}>
                          <Text
                            style={[
                              styles.subjectName,
                              { color: dark ? COLORS.white : COLORS.black },
                            ]}
                          >
                            {subject.name}
                          </Text>

                          {showAllDetails && subject.description && (
                            <Text
                              style={[
                                styles.subjectDescription,
                                {
                                  color: dark
                                    ? COLORS.secondaryWhite
                                    : COLORS.gray3,
                                },
                              ]}
                              numberOfLines={2}
                            >
                              {subject.description}
                            </Text>
                          )}
                        </View>
                      </View>
                    ))}
                </View>
              </MotiView>
            ) : (
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "spring", damping: 15, delay: 400 }}
                style={styles.emptyStateContainer}
              >
                <Ionicons
                  name="book-outline"
                  size={48}
                  color={dark ? COLORS.secondaryWhite : COLORS.gray3}
                />
                <Text
                  style={[
                    styles.emptyText,
                    { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                  ]}
                >
                  Aucune matière assignée. Ajoutez des matières pour
                  personnaliser l'apprentissage.
                </Text>
                <TouchableOpacity
                  style={styles.emptyAddButton}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.emptyAddButtonText}>
                    Ajouter des matières
                  </Text>
                </TouchableOpacity>
              </MotiView>
            )}
          </>
        )}
      </MotiView>

      {/* Subjects Management Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
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
                Gérer les matières
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
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
                <Ionicons
                  name="warning-outline"
                  size={24}
                  color="#FF3B30"
                  style={styles.warningIcon}
                />
                <Text style={styles.modalWarningText}>
                  Vous avez atteint la limite de{" "}
                  {subscription.nbr_children_access} enfants de votre
                  abonnement. Veuillez mettre à niveau votre abonnement pour
                  ajouter plus d'enfants.
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.searchBarContainer}>
                  <View
                    style={[
                      styles.searchBar,
                      {
                        backgroundColor: dark
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.05)",
                      },
                    ]}
                  >
                    <Ionicons
                      name="search-outline"
                      size={20}
                      color={dark ? COLORS.secondaryWhite : COLORS.gray}
                    />
                    <TextInput
                      style={[
                        styles.searchInput,
                        { color: dark ? COLORS.white : COLORS.black },
                      ]}
                      placeholder="Rechercher une matière..."
                      placeholderTextColor={
                        dark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.3)"
                      }
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <Ionicons
                          name="close-circle"
                          size={20}
                          color={dark ? COLORS.secondaryWhite : COLORS.gray}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <View style={styles.filterChipsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      selectedCategory === null && styles.activeFilterChip,
                    ]}
                    onPress={() => setSelectedCategory(null)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedCategory === null &&
                          styles.activeFilterChipText,
                      ]}
                    >
                      Toutes
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      selectedCategory === "selected" &&
                        styles.activeFilterChip,
                    ]}
                    onPress={() => setSelectedCategory("selected")}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedCategory === "selected" &&
                          styles.activeFilterChipText,
                      ]}
                    >
                      Sélectionnées ({selectedCount})
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      selectedCategory === "unselected" &&
                        styles.activeFilterChip,
                    ]}
                    onPress={() => setSelectedCategory("unselected")}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedCategory === "unselected" &&
                          styles.activeFilterChipText,
                      ]}
                    >
                      Non sélectionnées
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text
                  style={[
                    styles.modalSubtitle,
                    { color: dark ? COLORS.secondaryWhite : COLORS.gray },
                  ]}
                >
                  Vous pouvez sélectionner jusqu'à {remainingSubjects} matières
                  (sur {subscription.nbr_subjects} de votre abonnement).
                </Text>

                {loadingSubjects ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text
                      style={[
                        styles.loadingText,
                        { color: dark ? COLORS.white : COLORS.black },
                      ]}
                    >
                      Chargement des matières...
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={filteredSubjects}
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
                          <View
                            style={[
                              styles.subjectItemIconContainer,
                              {
                                backgroundColor: item.isSelected
                                  ? "rgba(36, 210, 109, 0.2)"
                                  : dark
                                    ? "rgba(255, 255, 255, 0.1)"
                                    : "rgba(0, 0, 0, 0.05)",
                              },
                            ]}
                          >
                            <Ionicons
                              name={(item.icon as any) || "book-outline"}
                              size={20}
                              color={
                                item.isSelected
                                  ? "#24D26D"
                                  : dark
                                    ? COLORS.white
                                    : COLORS.gray
                              }
                            />
                          </View>
                          <View style={styles.subjectItemTextContainer}>
                            <Text
                              style={[
                                styles.subjectItemName,
                                { color: dark ? COLORS.white : COLORS.black },
                              ]}
                            >
                              {item.name}
                            </Text>
                            {item.description && (
                              <Text
                                style={[
                                  styles.subjectItemDescription,
                                  {
                                    color: dark
                                      ? COLORS.secondaryWhite
                                      : COLORS.gray3,
                                  },
                                ]}
                                numberOfLines={2}
                              >
                                {item.description}
                              </Text>
                            )}
                          </View>
                        </View>

                        {item.isSelected && (
                          <Ionicons
                            name="checkmark-circle"
                            size={24}
                            color="#24D26D"
                          />
                        )}
                      </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.subjectsList}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                      <View style={styles.emptyListContainer}>
                        <Ionicons
                          name="search"
                          size={48}
                          color={dark ? COLORS.secondaryWhite : COLORS.gray3}
                        />
                        <Text
                          style={[
                            styles.emptyListText,
                            {
                              color: dark
                                ? COLORS.secondaryWhite
                                : COLORS.gray3,
                            },
                          ]}
                        >
                          Aucune matière trouvée pour "{searchQuery}"
                        </Text>
                      </View>
                    }
                  />
                )}

                <TouchableOpacity
                  style={styles.settingsTrigger}
                  onPress={() => setIsAdvancedSettings(!isAdvancedSettings)}
                >
                  <Ionicons
                    name={isAdvancedSettings ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.settingsTriggerText}>
                    {isAdvancedSettings
                      ? "Masquer les paramètres avancés"
                      : "Paramètres avancés"}
                  </Text>
                </TouchableOpacity>

                {isAdvancedSettings && (
                  <MotiView
                    from={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ type: "timing", duration: 300 }}
                    style={styles.advancedSettings}
                  >
                    <View style={styles.switchRow}>
                      <View style={styles.switchTextContainer}>
                        <Text
                          style={[
                            styles.switchTitle,
                            { color: dark ? COLORS.white : COLORS.black },
                          ]}
                        >
                          Distribution automatique
                        </Text>
                        <Text
                          style={[
                            styles.switchDescription,
                            {
                              color: dark
                                ? COLORS.secondaryWhite
                                : COLORS.gray3,
                            },
                          ]}
                        >
                          Attribuer automatiquement des matières selon l'âge et
                          le niveau
                        </Text>
                      </View>
                      <Switch
                        value={isAutoDistribute}
                        onValueChange={setIsAutoDistribute}
                        trackColor={{ false: "#767577", true: "#34C759" }}
                        thumbColor="#FFFFFF"
                      />
                    </View>

                    {isAutoDistribute && (
                      <TouchableOpacity
                        style={styles.distributeButton}
                        onPress={handleAutoDistribute}
                      >
                        <Ionicons
                          name="flash-outline"
                          size={18}
                          color="#FFFFFF"
                          style={styles.distributeIcon}
                        />
                        <Text style={styles.distributeText}>
                          Lancer la distribution
                        </Text>
                      </TouchableOpacity>
                    )}
                  </MotiView>
                )}

                <View style={styles.allocationInfo}>
                  <Ionicons
                    name="bulb-outline"
                    size={20}
                    color={dark ? COLORS.secondaryWhite : COLORS.gray}
                    style={styles.allocationInfoIcon}
                  />
                  <Text
                    style={[
                      styles.allocationInfoText,
                      { color: dark ? COLORS.secondaryWhite : COLORS.gray },
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
          </MotiView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  manageButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  manageButtonText: {
    color: COLORS.white,
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  infoContainer: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: "flex-start",
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  warningContainer: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  warningIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  warningText: {
    color: "#FF3B30",
    fontSize: 14,
    flex: 1,
    fontWeight: "500",
    lineHeight: 20,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
  },
  progressCounter: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressBarContainer: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 5,
  },
  subjectsContainer: {
    marginBottom: 16,
  },
  subjectsHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  subjectsSubtitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  selectedSubjectsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  subjectCard: {
    width: SCREEN_WIDTH > 400 ? "48%" : "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  subjectIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  subjectContent: {
    flex: 1,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  subjectDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  subjectTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(36, 210, 109, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  subjectTagText: {
    color: "#24D26D",
    fontSize: 14,
    fontWeight: "500",
  },
  emptyStateContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 12,
    padding: 24,
    marginVertical: 16,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 24,
    lineHeight: 20,
  },
  emptyAddButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  emptyAddButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 22,
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
    borderRadius: 20,
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
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  modalWarning: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  modalWarningText: {
    color: "#FF3B30",
    fontSize: 14,
    flex: 1,
    fontWeight: "500",
    lineHeight: 20,
  },
  searchBarContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterChipsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  activeFilterChip: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 14,
  },
  activeFilterChipText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  subjectsList: {
    paddingBottom: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
  },
  subjectItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  subjectItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  subjectItemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  subjectItemTextContainer: {
    flex: 1,
  },
  subjectItemName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  subjectItemDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  emptyListContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyListText: {
    marginTop: 16,
    fontSize: 14,
    textAlign: "center",
  },
  settingsTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    marginVertical: 8,
  },
  settingsTriggerText: {
    marginLeft: 8,
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  advancedSettings: {
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  switchTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  distributeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  distributeIcon: {
    marginRight: 8,
  },
  distributeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  allocationInfo: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  allocationInfoIcon: {
    marginRight: 8,
  },
  allocationInfoText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EnhancedSubjectsManager;
