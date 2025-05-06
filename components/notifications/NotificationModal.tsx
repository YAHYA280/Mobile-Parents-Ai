import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants";

const { width, height } = Dimensions.get("window");

type TabType = "all" | "unread" | "read";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "achievement",
    title: "Félicitations !",
    message:
      "Thomas a terminé ses exercices de mathématiques avec un score de 85%",
    time: "2h",
    read: false,
  },
  {
    id: "2",
    type: "reminder",
    title: "Rappel",
    message: "Marie a un devoir de français à rendre demain",
    time: "3h",
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "Nouveau contenu",
    message:
      "De nouveaux exercices de sciences sont disponibles pour vos enfants",
    time: "6h",
    read: true,
  },
  {
    id: "4",
    type: "achievement",
    title: "Nouveau niveau !",
    message: "Marie a atteint le niveau 3 en anglais",
    time: "1j",
    read: true,
  },
  {
    id: "5",
    type: "reminder",
    title: "Rappel",
    message:
      "Le prochain rendez-vous avec le professeur est prévu pour vendredi",
    time: "2j",
    read: true,
  },
];

const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  onClose,
  onMarkAllAsRead,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);

  // Filter notifications based on the active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    if (activeTab === "read") return notification.read;
    return true;
  });

  // Function to mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Function to mark all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({ ...notification, read: true }))
    );
    if (onMarkAllAsRead) onMarkAllAsRead();
  };

  // Function to get the icon for the notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "achievement":
        return { name: "trophy", color: "#FFC107" };
      case "reminder":
        return { name: "alert-circle", color: "#F44336" };
      case "info":
        return { name: "info", color: "#2196F3" };
      default:
        return { name: "bell", color: COLORS.primary };
    }
  };

  // Render a single notification item
  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const iconInfo = getNotificationIcon(item.type);

    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          item.read ? styles.readNotification : styles.unreadNotification,
        ]}
        onPress={() => markAsRead(item.id)}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${iconInfo.color}15` },
          ]}
        >
          <Feather
            name={iconInfo.name as any}
            size={20}
            color={iconInfo.color}
          />
        </View>

        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationTime}>{item.time}</Text>
          </View>

          <Text style={styles.notificationMessage}>{item.message}</Text>
        </View>

        {!item.read && <View style={styles.unreadIndicator} />}
      </TouchableOpacity>
    );
  };

  // Render empty state when no notifications match the filter
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Feather name="bell-off" size={40} color={"rgba(0,0,0,0.2)"} />
      <Text style={styles.emptyText}>
        {activeTab === "unread"
          ? "Aucune notification non lue"
          : activeTab === "read"
            ? "Aucune notification lue"
            : "Aucune notification"}
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notifications</Text>
          </View>

          <TouchableOpacity
            style={styles.markAllButton}
            onPress={handleMarkAllAsRead}
          >
            <Text style={styles.markAllText}>Tout marquer comme lu</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "all" && styles.activeTab]}
            onPress={() => setActiveTab("all")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "all" && styles.activeTabText,
              ]}
            >
              Tous ({notifications.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "unread" && styles.activeTab]}
            onPress={() => setActiveTab("unread")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "unread" && styles.activeTabText,
              ]}
            >
              Non lus ({notifications.filter((n) => !n.read).length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "read" && styles.activeTab]}
            onPress={() => setActiveTab("read")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "read" && styles.activeTabText,
              ]}
            >
              Lus ({notifications.filter((n) => n.read).length})
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notificationsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  closeButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: "#333",
  },
  markAllButton: {
    padding: 8,
  },
  markAllText: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.primary,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: "medium",
    color: "#666",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  notificationsList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 80, // Extra padding at the bottom for better scrolling
  },
  notificationItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginVertical: 6,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    position: "relative",
  },
  readNotification: {
    opacity: 0.8,
  },
  unreadNotification: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: "bold",
    color: "#333",
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: "regular",
    color: "#888",
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: "regular",
    color: "#666",
    lineHeight: 20,
  },
  unreadIndicator: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "medium",
    color: "#888",
    marginTop: 16,
  },
});

export default NotificationModal;
