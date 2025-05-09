import React, { useRef, useEffect } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { COLORS } from "@/constants/theme";
import { useTheme } from "@/theme/ThemeProvider";
import ChatBubble from "./ChatBubble";

interface Message {
  id?: string | number;
  message: string;
  timestamp: string;
  sender: "assistant" | "child" | "user";
}

interface ConversationViewProps {
  messages: Message[];
  loading?: boolean;
  style?: any;
  contentContainerStyle?: any;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  messages,
  loading = false,
  style,
  contentContainerStyle,
}) => {
  const { dark } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0) {
      // Wait for rendering to complete
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [messages]);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={[styles.container, style]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
    >
      {messages.map((msg, index) => (
        <ChatBubble
          key={msg.id || `msg-${index}`}
          message={msg.message}
          timestamp={msg.timestamp}
          sender={msg.sender}
        />
      ))}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={COLORS.primary} size="small" />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 16,
  },
  loadingContainer: {
    padding: 12,
    alignItems: "center",
  },
});

export default ConversationView;
