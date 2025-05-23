import React from "react";
import { Feather, FontAwesome } from "@expo/vector-icons";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import { COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";

interface NotificationHeaderMenuProps {
  visible: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const NotificationHeaderMenu: React.FC<NotificationHeaderMenuProps> = ({
  visible,
  onToggle,
  onClose,
}) => {
  const { dark, colors } = useTheme();

  const handleMarkAllAsRead = () => {
    // Logic to mark all as read
    console.log("Mark all as read");
    onClose();
  };

  const handleDeleteAll = () => {
    // Logic to delete all
    console.log("Delete all");
    onClose();
  };

  return (
    <>
      <TouchableOpacity onPress={onToggle} style={styles.menuButton}>
        <FontAwesome
          name="ellipsis-v"
          size={20}
          color={dark ? COLORS.white : COLORS.black}
        />
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.menuContainer,
            {
              backgroundColor: colors.background,
              borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
            },
          ]}
        >
          <TouchableOpacity
            onPress={handleMarkAllAsRead}
            style={styles.menuItem}
          >
            <Feather
              name="check"
              size={18}
              style={styles.menuIcon}
              color={COLORS.primary}
            />
            <Text
              style={[
                styles.menuText,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Tout marquer comme lu
            </Text>
          </TouchableOpacity>

          <View
            style={[
              styles.divider,
              { backgroundColor: dark ? COLORS.dark3 : COLORS.greyscale300 },
            ]}
          />

          <TouchableOpacity onPress={handleDeleteAll} style={styles.menuItem}>
            <Feather
              name="trash-2"
              size={18}
              style={styles.menuIcon}
              color={COLORS.error}
            />
            <Text style={[styles.menuText, { color: COLORS.error }]}>
              Tout supprimer
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  menuContainer: {
    position: "absolute",
    top: 60,
    right: 16,
    width: 230,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 15,
    fontFamily: "medium",
  },
  divider: {
    height: 1,
    width: "100%",
  },
});

export default NotificationHeaderMenu;
