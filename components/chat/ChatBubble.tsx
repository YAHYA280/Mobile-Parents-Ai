import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { TYPOGRAPHY, RADIUS } from "@/constants/theme";
import { useTheme } from "@/theme/ThemeProvider";

interface ChatBubbleProps {
  message: string;
  timestamp: string;
  sender: "assistant" | "child" | "user";
  style?: ViewStyle;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  timestamp,
  sender,
  style,
}) => {
  const { dark } = useTheme();

  // Determine the bubble style based on sender
  const isAssistant = sender === "assistant";

  return (
    <View
      style={[
        styles.container,
        isAssistant ? styles.assistantContainer : styles.userContainer,
        style,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isAssistant
            ? [
                styles.assistantBubble,
                {
                  backgroundColor: dark
                    ? "rgba(33, 150, 243, 0.3)"
                    : "rgba(33, 150, 243, 0.1)",
                },
              ]
            : [
                styles.userBubble,
                {
                  backgroundColor: dark ? "rgba(66, 66, 66, 0.8)" : "#E1E1E1",
                },
              ],
        ]}
      >
        <Text
          style={[
            styles.messageText,
            {
              color: isAssistant ? "#0067B1" : dark ? "#FFFFFF" : "#333333",
            },
          ]}
        >
          {message}
        </Text>
        <Text style={[styles.timestamp, { color: "rgba(0, 0, 0, 0.5)" }]}>
          {timestamp}
        </Text>
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
    borderRadius: RADIUS.lg,
  },
  userBubble: {
    borderTopRightRadius: 4,
  },
  assistantBubble: {
    borderTopLeftRadius: 4,
  },
  messageText: {
    ...TYPOGRAPHY.body2,
    lineHeight: 22,
  },
  timestamp: {
    ...TYPOGRAPHY.caption,
    alignSelf: "flex-end",
    marginTop: 4,
  },
});

export default ChatBubble;
