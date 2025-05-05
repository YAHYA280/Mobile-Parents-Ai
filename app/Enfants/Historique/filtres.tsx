import React from 'react';
import { Calendar } from 'react-native-calendars';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { View, Text, Modal, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { faSync, faSearch, faCalendar, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
// Importez les icônes nécessaires
import { faHome, faBook, faFlask, faRobot, faLandmark, faLanguage, faBookOpen, faCalculator, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';

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
  "Recherche": AssistantThemeType; 
  "Accueil": AssistantThemeType;
  "Autre": AssistantThemeType;
  [key: string]: AssistantThemeType;
} = {
  "J'Apprends": {
    colors: ['#4CAF50', '#2E7D32'],
    icon: faChalkboardTeacher
  },
  "Recherche": {
    colors: ['#2196F3', '#1565C0'],
    icon: faSearch
  },
  "Accueil": {
    colors: ['#FF9800', '#F57C00'],
    icon: faHome
  },
  "Autre": {
    colors: ['#9C27B0', '#7B1FA2'],
    icon: faRobot
  }
};

// Thèmes pour les matières
export const SUBJECT_THEME: {
  "Mathématiques": SubjectThemeType;
  "Français": SubjectThemeType;
  "Sciences": SubjectThemeType;
  "Histoire": SubjectThemeType;
  "Anglais": SubjectThemeType;
  "Autre": SubjectThemeType;
  [key: string]: SubjectThemeType;
} = {
  "Mathématiques": {
    colors: ['#E91E63', '#C2185B'],
    icon: faCalculator
  },
  "Français": {
    colors: ['#3F51B5', '#303F9F'],
    icon: faBook
  },
  "Sciences": {
    colors: ['#009688', '#00796B'],
    icon: faFlask
  },
  "Histoire": {
    colors: ['#795548', '#5D4037'],
    icon: faLandmark
  },
  "Anglais": {
    colors: ['#673AB7', '#512DA8'],
    icon: faLanguage
  },
  "Autre": {
    colors: ['#607D8B', '#455A64'],
    icon: faBookOpen
  }
};

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
  if (activityLower.includes("mathématiques") || activityLower.includes("géométrie")) {
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
    subject: SUBJECT_THEME[subjectName] || SUBJECT_THEME.Autre
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

// Composant pour la barre de recherche
export const SearchBar: React.FC<SearchBarProps> = ({
  searchKeyword,
  setSearchKeyword,
  dark,
  activityDateRange,
  toggleActivityCalendar,
  resetAllFilters,
  hasFilters
}) => {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      borderRadius: 10,
      marginBottom: 12,
      paddingHorizontal: 10,
      paddingVertical: 5
    }}>
      <FontAwesomeIcon icon={faSearch} color={dark ? COLORS.secondaryWhite : COLORS.gray3} />
      <TextInput
        placeholder="Rechercher une activité..."
        placeholderTextColor={dark ? COLORS.secondaryWhite : COLORS.gray3}
        value={searchKeyword}
        onChangeText={setSearchKeyword}
        style={{
          flex: 1,
          paddingVertical: 10,
          paddingHorizontal: 10,
          color: dark ? COLORS.white : COLORS.black
        }}
      />
      {searchKeyword ? (
        <TouchableOpacity
          onPress={() => setSearchKeyword("")}
        >
          <FontAwesomeIcon
            icon={faTimesCircle}
            color={dark ? COLORS.secondaryWhite : COLORS.gray3}
          />
        </TouchableOpacity>
      ) : null}

      {/* Bouton de calendrier */}
      <TouchableOpacity
        style={{
          backgroundColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          width: 40,
          height: 40,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 8
        }}
        onPress={() => toggleActivityCalendar()}
      >
        <FontAwesomeIcon
          icon={faCalendar}
          color={activityDateRange.startDate ? COLORS.primary : (dark ? COLORS.secondaryWhite : COLORS.gray3)}
        />
      </TouchableOpacity>

      {/* Bouton de réinitialisation (facultatif) */}
      {hasFilters && (
        <TouchableOpacity
          style={{
            backgroundColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 8,
          }}
          onPress={resetAllFilters}
        >
          <FontAwesomeIcon icon={faSync} color={dark ? COLORS.secondaryWhite : COLORS.gray3} />
        </TouchableOpacity>
      )}
    </View>
  );
};

interface DateRangeIndicatorProps {
  activityDateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  setActivityDateRange: (value: { startDate: string | null; endDate: string | null; }) => void;
  dark: boolean;
}

// Composant pour afficher la plage de dates sélectionnée
export const DateRangeIndicator: React.FC<DateRangeIndicatorProps> = ({
  activityDateRange,
  setActivityDateRange,
  dark
}) => {
  if (!activityDateRange.startDate) return null;
  
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: dark ? 'rgba(0, 149, 255, 0.2)' : 'rgba(0, 149, 255, 0.1)',
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 6,
      marginTop: 10
    }}>
      <FontAwesomeIcon icon={faCalendar} color={COLORS.primary} style={{ marginRight: 6 }} />
      <Text style={{ color: COLORS.primary, fontSize: 13 }}>
        Période: {new Date(activityDateRange.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
        {activityDateRange.endDate ? ` - ${new Date(activityDateRange.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}` : ''}
      </Text>
      <TouchableOpacity
        style={{ marginLeft: 'auto' }}
        onPress={() => setActivityDateRange({ startDate: null, endDate: null })}
      >
        <FontAwesomeIcon icon={faTimesCircle} color={COLORS.primary} />
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

// Composant pour les filtres de type d'assistant
export const AssistantTypeFilters: React.FC<AssistantTypeFiltersProps> = ({
  uniqueAssistantTypes,
  selectedAssistantTypes,
  setSelectedAssistantTypes,
  dark
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginBottom: 10 }}
    >
      {uniqueAssistantTypes.map(type => {
        const isSelected = selectedAssistantTypes.includes(type);
        const theme = ASSISTANT_THEME[type] || ASSISTANT_THEME.Autre;
        return (
          <TouchableOpacity
            key={type}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isSelected
                ? theme.colors[0]
                : (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 8,
              marginRight: 8
            }}
            onPress={() => {
              setSelectedAssistantTypes(prev =>
                prev.includes(type)
                  ? prev.filter(t => t !== type)
                  : [...prev, type]
              );
            }}
          >
            <FontAwesomeIcon
              icon={theme.icon}
              color={isSelected ? '#FFFFFF' : (dark ? COLORS.secondaryWhite : COLORS.gray3)}
              style={{ marginRight: 6 }}
            />
            <Text style={{ color: isSelected ? '#FFFFFF' : (dark ? COLORS.secondaryWhite : COLORS.gray3) }}>
              {type}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
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
  dark
}) => {
  if (availableSubjects.length === 0) return null;
  
  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10, color: dark ? COLORS.white : COLORS.black }}>
        Matières
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {availableSubjects.map(subject => {
          const isSelected = selectedSubjects.includes(subject);
          const theme = SUBJECT_THEME[subject] || SUBJECT_THEME.Autre;
          return (
            <TouchableOpacity
              key={subject}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isSelected
                  ? theme.colors[0]
                  : (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginRight: 8,
                marginBottom: 8
              }}
              onPress={() => {
                const newSelection = isSelected
                  ? selectedSubjects.filter(s => s !== subject)
                  : [...selectedSubjects, subject];
                setSelectedSubjects(newSelection);
              }}
            >
              <FontAwesomeIcon
                icon={theme.icon}
                color={isSelected ? '#FFFFFF' : (dark ? COLORS.secondaryWhite : COLORS.gray3)}
                style={{ marginRight: 6 }}
              />
              <Text style={{ color: isSelected ? '#FFFFFF' : (dark ? COLORS.secondaryWhite : COLORS.gray3) }}>
                {subject}
              </Text>
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
  dark
}) => {
  if (availableChapters.length === 0) return null;
  
  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10, color: dark ? COLORS.white : COLORS.black }}>
        Chapitres
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {availableChapters.map(chapter => {
          const isSelected = selectedChapters.includes(chapter);
          return (
            <TouchableOpacity
              key={chapter}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isSelected
                  ? COLORS.primary
                  : (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginRight: 8,
                marginBottom: 8
              }}
              onPress={() => {
                const newSelection = isSelected
                  ? selectedChapters.filter(c => c !== chapter)
                  : [...selectedChapters, chapter];
                setSelectedChapters(newSelection);
              }}
            >
              <FontAwesomeIcon
                icon={faBookOpen}
                color={isSelected ? '#FFFFFF' : (dark ? COLORS.secondaryWhite : COLORS.gray3)}
                style={{ marginRight: 6 }}
              />
              <Text style={{ color: isSelected ? '#FFFFFF' : (dark ? COLORS.secondaryWhite : COLORS.gray3) }}>
                {chapter}
              </Text>
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
  dark
}) => {
  if (availableExercises.length === 0) return null;
  
  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10, color: dark ? COLORS.white : COLORS.black }}>
        Types d&apos;exercices
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {availableExercises.map(exercise => {
          const isSelected = selectedExercises.includes(exercise);
          return (
            <TouchableOpacity
              key={exercise}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isSelected
                  ? COLORS.primary
                  : (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginRight: 8,
                marginBottom: 8
              }}
              onPress={() => {
                const newSelection = isSelected
                  ? selectedExercises.filter(e => e !== exercise)
                  : [...selectedExercises, exercise];
                setSelectedExercises(newSelection);
              }}
            >
              <FontAwesomeIcon
                icon={faBook}
                color={isSelected ? '#FFFFFF' : (dark ? COLORS.secondaryWhite : COLORS.gray3)}
                style={{ marginRight: 6 }}
              />
              <Text style={{ color: isSelected ? '#FFFFFF' : (dark ? COLORS.secondaryWhite : COLORS.gray3) }}>
                {exercise}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

interface FilterModalProps {
  showActivityCalendar: boolean;
  toggleActivityCalendar: (mode?: 'start' | 'end') => void;
  dark: boolean;
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  uniqueAssistantTypes: string[];
  selectedAssistantTypes: string[];
  setSelectedAssistantTypes: (value: (prev: string[]) => string[]) => void;
  activityCalendarMode: 'start' | 'end';
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

// Composant pour le modal de filtrage
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
  setAdvancedFilters
}) => {
  return (
    <Modal
      visible={showActivityCalendar}
      transparent
      animationType="slide"
      onRequestClose={() => toggleActivityCalendar()}
    >
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{ backgroundColor: dark ? COLORS.dark1 : COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' }}>
          {/* En-tête du modal */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: dark ? COLORS.white : COLORS.black }}>Filtrer les activités</Text>
            <TouchableOpacity onPress={() => toggleActivityCalendar()}>
            <FontAwesomeIcon
                icon={faTimesCircle}
                color={dark ? COLORS.white : COLORS.black}
              />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Champ de recherche */}
            <View style={{ backgroundColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', borderRadius: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginBottom: 20 }}>
              <FontAwesomeIcon icon={faSearch} color={dark ? COLORS.secondaryWhite : COLORS.gray3} />
              <TextInput
                placeholder="Rechercher..."
                placeholderTextColor={dark ? COLORS.secondaryWhite : COLORS.gray3}
                value={searchKeyword}
                onChangeText={setSearchKeyword}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  color: dark ? COLORS.white : COLORS.black
                }}
              />
              {searchKeyword ? (
                <TouchableOpacity
                  onPress={() => setSearchKeyword("")}
                >
                  <FontAwesomeIcon
                    icon={faTimesCircle}
                    color={dark ? COLORS.secondaryWhite : COLORS.gray3}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            {/* Types d'assistants */}
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10, color: dark ? COLORS.white : COLORS.black }}>Type d&apos;assistant</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
              {uniqueAssistantTypes.map(type => {
                const isSelected = selectedAssistantTypes.includes(type);
                const theme = ASSISTANT_THEME[type] || ASSISTANT_THEME.Autre;
                return (
                  <TouchableOpacity
                    key={type}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: isSelected
                        ? theme.colors[0]
                        : (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
                      borderRadius: 20,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      marginRight: 8,
                      marginBottom: 8
                    }}
                    onPress={() => {
                      setSelectedAssistantTypes(prev =>
                        prev.includes(type)
                          ? prev.filter(t => t !== type)
                          : [...prev, type]
                      );
                    }}
                  >
                    <FontAwesomeIcon
                      icon={theme.icon}
                      color={isSelected ? '#FFFFFF' : (dark ? COLORS.secondaryWhite : COLORS.gray3)}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={{ color: isSelected ? '#FFFFFF' : (dark ? COLORS.secondaryWhite : COLORS.gray3) }}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* NOUVEAU: Filtre de matières (uniquement affiché quand J'Apprends est sélectionné) */}
            {selectedAssistantTypes.includes("J'Apprends") && (
              <SubjectFilters 
                availableSubjects={availableSubjects}
                selectedSubjects={advancedFilters.selectedSubjects}
                setSelectedSubjects={(subjects) => setAdvancedFilters({ selectedSubjects: subjects })}
                dark={dark}
              />
            )}

            {/* NOUVEAU: Filtre de chapitres (uniquement affiché quand une matière est sélectionnée) */}
            {advancedFilters.selectedSubjects.length > 0 && (
              <ChapterFilters 
                availableChapters={availableChapters}
                selectedChapters={advancedFilters.selectedChapters}
                setSelectedChapters={(chapters) => setAdvancedFilters({ selectedChapters: chapters })}
                dark={dark}
              />
            )}

            {/* NOUVEAU: Filtre d'exercices (uniquement affiché quand un chapitre est sélectionné) */}
            {advancedFilters.selectedChapters.length > 0 && (
              <ExerciseFilters 
                availableExercises={availableExercises}
                selectedExercises={advancedFilters.selectedExercises}
                setSelectedExercises={(exercises) => setAdvancedFilters({ selectedExercises: exercises })}
                dark={dark}
              />
            )}

            {/* Période */}
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10, color: dark ? COLORS.white : COLORS.black }}>Période</Text>

            {/* Affichage de l'étape de sélection */}
            <View style={{
              backgroundColor: COLORS.primary,
              padding: 12,
              borderRadius: 8,
              marginBottom: 10
            }}>
              <Text style={{ color: COLORS.white, fontSize: 15, fontWeight: '500', textAlign: 'center' }}>
                {activityCalendarMode === 'start'
                  ? "Sélectionnez la date de début"
                  : "Sélectionnez la date de fin"}
              </Text>
              {activityCalendarMode === 'end' && activityDateRange.startDate && (
                <Text style={{ color: COLORS.white, fontSize: 13, textAlign: 'center', marginTop: 4, opacity: 0.9 }}>
                  Date de début: {new Date(activityDateRange.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </Text>
              )}
            </View>
            {/* Calendrier */}
            <Calendar
  style={{ borderRadius: 10, marginBottom: 20, backgroundColor: dark ? COLORS.dark1 : COLORS.white }}
  theme={{
    backgroundColor: dark ? COLORS.dark1 : COLORS.white,
    calendarBackground: dark ? COLORS.dark1 : COLORS.white,
    textSectionTitleColor: dark ? COLORS.white : COLORS.black,
    textSectionTitleDisabledColor: dark ? '#666' : '#ccc',
    selectedDayBackgroundColor: COLORS.primary,
    selectedDayTextColor: COLORS.white,
    todayTextColor: COLORS.primary,
    dayTextColor: dark ? COLORS.white : COLORS.black,
    textDisabledColor: dark ? '#666' : '#ccc', // Removed unnecessary curly braces
  }}
  markingType='period'
  markedDates={{
    ...(activityDateRange.startDate ? {
      [activityDateRange.startDate]: {
        startingDay: true,
        color: COLORS.primary,
        textColor: COLORS.white,
        selected: true
      }
    } : {}),
    ...(activityDateRange.endDate ? {
      [activityDateRange.endDate]: {
        endingDay: true,
        color: COLORS.primary,
        textColor: COLORS.white,
        selected: true
      }
    } : {})
  }}
  onDayPress={handleActivityDayPress}
/>

          </ScrollView>
          {/* Boutons d'action */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <TouchableOpacity
              style={{
                backgroundColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 10,
                flex: 1,
                marginRight: 10,
                alignItems: 'center'
              }}
              onPress={resetAllFilters}
            >
              <Text style={{ color: dark ? COLORS.white : COLORS.black }}>Réinitialiser</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: COLORS.primary, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, flex: 1, alignItems: 'center' }}
              onPress={() => toggleActivityCalendar()}
            >
              <Text style={{ color: COLORS.white, fontWeight: '600' }}>Appliquer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};