// Historique home component/HistoriqueHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { COLORS } from "../../../../constants/theme";
import type { Child } from "../../../../data/Enfants/CHILDREN_DATA";

interface HistoriqueHeaderProps {
  onBackPress: () => void;
  childData: Child;
}

const HistoriqueHeader: React.FC<HistoriqueHeaderProps> = ({
  onBackPress,
  childData,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.05)",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      }}
    >
      <TouchableOpacity
        onPress={onBackPress}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "rgba(0,0,0,0.05)",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 16,
        }}
      >
        <FontAwesomeIcon
          icon={"arrow-left" as IconProp}
          size={18}
          color={COLORS.black}
        />
      </TouchableOpacity>

      <View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: COLORS.black,
          }}
        >
          Historique d'activités
        </Text>
        {childData && (
          <Text
            style={{
              fontSize: 14,
              color: "#666666",
            }}
          >
            {childData.name} • {childData.classe}
          </Text>
        )}
      </View>
    </View>
  );
};

export default HistoriqueHeader;
