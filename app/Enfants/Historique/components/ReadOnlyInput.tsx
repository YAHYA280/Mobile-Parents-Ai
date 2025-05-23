// Chat components/ReadOnlyInput.tsx
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, TextInput } from "react-native";

import { COLORS } from "../../../../constants/theme";

const ReadOnlyInput: React.FC = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 12,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: "rgba(0,0,0,0.05)",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.03)",
          borderRadius: 25,
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TextInput
          placeholder="Ce chat est en lecture seule..."
          placeholderTextColor={COLORS.gray3}
          style={{
            flex: 1,
            color: COLORS.black,
            fontSize: 15,
          }}
          editable={false}
        />
        <Ionicons name="lock-closed" size={18} color={COLORS.gray3} />
      </View>
    </View>
  );
};

export default ReadOnlyInput;
