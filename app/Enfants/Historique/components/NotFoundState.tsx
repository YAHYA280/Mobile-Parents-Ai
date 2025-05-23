// NotFoundState.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";

import { COLORS } from "../../../../constants/theme";
import Header from "../../../../components/ui/Header";

interface NotFoundStateProps {
  handleBack: () => void;
}

const NotFoundState: React.FC<NotFoundStateProps> = ({ handleBack }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <Header
        title="Détails de l'activité"
        onBackPress={handleBack}
        showBackButton
      />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <FontAwesomeIcon
          icon="exclamation-circle"
          size={64}
          color={COLORS.black}
        />
        <Text
          style={{
            marginTop: 20,
            color: COLORS.black,
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Données introuvables
        </Text>
        <Text
          style={{
            marginTop: 10,
            color: COLORS.gray3,
            textAlign: "center",
            marginBottom: 30,
          }}
        >
          Les données que vous recherchez ne sont pas disponibles.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            paddingVertical: 14,
            paddingHorizontal: 30,
            borderRadius: 25,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 5,
            elevation: 4,
          }}
          onPress={handleBack}
        >
          <Text
            style={{ color: COLORS.white, fontWeight: "600", fontSize: 16 }}
          >
            Retour
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NotFoundState;
