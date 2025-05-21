// Historique home component/LoadingIndicator.tsx
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { COLORS } from "../../../../constants/theme";

const LoadingIndicator: React.FC = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.02)",
        borderRadius: 16,
        padding: 30,
        marginBottom: 20,
      }}
    >
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text
        style={{
          marginTop: 16,
          color: COLORS.black,
          fontSize: 16,
        }}
      >
        Chargement des activités...
      </Text>
    </View>
  );
};

export default LoadingIndicator;
