// app/Enfants/Historique/filtres.tsx – Fixed version with correct imports
import type React from "react";

// Import from the correct path - your actual component files
import {
  FilterModal,
  SUBJECT_THEME,
  ASSISTANT_THEME,
  getActivityTheme,
  getProgressColor,
  SearchBarComponent,
  DateRangeIndicator,
  AssistantTypeFilters,
  extractAssistantType,
} from "./filtres/index";

// Re-export the SearchBar component with the original name for compatibility
export const SearchBar = SearchBarComponent;

// Re-export other components
export {
  FilterModal,
  DateRangeIndicator,
  SearchBarComponent,
  AssistantTypeFilters,
};

// Re-export helper functions and constants
export {
  SUBJECT_THEME,
  ASSISTANT_THEME,
  getActivityTheme,
  getProgressColor,
  extractAssistantType,
};

// Additional filter components for backward compatibility
interface SubjectFiltersProps {
  availableSubjects: string[];
  selectedSubjects: string[];
  setSelectedSubjects: (subjects: string[]) => void;
}

export const SubjectFilters: React.FC<SubjectFiltersProps> = () => {
  return null;
};

interface ChapterFiltersProps {
  availableChapters: string[];
  selectedChapters: string[];
  setSelectedChapters: (chapters: string[]) => void;
}

export const ChapterFilters: React.FC<ChapterFiltersProps> = () => {
  return null;
};

interface ExerciseFiltersProps {
  availableExercises: string[];
  selectedExercises: string[];
  setSelectedExercises: (exercises: string[]) => void;
}

export const ExerciseFilters: React.FC<ExerciseFiltersProps> = () => {
  return null;
};

export default {
  SearchBar,
  SearchBarComponent,
  DateRangeIndicator,
  FilterModal,
  SubjectFilters,
  ChapterFilters,
  ExerciseFilters,
};
