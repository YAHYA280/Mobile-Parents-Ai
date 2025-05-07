import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SPACING, TYPOGRAPHY, COLOORS } from "@/constants/theme";

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
  const { colors, dark } = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.container,
        transparent
          ? styles.transparentContainer
          : { backgroundColor: colors.background },
      ]}
      edges={["top"]}
    >
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={dark ? COLORS.white : COLORS.black}
              />
            </TouchableOpacity>
          )}
          <View>
            <Text
              style={[
                styles.title,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                style={[
                  styles.subtitle,
                  { color: dark ? COLORS.gray2 : COLORS.gray3 },
                ]}
              >
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
