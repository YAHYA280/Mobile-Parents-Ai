import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 2 cards per row with margins

interface QuickActionCardProps {
  title: string;
  iconName: string;
  color: string;
  onPress: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  iconName,
  color,
  onPress,
}) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 400 }}
    >
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={[styles.card, { borderLeftColor: color }]}>
          <View
            style={[styles.iconContainer, { backgroundColor: `${color}15` }]}
          >
            <Ionicons name={iconName as any} size={24} color={color} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.arrowContainer}>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </View>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  card: {
    height: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "flex-start",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontFamily: "semibold",
    color: "#444",
  },
  arrowContainer: {
    position: "absolute",
    bottom: 12,
    right: 12,
    opacity: 0.5,
  },
});

export default QuickActionCard;
