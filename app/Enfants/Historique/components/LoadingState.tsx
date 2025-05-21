// LoadingState.tsx
import React from "react";
import { View, Text, ActivityIndicator, SafeAreaView } from "react-native";
import { COLORS } from "../../../../constants/theme";
import Header from "../../../../components/ui/Header";

interface LoadingStateProps {
  handleBack: () => void;
}

const LoadingState: React.FC<LoadingStateProps> = ({ handleBack }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <Header
        title="Détails de l'activité"
        onBackPress={handleBack}
        showBackButton={true}
      />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 20, color: COLORS.black, fontSize: 16 }}>
          Chargement des détails...
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LoadingState;
