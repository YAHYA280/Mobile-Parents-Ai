import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, TYPOGRAPHY, RADIUS } from "@/constants/theme";
import { useTheme } from "@/theme/ThemeProvider";
import { MotiView } from "moti";

interface ChildCardProps {
  id: number;
  name: string;
  age?: number;
  progress: string | number;
  avatar?: string;
  onPress: () => void;
  index?: number;
}

const ChildCard: React.FC<ChildCardProps> = ({
  id,
  name,
  age,
  progress,
  avatar,
  onPress,
  index = 0,
}) => {
  const { dark } = useTheme();

  // Parse progress to number if it's a string
  const progressValue =
    typeof progress === "string"
      ? parseInt(progress.replace("%", ""))
      : progress;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: "spring",
        delay: index * 100,
        damping: 18,
      }}
    >
      <TouchableOpacity
        style={[
          styles.container,
          { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View
                style={[
                  styles.avatarPlaceholder,
                  { backgroundColor: COLORS.primary },
                ]}
              >
                <Text style={styles.avatarText}>{name.charAt(0)}</Text>
              </View>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text
              style={[
                styles.name,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {name}
            </Text>

            {age && (
              <Text
                style={[
                  styles.age,
                  { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                ]}
              >
                {age} ans
              </Text>
            )}
          </View>

          <Ionicons
            name="chevron-forward"
            size={24}
            color={dark ? COLORS.secondaryWhite : COLORS.gray3}
          />
        </View>

        <View style={styles.progressSection}>
          <View
            style={[
              styles.progressBarContainer,
              {
                backgroundColor: dark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
          >
            <View
              style={[
                styles.progressBar,
                { width: `${progressValue}%`, backgroundColor: COLORS.primary },
              ]}
            />
          </View>

          <Text style={[styles.progressText, { color: COLORS.primary }]}>
            {typeof progress === "string" ? progress : `${progress}%`}
          </Text>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    ...TYPOGRAPHY.h3,
    fontWeight: "bold",
    marginBottom: 4,
  },
  age: {
    ...TYPOGRAPHY.body2,
  },
  progressSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    ...TYPOGRAPHY.subtitle2,
    fontWeight: "bold",
  },
});

export default ChildCard;
