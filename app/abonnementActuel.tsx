import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";

// Import Custom Components
import Header from "@/components/ui/Header";
import Alert from "@/components/ui/Alert";
import NoSubscriptionView from "@/components/subscription/NoSubscriptionView";

// Import Types and Utilities
import {
  COLOORS,
  SPACING,
  TYPOGRAPHY,
  RADIUS,
  SHADOWS,
} from "@/constants/theme";
import {
  getCurrentUser,
  getAbonnementActiveByUser,
} from "./services/mocksApi/abonnementApiMock";
import type { Abonnement } from "./services/mocksApi/abonnementApiMock";
import { formatDate } from "@/utils/formatUtils";
import { lightenColor } from "@/utils/colorUtils";

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

const getPricingLabel = (duration: string): string => {
  switch (duration) {
    case "monthly":
      return "Mensuel";
    case "six_months":
      return "Semestriel";
    case "yearly":
      return "Annuel";
    default:
      return "Mensuel";
  }
};

const AbonnementActuel: React.FC = () => {
  const router = useRouter();

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
    router.push("/");
  }, [router]);

  const navigateToNotifications = useCallback(() => {
    router.push("/notifications");
  }, [router]);

  const navigateToCatalogue = useCallback(() => {
    router.push("/abonnementcatalogue");
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
    router.push("/abonnementcatalogue");
  }, [isExpired, router, showAlert, hideAlert]);

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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Header
        title="Abonnement Actuel"
        onBackPress={() => router.back()}
        rightIcon="notifications-outline"
        onRightIconPress={navigateToNotifications}
      />
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLOORS.primary.main} />
      </View>
    </SafeAreaView>
  );

  const renderErrorState = () => (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Header
        title="Abonnement Actuel"
        onBackPress={() => router.back()}
        rightIcon="notifications-outline"
        onRightIconPress={navigateToNotifications}
      />
      <View style={styles.errorContainer}>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 18 }}
          style={styles.errorContent}
        >
          <Ionicons
            name="alert-circle-outline"
            size={60}
            color={COLOORS.status.expired.main}
          />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Ionicons
              name="refresh-outline"
              size={20}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </MotiView>
      </View>
    </SafeAreaView>
  );

  // Render status badge based on subscription status
  const renderStatusBadge = () => {
    let statusConfig = {
      icon: "checkmark-circle",
      color: COLOORS.status.active.main,
      bgColor: COLOORS.status.active.light,
      text: "Actif",
    };

    if (isSuspended) {
      statusConfig = {
        icon: "pause-circle",
        color: COLOORS.status.suspended.main,
        bgColor: COLOORS.status.suspended.light,
        text: "Suspendu",
      };
    } else if (isExpired) {
      statusConfig = {
        icon: "close-circle",
        color: COLOORS.status.expired.main,
        bgColor: COLOORS.status.expired.light,
        text: "Expiré",
      };
    }

    return (
      <View
        style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}
      >
        <Ionicons
          name={statusConfig.icon as any}
          size={18}
          color={statusConfig.color}
          style={{ marginRight: 6 }}
        />
        <Text style={[styles.statusText, { color: statusConfig.color }]}>
          {statusConfig.text}
        </Text>
      </View>
    );
  };

  if (loading) {
    return renderLoadingState();
  }

  if (error) {
    return renderErrorState();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <Header
        title="Abonnement Actuel"
        subtitle="Détails de votre plan actuel"
        onBackPress={() => router.back()}
        rightIcon="notifications-outline"
        onRightIconPress={navigateToNotifications}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {!abonnement ? (
          <NoSubscriptionView onChoosePlan={navigateToHome} />
        ) : (
          <MotiView
            style={styles.subscriptionContainer}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "spring", damping: 18 }}
          >
            {/* Main Subscription Card */}
            <View style={styles.subscriptionCard}>
              <LinearGradient
                colors={[planColor, lightenColor(planColor, 15)]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.planHeader}
              >
                {/* Decorative circles */}
                <View style={styles.decorativeCircle1} />
                <View style={styles.decorativeCircle2} />

                <View style={styles.planHeaderContent}>
                  <View style={styles.planTitleRow}>
                    <View
                      style={[
                        styles.emojiContainer,
                        { backgroundColor: `${lightenColor(planColor, 30)}80` },
                      ]}
                    >
                      <Text style={styles.emojiText}>{planEmoji}</Text>
                    </View>

                    <View style={styles.planTitleContainer}>
                      <Text style={styles.planTitle}>
                        {abonnement.catalogue.planName}
                      </Text>
                      <Text style={styles.planSubtitle}>
                        {getPricingLabel(abonnement.duration)}
                      </Text>
                    </View>

                    {renderStatusBadge()}
                  </View>

                  <View style={styles.priceSection}>
                    <Text style={styles.priceLabel}>Abonnement</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceValue}>
                        $
                        {abonnement.duration === "monthly"
                          ? abonnement.catalogue.monthlyPrice
                          : abonnement.duration === "six_months"
                            ? abonnement.catalogue.sixMonthPrice
                            : abonnement.catalogue.yearlyPrice}
                      </Text>
                      <Text style={styles.pricePeriod}>
                        {abonnement.duration === "monthly"
                          ? "/ mois"
                          : abonnement.duration === "six_months"
                            ? "/ 6 mois"
                            : "/ année"}
                      </Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>

              <View style={styles.cardBody}>
                {/* Date Information */}
                <View style={styles.dateSection}>
                  <View style={styles.dateBlock}>
                    <View
                      style={[
                        styles.dateIconContainer,
                        { backgroundColor: `${planColor}15` },
                      ]}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color={planColor}
                      />
                    </View>
                    <View>
                      <Text style={styles.dateLabel}>Début</Text>
                      <Text style={styles.dateValue}>
                        {formatDate(abonnement.start_date)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.dateBlock}>
                    <View
                      style={[
                        styles.dateIconContainer,
                        { backgroundColor: `${planColor}15` },
                      ]}
                    >
                      <Ionicons name="calendar" size={20} color={planColor} />
                    </View>
                    <View>
                      <Text style={styles.dateLabel}>Expiration</Text>
                      <Text style={styles.dateValue}>
                        {formatDate(abonnement.end_date)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Features Section */}
                <View style={styles.featuresSection}>
                  <View style={styles.sectionHeader}>
                    <Ionicons
                      name="list-outline"
                      size={20}
                      color={planColor}
                      style={styles.sectionIcon}
                    />
                    <Text style={styles.sectionTitle}>
                      Fonctionnalités incluses
                    </Text>
                  </View>

                  <View style={styles.featuresList}>
                    {abonnement.catalogue.features.map((feature, index) => (
                      <MotiView
                        key={index}
                        style={styles.featureItem}
                        from={{ opacity: 0, translateX: -20 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{
                          delay: 300 + index * 70,
                          type: "timing",
                          duration: 400,
                        }}
                      >
                        <View
                          style={[
                            styles.featureCheck,
                            { backgroundColor: `${planColor}15` },
                          ]}
                        >
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color={planColor}
                          />
                        </View>
                        <Text style={styles.featureText}>{feature}</Text>
                      </MotiView>
                    ))}
                  </View>
                </View>

                {/* Payment Information */}
                <View style={styles.paymentSection}>
                  <View style={styles.sectionHeader}>
                    <Ionicons
                      name="card-outline"
                      size={20}
                      color={planColor}
                      style={styles.sectionIcon}
                    />
                    <Text style={styles.sectionTitle}>Méthode de paiement</Text>
                  </View>

                  <View style={styles.paymentMethod}>
                    <View style={styles.cardIconContainer}>
                      <Ionicons name="card" size={28} color="#FFFFFF" />
                    </View>
                    <View style={styles.cardDetails}>
                      <Text style={styles.cardName}>Visa •••• 4242</Text>
                      <Text style={styles.cardExpiry}>Expire 12/25</Text>
                    </View>
                    <TouchableOpacity style={styles.editButton}>
                      <Ionicons
                        name="create-outline"
                        size={18}
                        color={COLOORS.primary.main}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      { backgroundColor: planColor },
                    ]}
                    onPress={handleModify}
                    disabled={isExpired}
                  >
                    <Ionicons
                      name={isExpired ? "refresh" : "create-outline"}
                      size={20}
                      color="#FFFFFF"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.primaryButtonText}>
                      {isExpired ? "Réabonner" : "Modifier"}
                    </Text>
                  </TouchableOpacity>

                  {!isExpired && (
                    <View style={styles.secondaryButtonsRow}>
                      <TouchableOpacity
                        style={[
                          styles.secondaryButton,
                          {
                            borderColor: isSuspended
                              ? COLOORS.status.active.main
                              : COLOORS.status.suspended.main,
                          },
                        ]}
                        onPress={handleSuspend}
                      >
                        <Ionicons
                          name={isSuspended ? "play" : "pause"}
                          size={18}
                          color={
                            isSuspended
                              ? COLOORS.status.active.main
                              : COLOORS.status.suspended.main
                          }
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={[
                            styles.secondaryButtonText,
                            {
                              color: isSuspended
                                ? COLOORS.status.active.main
                                : COLOORS.status.suspended.main,
                            },
                          ]}
                        >
                          {isSuspended ? "Réactiver" : "Suspendre"}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.secondaryButton,
                          { borderColor: COLOORS.status.expired.main },
                        ]}
                        onPress={handleCancel}
                      >
                        <Ionicons
                          name="close-circle-outline"
                          size={18}
                          color={COLOORS.status.expired.main}
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={[
                            styles.secondaryButtonText,
                            { color: COLOORS.status.expired.main },
                          ]}
                        >
                          Annuler
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Explore Other Plans Card */}
            <TouchableOpacity
              style={styles.explorePlansCard}
              onPress={navigateToCatalogue}
            >
              <LinearGradient
                colors={["#6366F1", "#8B5CF6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.explorePlansContent}
              >
                <View style={styles.explorePlansIconContainer}>
                  <Ionicons name="rocket-outline" size={24} color="#FFFFFF" />
                </View>

                <View style={styles.explorePlansTextContainer}>
                  <Text style={styles.explorePlansTitle}>
                    Découvrez nos autres plans
                  </Text>
                  <Text style={styles.explorePlansDescription}>
                    Comparez les fonctionnalités et trouvez le plan parfait pour
                    vos besoins
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>
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
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
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
  errorContent: {
    alignItems: "center",
    padding: SPACING.lg,
  },
  errorText: {
    ...TYPOGRAPHY.body1,
    color: COLOORS.status.expired.main,
    textAlign: "center",
    marginVertical: SPACING.md,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLOORS.primary.main,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.xxl,
    marginTop: SPACING.md,
  },
  retryButtonText: {
    ...TYPOGRAPHY.button,
    color: "#FFFFFF",
  },
  subscriptionContainer: {
    paddingHorizontal: SPACING.md,
  },
  subscriptionCard: {
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  planHeader: {
    padding: SPACING.lg,
    position: "relative",
    overflow: "hidden",
  },
  decorativeCircle1: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    top: -30,
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
    position: "relative",
  },
  planTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  emojiText: {
    fontSize: 24,
  },
  planTitleContainer: {
    flex: 1,
  },
  planTitle: {
    ...TYPOGRAPHY.h2,
    color: "#FFFFFF",
    marginBottom: 2,
  },
  planSubtitle: {
    ...TYPOGRAPHY.body2,
    color: "rgba(255, 255, 255, 0.8)",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.xxl,
  },
  statusText: {
    ...TYPOGRAPHY.caption,
    fontFamily: "semibold",
  },
  priceSection: {
    marginTop: SPACING.sm,
  },
  priceLabel: {
    ...TYPOGRAPHY.body2,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceValue: {
    ...TYPOGRAPHY.h1,
    color: "#FFFFFF",
  },
  pricePeriod: {
    ...TYPOGRAPHY.body2,
    color: "rgba(255, 255, 255, 0.8)",
    marginLeft: 6,
  },
  cardBody: {
    backgroundColor: "#FFFFFF",
    padding: SPACING.lg,
  },
  dateSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.lg,
  },
  dateBlock: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  dateLabel: {
    ...TYPOGRAPHY.caption,
    color: COLOORS.gray3,
    marginBottom: 2,
  },
  dateValue: {
    ...TYPOGRAPHY.body2,
    color: COLOORS.black,
    fontFamily: "semibold",
  },
  featuresSection: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  sectionIcon: {
    marginRight: SPACING.xs,
  },
  sectionTitle: {
    ...TYPOGRAPHY.subtitle1,
    color: COLOORS.black,
  },
  featuresList: {
    marginTop: SPACING.xs,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  featureCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  featureText: {
    ...TYPOGRAPHY.body2,
    color: COLOORS.black,
    flex: 1,
  },
  paymentSection: {
    marginBottom: SPACING.lg,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.xs,
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  cardDetails: {
    flex: 1,
  },
  cardName: {
    ...TYPOGRAPHY.body2,
    fontFamily: "semibold",
    color: COLOORS.black,
    marginBottom: 2,
  },
  cardExpiry: {
    ...TYPOGRAPHY.caption,
    color: COLOORS.gray3,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtons: {
    marginTop: SPACING.md,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 54,
    borderRadius: RADIUS.xxl,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  primaryButtonText: {
    ...TYPOGRAPHY.button,
    color: "#FFFFFF",
  },
  secondaryButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 46,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    flex: 0.48,
  },
  secondaryButtonText: {
    ...TYPOGRAPHY.button,
    fontSize: 14,
  },
  explorePlansCard: {
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    ...SHADOWS.medium,
  },
  explorePlansContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
  },
  explorePlansIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  explorePlansTextContainer: {
    flex: 1,
  },
  explorePlansTitle: {
    ...TYPOGRAPHY.subtitle1,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  explorePlansDescription: {
    ...TYPOGRAPHY.body2,
    color: "rgba(255, 255, 255, 0.9)",
  },
});

export default AbonnementActuel;
