import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useTheme } from "@/theme/ThemeProvider";
import { COLORS, SPACING, COLOORS, TYPOGRAPHY } from "@/constants/theme";

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  rightIcon?: string;
  onRightIconPress?: () => void;
  showBackButton?: boolean;
  transparent?: boolean;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  onBackPress,
  rightIcon,
  onRightIconPress,
  showBackButton = true,
  transparent = false,
  subtitle,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        transparent
          ? styles.transparentContainer
          : { backgroundColor: colors.background },
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
              <Ionicons name="arrow-back" size={24} color={COLORS.black} />
            </TouchableOpacity>
          )}
          <View>
            <Text style={[styles.title, { color: COLORS.black }]}>{title}</Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: COLORS.gray3 }]}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {rightIcon && (
          <TouchableOpacity
            style={styles.rightButton}
            onPress={onRightIconPress}
          >
            <Ionicons
              name={rightIcon as any}
              size={24}
              color={COLOORS.primary.main}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // No paddingTop here - this is key
  },
  transparentContainer: {
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h2,
  },
  subtitle: {
    ...TYPOGRAPHY.body2,
    marginTop: 2,
  },
  rightButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Header;
