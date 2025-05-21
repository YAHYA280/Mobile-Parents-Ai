// Historique home component/FilterSection.tsx
import React from "react";
import { View } from "react-native";
import {
  SearchBar,
  DateRangeIndicator,
  AssistantTypeFilters,
} from "../filtres";

interface FilterSectionProps {
  searchKeyword: string;
  setSearchKeyword: (text: string) => void;
  activityDateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  setActivityDateRange: (range: {
    startDate: string | null;
    endDate: string | null;
  }) => void;
  toggleActivityCalendar: (mode: "start" | "end") => void;
  resetAllFilters: () => void;
  hasFilters: boolean;
  uniqueAssistantTypes: string[];
  selectedAssistantTypes: string[];
  setSelectedAssistantTypes: (
    assistants: string[] | ((prev: string[]) => string[])
  ) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  searchKeyword,
  setSearchKeyword,
  activityDateRange,
  setActivityDateRange,
  toggleActivityCalendar,
  resetAllFilters,
  hasFilters,
  uniqueAssistantTypes,
  selectedAssistantTypes,
  setSelectedAssistantTypes,
}) => {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
      {/* Search Bar */}
      <SearchBar
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        activityDateRange={activityDateRange}
        toggleActivityCalendar={() => toggleActivityCalendar("start")}
        resetAllFilters={resetAllFilters}
        hasFilters={hasFilters}
      />

      {/* Date Range Indicator */}
      {(activityDateRange.startDate || activityDateRange.endDate) && (
        <DateRangeIndicator
          activityDateRange={activityDateRange}
          setActivityDateRange={setActivityDateRange}
        />
      )}

      {/* Assistant Type Filters */}
      {uniqueAssistantTypes.length > 0 && (
        <AssistantTypeFilters
          uniqueAssistantTypes={uniqueAssistantTypes}
          selectedAssistantTypes={selectedAssistantTypes}
          setSelectedAssistantTypes={setSelectedAssistantTypes}
        />
      )}
    </View>
  );
};

export default FilterSection;
