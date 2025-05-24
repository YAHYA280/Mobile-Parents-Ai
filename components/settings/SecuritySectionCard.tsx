import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { COLORS } from "../../constants";

// Component props
interface SecuritySectionCardProps {
  title: string;
  icon: string;

  isOpen: boolean;
  onToggle: () => void;
}

const SecuritySectionCard: React.FC<SecuritySectionCardProps> = ({
  title,
  icon,

  isOpen,
  onToggle,
}) => (
  <TouchableOpacity
    onPress={onToggle}
    style={[
      styles.sectionCard,
      isOpen && styles.sectionCardActive,
      { backgroundColor: "#FFFFFF" },
    ]}
    activeOpacity={0.8}
  >
    <View style={styles.sectionCardHeader}>
      <View style={styles.sectionIconContainer}>
        <LinearGradient
          colors={isOpen ? [COLORS.primary, "#ff7043"] : ["#E8E8E8", "#F8F9FA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.sectionIconGradient}
        >
          <Ionicons
            name={icon as any}
            size={20}
            color={isOpen ? "#FFFFFF" : COLORS.primary}
          />
        </LinearGradient>
      </View>
      <Text style={[styles.sectionTitle, { color: COLORS.black }]}>
        {title}
      </Text>
      <View style={[styles.sectionExpandIcon, { backgroundColor: "#F8F9FA" }]}>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={16}
          color={COLORS.greyscale600}
        />
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  sectionCard: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionCardActive: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  sectionCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIconContainer: {
    marginRight: 16,
  },
  sectionIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "semibold",
    flex: 1,
  },
  sectionExpandIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SecuritySectionCard;
