// components/enfants/historique/FicheHeader.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { COLORS } from "@/constants/theme";

interface FicheHeaderProps {
  title: string;
  subject: string;
  onBack: () => void;
  onShare: () => void;
}

const FicheHeader: React.FC<FicheHeaderProps> = ({
  title,
  subject,
  onBack,
  onShare,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <FontAwesomeIcon icon="arrow-left" size={18} color={COLORS.black} />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Fiche Pédagogique</Text>
        <Text style={styles.subject}>{subject}</Text>
      </View>

      <TouchableOpacity style={styles.shareButton} onPress={onShare}>
        <FontAwesomeIcon icon="share-alt" size={18} color={COLORS.black} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    backgroundColor: "#FFFFFF",
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
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
  },
  subject: {
    fontSize: 13,
    color: COLORS.gray3,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});

export default FicheHeader;
