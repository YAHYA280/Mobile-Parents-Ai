import type { IconProp } from "@fortawesome/fontawesome-svg-core";

// Historique home component/PaginationControls.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { COLORS } from "../../../../constants/theme";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        backgroundColor: "transparent",
      }}
    >
      {/* Previous Page Button */}
      <TouchableOpacity
        style={{
          width: 44,
          height: 44,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 22,
          backgroundColor:
            currentPage === 1
              ? "rgba(0, 0, 0, 0.05)"
              : "rgba(255, 142, 105, 0.1)",
          opacity: currentPage === 1 ? 0.5 : 1,
        }}
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <FontAwesomeIcon
          icon={"chevron-left" as IconProp}
          color={currentPage === 1 ? "#999999" : COLORS.primary}
          size={18}
        />
      </TouchableOpacity>

      {/* Page Number Indicator */}
      <View
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.05)",
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 25,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: COLORS.black,
          }}
        >
          {`${currentPage} / ${totalPages}`}
        </Text>
      </View>

      {/* Next Page Button */}
      <TouchableOpacity
        style={{
          width: 44,
          height: 44,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 22,
          backgroundColor:
            currentPage === totalPages
              ? "rgba(0, 0, 0, 0.05)"
              : "rgba(255, 142, 105, 0.1)",
          opacity: currentPage === totalPages ? 0.5 : 1,
        }}
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <FontAwesomeIcon
          icon={"chevron-right" as IconProp}
          color={currentPage === totalPages ? "#999999" : COLORS.primary}
          size={18}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PaginationControls;
