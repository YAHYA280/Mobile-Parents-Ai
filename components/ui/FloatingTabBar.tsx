// FloatingTabBar.tsx
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { MotiView } from "moti";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  withSpring,
  interpolate,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { COLORS } from "@/constants";
import { Paths } from "@/navigation";

type TabButtonProps = {
  routeName: string;
  label: string;
  isFocused: boolean;
  onPress: () => void;
  activeColor: string;
  inactiveColor: string;
};

const TabButton: React.FC<TabButtonProps> = ({
  routeName,
  label,
  isFocused,
  onPress,
  activeColor,
  inactiveColor,
}) => {
  let iconName: keyof typeof Ionicons.glyphMap = "home-outline";
  let iconSize = 24;

  if (routeName === Paths.Index || routeName.includes("index")) {
    iconName = isFocused ? "home" : "home-outline";
  } else if (routeName === "Enfants") {
    iconName = isFocused ? "people" : "people-outline";
  } else if (routeName.includes("Support")) {
    iconName = isFocused ? "chatbubble" : "chatbubble-outline";
    iconSize = 22;
  } else if (routeName.includes("Profil")) {
    iconName = isFocused ? "person" : "person-outline";
  }

  const scale = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, {
      damping: 12,
      stiffness: 120,
    });
  }, [isFocused, scale]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(scale.value, [0, 1], [1, 1.3]),
      },
    ],
    top: interpolate(scale.value, [0, 1], [0, -10]),
  }));

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scale.value, [0, 1], [1, 0]),
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.tabButton}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.iconBackground, animatedCircleStyle]}>
        <View
          style={[styles.iconCircle, { backgroundColor: `${activeColor}15` }]}
        />
      </Animated.View>

      <Animated.View style={[animatedIconStyle, { zIndex: 1 }]}>
        <Ionicons
          name={iconName}
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
        {label}
      </Animated.Text>
    </TouchableOpacity>
  );
};

const FloatingTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  const backgroundColor = COLORS.white;
  const activeColor = COLORS.primary;
  const inactiveColor = "rgba(0,0,0,0.4)";
  const shadowColor = COLORS.primary;
  const borderColor = "rgba(0, 0, 0, 0.08)";

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
        const label = options.tabBarLabel ?? options.title ?? route.name;

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

        return (
          <TabButton
            key={route.key}
            routeName={route.name}
            label={typeof label === "string" ? label : ""}
            isFocused={isFocused}
            onPress={onPress}
            activeColor={activeColor}
            inactiveColor={inactiveColor}
          />
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
