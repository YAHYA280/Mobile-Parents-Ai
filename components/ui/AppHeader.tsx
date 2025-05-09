// components/ui/AppHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { COLORS } from "@/constants/theme";

interface AppHeaderProps {
  title: string;
  leftIcon?: any;
  rightIcon?: any;
  onLeftIconPress?: () => void;
  onRightIconPress?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftIconPress,
  onRightIconPress,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        {leftIcon && (
          <TouchableOpacity style={styles.iconButton} onPress={onLeftIconPress}>
            <Image source={leftIcon} style={styles.icon} resizeMode="contain" />
          </TouchableOpacity>
        )}

        <Text style={styles.headerTitle}>{title}</Text>

        {rightIcon && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onRightIconPress}
          >
            <Image
              source={rightIcon}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333333",
    flex: 1,
    textAlign: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: "#333333",
  },
});

export default AppHeader;
