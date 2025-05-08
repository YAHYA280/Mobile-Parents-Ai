import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import {
  COLOORS,
  SPACING,
  TYPOGRAPHY,
  RADIUS,
  SHADOWS,
} from "@/constants/theme";
import { lightenColor, darkenColor } from "@/utils/colorUtils";
import type { CataloguePlan } from "@/app/services/mocksApi/abonnementApiMock";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;

// PlanCard Component with Military Badge Design for indicators
const PlanCard = ({
  item,
  index,
  isPlanSelected,
  onSelect,
}: {
  item: CataloguePlan;
  index: number;
  isPlanSelected: boolean;
  onSelect: (plan: CataloguePlan) => void;
}) => {
  const planColor = getPlanColor(item.id);

  // Animation values
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    const animateIn = () => {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    };

    // Slight delay for staggered effect
    const timeout = setTimeout(animateIn, index * 100 + 300);
    return () => clearTimeout(timeout);
  }, [index, opacityAnim, scaleAnim, rotateAnim]);

  // Calculate rotation for initial entry animation
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 100, type: "spring", damping: 15 }}
      style={styles.planCardContainer}
    >
      {/* Military-style badge container for both badges */}
      <View style={styles.badgesContainer}>
        {/* Active Plan Badge - Gold Shield design with text on left */}
        {isPlanSelected && (
          <Animated.View
            style={[
              styles.badgeWrapper,
              {
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={["#FFD700", "#B8860B"]}
              style={styles.actualBadge}
            >
              <Text style={styles.badgeText}>ACTUEL</Text>
              <Ionicons name="shield" size={16} color="#FFF" />
            </LinearGradient>
          </Animated.View>
        )}

        {/* Recommended Badge - Medal design with text on left */}
        {item.recommended && (
          <Animated.View
            style={[
              styles.badgeWrapper,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
                marginTop: isPlanSelected ? 8 : 0,
              },
            ]}
          >
            <LinearGradient
              colors={["#3B82F6", "#1E40AF"]}
              style={styles.recommendedBadge}
            >
              <Text style={styles.badgeText}>RECOMMANDÉ</Text>
              <Ionicons name="star" size={16} color="#FFF" />
            </LinearGradient>
          </Animated.View>
        )}
      </View>

      {/* Subtle highlight for selected plan */}
      {isPlanSelected && (
        <LinearGradient
          colors={["rgba(255,215,0,0.1)", "rgba(255,215,0,0)"]}
          style={styles.selectedPlanHighlight}
        />
      )}

      <LinearGradient
        colors={[planColor, lightenColor(planColor, 15)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.planCardGradient,
          isPlanSelected && {
            borderWidth: 1,
            borderColor: "rgba(255, 215, 0, 0.5)",
          },
        ]}
      >
        <View style={styles.planHeader}>
          <View
            style={[
              styles.planIcon,
              { backgroundColor: `${lightenColor(planColor, 30)}80` },
            ]}
          >
            <Text style={styles.planEmoji}>{getPlanEmoji(item.id)}</Text>
          </View>
          <Text style={styles.planName}>{item.planName}</Text>
        </View>

        <View style={styles.pricingContainer}>
          <Text style={styles.price}>${item.monthlyPrice}</Text>
          <Text style={styles.pricePeriod}>/ mois</Text>
        </View>

        <View style={styles.planDivider} />

        <View style={styles.featuresContainer}>
          {item.features.slice(0, 3).map((feature, featureIndex) => (
            <View key={featureIndex} style={styles.featureRow}>
              <View
                style={[
                  styles.featureIconBg,
                  { backgroundColor: `${lightenColor(planColor, 30)}80` },
                ]}
              >
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}

          {item.features.length > 3 && (
            <Text style={styles.moreFeatures}>
              +{item.features.length - 3} autres fonctionnalités
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.viewDetailsButton}
          onPress={() => onSelect(item)}
        >
          <Text style={styles.viewDetailsText}>
            {isPlanSelected ? "Modifier mon plan" : "Voir les détails"}
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>
    </MotiView>
  );
};

// Helper functions
const getPlanColor = (id: string): string => {
  switch (id) {
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

const getPlanEmoji = (id: string): string => {
  switch (id) {
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

const styles = StyleSheet.create({
  planCardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: 10,
    borderRadius: RADIUS.lg,
    ...SHADOWS.medium,
    position: "relative",
  },
  selectedPlanHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    zIndex: 2,
  },
  // Badge styles with text on left
  badgesContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    alignItems: "flex-end",
  },
  badgeWrapper: {
    ...SHADOWS.medium,
  },
  actualBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  recommendedBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontFamily: "bold",
    letterSpacing: 0.5,
    marginRight: 6,
  },
  planCardGradient: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    overflow: "hidden",
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  planEmoji: {
    fontSize: 22,
  },
  planName: {
    ...TYPOGRAPHY.h2,
    color: "#FFFFFF",
  },
  pricingContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: SPACING.md,
  },
  price: {
    ...TYPOGRAPHY.h1,
    color: "#FFFFFF",
  },
  pricePeriod: {
    ...TYPOGRAPHY.body1,
    color: "rgba(255, 255, 255, 0.8)",
    marginLeft: 4,
  },
  planDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: SPACING.md,
  },
  featuresContainer: {
    marginBottom: SPACING.md,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  featureIconBg: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  featureText: {
    ...TYPOGRAPHY.body2,
    color: "#FFFFFF",
    flex: 1,
  },
  moreFeatures: {
    ...TYPOGRAPHY.caption,
    color: "rgba(255, 255, 255, 0.7)",
    marginLeft: 30,
    marginTop: 4,
  },
  viewDetailsButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xxl,
  },
  viewDetailsText: {
    ...TYPOGRAPHY.button,
    color: "#FFFFFF",
    marginRight: SPACING.sm,
  },
});

export default PlanCard;
