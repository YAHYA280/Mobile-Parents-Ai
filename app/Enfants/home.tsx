// app/Enfants/home.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import { CHILDREN_DATA, Child } from "../../data/Enfants/CHILDREN_DATA";
import HistoriqueActivites from "./Historique/home";
import PerformanceComponent from "./Performance/home";

// Import our new components
import ProfileHeader from "../../components/children/ProfileHeader";
import AnimatedTabBar from "../../components/children/AnimatedTabBar";
import ProgressCard from "../../components/children/ProgressCard";
import SubjectsCard from "../../components/children/SubjectsCard";
import RecentActivityCard from "../../components/children/RecentActivityCard";

// Fix the interface to accept null
interface OverviewContentProps {
  child: Child;
  scrollViewRef: React.RefObject<ScrollView | null>;
}

const OverviewContent: React.FC<OverviewContentProps> = ({
  child,
  scrollViewRef,
}) => {
  return (
    <ScrollView
      ref={scrollViewRef}
      style={{ flex: 1, paddingHorizontal: 16, paddingTop: 20 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <ProgressCard progress={child.progress} />

      <SubjectsCard
        strongSubjects={child.matieresFortes}
        improvementSubjects={child.matieresAmeliorer}
      />

      <RecentActivityCard recentActivity={child.activitesRecentes[0]} />
    </ScrollView>
  );
};

const EnfantsHome: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  // Fix: Keep the original typing as it was working
  const scrollViewRef = useRef<ScrollView | null>(null);

  const childId =
    typeof params.childId === "string" ? parseInt(params.childId, 10) : 0;
  const [child, setChild] = useState<Child | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    const foundChild = CHILDREN_DATA.find((c) => c.id === childId) || null;
    setChild(foundChild);
  }, [childId]);

  const handleBack = (): void => {
    router.back();
  };

  const handleTabPress = (tabIndex: number): void => {
    setActiveTab(tabIndex);
  };

  const renderContent = () => {
    if (!child) return null;

    switch (activeTab) {
      case 0:
        return <OverviewContent child={child} scrollViewRef={scrollViewRef} />;
      case 1:
        return <HistoriqueActivites isTabComponent childData={child} />;
      case 2:
        return <PerformanceComponent isTabComponent childData={child} />;
      default:
        return null;
    }
  };

  if (!child) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#333333" }}>Enfant non trouvé</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
        {/* Profile Header - Only show on Overview tab */}
        {activeTab === 0 && (
          <ProfileHeader child={child} onBackPress={handleBack} />
        )}

        {/* Main Content Area */}
        <View style={{ flex: 1, paddingBottom: 0 }}>{renderContent()}</View>

        {/* Animated Tab Bar */}
        <AnimatedTabBar activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    </SafeAreaView>
  );
};

export default EnfantsHome;
