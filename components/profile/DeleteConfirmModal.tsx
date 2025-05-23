// components/profile/DeleteConfirmModal.tsx
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";

import { COLORS } from "@/constants";

interface DeleteConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: COLORS.white }]}>
          <View style={styles.modalHeaderIcon}>
            <View style={styles.warningCircle}>
              <Ionicons name="warning" size={32} color="#FFFFFF" />
            </View>
          </View>

          <Text style={[styles.deleteTitle, { color: COLORS.black }]}>
            Êtes-vous sûr de vouloir supprimer votre compte ?
          </Text>

          <Text style={[styles.deleteSubtitle, { color: COLORS.greyscale600 }]}>
            Cette action est irréversible et toutes vos données seront
            définitivement supprimées.
          </Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.confirmDeleteButton}
              onPress={onConfirm}
            >
              <Text style={styles.confirmDeleteText}>Confirmer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.cancelButton,
                {
                  backgroundColor: COLORS.greyscale100,
                },
              ]}
              onPress={onClose}
            >
              <Text
                style={[
                  styles.cancelButtonText,
                  { color: COLORS.greyscale900 },
                ]}
              >
                Annuler
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
  },
  modalContent: {
    width: "100%",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 10,
  },
  modalHeaderIcon: {
    marginBottom: 24,
  },
  warningCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F44336",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteTitle: {
    fontSize: 20,
    fontFamily: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  deleteSubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  confirmDeleteButton: {
    flex: 1,
    backgroundColor: "#F44336",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmDeleteText: {
    color: "#FFFFFF",
    fontFamily: "semibold",
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontFamily: "semibold",
    fontSize: 16,
  },
});

export default DeleteConfirmModal;
