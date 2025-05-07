import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/theme/ThemeProvider";

// Import Custom Components
import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";
import CatalogueList from "@/components/catalogue/CatalogueList";
import BenefitsSection from "@/components/catalogue/BenefitsSection";
import TestimonialCard from "@/components/catalogue/TestimonialCard";

// Import Types and Utilities
import { COLOORS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { getCatalogues } from "./services/mocksApi/abonnementApiMock";
import type { CataloguePlan } from "./services/mocksApi/abonnementApiMock";
import { Ionicons } from "@expo/vector-icons";

const AbonnementCatalogue: React.FC = () => {
  const navigation = useNavigation();
  const { colors, dark } = useTheme();

  // State
  const [catalogues, setCatalogues] = useState<CataloguePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(30)).current;

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

  useEffect(() => {
    if (!loading && !error) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading, error, fadeAnim, translateAnim]);

  // Render Loading State
  const renderLoading = () => (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <Header
        title="Plans d'abonnement"
        onBackPress={() => navigation.goBack()}
        rightIcon="help-circle-outline"
        onRightIconPress={() => {}}
      />
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={COLOORS.primary.main} />
      </View>
    </SafeAreaView>
  );

  // Render Error State
  const renderError = () => (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <Header
        title="Plans d'abonnement"
        onBackPress={() => navigation.goBack()}
        rightIcon="help-circle-outline"
        onRightIconPress={() => {}}
      />
      <View
        style={[styles.errorContainer, { backgroundColor: colors.background }]}
      >
        <View style={styles.errorContent}>
          <Button
            label="Réessayer"
            leftIcon="refresh"
            onPress={fetchCatalogues}
            variant="primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );

  if (loading) {
    return renderLoading();
  }

  if (error) {
    return renderError();
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <Header
        title="Plans d'abonnement"
        onBackPress={() => navigation.goBack()}
        rightIcon="help-circle-outline"
        onRightIconPress={() => {}}
      />

      <View style={styles.plansHeadingContainer}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="rocket-outline"
            size={26}
            color={COLOORS.primary.main}
          />
        </View>
        <Text
          style={[
            styles.plansHeadingTitle,
            { color: dark ? COLOORS.white : COLOORS.black },
          ]}
        >
          Choisissez votre plan
        </Text>
        <Text
          style={[
            styles.plansHeadingSubtitle,
            {
              color: dark
                ? COLOORS.text.dark.secondary
                : COLOORS.text.light.secondary,
            },
          ]}
        >
          Sélectionnez le meilleur plan d'assistance aux devoirs pour votre
          enfant
        </Text>
      </View>

      <CatalogueList data={catalogues} />

      <BenefitsSection />

      <TestimonialCard
        quote="Mon fils a amélioré ses notes en mathématiques de manière significative. Le suivi détaillé et les exercices personnalisés ont fait toute la différence."
        author="Catherine Martin"
        rating={5}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    padding: SPACING.md,
  },
  errorContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  plansHeadingContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${COLOORS.primary.main}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  plansHeadingTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  plansHeadingSubtitle: {
    ...TYPOGRAPHY.body1,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: SPACING.lg,
  },
});

export default AbonnementCatalogue;
