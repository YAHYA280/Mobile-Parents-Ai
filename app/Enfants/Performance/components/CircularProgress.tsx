// Fixed CircularProgress.tsx
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing, ViewStyle } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

// Create an animated version of the Circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  percentage: number;
  radius: number;
  strokeWidth: number;
  duration?: number;
  children?: React.ReactNode;
  progressColors: string[];
  bgColor?: string;
  style?: ViewStyle;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  radius,
  strokeWidth,
  duration = 1500,
  children,
  progressColors,
  bgColor = "rgba(0,0,0,0.05)",
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const halfCircle = radius + strokeWidth;
  const circleCircumference = 2 * Math.PI * radius;

  const animation = (toValue: number) => {
    return Animated.timing(animatedValue, {
      toValue,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
  };

  useEffect(() => {
    // FIX: Ensure percentage is a valid number
    const safePercentage =
      typeof percentage === "number" && !isNaN(percentage)
        ? Math.min(Math.max(percentage, 0), 100)
        : 0;

    animation(safePercentage).start();
  }, [percentage, animation]);

  // FIX: Calculate the stroke dashoffset based on the animated value with safe checks
  const animatedStrokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circleCircumference, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={[styles.container, style]}>
      <Svg
        width={radius * 2 + strokeWidth * 2}
        height={radius * 2 + strokeWidth * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
      >
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke={bgColor}
            strokeWidth={strokeWidth}
            strokeOpacity={1}
          />
          <AnimatedCircle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke={progressColors[0]}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circleCircumference}
            strokeDashoffset={animatedStrokeDashoffset}
          />
        </G>
      </Svg>
      <View style={styles.childrenContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  childrenContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CircularProgress;
