import React from "react";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { lightenColor } from "@/utils/colorUtils";
import { formatDuration } from "@/utils/formatUtils";
import { RADIUS, SHADOWS, TYPOGRAPHY } from "@/constants/theme";

import FeatureItem from "./FeatureItem";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;

interface PricingOption {
  duration: string;
  price: number;
  apiDuration: string;
  features: string[];
  discountPercentage?: number;
}

interface PricingCardProps {
  option: PricingOption;
  index: number;
  planColor: string;
  planEmoji: string;
  onSelect: (option: PricingOption) => void;
  isSelected?: boolean;
  isCurrentPlan?: boolean;
  buttonText?: string;
  buttonDisabled?: boolean;
  features?: string[];
  loading?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  option,
  index,
  planColor,
  planEmoji,
  onSelect,
  isSelected = false,
  isCurrentPlan = false,
  buttonText = "Sélectionner",
  buttonDisabled = false,
  features = [],
  loading = false,
}) => {
  const RIBBON_COLOR = "#E53935";

  // Make sure we have a valid color to lighten
  const getLightenedColor = (color: string, amount: number) => {
    try {
      return lightenColor(color, amount);
    } catch (error) {
      console.error("Error lightening color:", error);
      return color; // Return original color as fallback
    }
  };

  // Use the features from option if available, otherwise use props.features
  const featuresToShow = option.features || features;

  return (
    <MotiView
      style={styles.cardOuterContainer}
      from={{ opacity: 0, scale: 0.9, translateY: 20 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ delay: 200 + index * 100, type: "spring", damping: 15 }}
    >
      {/* Award Icon at Top */}
      <View style={styles.awardIconContainer}>
        <LinearGradient
          colors={[planColor, getLightenedColor(planColor, 15)]}
          style={styles.awardIconCircle}
        >
          <Text style={styles.emojiIcon}>{planEmoji}</Text>
        </LinearGradient>
      </View>

      {/* Discount Ribbon */}
      {option.discountPercentage ? (
        <MotiView
          style={styles.ribbonContainer}
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 300 + index * 100, type: "spring", damping: 10 }}
        >
          <LinearGradient
            colors={[RIBBON_COLOR, getLightenedColor(RIBBON_COLOR, 15)]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ribbon}
          >
            <Ionicons
              name="pricetag"
              size={12}
              color="#FFFFFF"
              style={styles.ribbonIcon}
            />
            <Text style={styles.ribbonText}>
              {option.discountPercentage}% OFF
            </Text>
          </LinearGradient>
        </MotiView>
      ) : null}

      {/* Main Card Container */}
      <View style={styles.planContainer}>
        {/* Header Section with Gradient */}
        <LinearGradient
          colors={[planColor, getLightenedColor(planColor, 15)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.planHeaderSection}
        >
          {/* Decorative elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />

          <View style={styles.planHeaderContent}>
            <Text style={styles.planTypeLabel}>
              {formatDuration(option.duration)}
            </Text>
            <View style={styles.planPriceContainer}>
              <Text style={styles.planPrice}>${option.price}</Text>
              <Text style={styles.planPeriod}>
                / {option.duration.toLowerCase()}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Body Section with Features */}
        <View
          style={[
            styles.planBodySection,
            {
              backgroundColor: "#FFFFFF",
            },
          ]}
        >
          <Text style={styles.featuresTitle}>Caractéristiques Incluses</Text>

          {/* Features List */}
          <View style={styles.featuresListContainer}>
            {featuresToShow.map((feature, i) => (
              <FeatureItem
                key={i}
                feature={feature}
                index={i}
                color={planColor}
              />
            ))}
          </View>

          {/* Button Section */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={[
                styles.getStartedButton,
                { backgroundColor: planColor },
                buttonDisabled && styles.disabledButton,
                isSelected && styles.selectedButton,
              ]}
              disabled={buttonDisabled || loading}
              onPress={() => onSelect(option)}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.getStartedText}>
                    {isCurrentPlan ? "Plan Actuel" : buttonText}
                  </Text>
                  {!buttonDisabled && !isCurrentPlan && (
                    <Ionicons
                      name="arrow-forward"
                      size={18}
                      color="#FFFFFF"
                      style={styles.buttonIcon}
                    />
                  )}
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  cardOuterContainer: {
    width: CARD_WIDTH,
    marginHorizontal: 8,
    position: "relative",
    paddingTop: 15, // Space for the award icon
  },
  awardIconContainer: {
    position: "absolute",
    top: 0,
    left: "50%",
    marginLeft: -25,
    zIndex: 10,
  },
  awardIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    ...SHADOWS.medium,
  },
  emojiIcon: {
    fontSize: 22,
  },
  ribbonContainer: {
    position: "absolute",
    top: 60,
    right: -5,
    zIndex: 10,
  },
  ribbon: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    ...SHADOWS.small,
  },
  ribbonIcon: {
    marginRight: 4,
  },
  ribbonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "bold",
    letterSpacing: 0.5,
  },
  planContainer: {
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    ...SHADOWS.large,
    // Make the overall card taller
    minHeight: 550, // Increased from previous value
  },
  planHeaderSection: {
    padding: 24,
    position: "relative",
    overflow: "hidden",
    paddingTop: 40, // Extra space for the award icon
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
  planHeaderContent: {
    alignItems: "center",
  },
  planTypeLabel: {
    fontSize: 18,
    fontFamily: "semibold",
    color: "#FFFFFF",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.15)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  planPriceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  planPrice: {
    fontSize: 42,
    fontFamily: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  planPeriod: {
    fontSize: 16,
    fontFamily: "medium",
    color: "rgba(255, 255, 255, 0.9)",
    marginLeft: 4,
  },
  planBodySection: {
    padding: 24,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
    // Make the body section taller
    flex: 1, // Use flex to expand and fill the card
    display: "flex",
    flexDirection: "column",
  },
  featuresTitle: {
    ...TYPOGRAPHY.subtitle1,
    marginBottom: 16,
    color: "#333",
  },
  // Replace scrollView with direct container
  featuresListContainer: {
    marginBottom: 16,
    flex: 1, // Allow the features to take available space
  },
  // Create a separate section for the button
  buttonSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  getStartedButton: {
    height: 56,
    borderRadius: RADIUS.xxl,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.medium,
  },
  disabledButton: {
    opacity: 0.7, // Increased from 0.5 for better visibility
  },
  selectedButton: {
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  getStartedText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "semibold",
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
});

export default PricingCard;
