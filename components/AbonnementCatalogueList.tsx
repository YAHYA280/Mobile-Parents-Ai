import type { CataloguePlan } from "@/app/services/mocksApi/abonnementApiMock";

import { useNavigation } from "expo-router";
import React, { useMemo, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

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

const darkenColor = (hex: string, percent: number): string => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const darkenAmount = Math.floor(255 * (percent / 100));

  const rNew = Math.max(r - darkenAmount, 0);
  const gNew = Math.max(g - darkenAmount, 0);
  const bNew = Math.max(b - darkenAmount, 0);

  return `#${rNew.toString(16).padStart(2, "0")}${gNew.toString(16).padStart(2, "0")}${bNew.toString(16).padStart(2, "0")}`;
};

export default function AbonnementCatalogueList({
  data,
  limit,
}: {
  data: CataloguePlan[];
  limit?: number;
}) {
  const navigation = useNavigation<Navigation>();

  const planEmojis = useMemo(() => ["🎓", "🏆", "🚀"], []);
  const planColors = useMemo(
    () => [LOGO_COLORS.light, LOGO_COLORS.main, LOGO_COLORS.dark],
    []
  );

  const renderCatalogueItem = useCallback(
    (props: { item: CataloguePlan; index: number }) => {
      const { item, index } = props;
      const baseColor = planColors[index % planColors.length];
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
            yearlyPrice: item.yearlyPrice,
          }),
          features: item.features,
        });
      };

      return (
        <MotiView
          style={styles.cardOuterContainer}
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: "spring",
            damping: 18,
            stiffness: 120,
            delay: index * 150,
          }}
        >
          {item.recommended && (
            <View style={styles.recommendedBadge}>
              <Ionicons
                name="star"
                size={12}
                color="#FFFFFF"
                style={styles.recommendedIcon}
              />
              <Text style={styles.recommendedText}>Recommandé</Text>
            </View>
          )}

          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.8 }}
            style={styles.cardContainer}
          >
            {/* Decorative elements */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />

            <View style={styles.cardHeader}>
              <View style={styles.planInfoContainer}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${iconBgColor}80` },
                  ]}
                >
                  <Text style={styles.emojiIcon}>
                    {planEmojis[index % planEmojis.length]}
                  </Text>
                </View>

                <View style={styles.planTextContainer}>
                  <Text style={styles.planName}>{item.planName}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceValue}>${item.monthlyPrice}</Text>
                    <Text style={styles.pricePeriod}>/ mois</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.featuresContainer}>
              {item.features
                .slice(0, 4)
                .map((feature: string, featureIndex: number) => (
                  <View key={featureIndex} style={styles.featureItem}>
                    <View
                      style={[
                        styles.checkCircle,
                        { backgroundColor: `${iconBgColor}80` },
                      ]}
                    >
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}

              {item.features.length > 4 && (
                <Text style={styles.moreFeatures}>
                  +{item.features.length - 4} autres fonctionnalités
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.selectPlanButton}
              onPress={handlePlanSelect}
              activeOpacity={0.9}
            >
              <Text style={styles.selectPlanText}>Voir les détails</Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
            </TouchableOpacity>
          </LinearGradient>
        </MotiView>
      );
    },
    [navigation, planEmojis, planColors]
  );

  const displayedData = limit ? data.slice(0, limit) : data;

  return (
    <FlatList
      data={displayedData}
      renderItem={({ item, index }) => renderCatalogueItem({ item, index })}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardOuterContainer: {
    marginBottom: 20,
    position: "relative",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  recommendedBadge: {
    position: "absolute",
    top: -10,
    right: 24,
    backgroundColor: "#3B82F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendedIcon: {
    marginRight: 4,
  },
  recommendedText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "semibold",
  },
  cardContainer: {
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
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
  cardHeader: {
    padding: 20,
  },
  planInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  emojiIcon: {
    fontSize: 24,
  },
  planTextContainer: {
    flex: 1,
  },
  planName: {
    fontSize: 22,
    fontFamily: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceValue: {
    fontSize: 18,
    fontFamily: "bold",
    color: "#FFFFFF",
  },
  pricePeriod: {
    fontSize: 14,
    fontFamily: "regular",
    color: "rgba(255, 255, 255, 0.8)",
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 20,
  },
  featuresContainer: {
    padding: 20,
  },
  featureItem: {
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
    color: "#FFFFFF",
    flex: 1,
  },
  moreFeatures: {
    fontSize: 14,
    fontFamily: "medium",
    color: "rgba(255, 255, 255, 0.7)",
    marginLeft: 36,
    marginTop: 4,
  },
  selectPlanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 30,
  },
  selectPlanText: {
    fontSize: 16,
    fontFamily: "semibold",
    color: "#FFFFFF",
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
});
