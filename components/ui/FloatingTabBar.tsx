import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import React, { useEffect } from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme/ThemeProvider";
import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import { Paths } from "@/navigation";

const FloatingTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { dark } = useTheme();
  const insets = useSafeAreaInsets();

  // Colors based on theme
  const backgroundColor = dark ? COLORS.dark1 : COLORS.white;
  const activeColor = COLORS.primary;
  const inactiveColor = dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)";
  const shadowColor = dark ? "#000" : COLORS.primary;
  const borderColor = dark
    ? "rgba(255, 255, 255, 0.08)"
    : "rgba(0, 0, 0, 0.08)";

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", delay: 300 }}
      style={[
        styles.tabBar,
        {
          backgroundColor,
          borderColor,
          shadowColor,
          paddingBottom: insets.bottom ? insets.bottom - 10 : 10,
          bottom: insets.bottom ? 20 : 25,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Get icons and sizes exactly as they were used in the original code
        let iconName;
        let iconSize = 24; // Default size for most icons

        if (route.name === Paths.Index || route.name.includes("index")) {
          iconName = isFocused ? "home" : "home-outline";
          iconSize = 24;
        } else if (route.name === "Enfants") {
          iconName = isFocused ? "people" : "people-outline";
          iconSize = 24;
        } else if (route.name.includes("Support")) {
          iconName = isFocused ? "chatbubble" : "chatbubble-outline";
          iconSize = 22; // Support icon was specifically 22px in original code
        } else if (route.name.includes("Profil")) {
          iconName = isFocused ? "person" : "person-outline";
          iconSize = 24;
        } else {
          // Fallback
          iconName = isFocused ? "home" : "home-outline";
          iconSize = 24;
        }

        // Animation values
        const scale = useSharedValue(0);

        useEffect(() => {
          scale.value = withSpring(isFocused ? 1 : 0, {
            damping: 12,
            stiffness: 120,
          });
        }, [isFocused]);

        const animatedIconStyle = useAnimatedStyle(() => {
          return {
            transform: [
              {
                scale: interpolate(scale.value, [0, 1], [1, 1.3]),
              },
            ],
            top: interpolate(scale.value, [0, 1], [0, -10]),
          };
        });

        const animatedCircleStyle = useAnimatedStyle(() => {
          return {
            transform: [{ scale: scale.value }],
            opacity: scale.value,
          };
        });

        const textStyle = useAnimatedStyle(() => {
          return {
            opacity: interpolate(scale.value, [0, 1], [1, 0]),
          };
        });

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            style={styles.tabButton}
          >
            <Animated.View style={[styles.iconBackground, animatedCircleStyle]}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${activeColor}15` },
                ]}
              />
            </Animated.View>

            <Animated.View style={[animatedIconStyle, { zIndex: 1 }]}>
              <Ionicons
                name={iconName as any}
                size={iconSize}
                color={isFocused ? activeColor : inactiveColor}
              />
            </Animated.View>

            <Animated.Text
              style={[
                {
                  color: isFocused ? activeColor : inactiveColor,
                  fontSize: 11,
                  fontFamily: "medium",
                  marginTop: 4,
                },
                textStyle,
              ]}
            >
              {typeof label === "string" ? label : ""}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
    </MotiView>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    flexDirection: "row",
    height: 75,
    left: 20,
    right: 20,
    borderRadius: 30,
    borderWidth: 1,
    paddingTop: 12,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 10,
    zIndex: 1000,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    position: "relative",
  },
  iconBackground: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FloatingTabBar;
