import React from "react";
import { icons } from "@/constants";
import { COLORS } from "@/constants";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";
import ConditionalComponent from "@/components/ConditionalComponent";
import {
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

interface NotificationSearchProps {
  value: string;
  onChangeText: (text: string) => void;
}

const NotificationSearch: React.FC<NotificationSearchProps> = ({
  value,
  onChangeText,
}) => {
  const { dark } = useTheme();

  return (
    <View style={styles.searchContainer}>
      <View
        style={[
          styles.searchInputContainer,
          {
            backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale100,
            borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
          },
        ]}
      >
        <Feather
          name="search"
          size={20}
          color={dark ? COLORS.greyscale500 : COLORS.greyscale600}
          style={styles.searchIcon}
        />

        <TextInput
          style={[
            styles.searchInput,
            { color: dark ? COLORS.white : COLORS.greyscale900 },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder="Rechercher dans les notifications"
          placeholderTextColor={
            dark ? COLORS.greyscale500 : COLORS.greyscale600
          }
        />

        <ConditionalComponent isValid={value.length > 0}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => onChangeText("")}
          >
            <Image
              source={icons.clear}
              style={[
                styles.clearIcon,
                { tintColor: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
              ]}
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
