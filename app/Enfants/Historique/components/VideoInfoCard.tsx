import type { IconProp } from "@fortawesome/fontawesome-svg-core";

// Videodetails components/VideoInfoCard.tsx
import React from "react";
import { View, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import type { VideoResource } from "@/types/video";

import { COLORS } from "../../../../constants/theme";

interface VideoInfoCardProps {
  resource: VideoResource;
}

const VideoInfoCard: React.FC<VideoInfoCardProps> = ({ resource }) => {
  // Helper function to get color based on difficulty level
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Facile":
        return "#24D26D";
      case "Moyen":
        return "#F3BB00";
      case "Difficile":
        return "#FC4E00";
      default:
        return "#24D26D";
    }
  };

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
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: COLORS.black,
          marginBottom: 16,
        }}
      >
        {resource.title}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.05)",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            marginRight: 12,
            marginBottom: 8,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon
            icon={"book" as IconProp}
            size={14}
            color={COLORS.gray3}
            style={{ marginRight: 6 }}
          />
          <Text
            style={{
              color: COLORS.gray3,
              fontWeight: "500",
              fontSize: 14,
            }}
          >
            {resource.subject}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: `${getDifficultyColor(resource.difficulty)}20`,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            marginRight: 12,
            marginBottom: 8,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: getDifficultyColor(resource.difficulty),
              marginRight: 6,
            }}
          />
          <Text
            style={{
              color: getDifficultyColor(resource.difficulty),
              fontWeight: "600",
              fontSize: 14,
            }}
          >
            {resource.difficulty}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.05)",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            marginBottom: 8,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon
            icon={"clock" as IconProp}
            size={14}
            color={COLORS.gray3}
            style={{ marginRight: 6 }}
          />
          <Text
            style={{
              color: COLORS.gray3,
              fontWeight: "500",
              fontSize: 14,
            }}
          >
            {resource.duration}
          </Text>
        </View>
      </View>

      <Text
        style={{
          fontSize: 15,
          lineHeight: 22,
          color: COLORS.gray3,
        }}
      >
        {resource.description}
      </Text>
    </View>
  );
};

export default VideoInfoCard;
