import React, { useState } from "react";
import { FONTS, COLORS } from "@/constants";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import NotificationList from "./NotificationList";
import NotificationTabs from "./NotificationTabs";
import NotificationSearch from "./NotificationSearch";
import NotificationHeaderMenu from "./NotificationHeaderMenu";

type TabKey = "all" | "unread" | "read" | "favorite" | "archive";

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  onClose,
}) => {
  const { dark, colors } = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [headerMenuVisible, setHeaderMenuVisible] = useState(false);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
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
            onToggle={() => setHeaderMenuVisible(!headerMenuVisible)}
            onClose={() => setHeaderMenuVisible(false)}
          />
        </View>

        {/* Search */}
        <NotificationSearch value={searchQuery} onChangeText={setSearchQuery} />

        <NotificationTabs activeTab={activeTab} onTabChange={handleTabChange} />

        <NotificationList searchQuery={searchQuery} activeTab={activeTab} />
      </SafeAreaView>
    </Modal>
  );
};

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

export default NotificationModal;
