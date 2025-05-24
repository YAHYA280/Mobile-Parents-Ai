import type { ImageSourcePropType } from "react-native";

import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import { translateTransactionStatus } from "@/utils/translation";

import { SIZES, COLORS } from "../constants";

// Define the prop types for the component
interface TransactionCardProps {
  name: string;
  image: ImageSourcePropType;
  status: string;
  selected?: boolean;
  isSelectionMode?: boolean;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  name,
  image,
  status,
  selected = false,
  isSelectionMode = false,
}) => {
  const navigation = useNavigation();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: COLORS.white },
        // Adjust the width when in selection mode to prevent content from being cut off
        isSelectionMode && styles.containerWithSelection,
        // Optionally add a visual indication for selected items
        selected && styles.selectedContainer,
      ]}
    >
      <View style={styles.viewLeft}>
        <Image source={image} resizeMode="cover" style={styles.image} />
        <View
          style={[
            styles.infoContainer,
            // Adjust the width when in selection mode to prevent content from being cut off
            isSelectionMode && styles.infoContainerSelected,
          ]}
        >
          <Text
            style={[styles.name, { color: COLORS.greyscale900 }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {name}
          </Text>
          <TouchableOpacity
            style={[
              styles.statusBtn,
              // Adjust the width when in selection mode to prevent content from being cut off
              isSelectionMode && styles.statusBtnSelected,
            ]}
          >
            <Text style={styles.status}>
              {translateTransactionStatus(status)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("ereceipt" as never)}
        style={styles.btn}
      >
        <Text style={styles.btnText}>E-Reçu</Text>
      </TouchableOpacity>
    </View>
  );
};

// Define styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
    width: SIZES.width - 32,
    height: 112,
    marginVertical: 6,
    borderRadius: 12,
    paddingHorizontal: 12,
    elevation: 1,
    shadowColor: "#FAFAFA",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  containerWithSelection: {
    width: SIZES.width - 60,
  },

  selectedContainer: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  viewLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  image: {
    height: 84,
    width: 84,
    borderRadius: 12,
  },
  infoContainer: {
    marginLeft: 16,
    flex: 1,
    marginRight: 22,
  },
  infoContainerSelected: {
    marginLeft: 13,
    flex: 1,
    marginRight: 13,
  },
  name: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginBottom: 12,
  },
  statusBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.tansparentPrimary,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 64,
  },
  statusBtnSelected: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.tansparentPrimary,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 64,
  },
  status: {
    fontSize: 12,
    fontFamily: "medium",
    color: COLORS.primary,
  },
  btn: {
    width: 88,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: COLORS.primary,
  },
  btnText: {
    fontSize: 12,
    fontFamily: "semiBold",
    color: COLORS.white,
  },
});

export default TransactionCard;
