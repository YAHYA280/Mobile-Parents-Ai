import { COLORS } from "@/constants";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";
import styles from "@/styles/AbonnementCatalogueStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useCallback, useRef } from "react";
import AbonnementCatalogueList from "@/components/AbonnementCatalogueList";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  Animated,
} from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";

import type { CataloguePlan } from "./services/mocksApi/abonnementApiMock";

import { getCatalogues } from "./services/mocksApi/abonnementApiMock";

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

const AbonnementCatalogue: React.FC = () => {
  const navigationBack = useNavigation();
  const { colors, dark } = useTheme();
  const [catalogues, setCatalogues] = useState<CataloguePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(30)).current;

  const fetchCatalogues = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCatalogues();
      setCatalogues(data);
      setError(null);
    } catch (err) {
      setError("Échec du chargement des plans. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalogues();
  }, [fetchCatalogues]);

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

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.headerContainer}>
        <View style={headerStyles.headerLeft}>
          <TouchableOpacity
            style={headerStyles.backButton}
            onPress={() => navigationBack.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={dark ? COLORS.white : COLORS.black}
            />
          </TouchableOpacity>
          <Text
            style={[
              headerStyles.headerTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Plans d'abonnement
          </Text>
        </View>
        <TouchableOpacity style={headerStyles.helpButton}>
          <Ionicons
            name="help-circle-outline"
            size={24}
            color={LOGO_COLORS.main}
          />
        </TouchableOpacity>
      </View>
    );
  }, [dark, navigationBack]);

  const renderPlansHeading = useCallback(
    () => (
      <MotiView
        style={styles.plansHeadingContainer}
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 600 }}
      >
        <View style={styles.headingIconContainer}>
          <Ionicons name="rocket-outline" size={26} color={LOGO_COLORS.main} />
        </View>
        <Text style={styles.plansHeadingTitle}>Choisissez votre plan</Text>
        <Text style={styles.plansHeadingSubtitle}>
          Sélectionnez le meilleur plan d'assistance aux devoirs pour votre
          enfant
        </Text>
      </MotiView>
    ),
    []
  );

  const renderBenefitsSection = useCallback(
    () => (
      <Animated.View
        style={[
          styles.benefitsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateAnim }],
            backgroundColor: dark ? "#242424" : "#FFFFFF",
          },
        ]}
      >
        <Text
          style={[
            styles.benefitsTitle,
            { color: dark ? COLORS.white : "#333" },
          ]}
        >
          Tous les plans incluent
        </Text>

        <View style={styles.benefitsGrid}>
          <MotiView
            style={styles.benefitItem}
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 300, type: "timing", duration: 400 }}
          >
            <View style={styles.benefitIconContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color={LOGO_COLORS.main}
              />
            </View>
            <Text
              style={[
                styles.benefitText,
                { color: dark ? COLORS.white : "#444" },
              ]}
            >
              Profils multiples
            </Text>
          </MotiView>

          <MotiView
            style={styles.benefitItem}
            from={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 400, type: "timing", duration: 400 }}
          >
            <View style={styles.benefitIconContainer}>
              <Ionicons
                name="book-outline"
                size={20}
                color={LOGO_COLORS.main}
              />
            </View>
            <Text
              style={[
                styles.benefitText,
                { color: dark ? COLORS.white : "#444" },
              ]}
            >
              Contenu éducatif
            </Text>
          </MotiView>

          <MotiView
            style={styles.benefitItem}
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 500, type: "timing", duration: 400 }}
          >
            <View style={styles.benefitIconContainer}>
              <Ionicons
                name="time-outline"
                size={20}
                color={LOGO_COLORS.main}
              />
            </View>
            <Text
              style={[
                styles.benefitText,
                { color: dark ? COLORS.white : "#444" },
              ]}
            >
              14 jours d'essai
            </Text>
          </MotiView>

          <MotiView
            style={styles.benefitItem}
            from={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 600, type: "timing", duration: 400 }}
          >
            <View style={styles.benefitIconContainer}>
              <Ionicons
                name="shield-outline"
                size={20}
                color={LOGO_COLORS.main}
              />
            </View>
            <Text
              style={[
                styles.benefitText,
                { color: dark ? COLORS.white : "#444" },
              ]}
            >
              Annulation simple
            </Text>
          </MotiView>
        </View>

        <MotiView
          style={styles.comparePlansBadge}
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 700, type: "spring", damping: 15 }}
        >
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#3B82F6"
            style={styles.infoIcon}
          />
          <Text style={styles.comparePlansText}>
            Comparez tous les plans en détail
          </Text>
          <Ionicons name="chevron-forward" size={14} color="#3B82F6" />
        </MotiView>
      </Animated.View>
    ),
    [dark, fadeAnim, translateAnim]
  );

  const renderTestimonial = useCallback(
    () => (
      <MotiView
        style={[
          styles.testimonialContainer,
          { backgroundColor: dark ? "#242424" : "#FFFFFF" },
        ]}
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 800, type: "spring", damping: 15 }}
      >
        <View style={styles.testimonialHeader}>
          <View style={styles.testimonialIconContainer}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={22}
              color={LOGO_COLORS.main}
            />
          </View>
          <Text
            style={[
              styles.testimonialTitle,
              { color: dark ? COLORS.white : "#333" },
            ]}
          >
            Ce que disent nos clients
          </Text>
        </View>

        <View style={styles.quoteContainer}>
          <Ionicons
            name="quote"
            size={28}
            color={`${LOGO_COLORS.main}40`}
            style={styles.quoteIcon}
          />
          <Text
            style={[
              styles.testimonialQuote,
              { color: dark ? COLORS.white : "#333" },
            ]}
          >
            "Mon fils a amélioré ses notes en mathématiques de manière
            significative. Le suivi détaillé et les exercices personnalisés ont
            fait toute la différence."
          </Text>
        </View>

        <View style={styles.testimonialFooter}>
          <Text
            style={[
              styles.testimonialAuthor,
              { color: dark ? COLORS.white : "#333" },
            ]}
          >
            Catherine Martin
          </Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name="star"
                size={16}
                color="#FFB800"
                style={styles.starIcon}
              />
            ))}
          </View>
        </View>
      </MotiView>
    ),
    [dark]
  );

  const renderLoading = () => (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={LOGO_COLORS.main} />
          <Text
            style={[
              styles.loadingText,
              { color: dark ? COLORS.white : "#666" },
            ]}
          >
            Chargement des plans...
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );

  const renderError = () => (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
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
        <View style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <Ionicons name="alert-circle" size={64} color="#E11D48" />
          </View>

          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchCatalogues}
          >
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
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        {renderPlansHeading()}
        <AbonnementCatalogueList data={catalogues} />
        {renderBenefitsSection()}
        {renderTestimonial()}
      </View>
    </SafeAreaView>
  );
};

const headerStyles = StyleSheet.create({
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
  plansHeadingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  headingIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${LOGO_COLORS.main}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: LOGO_COLORS.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  plansHeadingTitle: {
    fontSize: 24,
    fontFamily: "bold",
    color: LOGO_COLORS.darker,
    marginBottom: 8,
    textAlign: "center",
  },
  plansHeadingSubtitle: {
    fontSize: 16,
    fontFamily: "regular",
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 24,
  },
  // Benefits section
  benefitsContainer: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  benefitsTitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  benefitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  benefitItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  benefitIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${LOGO_COLORS.main}10`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: "medium",
    color: "#444",
    flex: 1,
  },
  // Loading and error states
  loadingText: {
    fontSize: 16,
    fontFamily: "medium",
    color: "#666",
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
  retryButton: {
    width: 180,
    height: 52,
    borderRadius: 26,
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
  buttonIcon: {
    marginRight: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "semibold",
  },
  // List container
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  comparePlansBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 20,
    alignSelf: "center",
  },
  infoIcon: {
    marginRight: 6,
  },
  comparePlansText: {
    fontSize: 14,
    fontFamily: "medium",
    color: "#3B82F6",
    marginRight: 6,
  },
  // Testimonial section
  testimonialContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  testimonialHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  testimonialIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${LOGO_COLORS.main}10`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  testimonialTitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: "#333",
  },
  quoteContainer: {
    position: "relative",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  quoteIcon: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  testimonialQuote: {
    fontSize: 15,
    fontFamily: "medium",
    color: "#444",
    lineHeight: 22,
    fontStyle: "italic",
  },
  testimonialFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  testimonialAuthor: {
    fontSize: 14,
    fontFamily: "semibold",
    color: "#333",
  },
  starsContainer: {
    flexDirection: "row",
  },
  starIcon: {
    marginLeft: 2,
  },
  // Loading and error states
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
});

export default AbonnementCatalogue;
