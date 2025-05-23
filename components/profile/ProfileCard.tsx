// components/profile/ProfileCard.tsx
import React from "react";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { COLORS } from "@/constants";

// Function to get first letter of each word
const getInitials = (fullName: string) => {
  return fullName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
};

interface ProfileCardProps {
  name: string;
  email: string;
  phone: string;
  image: any;
  onEditPress: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  email,
  phone,
  image,
  onEditPress,
}) => {
  return (
    <View style={[styles.profileCard, { backgroundColor: COLORS.white }]}>
      <LinearGradient
        colors={[COLORS.primary, "#ff7043"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.profileCardHeader}
      >
        <View style={styles.profileInfo}>
          <View style={styles.profileAvatarContainer}>
            {image ? (
              <Image
                source={image}
                contentFit="cover"
                style={styles.profileAvatar}
              />
            ) : (
              <View style={styles.initialsContainer}>
                <Text style={styles.initialsText}>{getInitials(name)}</Text>
              </View>
            )}
            <View style={styles.profileStatusDot} />
          </View>

          <View style={styles.nameEmailContainer}>
            <Text style={styles.profileName}>{name}</Text>
            <Text style={styles.profileEmail}>{email}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={onEditPress}
        >
          <Ionicons name="create-outline" size={20} color="#FFFFFF" />
          <Text style={styles.editProfileText}>Modifier</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.phoneNumberContainer}>
        <View style={styles.phoneNumberRow}>
          <Ionicons
            name="call-outline"
            size={18}
            color={COLORS.greyscale600}
            style={styles.phoneIcon}
          />
          <Text style={[styles.phoneLabel, { color: COLORS.greyscale600 }]}>
            Numéro de téléphone
          </Text>
        </View>
        <Text style={[styles.phoneValue, { color: COLORS.greyscale900 }]}>
          {phone}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    borderRadius: 16,
    overflow: "hidden",
    margin: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileCardHeader: {
    padding: 16,
    paddingBottom: 20,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileAvatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  profileAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  initialsContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  initialsText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontFamily: "bold",
  },
  profileStatusDot: {
    position: "absolute",
    bottom: 3,
    right: 3,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  nameEmailContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontFamily: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    fontFamily: "medium",
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 8,
  },
  editProfileText: {
    marginLeft: 6,
    color: "#FFFFFF",
    fontFamily: "medium",
    fontSize: 14,
  },
  phoneNumberContainer: {
    padding: 16,
  },
  phoneNumberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  phoneIcon: {
    marginRight: 8,
  },
  phoneLabel: {
    fontSize: 14,
    fontFamily: "medium",
  },
  phoneValue: {
    fontSize: 16,
    fontFamily: "medium",
    marginLeft: 26,
  },
});

export default ProfileCard;
