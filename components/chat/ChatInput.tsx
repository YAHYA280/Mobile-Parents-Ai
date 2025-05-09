import React, { useState } from "react";
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ViewStyle 
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