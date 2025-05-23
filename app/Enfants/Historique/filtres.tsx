import type { DateData } from "react-native-calendars";

import React from "react";

import {
  FilterModal,
  SearchBarComponent,
  DateRangeIndicator,
} from "@/app/Enfants/Historique/filtres/index.js";

export const SearchBar = SearchBarComponent;

export { FilterModal, DateRangeIndicator };

export {
  SUBJECT_THEME,
  ASSISTANT_THEME,
  getActivityTheme,
  getProgressColor,
  extractAssistantType,
} from "@/app/Enfants/Historique/filtres/index.js";

interface SubjectFiltersProps {
  availableSubjects: string[];
  selectedSubjects: string[];
  setSelectedSubjects: (subjects: string[]) => void;
}

export const SubjectFilters: React.FC<SubjectFiltersProps> = ({
  availableSubjects,
  selectedSubjects,
  setSelectedSubjects,
}) => {
  return null;
};

interface ChapterFiltersProps {
  availableChapters: string[];
  selectedChapters: string[];
  setSelectedChapters: (chapters: string[]) => void;
}

export const ChapterFilters: React.FC<ChapterFiltersProps> = ({
  availableChapters,
  selectedChapters,
  setSelectedChapters,
}) => {
  // Implementation would go here - simplified for now
  return null;
};

interface ExerciseFiltersProps {
  availableExercises: string[];
  selectedExercises: string[];
  setSelectedExercises: (exercises: string[]) => void;
}

export const ExerciseFilters: React.FC<ExerciseFiltersProps> = ({
  availableExercises,
  selectedExercises,
  setSelectedExercises,
}) => {
  // Implementation would go here - simplified for now
  return null;
};

// Main FilterModal component with cleaned up props
interface CleanFilterModalProps {
  showActivityCalendar: boolean;
  toggleActivityCalendar: () => void;
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  uniqueAssistantTypes: string[];
  activityCalendarMode: "start" | "end";
  activityDateRange: { startDate: string | null; endDate: string | null };
  handleActivityDayPress: (day: DateData) => void;
  resetAllFilters: () => void;
  advancedFilters: {
    selectedAssistants: string[];
    selectedSubjects: string[];
    selectedChapters: string[];
    selectedExercises: string[];
  };
  setAdvancedFilters: (filters: any) => void;
}

// Clean version of FilterModal without unused props
export const CleanFilterModal: React.FC<CleanFilterModalProps> = (props) => {
  return <FilterModal {...props} />;
};

export default {
  SearchBar,
  DateRangeIndicator,
  FilterModal,
  SubjectFilters,
  ChapterFilters,
  ExerciseFilters,
  CleanFilterModal,
};
