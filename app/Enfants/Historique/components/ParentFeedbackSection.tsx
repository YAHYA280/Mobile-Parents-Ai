// ParentFeedbackSection.tsx
import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { COLORS } from "../../../../constants/theme";

interface ParentFeedbackSectionProps {
  parentFeedbacks: Array<{ text: string; date: Date }>;
  feedback: string;
  setFeedback: (text: string) => void;
  addFeedback: () => void;
  openEditFeedbackModal: (index: number) => void;
}

const ParentFeedbackSection: React.FC<ParentFeedbackSectionProps> = ({
  parentFeedbacks,
  feedback,
  setFeedback,
  addFeedback,
  openEditFeedbackModal,
}) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Section header */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
      >
        <FontAwesomeIcon
          icon="comment-dots"
          size={16}
          color={COLORS.primary}
          style={{ marginRight: 8 }}
        />
        <Text style={{ fontSize: 16, fontWeight: "600", color: COLORS.black }}>
          Commentaires des parents
        </Text>
      </View>

      {/* Feedback list */}
      {parentFeedbacks.length > 0 ? (
        <View>
          {parentFeedbacks.map((fb, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: "rgba(0,0,0,0.03)",
                borderRadius: 12,
                padding: 16,
                marginBottom: index < parentFeedbacks.length - 1 ? 12 : 16,
              }}
              onPress={() => openEditFeedbackModal(index)}
            >
              <Text
                style={{ color: COLORS.gray3, lineHeight: 22, fontSize: 15 }}
              >
                {fb.text}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                <Text style={{ fontSize: 12, color: "rgba(0, 0, 0, 0.4)" }}>
                  {fb.date.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
                <View
                  style={{
                    backgroundColor: "rgba(0,0,0,0.07)",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <FontAwesomeIcon
                    icon="pen"
                    size={10}
                    color={COLORS.gray3}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={{ fontSize: 11, color: COLORS.gray3 }}>
                    Modifier
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.03)",
            borderRadius: 12,
            padding: 16,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <Text style={{ color: COLORS.gray3, fontStyle: "italic" }}>
            Aucun commentaire pour le moment
          </Text>
        </View>
      )}

      {/* Add feedback input */}
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.03)",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <TextInput
          placeholder="Ajouter un commentaire..."
          placeholderTextColor={"rgba(0,0,0,0.3)"}
          value={feedback}
          onChangeText={setFeedback}
          multiline
          style={{
            color: COLORS.black,
            fontSize: 15,
            minHeight: 80,
            textAlignVertical: "top",
          }}
        />

        <TouchableOpacity
          onPress={addFeedback}
          style={{
            backgroundColor: COLORS.primary,
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 25,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "flex-end",
            marginTop: 12,
            opacity: feedback.trim() === "" ? 0.6 : 1,
          }}
          disabled={feedback.trim() === ""}
        >
          <FontAwesomeIcon
            icon="paper-plane"
            size={16}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />
          <Text
            style={{ color: COLORS.white, fontWeight: "600", fontSize: 15 }}
          >
            Envoyer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ParentFeedbackSection;
