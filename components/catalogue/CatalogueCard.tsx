import { MotiView } from "moti";
import React, { useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import type { CataloguePlan } from "@/app/services/mocksApi/abonnementApiMock";

import { darkenColor, lightenColor } from "@/utils/colorUtils";
import {
  RADIUS,
  COLOORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "@/constants/theme";

interface CatalogueCardProps {
  plan: CataloguePlan;
  index: number;
  isCurrentPlan?: boolean;
  onSelect: () => void;
}

const CatalogueCard: React.FC<CatalogueCardProps> = ({
  plan,
  index,
  isCurrentPlan = false,
  onSelect,
}) => {
  const planEmojis = useMemo(() => ["🎓", "🏆", "🚀"], []);
  const planColors = useMemo(
    () => [COLOORS.primary.light, COLOORS.primary.main, COLOORS.primary.dark],
    []
  );

  const baseColor = planColors[index % planColors.length];
  const lighterVariant = lightenColor(baseColor, 10);
  const darkerVariant = darkenColor(baseColor, 8);
  const gradientColors: [string, string] = [darkerVariant, lighterVariant];
  const iconBgColor = lightenColor(baseColor, 25);

  return (
    <MotiView
      style={[
        styles.cardOuterContainer,
        isCurrentPlan && styles.currentPlanContainer,
      ]}
      from={{ opacity: 0, translateY: 30 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: "spring",
        damping: 18,
        stiffness: 120,
        delay: index * 150,
      }}
    >
      {plan.recommended && (
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

      {isCurrentPlan && (
        <View style={styles.currentPlanBadge}>
          <Ionicons
            name="checkmark-circle"
            size={12}
            color="#FFFFFF"
            style={styles.currentPlanIcon}
          />
          <Text style={styles.currentPlanText}>Plan Actuel</Text>
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
              <Text style={styles.planName}>{plan.planName}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.priceValue}>${plan.monthlyPrice}</Text>
                <Text style={styles.pricePeriod}>/ mois</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.featuresContainer}>
          {plan.features
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

          {plan.features.length > 4 && (
            <Text style={styles.moreFeatures}>
              +{plan.features.length - 4} autres fonctionnalités
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.selectPlanButton,
            isCurrentPlan && styles.currentPlanButton,
          ]}
          onPress={onSelect}
          activeOpacity={0.9}
        >
          <Text style={styles.selectPlanText}>
            {isCurrentPlan ? "Voir mon plan" : "Voir les détails"}
          </Text>
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
};

const styles = StyleSheet.create({
  cardOuterContainer: {
    marginBottom: 20,
    position: "relative",
    borderRadius: RADIUS.lg,
    ...SHADOWS.medium,
  },
  currentPlanContainer: {
    borderWidth: 2,
    borderColor: COLOORS.status.active.main,
    borderRadius: RADIUS.lg + 2,
    transform: [{ scale: 1.02 }],
  },
  recommendedBadge: {
    position: "absolute",
    top: -10,
    right: 24,
    backgroundColor: COLOORS.accent.blue.main,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
    ...SHADOWS.small,
  },
  recommendedIcon: {
    marginRight: 4,
  },
  recommendedText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "semibold",
  },
  currentPlanBadge: {
    position: "absolute",
    top: -10,
    left: 24,
    backgroundColor: COLOORS.status.active.main,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
    ...SHADOWS.small,
  },
  currentPlanIcon: {
    marginRight: 4,
  },
  currentPlanText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "semibold",
  },
  cardContainer: {
    borderRadius: RADIUS.lg,
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
    padding: SPACING.lg,
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
    ...TYPOGRAPHY.h3,
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
    marginHorizontal: SPACING.lg,
  },
  featuresContainer: {
    padding: SPACING.lg,
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
    ...TYPOGRAPHY.body2,
    color: "#FFFFFF",
    flex: 1,
  },
  moreFeatures: {
    ...TYPOGRAPHY.caption,
    color: "rgba(255, 255, 255, 0.7)",
    marginLeft: 36,
    marginTop: 4,
  },
  selectPlanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    paddingVertical: 14,
    borderRadius: RADIUS.xxl,
  },
  currentPlanButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  selectPlanText: {
    ...TYPOGRAPHY.button,
    color: "#FFFFFF",
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
});

export default CatalogueCard;
