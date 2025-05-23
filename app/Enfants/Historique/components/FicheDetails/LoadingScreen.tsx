// components/enfants/historique/LoadingScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";

import { COLORS } from "@/constants/theme";

import FicheHeader from "./FicheHeader";

interface LoadingScreenProps {
  onBack: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onBack }) => {
  return (
    <SafeAreaView style={styles.container}>
      <FicheHeader
        title="Fiche Pédagogique"
        subject=""
        onBack={onBack}
        onShare={() => {}}
      />
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Chargement de la fiche...</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.black,
  },
});

export default LoadingScreen;
