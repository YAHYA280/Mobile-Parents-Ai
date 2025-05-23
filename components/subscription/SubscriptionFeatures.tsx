import React from "react";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

import FeatureItem from "@/components/ui/FeatureItem";
import { COLORS, SPACING, TYPOGRAPHY } from "@/constants/theme";

interface SubscriptionFeaturesProps {
  features: string[];
  planColor: string;
}

const SubscriptionFeatures: React.FC<SubscriptionFeaturesProps> = ({
  features,
  planColor,
}) => {
  return (
    <View>
      <MotiView
        style={styles.featuresHeaderContainer}
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 300, type: "timing", duration: 400 }}
      >
        <Ionicons
          name="list-outline"
          size={20}
          color={planColor}
          style={styles.featuresIcon}
        />
        <Text style={[styles.featuresTitle, { color: COLORS.black }]}>
          Fonctionnalités incluses
        </Text>
      </MotiView>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <FeatureItem
            key={index}
            feature={feature}
            index={index}
            color={planColor}
            delay={300}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  featuresHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  featuresIcon: {
    marginRight: SPACING.sm,
  },
  featuresTitle: {
    ...TYPOGRAPHY.subtitle1,
  },
  featuresContainer: {
    marginBottom: SPACING.lg,
  },
});

export default SubscriptionFeatures;
