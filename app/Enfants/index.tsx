// app/Enfants/index.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MotiView } from "moti";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  TYPOGRAPHY,
  COLORS,
  SPACING,
  RADIUS,
  SHADOWS,
} from "@/constants/theme";
import { CHILDREN_DATA } from "@/data/Enfants/CHILDREN_DATA";
import ChildCard from "@/components/cards/ChildCard";

const EnfantsHome = () => {
  const router = useRouter();

  // Navigate to a child's profile
  const handleChildPress = (childId: number) => {
    router.push(`/Enfants/home?childId=${childId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "spring", damping: 18 }}
        style={styles.header}
      >
        <Text style={styles.title}>Mes Enfants</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </MotiView>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500 }}
          style={styles.welcomeCard}
        >
          <Ionicons
            name="information-circle"
            size={24}
            color={COLORS.primary}
            style={styles.infoIcon}
          />
          <Text style={styles.welcomeText}>
            Suivez les activités et performances de vos enfants
          </Text>
        </MotiView>

        {CHILDREN_DATA.map((child, index) => (
          <ChildCard
            key={child.id}
            child={child}
            onPress={() => handleChildPress(child.id)}
            index={index}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: "#333",
  },
  addButton: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.small,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  welcomeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${COLORS.primary}10`,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: RADIUS.lg,
  },
  infoIcon: {
    marginRight: 12,
  },
  welcomeText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.primary,
    flex: 1,
  },
});

export default EnfantsHome;
