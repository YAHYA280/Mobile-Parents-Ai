// ResourcesSection.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { COLORS } from "../../../../constants/theme";

interface ResourcesSectionProps {
  matiere: string | undefined;
  navigateToVideoDetails: () => void;
  navigateToFicheDetails: () => void;
}

const ResourcesSection: React.FC<ResourcesSectionProps> = ({
  matiere,
  navigateToVideoDetails,
  navigateToFicheDetails,
}) => {
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
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
      >
        <FontAwesomeIcon
          icon="graduation-cap"
          size={16}
          color={COLORS.primary}
          style={{ marginRight: 8 }}
        />
        <Text style={{ fontSize: 16, fontWeight: "600", color: COLORS.black }}>
          Ressources pédagogiques
        </Text>
      </View>

      <TouchableOpacity
        onPress={navigateToFicheDetails}
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.03)",
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
        }}
      >
        <LinearGradient
          colors={["#FF8E69", "#FF7862"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 16,
          }}
        >
          <FontAwesomeIcon icon="file-pdf" size={22} color="#FFFFFF" />
        </LinearGradient>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: COLORS.black,
              marginBottom: 4,
            }}
          >
            Fiche pédagogique - {matiere || "Mathématiques"}
          </Text>
          <Text style={{ color: COLORS.gray3, fontSize: 14 }}>
            Ressource complémentaire pour approfondir
          </Text>
        </View>

        <FontAwesomeIcon icon="chevron-right" size={16} color={COLORS.gray3} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={navigateToVideoDetails}
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.03)",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <LinearGradient
          colors={["#2196F3", "#1565C0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 16,
          }}
        >
          <FontAwesomeIcon icon="play-circle" size={22} color="#FFFFFF" />
        </LinearGradient>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: COLORS.black,
              marginBottom: 4,
            }}
          >
            Vidéo explicative - {matiere || "Mathématiques"}
          </Text>
          <Text style={{ color: COLORS.gray3, fontSize: 14 }}>
            10:24 minutes
          </Text>
        </View>

        <FontAwesomeIcon icon="chevron-right" size={16} color={COLORS.gray3} />
      </TouchableOpacity>
    </View>
  );
};

export default ResourcesSection;
