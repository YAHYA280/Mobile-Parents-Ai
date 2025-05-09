// components/chat/MessageBubble.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface MessageBubbleProps {
  message: string;
  timestamp: string;
  isUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  timestamp,
  isUser,
}) => {
  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.assistantMessageText,
          ]}
        >
          {message}
        </Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    maxWidth: "80%",
  },
  userContainer: {
    alignSelf: "flex-end",
  },
  assistantContainer: {
    alignSelf: "flex-start",
  },
  bubble: {
    padding: 16,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: "#E1E1E1",
    borderTopRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: "rgba(0, 149, 255, 0.1)",
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#333333",
  },
  assistantMessageText: {
    color: "#0067B1",
  },
  timestamp: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.5)",
    alignSelf: "flex-end",
    marginTop: 4,
  },
});

export default MessageBubble;
