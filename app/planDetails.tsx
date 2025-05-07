import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/theme/ThemeProvider";

// Import Custom Components
import Header from "@/components/ui/Header";
import PricingCard from "@/components/ui/PricingCard";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";

// Import Types and Utilities
import { COLOORS, TYPOGRAPHY, SPACING, RADIUS } from "@/constants/theme";
import { getPlanColor, getPlanEmoji } from "@/utils/formatUtils";
import { lightenColor } from "@/utils/colorUtils";
import {
  getCatalogues,
  updateUserSubscription,
  getAbonnementActiveByUser,
} from "../app/services/mocksApi/abonnementApiMock";
import type { CataloguePlan } from "../app/services/mocksApi/abonnementApiMock";

// Constants
const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;

// Types
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

interface PricingOption {
  duration: string;
  price: number;
  features: string[];
  discountPercentage?: number;
  apiDuration: string;
}

const PlanDetails: React.FC = () => {
  const params = useLocalSearchParams<PlanDetailsRouteParams>();
  const { planId } = params;
  const router = useRouter();
  const { colors, dark } = useTheme();

  // State
  const [activeDot, setActiveDot] = useState(0);
  const [currentSubscription, setCurrentSubscription] =
    useState<CurrentSubscription>(null);
  const [selectedCatalogue, setSelectedCatalogue] =
    useState<CataloguePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    buttons: [{ text: "OK", onPress: () => {} }],
  });

  // Refs
  const scrollViewRef = useRef<ScrollView>(null);

  // Fetch Data
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

  // Handlers
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
          buttons: [
            {
              text: "OK",
              onPress: () => {
                setAlertConfig((prev) => ({ ...prev, visible: false }));
                router.back();
              },
            },
          ],
        });
      } catch (err) {
        setAlertConfig({
          visible: true,
          title: "Erreur",
          message:
            "Échec de la mise à jour de l'abonnement. Veuillez réessayer plus tard.",
          buttons: [
            {
              text: "OK",
              onPress: () =>
                setAlertConfig((prev) => ({ ...prev, visible: false })),
            },
          ],
        });
      } finally {
        setUpdating(false);
      }
    },
    [currentSubscription, router, selectedCatalogue]
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

  // Derived State
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

  // Render States
  const renderLoadingState = () => (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={COLOORS.primary.main} />
      </View>
    </SafeAreaView>
  );

  const renderErrorState = () => (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <Header title="Détails du Plan" onBackPress={() => router.back()} />
      <View
        style={[styles.errorContainer, { backgroundColor: colors.background }]}
      >
        <View style={styles.errorContent}>
          <Button
            label="Retour à l'accueil"
            leftIcon="arrow-back"
            onPress={() => router.back()}
            variant="primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );

  if (loading) {
    return renderLoadingState();
  }

  if (error || !selectedCatalogue) {
    return renderErrorState();
  }

  // Plan Information
  const planColor = getPlanColor(selectedCatalogue.id);
  const planEmoji = getPlanEmoji(selectedCatalogue.id);

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <Header title="Détails du Plan" onBackPress={() => router.back()} />

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
            { color: dark ? COLOORS.white : COLOORS.black },
          ]}
        >
          {selectedCatalogue.planName}
        </Text>
      </View>

      <Text
        style={[
          styles.headingSubtitle,
          { color: dark ? COLOORS.gray2 : COLOORS.gray3 },
        ]}
      >
        {"Commencez avec "}
        <Text style={[styles.highlightedText, { color: COLOORS.primary.main }]}>
          14 jours d&apos;essai gratuit
        </Text>
        . Changez de plan à tout moment.
      </Text>

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
        {pricingOptions.map((option, index) => (
          <PricingCard
            key={index}
            option={option}
            index={index}
            planColor={planColor}
            planEmoji={planEmoji}
            onSelect={handleSubscriptionUpdate}
            isCurrentPlan={
              currentSubscription?.planId === selectedCatalogue.id &&
              currentSubscription?.duration === option.apiDuration
            }
            buttonText={getButtonState(option).text}
            buttonDisabled={getButtonState(option).disabled}
            features={option.features}
            loading={updating}
          />
        ))}
      </ScrollView>

      <View style={styles.paginationContainer}>
        {pricingOptions.map((_, index) => (
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
                activeDot === index
                  ? [styles.paginationDotActive, { backgroundColor: planColor }]
                  : {},
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Alert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onDismiss={() =>
          setAlertConfig((prev) => ({ ...prev, visible: false }))
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
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
  },
  errorContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  planTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    marginHorizontal: SPACING.md,
  },
  planIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  planEmoji: {
    fontSize: 18,
  },
  planTitle: {
    ...TYPOGRAPHY.h2,
  },
  headingSubtitle: {
    ...TYPOGRAPHY.body1,
    lineHeight: 24,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  highlightedText: {
    fontFamily: "semibold",
  },
  scrollContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
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
});
