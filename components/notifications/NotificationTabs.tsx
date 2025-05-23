import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";

import { getNotificationCounts } from "./NotificationData";

type TabKey = "all" | "unread" | "read" | "favorite" | "archive";

interface NotificationTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const NotificationTabs: React.FC<NotificationTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { dark } = useTheme();

  // Get counts from our data
  const counts = getNotificationCounts();

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "Tous" },
    { key: "unread", label: "Non lu" },
    { key: "read", label: "Lu" },
    { key: "favorite", label: "Favoris" },
    { key: "archive", label: "Archivé" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = counts[tab.key];

          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onTabChange(tab.key)}
              style={[
                styles.tabButton,
                isActive
                  ? [
                      styles.activeTabButton,
                      { backgroundColor: COLORS.primary },
                    ]
                  : [
                      styles.inactiveTabButton,
                      {
                        backgroundColor: dark
                          ? COLORS.dark2
                          : COLORS.greyscale100,
                        borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
                      },
                    ],
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive
                      ? COLORS.white
                      : dark
                        ? COLORS.white
                        : COLORS.greyscale900,
                  },
                ]}
              >
                {tab.label}
              </Text>

              <View
                style={[
                  styles.countBadge,
                  {
                    backgroundColor: isActive
                      ? "rgba(255,255,255,0.3)"
                      : COLORS.gray,
                  },
                ]}
              >
                <Text style={styles.countText}>{count}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 34,
    marginTop: 0,
    marginBottom: 0,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 0,
    marginBottom: 0,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    height: 30,
  },
  activeTabButton: {
    borderColor: COLORS.primary,
  },
  inactiveTabButton: {
    borderColor: COLORS.greyscale300,
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: "medium",
    marginRight: 4,
  },
  countBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  countText: {
    fontSize: 10,
    fontFamily: "medium",
    color: COLORS.white,
  },
});

export default NotificationTabs;
