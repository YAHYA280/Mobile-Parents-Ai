import React, { useState,  } from "react";
import { FONTS, COLORS } from "@/constants";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-virtualized-view";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

// Mock data
const notificationsData = [
  {
    id: "1",
    subject: "Obtenir une moyenne de 80% en mathématiques",
    type: "Progrès de l'enfant",
    time: "2 min",
    read: false,
  },
  {
    id: "2",
    subject: "Terminer les exercices du Mathématiques",
    type: "Rappels d'objectifs",
    time: "2 min",
    read: false,
  },
  {
    id: "3",
    subject: "Obtenir une moyenne de 80% en mathématiques",
    type: "Progrès de l'enfant",
    time: "20 min",
    read: false,
  },
  {
    id: "4",
    subject: "Nouvelle version de l'application à installer",
    type: "Mises à jour de l'application",
    time: "2 heures",
    read: false,
  },
  {
    id: "5",
    subject: "Abonnement presque épuisé",
    type: "Abonnement",
    time: "1 j",
    read: false,
  },
];

const Notifications = () => {
  const { dark, colors } = useTheme();
  const [activeTab, setActiveTab] = useState("all");
  const [notifications] = useState(notificationsData);

  const unreadCount = notifications.filter((item) => !item.read).length;
  const totalCount = notifications.length;

  const filteredNotifications = activeTab === "all"
    ? notifications
    : notifications.filter((item) => !item.read);

// Header
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.menuButton}>
            <Feather 
              name="menu" 
              size={24} 
              color={dark ? COLORS.white : COLORS.black} 
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              {
                color: dark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Notifications
          </Text>
        </View>
        <TouchableOpacity style={styles.bellButton}>
          <Feather 
            name="bell" 
            size={24} 
            color={COLORS.primary} 
          />
          {unreadCount > 0 && (
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };


  const renderFilterTabs = () => {
    return (
      <View style={styles.tabsWrapper}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[
              styles.tabButton, 
              activeTab === "all" && styles.activeTabButton
            ]}
            onPress={() => setActiveTab("all")}
          >
            {activeTab === "all" ? (
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={styles.activeTabGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.activeTabText}>
                  Tous 
                </Text>
                <View style={styles.activeCountContainer}>
                  <Text style={styles.countText}>{totalCount}</Text>
                </View>
              </LinearGradient>
            ) : (
              <View style={styles.inactiveTabContent}>
                <Text style={styles.tabText}>
                  Tous 
                </Text>
                <View style={styles.inactiveCountContainer}>
                  <Text style={styles.inactiveCountText}>{totalCount}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tabButton, 
              activeTab === "unread" && styles.activeTabButton
            ]}
            onPress={() => setActiveTab("unread")}
          >
            {activeTab === "unread" ? (
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={styles.activeTabGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.activeTabText}>
                  Non lu 
                </Text>
                <View style={styles.activeCountContainer}>
                  <Text style={styles.countText}>{unreadCount}</Text>
                </View>
              </LinearGradient>
            ) : (
              <View style={styles.inactiveTabContent}>
                <Text style={styles.tabText}>
                  Non lu 
                </Text>
                <View style={styles.inactiveCountContainer}>
                  <Text style={styles.inactiveCountText}>{unreadCount}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

// List
  const renderNotificationsList = () => {
    return (
      <View style={styles.notificationsContainer}>
        {filteredNotifications.map((item) => (
          <TouchableOpacity key={item.id} activeOpacity={0.7}>
            <View style={[
              styles.notificationCard,
              { backgroundColor: dark ? COLORS.dark2 : COLORS.white }
            ]}>
              <View style={styles.notificationContent}>
                <Text style={[
                  styles.notificationSubject,
                  { color: dark ? COLORS.white : COLORS.black }
                ]}>
                  {item.subject}
                </Text>
                <View style={[
                  styles.typeContainer, 
                  { backgroundColor: dark ? COLORS.dark3 : COLORS.greyscale100 }
                ]}>
                  <Text style={[
                    styles.notificationType,
                    { color: dark ? COLORS.gray : COLORS.greyscale900 }
                  ]}>
                    {item.type}
                  </Text>
                </View>
              </View>
              
              <View style={styles.notificationMeta}>
                <Text style={styles.notificationTime}>{item.time}</Text>
                {!item.read && <View style={styles.unreadDot} />}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <ScrollView 
          style={[
            styles.scrollView,
            { backgroundColor: dark ? COLORS.dark1 : COLORS.secondaryWhite }
          ]} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderFilterTabs()}
          {renderNotificationsList()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    padding: 4,
    marginRight: 16,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.black,
  },
  bellButton: {
    padding: 8,
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  bellBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: "bold",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  tabsWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondaryWhite,
    borderRadius: 28,
    padding: 4,
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  activeTabButton: {
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  activeTabGradient: {
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveTabContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.tertiaryWhite,
    borderRadius: 24,
  },
  tabText: {
    fontFamily: "medium",
    fontSize: 16,
    color: COLORS.greyscale900,
  },
  activeTabText: {
    fontFamily: "bold",
    fontSize: 16,
    color: COLORS.white,
  },
  activeCountContainer: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "bold",
  },
  inactiveCountContainer: {
    backgroundColor: COLORS.gray,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveCountText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "bold",
  },
  notificationsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notificationCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  notificationContent: {
    flex: 1,
    paddingRight: 12,
  },
  notificationSubject: {
    fontSize: 16,
    fontFamily: "semiBold",
    color: COLORS.black,
    marginBottom: 8,
  },
  typeContainer: {
    backgroundColor: COLORS.greyscale100,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  notificationType: {
    fontSize: 12,
    fontFamily: "medium",
    color: COLORS.greyscale900,
  },
  notificationMeta: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingLeft: 8,
    minWidth: 70,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: "medium",
    color: COLORS.grayscale400,
    marginBottom: 8,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  }
});

export default Notifications;