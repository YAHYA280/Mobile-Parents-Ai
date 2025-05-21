// Videodetails components/TagsCard.tsx
import React from "react";
import { View, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { COLORS } from "../../../../constants/theme";

interface TagsCardProps {
  tags: string[];
}

const TagsCard: React.FC<TagsCardProps> = ({ tags }) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <FontAwesomeIcon
          icon={"tags" as IconProp}
          size={18}
          color={COLORS.primary}
          style={{ marginRight: 10 }}
        />
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: COLORS.black,
          }}
        >
          Mots-clés
        </Text>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {tags.map((tag, index) => (
          <View
            key={index}
            style={{
              backgroundColor: "rgba(0,0,0,0.05)",
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              margin: 4,
            }}
          >
            <Text
              style={{
                color: COLORS.gray3,
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              {tag}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default TagsCard;
