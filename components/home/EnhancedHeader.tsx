import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { COLORS, icons } from "@/constants";
import NotificationIcon from "../notifications/NotificationIcon";

interface EnhancedHeaderProps {
  userName: string;
  userImage: any;
  onNotificationPress: () => void;
  onProfilePress: () => void;
}

const EnhancedHeader: React.FC<EnhancedHeaderProps> = ({
  userName,
  userImage,
  onNotificationPress,
  onProfilePress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <TouchableOpacity
          onPress={onProfilePress}
          style={styles.avatarContainer}
        >
          <Image source={userImage} style={styles.avatar} contentFit="cover" />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Bonjour,</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <NotificationIcon
          onPress={onNotificationPress}
          hasNotification={true}
        />
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
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    backgroundColor: "#FFFFFF",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  },
});

export default EnhancedHeader;
