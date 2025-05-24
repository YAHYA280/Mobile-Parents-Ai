import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

// Import Custom Components
import Header from "@/components/ui/Header";
import { useTheme } from "@/theme/ThemeProvider";
// Import Types and Utilities
import { RADIUS, COLOORS, SPACING, TYPOGRAPHY } from "@/constants/theme";

import type { CataloguePlan } from "./services/mocksApi/abonnementApiMock";

import { getCatalogues } from "./services/mocksApi/abonnementApiMock";

const { width, height } = Dimensions.get("window");

const PlansComparison: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme();

  // State
  const [catalogues, setCatalogues] = useState<CataloguePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Data
  const fetchCatalogues = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching catalogues..."); // Debug log
      const data = await getCatalogues();
      console.log("Catalogues fetched:", data); // Debug log
      setCatalogues(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching catalogues:", err); // Debug log
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
    if (plan && plan.features && Array.isArray(plan.features)) {
      plan.features.forEach((feature) => {
        if (!features.includes(feature)) {
          features.push(feature);
        }
      });
    }
    return features;
  }, []);

  // Helper function to check if a plan includes a feature
  const planHasFeature = (plan: CataloguePlan, feature: string) => {
    return plan && plan.features && plan.features.includes(feature);
  };

  // Debug: Log current state
  console.log("Current state:", {
    loading,
    error,
    catalogues: catalogues.length,
  });

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          { backgroundColor: colors?.background || "#FFFFFF" },
        ]}
      >
        <Header
          title="Comparaison des plans"
          onBackPress={() => router.back()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLOORS.primary.main} />
          <Text style={styles.loadingText}>Chargement des plans...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          { backgroundColor: colors?.background || "#FFFFFF" },
        ]}
      >
        <Header
          title="Comparaison des plans"
          onBackPress={() => router.back()}
        />
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={COLOORS.status.expired.main}
          />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchCatalogues}
          >
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // If no catalogues are available
  if (!catalogues || catalogues.length === 0) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          { backgroundColor: colors?.background || "#FFFFFF" },
        ]}
      >
        <Header
          title="Comparaison des plans"
          onBackPress={() => router.back()}
        />
        <View style={styles.errorContainer}>
          <Ionicons name="folder-outline" size={48} color={COLOORS.gray3} />
          <Text style={styles.errorText}>
            Aucun plan disponible pour le moment.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchCatalogues}
          >
            <Text style={styles.retryButtonText}>Actualiser</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: colors?.background || "#FFFFFF" },
      ]}
      edges={["right", "bottom", "left"]}
    >
      <Header title="Comparaison des plans" onBackPress={() => router.back()} />

      {/* Main content wrapped in vertical ScrollView */}
      <ScrollView
        style={styles.mainScrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.headerContainer}>
          <Ionicons
            name="analytics-outline"
            size={24}
            color={COLOORS.primary.main}
          />
          <Text
            style={[
              styles.headerTitle,
              { color: colors?.text || COLOORS.black },
            ]}
          >
            Trouvez le plan parfait pour vous
          </Text>
          <Text style={styles.headerSubtitle}>
            Comparez les caractéristiques et les prix de tous nos plans pour
            faire le meilleur choix
          </Text>
        </View>

        {/* Horizontal ScrollView for the comparison table */}
        <View style={styles.tableContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.plansContainer}
            bounces={false}
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
                  key={`feature-${index}`}
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
              if (!plan) return null; // Safety check

              const planColor = getPlanColor(plan.id);

              return (
                <View
                  key={`plan-${planIndex}-${plan.id}`}
                  style={styles.planColumn}
                >
                  {/* Plan Header */}
                  <View
                    style={[
                      styles.planHeaderCell,
                      { backgroundColor: planColor },
                    ]}
                  >
                    <Text style={styles.planName}>
                      {plan.planName || "Plan"}
                    </Text>
                    {plan.recommended && (
                      <View style={styles.recommendedBadge}>
                        <Text style={styles.recommendedText}>Recommandé</Text>
                      </View>
                    )}
                  </View>

                  {/* Price Row */}
                  <View style={styles.featureCell}>
                    <Text style={styles.priceText}>
                      ${plan.monthlyPrice || "0"}
                    </Text>
                    <Text style={styles.monthText}>/mois</Text>
                  </View>

                  {/* Features Rows */}
                  {allFeatures.map((feature, featureIndex) => (
                    <View
                      key={`feature-${featureIndex}-plan-${planIndex}`}
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
        </View>

        {/* Additional bottom space for better scrolling */}
        <View style={styles.bottomSpacing} />
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
  },
  mainScrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...TYPOGRAPHY.body2,
    color: COLOORS.gray3,
    marginTop: SPACING.md,
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
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  retryButton: {
    backgroundColor: COLOORS.primary.main,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  retryButtonText: {
    ...TYPOGRAPHY.button,
    color: "#FFFFFF",
  },
  headerContainer: {
    alignItems: "center",
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    paddingTop: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
    textAlign: "center",
    paddingHorizontal: SPACING.md,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body2,
    color: COLOORS.gray3,
    textAlign: "center",
    paddingHorizontal: SPACING.lg,
    lineHeight: 20,
  },
  tableContainer: {
    flex: 1,
    minHeight: height * 0.4,
  },
  plansContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    minWidth: width,
  },
  featuresColumn: {
    width: Math.max(150, width * 0.35),
    marginRight: 2,
  },
  planColumn: {
    width: Math.max(120, width * 0.28),
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
    textAlign: "center",
  },
  planName: {
    ...TYPOGRAPHY.subtitle1,
    color: "#FFFFFF",
    textAlign: "center",
    paddingHorizontal: SPACING.xs,
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
    fontSize: 10,
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
    textAlign: "center",
    fontSize: 12,
    paddingHorizontal: SPACING.xs,
  },
  priceText: {
    ...TYPOGRAPHY.h3,
    color: COLOORS.primary.main,
    fontSize: 16,
  },
  monthText: {
    ...TYPOGRAPHY.caption,
    color: COLOORS.gray3,
    marginLeft: 2,
    fontSize: 10,
  },
  bottomSpacing: {
    height: SPACING.xl,
  },
});

export default PlansComparison;
