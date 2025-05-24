import React from "react";
import { Feather } from "@expo/vector-icons";
import {
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { icons } from "@/constants";
import { COLORS } from "@/constants";
import ConditionalComponent from "@/components/ConditionalComponent";

interface NotificationSearchProps {
  value: string;
  onChangeText: (text: string) => void;
}

const NotificationSearch: React.FC<NotificationSearchProps> = ({
  value,
  onChangeText,
}) => {
  return (
    <View style={styles.searchContainer}>
      <View
        style={[
          styles.searchInputContainer,
          {
            backgroundColor: COLORS.greyscale100,
            borderColor: COLORS.greyscale300,
          },
        ]}
      >
        <Feather
          name="search"
          size={20}
          color={COLORS.greyscale600}
          style={styles.searchIcon}
        />

        <TextInput
          style={[styles.searchInput, { color: COLORS.greyscale900 }]}
          value={value}
          onChangeText={onChangeText}
          placeholder="Rechercher dans les notifications"
          placeholderTextColor={COLORS.greyscale600}
        />

        <ConditionalComponent isValid={value.length > 0}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => onChangeText("")}
          >
            <Image
              source={icons.cancelSquare}
              style={[styles.clearIcon, { tintColor: COLORS.greyscale600 }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </ConditionalComponent>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    fontFamily: "regular",
  },
  clearButton: {
    padding: 8,
  },
  clearIcon: {
    width: 20,
    height: 20,
  },
});

export default NotificationSearch;
