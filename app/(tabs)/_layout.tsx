import React from "react";
import { Tabs } from "expo-router";
import { Paths } from "@/navigation";
import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../constants";

// Clean Tab Bar component with better icons and NO borders
const TabLayout = () => {
  const { dark } = useTheme();
  const insets = useSafeAreaInsets();

  // Generate styles based on theme
  const tabBarBackground = dark ? COLORS.dark1 : COLORS.white;
  const activeIconColor = COLORS.primary;
  const inactiveIconColor = dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: Platform.OS !== "ios",
        // Completely override all styles that might create borders
        tabBarStyle: {
          position: "absolute",
          height: Platform.OS === "ios" ? 78 : 55,
          paddingBottom: Platform.OS === "ios" ? insets.bottom : 8,
          backgroundColor: tabBarBackground,
          borderTopWidth: 0,
          borderWidth: 0,
          borderColor: "transparent",
          borderTopColor: "transparent",
          elevation: 0,
          shadowColor: "transparent",
          shadowOpacity: 0,
          shadowOffset: { height: 0, width: 0 },
          shadowRadius: 0,
        },
        tabBarItemStyle: {
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "medium",
          marginTop: 0,
          marginBottom: 5,
        },
        tabBarActiveTintColor: activeIconColor,
        tabBarInactiveTintColor: inactiveIconColor,
      }}
      // Adding a sceneContainerStyle to ensure no margins/padding around screens
    >
      <Tabs.Screen
        name={Paths.Index}
        options={{
          title: "Accueil",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Enfants"
        options={{
          title: "Enfants",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name={Paths.Support}
        options={{
          title: "Support",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "chatbubble" : "chatbubble-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name={Paths.Profil}
        options={{
          title: "Profil",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
