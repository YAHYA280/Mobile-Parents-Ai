// components/aicalendar/AIInfoCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";

const AIInfoCard: React.FC = () => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", damping: 15, delay: 200 }}
      style={styles.container}
    >
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Ionicons name="bulb-outline" size={28} color="#FFFFFF" />
          <View style={styles.textContainer}>
            <Text style={styles.title}>Intelligence Artificielle</Text>
            <Text style={styles.subtitle}>
              Suggestions personnalisées basées sur les progrès et préférences
              de vos enfants
            </Text>
          </View>
        </View>
      </LinearGradient>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  gradient: {
    padding: 16,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "regular",
    color: "rgba(255,255,255,0.9)",
    lineHeight: 18,
  },
});

export default AIInfoCard;
