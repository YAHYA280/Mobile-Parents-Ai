/* eslint-disable react/no-unused-prop-types */
import React from "react";
import { Image } from "expo-image";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { COLORS } from "@/constants";

import NotificationBell from "../../components/notifications/NotificationBell";

interface EnhancedHeaderProps {
  userName: string;
  userImage: any;
  onNotificationPress: () => void;
  onProfilePress: () => void;
}

const EnhancedHeader: React.FC<EnhancedHeaderProps> = ({
  userName,
  userImage,
  onProfilePress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <View style={styles.avatarWrapper}>
          <TouchableOpacity
            onPress={onProfilePress}
            style={styles.avatarContainer}
          >
            <Image
              source={userImage}
              style={styles.avatar}
              contentFit="cover"
            />
          </TouchableOpacity>
          <View style={styles.statusIndicator} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Bonjour,</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <NotificationBell />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: {
    position: "relative",
    width: 48,
    height: 48,
  },
  avatarContainer: {
    height: 48,
    width: 48,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  statusIndicator: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    bottom: -1,
    right: 0,
    zIndex: 1,
  },
  textContainer: {
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "regular",
  },
  userName: {
    fontSize: 18,
    fontFamily: "bold",
    color: "#333",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});

export default EnhancedHeader;
