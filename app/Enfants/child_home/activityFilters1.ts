import { useState, useEffect, useCallback } from "react";

import type { Activity } from "../../../data/Enfants/CHILDREN_DATA";

type DateRange = {
  startDate: string | null;
  endDate: null | string;
};

export const useActivityFilters = (initialActivities: Activity[] = []) => {
  // États pour les filtres
  const [activityDateRange, setActivityDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showActivityCalendar, setShowActivityCalendar] = useState(false);
  const [activityCalendarMode, setActivityCalendarMode] = useState<
    "start" | "end"
  >("start");
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);

  // Fonction pour basculer l'affichage du calendrier d'activités
  const toggleActivityCalendar = (mode: "start" | "end") => {
    setActivityCalendarMode(mode);
    setShowActivityCalendar(!showActivityCalendar);
  };

  // Fonction pour gérer la sélection d'une date dans le calendrier d'activités
  const handleActivityDayPress = (day: any) => {
    if (activityCalendarMode === "start") {
      setActivityDateRange({
        startDate: day.dateString,
        endDate:
          activityDateRange.endDate &&
          new Date(day.dateString) > new Date(activityDateRange.endDate)
            ? day.dateString
            : activityDateRange.endDate,
      });
    } else {
      setActivityDateRange({
        startDate:
          activityDateRange.startDate &&
          new Date(day.dateString) < new Date(activityDateRange.startDate)
            ? day.dateString
            : activityDateRange.startDate,
        endDate: day.dateString,
      });
    }
    setShowActivityCalendar(false);
  };

  // Memoize the filterActivities function
  const filterActivities = useCallback(
    (activities: Activity[]) => {
      if (!activities || activities.length === 0) return [];

      let filtered = [...activities];

      // Filtre par mot-clé
      if (searchKeyword.trim() !== "") {
        const keyword = searchKeyword.toLowerCase();
        filtered = filtered.filter((activity) =>
          activity.activite.toLowerCase().includes(keyword)
        );
      }

      // Filtre par plage de dates
      if (activityDateRange.startDate) {
        filtered = filtered.filter((activity) => {
          const activityDate = new Date(activity.date);
          const startDate = new Date(activityDateRange.startDate!);
          return activityDate >= startDate;
        });
      }

      if (activityDateRange.endDate) {
        filtered = filtered.filter((activity) => {
          const activityDate = new Date(activity.date);
          const endDate = new Date(activityDateRange.endDate!);
          // Ajoutez 1 jour pour inclure la date de fin
          endDate.setDate(endDate.getDate() + 1);
          return activityDate < endDate;
        });
      }

      return filtered;
    },
    [searchKeyword, activityDateRange]
  );

  // Fonction pour réinitialiser les filtres d'activités
  const resetActivityFilters = () => {
    setActivityDateRange({ startDate: null, endDate: null });
    setSearchKeyword("");
  };

  // Effet pour mettre à jour les activités filtrées
  useEffect(() => {
    setFilteredActivities(filterActivities(initialActivities));
  }, [initialActivities, filterActivities]);

  return {
    // États
    activityDateRange,
    searchKeyword,
    showActivityCalendar,
    activityCalendarMode,
    filteredActivities,

    // Setters
    setActivityDateRange,
    setSearchKeyword,
    setShowActivityCalendar,
    setActivityCalendarMode,

    // Fonctions
    toggleActivityCalendar,
    handleActivityDayPress,
    resetActivityFilters,
  };
};
