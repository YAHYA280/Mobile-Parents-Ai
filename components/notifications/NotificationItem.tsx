import type { GestureResponderEvent } from "react-native";

import React from "react";
import { Feather } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

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

interface NotificationItemProps {
  notification: Notification;
  formatTimeAgo: (time: string) => string;
  onMenuPress: (notification: Notification, x: number, y: number) => void;
}

// Helper function to get notification icon and color
const getNotificationTypeInfo = (type: string) => {
  switch (type.toLowerCase()) {
    case "message":
      return { icon: "message-circle", color: "#0275d8" };
    case "event":
      return { icon: "calendar", color: "#dc3545" };
    case "progress":
      return { icon: "award", color: "#28a745" };
    case "update":
    case "mises à jour":
      return { icon: "refresh-cw", color: "#fda120" };
    case "rappels":
      return { icon: "bell", color: "#ffa500" };
    case "trophée":
      return { icon: "award", color: "#ffd700" };
    case "conseils":
      return { icon: "info", color: "#17a2b8" };
    default:
      return { icon: "bell", color: COLORS.primary };
  }
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  formatTimeAgo,
  onMenuPress,
}) => {
  const { dark } = useTheme();
  const { icon, color } = getNotificationTypeInfo(notification.type);

  const handleMenuPress = (event: GestureResponderEvent) => {
    // Get the position of the press for the menu
    const { pageX, pageY } = event.nativeEvent;
    onMenuPress(notification, pageX, pageY);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
      ]}
    >
      {/* Left side - Icon and indicator */}
      <View style={styles.leftContainer}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Feather name={icon as any} size={20} color={color} />
        </View>

        {!notification.read && <View style={styles.unreadIndicator} />}
      </View>

      {/* Center - Content */}
      <View style={styles.contentContainer}>
        <Text
          style={[
            styles.subject,
            {
              color: dark ? COLORS.white : COLORS.greyscale900,
              fontWeight: notification.read ? "normal" : "bold",
            },
          ]}
          numberOfLines={1}
        >
          {notification.subject}
        </Text>

        <Text
          style={[
            styles.message,
            { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
          ]}
          numberOfLines={2}
        >
          {notification.message}
        </Text>

        <Text style={styles.time}>{formatTimeAgo(notification.time)}</Text>
      </View>

      {/* Right side - Menu */}
      <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
        <Feather
          name="more-vertical"
          size={20}
          color={dark ? COLORS.greyscale500 : COLORS.greyscale600}
        />
      </TouchableOpacity>

      {/* Status indicators */}
      <View style={styles.statusContainer}>
        {notification.favorite && (
          <Feather
            name="star"
            size={12}
            color="#ffd700"
            style={styles.statusIcon}
          />
        )}
        {notification.archived && (
          <Feather
            name="archive"
            size={12}
            color={COLORS.greyscale500}
            style={styles.statusIcon}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    position: "relative",
  },
  leftContainer: {
    marginRight: 12,
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    position: "absolute",
    top: -4,
    right: -4,
  },
  contentContainer: {
    flex: 1,
    paddingRight: 12,
  },
  subject: {
    fontSize: 16,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
    color: COLORS.grayscale400,
  },
  menuButton: {
    padding: 4,
    alignSelf: "flex-start",
  },
  statusContainer: {
    position: "absolute",
    bottom: 10,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  statusIcon: {
    marginLeft: 8,
  },
});

export default NotificationItem;
