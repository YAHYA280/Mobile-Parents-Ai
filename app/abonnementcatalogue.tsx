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
} from "react-native";
import { useRouter } from "expo-router"; // Import useRouter instead of useNavigation
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";

// Import Custom Components
import Header from "@/components/ui/Header";
import BenefitsSection from "@/components/catalogue/BenefitsSection";
import TestimonialCard from "@/components/catalogue/TestimonialCard";

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
import { lightenColor, darkenColor } from "@/utils/colorUtils";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;

const AbonnementCatalogue: React.FC = () => {
  const router = useRouter(); // Use router instead of navigation

  // State
  const [catalogues, setCatalogues] = useState<CataloguePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

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

  // Handle plan selection - FIXED VERSION
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

  // Render plan card
  const renderPlanCard = ({
    item,
    index,
  }: {
    item: CataloguePlan;
    index: number;
  }) => {
    const planColor = getPlanColor(item.id);
    const isPlanSelected = item.id === currentPlanId;

    return (
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: index * 100, type: "spring", damping: 15 }}
        style={[
          styles.planCardContainer,
          isPlanSelected && styles.selectedPlanContainer,
        ]}
      >
        {item.recommended && (
          <View style={styles.recommendedTag}>
            <Ionicons
              name="star"
              size={14}
              color="#FFF"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.recommendedText}>Recommandé</Text>
          </View>
        )}

        {isPlanSelected && (
          <View style={styles.currentPlanTag}>
            <Ionicons
              name="checkmark-circle"
              size={14}
              color="#FFF"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.currentPlanText}>Plan Actuel</Text>
          </View>
        )}

        <LinearGradient
          colors={[planColor, lightenColor(planColor, 15)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.planCardGradient}
        >
          <View style={styles.planHeader}>
            <View
              style={[
                styles.planIcon,
                { backgroundColor: `${lightenColor(planColor, 30)}80` },
              ]}
            >
              <Text style={styles.planEmoji}>{getPlanEmoji(item.id)}</Text>
            </View>
            <Text style={styles.planName}>{item.planName}</Text>
          </View>

          <View style={styles.pricingContainer}>
            <Text style={styles.price}>${item.monthlyPrice}</Text>
            <Text style={styles.pricePeriod}>/ mois</Text>
          </View>

          <View style={styles.planDivider} />

          <View style={styles.featuresContainer}>
            {item.features.slice(0, 3).map((feature, featureIndex) => (
              <View key={featureIndex} style={styles.featureRow}>
                <View
                  style={[
                    styles.featureIconBg,
                    { backgroundColor: `${lightenColor(planColor, 30)}80` },
                  ]}
                >
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}

            {item.features.length > 3 && (
              <Text style={styles.moreFeatures}>
                +{item.features.length - 3} autres fonctionnalités
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => handleSelectPlan(item)}
          >
            <Text style={styles.viewDetailsText}>
              {isPlanSelected ? "Modifier mon plan" : "Voir les détails"}
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>
      </MotiView>
    );
  };

  // Render loading state
  const renderLoading = () => (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Header
        title="Plans d'abonnement"
        onBackPress={() => router.back()}
        rightIcon="help-circle-outline"
        onRightIconPress={() => {}}
      />
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
      <Header
        title="Plans d'abonnement"
        onBackPress={() => router.back()}
        rightIcon="help-circle-outline"
        onRightIconPress={() => {}}
      />
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

      <Header
        title="Plans d'abonnement"
        onBackPress={() => router.back()}
        rightIcon="help-circle-outline"
        onRightIconPress={() => {}}
      />

      {/* Wrap the entire content in a ScrollView for vertical scrolling */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
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
              renderItem={renderPlanCard}
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

// Helper functions
const getPlanColor = (id: string): string => {
  switch (id) {
    case "1":
      return COLOORS.primary.light;
    case "2":
      return COLOORS.primary.main;
    case "3":
      return COLOORS.primary.dark;
    default:
      return COLOORS.primary.main;
  }
};

const getPlanEmoji = (id: string): string => {
  switch (id) {
    case "1":
      return "🎓";
    case "2":
      return "🏆";
    case "3":
      return "🚀";
    default:
      return "📚";
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
  planCardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: 10,
    borderRadius: RADIUS.lg,
    ...SHADOWS.medium,
    position: "relative",
  },
  selectedPlanContainer: {
    borderWidth: 2,
    borderColor: COLOORS.status.active.main,
    transform: [{ scale: 1.03 }],
  },
  recommendedTag: {
    position: "absolute",
    top: -10,
    right: 20,
    backgroundColor: COLOORS.accent.blue.main,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
    ...SHADOWS.small,
  },
  recommendedText: {
    ...TYPOGRAPHY.caption,
    color: "#FFFFFF",
    fontFamily: "semibold",
  },
  currentPlanTag: {
    position: "absolute",
    top: -10,
    left: 20,
    backgroundColor: COLOORS.status.active.main,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
    ...SHADOWS.small,
  },
  currentPlanText: {
    ...TYPOGRAPHY.caption,
    color: "#FFFFFF",
    fontFamily: "semibold",
  },
  planCardGradient: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    overflow: "hidden",
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  planEmoji: {
    fontSize: 22,
  },
  planName: {
    ...TYPOGRAPHY.h2,
    color: "#FFFFFF",
  },
  pricingContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: SPACING.md,
  },
  price: {
    ...TYPOGRAPHY.h1,
    color: "#FFFFFF",
  },
  pricePeriod: {
    ...TYPOGRAPHY.body1,
    color: "rgba(255, 255, 255, 0.8)",
    marginLeft: 4,
  },
  planDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: SPACING.md,
  },
  featuresContainer: {
    marginBottom: SPACING.md,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  featureIconBg: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  featureText: {
    ...TYPOGRAPHY.body2,
    color: "#FFFFFF",
    flex: 1,
  },
  moreFeatures: {
    ...TYPOGRAPHY.caption,
    color: "rgba(255, 255, 255, 0.7)",
    marginLeft: 30,
    marginTop: 4,
  },
  viewDetailsButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xxl,
  },
  viewDetailsText: {
    ...TYPOGRAPHY.button,
    color: "#FFFFFF",
    marginRight: SPACING.sm,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default AbonnementCatalogue;
