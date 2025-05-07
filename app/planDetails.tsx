import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  Text,
  View,
  Modal,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Animated,
} from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";

import type { CataloguePlan } from "../app/services/mocksApi/abonnementApiMock";

import {
  getCatalogues,
  updateUserSubscription,
  getAbonnementActiveByUser,
} from "../app/services/mocksApi/abonnementApiMock";

const LOGO_COLORS = {
  lighter: "#f9a99a",
  light: "#f28374",
  main: "#fe7862",
  dark: "#d75f4d",
  darker: "#b34e3a",
  contrastText: "#FFFFFF",
};

const RIBBON_COLOR = "#E53935";

type PlanDetailsRouteParams = {
  planId: string;
  pricing: string;
  features: string;
};

type CurrentSubscription = {
  status: string;
  duration: string;
  planId: string;
} | null;

type PricingOption = {
  duration: string;
  price: number;
  features: string[];
  discountPercentage?: number;
  apiDuration: string;
};

type AlertConfig = {
  visible: boolean;
  title: string;
  message: string;
  onOk: () => void;
};

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;

const lightenColor = (hex: string, percent: number): string => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const lightenAmount = Math.floor(255 * (percent / 100));

  const rNew = Math.min(r + lightenAmount, 255);
  const gNew = Math.min(g + lightenAmount, 255);
  const bNew = Math.min(b + lightenAmount, 255);

  return `#${rNew.toString(16).padStart(2, "0")}${gNew.toString(16).padStart(2, "0")}${bNew.toString(16).padStart(2, "0")}`;
};

const getPlanEmoji = (planId: string): string => {
  switch (planId) {
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

const getPlanColor = (planId: string): string => {
  switch (planId) {
    case "1":
      return LOGO_COLORS.light;
    case "2":
      return LOGO_COLORS.main;
    case "3":
      return LOGO_COLORS.dark;
    default:
      return LOGO_COLORS.main;
  }
};

const formatDuration = (duration: string): string => {
  if (duration.toLowerCase().includes("mois")) {
    if (duration.includes("6")) {
      return "6 MOIS";
    }
    return "MENSUEL";
  }
  if (duration.toLowerCase().includes("annuel")) {
    return "ANNUEL";
  }
  return duration.substring(0, 3);
};

const PlanDetails: React.FC = () => {
  const params = useLocalSearchParams<PlanDetailsRouteParams>();
  const { planId } = params;
  const router = useRouter();
  const { colors, dark } = useTheme();
  const [activeDot, setActiveDot] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [currentSubscription, setCurrentSubscription] =
    useState<CurrentSubscription>(null);
  const [selectedCatalogue, setSelectedCatalogue] =
    useState<CataloguePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    visible: false,
    title: "",
    message: "",
    onOk: () => {},
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const cataloguesData = await getCatalogues();
      const catalogue = cataloguesData.find(
        (item: { id: string }) => item.id === planId
      );

      if (!catalogue) {
        setError("Plan not found");
        return;
      }

      setSelectedCatalogue(catalogue);

      const abonnement = await getAbonnementActiveByUser(1);

      if (abonnement) {
        setCurrentSubscription({
          status: abonnement.status,
          duration: abonnement.duration,
          planId: abonnement.catalogue.id,
        });
      } else {
        setCurrentSubscription(null);
      }

      setError(null);
    } catch (err) {
      setError(
        "Échec du chargement des détails du plan. Veuillez réessayer plus tard."
      );
    } finally {
      setLoading(false);
    }
  }, [planId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubscriptionUpdate = useCallback(
    async (plan: PricingOption) => {
      if (!selectedCatalogue) return;

      try {
        setUpdating(true);

        // Déterminer si un paiement est nécessaire
        const needsPayment =
          !currentSubscription ||
          parseInt(selectedCatalogue.id, 10) >
            parseInt(currentSubscription.planId, 10) ||
          (currentSubscription.planId === selectedCatalogue.id &&
            plan.apiDuration !== currentSubscription.duration);

        if (needsPayment) {
          // Rediriger vers la page de paiement avec les paramètres nécessaires
          router.push({
            pathname: "/selectpaymentmethods",
            params: {
              planId: selectedCatalogue.id,
              duration: plan.apiDuration,
              price: plan.price.toString(),
              planName: selectedCatalogue.planName,
            },
          });
          setUpdating(false);
          return;
        }

        // Si aucun paiement n'est nécessaire, procéder à la mise à jour directe
        const updatedSubscription = await updateUserSubscription(
          1,
          selectedCatalogue.id,
          plan.apiDuration
        );

        setCurrentSubscription({
          status: updatedSubscription.status,
          duration: updatedSubscription.duration,
          planId: updatedSubscription.catalogue.id,
        });

        setAlertConfig({
          visible: true,
          title: "Abonnement mis à jour",
          message: `Votre abonnement ${selectedCatalogue.planName} a été ${currentSubscription ? "mis à jour" : "démarré"} avec succès.`,
          onOk: () => {
            setAlertConfig({ ...alertConfig, visible: false });
            router.back();
          },
        });
      } catch (err) {
        setAlertConfig({
          visible: true,
          title: "Erreur",
          message:
            "Échec de la mise à jour de l'abonnement. Veuillez réessayer plus tard.",
          onOk: () => setAlertConfig({ ...alertConfig, visible: false }),
        });
      } finally {
        setUpdating(false);
      }
    },
    [currentSubscription, router, selectedCatalogue, alertConfig]
  );

  const getButtonState = useCallback(
    (plan: PricingOption) => {
      if (!currentSubscription || currentSubscription.status === "expired") {
        return {
          disabled: false,
          text: "Commencer",
          style: {},
        };
      }

      if (
        currentSubscription.planId === selectedCatalogue?.id &&
        currentSubscription.duration === plan.apiDuration
      ) {
        return {
          disabled: true,
          text: "Plan Actuel",
          style: { opacity: 0.5 },
        };
      }

      if (currentSubscription.planId === selectedCatalogue?.id) {
        return {
          disabled: false,
          text: "Changer Durée",
          style: {},
        };
      }

      const isUpgrade =
        parseInt(selectedCatalogue?.id || "0", 10) >
        parseInt(currentSubscription.planId, 10);

      if (isUpgrade) {
        return {
          disabled: false,
          text: "Améliorer",
          style: {},
        };
      }

      return {
        disabled: false,
        text: "Rétrograder",
        style: {},
      };
    },
    [currentSubscription, selectedCatalogue]
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollPosition = event.nativeEvent.contentOffset.x;
      const index = Math.round(scrollPosition / CARD_WIDTH);
      setActiveDot(index);
    },
    []
  );

  const handleBackPress = useCallback(() => {
    router.back();
  }, [router]);

  const renderHeader = useCallback(
    () => (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={dark ? COLORS.white : COLORS.black}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Détails du Plan
          </Text>
        </View>
      </View>
    ),
    [dark, handleBackPress]
  );

  const renderHighlightedSubtitle = useCallback(
    () => (
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text
          style={[
            styles.headingSubtitle,
            { color: dark ? COLORS.white : "#666" },
          ]}
        >
          {"Commencez avec "}
          <Text style={[styles.highlightedText, { color: LOGO_COLORS.main }]}>
            14 jours d&apos;essai gratuit
          </Text>
          . Changez de plan à tout moment.
        </Text>
      </Animated.View>
    ),
    [dark, fadeAnim]
  );

  const renderPaginationDots = useCallback(
    (totalDots: number, activeDotIndex: number, planColor: string) => (
      <View style={styles.paginationContainer}>
        {Array(totalDots)
          .fill(0)
          .map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                scrollViewRef.current?.scrollTo({
                  x: index * CARD_WIDTH,
                  animated: true,
                });
                setActiveDot(index);
              }}
            >
              <View
                style={[
                  styles.paginationDot,
                  { backgroundColor: dark ? "#555" : "#D1D5DB" },
                  activeDotIndex === index
                    ? [
                        styles.paginationDotActive,
                        { backgroundColor: planColor },
                      ]
                    : {},
                ]}
              />
            </TouchableOpacity>
          ))}
      </View>
    ),
    [dark]
  );

  const renderActionButton = useCallback(
    (plan: PricingOption, planColor: string) => {
      const buttonState = getButtonState(plan);

      return (
        <TouchableOpacity
          style={[
            styles.getStartedButton,
            { backgroundColor: planColor },
            buttonState.style,
            updating && { opacity: 0.7 },
          ]}
          disabled={buttonState.disabled || updating}
          onPress={() => handleSubscriptionUpdate(plan)}
        >
          {updating ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text
                style={[
                  styles.getStartedText,
                  buttonState.disabled ? { opacity: 0.7 } : {},
                ]}
              >
                {buttonState.text}
              </Text>
              {!buttonState.disabled && (
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#FFFFFF"
                  style={styles.buttonIcon}
                />
              )}
            </>
          )}
        </TouchableOpacity>
      );
    },
    [getButtonState, handleSubscriptionUpdate, updating]
  );

  const renderFeatureItem = useCallback(
    (feature: string, index: number, planColor: string) => (
      <MotiView
        key={index}
        style={styles.featureRow}
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ delay: 300 + index * 50, type: "timing", duration: 400 }}
      >
        <View
          style={[styles.checkCircle, { backgroundColor: `${planColor}15` }]}
        >
          <Ionicons name="checkmark" size={16} color={planColor} />
        </View>
        <Text
          style={[styles.featureText, { color: dark ? COLORS.white : "#333" }]}
        >
          {feature}
        </Text>
      </MotiView>
    ),
    [dark]
  );

  const renderPricingCard = useCallback(
    (
      plan: PricingOption,
      index: number,
      planColor: string,
      planEmoji: string
    ) => (
      <MotiView
        key={index}
        style={styles.cardOuterContainer}
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 200 + index * 100, type: "spring", damping: 15 }}
      >
        <View style={styles.awardIconContainer}>
          <View
            style={[
              styles.awardIconCircle,
              { backgroundColor: `${planColor}20` },
            ]}
          >
            <Text style={styles.emojiIcon}>{planEmoji}</Text>
          </View>
        </View>

        {plan.discountPercentage ? (
          <View style={styles.ribbonContainer}>
            <View style={[styles.ribbon, { backgroundColor: RIBBON_COLOR }]}>
              <Ionicons
                name="pricetag"
                size={12}
                color="#FFFFFF"
                style={styles.ribbonIcon}
              />
              <Text style={styles.ribbonText}>
                {plan.discountPercentage}% OFF
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.planContainer}>
          <LinearGradient
            colors={[planColor, lightenColor(planColor, 15)]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.planHeaderSection}
          >
            {/* Decorative elements */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />

            <View style={styles.planHeaderContent}>
              <Text style={styles.planTypeLabel}>
                {formatDuration(plan.duration)}
              </Text>
              <View style={styles.planPriceContainer}>
                <Text style={styles.planPrice}>${plan.price}</Text>
                <Text style={styles.planPeriod}>
                  / {plan.duration.toLowerCase()}
                </Text>
              </View>
            </View>
          </LinearGradient>

          <View
            style={[
              styles.planBodySection,
              {
                backgroundColor: dark ? COLORS.dark2 || "#222" : "#FFFFFF",
              },
            ]}
          >
            <ScrollView
              style={styles.featuresScrollView}
              showsVerticalScrollIndicator={false}
            >
              {plan.features.map((feature, i) =>
                renderFeatureItem(feature, i, planColor)
              )}
              <View style={{ height: 80 }} />
            </ScrollView>

            <View style={styles.buttonPositioner}>
              {renderActionButton(plan, planColor)}
            </View>
          </View>
        </View>
      </MotiView>
    ),
    [renderActionButton, renderFeatureItem, dark]
  );

  const renderLoadingState = useCallback(
    () => (
      <SafeAreaView
        style={[styles.area, { backgroundColor: colors.background }]}
      >
        <StatusBar
          barStyle={dark ? "light-content" : "dark-content"}
          backgroundColor="transparent"
          translucent
        />
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.background,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <ActivityIndicator size="large" color={LOGO_COLORS.main} />
          <Text
            style={[
              styles.loadingText,
              { color: dark ? COLORS.white : "#666" },
            ]}
          >
            Chargement du plan...
          </Text>
        </View>
      </SafeAreaView>
    ),
    [colors.background, dark]
  );

  const renderErrorState = useCallback(
    () => (
      <SafeAreaView
        style={[styles.area, { backgroundColor: colors.background }]}
      >
        <StatusBar
          barStyle={dark ? "light-content" : "dark-content"}
          backgroundColor="transparent"
          translucent
        />
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.background,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <View style={styles.errorIconContainer}>
            <Ionicons name="alert-circle" size={64} color="#E11D48" />
          </View>

          <Text style={styles.errorText}>{error || "Plan not found"}</Text>

          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <LinearGradient
              colors={[LOGO_COLORS.main, lightenColor(LOGO_COLORS.main, 10)]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Ionicons
                name="arrow-back"
                size={18}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
              <Text style={styles.backButtonText}>Retour à l'accueil</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    ),
    [colors.background, error, handleBackPress, dark]
  );

  const renderCustomAlert = useCallback(() => {
    if (!alertConfig.visible) return null;

    return (
      <Modal visible={alertConfig.visible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <MotiView
            style={[
              styles.alertContainer,
              {
                backgroundColor: dark ? COLORS.dark2 || "#222" : COLORS.white,
              },
            ]}
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <View style={styles.alertIconContainer}>
              <Ionicons
                name={
                  alertConfig.title.toLowerCase().includes("erreur")
                    ? "alert-circle"
                    : "checkmark-circle"
                }
                size={48}
                color={
                  alertConfig.title.toLowerCase().includes("erreur")
                    ? "#E11D48"
                    : "#10B981"
                }
              />
            </View>

            <Text
              style={[
                styles.alertTitle,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {alertConfig.title}
            </Text>

            <Text
              style={[
                styles.alertMessage,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {alertConfig.message}
            </Text>

            <TouchableOpacity
              style={[styles.okButton, { backgroundColor: COLORS.primary }]}
              onPress={alertConfig.onOk}
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </MotiView>
        </View>
      </Modal>
    );
  }, [alertConfig, dark]);

  const pricingOptions = useMemo<PricingOption[]>(() => {
    if (!selectedCatalogue) return [];
    return [
      {
        duration: "Mensuel",
        price: selectedCatalogue.monthlyPrice,
        features: selectedCatalogue.features,
        apiDuration: "monthly",
      },
      {
        duration: "6 Mois",
        price: selectedCatalogue.sixMonthPrice,
        features: selectedCatalogue.features,
        discountPercentage: 15,
        apiDuration: "six_months",
      },
      {
        duration: "Annuel",
        price: selectedCatalogue.yearlyPrice,
        features: selectedCatalogue.features,
        discountPercentage: 25,
        apiDuration: "yearly",
      },
    ];
  }, [selectedCatalogue]);

  if (loading) {
    return renderLoadingState();
  }

  if (error || !selectedCatalogue) {
    return renderErrorState();
  }

  const planColor = getPlanColor(selectedCatalogue.id);
  const planEmoji = getPlanEmoji(selectedCatalogue.id);

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}

        <MotiView
          style={styles.headingContainer}
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500 }}
        >
          <View style={styles.planTitleContainer}>
            <View
              style={[
                styles.planIconContainer,
                { backgroundColor: `${planColor}20` },
              ]}
            >
              <Text style={styles.planEmoji}>{planEmoji}</Text>
            </View>
            <Text
              style={[
                styles.planTitle,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {selectedCatalogue.planName}
            </Text>
          </View>

          {renderHighlightedSubtitle()}
        </MotiView>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          snapToInterval={CARD_WIDTH + 16}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {pricingOptions.map((plan, index) =>
            renderPricingCard(plan, index, planColor, planEmoji)
          )}
        </ScrollView>

        {renderPaginationDots(pricingOptions.length, activeDot, planColor)}
      </View>
      {renderCustomAlert()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "bold",
  },
  headingContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  planTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  planIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  planEmoji: {
    fontSize: 18,
  },
  planTitle: {
    fontSize: 24,
    fontFamily: "bold",
  },
  headingSubtitle: {
    fontSize: 16,
    fontFamily: "regular",
    lineHeight: 24,
  },
  highlightedText: {
    fontFamily: "semibold",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardOuterContainer: {
    width: CARD_WIDTH,
    marginRight: 16,
    position: "relative",
  },
  awardIconContainer: {
    position: "absolute",
    top: -15,
    left: "50%",
    marginLeft: -20,
    zIndex: 10,
  },
  awardIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(254, 120, 98, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emojiIcon: {
    fontSize: 20,
  },
  ribbonContainer: {
    position: "absolute",
    top: 30,
    right: -5,
    zIndex: 10,
  },
  ribbon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: RIBBON_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    shadowColor: RIBBON_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  ribbonIcon: {
    marginRight: 4,
  },
  ribbonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "bold",
  },
  planContainer: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  planHeaderSection: {
    padding: 24,
    position: "relative",
    overflow: "hidden",
  },
  decorativeCircle1: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    top: -50,
    right: -30,
  },
  decorativeCircle2: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    bottom: -20,
    left: 30,
  },
  planHeaderContent: {
    alignItems: "center",
  },
  planTypeLabel: {
    fontSize: 16,
    fontFamily: "semibold",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  planPriceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  planPrice: {
    fontSize: 36,
    fontFamily: "bold",
    color: "#FFFFFF",
  },
  planPeriod: {
    fontSize: 16,
    fontFamily: "medium",
    color: "rgba(255, 255, 255, 0.8)",
    marginLeft: 4,
  },
  planBodySection: {
    padding: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  featuresScrollView: {
    maxHeight: 320,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    fontFamily: "medium",
    flex: 1,
  },
  buttonPositioner: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
  },
  getStartedButton: {
    height: 56,
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  getStartedText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "semibold",
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  paginationDotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  // Alert Modal
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  alertContainer: {
    width: width - 64,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  alertIconContainer: {
    marginBottom: 16,
  },
  alertTitle: {
    fontSize: 20,
    fontFamily: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  alertMessage: {
    fontSize: 16,
    fontFamily: "regular",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 24,
  },
  okButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  okButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "semibold",
  },
  // Loading and Error States
  loadingText: {
    fontSize: 16,
    fontFamily: "medium",
    marginTop: 16,
  },
  errorIconContainer: {
    marginBottom: 24,
  },
  errorText: {
    fontSize: 18,
    fontFamily: "medium",
    color: "#E11D48",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "semibold",
    marginLeft: 8,
  },
});

export default PlanDetails;
