// app/Enfants/[id]/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

export default function ChildTabsLayout() {
  // No context usage at all to avoid any potential circular dependencies
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#757575",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "rgba(0,0,0,0.1)",
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: "#FFFFFF",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="apercu"
        options={{
          title: "Aperçu",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="activites"
        options={{
          title: "Activités",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="suivi"
        options={{
          title: "Suivi",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
