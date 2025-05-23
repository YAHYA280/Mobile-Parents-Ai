// components/profile/LogoutBottomSheet.tsx
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { COLORS } from "@/constants";

interface LogoutBottomSheetProps {
  refRBSheet: React.RefObject<any>;
  onConfirmLogout: () => void;
  onCancel: () => void;
}

const LogoutBottomSheet: React.FC<LogoutBottomSheetProps> = ({
  refRBSheet,
  onConfirmLogout,
  onCancel,
}) => {
  return (
    <RBSheet
      ref={refRBSheet}
      closeOnPressMask
      height={280}
      customStyles={{
        wrapper: {
          backgroundColor: "rgba(0,0,0,0.5)",
        },
        draggableIcon: {
          backgroundColor: COLORS.grayscale200,
          width: 40,
          height: 5,
        },
        container: {
          borderTopRightRadius: 24,
          borderTopLeftRadius: 24,
          backgroundColor: COLORS.white,
          paddingTop: 16,
        },
      }}
    >
      <View style={styles.logoutSheetContent}>
        <View style={styles.logoutIconContainer}>
          <Ionicons name="log-out" size={32} color={COLORS.primary} />
        </View>

        <Text style={[styles.logoutTitle, { color: COLORS.black }]}>
          Déconnexion
        </Text>

        <Text style={[styles.logoutSubtitle, { color: COLORS.greyscale600 }]}>
          Êtes-vous sûr de vouloir vous déconnecter ?
        </Text>

        <View style={styles.logoutButtonsContainer}>
          <TouchableOpacity
            style={styles.confirmLogoutButton}
            onPress={onConfirmLogout}
          >
            <Text style={styles.confirmLogoutText}>Oui, déconnexion</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.cancelLogoutButton,
              { backgroundColor: COLORS.greyscale100 },
            ]}
            onPress={onCancel}
          >
            <Text
              style={[styles.cancelLogoutText, { color: COLORS.greyscale900 }]}
            >
              Annuler
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  logoutSheetContent: {
    padding: 24,
    alignItems: "center",
  },
  logoutIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoutTitle: {
    fontSize: 20,
    fontFamily: "bold",
    marginBottom: 8,
  },
  logoutSubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  logoutButtonsContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  confirmLogoutButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmLogoutText: {
    color: "#FFFFFF",
    fontFamily: "semibold",
    fontSize: 16,
  },
  cancelLogoutButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelLogoutText: {
    fontFamily: "semibold",
    fontSize: 16,
  },
});

export default LogoutBottomSheet;
