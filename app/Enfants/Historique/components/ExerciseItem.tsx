import React from "react";
import { View, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { COLORS } from "../../../../constants/theme";

// Updated interface to match the actual exercise data structure
interface ExerciseItemProps {
  exercise: {
    reussite: boolean | undefined;
    commentaire?: string;
  };
  index: number;
  isLast: boolean;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({
  exercise,
  index,
  isLast,
}) => {
  // Use a default value with the nullish coalescing operator
  const isSuccess = exercise.reussite ?? false;

  return (
    <View style={{ marginBottom: isLast ? 0 : 16 }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}
      >
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: isSuccess ? "#24D26D" : "#FF3B30",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
          }}
        >
          <FontAwesomeIcon
            icon={isSuccess ? "check" : "times"}
            size={12}
            color="#FFFFFF"
          />
        </View>
        <Text style={{ fontSize: 15, fontWeight: "500", color: COLORS.black }}>
          Exercice {index + 1}
        </Text>
        <View
          style={{
            marginLeft: "auto",
            backgroundColor: isSuccess
              ? "rgba(36, 210, 109, 0.1)"
              : "rgba(255, 59, 48, 0.1)",
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              color: isSuccess ? "#24D26D" : "#FF3B30",
              fontSize: 13,
              fontWeight: "500",
            }}
          >
            {isSuccess ? "Réussi" : "Échoué"}
          </Text>
        </View>
      </View>
      {exercise.commentaire && (
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.05)",
            borderRadius: 8,
            padding: 12,
            marginLeft: 36,
          }}
        >
          <Text
            style={{
              color: COLORS.gray3,
              fontSize: 14,
              lineHeight: 20,
            }}
          >
            {exercise.commentaire}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ExerciseItem;
