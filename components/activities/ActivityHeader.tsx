import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, TYPOGRAPHY } from "@/constants/theme";
import { useTheme } from "@/theme/ThemeProvider";

interface ActivityHeaderProps {
  title: string;
  onBack: () => void;
  onBlockageToggle?: () => void;
  blockageIdentified?: boolean;
  rightElement?: React.ReactNode;
}

const ActivityHeader: React.FC<ActivityHeaderProps> = ({
  title,
  onBack,
  onBlockageToggle,
  blockageIdentified = false,
  rightElement,
}) => {
  const { dark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
      ]}
    >
      <TouchableOpacity
        onPress={onBack}
        style={[
          styles.backButton,
          {
            backgroundColor: dark
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.05)",
          },
        ]}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color={dark ? COLORS.white : COLORS.black}
        />
      </TouchableOpacity>

      <Text
        style={[styles.title, { color: dark ? COLORS.white : COLORS.black }]}
        numberOfLines={1}
      >
        {title}
      </Text>

      {onBlockageToggle ? (
        <TouchableOpacity
          style={[
            styles.blockageButton,
            blockageIdentified && styles.blockageIdentified,
          ]}
          onPress={onBlockageToggle}
        >
          <Ionicons
            name="alert-circle"
            size={24}
            color={
              blockageIdentified
                ? "#FF3B30"
                : dark
                  ? COLORS.secondaryWhite
                  : COLORS.gray3
            }
          />
        </TouchableOpacity>
      ) : rightElement ? (
        rightElement
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  title: {
    ...TYPOGRAPHY.h3,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  blockageButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  blockageIdentified: {
    backgroundColor: "rgba(255,59,48,0.2)",
  },
  placeholder: {
    width: 40,
  },
});

export default ActivityHeader;
