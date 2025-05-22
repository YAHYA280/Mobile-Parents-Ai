// Fixed home.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  StatusBar,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import type { Child } from "../../../data/Enfants/CHILDREN_DATA";
import { CHILDREN_DATA } from "../../../data/Enfants/CHILDREN_DATA";
import { COLORS } from "../../../constants/theme";
import { useActivityFilters } from "./activityFilters";

// Import components
import PerformanceHeader from "./components/PerformanceHeader";
import GlobalScoreCard from "./components/GlobalScoreCard";
import SubjectPerformanceCard from "./components/SubjectPerformanceCard";
import TimeDistributionCard from "./components/TimeDistributionCard";
import ProgressTrendsCard from "./components/ProgressTrendsCard";
import RecommendationsCard from "./components/RecommendationsCard";
import SkillBreakdownCard from "./components/SkillBreakdownCard";
import PerformanceFilterModal from "./components/PerformanceFilterModal";
import LoadingScreen from "./components/LoadingScreen";

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

  // FIX: Use simple animated values instead of complex interpolation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // State
  const [childData, setChildData] = useState<Child | null>(
    propChildData || null
  );
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Handle filters using the activity filters hook
  const {
    searchKeyword,
    activityDateRange,
    showActivityCalendar,
    activityCalendarMode,
    advancedFilters,
    filteredActivities,
    setSearchKeyword,
    toggleActivityCalendar,
    handleActivityDayPress,
    setAdvancedFilters,
    resetActivityFilters,
  } = useActivityFilters(childData?.activitesRecentes || []);

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

        // Start animations after a short delay
        setTimeout(() => {
          // FIX: Run animations in sequence rather than parallel to avoid race conditions
          Animated.sequence([
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

          setIsLoading(false);
        }, 500);
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
    // Implement sharing functionality
    console.log("Share performance report");
  };

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
          {/* Global Score Card */}
          <GlobalScoreCard
            activities={filteredActivities}
            hasFilters={
              searchKeyword !== "" ||
              activityDateRange.startDate !== null ||
              activityDateRange.endDate !== null ||
              advancedFilters.selectedAssistants.length > 0 ||
              advancedFilters.selectedSubjects.length > 0
            }
            onFilterPress={toggleFilterModal}
            onResetFilters={resetActivityFilters}
          />

          {/* Subject Performance Card */}
          <SubjectPerformanceCard activities={filteredActivities} />

          {/* Skill Breakdown Card */}
          <SkillBreakdownCard childData={childData} />

          {/* Progress Trends Card */}
          <ProgressTrendsCard activities={filteredActivities} />

          {/* Time Distribution Card */}
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
