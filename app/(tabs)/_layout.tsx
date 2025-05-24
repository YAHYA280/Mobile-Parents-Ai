import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Paths } from "@/navigation";

import { COLORS } from "../../constants";

const TabLayout = () => {
  const insets = useSafeAreaInsets();

  const tabBarBackground = COLORS.white;
  const activeIconColor = COLORS.primary;
  const inactiveIconColor = "rgba(0,0,0,0.4)";

  const bottomMargin =
    Platform.OS === "ios"
      ? Math.max(20, insets.bottom)
      : Math.max(30, insets.bottom + 15);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: Platform.OS !== "ios",
        tabBarStyle: {
          position: "absolute",
          height: Platform.OS === "ios" ? 80 : 75,
          paddingBottom:
            Platform.OS === "ios" ? Math.max(insets.bottom, 10) : 10,
          paddingTop: 10,
          backgroundColor: tabBarBackground,

          marginHorizontal: 20,
          marginBottom: bottomMargin,
          borderRadius: 30,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.08)",

          elevation: 10,
          shadowColor: COLORS.primary,
          shadowOpacity: 0.2,
          shadowOffset: { height: 8, width: 0 },
          shadowRadius: 14,
        },
        tabBarItemStyle: {
          borderTopWidth: 0,
          paddingTop: 5,
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
    >
      <Tabs.Screen
        name={Paths.Index}
        options={{
          title: "Accueil",
          tabBarIcon: ({ focused, color }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Enfants"
        options={{
          title: "Enfants",
          tabBarIcon: ({ focused, color }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Ionicons
                name={focused ? "people" : "people-outline"}
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name={Paths.Support}
        options={{
          title: "Support",
          tabBarIcon: ({ focused, color }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Ionicons
                name={focused ? "chatbubble" : "chatbubble-outline"}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name={Paths.Profil}
        options={{
          title: "Profil",
          tabBarIcon: ({ focused, color }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  activeIconContainer: {
    backgroundColor: `${COLORS.primary}15`,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -5,
  },
});

export default TabLayout;
