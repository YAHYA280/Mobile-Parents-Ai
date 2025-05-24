import React from "react";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

import Button from "@/components/ui/Button";
import { RADIUS, COLOORS, SHADOWS, TYPOGRAPHY } from "@/constants/theme";

interface NoSubscriptionViewProps {
  onChoosePlan: () => void;
}

const NoSubscriptionView: React.FC<NoSubscriptionViewProps> = ({
  onChoosePlan,
}) => {
  return (
    <MotiView
      style={[
        styles.container,
        {
          backgroundColor: COLOORS.surface.light,
        },
      ]}
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 18, stiffness: 120 }}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name="receipt-outline"
          size={60}
          color={COLOORS.primary.main}
        />
      </View>

      <Text style={[styles.title, { color: COLOORS.black }]}>
        Aucun abonnement actif
      </Text>

      <Text style={[styles.description, { color: COLOORS.gray3 }]}>
        Vous n&apos;avez actuellement aucun abonnement actif. Choisissez un plan
        pour commencer à profiter de nos services.
      </Text>

      <Button
        label="Choisir un plan"
        onPress={onChoosePlan}
        rightIcon="arrow-forward"
        gradientColors={[COLOORS.primary.main, COLOORS.primary.dark]}
      />
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.lg,
    padding: 24,
    alignItems: "center",
    ...SHADOWS.medium,
    marginHorizontal: 16,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${COLOORS.primary.main}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    ...TYPOGRAPHY.h2,
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    ...TYPOGRAPHY.body1,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
});

export default NoSubscriptionView;
