/* eslint-disable react/prop-types */
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

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
  const [pulseAnim] = useState(new Animated.Value(1));

  // Get the unread count from our notification data
  const unreadCount = propCount || getNotificationCounts().unread;

  // Animation for notification pulse
  React.useEffect(() => {
    if (unreadCount > 0) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();

      return () => {
        animation.stop();
      };
    }

    pulseAnim.setValue(1);
    return () => {}; // Return cleanup function even when no animation
  }, [unreadCount, pulseAnim]);

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
    } else {
      setModalVisible(true);
    }
  }, [onPress]);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const badgeScale = unreadCount > 0 ? pulseAnim : 1;

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Ionicons name="notifications" size={24} color={COLORS.primary} />

        {(hasNotification || unreadCount > 0) && (
          <Animated.View
            style={[styles.badge, { transform: [{ scale: badgeScale }] }]}
          >
            {unreadCount > 0 && (
              <View style={styles.badgeCountContainer}>
                <Text style={styles.badgeCount}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Text>
              </View>
            )}
          </Animated.View>
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
    shadowColor: "rgba(255, 142, 105, 0.5)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
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
    top: -6,
    right: -6,
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
