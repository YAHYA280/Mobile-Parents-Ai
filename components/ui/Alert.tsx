import React from "react";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import { useTheme } from "@/theme/ThemeProvider";
import {
  COLORS,
  RADIUS,
  SHADOWS,
  COLOORS,
  TYPOGRAPHY,
} from "@/constants/theme";

const { width } = Dimensions.get("window");

export type AlertButtonStyle = "default" | "cancel" | "destructive";

export interface AlertButton {
  text: string;
  style?: AlertButtonStyle;
  onPress?: () => void;
}

interface AlertProps {
  visible: boolean;
  title: string;
  message: string;
  buttons: AlertButton[];
  onDismiss?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  visible,
  title,
  message,
  buttons,
  onDismiss,
}) => {
  const { dark } = useTheme();

  const getAlertIcon = () => {
    if (title.toLowerCase().includes("erreur")) {
      return "alert-circle";
    } if (title.toLowerCase().includes("annuler")) {
      return "help-circle";
    } if (title.toLowerCase().includes("succès")) {
      return "checkmark-circle";
    } 
      return "information-circle";
    
  };

  const getAlertIconColor = () => {
    if (title.toLowerCase().includes("erreur")) {
      return COLOORS.status.expired.main;
    } if (title.toLowerCase().includes("annuler")) {
      return COLOORS.status.suspended.main;
    } if (title.toLowerCase().includes("succès")) {
      return COLOORS.status.active.main;
    } 
      return COLOORS.primary.main;
    
  };

  const getButtonStyle = (buttonStyle?: AlertButtonStyle) => {
    switch (buttonStyle) {
      case "destructive":
        return {
          container: {
            backgroundColor: dark ? "#2A1215" : COLOORS.status.expired.light,
          },
          text: { color: COLOORS.status.expired.main },
        };
      case "cancel":
        return {
          container: {
            backgroundColor: dark
              ? COLOORS.dark3
              : COLOORS.surfaceVariant.light,
          },
          text: { color: dark ? COLOORS.white : COLOORS.gray3 },
        };
      default:
        return {
          container: {
            backgroundColor: COLOORS.primary.main,
          },
          text: { color: COLORS.white },
        };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.modalContainer}>
        <MotiView
          style={[
            styles.alertContainer,
            {
              backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            },
          ]}
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <View style={styles.alertIconContainer}>
            <Ionicons
              name={getAlertIcon() as any}
              size={48}
              color={getAlertIconColor()}
            />
          </View>

          <Text
            style={[
              styles.alertTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            {title}
          </Text>

          <Text
            style={[
              styles.alertMessage,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            {message}
          </Text>

          <View style={styles.alertButtonsContainer}>
            {buttons.map((button, index) => {
              const buttonStyles = getButtonStyle(button.style);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.alertButton,
                    buttonStyles.container,
                    index > 0 && { marginLeft: 12 },
                  ]}
                  onPress={button.onPress}
                >
                  <Text style={[styles.alertButtonText, buttonStyles.text]}>
                    {button.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </MotiView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  alertContainer: {
    width: width - 64,
    borderRadius: RADIUS.lg,
    padding: 24,
    alignItems: "center",
    ...SHADOWS.large,
  },
  alertIconContainer: {
    marginBottom: 16,
  },
  alertTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: 12,
    textAlign: "center",
  },
  alertMessage: {
    ...TYPOGRAPHY.body1,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  alertButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  alertButton: {
    flex: 1,
    height: 50,
    borderRadius: RADIUS.xxl,
    justifyContent: "center",
    alignItems: "center",
  },
  alertButtonText: {
    ...TYPOGRAPHY.button,
  },
});

export default Alert;
