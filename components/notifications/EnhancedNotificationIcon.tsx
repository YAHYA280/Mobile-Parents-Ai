import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import NotificationModal from "./NotificationModal";
import { getNotificationCounts } from "./NotificationData";

interface NotificationIconProps {
  onPress?: () => void;
  size?: number;
  showCount?: boolean;
}

const EnhancedNotificationIcon: React.FC<NotificationIconProps> = ({
  onPress,
  size = 24,
  showCount = true,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  // Get the unread count from notification data
  const unreadCount = getNotificationCounts().unread;

  // Animation for notification pulse
  useEffect(() => {
    if (unreadCount > 0) {
      const pulseSequence = Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]);

      Animated.loop(pulseSequence).start();
    } else {
      // Reset animation when no notifications
      pulseAnim.setValue(1);
    }

    return () => {
      pulseAnim.stopAnimation();
    };
  }, [unreadCount, pulseAnim]);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      setModalVisible(true);
    }
  };

  const badgeScale = unreadCount > 0 ? pulseAnim : 1;

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.iconBg}>
          <Ionicons name="notifications" size={size} color="#FFFFFF" />
        </View>

        {showCount && unreadCount > 0 && (
          <Animated.View
            style={[styles.badge, { transform: [{ scale: badgeScale }] }]}
          >
            <Text style={styles.badgeText}>
              {unreadCount > 9 ? "9+" : unreadCount}
            </Text>
          </Animated.View>
        )}
      </TouchableOpacity>

      <NotificationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    zIndex: 1,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default EnhancedNotificationIcon;
