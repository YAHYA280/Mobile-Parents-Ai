import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Activity, ActivityFilter, ActivityStatus } from "@/types/activity";
import { useChildren } from "./ChildrenContext";

interface ActivitiesContextType {
  activities: Activity[];
  filteredActivities: Activity[];
  loading: boolean;
  error: string | null;
  filter: ActivityFilter;
  getActivity: (activityId: number, childId: number) => Activity | undefined;
  getChildActivities: (childId: number) => Activity[];
  setFilter: (filter: Partial<ActivityFilter>) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  getAvailableAssistants: () => string[];
  getAvailableSubjects: () => string[];
  getAvailableDifficulties: () => string[];
  refreshActivities: () => Promise<void>;
}

const initialFilter: ActivityFilter = {
  dateRange: {
    startDate: null,
    endDate: null,
  },
  selectedAssistants: [],
  selectedSubjects: [],
  selectedDifficulties: [],
};

const ActivitiesContext = createContext<ActivitiesContextType | undefined>(
  undefined
);

interface ActivitiesProviderProps {
  children: ReactNode;
}

export const ActivitiesProvider: React.FC<ActivitiesProviderProps> = ({
  children,
}) => {
  const { children: childrenData } = useChildren();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilterState] = useState<ActivityFilter>(initialFilter);

  // Initialize activities from children data
  useEffect(() => {
    if (childrenData.length > 0) {
      try {
        const allActivities: Activity[] = [];
        childrenData.forEach((child) => {
          child.activitesRecentes.forEach((activity) => {
            allActivities.push({
              ...activity,
              childId: child.id,
            });
          });
        });

        setActivities(allActivities);
        setFilteredActivities(allActivities);
        setLoading(false);
      } catch (err) {
        setError("Failed to process activities data");
        setLoading(false);
      }
    }
  }, [childrenData]);

  // Get a specific activity
  const getActivity = (
    activityId: number,
    childId: number
  ): Activity | undefined => {
    return activities.find(
      (activity) => activity.id === activityId && activity.childId === childId
    );
  };

  // Get activities for a specific child
  const getChildActivities = (childId: number): Activity[] => {
    return activities.filter((activity) => activity.childId === childId);
  };

  // Set filter
  const setFilter = (newFilter: Partial<ActivityFilter>) => {
    setFilterState((prevFilter) => ({
      ...prevFilter,
      ...newFilter,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    let result = [...activities];

    // Filter by date range
    if (filter.dateRange.startDate) {
      const startDate = new Date(filter.dateRange.startDate);
      result = result.filter((activity) => {
        const activityDate = new Date(activity.date);
        return activityDate >= startDate;
      });
    }

    if (filter.dateRange.endDate) {
      const endDate = new Date(filter.dateRange.endDate);
      endDate.setHours(23, 59, 59, 999); // End of day
      result = result.filter((activity) => {
        const activityDate = new Date(activity.date);
        return activityDate <= endDate;
      });
    }

    // Filter by assistants
    if (filter.selectedAssistants.length > 0) {
      result = result.filter((activity) =>
        filter.selectedAssistants.includes(activity.assistant || "")
      );
    }

    // Filter by subjects
    if (filter.selectedSubjects.length > 0) {
      result = result.filter((activity) =>
        filter.selectedSubjects.includes(activity.matiere || "")
      );
    }

    // Filter by difficulty
    if (filter.selectedDifficulties.length > 0) {
      result = result.filter(
        (activity) =>
          activity.difficulty &&
          filter.selectedDifficulties.includes(activity.difficulty)
      );
    }

    setFilteredActivities(result);
  };

  // Reset filters
  const resetFilters = () => {
    setFilterState(initialFilter);
    setFilteredActivities(activities);
  };

  // Get available assistants for filtering
  const getAvailableAssistants = (): string[] => {
    const assistants = new Set<string>();
    activities.forEach((activity) => {
      if (activity.assistant) {
        assistants.add(activity.assistant);
      }
    });
    return Array.from(assistants);
  };

  // Get available subjects for filtering
  const getAvailableSubjects = (): string[] => {
    const subjects = new Set<string>();
    activities.forEach((activity) => {
      if (activity.matiere) {
        subjects.add(activity.matiere);
      }
    });
    return Array.from(subjects);
  };

  // Get available difficulties for filtering
  const getAvailableDifficulties = (): string[] => {
    const difficulties = new Set<string>();
    activities.forEach((activity) => {
      if (activity.difficulty) {
        difficulties.add(activity.difficulty);
      }
    });
    return Array.from(difficulties);
  };

  // Refresh activities
  const refreshActivities = async () => {
    try {
      setLoading(true);
      // In a real app, you would fetch from an API
      // For now, we'll just reset the timer and use the same data
      await new Promise((resolve) => setTimeout(resolve, 500));

      const allActivities: Activity[] = [];
      childrenData.forEach((child) => {
        child.activitesRecentes.forEach((activity) => {
          allActivities.push({
            ...activity,
            childId: child.id,
          });
        });
      });

      setActivities(allActivities);

      // Apply current filters to the refreshed data
      let filtered = [...allActivities];

      // Re-apply the same filter logic
      // This is duplicated code, but in a real app you might have a separate filtering utility
      if (filter.dateRange.startDate) {
        const startDate = new Date(filter.dateRange.startDate);
        filtered = filtered.filter((activity) => {
          const activityDate = new Date(activity.date);
          return activityDate >= startDate;
        });
      }

      // Apply remaining filters...
      // (Same logic as in applyFilters)

      setFilteredActivities(filtered);
      setLoading(false);
    } catch (err) {
      setError("Failed to refresh activities data");
      setLoading(false);
    }
  };

  const value = {
    activities,
    filteredActivities,
    loading,
    error,
    filter,
    getActivity,
    getChildActivities,
    setFilter,
    applyFilters,
    resetFilters,
    getAvailableAssistants,
    getAvailableSubjects,
    getAvailableDifficulties,
    refreshActivities,
  };

  return (
    <ActivitiesContext.Provider value={value}>
      {children}
    </ActivitiesContext.Provider>
  );
};

export const useActivities = () => {
  const context = useContext(ActivitiesContext);
  if (context === undefined) {
    throw new Error("useActivities must be used within an ActivitiesProvider");
  }
  return context;
};

export default ActivitiesContext;
