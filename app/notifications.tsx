import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { FONTS, COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
// Import notification components
import {
  NotificationList,
  NotificationTabs,
  NotificationSearch,
  NotificationHeaderMenu,
} from "@/components/notifications";

type TabKey = "all" | "unread" | "read" | "favorite" | "archive";
type Nav = { navigate: (value: string) => void };

export default function Notifications() {
  const navigation = useNavigation();
  const { dark, colors } = useTheme();
  const { navigate } = useNavigation<Nav>();

  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [headerMenuVisible, setHeaderMenuVisible] = useState(false);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
  };

  const toggleHeaderMenu = () => {
    setHeaderMenuVisible((prev) => !prev);
  };

  const handleMarkAllAsRead = () => {
    // Logic to mark all as read would go here
    console.log("Mark all as read");
    toggleHeaderMenu();
  };

  const handleDeleteAll = () => {
    // Logic to delete all would go here
    console.log("Delete all");
    toggleHeaderMenu();
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather
            name="arrow-left"
            size={24}
            color={dark ? COLORS.white : COLORS.black}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: dark ? COLORS.white : COLORS.black },
          ]}
        >
          Notifications
        </Text>
      </View>

      <NotificationHeaderMenu
        visible={headerMenuVisible}
        onToggle={toggleHeaderMenu}
        onClose={() => setHeaderMenuVisible(false)}
      />
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {renderHeader()}

      {/* Search */}
      <NotificationSearch value={searchQuery} onChangeText={setSearchQuery} />

      {/* Tabs */}
      <NotificationTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Notification List */}
      <NotificationList searchQuery={searchQuery} activeTab={activeTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale200,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    ...FONTS.h2,
    fontWeight: "600",
  },
});
