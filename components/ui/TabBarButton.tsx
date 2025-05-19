import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface TabBarButtonProps {
  isFocused: boolean;
  label: string;
  regularIcon: IconDefinition;
  solidIcon: IconDefinition;
  color: string;
  onPress: () => void;
  onLongPress?: () => void;
}

const TabBarButton: React.FC<TabBarButtonProps> = ({
  isFocused,
  label,
  regularIcon,
  solidIcon,
  color,
  onPress,
  onLongPress,
}) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, {
      damping: 12,
      stiffness: 120,
    });
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.3]);

    const top = interpolate(scale.value, [0, 1], [0, -10]);

    return {
      transform: [{ scale: scaleValue }],
      top,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);

    return {
      opacity,
    };
  });

  const animatedCircleStyle = useAnimatedStyle(() => {
    const circleScale = interpolate(scale.value, [0, 1], [0, 1]);

    return {
      transform: [{ scale: circleScale }],
      opacity: scale.value,
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.container}
    >
      <Animated.View style={[styles.iconBackground, animatedCircleStyle]}>
        <View style={[styles.iconCircle, { backgroundColor: `${color}15` }]} />
      </Animated.View>

      <Animated.View style={[animatedIconStyle]}>
        <FontAwesomeIcon
          icon={isFocused ? solidIcon : regularIcon}
          size={22}
          color={color}
        />
      </Animated.View>

      <Animated.Text
        style={[
          {
            color,
            fontSize: 11,
            fontFamily: "medium",
          },
          animatedTextStyle,
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    paddingTop: 5,
    position: "relative",
  },
  iconBackground: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    bottom: 0,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TabBarButton;
