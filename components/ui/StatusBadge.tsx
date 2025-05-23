import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

import { RADIUS, COLOORS, TYPOGRAPHY } from "@/constants/theme";

export type SubscriptionStatus = "active" | "suspended" | "expired";

interface StatusBadgeProps {
  status: SubscriptionStatus;
  size?: "small" | "medium" | "large";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "medium",
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "active":
        return {
          color: COLOORS.status.active.main,
          backgroundColor: COLOORS.status.active.light,
          icon: "checkmark-circle",
          label: "Actif",
        };
      case "suspended":
        return {
          color: COLOORS.status.suspended.main,
          backgroundColor: COLOORS.status.suspended.light,
          icon: "pause-circle",
          label: "Suspendu",
        };
      case "expired":
        return {
          color: COLOORS.status.expired.main,
          backgroundColor: COLOORS.status.expired.light,
          icon: "close-circle",
          label: "Expiré",
        };
      default:
        return {
          color: COLOORS.status.active.main,
          backgroundColor: COLOORS.status.active.light,
          icon: "checkmark-circle",
          label: "Actif",
        };
    }
  };

  const { color, backgroundColor, icon, label } = getStatusConfig();

  const sizeStyles = {
    small: {
      badge: styles.badgeSmall,
      icon: 14,
      text: styles.textSmall,
    },
    medium: {
      badge: styles.badgeMedium,
      icon: 16,
      text: styles.textMedium,
    },
    large: {
      badge: styles.badgeLarge,
      icon: 18,
      text: styles.textLarge,
    },
  };

  return (
    <View
      style={[
        styles.badge,
        sizeStyles[size].badge,
        { backgroundColor },
      ]}
    >
      <Ionicons
        name={icon as any}
        size={sizeStyles[size].icon}
        color={color}
        style={styles.icon}
      />
      <Text style={[styles.text, sizeStyles[size].text, { color }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.round,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeMedium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeLarge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    ...TYPOGRAPHY.subtitle2,
  },
  textSmall: {
    fontSize: 12,
  },
  textMedium: {
    fontSize: 14,
  },
  textLarge: {
    fontSize: 16,
  },
});

export default StatusBadge;
