import { useNavigation } from "expo-router";
import { useTheme } from "@/theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, SIZES, FONTS, COLORS, images } from "@/constants";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";

import type { CataloguePlan } from "./services/mocksApi/abonnementApiMock";

import { getCatalogues } from "./services/mocksApi/abonnementApiMock";

type AllowedRoutes = "planDetails" | "notifications" | "mybookmark";

type PlanDetailsParams = {
  planId: string;
  pricing: string;
  features: string[];
};

interface Navigation {
  navigate: <T extends AllowedRoutes>(
    screen: T,
    params?: T extends "planDetails" ? PlanDetailsParams : undefined
  ) => void;
}

const LOGO_COLORS = {
  lighter: "#f9a99a",
  light: "#f28374",
  main: "#fe7862",
  dark: "#d75f4d",
  darker: "#b34e3a",
  contrastText: "#FFFFFF",
};

const lightenColor = (hex: string, percent: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const lightenAmount = Math.floor(255 * (percent / 100));

  const rNew = Math.min(r + lightenAmount, 255);
  const gNew = Math.min(g + lightenAmount, 255);
  const bNew = Math.min(b + lightenAmount, 255);

  return `#${rNew.toString(16).padStart(2, '0')}${gNew.toString(16).padStart(2, '0')}${bNew.toString(16).padStart(2, '0')}`;
};

const darkenColor = (hex: string, percent: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const darkenAmount = Math.floor(255 * (percent / 100));

  const rNew = Math.max(r - darkenAmount, 0);
  const gNew = Math.max(g - darkenAmount, 0);
  const bNew = Math.max(b - darkenAmount, 0);

  return `#${rNew.toString(16).padStart(2, '0')}${gNew.toString(16).padStart(2, '0')}${bNew.toString(16).padStart(2, '0')}`;
};

const AbonnementCatalogue: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const { colors, dark } = useTheme();
  const [catalogues, setCatalogues] = useState<CataloguePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const planEmojis = useMemo(() => ["🎓", "🏆", "🚀"], []);

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

  const renderCatalogueItem = useCallback((props: { item: CataloguePlan, index: number }) => {
    const { item, index } = props;
    const baseColor = LOGO_COLORS.main;
    const lighterVariant = lightenColor(baseColor, 10);
    const darkerVariant = darkenColor(baseColor, 8);
    const gradientColors: [string, string] = [darkerVariant, lighterVariant];
    const iconBgColor = lightenColor(baseColor, 25);

    const handlePlanSelect = () => {
      navigation.navigate("planDetails", {
        planId: item.id,
        pricing: JSON.stringify({
          monthlyPrice: item.monthlyPrice,
          sixMonthPrice: item.sixMonthPrice,
          yearlyPrice: item.yearlyPrice
        }),
        features: item.features
      });
    };

    return (
      <View style={styles.cardOuterContainer}>
        {item.recommended ? (
          <View style={[styles.premiumIndicator, { backgroundColor: darkerVariant }]} />
        ) : (
          <>
          </>
        )}
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.cardContainer}
        >
          <View style={styles.leftSection}>
            <View style={[styles.iconOuterContainer, { backgroundColor: `${iconBgColor}80` }]}>
              <View style={[styles.iconInnerContainer, { backgroundColor: `${iconBgColor}A0` }]}>
                <Text style={styles.emojiIcon}>{planEmojis[index]}</Text>
              </View>
            </View>
            <Text style={styles.planName}>{item.planName}</Text>
          </View>

          <View style={styles.rightSection}>
            <View style={styles.featuresSection}>
              {item.features.slice(0, 4).map((feature: string, featureIndex: number) => (
                <View key={featureIndex} style={styles.featureContainer}>
                  <View style={[styles.checkCircle, { backgroundColor: `${iconBgColor}80` }]}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.buttonPositioner}>
            <TouchableOpacity
              style={[styles.selectPlanButton, { backgroundColor: `${iconBgColor}80` }]}
              onPress={handlePlanSelect}
            >
              <Text style={styles.selectPlanText}>Choisir le plan &gt;</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.patternOverlay} />
        </LinearGradient>
      </View>
    );
  }, [navigation, planEmojis]);

  const renderHeader = useCallback(() => {
    const navigateToNotifications = () => navigation.navigate("notifications");

    return (
      <View style={styles.headerContainer}>
        <View style={styles.viewLeft}>
          <Image source={images.user7} resizeMode="contain" style={styles.parentIcon} />
          <View style={styles.viewNameContainer}>
            <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
              Andrew Ainsley
            </Text>
          </View>
        </View>
        <View style={styles.viewRight}>
          <TouchableOpacity style={styles.iconButton} onPress={navigateToNotifications}>
            <Image
              source={icons.notificationBell2}
              resizeMode="contain"
              style={[styles.bellIcon, { tintColor: dark ? COLORS.white : COLORS.greyscale900 }]}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [navigation, dark]);

  const renderPlansHeading = useCallback(() => (
    <View style={styles.plansHeadingContainer}>
      <Text style={[styles.plansHeadingTitle, { color: LOGO_COLORS.darker }]}>Plans</Text>
      <Text style={styles.plansHeadingSubtitle}>
        Sélectionnez le meilleur plan d&apos;assistance aux devoirs pour votre enfant
      </Text>
    </View>
  ), []);

  const renderLoading = () => (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={LOGO_COLORS.main} />
        <Text style={styles.loadingText}>Chargement des plans...</Text>
      </View>
    </SafeAreaView>
  );

  const renderError = () => (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: LOGO_COLORS.main }]} 
          onPress={fetchCatalogues}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const keyExtractor = useCallback((item: CataloguePlan) => item.id, []);

  if (loading) {
    return renderLoading();
  }

  if (error) {
    return renderError();
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        {renderPlansHeading()}
        <FlatList
          data={catalogues}
          renderItem={renderCatalogueItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  listContainer: {
    paddingBottom: 24,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    letterSpacing: 0.5,
  },
  viewNameContainer: {
    marginLeft: SIZES.padding3 - 2,
  },
  viewRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: SIZES.base,
  },
  bellIcon: {
    height: 26,
    width: 26,
    tintColor: COLORS.black,
    marginRight: SIZES.base,
  },
  plansHeadingContainer: {
    marginBottom: SIZES.padding3 + 8,
    paddingHorizontal: 4,
  },
  plansHeadingTitle: {
    ...FONTS.h1,
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  plansHeadingSubtitle: {
    ...FONTS.body3,
    color: COLORS.gray3,
  },
  parentIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  iconOuterContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emojiIcon: {
    fontSize: 24,
  },
  planName: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.white,
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  rightSection: {
    width: "75%",
    paddingTop: 20,
    paddingLeft: SIZES.padding2,
    paddingRight: SIZES.padding2,
  },
  featuresSection: {
    marginBottom: 0,
  },
  featureContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "bold",
  },
  featureText: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.white,
    flex: 1,
    opacity: 0.9,
  },
  buttonPositioner: {
    position: "absolute",
    right: 16,
    bottom: 6,
    zIndex: 2,
  },
  selectPlanButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
  },
  selectPlanText: {
    fontSize: 12,
    fontFamily: "semibold",
    color: COLORS.black,
    letterSpacing: 1,
  },
  patternOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03,
    backgroundColor: "transparent",
  },
  cardOuterContainer: {
    width: "100%",
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 7,
    position: "relative",
  },
  premiumIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 8,
    height: "100%",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    zIndex: 1,
  },
  cardContainer: {
    width: "100%",
    height: 170,
    borderRadius: 16,
    overflow: "hidden",
    flexDirection: "row",
    position: "relative",
  },
  leftSection: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.padding2,
  },
  iconInnerContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray3,
  },
  errorText: {
    fontSize: 16,
    color: "#E53935",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "semibold",
  },
});

export default AbonnementCatalogue;