// app/Enfants/[id].tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

// Import components
import TabBar from "@/components/ui/TabBar";
import OverviewTab from "@/components/children/OverviewTab";
import ActivitiesTab from "@/components/children/ActivitiesTab";
import PerformanceTab from "@/components/children/PerformanceTab";
import { COLORS, TYPOGRAPHY, SHADOWS, RADIUS } from "@/constants/theme";
import { CHILDREN_DATA } from "@/data/Enfants/CHILDREN_DATA";

const { width } = Dimensions.get("window");

const ChildDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const childId = Number(id);

  // Find the child data
  const childData = CHILDREN_DATA.find((child) => child.id === childId);

  if (!childData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Enfant non trouvé</Text>
      </View>
    );
  }

  // Tabs configuration
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Aperçu", "Activités", "Performance"];

  // Parse progress percentage
  const progressValue = parseFloat(childData.progress.replace("%", ""));

  // Get progress color
  const getProgressColor = (value: any) => {
    if (value >= 75) return "#4CAF50"; // Green
    if (value >= 50) return "#FFC107"; // Yellow
    if (value >= 25) return "#FF9800"; // Orange
    return "#F44336"; // Red
  };

  const progressColor = getProgressColor(progressValue);

  // Animation for scrolling
  const scrollY = useSharedValue(0);
  const scrollX = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const horizontalScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [-20, 0, 100],
        [200, 180, 120],
        Extrapolate.CLAMP
      ),
      opacity: interpolate(
        scrollY.value,
        [0, 50, 100],
        [1, 0.9, 0.8],
        Extrapolate.CLAMP
      ),
    };
  });

  const navigateBack = () => {
    router.back();
  };

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with child info */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <LinearGradient
          colors={[progressColor, "#FFFFFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerTop}>
            <MotiView
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: "spring", damping: 18 }}
            >
              <TouchableOpacity
                style={styles.backButton}
                onPress={navigateBack}
              >
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </MotiView>
          </View>

          <View style={styles.childInfoContainer}>
            <View style={styles.avatarContainer}>
              <Image
                source={childData.profileImage}
                style={styles.avatar}
                contentFit="cover"
                transition={500}
              />
            </View>

            <View style={styles.childDetails}>
              <Text style={styles.childName}>{childData.name}</Text>
              <Text style={styles.childAge}>
                {childData.age} ans • {childData.classe}
              </Text>

              <View style={styles.progressContainer}>
                <View style={styles.progressRow}>
                  <Text style={styles.progressLabel}>Progrès global</Text>
                  <Text
                    style={[styles.progressValue, { color: progressColor }]}
                  >
                    {childData.progress}
                  </Text>
                </View>

                <View style={styles.progressBarContainer}>
                  <MotiView
                    from={{ width: "0%" }}
                    animate={{ width: `${progressValue}%` }}
                    transition={{ type: "timing", duration: 1000 }}
                    style={[
                      styles.progressBar,
                      { backgroundColor: progressColor },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Tab navigation */}
      <TabBar tabs={tabs} activeIndex={activeTab} onTabPress={handleTabPress} />

      {/* Tab content - Horizontal scrolling */}
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={horizontalScrollHandler}
        scrollEventThrottle={16}
        style={styles.tabContent}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setActiveTab(newIndex);
        }}
      >
        {/* Overview Tab */}
        <ScrollView
          style={styles.tabPage}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          <OverviewTab childId={childId} childData={childData} />
        </ScrollView>

        {/* Activities Tab */}
        <ScrollView
          style={styles.tabPage}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          <ActivitiesTab childId={childId} childData={childData} />
        </ScrollView>

        {/* Performance Tab */}
        <ScrollView
          style={styles.tabPage}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          <PerformanceTab childId={childId} childData={childData} />
        </ScrollView>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    ...TYPOGRAPHY.h2,
    color: COLORS.error,
  },
  header: {
    width: "100%",
    height: 180,
  },
  headerGradient: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  childInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    overflow: "hidden",
    marginRight: 16,
    ...SHADOWS.medium,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  childDetails: {
    flex: 1,
  },
  childName: {
    ...TYPOGRAPHY.h2,
    color: "#FFFFFF",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  childAge: {
    ...TYPOGRAPHY.body1,
    color: "#FFFFFF",
    marginBottom: 12,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  progressContainer: {
    width: "100%",
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    ...TYPOGRAPHY.caption,
    color: "#FFFFFF",
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  progressValue: {
    ...TYPOGRAPHY.subtitle2,
    color: "#FFFFFF",
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  tabContent: {
    flex: 1,
  },
  tabPage: {
    width: Dimensions.get("window").width,
    paddingVertical: 16,
  },
});

export default ChildDetailsScreen;
