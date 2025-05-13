// app/Enfants/Historique/filtres.tsx – fully fixed and compilable version
import React, { useState, useEffect } from "react";
import { Calendar, DateData } from "react-native-calendars";
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
  Platform,
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
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

import type { Activity } from "../../../data/Enfants/CHILDREN_DATA";

import { COLORS } from "../../../constants/theme";

// -----------------------------------------------------------------------------
// TYPE & CONSTANT DEFINITIONS
// -----------------------------------------------------------------------------

interface AssistantThemeType {
  colors: readonly [string, string, ...string[]];
  icon: any;
}

interface SubjectThemeType {
  colors: readonly [string, string, ...string[]];
  icon: any;
}

// Themes for assistants
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

// Themes for subjects
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

// -----------------------------------------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------------------------------------

export function getProgressColor(progress: number) {
  if (progress < 30) return "#FC4E00"; // Rouge
  if (progress <= 50) return "#EBB016"; // Orange
  if (progress <= 70) return "#F3BB00"; // Jaune
  return "#24D26D"; // Vert
}

export const getActivityTheme = (activity: Activity) => {
  let assistantName = "Autre";
  if (activity.activite?.toLowerCase().includes("j'apprends")) {
    assistantName = "J'Apprends";
  } else if (activity.activite?.toLowerCase().includes("recherche")) {
    assistantName = "Recherche";
  } else if (activity.activite?.toLowerCase().includes("accueil")) {
    assistantName = "Accueil";
  }

  let subjectName = "Autre";
  if (activity.activite) {
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
  }

  return {
    assistant: ASSISTANT_THEME[assistantName] || ASSISTANT_THEME.Autre,
    subject: SUBJECT_THEME[subjectName] || SUBJECT_THEME.Autre,
  };
};

export const extractAssistantType = (activity: Activity): string => {
  if (!activity.activite) return "Autre";
  const activiteLower = activity.activite.toLowerCase();
  if (activiteLower.includes("j'apprends")) return "J'Apprends";
  if (activiteLower.includes("recherche")) return "Recherche";
  if (activiteLower.includes("accueil")) return "Accueil";
  return "Autre";
};

// -----------------------------------------------------------------------------
// SEARCH BAR COMPONENT
// -----------------------------------------------------------------------------

interface SearchBarProps {
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  dark: boolean;
  activityDateRange: { startDate: string | null; endDate: string | null };
  toggleActivityCalendar: () => void;
  resetAllFilters: () => void;
  hasFilters: boolean;
}

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
        {searchKeyword && (
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
        )}
      </View>

      {/* Date Filter & Reset Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
          onPress={toggleActivityCalendar}
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

// -----------------------------------------------------------------------------
// DATE RANGE INDICATOR COMPONENT
// -----------------------------------------------------------------------------

interface DateRangeIndicatorProps {
  activityDateRange: { startDate: string | null; endDate: string | null };
  setActivityDateRange: (value: {
    startDate: string | null;
    endDate: string | null;
  }) => void;
  dark: boolean;
}

export const DateRangeIndicator: React.FC<DateRangeIndicatorProps> = ({
  activityDateRange,
  setActivityDateRange,
  dark,
}) => {
  if (!activityDateRange.startDate && !activityDateRange.endDate) return null;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

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
        marginVertical: 12,
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
          style={{ color: COLORS.primary, fontSize: 14, fontWeight: "500" }}
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

// -----------------------------------------------------------------------------
// ASSISTANT TYPE FILTERS COMPONENT
// -----------------------------------------------------------------------------

interface AssistantTypeFiltersProps {
  uniqueAssistantTypes: string[];
  selectedAssistantTypes: string[];
  setSelectedAssistantTypes: (
    value: ((prev: string[]) => string[]) | string[]
  ) => void;
  dark: boolean;
}

export const AssistantTypeFilters: React.FC<AssistantTypeFiltersProps> = ({
  uniqueAssistantTypes,
  selectedAssistantTypes,
  setSelectedAssistantTypes,
  dark,
}) => {
  if (!uniqueAssistantTypes || uniqueAssistantTypes.length === 0) return null;
  const safeSelectedTypes = selectedAssistantTypes || [];

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
          const isSelected = safeSelectedTypes.includes(type);
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
                if (typeof setSelectedAssistantTypes === "function") {
                  setSelectedAssistantTypes((prev: string[]) => {
                    const safeArray = prev || [];
                    return safeArray.includes(type)
                      ? safeArray.filter((t) => t !== type)
                      : [...safeArray, type];
                  });
                }
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

// -----------------------------------------------------------------------------
// SUBJECT FILTERS COMPONENT
// -----------------------------------------------------------------------------

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
  if (!availableSubjects || availableSubjects.length === 0) return null;
  const safeSelectedSubjects = selectedSubjects || [];

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
          const isSelected = safeSelectedSubjects.includes(subject);
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
                  ? safeSelectedSubjects.filter((s) => s !== subject)
                  : [...safeSelectedSubjects, subject];
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

// -----------------------------------------------------------------------------
// CHAPTER FILTERS COMPONENT
// -----------------------------------------------------------------------------

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
  if (!availableChapters || availableChapters.length === 0) return null;
  const safeSelectedChapters = selectedChapters || [];

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
          const isSelected = safeSelectedChapters.includes(chapter);
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
                  ? safeSelectedChapters.filter((c) => c !== chapter)
                  : [...safeSelectedChapters, chapter];
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

// -----------------------------------------------------------------------------
// EXERCISE FILTERS COMPONENT
// -----------------------------------------------------------------------------

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
  if (!availableExercises || availableExercises.length === 0) return null;
  const safeSelectedExercises = selectedExercises || [];

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
        Types d'exercices
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 4 }}
      >
        {availableExercises.map((exercise) => {
          const isSelected = safeSelectedExercises.includes(exercise);
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
                  ? safeSelectedExercises.filter((e) => e !== exercise)
                  : [...safeSelectedExercises, exercise];
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

// -----------------------------------------------------------------------------
// FILTER MODAL COMPONENT
// -----------------------------------------------------------------------------

interface FilterModalProps {
  showActivityCalendar: boolean;
  toggleActivityCalendar: (mode?: "start" | "end") => void;
  dark: boolean;
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  uniqueAssistantTypes: string[];
  selectedAssistantTypes: string[];
  setSelectedAssistantTypes: (
    value: ((prev: string[]) => string[]) | string[]
  ) => void;
  activityCalendarMode: "start" | "end";
  activityDateRange: { startDate: string | null; endDate: string | null };
  handleActivityDayPress: (day: DateData) => void;
  resetAllFilters: () => void;
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

  useEffect(() => {
    if (showActivityCalendar) {
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

  const getModeTitleText = () =>
    activityCalendarMode === "start"
      ? "Sélectionner une date de début"
      : "Sélectionner une date de fin";

  // Improved getMarkedDates function for FilterModal
  const getMarkedDates = () => {
    const marked: { [date: string]: any } = {};

    // No dates selected
    if (!activityDateRange.startDate && !activityDateRange.endDate) {
      return marked;
    }

    // Only start date selected
    if (activityDateRange.startDate && !activityDateRange.endDate) {
      marked[activityDateRange.startDate] = {
        selected: true,
        startingDay: true,
        endingDay: true, // Single day selection looks like a complete circle
        color: COLORS.primary,
        textColor: "#FFFFFF",
      };
      return marked;
    }

    // Both dates selected - show full range
    if (activityDateRange.startDate && activityDateRange.endDate) {
      // Mark start date
      marked[activityDateRange.startDate] = {
        selected: true,
        startingDay: true,
        color: COLORS.primary,
        textColor: "#FFFFFF",
      };

      // Mark end date
      marked[activityDateRange.endDate] = {
        selected: true,
        endingDay: true,
        color: COLORS.primary,
        textColor: "#FFFFFF",
      };

      // Handle case where start == end (single day)
      if (activityDateRange.startDate === activityDateRange.endDate) {
        marked[activityDateRange.startDate].endingDay = true;
        return marked;
      }

      // Mark all days in between
      const start = new Date(activityDateRange.startDate);
      const end = new Date(activityDateRange.endDate);
      const current = new Date(start);
      current.setDate(current.getDate() + 1);

      while (current < end) {
        const dateStr = current.toISOString().split("T")[0];
        marked[dateStr] = {
          selected: true,
          color: `${COLORS.primary}80`, // Use semi-transparent color for days in between
          textColor: "#FFFFFF",
        };
        current.setDate(current.getDate() + 1);
      }
    }

    return marked;
  };

  return (
    <Modal
      visible={showActivityCalendar}
      transparent
      animationType="none"
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
            opacity,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
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
            transform: [{ translateY }],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -5 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 10,
          }}
        >
          {/* HEADER */}
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
            {/* SEARCH INPUT */}
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
              {searchKeyword && (
                <TouchableOpacity onPress={() => setSearchKeyword("")}>
                  {
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      color={dark ? COLORS.secondaryWhite : COLORS.gray3}
                      size={16}
                    />
                  }
                </TouchableOpacity>
              )}
            </View>
            {/* CALENDAR SECTION */}
            // Modified Calendar Section for FilterModal in filtres.tsx
            {/* CALENDAR SECTION */}
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

                {/* Show current selection status */}
                {activityDateRange.startDate && (
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
                      { day: "numeric", month: "long", year: "numeric" }
                    )}
                  </Text>
                )}

                {activityDateRange.endDate && (
                  <Text
                    style={{
                      color: COLORS.primary,
                      textAlign: "center",
                      marginTop: 4,
                      fontWeight: "500",
                    }}
                  >
                    Date de fin:{" "}
                    {new Date(activityDateRange.endDate).toLocaleDateString(
                      "fr-FR",
                      { day: "numeric", month: "long", year: "numeric" }
                    )}
                  </Text>
                )}

                {/* Instructions for second selection */}
                {activityCalendarMode === "end" &&
                  activityDateRange.startDate &&
                  !activityDateRange.endDate && (
                    <Text
                      style={{
                        color: dark ? "rgba(255,255,255,0.7)" : COLORS.gray3,
                        textAlign: "center",
                        marginTop: 8,
                        fontStyle: "italic",
                      }}
                    >
                      Sélectionnez maintenant une date de fin pour compléter la
                      période
                    </Text>
                  )}
              </View>

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
                enableSwipeMonths
              />
            </View>
            {/* ADVANCED FILTERS */}
            {uniqueAssistantTypes.length > 0 && (
              <AssistantTypeFilters
                uniqueAssistantTypes={uniqueAssistantTypes}
                selectedAssistantTypes={
                  advancedFilters.selectedAssistants || []
                }
                setSelectedAssistantTypes={(assistants) => {
                  if (typeof assistants === "function") {
                    const newAssistants = assistants(
                      advancedFilters.selectedAssistants || []
                    );
                    setAdvancedFilters({
                      ...advancedFilters,
                      selectedAssistants: newAssistants,
                    });
                  } else {
                    setAdvancedFilters({
                      ...advancedFilters,
                      selectedAssistants: assistants,
                    });
                  }
                }}
                dark={dark}
              />
            )}
            {advancedFilters.selectedAssistants?.includes("J'Apprends") &&
              availableSubjects.length > 0 && (
                <SubjectFilters
                  availableSubjects={availableSubjects}
                  selectedSubjects={advancedFilters.selectedSubjects || []}
                  setSelectedSubjects={(subjects) =>
                    setAdvancedFilters({
                      ...advancedFilters,
                      selectedSubjects: subjects,
                    })
                  }
                  dark={dark}
                />
              )}
            {advancedFilters.selectedSubjects?.length > 0 &&
              availableChapters.length > 0 && (
                <ChapterFilters
                  availableChapters={availableChapters}
                  selectedChapters={advancedFilters.selectedChapters || []}
                  setSelectedChapters={(chapters) =>
                    setAdvancedFilters({
                      ...advancedFilters,
                      selectedChapters: chapters,
                    })
                  }
                  dark={dark}
                />
              )}
            {advancedFilters.selectedChapters?.length > 0 &&
              availableExercises.length > 0 && (
                <ExerciseFilters
                  availableExercises={availableExercises}
                  selectedExercises={advancedFilters.selectedExercises || []}
                  setSelectedExercises={(exercises) =>
                    setAdvancedFilters({
                      ...advancedFilters,
                      selectedExercises: exercises,
                    })
                  }
                  dark={dark}
                />
              )}
          </ScrollView>

          {/* ACTION BUTTONS */}
          <View style={{ flexDirection: "row", marginTop: 16 }}>
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
                style={{ color: COLORS.white, fontWeight: "600", fontSize: 16 }}
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

// EOF – filtre.tsx
