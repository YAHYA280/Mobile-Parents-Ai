// Fixed home.tsx - Ensures all cards show data immediately
import React, { useRef, useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Animated,
  StatusBar,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import type { Child } from "../../../data/Enfants/CHILDREN_DATA";

import { COLORS } from "../../../constants/theme";
import { useActivityFilters } from "./activityFilters";
import LoadingScreen from "./components/LoadingScreen";
import GlobalScoreCard from "./components/GlobalScoreCard";
// Import components
import PerformanceHeader from "./components/PerformanceHeader";
import ProgressTrendsCard from "./components/ProgressTrendsCard";
import SkillBreakdownCard from "./components/SkillBreakdownCard";
import RecommendationsCard from "./components/RecommendationsCard";
import { CHILDREN_DATA } from "../../../data/Enfants/CHILDREN_DATA";
import TimeDistributionCard from "./components/TimeDistributionCard";
import SubjectPerformanceCard from "./components/SubjectPerformanceCard";
import PerformanceFilterModal from "./components/PerformanceFilterModal";

// Performance component props
interface PerformanceHomeProps {
  childData?: Child;
  isTabComponent?: boolean;
}

const PerformanceHome: React.FC<PerformanceHomeProps> = ({
  childData: propChildData,
  isTabComponent = false,
}) => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const childId = Number(params.childId || 0);

  // Simple animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // State
  const [childData, setChildData] = useState<Child | null>(
    propChildData || null
  );
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // FIX: Always provide mock activities to ensure filters work
  const mockActivities = childData?.activitesRecentes || [];

  const {
    searchKeyword,
    activityDateRange,
    showActivityCalendar,
    activityCalendarMode,
    advancedFilters,
    filteredActivities,
    toggleActivityCalendar,
    handleActivityDayPress,
    setAdvancedFilters,
    resetActivityFilters,
  } = useActivityFilters(mockActivities);

  // Load child data if not provided via props
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // If childData already provided via props, use that
        if (propChildData) {
          setChildData(propChildData);
        }
        // Otherwise load from the ID in the route params
        else if (childId > 0) {
          const foundChild = CHILDREN_DATA.find((c) => c.id === childId);

          if (!foundChild) {
            console.error("Child not found with ID:", childId);
            router.back();
            return;
          }

          setChildData(foundChild);
        } else if (CHILDREN_DATA.length > 0) {
          // Default to first child if no ID provided
          setChildData(CHILDREN_DATA[0]);
        }

        // FIX: Reduce loading time and start animations immediately
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();

          setIsLoading(false);
        }, 200); // Reduced from 500ms to 200ms
      } catch (error) {
        console.error("Error loading performance data:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, [childId, fadeAnim, propChildData, router, slideAnim]);

  // Toggle filter modal
  const toggleFilterModal = () => {
    setShowFilterModal((prev) => !prev);
  };

  // Handle navigation back
  const handleBack = () => {
    router.back();
  };

  // Handle sharing
  const handleShare = () => {
    console.log("Share performance report");
  };

  // FIX: Check if any filters are applied
  const hasFilters =
    searchKeyword !== "" ||
    activityDateRange.startDate !== null ||
    activityDateRange.endDate !== null ||
    advancedFilters.selectedAssistants.length > 0 ||
    advancedFilters.selectedSubjects.length > 0 ||
    advancedFilters.selectedChapters.length > 0 ||
    advancedFilters.selectedExercises.length > 0 ||
    advancedFilters.scoreRange.min > 0 ||
    advancedFilters.scoreRange.max < 100;

  // If still loading, show skeleton UI
  if (isLoading) {
    return <LoadingScreen />;
  }

  // If no child data available
  if (!childData) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Données non disponibles
          </Text>
          <TouchableOpacity
            onPress={handleBack}
            style={{
              backgroundColor: COLORS.primary,
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 25,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Main content render
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Only show header if not in tab component mode */}
      {!isTabComponent && (
        <PerformanceHeader
          childName={childData.name}
          childClass={childData.classe}
          onBackPress={handleBack}
          onSharePress={handleShare}
        />
      )}

      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: isTabComponent ? 100 : 30,
          }}
        >
          {/* Global Score Card - FIX: Always pass activities, even if empty */}
          <GlobalScoreCard
            activities={filteredActivities}
            hasFilters={hasFilters}
            onFilterPress={toggleFilterModal}
            onResetFilters={resetActivityFilters}
          />

          {/* Subject Performance Card - FIX: Always shows mock data */}
          <SubjectPerformanceCard activities={filteredActivities} />

          {/* Skill Breakdown Card - FIX: Always shows mock data */}
          <SkillBreakdownCard childData={childData} />

          {/* Progress Trends Card - FIX: Always shows mock data */}
          <ProgressTrendsCard activities={filteredActivities} />

          {/* Time Distribution Card - FIX: Always shows mock data */}
          <TimeDistributionCard activities={filteredActivities} />

          {/* Recommendations Card */}
          <RecommendationsCard childData={childData} />
        </ScrollView>
      </Animated.View>

      {/* Filter Modal */}
      <PerformanceFilterModal
        showFilterModal={showFilterModal}
        toggleFilterModal={toggleFilterModal}
        activityDateRange={activityDateRange}
        showActivityCalendar={showActivityCalendar}
        activityCalendarMode={activityCalendarMode}
        advancedFilters={advancedFilters}
        toggleActivityCalendar={toggleActivityCalendar}
        handleActivityDayPress={handleActivityDayPress}
        setAdvancedFilters={setAdvancedFilters}
        resetActivityFilters={resetActivityFilters}
        childData={childData}
      />
    </SafeAreaView>
  );
};

export default PerformanceHome;
