import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";

// Import Custom Components
import Header from "@/components/ui/Header";
import Card from "@/components/ui/Card";

// Import Types and Utilities
import {
  COLOORS,
  SPACING,
  TYPOGRAPHY,
  RADIUS,
  SHADOWS,
} from "@/constants/theme";
import { getCatalogues } from "./services/mocksApi/abonnementApiMock";
import type { CataloguePlan } from "./services/mocksApi/abonnementApiMock";

const { width } = Dimensions.get("window");

const PlansComparison: React.FC = () => {
  const router = useRouter();
  const { colors, dark } = useTheme();

  // State
  const [catalogues, setCatalogues] = useState<CataloguePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Data
  const fetchCatalogues = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCatalogues();
      setCatalogues(data);
      setError(null);
    } catch (err) {
      setError("Échec du chargement des plans. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalogues();
  }, [fetchCatalogues]);

  // Create a list of all unique features across all plans
  const allFeatures = catalogues.reduce((features: string[], plan) => {
    plan.features.forEach((feature) => {
      if (!features.includes(feature)) {
        features.push(feature);
      }
    });
    return features;
  }, []);

  // Helper function to check if a plan includes a feature
  const planHasFeature = (plan: CataloguePlan, feature: string) => {
    return plan.features.includes(feature);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Comparaison des plans"
          onBackPress={() => router.back()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLOORS.primary.main} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Comparaison des plans"
          onBackPress={() => router.back()}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["right", "bottom", "left"]}>
      <Header title="Comparaison des plans" onBackPress={() => router.back()} />

      <View style={styles.headerContainer}>
        <Ionicons
          name="analytics-outline"
          size={24}
          color={COLOORS.primary.main}
        />
        <Text style={styles.headerTitle}>
          Trouvez le plan parfait pour vous
        </Text>
        <Text style={styles.headerSubtitle}>
          Comparez les caractéristiques et les prix de tous nos plans pour faire
          le meilleur choix
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.plansContainer}
      >
        {/* First column - feature names */}
        <View style={styles.featuresColumn}>
          <View style={styles.planHeaderCell}>
            <Text style={styles.featuresCellTitle}>Caractéristiques</Text>
          </View>

          {/* Price Row */}
          <View style={styles.featureCell}>
            <Text style={styles.featureName}>Prix mensuel</Text>
          </View>

          {/* Features Rows */}
          {allFeatures.map((feature, index) => (
            <View
              key={index}
              style={[
                styles.featureCell,
                index % 2 === 0 ? styles.evenRow : {},
              ]}
            >
              <Text style={styles.featureName}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Plan columns */}
        {catalogues.map((plan, planIndex) => {
          const planColor = getPlanColor(plan.id);

          return (
            <View key={planIndex} style={styles.planColumn}>
              {/* Plan Header */}
              <View
                style={[styles.planHeaderCell, { backgroundColor: planColor }]}
              >
                <Text style={styles.planName}>{plan.planName}</Text>
                {plan.recommended && (
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedText}>Recommandé</Text>
                  </View>
                )}
              </View>

              {/* Price Row */}
              <View style={styles.featureCell}>
                <Text style={styles.priceText}>${plan.monthlyPrice}</Text>
                <Text style={styles.monthText}>/mois</Text>
              </View>

              {/* Features Rows */}
              {allFeatures.map((feature, featureIndex) => (
                <View
                  key={featureIndex}
                  style={[
                    styles.featureCell,
                    featureIndex % 2 === 0 ? styles.evenRow : {},
                  ]}
                >
                  {planHasFeature(plan, feature) ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={COLOORS.primary.main}
                    />
                  ) : (
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={COLOORS.gray3}
                    />
                  )}
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper function to get plan color based on id
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  errorText: {
    ...TYPOGRAPHY.body1,
    color: COLOORS.status.expired.main,
    textAlign: "center",
  },
  headerContainer: {
    alignItems: "center",
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLOORS.black,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
    textAlign: "center",
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body2,
    color: COLOORS.gray3,
    textAlign: "center",
    paddingHorizontal: SPACING.xl,
  },
  plansContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  featuresColumn: {
    width: 150,
    marginRight: 2,
  },
  planColumn: {
    width: 120,
    marginRight: 2,
  },
  planHeaderCell: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.sm,
    borderTopLeftRadius: RADIUS.md,
    borderTopRightRadius: RADIUS.md,
  },
  featuresCellTitle: {
    ...TYPOGRAPHY.subtitle1,
    color: COLOORS.black,
  },
  planName: {
    ...TYPOGRAPHY.subtitle1,
    color: "#FFFFFF",
    textAlign: "center",
  },
  recommendedBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.xxl,
    marginTop: SPACING.xs,
  },
  recommendedText: {
    ...TYPOGRAPHY.caption,
    color: "#FFFFFF",
  },
  featureCell: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.sm,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    flexDirection: "row",
  },
  evenRow: {
    backgroundColor: "#FAFAFA",
  },
  featureName: {
    ...TYPOGRAPHY.body2,
    color: COLOORS.black,
  },
  priceText: {
    ...TYPOGRAPHY.h3,
    color: COLOORS.primary.main,
  },
  monthText: {
    ...TYPOGRAPHY.caption,
    color: COLOORS.gray3,
    marginLeft: 2,
  },
});

export default PlansComparison;
