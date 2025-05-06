import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import NotificationModal from "./NotificationModal";

interface NotificationIconProps {
  onPress: () => void;
  hasNotification?: boolean;
  count?: number;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({
  onPress,
  hasNotification = false,
  count = 0,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleMarkAllAsRead = () => {
    // This function would typically update your notification state globally
    console.log("Marked all notifications as read");
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Ionicons name="notifications" size={26} color={COLORS.primary} />

        {hasNotification && (
          <View style={styles.badge}>
            {count > 0 && (
              <View style={styles.badgeCountContainer}>
                <Text style={styles.badgeCount}>
                  {count > 9 ? "9+" : count}
                </Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>

      <NotificationModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 142, 105, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.error,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  badgeCountContainer: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.error,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  badgeCount: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default NotificationIcon;
