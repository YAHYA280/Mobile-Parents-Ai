import React from "react";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

import { COLORS, COLOORS, TYPOGRAPHY } from "@/constants/theme";

interface FeatureItemProps {
  feature: string;
  index: number;
  color?: string;
  animated?: boolean;
  delay?: number;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  feature,
  index,
  color = COLOORS.primary.main,
  animated = true,
  delay = 100,
}) => {
  const textColor = COLORS.black;

  const baseComponent = (
    <>
      <View style={[styles.checkCircle, { backgroundColor: `${color}15` }]}>
        <Ionicons name="checkmark" size={16} color={color} />
      </View>
      <Text style={[styles.featureText, { color: textColor }]}>{feature}</Text>
    </>
  );

  if (animated) {
    return (
      <MotiView
        style={styles.featureRow}
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{
          delay: delay + index * 50,
          type: "timing",
          duration: 400,
        }}
      >
        {baseComponent}
      </MotiView>
    );
  }

  return <View style={styles.featureRow}>{baseComponent}</View>;
};

const styles = StyleSheet.create({
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  featureText: {
    ...TYPOGRAPHY.body1,
    flex: 1,
  },
});

export default FeatureItem;
