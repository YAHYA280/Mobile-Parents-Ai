// app/Enfants/Historique/filtre.ts
import { useState, useEffect } from "react";

import type { Activity } from "../../../data/Enfants/CHILDREN_DATA";

import { enhanceActivity } from "../../../data/Enfants/CHILDREN_DATA";

interface ActivityFiltersState {
  searchKeyword: string;
  activityDateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  showActivityCalendar: boolean;
  activityCalendarMode: "start" | "end";
  advancedFilters: {
    selectedAssistants: string[];
    selectedSubjects: string[];
    selectedChapters: string[];
    selectedExercises: string[];
  };
}

export const useActivityFilters = (activities: Activity[]) => {
  const [filters, setFilters] = useState<ActivityFiltersState>({
    searchKeyword: "",
    activityDateRange: {
      startDate: null,
      endDate: null,
    },
    showActivityCalendar: false,
    activityCalendarMode: "start",
    advancedFilters: {
      selectedAssistants: [],
      selectedSubjects: [],
      selectedChapters: [],
      selectedExercises: [],
    },
  });

  const [filteredActivities, setFilteredActivities] =
    useState<Activity[]>(activities);

  // Nouveaux états pour les options disponibles en cascade
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [availableChapters, setAvailableChapters] = useState<string[]>([]);
  const [availableExercises, setAvailableExercises] = useState<string[]>([]);

  // Mettre à jour les assistants disponibles à partir des activités
  const getAvailableAssistants = () => {
    if (!activities || activities.length === 0) return [];

    const enhancedActivities = activities.map((activity) =>
      enhanceActivity(activity)
    );
    const assistants = enhancedActivities
      .map((activity) => activity.assistant)
      .filter((assistant): assistant is string => !!assistant)
      .filter((value, index, self) => self.indexOf(value) === index);

    return assistants;
  };

  // Mettre à jour les matières disponibles quand l'assistant change
  useEffect(() => {
    if (filters.advancedFilters.selectedAssistants.includes("J'Apprends")) {
      // Filtrer les activités par l'assistant sélectionné
      const enhancedActivities = activities.map((activity) =>
        enhanceActivity(activity)
      );
      const assistantActivities = enhancedActivities.filter(
        (activity) => activity.assistant === "J'Apprends"
      );

      // Extraire les matières uniques
      const subjects = assistantActivities
        .map((activity) => activity.matiere)
        .filter(
          (value, index, self) => value && self.indexOf(value) === index
        ) as string[];

      setAvailableSubjects(subjects);
    } else {
      setAvailableSubjects([]);
      // Réinitialiser les filtres en cascade si l'assistant n'est pas "J'Apprends"
      setFilters((prev) => ({
        ...prev,
        advancedFilters: {
          ...prev.advancedFilters,
          selectedSubjects: [],
          selectedChapters: [],
          selectedExercises: [],
        },
      }));
    }
  }, [filters.advancedFilters.selectedAssistants, activities]);

  // Mettre à jour les chapitres disponibles quand la matière change
  useEffect(() => {
    if (filters.advancedFilters.selectedSubjects.length > 0) {
      const enhancedActivities = activities.map((activity) =>
        enhanceActivity(activity)
      );
      const subjectActivities = enhancedActivities.filter(
        (activity) =>
          activity.assistant === "J'Apprends" &&
          filters.advancedFilters.selectedSubjects.includes(
            activity.matiere || ""
          )
      );

      // Extraire les chapitres uniques
      const chapters = subjectActivities
        .map((activity) => activity.chapitre)
        .filter(
          (value, index, self) => value && self.indexOf(value) === index
        ) as string[];

      setAvailableChapters(chapters);
    } else {
      setAvailableChapters([]);
      // Réinitialiser les filtres de chapitres et exercices si aucune matière n'est sélectionnée
      setFilters((prev) => ({
        ...prev,
        advancedFilters: {
          ...prev.advancedFilters,
          selectedChapters: [],
          selectedExercises: [],
        },
      }));
    }
  }, [filters.advancedFilters.selectedSubjects, activities]);

  // Mettre à jour les exercices disponibles quand le chapitre change
  useEffect(() => {
    if (filters.advancedFilters.selectedChapters.length > 0) {
      const enhancedActivities = activities.map((activity) =>
        enhanceActivity(activity)
      );
      const chapterActivities = enhancedActivities.filter(
        (activity) =>
          activity.assistant === "J'Apprends" &&
          filters.advancedFilters.selectedSubjects.includes(
            activity.matiere || ""
          ) &&
          filters.advancedFilters.selectedChapters.includes(
            activity.chapitre || ""
          )
      );

      // Extraire les exercices uniques
      const exercises = chapterActivities
        .map((activity) => activity.typeExercice)
        .filter(
          (value, index, self) => value && self.indexOf(value) === index
        ) as string[];

      setAvailableExercises(exercises);
    } else {
      setAvailableExercises([]);
      // Réinitialiser le filtre d'exercices si aucun chapitre n'est sélectionné
      setFilters((prev) => ({
        ...prev,
        advancedFilters: {
          ...prev.advancedFilters,
          selectedExercises: [],
        },
      }));
    }
  }, [
    filters.advancedFilters.selectedChapters,
    filters.advancedFilters.selectedSubjects,
    activities,
  ]);

  // Apply filters whenever activities or filter state changes
  useEffect(() => {
    if (!activities || activities.length === 0) {
      setFilteredActivities([]);
      return;
    }

    let result = [...activities];

    // Enhance all activities to get additional data like subject and assistant
    const enhancedActivities = activities.map((activity) =>
      enhanceActivity(activity)
    );

    // Apply search filter
    if (filters.searchKeyword.trim() !== "") {
      const keyword = filters.searchKeyword.toLowerCase();
      result = enhancedActivities.filter(
        (activity) =>
          activity.activite?.toLowerCase().includes(keyword) ||
          (activity.matiere &&
            activity.matiere.toLowerCase().includes(keyword)) ||
          (activity.assistant &&
            activity.assistant.toLowerCase().includes(keyword))
      );
    } else {
      result = enhancedActivities;
    }

    // Apply date range filter
    if (
      filters.activityDateRange.startDate &&
      filters.activityDateRange.endDate
    ) {
      result = result.filter((activity) => {
        if (!activity.date) return false;

        const activityDate = new Date(activity.date);
        const startDate = new Date(
          filters.activityDateRange.startDate as string
        );
        const endDate = new Date(filters.activityDateRange.endDate as string);

        // End date should include the whole day
        endDate.setHours(23, 59, 59, 999);

        return activityDate >= startDate && activityDate <= endDate;
      });
    } else if (filters.activityDateRange.startDate) {
      result = result.filter((activity) => {
        if (!activity.date) return false;

        const activityDate = new Date(activity.date);
        const startDate = new Date(
          filters.activityDateRange.startDate as string
        );

        return activityDate >= startDate;
      });
    } else if (filters.activityDateRange.endDate) {
      result = result.filter((activity) => {
        if (!activity.date) return false;

        const activityDate = new Date(activity.date);
        const endDate = new Date(filters.activityDateRange.endDate as string);

        // End date should include the whole day
        endDate.setHours(23, 59, 59, 999);

        return activityDate <= endDate;
      });
    }

    // Apply assistant filter
    if (filters.advancedFilters.selectedAssistants.length > 0) {
      result = result.filter(
        (activity) =>
          activity.assistant &&
          filters.advancedFilters.selectedAssistants.includes(
            activity.assistant
          )
      );
    }

    // Apply subject filter
    if (filters.advancedFilters.selectedSubjects.length > 0) {
      result = result.filter(
        (activity) =>
          activity.matiere &&
          filters.advancedFilters.selectedSubjects.includes(activity.matiere)
      );
    }

    // Apply chapter filter
    if (filters.advancedFilters.selectedChapters.length > 0) {
      result = result.filter(
        (activity) =>
          activity.chapitre &&
          filters.advancedFilters.selectedChapters.includes(activity.chapitre)
      );
    }

    // Apply exercise filter
    if (filters.advancedFilters.selectedExercises.length > 0) {
      result = result.filter(
        (activity) =>
          activity.typeExercice &&
          filters.advancedFilters.selectedExercises.includes(
            activity.typeExercice
          )
      );
    }

    setFilteredActivities(result);
  }, [activities, filters]);

  // Set search keyword
  const setSearchKeyword = (keyword: string) => {
    setFilters((prev) => ({
      ...prev,
      searchKeyword: keyword,
    }));
  };

  const setActivityDateRange = (range: {
    startDate: string | null;
    endDate: string | null;
  }) => {
    setFilters((prev) => ({
      ...prev,
      activityDateRange: range,
    }));
  };

  // Toggle calendar visibility
  const toggleActivityCalendar = (mode: "start" | "end" = "start") => {
    setFilters((prev) => ({
      ...prev,
      showActivityCalendar: !prev.showActivityCalendar,
      activityCalendarMode: mode,
    }));
  };

  // Handle date selection
  const handleActivityDayPress = (day: any) => {
    const selectedDate = day.dateString;

    setFilters((prev) => {
      let newStartDate = prev.activityDateRange.startDate;
      let newEndDate = prev.activityDateRange.endDate;

      if (prev.activityCalendarMode === "start") {
        newStartDate = selectedDate;

        // If end date is before start date, reset end date
        if (newEndDate && new Date(selectedDate) > new Date(newEndDate)) {
          newEndDate = null;
        }
      } else {
        newEndDate = selectedDate;

        // If start date is after end date, reset start date
        if (newStartDate && new Date(selectedDate) < new Date(newStartDate)) {
          newStartDate = null;
        }
      }

      return {
        ...prev,
        activityDateRange: {
          startDate: newStartDate,
          endDate: newEndDate,
        },
        activityCalendarMode:
          prev.activityCalendarMode === "start" ? "end" : "start",
        showActivityCalendar: false, // Close calendar after selection
      };
    });
  };

  // Set advanced filters
  const setAdvancedFilters = (newFilters: {
    selectedAssistants?: string[];
    selectedSubjects?: string[];
    selectedChapters?: string[];
    selectedExercises?: string[];
  }) => {
    setFilters((prev) => ({
      ...prev,
      advancedFilters: {
        ...prev.advancedFilters,
        ...newFilters,
      },
    }));
  };

  // Reset all filters
  const resetActivityFilters = () => {
    setFilters({
      searchKeyword: "",
      activityDateRange: {
        startDate: null,
        endDate: null,
      },
      showActivityCalendar: false,
      activityCalendarMode: "start",
      advancedFilters: {
        selectedAssistants: [],
        selectedSubjects: [],
        selectedChapters: [],
        selectedExercises: [],
      },
    });
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      filters.searchKeyword !== "" ||
      filters.activityDateRange.startDate !== null ||
      filters.activityDateRange.endDate !== null ||
      filters.advancedFilters.selectedAssistants.length > 0 ||
      filters.advancedFilters.selectedSubjects.length > 0 ||
      filters.advancedFilters.selectedChapters.length > 0 ||
      filters.advancedFilters.selectedExercises.length > 0
    );
  };

  // Helper to get unique assistant types
  const getUniqueAssistantTypes = () => {
    return getAvailableAssistants();
  };

  return {
    searchKeyword: filters.searchKeyword,
    activityDateRange: filters.activityDateRange,
    showActivityCalendar: filters.showActivityCalendar,
    activityCalendarMode: filters.activityCalendarMode,
    advancedFilters: filters.advancedFilters,
    filteredActivities,
    // Retourner les options disponibles pour l'interface utilisateur
    availableSubjects,
    availableChapters,
    availableExercises,
    setSearchKeyword,
    toggleActivityCalendar,
    handleActivityDayPress,
    setAdvancedFilters,
    resetActivityFilters,
    getUniqueAssistantTypes,
    hasActiveFilters,
    setActivityDateRange,
  };
};
