import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import React from "react";
import { Platform, KeyboardAvoidingView } from "react-native";

interface PageContainerProps {
  children: ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = (props) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 } as StyleProp<ViewStyle>}
    >
      {props.children}
    </KeyboardAvoidingView>
  );
};

export default PageContainer;
