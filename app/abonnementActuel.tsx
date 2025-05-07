import { COLORS } from "@/constants";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from "react-native";
import { MotiView } from "moti";

import type { Abonnement } from "./services/mocksApi/abonnementApiMock";

import {
  getCurrentUser,
  getAbonnementActiveByUser,
} from "./services/mocksApi/abonnementApiMock";

type Nav = {
  navigate: (value: string) => void;
};

type AlertConfig = {
  visible: boolean;
  title: string;
  message: string;
  buttons: Array<{
    text: string;
    style?: "default" | "cancel" | "destructive";
    onPress?: () => void;
  }>;
};

const { width } = Dimensions.get("window");

const LOGO_COLORS = {
  lighter: "#f9a99a",
  light: "#f28374",
  main: "#fe7862",
  dark: "#d75f4d",
  darker: "#b34e3a",
  contrastText: "#FFFFFF",
};

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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const day = date.getDate();
  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

const getPlanColor = (abonnement: Abonnement | null): string => {
  if (!abonnement) return LOGO_COLORS.main;

  switch (abonnement.catalogue.id) {
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
  const { navigate } = useNavigation<Nav>();
  const navigation = useNavigation();
  const router = useRouter();
  const { colors, dark } = useTheme();

  const [abonnement, setAbonnement] = useState<Abonnement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    visible: false,
    title: "",
    message: "",
    buttons: [],
  });

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

  const planColor = useMemo(() => getPlanColor(abonnement), [abonnement]);
  const planEmoji = useMemo(() => getPlanEmoji(abonnement), [abonnement]);
  const isSuspended = useMemo(
    () => abonnement?.status === "suspended",
    [abonnement]
  );
  const isExpired = useMemo(
    () => abonnement?.status === "expired",
    [abonnement]
  );

  const getPrice = useCallback(() => {
    if (!abonnement) return 0;

    switch (abonnement.duration) {
      case "monthly":
        return abonnement.catalogue.monthlyPrice;
      case "six_months":
        return abonnement.catalogue.sixMonthPrice;
      case "yearly":
        return abonnement.catalogue.yearlyPrice;
      default:
        return abonnement.catalogue.monthlyPrice;
    }
  }, [abonnement]);

  const getPricingPeriod = useCallback(() => {
    if (!abonnement) return "";

    switch (abonnement.duration) {
      case "monthly":
        return "/ mois";
      case "six_months":
        return "/ 6 mois";
      case "yearly":
        return "/ an";
      default:
        return "";
    }
  }, [abonnement]);

  const navigateToHome = useCallback(() => {
    router.push("/" as any);
  }, [router]);

  const navigateToNotifications = useCallback(() => {
    router.push("/notifications" as any);
  }, [router]);

  const showAlert = useCallback((config: AlertConfig) => {
    setAlertConfig({
      ...config,
      visible: true,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertConfig({
      ...alertConfig,
      visible: false,
    });
  }, [alertConfig]);

  const handleModify = useCallback(() => {
    if (isExpired) {
      showAlert({
        title: "Abonnement expiré",
        message:
          "Votre abonnement a expiré. Veuillez souscrire à un nouveau plan.",
        buttons: [{ text: "OK", onPress: hideAlert }],
        visible: false,
      });
      return;
    }
    navigate("abonnementcatalogue");
  }, [isExpired, navigate, showAlert, hideAlert]);

  const handleCancel = useCallback(() => {
    if (isExpired) {
      showAlert({
        title: "Abonnement déjà expiré",
        message: "Cet abonnement est déjà expiré et ne peut pas être annulé.",
        buttons: [{ text: "OK", onPress: hideAlert }],
        visible: false,
      });
      return;
    }

    showAlert({
      title: "Annuler l'abonnement",
      message:
        "Êtes-vous sûr de vouloir annuler votre abonnement? Votre abonnement sera actif jusqu'à la fin de la période payée.",
      buttons: [
        { text: "Non", onPress: hideAlert },
        {
          text: "Oui, annuler",
          style: "destructive",
          onPress: () => {
            hideAlert();
          },
        },
      ],
      visible: false,
    });
  }, [isExpired, hideAlert, showAlert]);

  const handleSuspend = useCallback(() => {
    if (isExpired) {
      showAlert({
        title: "Abonnement expiré",
        message: "Cet abonnement est déjà expiré et ne peut pas être suspendu.",
        buttons: [{ text: "OK", onPress: hideAlert }],
        visible: false,
      });
      return;
    }

    if (isSuspended) {
      showAlert({
        title: "Réactiver l'abonnement",
        message: "Voulez-vous réactiver votre abonnement?",
        buttons: [
          { text: "Annuler", style: "cancel", onPress: hideAlert },
          {
            text: "Réactiver",
            onPress: () => {
              hideAlert();
            },
          },
        ],
        visible: false,
      });
      return;
    }

    showAlert({
      title: "Suspendre l'abonnement",
      message:
        "Voulez-vous suspendre temporairement votre abonnement? Vous pourrez le réactiver à tout moment.",
      buttons: [
        { text: "Annuler", onPress: hideAlert },
        {
          text: "Suspendre",
          onPress: () => {
            hideAlert();
          },
        },
      ],
      visible: false,
    });
  }, [isExpired, isSuspended, hideAlert, showAlert]);

  const renderFeatureItem = useCallback(
    (feature: string, index: number) => (
      <MotiView
        key={index}
        style={styles.featureRow}
        from={{ opacity: 0, translateX: -10 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ delay: 300 + index * 100, type: "timing", duration: 400 }}
      >
        <View
          style={[styles.checkCircle, { backgroundColor: `${planColor}15` }]}
        >
          <Ionicons name="checkmark" size={16} color={planColor} />
        </View>
        <Text
          style={[
            styles.featureText,
            { color: dark ? COLORS.white : COLORS.black },
          ]}
        >
          {feature}
        </Text>
      </MotiView>
    ),
    [planColor, dark]
  );

  const renderHeader = useCallback(
    () => (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
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
            Abonnement Actuel
          </Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={navigateToNotifications}
        >
          <Ionicons name="notifications-outline" size={24} color={planColor} />
        </TouchableOpacity>
      </View>
    ),
    [dark, navigateToNotifications, navigation, planColor]
  );

  const renderTitleSection = useCallback(
    () => (
      <MotiView
        style={styles.titleSection}
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500 }}
      >
        <Text
          style={[
            styles.headingSubtitle,
            { color: dark ? COLORS.white : COLORS.gray3 },
          ]}
        >
          Détails de votre plan actuel
        </Text>
      </MotiView>
    ),
    [dark]
  );

  const renderNoSubscription = useCallback(
    () => (
      <MotiView
        style={styles.noSubscriptionContainer}
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 18, stiffness: 120 }}
      >
        <View style={styles.noSubIconContainer}>
          <Ionicons name="receipt-outline" size={60} color={LOGO_COLORS.main} />
        </View>

        <Text
          style={[
            styles.noSubscriptionTitle,
            { color: dark ? COLORS.white : COLORS.black },
          ]}
        >
          Aucun abonnement actif
        </Text>

        <Text
          style={[
            styles.noSubscriptionText,
            { color: dark ? COLORS.gray2 : COLORS.gray3 },
          ]}
        >
          Vous n&apos;avez actuellement aucun abonnement actif. Choisissez un
          plan pour commencer à profiter de nos services.
        </Text>

        <TouchableOpacity
          style={styles.choosePlanButton}
          onPress={navigateToHome}
        >
          <LinearGradient
            colors={[LOGO_COLORS.main, lightenColor(LOGO_COLORS.main, 10)]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.choosePlanButtonText}>Choisir un plan</Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
          </LinearGradient>
        </TouchableOpacity>
      </MotiView>
    ),
    [navigateToHome, dark]
  );

  const renderSubscriptionDetails = useCallback(() => {
    if (!abonnement) return null;

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <MotiView
          style={styles.cardContainer}
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", damping: 18, stiffness: 120 }}
        >
          <LinearGradient
            colors={[planColor, lightenColor(planColor, 15)]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cardHeader}
          >
            {/* Decorative elements */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />

            <View style={styles.planTitleContainer}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${lightenColor(planColor, 30)}80` },
                ]}
              >
                <Text style={styles.planIcon}>{planEmoji}</Text>
              </View>
              <Text style={styles.planName}>
                {abonnement.catalogue.planName}
              </Text>
            </View>

            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      abonnement.status === "active"
                        ? "#10B981"
                        : abonnement.status === "suspended"
                          ? "#F59E0B"
                          : "#EF4444",
                  },
                ]}
              >
                <Ionicons
                  name={
                    abonnement.status === "active"
                      ? "checkmark-circle"
                      : abonnement.status === "suspended"
                        ? "pause-circle"
                        : "close-circle"
                  }
                  size={16}
                  color="#FFFFFF"
                  style={styles.statusIcon}
                />
                <Text style={styles.statusText}>
                  {abonnement.status === "active"
                    ? "Actif"
                    : abonnement.status === "suspended"
                      ? "Suspendu"
                      : "Expiré"}
                </Text>
              </View>
            </View>
          </LinearGradient>

          <View
            style={[
              styles.cardBody,
              {
                backgroundColor: dark
                  ? COLORS.dark2 || "#1E1E1E"
                  : COLORS.white,
              },
            ]}
          >
            <View style={styles.detailsSection}>
              <MotiView
                style={styles.priceContainer}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 200, type: "spring", damping: 15 }}
              >
                <Text style={styles.priceLabel}>Prix actuel</Text>
                <View style={styles.priceValueContainer}>
                  <Text style={styles.priceValue}>${getPrice()}</Text>
                  <Text style={styles.pricePeriod}>{getPricingPeriod()}</Text>
                </View>
              </MotiView>

              <View style={styles.dateInfoContainer}>
                <MotiView
                  style={styles.dateInfoItem}
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: 100, type: "timing", duration: 400 }}
                >
                  <View style={styles.dateIconContainer}>
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={planColor}
                    />
                  </View>
                  <View>
                    <Text style={styles.dateInfoLabel}>Date de début</Text>
                    <Text style={styles.dateInfoValue}>
                      {formatDate(abonnement.start_date)}
                    </Text>
                  </View>
                </MotiView>

                <MotiView
                  style={styles.dateInfoItem}
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: 200, type: "timing", duration: 400 }}
                >
                  <View style={styles.dateIconContainer}>
                    <Ionicons name="calendar" size={20} color={planColor} />
                  </View>
                  <View>
                    <Text style={styles.dateInfoLabel}>Date de fin</Text>
                    <Text style={styles.dateInfoValue}>
                      {formatDate(abonnement.end_date)}
                    </Text>
                  </View>
                </MotiView>
              </View>

              <View style={styles.divider} />

              <MotiView
                style={styles.featuresHeaderContainer}
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 300, type: "timing", duration: 400 }}
              >
                <Ionicons
                  name="list-outline"
                  size={20}
                  color={planColor}
                  style={styles.featuresIcon}
                />
                <Text style={styles.featuresTitle}>
                  Fonctionnalités incluses
                </Text>
              </MotiView>

              <View style={styles.featuresContainer}>
                {abonnement.catalogue.features.map((feature, index) =>
                  renderFeatureItem(feature, index)
                )}
              </View>
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.modifyButton, { backgroundColor: planColor }]}
                onPress={handleModify}
              >
                <Ionicons
                  name={isExpired ? "refresh" : "create-outline"}
                  size={18}
                  color="#FFFFFF"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>
                  {isExpired ? "Réabonner" : "Modifier"}
                </Text>
              </TouchableOpacity>

              {!isExpired ? (
                <View style={styles.secondaryButtonsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.secondaryButton,
                      {
                        backgroundColor: dark
                          ? COLORS.dark3 || "#2A2A2A"
                          : "#F5F5F5",
                      },
                    ]}
                    onPress={handleSuspend}
                  >
                    <Ionicons
                      name={isSuspended ? "play" : "pause"}
                      size={18}
                      color={isSuspended ? "#10B981" : "#F59E0B"}
                      style={styles.buttonIcon}
                    />
                    <Text
                      style={[
                        styles.secondaryButtonText,
                        { color: isSuspended ? "#10B981" : "#F59E0B" },
                      ]}
                    >
                      {isSuspended ? "Réactiver" : "Suspendre"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.dangerButton,
                      { backgroundColor: dark ? "#2A1215" : "#FCEEF0" },
                    ]}
                    onPress={handleCancel}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={18}
                      color="#E11D48"
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.dangerButtonText}>Annuler</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>
        </MotiView>
      </ScrollView>
    );
  }, [
    abonnement,
    planColor,
    planEmoji,
    getPrice,
    getPricingPeriod,
    isExpired,
    isSuspended,
    handleModify,
    handleSuspend,
    handleCancel,
    renderFeatureItem,
    dark,
  ]);

  const renderCustomAlert = useCallback(() => {
    if (!alertConfig.visible) return null;

    return (
      <Modal visible={alertConfig.visible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <MotiView
            style={[
              styles.alertContainer,
              {
                backgroundColor: dark
                  ? COLORS.dark2 || "#1E1E1E"
                  : COLORS.white,
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
                    : alertConfig.title.toLowerCase().includes("annuler")
                      ? "help-circle"
                      : "information-circle"
                }
                size={48}
                color={
                  alertConfig.title.toLowerCase().includes("erreur")
                    ? "#E11D48"
                    : alertConfig.title.toLowerCase().includes("annuler")
                      ? "#F59E0B"
                      : LOGO_COLORS.main
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

            <View style={styles.alertButtonsContainer}>
              {alertConfig.buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.alertButton,
                    button.style === "destructive"
                      ? styles.alertDestructiveButton
                      : button.style === "cancel"
                        ? [
                            styles.alertCancelButton,
                            {
                              backgroundColor: dark
                                ? COLORS.dark3 || "#2A2A2A"
                                : "#F5F5F5",
                            },
                          ]
                        : [
                            styles.alertDefaultButton,
                            { backgroundColor: LOGO_COLORS.main },
                          ],
                    index > 0 && { marginLeft: 12 },
                  ]}
                  onPress={button.onPress}
                >
                  <Text
                    style={[
                      styles.alertButtonText,
                      button.style === "destructive"
                        ? { color: "#E11D48" }
                        : button.style === "cancel"
                          ? { color: dark ? COLORS.white : COLORS.gray3 }
                          : { color: COLORS.white },
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </MotiView>
        </View>
      </Modal>
    );
  }, [alertConfig, dark]);

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
              { color: dark ? COLORS.white : COLORS.gray3 },
            ]}
          >
            Chargement de l&apos;abonnement...
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

          <Text style={[styles.errorText, { color: "#E11D48" }]}>{error}</Text>

          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <LinearGradient
              colors={[LOGO_COLORS.main, lightenColor(LOGO_COLORS.main, 10)]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Ionicons
                name="refresh"
                size={18}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
              <Text style={styles.retryButtonText}>Réessayer</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    ),
    [colors.background, error, fetchData, dark]
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        {renderTitleSection()}
        {!abonnement ? renderNoSubscription() : renderSubscriptionDetails()}
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
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  titleSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  headingSubtitle: {
    fontSize: 16,
    fontFamily: "medium",
    opacity: 0.8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  // No subscription styles
  noSubscriptionContainer: {
    marginHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  noSubIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(254, 120, 98, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  noSubscriptionTitle: {
    fontSize: 22,
    fontFamily: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  noSubscriptionText: {
    fontSize: 16,
    fontFamily: "regular",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  choosePlanButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: LOGO_COLORS.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  choosePlanButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "semibold",
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  // Subscription card styles
  cardContainer: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 16,
  },
  cardHeader: {
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
  planTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  planIcon: {
    fontSize: 24,
  },
  planName: {
    fontSize: 24,
    fontFamily: "bold",
    color: "#FFFFFF",
  },
  statusContainer: {
    marginTop: 16,
    alignSelf: "flex-start",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 14,
    fontFamily: "semibold",
    color: "#FFFFFF",
  },
  cardBody: {
    padding: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  detailsSection: {
    marginBottom: 24,
  },
  priceContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: "medium",
    color: "#888",
    marginBottom: 8,
  },
  priceValueContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  priceValue: {
    fontSize: 36,
    fontFamily: "bold",
    color: LOGO_COLORS.main,
  },
  pricePeriod: {
    fontSize: 16,
    fontFamily: "medium",
    color: "#888",
    marginLeft: 4,
    marginBottom: 6,
  },
  dateInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  dateInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(254, 120, 98, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dateInfoLabel: {
    fontSize: 12,
    fontFamily: "medium",
    color: "#888",
    marginBottom: 4,
  },
  dateInfoValue: {
    fontSize: 14,
    fontFamily: "semibold",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginBottom: 24,
  },
  featuresHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  featuresIcon: {
    marginRight: 8,
  },
  featuresTitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: "#333",
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
  buttonsContainer: {
    gap: 16,
  },
  modifyButton: {
    height: 56,
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: LOGO_COLORS.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "semibold",
  },
  secondaryButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontFamily: "semibold",
  },
  dangerButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dangerButtonText: {
    color: "#E11D48",
    fontSize: 15,
    fontFamily: "semibold",
  },
  // Alert styles
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
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  alertMessage: {
    fontSize: 15,
    fontFamily: "regular",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  alertButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  alertButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  alertDefaultButton: {
    backgroundColor: LOGO_COLORS.main,
  },
  alertCancelButton: {
    backgroundColor: "#F5F5F5",
  },
  alertDestructiveButton: {
    backgroundColor: "#FCEEF0",
  },
  alertButtonText: {
    fontSize: 15,
    fontFamily: "semibold",
  },
  // Loading and error states
  loadingText: {
    fontSize: 16,
    fontFamily: "medium",
    marginTop: 16,
  },
  errorIconContainer: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    fontFamily: "medium",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  retryButton: {
    width: 180,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: LOGO_COLORS.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "semibold",
    marginLeft: 8,
  },
});

export default AbonnementActuel;
