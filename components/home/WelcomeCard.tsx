import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <LinearGradient
        colors={[COLORS.primary, "#ff8e69"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          <View style={styles.topSection}>
            <View>
              <Text style={styles.welcomeText}>Bienvenue, {userName}</Text>
              <Text style={styles.discountName}>{discountName}</Text>
            </View>
            <Text style={styles.discountValue}>{discount}</Text>
          </View>

          <View style={styles.bottomSection}>
            <Text style={styles.bottomTitle}>{bottomTitle}</Text>
            <Text style={styles.bottomSubtitle}>{bottomSubtitle}</Text>
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
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 16,
    shadowColor: "rgba(255, 142, 105, 0.5)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  innerContainer: {
    padding: 20,
    paddingTop: 24,
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
    marginBottom: 6,
  },
  discountName: {
    color: "#FFFFFF",
    fontSize: 22,
    fontFamily: "bold",
  },
  discountValue: {
    color: "#FFFFFF",
    fontSize: 42,
    fontFamily: "bold",
  },
  bottomSection: {
    marginBottom: 10,
  },
  bottomTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 4,
  },
  bottomSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontFamily: "regular",
  },
});

export default WelcomeCard;
