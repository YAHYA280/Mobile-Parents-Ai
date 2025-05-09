import React from "react";
import { View, StyleSheet, ViewStyle, TextStyle, Text } from "react-native";
import { MotiView } from "moti";
import { COLORS, RADIUS } from "@/constants/theme";
import { useTheme } from "@/theme/ThemeProvider";

interface ProgressBarProps {
  progress: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
  labelPosition?: "inside" | "right";
  style?: ViewStyle;
  labelStyle?: TextStyle;
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  color,
  backgroundColor,
  showLabel = false,
  labelPosition = "right",
  style,
  labelStyle,
  animated = true,
}) => {
  const { dark } = useTheme();

  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  // Determine colors
  const progressColor = color || COLORS.primary;
  const bgColor =
    backgroundColor || (dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)");

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.progressBarContainer,
          {
            height,
            backgroundColor: bgColor,
            borderRadius: height / 2,
          },
        ]}
      >
        {animated ? (
          <MotiView
            from={{ width: "0%" }}
            animate={{ width: `${normalizedProgress}%` }}
            transition={{
              type: "timing",
              duration: 1000,
            }}
            style={[
              styles.progressBar,
              {
                backgroundColor: progressColor,
                borderRadius: height / 2,
              },
            ]}
          >
            {showLabel &&
              labelPosition === "inside" &&
              normalizedProgress > 20 && (
                <Text style={[styles.insideLabel, labelStyle]}>
                  {`${normalizedProgress}%`}
                </Text>
              )}
          </MotiView>
        ) : (
          <View
            style={[
              styles.progressBar,
              {
                width: `${normalizedProgress}%`,
                backgroundColor: progressColor,
                borderRadius: height / 2,
              },
            ]}
          >
            {showLabel &&
              labelPosition === "inside" &&
              normalizedProgress > 20 && (
                <Text style={[styles.insideLabel, labelStyle]}>
                  {`${normalizedProgress}%`}
                </Text>
              )}
          </View>
        )}
      </View>

      {showLabel && labelPosition === "right" && (
        <Text
          style={[styles.rightLabel, labelStyle || { color: progressColor }]}
        >
          {`${normalizedProgress}%`}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBarContainer: {
    flex: 1,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
  },
  insideLabel: {
    color: "#FFFFFF",
    fontSize: 10,
    position: "absolute",
    right: 8,
    top: 0,
    bottom: 0,
    textAlignVertical: "center",
  },
  rightLabel: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: "600",
  },
});

export default ProgressBar;
