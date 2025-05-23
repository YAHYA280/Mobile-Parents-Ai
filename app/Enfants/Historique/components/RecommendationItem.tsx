// RecommendationItem.tsx
import React from "react";
import { View, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { COLORS } from "../../../../constants/theme";

interface RecommendationItemProps {
  recommendation: string;
  isLast: boolean;
}

const RecommendationItem: React.FC<RecommendationItemProps> = ({
  recommendation,
  isLast,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: isLast ? 0 : 12,
      }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: "#24D26D",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
          marginTop: 2,
        }}
      >
        <FontAwesomeIcon icon="check" size={12} color="#FFFFFF" />
      </View>
      <Text
        style={{ color: COLORS.gray3, lineHeight: 22, flex: 1, fontSize: 15 }}
      >
        {recommendation}
      </Text>
    </View>
  );
};

export default RecommendationItem;
