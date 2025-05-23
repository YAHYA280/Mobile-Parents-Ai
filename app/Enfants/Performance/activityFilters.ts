// Fixed activityFilters.ts
import { useRef, useState, useEffect, useCallback } from "react";

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
    selectedSubjects: string[];
    selectedChapters: string[];
    selectedExercises: string[]; // Ajout des exercices spécifiques
    selectedAssistants: string[];
    scoreRange: {
      min: number;
      max: number;
    };
  };
}

export const useActivityFilters = (activities: Activity[]) => {
  // Use a ref to store initial activities to avoid re-filtering on every render
  const activitiesRef = useRef<Activity[]>(activities);

  const [filters, setFilters] = useState<ActivityFiltersState>({
    searchKeyword: "",
    activityDateRange: {
      startDate: null,
      endDate: null,
    },
    showActivityCalendar: false,
    activityCalendarMode: "start",
    advancedFilters: {
      selectedSubjects: [],
      selectedChapters: [],
      selectedExercises: [], // Initialisation des exercices
      selectedAssistants: [],
      scoreRange: {
        min: 0,
        max: 100,
      },
    },
  });

  const [filteredActivities, setFilteredActivities] =
    useState<Activity[]>(activities);

  // Update activities ref when activities prop changes
  useEffect(() => {
    activitiesRef.current = activities;
  }, [activities]);

  // Memoize the filter function to avoid recreating it on every render
  const applyFilters = useCallback(() => {
    let result = [...activitiesRef.current];

    // Enhance all activities to get additional data like subject and assistant
    const enhancedActivities = result.map((activity) =>
      enhanceActivity(activity)
    );

    // Apply search filter
    if (filters.searchKeyword.trim() !== "") {
      const keyword = filters.searchKeyword.toLowerCase();
      result = enhancedActivities.filter(
        (activity) =>
          activity.activite.toLowerCase().includes(keyword) ||
          (activity.matiere &&
            activity.matiere.toLowerCase().includes(keyword)) ||
          (activity.assistant &&
            activity.assistant.toLowerCase().includes(keyword))
      );
    } else {
      result = enhancedActivities;
    }

    // Apply date range filter with both start and end dates
    if (
      filters.activityDateRange.startDate &&
      filters.activityDateRange.endDate
    ) {
      result = result.filter((activity) => {
        const activityDate = new Date(activity.date);
        const startDate = new Date(
          filters.activityDateRange.startDate as string
        );
        const endDate = new Date(filters.activityDateRange.endDate as string);

        // Include dates that are within the start and end dates (inclusive)
        return activityDate >= startDate && activityDate <= endDate;
      });
    } else if (filters.activityDateRange.startDate) {
      // If only start date is provided
      result = result.filter((activity) => {
        const activityDate = new Date(activity.date);
        const startDate = new Date(
          filters.activityDateRange.startDate as string
        );

        return activityDate >= startDate;
      });
    } else if (filters.activityDateRange.endDate) {
      // If only end date is provided
      result = result.filter((activity) => {
        const activityDate = new Date(activity.date);
        const endDate = new Date(filters.activityDateRange.endDate as string);

        return activityDate <= endDate;
      });
    }

    // Apply subject filter
    if (filters.advancedFilters.selectedSubjects.length > 0) {
      result = result.filter(
        (activity) =>
          activity.matiere &&
          filters.advancedFilters.selectedSubjects.includes(activity.matiere)
      );
    }

    // Apply chapter filter - nouveau filtre
    if (filters.advancedFilters.selectedChapters.length > 0) {
      result = result.filter(
        (activity) =>
          activity.chapitre &&
          filters.advancedFilters.selectedChapters.includes(activity.chapitre)
      );
    }

    // Apply exercise filter - nouveau filtre
    if (filters.advancedFilters.selectedExercises.length > 0) {
      result = result.filter(
        (activity) =>
          activity.typeExercice &&
          filters.advancedFilters.selectedExercises.includes(
            activity.typeExercice
          )
      );
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

    // Apply score range filter if score is a percentage
    if (
      filters.advancedFilters.scoreRange.min > 0 ||
      filters.advancedFilters.scoreRange.max < 100
    ) {
      result = result.filter((activity) => {
        if (!activity.score || !activity.score.includes("/")) return true;

        const [score, total] = activity.score
          .split("/")
          .map((num) => parseInt(num, 10));
        const percentage = (score / total) * 100;

        return (
          percentage >= filters.advancedFilters.scoreRange.min &&
          percentage <= filters.advancedFilters.scoreRange.max
        );
      });
    }

    setFilteredActivities(result);
  }, [filters]);

  // Apply filters whenever filter state changes
  useEffect(() => {
    applyFilters();
  }, [applyFilters]); // This will re-apply filters when the filters state changes

  // Set search keyword
  const setSearchKeyword = useCallback((keyword: string) => {
    setFilters((prev) => ({
      ...prev,
      searchKeyword: keyword,
    }));
  }, []);

  // Toggle calendar visibility
  const toggleActivityCalendar = useCallback((mode: "start" | "end") => {
    setFilters((prev) => ({
      ...prev,
      showActivityCalendar: !prev.showActivityCalendar,
      activityCalendarMode: mode,
    }));
  }, []);

  // Handle date selection
  const handleActivityDayPress = useCallback((day: any) => {
    const selectedDate = day.dateString;

    setFilters((prev) => ({
      ...prev,
      activityDateRange: {
        ...prev.activityDateRange,
        [prev.activityCalendarMode === "start" ? "startDate" : "endDate"]:
          selectedDate,
      },
      showActivityCalendar: false,
    }));
  }, []);

  // Set advanced filters
  const setAdvancedFilters = useCallback(
    (newFilters: {
      selectedSubjects?: string[];
      selectedChapters?: string[];
      selectedExercises?: string[]; // Ajout des exercices
      selectedAssistants?: string[];
      scoreRange?: {
        min: number;
        max: number;
      };
    }) => {
      setFilters((prev) => ({
        ...prev,
        advancedFilters: {
          ...prev.advancedFilters,
          ...newFilters,
        },
      }));
    },
    []
  );

  // Reset all filters
  const resetActivityFilters = useCallback(() => {
    setFilters({
      searchKeyword: "",
      activityDateRange: {
        startDate: null,
        endDate: null,
      },
      showActivityCalendar: false,
      activityCalendarMode: "start",
      advancedFilters: {
        selectedSubjects: [],
        selectedChapters: [],
        selectedExercises: [], // Réinitialisation des exercices
        selectedAssistants: [],
        scoreRange: {
          min: 0,
          max: 100,
        },
      },
    });
  }, []);

  return {
    searchKeyword: filters.searchKeyword,
    activityDateRange: filters.activityDateRange,
    showActivityCalendar: filters.showActivityCalendar,
    activityCalendarMode: filters.activityCalendarMode,
    advancedFilters: filters.advancedFilters,
    filteredActivities,
    setSearchKeyword,
    toggleActivityCalendar,
    handleActivityDayPress,
    setAdvancedFilters,
    resetActivityFilters,
  };
};
