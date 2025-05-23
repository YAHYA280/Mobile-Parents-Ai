// components/enfants/historique/DownloadButton.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { COLORS } from "@/constants/theme";

interface DownloadButtonProps {
  onPress: () => void;
  isDownloading: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  onPress,
  isDownloading,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDownloading}
      style={styles.container}
    >
      {isDownloading ? (
        <ActivityIndicator size="small" color={COLORS.white} />
      ) : (
        <>
          <FontAwesomeIcon
            icon="file-pdf"
            size={20}
            color={COLORS.white}
            style={styles.icon}
          />
          <Text style={styles.text}>Télécharger en PDF</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DownloadButton;
