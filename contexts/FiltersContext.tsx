import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { ActivityFilter } from "@/types/activity";

interface FiltersContextType {
  filters: ActivityFilter;
  updateFilter: (filterType: keyof ActivityFilter, value: any) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  getFilterCount: () => number;
}

const initialFilters: ActivityFilter = {
  dateRange: {
    startDate: null,
    endDate: null,
  },
  selectedAssistants: [],
  selectedSubjects: [],
  selectedDifficulties: [],
};

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

interface FiltersProviderProps {
  children: ReactNode;
  onApplyFilters?: (filters: ActivityFilter) => void;
}

export const FiltersProvider: React.FC<FiltersProviderProps> = ({
  children,
  onApplyFilters,
}) => {
  const [filters, setFilters] = useState<ActivityFilter>(initialFilters);

  // Update filter values
  const updateFilter = useCallback(
    (filterType: keyof ActivityFilter, value: any) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [filterType]: value,
      }));
    },
    []
  );

  // Apply filters
  const applyFilters = useCallback(() => {
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
  }, [filters, onApplyFilters]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    if (onApplyFilters) {
      onApplyFilters(initialFilters);
    }
  }, [onApplyFilters]);

  // Get total count of active filters
  const getFilterCount = useCallback(() => {
    return (
      (filters.dateRange.startDate ? 1 : 0) +
      filters.selectedAssistants.length +
      filters.selectedSubjects.length +
      filters.selectedDifficulties.length
    );
  }, [
    filters.dateRange.startDate,
    filters.selectedAssistants.length,
    filters.selectedSubjects.length,
    filters.selectedDifficulties.length,
  ]);

  const value = {
    filters,
    updateFilter,
    applyFilters,
    resetFilters,
    getFilterCount,
  };

  return (
    <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FiltersProvider");
  }
  return context;
};

export default FiltersContext;
