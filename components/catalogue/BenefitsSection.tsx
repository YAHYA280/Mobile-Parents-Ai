import React from "react";
import { MotiView } from "moti";
import { useRouter } from "expo-router"; // Import useRouter instead of useNavigation
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import {
  RADIUS,
  COLOORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "@/constants/theme";

interface BenefitItem {
  icon: string;
  title: string;
}

interface BenefitsSectionProps {
  benefits?: BenefitItem[];
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({
  benefits = [
    { icon: "person-outline", title: "Profils multiples" },
    { icon: "book-outline", title: "Contenu éducatif" },
    { icon: "time-outline", title: "14 jours d'essai" },
    { icon: "shield-outline", title: "Annulation simple" },
  ],
}) => {
  const router = useRouter(); // Use router instead of navigation

  const handleComparePlans = () => {
    // Navigate using router.push instead of navigation.navigate
    router.push("/plansComparison");
  };

  return (
    <MotiView
      style={[
        styles.container,
        {
          backgroundColor: COLOORS.surface.light,
        },
      ]}
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 600, delay: 300 }}
    >
      <Text style={[styles.title, { color: COLOORS.black }]}>
        Tous les plans incluent
      </Text>

      <View style={styles.benefitsGrid}>
        {benefits.map((benefit, index) => (
          <MotiView
            key={index}
            style={styles.benefitItem}
            from={{ opacity: 0, translateX: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{
              delay: 300 + index * 100,
              type: "timing",
              duration: 400,
            }}
          >
            <View style={styles.benefitIconContainer}>
              <Ionicons
                name={benefit.icon as any}
                size={20}
                color={COLOORS.primary.main}
              />
            </View>
            <Text style={[styles.benefitText, { color: "#444" }]}>
              {benefit.title}
            </Text>
          </MotiView>
        ))}
      </View>

      <TouchableOpacity
        style={styles.comparePlansBadge}
        activeOpacity={0.7}
        onPress={handleComparePlans}
      >
        <Ionicons
          name="information-circle-outline"
          size={16}
          color={COLOORS.accent.blue.main}
          style={styles.infoIcon}
        />
        <Text style={styles.comparePlansText}>
          Comparez tous les plans en détail
        </Text>
        <Ionicons
          name="chevron-forward"
          size={14}
          color={COLOORS.accent.blue.main}
        />
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  title: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
  benefitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  benefitItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  benefitIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${COLOORS.primary.main}10`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  benefitText: {
    ...TYPOGRAPHY.body2,
    flex: 1,
  },
  comparePlansBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: `${COLOORS.accent.blue.main}15`,
    borderRadius: RADIUS.xxl,
    alignSelf: "center",
  },
  infoIcon: {
    marginRight: 6,
  },
  comparePlansText: {
    ...TYPOGRAPHY.caption,
    color: COLOORS.accent.blue.main,
    marginRight: 6,
  },
});

export default BenefitsSection;
