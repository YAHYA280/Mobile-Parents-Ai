import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, RADIUS } from "@/constants/theme";
import { useTheme } from "@/theme/ThemeProvider";

interface ChatInputProps {
  placeholder?: string;
  onSend?: (message: string) => void;
  disabled?: boolean;
  style?: ViewStyle;
  value?: string;
  onChangeText?: (text: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  placeholder = "Tapez votre message...",
  onSend,
  disabled = false,
  style,
  value,
  onChangeText,
}) => {
  const { dark } = useTheme();
  const [message, setMessage] = useState("");

  // Controlled or uncontrolled input
  const inputValue = value !== undefined ? value : message;
  const handleChangeText = (text: string) => {
    if (onChangeText) {
      onChangeText(text);
    } else {
      setMessage(text);
    }
  };

  const handleSend = () => {
    if (disabled) return;

    const trimmedMessage = inputValue.trim();
    if (trimmedMessage && onSend) {
      onSend(trimmedMessage);
      if (!onChangeText) {
        setMessage("");
      }
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
        style,
      ]}
    >
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: dark
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.05)",
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: dark ? COLORS.white : COLORS.black }]}
          placeholder={placeholder}
          placeholderTextColor={
            dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)"
          }
          value={inputValue}
          onChangeText={handleChangeText}
          multiline
          editable={!disabled}
        />

        {disabled && (
          <Ionicons
            name="lock-closed"
            size={20}
            color={dark ? COLORS.secondaryWhite : COLORS.gray3}
            style={styles.lockIcon}
          />
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.sendButton,
          !inputValue.trim() || disabled ? styles.disabledButton : null,
          { backgroundColor: COLORS.primary },
        ]}
        onPress={handleSend}
        disabled={!inputValue.trim() || disabled}
      >
        <Ionicons name="send" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 120,
  },
  lockIcon: {
    marginLeft: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default ChatInput;
