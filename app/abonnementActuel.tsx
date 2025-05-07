import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/theme/ThemeProvider";

// Import Custom Components
import Header from "@/components/ui/Header";
import NoSubscriptionView from "@/components/subscription/NoSubscriptionView";
import SubscriptionCard from "@/components/subscription/SubscriptionCard";
import SubscriptionFeatures from "@/components/subscription/SubscriptionFeatures";
import SubscriptionActions from "@/components/subscription/SubscriptionActions";
import Alert from "@/components/ui/Alert";

// Import Types and Utilities
import { COLOORS, SPACING } from "@/constants/theme";
import {
  getCurrentUser,
  getAbonnementActiveByUser,
} from "./services/mocksApi/abonnementApiMock";
import type { Abonnement } from "./services/mocksApi/abonnementApiMock";

// Helper Functions
const getPlanColor = (abonnement: Abonnement | null): string => {
  if (!abonnement) return COLOORS.primary.main;

  switch (abonnement.catalogue.id) {
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

const getPlanEmoji = (abonnement: Abonnement | null): string => {
  if (!abonnement) return "📚";

  switch (abonnement.catalogue.planName) {
    case "Basique":
      return "🎓";
    case "Plus":
      return "🏆";
    case "Avancé":
      return "🚀";
    default:
      return "📚";
  }
};

const AbonnementActuel: React.FC = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { colors, dark } = useTheme();

  // State
  const [abonnement, setAbonnement] = useState<Abonnement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    buttons: [{ text: "OK", onPress: () => {} }],
  });

  // Fetch Data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUser();
      const subscriptionData = await getAbonnementActiveByUser(userData.id);
      setAbonnement(subscriptionData);
      setError(null);
    } catch (err) {
      setError(
        "Échec du chargement des détails de l'abonnement. Veuillez réessayer plus tard."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derived State
  const planColor = getPlanColor(abonnement);
  const planEmoji = getPlanEmoji(abonnement);
  const isSuspended = abonnement?.status === "suspended";
  const isExpired = abonnement?.status === "expired";

  // Handlers
  const navigateToHome = useCallback(() => {
    router.push("/" as any);
  }, [router]);

  const navigateToNotifications = useCallback(() => {
    router.push("/notifications" as any);
  }, [router]);

  const hideAlert = useCallback(() => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  }, []);

  const showAlert = useCallback(
    (title: string, message: string, buttons: any[]) => {
      setAlertConfig({
        visible: true,
        title,
        message,
        buttons: buttons.length
          ? buttons
          : [{ text: "OK", onPress: hideAlert }],
      });
    },
    [hideAlert]
  );

  const handleModify = useCallback(() => {
    if (isExpired) {
      showAlert(
        "Abonnement expiré",
        "Votre abonnement a expiré. Veuillez souscrire à un nouveau plan.",
        [{ text: "OK", onPress: hideAlert }]
      );
      return;
    }
    navigation.navigate("abonnementcatalogue" as never);
  }, [isExpired, navigation, showAlert, hideAlert]);

  const handleCancel = useCallback(() => {
    if (isExpired) {
      showAlert(
        "Abonnement déjà expiré",
        "Cet abonnement est déjà expiré et ne peut pas être annulé.",
        [{ text: "OK", onPress: hideAlert }]
      );
      return;
    }

    showAlert(
      "Annuler l'abonnement",
      "Êtes-vous sûr de vouloir annuler votre abonnement? Votre abonnement sera actif jusqu'à la fin de la période payée.",
      [
        { text: "Non", onPress: hideAlert },
        {
          text: "Oui, annuler",
          style: "destructive",
          onPress: hideAlert,
        },
      ]
    );
  }, [isExpired, hideAlert, showAlert]);

  const handleSuspend = useCallback(() => {
    if (isExpired) {
      showAlert(
        "Abonnement expiré",
        "Cet abonnement est déjà expiré et ne peut pas être suspendu.",
        [{ text: "OK", onPress: hideAlert }]
      );
      return;
    }

    if (isSuspended) {
      showAlert(
        "Réactiver l'abonnement",
        "Voulez-vous réactiver votre abonnement?",
        [
          { text: "Annuler", style: "cancel", onPress: hideAlert },
          { text: "Réactiver", onPress: hideAlert },
        ]
      );
      return;
    }

    showAlert(
      "Suspendre l'abonnement",
      "Voulez-vous suspendre temporairement votre abonnement? Vous pourrez le réactiver à tout moment.",
      [
        { text: "Annuler", onPress: hideAlert },
        { text: "Suspendre", onPress: hideAlert },
      ]
    );
  }, [isExpired, isSuspended, hideAlert, showAlert]);

  // Render Functions
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
      <Header
        title="Abonnement Actuel"
        onBackPress={() => navigation.goBack()}
        rightIcon="notifications-outline"
        onRightIconPress={navigateToNotifications}
      />
      <View
        style={[styles.errorContainer, { backgroundColor: colors.background }]}
      >
        <NoSubscriptionView onChoosePlan={navigateToHome} />
      </View>
    </SafeAreaView>
  );

  if (loading) {
    return renderLoadingState();
  }

  if (error) {
    return renderErrorState();
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <Header
        title="Abonnement Actuel"
        subtitle="Détails de votre plan actuel"
        onBackPress={() => navigation.goBack()}
        rightIcon="notifications-outline"
        onRightIconPress={navigateToNotifications}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!abonnement ? (
          <NoSubscriptionView onChoosePlan={navigateToHome} />
        ) : (
          <>
            <SubscriptionCard
              planName={abonnement.catalogue.planName}
              planEmoji={planEmoji}
              planColor={planColor}
              status={abonnement.status as "active" | "suspended" | "expired"}
              price={
                abonnement.duration === "monthly"
                  ? abonnement.catalogue.monthlyPrice
                  : abonnement.duration === "six_months"
                    ? abonnement.catalogue.sixMonthPrice
                    : abonnement.catalogue.yearlyPrice
              }
              duration={abonnement.duration}
              startDate={abonnement.start_date}
              endDate={abonnement.end_date}
            />

            <View style={styles.divider} />

            <SubscriptionFeatures
              features={abonnement.catalogue.features}
              planColor={planColor}
            />

            <SubscriptionActions
              status={abonnement.status as "active" | "suspended" | "expired"}
              planColor={planColor}
              onModify={handleModify}
              onSuspend={handleSuspend}
              onCancel={handleCancel}
            />
          </>
        )}
      </ScrollView>

      <Alert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onDismiss={hideAlert}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
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
});

export default AbonnementActuel;
