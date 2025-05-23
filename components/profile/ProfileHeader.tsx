import type { NavigationProp } from "@react-navigation/native";

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { COLORS } from "@/constants";

import NotificationBell from "../notifications/NotificationBell";

interface ProfileHeaderProps {
  navigation: NavigationProp<any>;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ navigation }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <Text style={[styles.headerTitle, { color: COLORS.greyscale900 }]}>
          Profil
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("notifications")}>
          <NotificationBell />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomColor: "rgba(0,0,0,0.05)",
    borderBottomWidth: 0,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "bold",
  },
});

export default ProfileHeader;
