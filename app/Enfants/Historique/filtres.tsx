// app/Enfants/Historique/filtres.tsx
import React from "react";
import { Calendar } from "react-native-calendars";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  View,
  Text,
  Modal,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import {
  faSync,
  faSearch,
  faCalendar,
  faTimesCircle,
  faCheck,
  faChevronRight,
  faBook,
  faChalkboardTeacher,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

import type { Activity } from "../../../data/Enfants/CHILDREN_DATA";

import { COLORS } from "../../../constants/theme";

// Définition des interfaces pour les thèmes
interface AssistantThemeType {
  colors: readonly [string, string, ...string[]];
  icon: any;
}

interface SubjectThemeType {
  colors: readonly [string, string, ...string[]];
  icon: any;
}

// Thèmes pour les assistants
export const ASSISTANT_THEME: {
  "J'Apprends": AssistantThemeType;
  Recherche: AssistantThemeType;
  Accueil: AssistantThemeType;
  Autre: AssistantThemeType;
  [key: string]: AssistantThemeType;
} = {
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
    icon: faBook,
  },
  Autre: {
    colors: ["#9C27B0", "#7B1FA2"],
    icon: faFilter,
  },
};

// Thèmes pour les matières
export const SUBJECT_THEME: {
  Mathématiques: SubjectThemeType;
  Français: SubjectThemeType;
  Sciences: SubjectThemeType;
  Histoire: SubjectThemeType;
  Anglais: SubjectThemeType;
  Autre: SubjectThemeType;
  [key: string]: SubjectThemeType;
} = {
  Mathématiques: {
    colors: ["#E91E63", "#C2185B"],
    icon: faBook,
  },
  Français: {
    colors: ["#3F51B5", "#303F9F"],
    icon: faBook,
  },
  Sciences: {
    colors: ["#009688", "#00796B"],
    icon: faBook,
  },
  Histoire: {
    colors: ["#795548", "#5D4037"],
    icon: faBook,
  },
  Anglais: {
    colors: ["#673AB7", "#512DA8"],
    icon: faBook,
  },
  Autre: {
    colors: ["#607D8B", "#455A64"],
    icon: faBook,
  },
};

// Function to get progress color
function getProgressColor(progress: number) {
  if (progress < 30) return "#FC4E00"; // Rouge
  if (progress <= 50) return "#EBB016"; // Orange
  if (progress <= 70) return "#F3BB00"; // Jaune
  return "#24D26D"; // Vert
}

// Fonction pour obtenir le thème basé sur l'activité
export const getActivityTheme = (activity: Activity) => {
  // Déterminer le type d'assistant
  let assistantName = "Autre";
  if (activity.activite.toLowerCase().includes("j'apprends")) {
    assistantName = "J'Apprends";
  } else if (activity.activite.toLowerCase().includes("recherche")) {
    assistantName = "Recherche";
  } else if (activity.activite.toLowerCase().includes("accueil")) {
    assistantName = "Accueil";
  }

  // Déterminer la matière
  let subjectName = "Autre";
  const activityLower = activity.activite.toLowerCase();
  if (
    activityLower.includes("mathématiques") ||
    activityLower.includes("géométrie")
  ) {
    subjectName = "Mathématiques";
  } else if (
    activityLower.includes("français") ||
    activityLower.includes("lecture") ||
    activityLower.includes("vocabulaire") ||
    activityLower.includes("conjugaison") ||
    activityLower.includes("grammaire")
  ) {
    subjectName = "Français";
  } else if (
    activityLower.includes("sciences") ||
    activityLower.includes("écologie")
  ) {
    subjectName = "Sciences";
  } else if (activityLower.includes("histoire")) {
    subjectName = "Histoire";
  } else if (activityLower.includes("anglais")) {
    subjectName = "Anglais";
  }

  return {
    assistant: ASSISTANT_THEME[assistantName] || ASSISTANT_THEME.Autre,
    subject: SUBJECT_THEME[subjectName] || SUBJECT_THEME.Autre,
  };
};

// Fonction pour extraire le type d'assistant à partir de l'activité
export const extractAssistantType = (activity: Activity): string => {
  if (activity.activite.toLowerCase().includes("j'apprends")) {
    return "J'Apprends";
  }
  if (activity.activite.toLowerCase().includes("recherche")) {
    return "Recherche";
  }
  if (activity.activite.toLowerCase().includes("accueil")) {
    return "Accueil";
  }
  return "Autre";
};

interface SearchBarProps {
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  dark: boolean;
  activityDateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  toggleActivityCalendar: () => void;
  resetAllFilters: () => void;
  hasFilters: boolean;
}

// Composant pour la barre de recherche moderne
export const SearchBar: React.FC<SearchBarProps> = ({
  searchKeyword,
  setSearchKeyword,
  dark,
  activityDateRange,
  toggleActivityCalendar,
  resetAllFilters,
  hasFilters,
}) => {
  const isDateFilterActive =
    activityDateRange.startDate || activityDateRange.endDate;

  return (
    <View
      style={{
        backgroundColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.03)",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
          borderRadius: 25,
          paddingHorizontal: 15,
          paddingVertical: 4,
          marginBottom: 12,
        }}
      >
        <FontAwesomeIcon
          icon={faSearch}
          color={dark ? COLORS.secondaryWhite : COLORS.gray3}
          size={16}
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="Rechercher une activité..."
          placeholderTextColor={
            dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"
          }
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          style={{
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 2,
            color: dark ? COLORS.white : COLORS.black,
            fontSize: 15,
          }}
        />
        {searchKeyword ? (
          <TouchableOpacity
            onPress={() => setSearchKeyword("")}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: dark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon
              icon={faTimesCircle}
              color={dark ? COLORS.secondaryWhite : COLORS.gray3}
              size={16}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {/* Date Filter Button */}
        <TouchableOpacity
          style={{
            backgroundColor: isDateFilterActive
              ? "rgba(0, 149, 255, 0.1)"
              : dark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 25,
            flex: 1,
            marginRight: 8,
          }}
          onPress={() => toggleActivityCalendar()}
        >
          <FontAwesomeIcon
            icon={faCalendar}
            color={
              isDateFilterActive
                ? COLORS.primary
                : dark
                  ? COLORS.secondaryWhite
                  : COLORS.gray3
            }
            size={16}
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              color: isDateFilterActive
                ? COLORS.primary
                : dark
                  ? COLORS.secondaryWhite
                  : COLORS.gray3,
              fontWeight: isDateFilterActive ? "600" : "normal",
              fontSize: 14,
            }}
          >
            {isDateFilterActive ? "Période active" : "Filtrer par date"}
          </Text>
        </TouchableOpacity>

        {/* Reset Button - only visible when filters are active */}
        {hasFilters && (
          <TouchableOpacity
            style={{
              backgroundColor: dark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 25,
              justifyContent: "center",
            }}
            onPress={resetAllFilters}
          >
            <FontAwesomeIcon
              icon={faSync}
              color={dark ? COLORS.secondaryWhite : COLORS.gray3}
              size={16}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                color: dark ? COLORS.secondaryWhite : COLORS.gray3,
                fontSize: 14,
              }}
            >
              Réinitialiser
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

interface DateRangeIndicatorProps {
  activityDateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  setActivityDateRange: (value: {
    startDate: string | null;
    endDate: string | null;
  }) => void;
  dark: boolean;
}

// Composant élégant pour afficher la plage de dates sélectionnée
export const DateRangeIndicator: React.FC<DateRangeIndicatorProps> = ({
  activityDateRange,
  setActivityDateRange,
  dark,
}) => {
  if (!activityDateRange.startDate) return null;

  // Format dates for display in French locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const startDateFormatted = activityDateRange.startDate
    ? formatDate(activityDateRange.startDate)
    : "";
  const endDateFormatted = activityDateRange.endDate
    ? formatDate(activityDateRange.endDate)
    : "";

  return (
    <View
      style={{
        backgroundColor: dark
          ? "rgba(0, 149, 255, 0.2)"
          : "rgba(0, 149, 255, 0.1)",
        borderRadius: 12,
        padding: 12,
        marginTop: 10,
        marginBottom: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <FontAwesomeIcon
          icon={faCalendar}
          color={COLORS.primary}
          size={16}
          style={{ marginRight: 10 }}
        />
        <Text
          style={{
            color: COLORS.primary,
            fontSize: 14,
            fontWeight: "500",
          }}
        >
          Période: {startDateFormatted}
          {activityDateRange.endDate ? ` - ${endDateFormatted}` : ""}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => setActivityDateRange({ startDate: null, endDate: null })}
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: "rgba(255, 255, 255, 0.25)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FontAwesomeIcon
          icon={faTimesCircle}
          color={COLORS.primary}
          size={16}
        />
      </TouchableOpacity>
    </View>
  );
};

interface AssistantTypeFiltersProps {
  uniqueAssistantTypes: string[];
  selectedAssistantTypes: string[];
  setSelectedAssistantTypes: (value: (prev: string[]) => string[]) => void;
  dark: boolean;
}

// Composant amélioré pour les filtres de type d'assistant
export const AssistantTypeFilters: React.FC<AssistantTypeFiltersProps> = ({
  uniqueAssistantTypes,
  selectedAssistantTypes,
  setSelectedAssistantTypes,
  dark,
}) => {
  return (
    <View style={{ marginBottom: 15 }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "500",
          color: dark ? COLORS.white : COLORS.black,
          marginBottom: 10,
          paddingHorizontal: 4,
        }}
      >
        Types d'assistants
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 4 }}
      >
        {uniqueAssistantTypes.map((type) => {
          const isSelected = selectedAssistantTypes.includes(type);
          const theme = ASSISTANT_THEME[type] || ASSISTANT_THEME.Autre;
          return (
            <TouchableOpacity
              key={type}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: isSelected
                  ? theme.colors[0]
                  : dark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                borderRadius: 25,
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginRight: 10,
                elevation: isSelected ? 2 : 0,
                shadowColor: isSelected ? theme.colors[0] : "transparent",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
              onPress={() => {
                setSelectedAssistantTypes((prev) =>
                  prev.includes(type)
                    ? prev.filter((t) => t !== type)
                    : [...prev, type]
                );
              }}
            >
              <FontAwesomeIcon
                icon={theme.icon}
                color={
                  isSelected
                    ? "#FFFFFF"
                    : dark
                      ? COLORS.secondaryWhite
                      : COLORS.gray3
                }
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color: isSelected
                    ? "#FFFFFF"
                    : dark
                      ? COLORS.secondaryWhite
                      : COLORS.gray3,
                  fontWeight: isSelected ? "600" : "normal",
                  fontSize: 14,
                }}
              >
                {type}
              </Text>
              {isSelected && (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 8,
                  }}
                >
                  <FontAwesomeIcon icon={faCheck} size={12} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

// Nouveau composant pour les filtres de matières
interface SubjectFiltersProps {
  availableSubjects: string[];
  selectedSubjects: string[];
  setSelectedSubjects: (subjects: string[]) => void;
  dark: boolean;
}

export const SubjectFilters: React.FC<SubjectFiltersProps> = ({
  availableSubjects,
  selectedSubjects,
  setSelectedSubjects,
  dark,
}) => {
  if (availableSubjects.length === 0) return null;

  return (
    <View style={{ marginBottom: 15 }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "500",
          color: dark ? COLORS.white : COLORS.black,
          marginBottom: 10,
          paddingHorizontal: 4,
        }}
      >
        Matières
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 4 }}
      >
        {availableSubjects.map((subject) => {
          const isSelected = selectedSubjects.includes(subject);
          const theme = SUBJECT_THEME[subject] || SUBJECT_THEME.Autre;
          return (
            <TouchableOpacity
              key={subject}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: isSelected
                  ? theme.colors[0]
                  : dark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                borderRadius: 25,
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginRight: 10,
                elevation: isSelected ? 2 : 0,
                shadowColor: isSelected ? theme.colors[0] : "transparent",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
              onPress={() => {
                const newSelection = isSelected
                  ? selectedSubjects.filter((s) => s !== subject)
                  : [...selectedSubjects, subject];
                setSelectedSubjects(newSelection);
              }}
            >
              <FontAwesomeIcon
                icon={theme.icon}
                color={
                  isSelected
                    ? "#FFFFFF"
                    : dark
                      ? COLORS.secondaryWhite
                      : COLORS.gray3
                }
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color: isSelected
                    ? "#FFFFFF"
                    : dark
                      ? COLORS.secondaryWhite
                      : COLORS.gray3,
                  fontWeight: isSelected ? "600" : "normal",
                  fontSize: 14,
                }}
              >
                {subject}
              </Text>
              {isSelected && (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 8,
                  }}
                >
                  <FontAwesomeIcon icon={faCheck} size={12} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

// Nouveau composant pour les filtres de chapitres
interface ChapterFiltersProps {
  availableChapters: string[];
  selectedChapters: string[];
  setSelectedChapters: (chapters: string[]) => void;
  dark: boolean;
}

export const ChapterFilters: React.FC<ChapterFiltersProps> = ({
  availableChapters,
  selectedChapters,
  setSelectedChapters,
  dark,
}) => {
  if (availableChapters.length === 0) return null;

  return (
    <View style={{ marginBottom: 15 }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "500",
          color: dark ? COLORS.white : COLORS.black,
          marginBottom: 10,
          paddingHorizontal: 4,
        }}
      >
        Chapitres
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 4 }}
      >
        {availableChapters.map((chapter) => {
          const isSelected = selectedChapters.includes(chapter);
          return (
            <TouchableOpacity
              key={chapter}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: isSelected
                  ? "#009688"
                  : dark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                borderRadius: 25,
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginRight: 10,
                elevation: isSelected ? 2 : 0,
                shadowColor: isSelected ? "#009688" : "transparent",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
              onPress={() => {
                const newSelection = isSelected
                  ? selectedChapters.filter((c) => c !== chapter)
                  : [...selectedChapters, chapter];
                setSelectedChapters(newSelection);
              }}
            >
              <FontAwesomeIcon
                icon={faBook}
                color={
                  isSelected
                    ? "#FFFFFF"
                    : dark
                      ? COLORS.secondaryWhite
                      : COLORS.gray3
                }
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color: isSelected
                    ? "#FFFFFF"
                    : dark
                      ? COLORS.secondaryWhite
                      : COLORS.gray3,
                  fontWeight: isSelected ? "600" : "normal",
                  fontSize: 14,
                }}
              >
                {chapter}
              </Text>
              {isSelected && (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 8,
                  }}
                >
                  <FontAwesomeIcon icon={faCheck} size={12} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

// Nouveau composant pour les filtres d'exercices
interface ExerciseFiltersProps {
  availableExercises: string[];
  selectedExercises: string[];
  setSelectedExercises: (exercises: string[]) => void;
  dark: boolean;
}

export const ExerciseFilters: React.FC<ExerciseFiltersProps> = ({
  availableExercises,
  selectedExercises,
  setSelectedExercises,
  dark,
}) => {
  if (availableExercises.length === 0) return null;

  return (
    <View style={{ marginBottom: 15 }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "500",
          color: dark ? COLORS.white : COLORS.black,
          marginBottom: 10,
          paddingHorizontal: 4,
        }}
      >
        Types d&apos;exercices
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 4 }}
      >
        {availableExercises.map((exercise) => {
          const isSelected = selectedExercises.includes(exercise);
          return (
            <TouchableOpacity
              key={exercise}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: isSelected
                  ? "#E91E63"
                  : dark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                borderRadius: 25,
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginRight: 10,
                elevation: isSelected ? 2 : 0,
                shadowColor: isSelected ? "#E91E63" : "transparent",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
              onPress={() => {
                const newSelection = isSelected
                  ? selectedExercises.filter((e) => e !== exercise)
                  : [...selectedExercises, exercise];
                setSelectedExercises(newSelection);
              }}
            >
              <FontAwesomeIcon
                icon={faBook}
                color={
                  isSelected
                    ? "#FFFFFF"
                    : dark
                      ? COLORS.secondaryWhite
                      : COLORS.gray3
                }
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color: isSelected
                    ? "#FFFFFF"
                    : dark
                      ? COLORS.secondaryWhite
                      : COLORS.gray3,
                  fontWeight: isSelected ? "600" : "normal",
                  fontSize: 14,
                }}
              >
                {exercise}
              </Text>
              {isSelected && (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 8,
                  }}
                >
                  <FontAwesomeIcon icon={faCheck} size={12} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

interface FilterModalProps {
  showActivityCalendar: boolean;
  toggleActivityCalendar: (mode?: "start" | "end") => void;
  dark: boolean;
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  uniqueAssistantTypes: string[];
  selectedAssistantTypes: string[];
  setSelectedAssistantTypes: (value: (prev: string[]) => string[]) => void;
  activityCalendarMode: "start" | "end";
  activityDateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  handleActivityDayPress: (day: any) => void;
  resetAllFilters: () => void;
  // Nouvelles props pour les filtres avancés
  availableSubjects: string[];
  availableChapters: string[];
  availableExercises: string[];
  advancedFilters: {
    selectedAssistants: string[];
    selectedSubjects: string[];
    selectedChapters: string[];
    selectedExercises: string[];
  };
  setAdvancedFilters: (filters: any) => void;
}

// Composant de modal de filtrage amélioré avec animation
export const FilterModal: React.FC<FilterModalProps> = ({
  showActivityCalendar,
  toggleActivityCalendar,
  dark,
  searchKeyword,
  setSearchKeyword,
  uniqueAssistantTypes,
  selectedAssistantTypes,
  setSelectedAssistantTypes,
  activityCalendarMode,
  activityDateRange,
  handleActivityDayPress,
  resetAllFilters,
  // Nouvelles props utilisées
  availableSubjects,
  availableChapters,
  availableExercises,
  advancedFilters,
  setAdvancedFilters,
}) => {
  const translateY = React.useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (showActivityCalendar) {
      // Animate modal in
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate modal out
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: Dimensions.get("window").height,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showActivityCalendar, opacity, translateY]);

  // Get currently selected mode label
  const getModeTitleText = () => {
    if (activityCalendarMode === "start") {
      return "Sélectionner une date de début";
    } else {
      return "Sélectionner une date de fin";
    }
  };

  // Prepare date range for calendar
  const getMarkedDates = () => {
    const markedDates: { [date: string]: any } = {};

    if (activityDateRange.startDate) {
      markedDates[activityDateRange.startDate] = {
        selected: true,
        startingDay: true,
        color: COLORS.primary,
        textColor: "#FFFFFF",
      };
    }

    if (activityDateRange.endDate) {
      markedDates[activityDateRange.endDate] = {
        selected: true,
        endingDay: true,
        color: COLORS.primary,
        textColor: "#FFFFFF",
      };
    }

    // If both dates are set, mark the dates between them
    if (activityDateRange.startDate && activityDateRange.endDate) {
      const start = new Date(activityDateRange.startDate);
      const end = new Date(activityDateRange.endDate);

      // Mark dates in between
      const current = new Date(start);
      current.setDate(current.getDate() + 1);

      while (current < end) {
        const dateStr = current.toISOString().split("T")[0];
        markedDates[dateStr] = {
          selected: true,
          color: `${COLORS.primary}80`,
          textColor: "#FFFFFF",
        };
        current.setDate(current.getDate() + 1);
      }
    }

    return markedDates;
  };

  return (
    <Modal
      visible={showActivityCalendar}
      transparent
      animationType="none" // We're doing our own animation
      onRequestClose={() => toggleActivityCalendar()}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
      >
        <Animated.View
          style={{
            opacity: opacity,
          }}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            activeOpacity={1}
            onPress={() => toggleActivityCalendar()}
          />
        </Animated.View>

        <Animated.View
          style={{
            backgroundColor: dark ? COLORS.dark1 : COLORS.white,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            maxHeight: "90%",
            transform: [{ translateY: translateY }],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -5 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 10,
          }}
        >
          {/* Modal Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: dark ? COLORS.white : COLORS.black,
              }}
            >
              Filtrer les activités
            </Text>
            <TouchableOpacity
              onPress={() => toggleActivityCalendar()}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: dark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon
                icon={faTimesCircle}
                color={dark ? COLORS.white : COLORS.black}
                size={18}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* Search Input */}
            <View
              style={{
                backgroundColor: dark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
                borderRadius: 25,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                marginBottom: 24,
              }}
            >
              <FontAwesomeIcon
                icon={faSearch}
                color={dark ? COLORS.secondaryWhite : COLORS.gray3}
                size={16}
                style={{ marginRight: 10 }}
              />
              <TextInput
                placeholder="Rechercher..."
                placeholderTextColor={
                  dark ? COLORS.secondaryWhite : COLORS.gray3
                }
                value={searchKeyword}
                onChangeText={setSearchKeyword}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  color: dark ? COLORS.white : COLORS.black,
                  fontSize: 16,
                }}
              />
              {searchKeyword ? (
                <TouchableOpacity onPress={() => setSearchKeyword("")}>
                  <FontAwesomeIcon
                    icon={faTimesCircle}
                    color={dark ? COLORS.secondaryWhite : COLORS.gray3}
                    size={16}
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Calendar Date Selection */}
            <View style={{ marginBottom: 24 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <FontAwesomeIcon
                  icon={faCalendar}
                  color={COLORS.primary}
                  size={18}
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: dark ? COLORS.white : COLORS.black,
                  }}
                >
                  {getModeTitleText()}
                </Text>
              </View>

              {/* Calendar Status */}
              <View
                style={{
                  backgroundColor: dark
                    ? "rgba(0, 149, 255, 0.15)"
                    : "rgba(0, 149, 255, 0.08)",
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    color: dark ? COLORS.secondaryWhite : COLORS.primary,
                    textAlign: "center",
                    fontSize: 15,
                  }}
                >
                  {activityCalendarMode === "start"
                    ? "Choisissez une date de début pour la période"
                    : "Choisissez une date de fin pour la période"}
                </Text>
                {activityDateRange.startDate &&
                  activityCalendarMode === "end" && (
                    <Text
                      style={{
                        color: COLORS.primary,
                        textAlign: "center",
                        marginTop: 4,
                        fontWeight: "500",
                      }}
                    >
                      Date de début:{" "}
                      {new Date(activityDateRange.startDate).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </Text>
                  )}
              </View>

              {/* Calendar Component */}
              <Calendar
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  elevation: 2,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                }}
                theme={{
                  backgroundColor: dark ? COLORS.dark2 : "#FFFFFF",
                  calendarBackground: dark ? COLORS.dark2 : "#FFFFFF",
                  textSectionTitleColor: dark ? COLORS.white : COLORS.black,
                  selectedDayBackgroundColor: COLORS.primary,
                  selectedDayTextColor: "#FFFFFF",
                  todayTextColor: COLORS.primary,
                  dayTextColor: dark ? COLORS.white : COLORS.black,
                  textDisabledColor: dark
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(0,0,0,0.3)",
                  dotColor: COLORS.primary,
                  selectedDotColor: "#FFFFFF",
                  arrowColor: COLORS.primary,
                  monthTextColor: dark ? COLORS.white : COLORS.black,
                  textMonthFontWeight: "bold",
                  textDayFontSize: 14,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 13,
                }}
                markingType="period"
                markedDates={getMarkedDates()}
                onDayPress={handleActivityDayPress}
                enableSwipeMonths={true}
              />
            </View>

            {/* Assistant Types */}
            <AssistantTypeFilters
              uniqueAssistantTypes={uniqueAssistantTypes}
              selectedAssistantTypes={advancedFilters.selectedAssistants}
              setSelectedAssistantTypes={(assistants) =>
                setAdvancedFilters({ selectedAssistants: assistants })
              }
              dark={dark}
            />

            {/* Subject Filters (Only if J'Apprends is selected) */}
            {advancedFilters.selectedAssistants.includes("J'Apprends") && (
              <SubjectFilters
                availableSubjects={availableSubjects}
                selectedSubjects={advancedFilters.selectedSubjects}
                setSelectedSubjects={(subjects) =>
                  setAdvancedFilters({ selectedSubjects: subjects })
                }
                dark={dark}
              />
            )}

            {/* Chapter Filters (Only if a subject is selected) */}
            {advancedFilters.selectedSubjects.length > 0 && (
              <ChapterFilters
                availableChapters={availableChapters}
                selectedChapters={advancedFilters.selectedChapters}
                setSelectedChapters={(chapters) =>
                  setAdvancedFilters({ selectedChapters: chapters })
                }
                dark={dark}
              />
            )}

            {/* Exercise Filters (Only if a chapter is selected) */}
            {advancedFilters.selectedChapters.length > 0 && (
              <ExerciseFilters
                availableExercises={availableExercises}
                selectedExercises={advancedFilters.selectedExercises}
                setSelectedExercises={(exercises) =>
                  setAdvancedFilters({ selectedExercises: exercises })
                }
                dark={dark}
              />
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View
            style={{
              flexDirection: "row",
              marginTop: 16,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: dark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
                paddingVertical: 15,
                borderRadius: 12,
                alignItems: "center",
                marginRight: 8,
              }}
              onPress={resetAllFilters}
            >
              <Text
                style={{
                  color: dark ? COLORS.white : COLORS.black,
                  fontWeight: "500",
                  fontSize: 16,
                }}
              >
                Réinitialiser
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: COLORS.primary,
                paddingVertical: 15,
                borderRadius: 12,
                alignItems: "center",
                marginLeft: 8,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
                elevation: 3,
              }}
              onPress={() => toggleActivityCalendar()}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontWeight: "600",
                  fontSize: 16,
                }}
              >
                Appliquer
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
