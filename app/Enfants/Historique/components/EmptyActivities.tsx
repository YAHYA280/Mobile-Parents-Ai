// Historique home component/EmptyActivities.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { COLORS } from "../../../../constants/theme";

interface EmptyActivitiesProps {
  hasActiveFilters: boolean;
  resetFilters: () => void;
  onShowTips: () => void;
}

const EmptyActivities: React.FC<EmptyActivitiesProps> = ({
  hasActiveFilters,
  resetFilters,
  onShowTips,
}) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
        backgroundColor: "rgba(0,0,0,0.02)",
        borderRadius: 16,
        marginBottom: 20,
      }}
    >
      <Text
        style={{
          color: COLORS.black,
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        Aucune activité trouvée
      </Text>
      <Text
        style={{
          color: COLORS.gray3,
          fontSize: 15,
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        {hasActiveFilters
          ? "Essayez de modifier vos filtres pour voir plus d'activités."
          : "Il n'y a pas encore d'activités à afficher pour cet enfant."}
      </Text>

      {hasActiveFilters && (
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 25,
            elevation: 2,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}
          onPress={resetFilters}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
            Réinitialiser les filtres
          </Text>
        </TouchableOpacity>
      )}

      {!hasActiveFilters && (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 5,
          }}
          onPress={onShowTips}
        >
          <FontAwesomeIcon
            icon={"lightbulb" as IconProp}
            size={16}
            color={COLORS.primary}
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: COLORS.primary, fontWeight: "500" }}>
            Conseils pour démarrer
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyActivities;
