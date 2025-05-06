import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import NotificationModal from "../notifications/NotificationModal";
import { getNotificationCounts } from "../notifications/NotificationData";

interface NotificationIconProps {
  onPress: () => void;
  hasNotification?: boolean;
  count?: number;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({
  onPress,
  hasNotification = false,
  count: propCount = 0,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Get the unread count from our notification data
  const unreadCount = propCount || getNotificationCounts().unread;

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

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Ionicons name="notifications" size={26} color={COLORS.primary} />

        {(hasNotification || unreadCount > 0) && (
          <View style={styles.badge}>
            {unreadCount > 0 && (
              <View style={styles.badgeCountContainer}>
                <Text style={styles.badgeCount}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>

      <NotificationModal visible={modalVisible} onClose={handleCloseModal} />
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
