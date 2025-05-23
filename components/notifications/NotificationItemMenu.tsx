import React from "react";
import { Feather } from "@expo/vector-icons";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import { COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";

interface Notification {
  id: string;
  type: string;
  subject: string;
  message: string;
  time: string;
  read: boolean;
  archived: boolean;
  favorite: boolean;
}

interface NotificationItemMenuProps {
  notification: Notification | null;
  position: { x: number; y: number };
  onClose: () => void;
}

const MENU_WIDTH = 200;
const SCREEN_MARGIN = 16;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const NotificationItemMenu: React.FC<NotificationItemMenuProps> = ({
  notification,
  position,
  onClose,
}) => {
  const { dark, colors } = useTheme();

  if (!notification) return null;

  // Calculate menu position while ensuring it stays on screen
  const rawLeft = position.x - MENU_WIDTH / 2;
  const clampedLeft = Math.min(
    Math.max(rawLeft, SCREEN_MARGIN),
    SCREEN_WIDTH - MENU_WIDTH - SCREEN_MARGIN
  );

  const handleToggleRead = () => {
    // Logic to toggle read status
    console.log(`Toggle read status for notification ${notification.id}`);
    onClose();
  };

  const handleToggleFavorite = () => {
    // Logic to toggle favorite status
    console.log(`Toggle favorite status for notification ${notification.id}`);
    onClose();
  };

  const handleToggleArchive = () => {
    // Logic to toggle archive status
    console.log(`Toggle archive status for notification ${notification.id}`);
    onClose();
  };

  const handleDelete = () => {
    // Logic to delete notification
    console.log(`Delete notification ${notification.id}`);
    onClose();
  };

  return (
    <Modal transparent visible animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View
        style={[
          styles.menuContainer,
          {
            backgroundColor: colors.background,
            borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
            top: position.y,
            left: clampedLeft,
          },
        ]}
      >
        <TouchableOpacity onPress={handleToggleRead} style={styles.menuItem}>
          <Feather
            name={notification.read ? "eye-off" : "eye"}
            size={18}
            style={styles.menuIcon}
            color={COLORS.primary}
          />
          <Text
            style={[
              styles.menuText,
              { color: dark ? COLORS.white : COLORS.greyscale900 },
            ]}
          >
            {notification.read ? "Marquer non lu" : "Marquer lu"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={styles.menuItem}
        >
          <Feather
            name={notification.favorite ? "star" : "star"}
            size={18}
            style={styles.menuIcon}
            color={notification.favorite ? COLORS.greyscale500 : COLORS.primary}
          />
          <Text
            style={[
              styles.menuText,
              { color: dark ? COLORS.white : COLORS.greyscale900 },
            ]}
          >
            {notification.favorite ? "Retirer favori" : "Ajouter favori"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleToggleArchive} style={styles.menuItem}>
          <Feather
            name={notification.archived ? "unlock" : "archive"}
            size={18}
            style={styles.menuIcon}
            color={COLORS.primary}
          />
          <Text
            style={[
              styles.menuText,
              { color: dark ? COLORS.white : COLORS.greyscale900 },
            ]}
          >
            {notification.archived ? "Désarchiver" : "Archiver"}
          </Text>
        </TouchableOpacity>

        <View
          style={[
            styles.divider,
            { backgroundColor: dark ? COLORS.dark3 : COLORS.greyscale300 },
          ]}
        />

        <TouchableOpacity onPress={handleDelete} style={styles.menuItem}>
          <Feather
            name="trash-2"
            size={18}
            style={styles.menuIcon}
            color={COLORS.error}
          />
          <Text style={[styles.menuText, { color: COLORS.error }]}>
            Supprimer
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  menuContainer: {
    position: "absolute",
    width: MENU_WIDTH,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 14,
    fontFamily: "medium",
  },
  divider: {
    height: 1,
    width: "100%",
  },
});

export default NotificationItemMenu;
