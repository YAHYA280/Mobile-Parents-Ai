import type { IconProp } from "@fortawesome/fontawesome-svg-core";

// Chat components/ActivityTitleBar.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import type { Activity } from "../../../../data/Enfants/CHILDREN_DATA";

import { COLORS } from "../../../../constants/theme";

interface ActivityTitleBarProps {
  activity: Activity;
  showStatement: boolean;
  toggleStatement: () => void;
}

const ActivityTitleBar: React.FC<ActivityTitleBarProps> = ({
  activity,
  showStatement,
  toggleStatement,
}) => {
  return (
    <View
      style={{
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: "rgba(0,0,0,0.02)",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.05)",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            color: COLORS.gray3,
            flex: 1,
          }}
        >
          {activity.activite}
        </Text>
        <TouchableOpacity
          onPress={toggleStatement}
          style={{
            padding: 8,
            backgroundColor: "rgba(0,0,0,0.05)",
            borderRadius: 20,
            width: 36,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesomeIcon
            icon={(showStatement ? "chevron-up" : "chevron-down") as IconProp}
            size={16}
            color={COLORS.gray3}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ActivityTitleBar;
