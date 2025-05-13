// app/Enfants/Historique/filtre.ts - improved version
import { useState, useEffect } from "react";

import type { Activity } from "../../../data/Enfants/CHILDREN_DATA";

import { enhanceActivity } from "../../../data/Enfants/CHILDREN_DATA";

// Define stronger types for our filter state
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
  // Initialize filter state with proper default values for all properties
  const [filters, setFilters] = useState<ActivityFiltersState>({
    searchKeyword: "",
    activityDateRange: {
      startDate: null,
      endDate: null,
    },
    showActivityCalendar: false,
    activityCalendarMode: "start",
    advancedFilters: {
      selectedAssistants: [], // Initialize as empty array, not undefined
      selectedSubjects: [],
      selectedChapters: [],
      selectedExercises: [],
    },
  });

  const [filteredActivities, setFilteredActivities] = useState<Activity[]>(
    activities || []
  );

  // Options state with default values
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [availableChapters, setAvailableChapters] = useState<string[]>([]);
  const [availableExercises, setAvailableExercises] = useState<string[]>([]);

  // Get available assistants from activities
  const getAvailableAssistants = () => {
    if (!activities || activities.length === 0) return [];

    const enhancedActivities = activities.map((activity) =>
      enhanceActivity(activity)
    );

    const assistants = enhancedActivities
      .map((activity) => activity.assistant)
      .filter((assistant): assistant is string => Boolean(assistant))
      .filter((value, index, self) => self.indexOf(value) === index);

    return assistants;
  };

  // Update available subjects when selected assistants change
  useEffect(() => {
    // Ensure selectedAssistants exists before trying to use it
    if (!filters.advancedFilters.selectedAssistants) {
      return;
    }

    if (filters.advancedFilters.selectedAssistants.includes("J'Apprends")) {
      // Filter activities by the selected assistant
      const enhancedActivities = activities.map((activity) =>
        enhanceActivity(activity)
      );
      const assistantActivities = enhancedActivities.filter(
        (activity) => activity.assistant === "J'Apprends"
      );

      // Extract unique subjects
      const subjects = assistantActivities
        .map((activity) => activity.matiere)
        .filter(
          (value, index, self) =>
            value && typeof value === "string" && self.indexOf(value) === index
        ) as string[];

      setAvailableSubjects(subjects);
    } else {
      setAvailableSubjects([]);
      // Reset cascade filters when J'Apprends is not selected
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

  // Update available chapters when selected subjects change
  useEffect(() => {
    if (
      !filters.advancedFilters.selectedSubjects ||
      filters.advancedFilters.selectedSubjects.length === 0
    ) {
      setAvailableChapters([]);
      return;
    }

    const enhancedActivities = activities.map((activity) =>
      enhanceActivity(activity)
    );
    const subjectActivities = enhancedActivities.filter(
      (activity) =>
        activity.assistant === "J'Apprends" &&
        activity.matiere &&
        filters.advancedFilters.selectedSubjects.includes(activity.matiere)
    );

    // Extract unique chapters
    const chapters = subjectActivities
      .map((activity) => activity.chapitre)
      .filter(
        (value, index, self) =>
          value && typeof value === "string" && self.indexOf(value) === index
      ) as string[];

    setAvailableChapters(chapters);

    // Reset exercise selection when subjects change
    if (filters.advancedFilters.selectedChapters.length > 0) {
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

  // Update available exercises when selected chapters change
  useEffect(() => {
    if (
      !filters.advancedFilters.selectedChapters ||
      filters.advancedFilters.selectedChapters.length === 0
    ) {
      setAvailableExercises([]);
      return;
    }

    const enhancedActivities = activities.map((activity) =>
      enhanceActivity(activity)
    );
    const chapterActivities = enhancedActivities.filter(
      (activity) =>
        activity.assistant === "J'Apprends" &&
        activity.matiere &&
        filters.advancedFilters.selectedSubjects.includes(activity.matiere) &&
        activity.chapitre &&
        filters.advancedFilters.selectedChapters.includes(activity.chapitre)
    );

    // Extract unique exercises
    const exercises = chapterActivities
      .map((activity) => activity.typeExercice)
      .filter(
        (value, index, self) =>
          value && typeof value === "string" && self.indexOf(value) === index
      ) as string[];

    setAvailableExercises(exercises);

    // Reset exercise selection when chapters change
    if (filters.advancedFilters.selectedExercises.length > 0) {
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

    // Enhance all activities to get additional data
    const enhancedActivities = activities.map((activity) =>
      enhanceActivity(activity)
    );

    // Apply search filter
    if (filters.searchKeyword.trim() !== "") {
      const keyword = filters.searchKeyword.toLowerCase();
      result = enhancedActivities.filter(
        (activity) =>
          (activity.activite &&
            activity.activite.toLowerCase().includes(keyword)) ||
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
      filters.activityDateRange.startDate ||
      filters.activityDateRange.endDate
    ) {
      result = result.filter((activity) => {
        if (!activity.date) return false;

        const activityDate = new Date(activity.date);

        // Check start date if set
        if (filters.activityDateRange.startDate) {
          const startDate = new Date(filters.activityDateRange.startDate);
          if (activityDate < startDate) return false;
        }

        // Check end date if set
        if (filters.activityDateRange.endDate) {
          const endDate = new Date(filters.activityDateRange.endDate);
          // End date should include the whole day
          endDate.setHours(23, 59, 59, 999);
          if (activityDate > endDate) return false;
        }

        return true;
      });
    }

    // Apply assistant filter
    if (
      filters.advancedFilters.selectedAssistants &&
      filters.advancedFilters.selectedAssistants.length > 0
    ) {
      result = result.filter(
        (activity) =>
          activity.assistant &&
          filters.advancedFilters.selectedAssistants.includes(
            activity.assistant
          )
      );
    }

    // Apply subject filter
    if (
      filters.advancedFilters.selectedSubjects &&
      filters.advancedFilters.selectedSubjects.length > 0
    ) {
      result = result.filter(
        (activity) =>
          activity.matiere &&
          filters.advancedFilters.selectedSubjects.includes(activity.matiere)
      );
    }

    // Apply chapter filter
    if (
      filters.advancedFilters.selectedChapters &&
      filters.advancedFilters.selectedChapters.length > 0
    ) {
      result = result.filter(
        (activity) =>
          activity.chapitre &&
          filters.advancedFilters.selectedChapters.includes(activity.chapitre)
      );
    }

    // Apply exercise filter
    if (
      filters.advancedFilters.selectedExercises &&
      filters.advancedFilters.selectedExercises.length > 0
    ) {
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

  // Set date range
  const setActivityDateRange = (range: {
    startDate: string | null;
    endDate: string | null;
  }) => {
    setFilters((prev) => ({
      ...prev,
      activityDateRange: range,
    }));
  };

  // Toggle calendar visibility with mode
  const toggleActivityCalendar = (mode: "start" | "end" = "start") => {
    setFilters((prev) => ({
      ...prev,
      showActivityCalendar: !prev.showActivityCalendar,
      activityCalendarMode: mode,
    }));
  };

  // Handle date selection
  const handleActivityDayPress = (day: { dateString: string }) => {
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

  // Set advanced filters - with safe type checking
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
        ...(newFilters.selectedAssistants !== undefined
          ? { selectedAssistants: newFilters.selectedAssistants }
          : {}),
        ...(newFilters.selectedSubjects !== undefined
          ? { selectedSubjects: newFilters.selectedSubjects }
          : {}),
        ...(newFilters.selectedChapters !== undefined
          ? { selectedChapters: newFilters.selectedChapters }
          : {}),
        ...(newFilters.selectedExercises !== undefined
          ? { selectedExercises: newFilters.selectedExercises }
          : {}),
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
      (filters.advancedFilters.selectedAssistants &&
        filters.advancedFilters.selectedAssistants.length > 0) ||
      (filters.advancedFilters.selectedSubjects &&
        filters.advancedFilters.selectedSubjects.length > 0) ||
      (filters.advancedFilters.selectedChapters &&
        filters.advancedFilters.selectedChapters.length > 0) ||
      (filters.advancedFilters.selectedExercises &&
        filters.advancedFilters.selectedExercises.length > 0)
    );
  };

  // Helper to get unique assistant types
  const getUniqueAssistantTypes = () => {
    return getAvailableAssistants();
  };

  // Debug function to log filter state
  const logFilterState = () => {
    console.log("Current filter state:", {
      searchKeyword: filters.searchKeyword,
      dateRange: filters.activityDateRange,
      advancedFilters: filters.advancedFilters,
      availableSubjects,
      availableChapters,
      availableExercises,
    });
  };

  return {
    searchKeyword: filters.searchKeyword,
    activityDateRange: filters.activityDateRange,
    showActivityCalendar: filters.showActivityCalendar,
    activityCalendarMode: filters.activityCalendarMode,
    advancedFilters: filters.advancedFilters,
    filteredActivities,
    // Return available options for UI
    availableSubjects,
    availableChapters,
    availableExercises,
    // Functions
    setSearchKeyword,
    toggleActivityCalendar,
    handleActivityDayPress,
    setAdvancedFilters,
    resetActivityFilters,
    getUniqueAssistantTypes,
    hasActiveFilters,
    setActivityDateRange,
    logFilterState, // Add debug function
  };
};
