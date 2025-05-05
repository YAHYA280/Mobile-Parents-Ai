import type { CataloguePlan } from "@/app/services/mocksApi/abonnementApiMock";

import { useNavigation } from "expo-router";
import React, { useMemo, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import styles from "@/styles/AbonnementCatalogueStyle";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

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
  main: "#fe7862",
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

  const renderCatalogueItem = useCallback(
    (props: { item: CataloguePlan; index: number }) => {
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
            yearlyPrice: item.yearlyPrice,
          }),
          features: item.features,
        });
      };

      return (
        <View style={styles.cardOuterContainer}>
          {item.recommended ? (
            <View
              style={[
                styles.premiumIndicator,
                { backgroundColor: darkerVariant },
              ]}
            />
          ) : (
            <></>
          )}
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cardContainer}
          >
            <View style={styles.leftSection}>
              <View
                style={[
                  styles.iconOuterContainer,
                  { backgroundColor: `${iconBgColor}80` },
                ]}
              >
                <View
                  style={[
                    styles.iconInnerContainer,
                    { backgroundColor: `${iconBgColor}A0` },
                  ]}
                >
                  <Text style={styles.emojiIcon}>{planEmojis[index]}</Text>
                </View>
              </View>
              <Text style={styles.planName}>{item.planName}</Text>
            </View>

            <View style={styles.rightSection}>
              <View style={styles.featuresSection}>
                {item.features
                  .slice(0, 4)
                  .map((feature: string, featureIndex: number) => (
                    <View key={featureIndex} style={styles.featureContainer}>
                      <View
                        style={[
                          styles.checkCircle,
                          { backgroundColor: `${iconBgColor}80` },
                        ]}
                      >
                        <Text style={styles.checkmark}>✓</Text>
                      </View>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
              </View>
            </View>

            <View style={styles.buttonPositioner}>
              <TouchableOpacity
                style={[
                  styles.selectPlanButton,
                  { backgroundColor: `${iconBgColor}80` },
                ]}
                onPress={handlePlanSelect}
              >
                <Text style={styles.selectPlanText}>Choisir le plan &gt;</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.patternOverlay} />
          </LinearGradient>
        </View>
      );
    },
    [navigation, planEmojis]
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
