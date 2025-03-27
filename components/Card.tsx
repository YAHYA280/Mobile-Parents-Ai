import type {
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
  GestureResponderEvent,
} from "react-native";

import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import { COLORS, images } from "../constants";

interface CardProps {
  number: string;
  name: string;
  date: string;
  onPress?: (event: GestureResponderEvent) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const Card: React.FC<CardProps> = ({
  number,
  name,
  date,
  onPress,
  containerStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, containerStyle]}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Carte de paiement</Text>
        <View style={styles.logoContainer}>
          <Image
            source={images.logo as ImageSourcePropType}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Ajout de labels */}
      <View style={styles.numberContainer}>
        <Text style={styles.label}>Numéro de carte</Text>
        <Text style={styles.cardNumber}>{number}</Text>
      </View>

      <View style={styles.footerContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.label}>Nom du titulaire</Text>
          <Text style={styles.name}>{name}</Text>
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.label}>Date d&apos;expiration</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>

      <Image
        source={images.elipseCard as ImageSourcePropType}
        style={styles.elipseIcon}
      />
      <Image
        source={images.rectangleCard as ImageSourcePropType}
        style={styles.rectangleIcon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 304,
    height: 180,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 12,
    marginRight: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    fontSize: 12,
    fontFamily: "regular",
    color: "rgba(255,255,255,.8)",
  },
  logoContainer: {
    width: 40,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 60,
    height: 45,
    tintColor: COLORS.white,
  },
  numberContainer: {
    marginVertical: 10,
  },
  label: {
    fontSize: 10,
    fontFamily: "regular",
    color: "rgba(255,255,255,.6)",
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.white,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  nameContainer: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontFamily: "semiBold",
    fontSize: 16,
    color: COLORS.white,
  },
  dateContainer: {
    alignItems: "flex-end",
  },
  date: {
    fontSize: 14,
    fontFamily: "regular",
    color: "rgba(255,255,255,.8)",
  },
  elipseIcon: {
    height: 145,
    width: 145,
    position: "absolute",
    bottom: -22,
    right: 0,
  },
  rectangleIcon: {
    height: 132,
    width: 156,
    position: "absolute",
    top: -44,
    left: -44,
    zIndex: -999,
  },
});

export default Card;
