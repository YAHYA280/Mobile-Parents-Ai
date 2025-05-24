import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { COLORS } from "@/constants";

import NotificationItem from "./NotificationItem";
// Mock data - in a real app, this would come from a context or API
import { notificationsData } from "./NotificationData";
import NotificationItemMenu from "./NotificationItemMenu";

type TabKey = "all" | "unread" | "read" | "favorite" | "archive";

interface Notification {
  id: string;
  type: string;
  subject: string;
  message: string;
  time: string;
  read: boolean;
  archived: boolean;
  favorite: boolean;
}

interface NotificationListProps {
  searchQuery: string;
  activeTab: TabKey;
}

const NotificationList: React.FC<NotificationListProps> = ({
  searchQuery,
  activeTab,
}) => {
  const [selectedItem, setSelectedItem] = useState<Notification | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Filter notifications based on tab and search query
  const filteredNotifications = notificationsData.filter((notification) => {
    // Filter by tab
    if (activeTab === "unread" && notification.read) return false;
    if (activeTab === "read" && !notification.read) return false;
    if (activeTab === "favorite" && !notification.favorite) return false;
    if (activeTab === "archive" && !notification.archived) return false;

    // Filter by search query
    if (
      searchQuery &&
      !notification.subject.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Pagination
  const paginatedNotifications = filteredNotifications.slice(
    0,
    page * pageSize
  );
  const hasMorePages =
    filteredNotifications.length > paginatedNotifications.length;

  const handleRefresh = () => {
    setRefreshing(true);
    // In a real app, you'd fetch new data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleLoadMore = () => {
    if (hasMorePages) {
      setPage(page + 1);
    }
  };

  const handleMenuPress = (
    notification: Notification,
    x: number,
    y: number
  ) => {
    setSelectedItem(notification);
    setMenuPosition({ x, y });
  };

  const formatTimeAgo = (timeStr: string) => {
    // This is a simple mock implementation
    const v = parseInt(timeStr.split(" ")[0], 10);
    if (timeStr.includes("min")) return `Il y a ${v} minute${v > 1 ? "s" : ""}`;
    if (timeStr.includes("h")) return `Il y a ${v} heure${v > 1 ? "s" : ""}`;
    if (timeStr.includes("j")) return `Il y a ${v} jour${v > 1 ? "s" : ""}`;
    if (timeStr.includes("sem"))
      return `Il y a ${v} semaine${v > 1 ? "s" : ""}`;
    return timeStr;
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: COLORS.greyscale900 }]}>
        Aucune notification trouvée
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!hasMorePages) return null;

    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={paginatedNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            formatTimeAgo={formatTimeAgo}
            onMenuPress={handleMenuPress}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyList}
        ListFooterComponent={renderFooter}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />

      <NotificationItemMenu
        notification={selectedItem}
        position={menuPosition}
        onClose={() => setSelectedItem(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "medium",
    textAlign: "center",
  },
  footerContainer: {
    paddingVertical: 16,
    alignItems: "center",
  },
});

export default NotificationList;
