import type { ListRenderItemInfo } from "react-native";

import React, { useState } from "react";
import { FONTS, COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Modal,
  FlatList,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

interface Notification {
  id: string;
  type: string;
  subject: string;
  time: string;
  read: boolean;
  archived: boolean;
  favorite: boolean;
}

type TabKey = "all" | "unread" | "read" | "favorite" | "archive";

const notificationsData: Notification[] = [
  { id: "1",  type: "Progrès de l'enfant", subject: "Vous avez atteint 80% de progrès en mathématiques.", time: "2 min", read: false, archived: false, favorite: false },
  { id: "2",  type: "Rappels d'objectifs", subject: "N'oubliez pas de terminer les exercices de maths d'aujourd'hui.", time: "5 min", read: true, archived: false, favorite: false },
  { id: "3",  type: "Rappels d'objectifs", subject: "Nouveau défi : Géométrie disponible dans votre profil.", time: "12 min", read: false, archived: false, favorite: true },
  { id: "4",  type: "Mises à jour",        subject: "La version 2.3.0 a été publiée ce matin.", time: "45 min", read: false, archived: true, favorite: false },
  { id: "5",  type: "Abonnement",          subject: "Votre abonnement expire dans 24 heures.", time: "1 h",   read: false, archived: false, favorite: false },
  { id: "6",  type: "Rappels d'objectifs", subject: "Vous êtes à 5 000 XP pour débloquer le prochain niveau.", time: "2 h",   read: true, archived: false, favorite: false },
  { id: "7",  type: "Progrès de l'enfant", subject: "Chapitre 4 complété ! Félicitations.", time: "3 h",   read: true, archived: false, favorite: true  },
  { id: "8",  type: "Conseils",            subject: "Astuce : pratiquez 15 minutes par jour pour consolider vos compétences.", time: "4 h",   read: false, archived: false, favorite: false },
  { id: "9",  type: "Abonnement",          subject: "Paiement de renouvellement effectué avec succès.", time: "5 h",   read: true, archived: true,  favorite: false },
  { id: "10", type: "Mises à jour",        subject: "Patch de sécurité appliqué sur votre compte.", time: "6 h",   read: true, archived: true,  favorite: false },
  { id: "11", type: "Récompenses",         subject: "Vous avez reçu le badge « Achiever ».", time: "8 h",   read: false, archived: false, favorite: false },
  { id: "12", type: "Rappels d'objectifs", subject: "Pensez à réviser avant votre test de demain.", time: "12 h",  read: true, archived: false, favorite: false },
  { id: "13", type: "Abonnement",          subject: "Votre essai Premium se termine bientôt.", time: "18 h",  read: false, archived: false, favorite: true  },
  { id: "14", type: "Mises à jour",        subject: "Maintenance prévue demain à 02 h00.", time: "22 h",  read: true, archived: true,  favorite: false },
  { id: "15", type: "Mises à jour",        subject: "10 nouveaux badges disponibles.", time: "1 j",   read: false, archived: false, favorite: false },
  { id: "16", type: "Progrès de l'enfant", subject: "Score hebdomadaire : 92 %.", time: "1 j",   read: true, archived: false, favorite: false },
  { id: "17", type: "Événements",          subject: "Webinaire gratuit le 25 avril.", time: "2 j",   read: false, archived: false, favorite: false },
  { id: "18", type: "Abonnement",          subject: "Votre abonnement a été renouvelé.", time: "2 j",   read: true, archived: true,  favorite: false },
  { id: "19", type: "Récompenses",         subject: "Félicitations ! Vous avez gagné le badge « Champion ».", time: "3 j", read: false, archived: false, favorite: true  },
  { id: "20", type: "Mises à jour",        subject: "Nouveau mode hors‑ligne disponible.", time: "3 j",   read: false, archived: false, favorite: false },
  { id: "21", type: "Support",             subject: "Votre ticket de support a été résolu.", time: "4 j",   read: true, archived: false, favorite: false },
  { id: "22", type: "Progrès de l'enfant", subject: "100 % au dernier quiz ! Bravo.", time: "4 j",   read: false, archived: false, favorite: true  },
  { id: "23", type: "Rappels d'objectifs", subject: "Test de niveau disponible cette semaine.", time: "5 j", read: false, archived: false, favorite: false },
  { id: "24", type: "Abonnement",          subject: "Crédit remboursé sur votre compte.", time: "5 j",   read: true, archived: true,  favorite: false },
  { id: "25", type: "Abonnement",          subject: "Promo 20 % sur l'abonnement annuel.", time: "1 sem", read: false, archived: false, favorite: false },
];

const MENU_WIDTH = 200;    // match whatever width you use
const SCREEN_MARGIN = 8;   // minimum gap from screen edges
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const pageSize = 10;



type Nav = {
  navigate: (value: string) => void;
};

export default function Notifications() {
  const navigation = useNavigation();
  const { dark, colors } = useTheme();
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const { navigate } = useNavigation<Nav>();

  const [notifications, setNotifications] = useState<Notification[]>(notificationsData);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<Notification | null>(null);
  const rawLeft = menuPosition.x - MENU_WIDTH / 2;
const clampedLeft = Math.min(
  Math.max(rawLeft, SCREEN_MARGIN),
  SCREEN_WIDTH - MENU_WIDTH - SCREEN_MARGIN
);
  const [page, setPage] = useState(1);
  const [headerMenuVisible, setHeaderMenuVisible] = useState(false);

  const toggleHeaderMenu = () => setHeaderMenuVisible(v => !v);
  const updateItem = (id: string, changes: Partial<Notification>) => {
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, ...changes } : n));
    setSelectedItem(null);
  };

  const counts: Record<TabKey, number> = {
    all: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    read: notifications.filter(n => n.read).length,
    favorite: notifications.filter(n => n.favorite).length,
    archive: notifications.filter(n => n.archived).length,
  };

  const filtered = notifications.filter(n => {
    if (activeTab === "unread" && n.read) return false;
    if (activeTab === "read" && !n.read) return false;
    if (activeTab === "favorite" && !n.favorite) return false;
    if (activeTab === "archive" && !n.archived) return false;
    if (search && !n.subject.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.actionButton}
      >
        <Feather
          name="arrow-left"
          size={24}
          color={dark ? COLORS.white : COLORS.black}
        />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: dark ? COLORS.white : COLORS.black }]}>
        Notifications
      </Text>
    </View>
    <TouchableOpacity onPress={toggleHeaderMenu} style={styles.actionButton}>
      <FontAwesome name="ellipsis-v" size={20} color={dark ? COLORS.white : COLORS.black} />
    </TouchableOpacity>
      <Modal transparent visible={headerMenuVisible} animationType="fade">
        <TouchableWithoutFeedback onPress={toggleHeaderMenu}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={[styles.headerMenuContainer, { backgroundColor: colors.background }]}>
          <TouchableOpacity
            onPress={() => { updateItem("all", { read: true }); toggleHeaderMenu(); }}
            style={styles.headerMenuItem}
          >
            <FontAwesome name="check" size={16} style={styles.menuIcon} />
            <Text style={styles.menuText}>Tout marquer comme lu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { setNotifications([]); toggleHeaderMenu(); }}
            style={styles.headerMenuItem}
          >
            <FontAwesome name="trash" size={16} style={styles.menuIcon} />
            <Text style={styles.menuText}>Tout supprimer</Text>
          </TouchableOpacity>
          <TouchableOpacity
        onPress={() => {
          toggleHeaderMenu();
          navigate("settingsnotifications");
        }}
        style={styles.headerMenuItem}
      >
        <Feather name="settings" size={16} style={styles.menuIcon} />
        <Text style={styles.menuText}>
          Paramètres des notifications
        </Text>
      </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );

  const renderSearch = () => (
    <View style={styles.searchContainer}>
      <TextInput
        style={[styles.searchInput, { backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale100 }]}
        placeholder="Rechercher dans les notifications"
        placeholderTextColor={COLORS.gray}
        value={search}
        onChangeText={t => { setSearch(t); setPage(1); }}
      />
    </View>
  );

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all",      label: "Tous"    },
    { key: "unread",   label: "Non lu"  },
    { key: "read",     label: "Lu"      },
    { key: "favorite", label: "Favoris" },
    { key: "archive",  label: "Archivé" },
  ];

  const renderTabs = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.tabsContainer}
    >
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;
        const count = counts[tab.key];
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => { setActiveTab(tab.key); setPage(1); }}
            style={[
              styles.tabButton,
              isActive ? styles.tabButtonActive : styles.tabButtonInactive
            ]}
          >
            <View style={styles.tabContentContainer}>
              <Text 
                style={[
                  styles.tabText,
                  isActive ? styles.tabTextActive : styles.tabTextInactive
                ]}
              >
                {tab.label}
              </Text>
              <Text 
                style={[
                  styles.tabCountText,
                  isActive ? styles.tabCountTextActive : styles.tabCountTextInactive
                ]}
              >
                {count}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
  

  const formatTimeAgo = (timeStr: string) => {
    const v = parseInt(timeStr, 10);
    if (timeStr.includes("min")) return `Il y a ${v} minute${v > 1 ? "s" : ""}`;
    if (timeStr.includes("h"))   return `Il y a ${v} heure${v > 1 ? "s" : ""}`;
    if (timeStr.includes("j"))   return `Il y a ${v} jour${v > 1 ? "s" : ""}`;
    if (timeStr.includes("sem")) return `Il y a ${v} semaine${v > 1 ? "s" : ""}`;
    return timeStr;
  };

  const renderItem = ({ item }: ListRenderItemInfo<Notification>) => (
    <View style={styles.notificationRow}>
      <View
        style={[
          styles.notificationCard,
          { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
        ]}
      >
        <View style={styles.notificationContent}>
          <Text
            style={[
              styles.notificationType,
              { color: dark ? COLORS.gray : COLORS.greyscale900 },
            ]}
          >
            {item.type}
          </Text>
          <Text
            style={[
              styles.notificationSubject,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            {item.subject}
          </Text>
          <Text
            style={[
              styles.notificationTime,
              { color: dark ? COLORS.gray : COLORS.grayscale400 },
            ]}
          >
            {formatTimeAgo(item.time)}
          </Text>
        </View>
        <View style={styles.metaAndMenu}>
          {!item.read && <View style={styles.unreadDot} />}
          <TouchableOpacity
  onPressIn={e => {
    const { pageX, pageY } = e.nativeEvent;
    setMenuPosition({ x: pageX, y: pageY });
  }}
  onPress={() => setSelectedItem(item)}
  style={styles.itemMenuButton}
>
            <FontAwesome
              name="ellipsis-v"
              size={16}
              color={dark ? COLORS.white : COLORS.black}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderItemMenu = () => (
    <Modal transparent visible={!!selectedItem} animationType="fade">
      <TouchableWithoutFeedback onPress={() => setSelectedItem(null)}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      {selectedItem && (
        <View
          style={[
            styles.menuContainer,
            {
              backgroundColor: colors.background,
              top: menuPosition.y,
              left: clampedLeft,
              width: MENU_WIDTH,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => updateItem(selectedItem.id, { read: !selectedItem.read })}
            style={styles.menuItem}
          >
            <FontAwesome name="envelope-open" size={16} style={styles.menuIcon} />
            <Text style={styles.menuText}>
              {selectedItem.read ? "Marquer non lu" : "Marquer lu"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => updateItem(selectedItem.id, { favorite: !selectedItem.favorite})}
            style={styles.menuItem}
          >
            <FontAwesome name="star" size={16} style={styles.menuIcon} />
            <Text style={styles.menuText}>
              {selectedItem.favorite ? "Retirer favori" : "Ajouter favori"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => updateItem(selectedItem.id, { archived: !selectedItem.archived})}
            style={styles.menuItem}
          >
            <FontAwesome name="archive" size={16} style={styles.menuIcon} />
            <Text style={styles.menuText}>
              {selectedItem.archived ? "Désarchiver" : "Archiver"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setNotifications(ns => ns.filter(n => n.id !== selectedItem.id))}
            style={[styles.menuItem, { borderTopWidth: 1, borderColor: COLORS.gray }]}
          >
            <FontAwesome name="trash" size={16} color={COLORS.error} style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: COLORS.error }]}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      )}
    </Modal>
  );

  const renderPagination = () =>
    totalPages > 1 && (
      <View style={styles.paginationContainer}>
        <TouchableOpacity disabled={page === 1} onPress={() => setPage(page - 1)}>
          <Feather name="chevron-left" size={20} color={page === 1 ? COLORS.gray : COLORS.black} />
        </TouchableOpacity>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <TouchableOpacity key={p} onPress={() => setPage(p)}>
            <View style={[styles.pageNumber, page === p && styles.activePageNumber]}>
              <Text style={page === p ? styles.activePageText : styles.pageText}>{p}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity disabled={page === totalPages} onPress={() => setPage(page + 1)}>
          <Feather
            name="chevron-right"
            size={20}
            color={page === totalPages ? COLORS.gray : COLORS.black}
          />
        </TouchableOpacity>
      </View>
    );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {renderHeader()}
      {renderSearch()}
      {renderTabs()}
      <FlatList
        data={paged}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={renderPagination}
      />
      {renderItemMenu()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: { ...FONTS.h2 , marginLeft: 8, },
  actionButton: { padding: 8 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  headerMenuContainer: {
    position: "absolute",
    top: 56,
    right: 16,
    borderRadius: 8,
    elevation: 4,
    paddingVertical: 8,
    width: 200,
  },
  headerMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuIcon: { marginRight: 12 },
  menuText: { fontSize: 14, fontFamily: "medium" },

  searchContainer: { paddingHorizontal: 16, marginBottom: 8 },
  searchInput: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: "regular",
  },

  // ——— TABS ———
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin : 3,
    alignItems: 'center',
    justifyContent: 'flex-start', // Align tabs to start
    overflow: 'visible', // Allow content to overflow if needed
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 20,
    height: 40, // Fixed height
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tabButtonInactive: {
    backgroundColor: COLORS.greyscale100,
    borderWidth: 1,
    borderColor: COLORS.greyscale300,
  },
  tabContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'medium',
    marginRight: 6, // Space between label and count
  },
  tabTextActive: {
    color: COLORS.white,
  },
  tabTextInactive: {
    color: COLORS.greyscale900,
  },
  tabCountText: {
    fontSize: 12,
    fontFamily: 'medium',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    textAlign: 'center',
  },
  tabCountTextActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    color: COLORS.white,
  },
  tabCountTextInactive: {
    backgroundColor: COLORS.gray,
    color: COLORS.white,
  },
  // ——— NOTIFICATIONS ———
  notificationRow: { paddingHorizontal: 16 },
  notificationCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  notificationContent: { flex: 1 },
  notificationType: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  notificationSubject: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.greyscale600,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: "medium",
    marginTop: 4,
  },
  metaAndMenu: { flexDirection: "row", alignItems: "center" },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },
  itemMenuButton: { padding: 4 },

  // ——— ITEM MENU ———
  menuContainer: {
    position: "absolute",
    borderRadius: 8,
    elevation: 4,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  // ——— PAGINATION ———
  listContent: { paddingBottom: 24 },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
   pageNumber: {
       marginHorizontal: 6,        // more space between buttons
      width: 32,                  // uniform circle size
       height: 32,
       borderRadius: 16,
       borderWidth: 1,
       borderColor: COLORS.gray,
       alignItems: "center",
    justifyContent: "center",
    },
    activePageNumber: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    },
    pageText: {
      fontSize: 14,
      fontFamily: "medium",
      color: COLORS.black,
    },
    activePageText: {
      fontSize: 14,
      fontFamily: "medium",
      color: COLORS.white,
    },
});
