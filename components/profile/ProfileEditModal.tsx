// components/profile/ProfileEditModal.tsx
import React from "react";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";

import Input from "@/components/Input";
import { icons, COLORS } from "@/constants";

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
  image: any;
  name: string;
  email: string;
  phone: string;
  onPickImage: () => void;
  onInputChanged: (inputId: string, inputValue: string) => void;
  onSave: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  visible,
  onClose,
  image,
  name,
  email,
  phone,
  onPickImage,
  onInputChanged,
  onSave,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: COLORS.white }]}>
          <View style={styles.modalDragHandle} />

          <Text style={[styles.editTitle, { color: COLORS.black }]}>
            Modifier le profil
          </Text>

          <View style={styles.profileImageEdit}>
            <Image
              source={image}
              contentFit="cover"
              style={styles.editProfileImage}
            />
            <TouchableOpacity
              onPress={onPickImage}
              style={styles.editImageButton}
            >
              <MaterialIcons name="edit" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputsContainer}>
            <Input
              id="name"
              value={name}
              onInputChanged={onInputChanged}
              placeholder="Nom Complet"
              icon={icons.user}
            />

            <Input
              id="email"
              value={email}
              onInputChanged={onInputChanged}
              placeholder="Email"
              icon={icons.email}
              keyboardType="email-address"
            />

            <Input
              id="phone"
              value={phone}
              onInputChanged={onInputChanged}
              placeholder="Téléphone"
              icon={icons.telephone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.saveButton} onPress={onSave}>
              <Text style={styles.saveButtonText}>Enregistrer</Text>
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
  modalDragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 2.5,
    marginBottom: 16,
  },
  editTitle: {
    fontSize: 20,
    fontFamily: "bold",
    marginBottom: 24,
  },
  profileImageEdit: {
    position: "relative",
    marginBottom: 24,
  },
  editProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "rgba(0,0,0,0.05)",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  inputsContainer: {
    width: "100%",
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
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

export default ProfileEditModal;
