// FeedbackModal.tsx
import React from "react";
import { View, Text, TouchableOpacity, TextInput, Modal } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { COLORS } from "../../../../constants/theme";

interface FeedbackModalProps {
  visible: boolean;
  editingFeedback: string;
  setEditingFeedback: (text: string) => void;
  updateFeedback: () => void;
  deleteFeedback: () => void;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  visible,
  editingFeedback,
  setEditingFeedback,
  updateFeedback,
  deleteFeedback,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            width: "90%",
            backgroundColor: COLORS.white,
            borderRadius: 16,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", color: COLORS.black }}
            >
              Éditer le commentaire
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "rgba(0,0,0,0.05)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon icon="times" size={16} color={COLORS.black} />
            </TouchableOpacity>
          </View>

          <TextInput
            value={editingFeedback}
            onChangeText={setEditingFeedback}
            multiline
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.03)",
              borderRadius: 12,
              padding: 16,
              color: COLORS.black,
              marginBottom: 20,
              minHeight: 120,
              textAlignVertical: "top",
              fontSize: 16,
            }}
            placeholder="Votre commentaire..."
            placeholderTextColor={"rgba(0,0,0,0.3)"}
          />

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              onPress={deleteFeedback}
              style={{
                backgroundColor: "#FF3B30",
                padding: 16,
                borderRadius: 12,
                flex: 0.48,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon
                icon="trash-alt"
                size={16}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: COLORS.white, fontWeight: "600" }}>
                Supprimer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={updateFeedback}
              style={{
                backgroundColor: COLORS.primary,
                padding: 16,
                borderRadius: 12,
                flex: 0.48,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon
                icon="save"
                size={16}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: COLORS.white, fontWeight: "600" }}>
                Enregistrer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FeedbackModal;
