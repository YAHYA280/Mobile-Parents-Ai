import { COLORS } from "@/constants";
import { useNavigation } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";
import styles from "@/styles/AbonnementCatalogueStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useCallback } from "react";
import AbonnementCatalogueList from "@/components/AbonnementCatalogueList";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import type { CataloguePlan } from "./services/mocksApi/abonnementApiMock";

import { getCatalogues } from "./services/mocksApi/abonnementApiMock";

const LOGO_COLORS = {
  lighter: "#f9a99a",
  light: "#f28374",
  main: "#fe7862",
  dark: "#d75f4d",
  darker: "#b34e3a",
  contrastText: "#FFFFFF",
};

const AbonnementCatalogue: React.FC = () => {
  const navigationBack = useNavigation();
  const { colors, dark } = useTheme();
  const [catalogues, setCatalogues] = useState<CataloguePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.headerContainer}>
        <View style={headerStyles.headerLeft}>
          <TouchableOpacity
            style={headerStyles.backButton}
            onPress={() => navigationBack.goBack()}
          >
            <Feather
              name="arrow-left"
              size={24}
              color={dark ? COLORS.white : COLORS.black}
            />
          </TouchableOpacity>
          <Text
            style={[
              headerStyles.headerTitle,
              { color: dark ? COLORS.white : COLORS.greyscale900 },
            ]}
          >
            Plans
          </Text>
        </View>
      </View>
    );
  }, [dark, navigationBack]);

  const renderPlansHeading = useCallback(
    () => (
      <View style={styles.plansHeadingContainer}>
        <Text style={styles.plansHeadingSubtitle}>
          Sélectionnez le meilleur plan d&apos;assistance aux devoirs pour votre
          enfant
        </Text>
      </View>
    ),
    []
  );

  const renderLoading = () => (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color={LOGO_COLORS.main} />
        <Text style={styles.loadingText}>Chargement des plans...</Text>
      </View>
    </SafeAreaView>
  );

  const renderError = () => (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: LOGO_COLORS.main }]}
          onPress={fetchCatalogues}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        {renderPlansHeading()}
        <AbonnementCatalogueList data={catalogues} />
      </View>
    </SafeAreaView>
  );
};

// Additional styles for the header
const headerStyles = StyleSheet.create({
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.black,
  },
});

export default AbonnementCatalogue;
