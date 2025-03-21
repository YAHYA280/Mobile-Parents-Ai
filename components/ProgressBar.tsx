import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { COLORS } from "../constants";

interface ProgressBarProps {
  currentStep?: number;
  steps?: string[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep = 0,
  steps = ["1", "2", "3", "4", "5"],
}) => (
  <View style={styles.stepsContainer}>
    {steps.map((step, index) => (
      <View key={index} style={styles.stepContainer}>
        <View
          style={[
            styles.stepCircle,
            index <= currentStep
              ? { backgroundColor: COLORS.primary }
              : { backgroundColor: COLORS.greyscale500 },
          ]}
        >
          <Text style={styles.stepText}>{step}</Text>
        </View>
        {index < steps.length - 1 && (
          <View
            style={[
              styles.stepLine,
              index < currentStep
                ? { backgroundColor: COLORS.primary }
                : { backgroundColor: COLORS.greyscale500 },
            ]}
          />
        )}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  stepText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  stepLine: {
    height: 2,
    width: 40,
  },
});

export default ProgressBar;
