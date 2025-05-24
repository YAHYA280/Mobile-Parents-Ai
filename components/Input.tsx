import type { FC } from "react";
import type { TextInputProps } from "react-native";

import { Image } from "expo-image";
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

import { SIZES, COLORS } from "../constants";

interface InputProps extends TextInputProps {
  id: string;
  icon?: string | React.ReactNode;
  errorText?: string[];
  onInputChanged: (id: string, text: string) => void;
}

const Input: FC<InputProps> = (props) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const onChangeText = (text: string) => {
    props.onInputChanged(props.id, text);
  };

  // Function to render the icon based on its type
  const renderIcon = () => {
    if (!props.icon) return null;

    // If icon is a React component (ReactNode), render it directly
    if (typeof props.icon === "object" && React.isValidElement(props.icon)) {
      return <View style={styles.iconContainer}>{props.icon}</View>;
    }

    // If icon is a string (image source), use Image component
    if (typeof props.icon === "string") {
      return (
        <Image
          source={props.icon}
          style={[
            styles.icon,
            {
              tintColor: isFocused ? COLORS.primary : "#BCBCBC",
            },
          ]}
        />
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: isFocused ? COLORS.primary : COLORS.greyscale500,
            backgroundColor: isFocused
              ? COLORS.tansparentPrimary
              : COLORS.greyscale500,
          },
        ]}
      >
        {renderIcon()}
        <TextInput
          {...props}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[styles.input, { color: COLORS.black }]}
          placeholder={props.placeholder}
          placeholderTextColor={props.placeholderTextColor}
          autoCapitalize="none"
        />
      </View>
      {props.errorText && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding2,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 5,
    flexDirection: "row",
    height: 52,
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 10,
    height: 20,
    width: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 10,
    height: 20,
    width: 20,
    tintColor: "#BCBCBC",
  },
  input: {
    color: COLORS.black,
    flex: 1,
    fontFamily: "regular",
    fontSize: 14,
    paddingTop: 0,
  },
  errorContainer: {
    marginVertical: 4,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
});

export default Input;
