// Chat components/InfoBanner.tsx
import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../../../constants/theme";

const InfoBanner: React.FC = () => {
  return (
    <View
      style={{
        backgroundColor: "rgba(0, 149, 255, 0.05)",
        padding: 14,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <Ionicons
        name="information-circle"
        size={18}
        color={COLORS.primary}
        style={{ marginRight: 8 }}
      />
      <Text
        style={{
          color: COLORS.primary,
          fontSize: 14,
          fontWeight: "500",
        }}
      >
        Ceci est un historique de conversation en lecture seule
      </Text>
    </View>
  );
};

export default InfoBanner;
