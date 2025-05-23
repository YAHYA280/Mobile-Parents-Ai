import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { SIZES, COLORS } from "../constants";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  onPress: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: COLORS.greyscale900 }]}>
        {title}
      </Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: SIZES.width - 32,
    marginVertical: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.greyscale900,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.primary,
  },
});

export default SectionHeader;
