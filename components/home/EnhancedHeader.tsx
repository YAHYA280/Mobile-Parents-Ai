import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { COLORS, icons } from "@/constants";
import NotificationIcon from "../notifications/NotificationIcon";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

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
          <View style={styles.statusIndicator} />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Bonjour,</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.settingsButton} onPress={() => {}}>
          <Ionicons name="settings-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
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
    position: "relative",
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
    bottom: 0,
    right: 0,
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EnhancedHeader;
