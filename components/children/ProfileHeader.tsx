import React from "react";
import { MotiView } from "moti";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUser,
  faArrowLeft,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import {
  View,
  Text,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import type { Child } from "@/data/Enfants/CHILDREN_DATA";

interface ProfileHeaderProps {
  child: Child;
  onBackPress: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  child,
  onBackPress,
}) => {
  return (
    <MotiView
      style={styles.container}
      from={{ opacity: 0, translateY: -50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", delay: 200, damping: 15 }}
    >
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent
      />

      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <FontAwesomeIcon icon={faArrowLeft} size={20} color="#333333" />
      </TouchableOpacity>

      <MotiView
        style={styles.profileContent}
        from={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 400, damping: 15 }}
      >
        <MotiView
          style={styles.imageContainer}
          from={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 600, damping: 12 }}
        >
          <Image source={child.profileImage} style={styles.profileImage} />
        </MotiView>

        <MotiView
          style={styles.infoContainer}
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", delay: 800, duration: 400 }}
        >
          <View style={styles.nameRow}>
            <FontAwesomeIcon
              icon={faUser}
              size={16}
              color="#9E9E9E"
              style={styles.icon}
            />
            <Text style={styles.name}>{child.name}</Text>
          </View>

          <View style={styles.detailsRow}>
            <FontAwesomeIcon
              icon={faGraduationCap}
              size={16}
              color="#9E9E9E"
              style={styles.icon}
            />
            <Text style={styles.details}>
              {child.classe} • {child.age} ans
            </Text>
          </View>
        </MotiView>
      </MotiView>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
    zIndex: 10,
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  profileContent: {
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
  },
  imageContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 70,
  },
  infoContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
  },
  details: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666666",
    textAlign: "center",
  },
});

export default ProfileHeader;
