import type { NavigationProp } from "@react-navigation/native";
import type {
  ViewStyle,
  TextStyle,
  ImageStyle,
  ImageSourcePropType} from "react-native";

import React from "react";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";

import { useTheme } from "../theme/ThemeProvider";
import { SIZES, icons, COLORS } from "../constants";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { colors, dark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: dark ? COLORS.dark1 : COLORS.white,
        },
      ]}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={icons.back as ImageSourcePropType}
          contentFit="contain"
          style={[
            styles.backIcon,
            {
              tintColor: colors.text,
            },
          ]}
        />
      </TouchableOpacity>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    width: SIZES.width - 32,
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,
  backIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
  } as ImageStyle,
  title: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.black,
  } as TextStyle,
});

export default Header;
