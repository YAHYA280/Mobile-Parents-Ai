// app/Enfants/Performance/components/PerformanceHeader.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faShareAlt, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { COLORS } from "../../../../constants/theme";

interface PerformanceHeaderProps {
  childName: string;
  childClass: string;
  onBackPress: () => void;
  onSharePress: () => void;
}

const PerformanceHeader: React.FC<PerformanceHeaderProps> = ({
  childName,
  childClass,
  onBackPress,
  onSharePress,
}) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <FontAwesomeIcon icon={faArrowLeft} size={18} color={COLORS.black} />
      </TouchableOpacity>

      <View>
        <Text style={styles.headerTitle}>Performance</Text>
        <Text style={styles.headerSubtitle}>
          {childName} • {childClass}
        </Text>
      </View>

      <TouchableOpacity onPress={onSharePress} style={styles.shareButton}>
        <FontAwesomeIcon icon={faShareAlt} size={18} color={COLORS.black} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666666",
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
});

export default PerformanceHeader;
