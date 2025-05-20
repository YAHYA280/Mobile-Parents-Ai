import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Animated,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";

// Import Custom Components
import Header from "@/components/ui/Header";
import BenefitsSection from "@/components/catalogue/BenefitsSection";
import TestimonialCard from "@/components/catalogue/TestimonialCard";
import PlanCard from "@/components/catalogue/PlanCard";

// Import Types and Utilities
import {
  COLOORS,
  SPACING,
  TYPOGRAPHY,
  RADIUS,
  SHADOWS,
} from "@/constants/theme";
import {
  getCatalogues,
  getAbonnementActiveByUser,
} from "./services/mocksApi/abonnementApiMock";
import type { CataloguePlan } from "./services/mocksApi/abonnementApiMock";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;

const AbonnementCatalogue: React.FC = () => {
  const router = useRouter();

  // State
  const [catalogues, setCatalogues] = useState<CataloguePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0); // New state for header height

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(30)).current;
  const scrollX = useRef(new Animated.Value(0)).current;

  // Fetch Data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCatalogues();

      // Get current subscription if any
      try {
        const subscription = await getAbonnementActiveByUser(1); // Use actual user ID
        if (subscription && subscription.catalogue) {
          setCurrentPlanId(subscription.catalogue.id);

          // Find the index of the current plan to scroll to it
          const currentPlanIndex = data.findIndex(
            (plan) => plan.id === subscription.catalogue.id
          );
          if (currentPlanIndex !== -1) {
            setActiveSlide(currentPlanIndex);
          }
        }
      } catch (error) {
        console.log("No active subscription found");
      }

      setCatalogues(data);
      setError(null);
    } catch (err) {
      setError("Échec du chargement des plans. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!loading && !error) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading, error, fadeAnim, translateAnim]);

  // Function to measure the header height
  const onHeaderLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  // Dot indicators animation
  const renderDotIndicators = () => {
    return (
      <View style={styles.dotIndicatorContainer}>
        {catalogues.map((_, index) => {
          const inputRange = [
            (index - 1) * CARD_WIDTH,
            index * CARD_WIDTH,
            (index + 1) * CARD_WIDTH,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          });

          const backgroundColor = scrollX.interpolate({
            inputRange,
            outputRange: [COLOORS.gray3, COLOORS.primary.main, COLOORS.gray3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={`dot-${index}`}
              style={[
                styles.dot,
                { width: dotWidth, opacity, backgroundColor },
              ]}
            />
          );
        })}
      </View>
    );
  };

  // Handle plan selection
  const handleSelectPlan = (plan: CataloguePlan) => {
    // Use router.push with proper path structure for Expo Router
    router.push({
      pathname: "/planDetails",
      params: {
        planId: plan.id,
        pricing: JSON.stringify({
          monthlyPrice: plan.monthlyPrice,
          sixMonthPrice: plan.sixMonthPrice,
          yearlyPrice: plan.yearlyPrice,
        }),
        features: JSON.stringify(plan.features), // Stringify the features array
      },
    });
  };

  // Render loading state
  const renderLoading = () => (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      {/* Fixed header in loading state */}
      <View style={styles.headerContainer}>
        <Header
          title="Plans d'abonnement"
          onBackPress={() => router.back()}
          rightIcon="help-circle-outline"
          onRightIconPress={() => {}}
        />
      </View>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLOORS.primary.main} />
      </View>
    </SafeAreaView>
  );

  // Render error state
  const renderError = () => (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      {/* Fixed header in error state */}
      <View style={styles.headerContainer}>
        <Header
          title="Plans d'abonnement"
          onBackPress={() => router.back()}
          rightIcon="help-circle-outline"
          onRightIconPress={() => {}}
        />
      </View>
      <View style={styles.errorContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={60}
          color={COLOORS.status.expired.main}
        />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Ionicons
            name="refresh"
            size={18}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  if (loading) {
    return renderLoading();
  }

  if (error) {
    return renderError();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <View style={styles.headerContainer} onLayout={onHeaderLayout}>
        <Header title="Plans d'abonnement" onBackPress={() => router.back()} />
      </View>

      {/* ScrollView with padding to account for the header */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingTop: headerHeight }, // Dynamic padding based on header height
        ]}
      >
        <MotiView
          style={styles.container}
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", duration: 500 }}
        >
          <MotiView
            style={styles.headerSection}
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 200, type: "spring", damping: 18 }}
          >
            <View style={styles.headerIconContainer}>
              <Ionicons
                name="rocket-outline"
                size={28}
                color={COLOORS.primary.main}
              />
            </View>
            <Text style={styles.headerTitle}>Choisissez votre plan</Text>
            <Text style={styles.headerSubtitle}>
              Sélectionnez le meilleur plan d'assistance aux devoirs pour votre
              enfant
            </Text>
          </MotiView>

          <View style={styles.plansCarouselContainer}>
            <FlatList
              data={catalogues}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <PlanCard
                  item={item}
                  index={index}
                  isPlanSelected={item.id === currentPlanId}
                  onSelect={handleSelectPlan}
                />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH + 20}
              decelerationRate="fast"
              contentContainerStyle={styles.flatListContent}
              initialScrollIndex={activeSlide}
              getItemLayout={(_, index) => ({
                length: CARD_WIDTH + 20,
                offset: (CARD_WIDTH + 20) * index,
                index,
              })}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / (CARD_WIDTH + 20)
                );
                setActiveSlide(index);
              }}
            />

            {renderDotIndicators()}
          </View>

          <BenefitsSection />

          <TestimonialCard
            quote="Mon fils a amélioré ses notes en mathématiques de manière significative. Le suivi détaillé et les exercices personnalisés ont fait toute la différence."
            author="Catherine Martin"
            rating={5}
          />

          {/* Add some bottom padding for better scrolling experience */}
          <View style={styles.bottomSpacer} />
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  // Header container styles for sticky header
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    zIndex: 10, // Ensure header stays above other content
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
  },
  scrollViewContent: {
    paddingBottom: SPACING.xl,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    ...TYPOGRAPHY.body1,
    color: COLOORS.status.expired.main,
    textAlign: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLOORS.primary.main,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.xxl,
    ...SHADOWS.small,
  },
  retryText: {
    ...TYPOGRAPHY.button,
    color: "#FFFFFF",
  },
  headerSection: {
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  headerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${COLOORS.primary.main}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLOORS.black,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body1,
    color: COLOORS.gray3,
    textAlign: "center",
    paddingHorizontal: SPACING.md,
  },
  plansCarouselContainer: {
    marginBottom: SPACING.lg,
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingBottom: SPACING.md,
  },
  dotIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.md,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default AbonnementCatalogue;
