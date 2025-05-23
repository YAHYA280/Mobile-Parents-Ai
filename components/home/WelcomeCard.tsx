import React from "react";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import { COLORS } from "@/constants";

const { width } = Dimensions.get("window");

interface WelcomeCardProps {
  userName: string;
  discount: string;
  discountName: string;
  bottomTitle: string;
  bottomSubtitle: string;
  onPress: () => void;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({
  userName,
  discount,
  discountName,
  bottomTitle,
  bottomSubtitle,
  onPress,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.95} onPress={onPress}>
      <LinearGradient
        colors={[COLORS.primary, "#ff7043"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Decorative elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        <View style={styles.decorativeCircle3} />

        <View style={styles.innerContainer}>
          <View style={styles.topSection}>
            <View>
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 500 }}
              >
                <Text style={styles.welcomeText}>Bienvenue, {userName}</Text>
              </MotiView>
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 500, delay: 100 }}
              >
                <Text style={styles.discountName}>{discountName}</Text>
              </MotiView>
            </View>
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <View style={styles.discountBadge}>
                <Text style={styles.discountValue}>{discount}</Text>
                <Text style={styles.discountOff}>off</Text>
              </View>
            </MotiView>
          </View>

          <View style={styles.divider} />

          <View style={styles.bottomSection}>
            <View>
              <Text style={styles.bottomTitle}>{bottomTitle}</Text>
              <Text style={styles.bottomSubtitle}>{bottomSubtitle}</Text>
            </View>
            <View style={styles.arrowContainer}>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    marginHorizontal: 16,
    borderRadius: 24,
    overflow: "hidden",
    marginTop: 16,
    shadowColor: "rgba(255, 112, 67, 0.6)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    position: "relative",
  },
  decorativeCircle1: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    top: -50,
    right: -30,
  },
  decorativeCircle2: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    bottom: -20,
    left: 30,
  },
  decorativeCircle3: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    top: 30,
    left: -10,
  },
  innerContainer: {
    padding: 24,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  welcomeText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
    fontFamily: "medium",
    marginBottom: 8,
  },
  discountName: {
    color: "#FFFFFF",
    fontSize: 22,
    fontFamily: "bold",
    letterSpacing: 0.5,
  },
  discountBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  discountValue: {
    color: "#FFFFFF",
    fontSize: 28,
    fontFamily: "bold",
    lineHeight: 32,
  },
  discountOff: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontFamily: "medium",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 20,
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 6,
  },
  bottomSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontFamily: "regular",
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default WelcomeCard;
