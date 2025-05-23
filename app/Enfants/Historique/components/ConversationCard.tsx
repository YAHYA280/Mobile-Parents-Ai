// ConversationCard.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { COLORS } from "../../../../constants/theme";

interface ConversationCardProps {
  conversation: Array<{ sender: string; message: string; timestamp: string }>;
  navigateToChat: () => void;
}

const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  navigateToChat,
}) => {
  // Only show first 3 messages
  const limitedConversation = conversation ? conversation.slice(0, 3) : [];

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
      {/* Card header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesomeIcon
            icon="comments"
            size={16}
            color={COLORS.primary}
            style={{ marginRight: 8 }}
          />
          <Text
            style={{ fontSize: 16, fontWeight: "600", color: COLORS.black }}
          >
            Conversation avec l&apos;assistant
          </Text>
        </View>

        <TouchableOpacity
          onPress={navigateToChat}
          style={{
            backgroundColor: COLORS.primary,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              marginRight: 4,
              fontSize: 13,
              fontWeight: "500",
            }}
          >
            Voir tout
          </Text>
          <FontAwesomeIcon icon="chevron-right" size={12} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Conversation messages */}
      {limitedConversation.length > 0 ? (
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.03)",
            borderRadius: 12,
            padding: 16,
          }}
        >
          {limitedConversation.map((msg, index) => {
            const isAssistant = msg.sender === "assistant";
            return (
              <View
                key={index}
                style={{
                  marginBottom: index < limitedConversation.length - 1 ? 16 : 0,
                  alignItems: isAssistant ? "flex-start" : "flex-end",
                }}
              >
                <View
                  style={{
                    backgroundColor: isAssistant
                      ? "rgba(0, 149, 255, 0.08)"
                      : "#F0F0F0",
                    padding: 12,
                    borderRadius: 16,
                    maxWidth: "85%",
                    borderTopLeftRadius: isAssistant ? 4 : 16,
                    borderTopRightRadius: isAssistant ? 16 : 4,
                  }}
                >
                  <Text
                    style={{
                      color: isAssistant ? "#0066CC" : COLORS.black,
                      fontSize: 14,
                      lineHeight: 20,
                    }}
                  >
                    {msg.message}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: "rgba(0, 0, 0, 0.4)",
                      alignSelf: "flex-end",
                      marginTop: 4,
                    }}
                  >
                    {msg.timestamp}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.03)",
            borderRadius: 12,
            padding: 16,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: COLORS.gray3, fontStyle: "italic" }}>
            Aucune conversation enregistrée pour cette activité
          </Text>
        </View>
      )}
    </View>
  );
};

export default ConversationCard;
