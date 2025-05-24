import type { GestureResponderEvent } from "react-native";

import React from "react";
import {
  View,
  Text,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { COLORS } from "../constants";

interface PaymentMethodItemConnectedProps {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
  icon: any;
  expiryDate?: string;
  tintColor?: string;
}

const PaymentMethodItemConnected: React.FC<PaymentMethodItemConnectedProps> = ({
  onPress,
  title,
  icon,
  expiryDate,
  tintColor,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        Platform.OS === "android" ? styles.androidShadow : styles.iosShadow,
        { backgroundColor: COLORS.white },
      ]}
    >
      <View style={styles.rightContainer}>
        <Image
          source={icon}
          resizeMode="contain"
          style={[
            styles.icon,
            {
              tintColor,
            },
          ]}
        />
        <View>
          <Text
            style={[
              styles.title,
              {
                color: COLORS.greyscale900,
              },
            ]}
          >
            {title}
          </Text>
          {expiryDate ? (
            <Text
              style={[
                styles.expiryDate,
                {
                  color: COLORS.primary,
                },
              ]}
            >
              Expire le {expiryDate}
            </Text>
          ) : (
            <></>
          )}
        </View>
      </View>
      <View style={styles.leftContainer}>
        <Text style={styles.connectedTitle}>Connecté</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
    marginBottom: 16,
    height: 76,
    backgroundColor: COLORS.white,
    marginHorizontal: 7,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    height: 26,
    width: 26,
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.greyscale900,
  },
  expiryDate: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.primary,
    marginTop: 2,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  androidShadow: {
    elevation: 4,
  },
  iosShadow: {
    shadowColor: "rgba(4, 6, 15, 0.05)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  connectedTitle: {
    fontSize: 16,
    fontFamily: "semiBold",
    color: COLORS.primary,
  },
});

export default PaymentMethodItemConnected;
