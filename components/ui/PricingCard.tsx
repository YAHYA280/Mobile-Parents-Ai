import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";
import { COLORS, RADIUS } from "@/constants/theme";
import { formatDuration } from "@/utils/formatUtils";
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
  const { dark } = useTheme();
  const RIBBON_COLOR = "#E53935";

  function lightenColor(
    planColor: string,
    arg1: number
  ): import("react-native").ColorValue {
    throw new Error("Function not implemented.");
  }

  return (
    <MotiView
      style={styles.cardOuterContainer}
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 200 + index * 100, type: "spring", damping: 15 }}
    >
      <View style={styles.awardIconContainer}>
        <View
          style={[
            styles.awardIconCircle,
            { backgroundColor: `${planColor}20` },
          ]}
        >
          <Text style={styles.emojiIcon}>{planEmoji}</Text>
        </View>
      </View>

      {option.discountPercentage ? (
        <View style={styles.ribbonContainer}>
          <View style={[styles.ribbon, { backgroundColor: RIBBON_COLOR }]}>
            <Ionicons
              name="pricetag"
              size={12}
              color="#FFFFFF"
              style={styles.ribbonIcon}
            />
            <Text style={styles.ribbonText}>
              {option.discountPercentage}% OFF
            </Text>
          </View>
        </View>
      ) : null}

      <View style={styles.planContainer}>
        <LinearGradient
          colors={[planColor, lightenColor(planColor, 15)]}
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

        <View
          style={[
            styles.planBodySection,
            {
              backgroundColor: dark ? COLORS.dark2 : "#FFFFFF",
            },
          ]}
        >
          {features.length > 0 && (
            <ScrollView
              style={styles.featuresScrollView}
              showsVerticalScrollIndicator={false}
            >
              {features.map((feature, i) => (
                <FeatureItem
                  key={i}
                  feature={feature}
                  index={i}
                  color={planColor}
                />
              ))}
              <View style={{ height: 80 }} />
            </ScrollView>
          )}

          <View style={styles.buttonPositioner}>
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
  },
  awardIconContainer: {
    position: "absolute",
    top: -15,
    left: "50%",
    marginLeft: -20,
    zIndex: 10,
  },
  awardIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(254, 120, 98, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emojiIcon: {
    fontSize: 20,
  },
  ribbonContainer: {
    position: "absolute",
    top: 30,
    right: -5,
    zIndex: 10,
  },
  ribbon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E53935",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    shadowColor: "#E53935",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  ribbonIcon: {
    marginRight: 4,
  },
  ribbonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "bold",
  },
  planContainer: {
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  planHeaderSection: {
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
  planHeaderContent: {
    alignItems: "center",
  },
  planTypeLabel: {
    fontSize: 16,
    fontFamily: "semibold",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  planPriceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  planPrice: {
    fontSize: 36,
    fontFamily: "bold",
    color: "#FFFFFF",
  },
  planPeriod: {
    fontSize: 16,
    fontFamily: "medium",
    color: "rgba(255, 255, 255, 0.8)",
    marginLeft: 4,
  },
  planBodySection: {
    padding: 24,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
    minHeight: 300,
  },
  featuresScrollView: {
    maxHeight: 320,
  },
  buttonPositioner: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
  },
  getStartedButton: {
    height: 56,
    borderRadius: RADIUS.xxl,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.5,
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
