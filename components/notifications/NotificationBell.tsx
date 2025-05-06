import type { ViewStyle } from "react-native";

import { COLORS } from "@/constants";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import NotificationModal from "./NotificationModal";
import { getNotificationCounts } from "./NotificationData";

interface NotificationBellProps {
  style?: ViewStyle;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ style }) => {
  const { dark } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Get the unread count from our notification data
  const unreadCount = getNotificationCounts().unread;

  return (
    <>
      <TouchableOpacity
        style={[styles.bellContainer, style]}
        onPress={() => setIsModalVisible(true)}
      >
        <View style={styles.bellIconWrapper}>
          <Ionicons
            name="notifications"
            size={24}
            color={dark ? COLORS.white : COLORS.greyscale900}
          />

          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <NotificationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  bellContainer: {
    position: "relative",
    padding: 8,
  },
  bellIconWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "white",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default NotificationBell;
