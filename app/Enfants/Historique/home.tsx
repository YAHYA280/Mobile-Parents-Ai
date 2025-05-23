// app/Enfants/Historique/home.tsx - Clean version
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "expo-router";
import { View, Animated, StatusBar, SafeAreaView } from "react-native";
import type { Child, Activity } from "../../../data/Enfants/CHILDREN_DATA";
import { useActivityFilters } from "./filtre";

// Import the new filter components
import {
  SearchBarComponent,
  DateRangeIndicator,
  FilterModal,
} from "@/app/Enfants/Historique/filtres/index";

// Import other components
import HistoriqueHeader from "../../Enfants/Historique/components/HistoriqueHeader";
import ActivityList from "../../Enfants/Historique/components/ActivityList";
import LoadingIndicator from "../../Enfants/Historique/components/LoadingIndicator";
import EmptyTipsModal from "../../Enfants/Historique/components/EmptyTipsModal";

interface HistoriqueActivitesProps {
  isTabComponent?: boolean;
  childData: Child;
}

const HistoriqueActivites: React.FC<HistoriqueActivitesProps> = ({
  isTabComponent = false,
  childData,
}) => {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // States
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmptyTips, setShowEmptyTips] = useState(false);

  // Activity filters
  const {
    searchKeyword,
    activityDateRange,
    showActivityCalendar,
    activityCalendarMode,
    advancedFilters,
    filteredActivities,
    availableSubjects,
    availableChapters,
    availableExercises,
    setSearchKeyword,
    setActivityDateRange,
    toggleActivityCalendar,
    handleActivityDayPress,
    setAdvancedFilters,
    resetActivityFilters,
    getUniqueAssistantTypes,
    hasActiveFilters,
  } = useActivityFilters(childData?.activitesRecentes || []);

  // Load data and start animations
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, 500);

    return () => clearTimeout(timer);
  }, [fadeAnim, slideAnim]);

  // Get unique assistant types
  const uniqueAssistantTypes = getUniqueAssistantTypes();

  // Go back
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // Handle page change
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage === currentPage) return;
      setCurrentPage(newPage);
    },
    [currentPage]
  );

  // View activity details
  const viewActivityDetails = useCallback(
    (activity: Activity) => {
      if (activity.id === undefined) {
        console.warn("Activity missing ID, cannot navigate to details");
        return;
      }

      router.push({
        pathname: "/Enfants/Historique/historydetails",
        params: {
          activityId: activity.id.toString(),
          childId: childData?.id?.toString() || "0",
        },
      });
    },
    [router, childData]
  );

  // Handle assistant types selection with proper typing
  const handleAssistantTypesChange = useCallback(
    (assistantsUpdater: ((prev: string[]) => string[]) | string[]) => {
      if (typeof assistantsUpdater === "function") {
        const newAssistants = assistantsUpdater(
          advancedFilters.selectedAssistants
        );
        setAdvancedFilters({ selectedAssistants: newAssistants });
      } else {
        setAdvancedFilters({ selectedAssistants: assistantsUpdater });
      }
    },
    [advancedFilters.selectedAssistants, setAdvancedFilters]
  );

  // Main content
  const renderContent = () => (
    <Animated.View
      style={{
        flex: 1,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      {/* Search Bar Component */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <SearchBarComponent
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          activityDateRange={activityDateRange}
          toggleActivityCalendar={toggleActivityCalendar}
          resetAllFilters={resetActivityFilters}
          hasFilters={hasActiveFilters()}
        />

        {/* Date Range Indicator */}
        <DateRangeIndicator
          activityDateRange={activityDateRange}
          setActivityDateRange={setActivityDateRange}
        />
      </View>

      {/* Activities List */}
      <View style={{ flex: 1, paddingHorizontal: 16, marginTop: 16 }}>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <ActivityList
            activities={filteredActivities}
            currentPage={currentPage}
            isTabComponent={isTabComponent}
            isLoading={isLoading}
            onPageChange={handlePageChange}
            onViewDetails={viewActivityDetails}
            hasActiveFilters={hasActiveFilters()}
            resetFilters={resetActivityFilters}
            onShowTips={() => setShowEmptyTips(true)}
          />
        )}
      </View>

      {/* Filter Modal */}
      <FilterModal
        showActivityCalendar={showActivityCalendar}
        toggleActivityCalendar={toggleActivityCalendar}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        uniqueAssistantTypes={uniqueAssistantTypes}
        selectedAssistantTypes={advancedFilters.selectedAssistants}
        setSelectedAssistantTypes={handleAssistantTypesChange}
        activityCalendarMode={activityCalendarMode}
        activityDateRange={activityDateRange}
        handleActivityDayPress={handleActivityDayPress}
        resetAllFilters={resetActivityFilters}
        availableSubjects={availableSubjects}
        availableChapters={availableChapters}
        availableExercises={availableExercises}
        advancedFilters={advancedFilters}
        setAdvancedFilters={setAdvancedFilters}
      />

      {/* Empty Tips Modal */}
      <EmptyTipsModal
        visible={showEmptyTips}
        onClose={() => setShowEmptyTips(false)}
      />
    </Animated.View>
  );

  // Component layout varies based on isTabComponent
  if (isTabComponent) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F8F8F8",
        }}
      >
        {renderContent()}
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <HistoriqueHeader onBackPress={handleBack} childData={childData} />
      {renderContent()}
    </SafeAreaView>
  );
};

export default HistoriqueActivites;
