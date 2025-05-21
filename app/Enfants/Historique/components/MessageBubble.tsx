// Chat components/MessageBubble.tsx
import React from "react";
import { View, Text } from "react-native";
import { COLORS } from "../../../../constants/theme";

interface Message {
  sender: string;
  message: string;
  timestamp: string;
}

interface MessageBubbleProps {
  message: Message;
  index: number;
  conversation: Message[];
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  index,
  conversation,
}) => {
  const isAssistant = message.sender === "assistant";
  const prevMsgSameSender =
    index > 0 && conversation[index - 1].sender === message.sender;
  const nextMsgSameSender =
    index < conversation.length - 1 &&
    conversation[index + 1].sender === message.sender;

  // Calculate spacing and bubble styles based on message sequence
  const topMargin = prevMsgSameSender ? 6 : 16;
  const bottomMargin = nextMsgSameSender ? 6 : 16;

  // Customize border radius based on position in sequence
  let borderRadiusStyle = {};
  if (isAssistant) {
    borderRadiusStyle = {
      borderTopLeftRadius: prevMsgSameSender ? 18 : 4,
      borderBottomLeftRadius: nextMsgSameSender ? 18 : 4,
      borderTopRightRadius: 18,
      borderBottomRightRadius: 18,
    };
  } else {
    borderRadiusStyle = {
      borderTopLeftRadius: 18,
      borderBottomLeftRadius: 18,
      borderTopRightRadius: prevMsgSameSender ? 18 : 4,
      borderBottomRightRadius: nextMsgSameSender ? 18 : 4,
    };
  }

  // Prepare timestamp for bubble
  const formatTime = (timestamp: string) => {
    if (!timestamp || !timestamp.includes(":")) return "";
    const parts = timestamp.split(":");
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return timestamp;
  };

  return (
    <View
      style={{
        marginTop: topMargin,
        marginBottom: bottomMargin,
        alignItems: isAssistant ? "flex-start" : "flex-end",
      }}
    >
      <View
        style={{
          backgroundColor: isAssistant ? "rgba(0, 149, 255, 0.08)" : "#F0F0F0",
          padding: 16,
          maxWidth: "85%",
          minWidth: 80,
          ...borderRadiusStyle,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        }}
      >
        <Text
          style={{
            color: isAssistant ? "#0066CC" : COLORS.black,
            fontSize: 15,
            lineHeight: 22,
            fontWeight: isAssistant ? "normal" : "500",
          }}
        >
          {message.message}
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: "rgba(0, 0, 0, 0.4)",
            alignSelf: "flex-end",
            marginTop: 6,
          }}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
};

export default MessageBubble;
