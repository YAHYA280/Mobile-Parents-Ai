import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

import { COLORS } from "@/constants";
import { Feather } from "@expo/vector-icons";
import styles from "@/styles/PlanDetailsStyle";
import { useTheme } from "@/theme/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  Modal,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

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
const CARD_HEIGHT = 480;
const HEADER_HEIGHT = 80;
const BODY_HEIGHT = CARD_HEIGHT - HEADER_HEIGHT;

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
    return "MOIS";
  }
  if (duration.toLowerCase().includes("annuel")) {
    return "AN";
  }
  return duration.substring(0, 3);
};

const PlanDetails: React.FC = () => {
  const params = useLocalSearchParams<PlanDetailsRouteParams>();
  const { planId } = params;
  const router = useRouter();
  const { colors, dark } = useTheme();
  const [activeDot, setActiveDot] = useState(0);

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
        <View style={headerStyles.headerLeft}>
          <TouchableOpacity
            style={headerStyles.backButton}
            onPress={handleBackPress}
          >
            <Feather
              name="arrow-left"
              size={24}
              color={dark ? COLORS.white : COLORS.black}
            />
          </TouchableOpacity>
          <Text
            style={[
              headerStyles.headerTitle,
              { color: dark ? COLORS.white : COLORS.greyscale900 },
            ]}
          >
            Détails du Plan
          </Text>
        </View>
      </View>
    ),
    [dark, handleBackPress]
  );

  const renderCheckmark = useCallback(
    (planColor: string) => (
      <View style={[styles.checkmarkCircle, { backgroundColor: planColor }]}>
        <Text style={styles.checkmarkText}>✓</Text>
      </View>
    ),
    []
  );

  const renderHighlightedSubtitle = useCallback(
    () => (
      <Text
        style={[
          styles.headingSubtitle,
          { color: dark ? COLORS.white : COLORS.gray3 },
        ]}
      >
        {"Commencez avec "}
        <Text style={[styles.highlightedText, { color: LOGO_COLORS.main }]}>
          14 jours d&apos;essai gratuit
        </Text>
        . Changez de plan à tout moment.
      </Text>
    ),
    [dark]
  );

  const renderPaginationDots = useCallback(
    (totalDots: number, activeDotIndex: number, planColor: string) => (
      <View style={styles.paginationContainer}>
        {Array(totalDots)
          .fill(0)
          .map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                { backgroundColor: dark ? COLORS.gray2 : "#D1D5DB" },
                activeDotIndex === index
                  ? [styles.paginationDotActive, { backgroundColor: planColor }]
                  : {},
              ]}
            />
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
            <Text
              style={[
                styles.getStartedText,
                buttonState.disabled ? { color: "#FFFFFF80" } : {},
              ]}
            >
              {buttonState.text}
            </Text>
          )}
        </TouchableOpacity>
      );
    },
    [getButtonState, handleSubscriptionUpdate, updating]
  );

  const renderFeatureItem = useCallback(
    (feature: string, index: number, planColor: string) => (
      <View key={index} style={styles.featureRow}>
        {renderCheckmark(planColor)}
        <Text
          style={[
            styles.featureText,
            { color: dark ? COLORS.white : "#111827" },
          ]}
        >
          {feature}
        </Text>
      </View>
    ),
    [renderCheckmark, dark]
  );

  const renderPricingCard = useCallback(
    (
      plan: PricingOption,
      index: number,
      planColor: string,
      planEmoji: string
    ) => (
      <View key={index} style={styles.cardOuterContainer}>
        <View style={styles.awardIconContainer}>
          <View
            style={[
              styles.awardIconCircle,
              { backgroundColor: lightenColor(planColor, 10) },
            ]}
          >
            <Text style={styles.emojiIcon}>{planEmoji}</Text>
          </View>
        </View>

        {plan.discountPercentage ? (
          <View style={styles.ribbonContainer}>
            <View style={[styles.ribbon, { backgroundColor: RIBBON_COLOR }]}>
              <Text style={styles.ribbonText}>
                {plan.discountPercentage}% OFF
              </Text>
            </View>
          </View>
        ) : (
          <></>
        )}

        <View style={styles.planContainer}>
          <View
            style={[
              styles.planHeaderSection,
              { backgroundColor: planColor, height: HEADER_HEIGHT },
            ]}
          >
            <View style={styles.planHeaderContent}>
              <Text style={styles.planTypeLabel}>
                {selectedCatalogue?.planName}
              </Text>
              <View style={styles.planPriceContainer}>
                <Text style={styles.planPrice}>${plan.price}</Text>
                <Text style={styles.planPeriod}>
                  / {formatDuration(plan.duration)}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.planBodySection,
              {
                height: BODY_HEIGHT,
                backgroundColor: dark ? COLORS.dark2 || "#1E1E1E" : "#FFFFFF",
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
              <View style={{ height: 70 }} />
            </ScrollView>

            <View style={styles.buttonPositioner}>
              {renderActionButton(plan, planColor)}
            </View>
          </View>
        </View>
      </View>
    ),
    [renderActionButton, renderFeatureItem, selectedCatalogue, dark]
  );

  const renderLoadingState = useCallback(
    () => (
      <SafeAreaView
        style={[styles.area, { backgroundColor: colors.background }]}
      >
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
              { color: dark ? COLORS.white : COLORS.gray3 },
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
          <Text style={[styles.errorText, { color: COLORS.red || "#E53935" }]}>
            {error || "Plan not found"}
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backButtonText}>Return to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    ),
    [colors.background, error, handleBackPress]
  );

  const renderCustomAlert = useCallback(() => {
    if (!alertConfig.visible) return null;

    return (
      <Modal visible={alertConfig.visible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.alertContainer,
              {
                backgroundColor: dark
                  ? COLORS.dark2 || "#1E1E1E"
                  : COLORS.white,
              },
            ]}
          >
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
          </View>
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}

        <View style={styles.headingContainer}>
          <Text
            style={[
              styles.headingSubtitle,
              { color: dark ? COLORS.white : LOGO_COLORS.darker },
            ]}
          >
            CHOISISSEZ VOTRE PLAN
          </Text>
          {renderHighlightedSubtitle()}
        </View>

        <ScrollView
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

// Additional styles for the header
const headerStyles = StyleSheet.create({
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.black,
  },
});

export default PlanDetails;
