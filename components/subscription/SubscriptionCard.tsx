import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  COLORS,
  TYPOGRAPHY,
  RADIUS,
  SPACING,
  SHADOWS,
} from "@/constants/theme";
import { formatDate, getPricingPeriod } from "@/utils/formatUtils";
import { lightenColor } from "@/utils/colorUtils";

export type SubscriptionStatus = "active" | "suspended" | "expired";

interface SubscriptionCardProps {
  planName: string;
  planEmoji: string;
  planColor: string;
  status: SubscriptionStatus;
  price: number;
  duration: string;
  startDate: string;
  endDate: string;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  planName,
  planEmoji,
  planColor,
  status,
  price,
  duration,
  startDate,
  endDate,
}) => {
  return (
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
          <Text style={styles.planName}>{planName}</Text>
        </View>

        <View style={styles.statusContainer}>
          <StatusBadge status={status} />
        </View>
      </LinearGradient>

      <View style={styles.cardBody}>
        <MotiView
          style={styles.priceContainer}
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 200, type: "spring", damping: 15 }}
        >
          <Text style={styles.priceLabel}>Prix actuel</Text>
          <View style={styles.priceValueContainer}>
            <Text style={[styles.priceValue, { color: planColor }]}>
              ${price}
            </Text>
            <Text style={styles.pricePeriod}>{getPricingPeriod(duration)}</Text>
          </View>
        </MotiView>

        <View style={styles.dateInfoContainer}>
          <MotiView
            style={styles.dateInfoItem}
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 100, type: "timing", duration: 400 }}
          >
            <View
              style={[
                styles.dateIconContainer,
                { backgroundColor: `${planColor}10` },
              ]}
            >
              <Ionicons name="calendar-outline" size={20} color={planColor} />
            </View>
            <View>
              <Text style={styles.dateInfoLabel}>Date de début</Text>
              <Text style={styles.dateInfoValue}>{formatDate(startDate)}</Text>
            </View>
          </MotiView>

          <MotiView
            style={styles.dateInfoItem}
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 200, type: "timing", duration: 400 }}
          >
            <View
              style={[
                styles.dateIconContainer,
                { backgroundColor: `${planColor}10` },
              ]}
            >
              <Ionicons name="calendar" size={20} color={planColor} />
            </View>
            <View>
              <Text style={styles.dateInfoLabel}>Date de fin</Text>
              <Text style={styles.dateInfoValue}>{formatDate(endDate)}</Text>
            </View>
          </MotiView>
        </View>
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    ...SHADOWS.medium,
    marginHorizontal: 16,
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
  cardBody: {
    padding: 24,
    backgroundColor: "#FFFFFF",
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
    alignItems: "baseline",
  },
  priceValue: {
    fontSize: 36,
    fontFamily: "bold",
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
});

export default SubscriptionCard;
