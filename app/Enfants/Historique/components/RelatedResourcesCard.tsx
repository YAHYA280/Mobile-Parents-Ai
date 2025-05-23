import type { IconProp } from "@fortawesome/fontawesome-svg-core";

// Videodetails components/RelatedResourcesCard.tsx
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import type { RelatedResource } from "@/types/video";

import { COLORS } from "../../../../constants/theme";

interface RelatedResourcesCardProps {
  resources: RelatedResource[];
  onResourcePress: (resource: RelatedResource) => void;
}

const RelatedResourcesCard: React.FC<RelatedResourcesCardProps> = ({
  resources,
  onResourcePress,
}) => {
  // Get icon for resource type
  const getResourceTypeIcon = (type: string): IconProp => {
    switch (type) {
      case "pdf":
        return "file-pdf" as IconProp;
      case "video":
        return "play-circle" as IconProp;
      case "exercise":
        return "book" as IconProp;
      default:
        return "file" as IconProp;
    }
  };

  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
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
          icon={"link" as IconProp}
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
          Ressources associées
        </Text>
      </View>

      {resources.map((relatedResource, index) => (
        <TouchableOpacity
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.02)",
            borderRadius: 12,
            padding: 14,
            marginBottom: index < resources.length - 1 ? 12 : 0,
          }}
          onPress={() => onResourcePress(relatedResource)}
        >
          <LinearGradient
            colors={["#FF8E69", "#FF7862"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 14,
            }}
          >
            <FontAwesomeIcon
              icon={getResourceTypeIcon(relatedResource.type)}
              size={18}
              color="#FFFFFF"
            />
          </LinearGradient>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontWeight: "500",
                fontSize: 15,
                color: COLORS.black,
                marginBottom: 3,
              }}
            >
              {relatedResource.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.gray3,
                  textTransform: "capitalize",
                }}
              >
                {relatedResource.type}
              </Text>
              {relatedResource.duration && (
                <>
                  <View
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: 1.5,
                      backgroundColor: COLORS.gray3,
                      marginHorizontal: 6,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      color: COLORS.gray3,
                    }}
                  >
                    {relatedResource.duration}
                  </Text>
                </>
              )}
            </View>
          </View>

          <FontAwesomeIcon
            icon={"chevron-right" as IconProp}
            size={16}
            color={COLORS.gray3}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RelatedResourcesCard;
