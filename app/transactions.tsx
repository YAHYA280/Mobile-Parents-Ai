import type { ListRenderItemInfo } from "react-native";
import type { TransactionStatus } from "@/utils/translation";
import type { TRANSACTION } from "@/contexts/type/transaction";

import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";
import { icons, FONTS, COLORS } from "@/constants";
import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState, useEffect } from "react";
import { ScrollView } from "react-native-virtualized-view";
import TransactionCard from "@/components/TransactionCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { translateTransactionStatus } from "@/utils/translation";
import {
  TRANSACTION_STATUS_OPTIONS,
  transactions as initialTransactions,
} from "@/data/_mock/_transaction";
import {
  View,
  Text,
  Image,
  Modal,
  FlatList,
  Animated,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const Transactions = () => {
  const { dark, colors } = useTheme();
  const navigation = useNavigation();
  const [transactions, setTransactions] =
    useState<TRANSACTION[]>(initialTransactions);
  const [filteredTransactions, setFilteredTransactions] =
    useState<TRANSACTION[]>(initialTransactions);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TRANSACTION | null>(null);
  const [selectedTransactions, setSelectedTransactions] = useState<
    TRANSACTION[]
  >([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [deletedTransactions, setDeletedTransactions] = useState<TRANSACTION[]>(
    []
  );
  const [showUndoNotification, setShowUndoNotification] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Animation pour la notification d'annulation
  const undoNotificationOpacity = useRef(new Animated.Value(0)).current;

  // Timer pour masquer la notification d'annulation
  const undoTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Filtrer d'abord par le searchQuery
    let filtered = transactions;

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Ensuite filtrer par statut si un statut autre que "All" est sélectionné
    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (item) => item.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    setFilteredTransactions(filtered);
  }, [searchQuery, transactions, selectedStatus]);

  const renderTransactionStatusItem = ({
    item,
  }: ListRenderItemInfo<{ id: string; value: TransactionStatus }>) => (
    <TouchableOpacity
      style={{
        backgroundColor:
          selectedStatus === item.id ? COLORS.primary : "transparent",
        padding: 10,
        marginVertical: 5,
        borderColor: COLORS.primary,
        borderWidth: 1.3,
        borderRadius: 24,
        marginRight: 12,
        height: 40,
        marginBottom: 20,
      }}
      onPress={() => setSelectedStatus(item.id)}
    >
      <Text
        style={{
          color: selectedStatus === item.id ? COLORS.white : COLORS.primary,
        }}
      >
        {translateTransactionStatus(item.id)}
      </Text>
    </TouchableOpacity>
  );

  const toggleTransactionSelection = (transaction: TRANSACTION) => {
    if (isSelectionMode) {
      const isSelected = selectedTransactions.some(
        (item) => item.id === transaction.id
      );
      if (isSelected) {
        setSelectedTransactions(
          selectedTransactions.filter((item) => item.id !== transaction.id)
        );
        if (selectedTransactions.length === 1) {
          setIsSelectionMode(false);
        }
      } else {
        setSelectedTransactions([...selectedTransactions, transaction]);
      }
    } else {
      setSelectedTransaction(transaction);
      setIsDeleteModalVisible(true);
    }
  };

  const handleLongPress = (transaction: TRANSACTION) => {
    setIsSelectionMode(true);
    setSelectedTransactions([transaction]);
  };

  const handleDeleteSelectedTransactions = () => {
    if (selectedTransactions.length > 0) {
      setDeletedTransactions(selectedTransactions);

      const updatedTransactions = transactions.filter(
        (item) =>
          !selectedTransactions.some((selected) => selected.id === item.id)
      );

      setTransactions(updatedTransactions);
      setIsDeleteModalVisible(false);
      setIsSelectionMode(false);
      setSelectedTransactions([]);

      setShowUndoNotification(true);

      Animated.timing(undoNotificationOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current);
      }

      undoTimerRef.current = setTimeout(() => {
        hideUndoNotification();
      }, 5000);
    }
  };

  const handleDeleteSingleTransaction = () => {
    if (selectedTransaction) {
      // Sauvegarder la transaction supprimée pour une restauration possible
      setDeletedTransactions([selectedTransaction]);

      // Supprimer la transaction
      setTransactions(
        transactions.filter((item) => item.id !== selectedTransaction.id)
      );
      setIsDeleteModalVisible(false);
      setSelectedTransaction(null);

      // Afficher la notification d'annulation
      setShowUndoNotification(true);

      // Animation pour afficher la notification
      Animated.timing(undoNotificationOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Définir un timer pour masquer la notification après 5 secondes
      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current);
      }

      undoTimerRef.current = setTimeout(() => {
        hideUndoNotification();
      }, 5000);
    }
  };

  const handleUndoDelete = () => {
    if (deletedTransactions.length > 0) {
      // Restaurer les transactions supprimées
      setTransactions([...transactions, ...deletedTransactions]);
      hideUndoNotification();
    }
  };

  const hideUndoNotification = () => {
    // Animation pour masquer la notification
    Animated.timing(undoNotificationOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowUndoNotification(false);
      setDeletedTransactions([]);
    });

    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }
  };

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      setSearchQuery("");
    }
  };

  const cancelSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedTransactions([]);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {isSelectionMode ? (
        <View style={styles.selectionHeaderContainer}>
          <TouchableOpacity onPress={cancelSelectionMode}>
            <Image
              source={icons.cancelSquare}
              resizeMode="contain"
              style={[
                styles.deleteIcon,
                {
                  tintColor: COLORS.error,
                },
              ]}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.selectionCountText,
              {
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          >
            {selectedTransactions.length} sélectionné
            {selectedTransactions.length > 1 ? "s" : ""}
          </Text>
          <TouchableOpacity
            style={styles.deleteSelectedButton}
            onPress={() => setIsDeleteModalVisible(true)}
          >
            <Image
              source={icons.trash}
              resizeMode="contain"
              style={[
                styles.deleteIcon,
                {
                  tintColor: COLORS.error,
                },
              ]}
            />
          </TouchableOpacity>
        </View>
      ) : isSearchActive ? (
        <View style={styles.searchBarContainer}>
          <TouchableOpacity onPress={toggleSearch}>
            <Image
              source={icons.back}
              resizeMode="contain"
              style={[
                styles.searchIcon,
                {
                  tintColor: dark ? COLORS.secondaryWhite : COLORS.greyscale900,
                },
              ]}
            />
          </TouchableOpacity>
          <TextInput
            style={[
              styles.searchInput,
              {
                color: dark ? COLORS.white : COLORS.greyscale900,
                borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
              },
            ]}
            placeholder="Rechercher une transaction..."
            placeholderTextColor={
              dark ? COLORS.greyscale500 : COLORS.greyScale400
            }
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Image
                source={icons.cancelSquare}
                resizeMode="contain"
                style={[
                  styles.clearIcon,
                  {
                    tintColor: dark
                      ? COLORS.secondaryWhite
                      : COLORS.greyscale900,
                  },
                ]}
              />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Feather
                name="arrow-left"
                size={24}
                color={dark ? COLORS.white : COLORS.black}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.headerTitle,
                {
                  color: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            >
              Transactions
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={toggleSearch}>
              <Image
                source={icons.search2}
                resizeMode="contain"
                style={[
                  styles.searchIcon,
                  {
                    tintColor: dark
                      ? COLORS.secondaryWhite
                      : COLORS.greyscale900,
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  const renderDeleteModal = () => (
    <Modal
      animationType="fade"
      transparent
      visible={isDeleteModalVisible}
      onRequestClose={() => setIsDeleteModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
          <Text
            style={[
              styles.modalTitle,
              { color: dark ? COLORS.white : COLORS.greyscale900 },
            ]}
          >
            Supprimer {isSelectionMode ? "les transactions" : "la transaction"}
          </Text>
          <Text
            style={[
              styles.modalText,
              { color: dark ? COLORS.secondaryWhite : COLORS.greyScale700 },
            ]}
          >
            {isSelectionMode
              ? `Voulez-vous vraiment supprimer ${selectedTransactions.length} transaction${selectedTransactions.length > 1 ? "s" : ""} ?`
              : `Voulez-vous vraiment supprimer cette transaction${selectedTransaction ? ` de ${selectedTransaction.name}` : ""} ?`}
          </Text>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[
                styles.modalButton,
                { backgroundColor: dark ? COLORS.dark3 : COLORS.tertiaryWhite },
              ]}
              onPress={() => setIsDeleteModalVisible(false)}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: dark ? COLORS.white : COLORS.greyscale900 },
                ]}
              >
                Annuler
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.deleteButton]}
              onPress={
                isSelectionMode
                  ? handleDeleteSelectedTransactions
                  : handleDeleteSingleTransaction
              }
            >
              <Text style={[styles.buttonText, styles.deleteButtonText]}>
                Supprimer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderUndoNotification = () => (
    <Animated.View
      style={[
        styles.undoNotification,
        {
          opacity: undoNotificationOpacity,
          backgroundColor: dark ? COLORS.dark2 : COLORS.white,
        },
      ]}
    >
      <Text
        style={[
          styles.undoNotificationText,
          { color: dark ? COLORS.white : COLORS.greyscale900 },
        ]}
      >
        {deletedTransactions.length > 1
          ? `${deletedTransactions.length} transactions supprimées`
          : "Transaction supprimée"}
      </Text>
      <TouchableOpacity onPress={handleUndoDelete}>
        <Text style={styles.undoButton}>ANNULER</Text>
      </TouchableOpacity>
    </Animated.View>
  );
  // In your renderTransactionItem function in Transactions.tsx
  const renderTransactionItem = ({ item }: { item: TRANSACTION }) => {
    const isSelected = selectedTransactions.some(
      (selected) => selected.id === item.id
    );

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => toggleTransactionSelection(item)}
        onLongPress={() => handleLongPress(item)}
        delayLongPress={300}
      >
        <View style={styles.transactionContainer}>
          {isSelectionMode && (
            <View
              style={[
                styles.selectionIndicator,
                isSelected && styles.selectedIndicator,
              ]}
            >
              {isSelected && (
                <Image
                  source={icons.check}
                  resizeMode="contain"
                  style={styles.checkIcon}
                />
              )}
            </View>
          )}
          <View style={{ flex: 1 }}>
            <TransactionCard
              name={item.name}
              image={item.image}
              status={item.status}
              selected={isSelected}
              isSelectionMode={isSelectionMode}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <View
          style={[
            styles.statusFilterContainer,
            { backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite },
          ]}
        >
          <FlatList
            data={Object.entries(TRANSACTION_STATUS_OPTIONS).map(
              ([key, label]) => ({
                id: key,
                value: label,
              })
            )}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            horizontal
            renderItem={renderTransactionStatusItem}
          />
        </View>
        <ScrollView
          style={[
            styles.scrollView,
            {
              backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {filteredTransactions.length > 0 ? (
            <FlatList
              style={[{ paddingBottom: 73 }]}
              data={filteredTransactions}
              keyExtractor={(item) => item.id}
              renderItem={renderTransactionItem}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Image
                source={icons.emptyContent}
                resizeMode="contain"
                style={[styles.emptyIcon]}
              />
              <Text
                style={[
                  styles.emptyText,
                  { color: dark ? COLORS.white : COLORS.greyscale900 },
                ]}
              >
                {searchQuery.trim() !== ""
                  ? "Aucun résultat trouvé"
                  : "Aucune transaction"}
              </Text>
              {searchQuery.trim() !== "" && (
                <TouchableOpacity
                  style={styles.clearSearchButton}
                  onPress={() => setSearchQuery("")}
                >
                  <Text style={styles.clearSearchText}>
                    Effacer la recherche
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      </View>
      {renderDeleteModal()}
      {showUndoNotification && renderUndoNotification()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
  selectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  selectionCountText: {
    fontSize: 18,
    fontFamily: "semibold",
    flex: 1,
    marginLeft: 16,
  },
  deleteSelectedButton: {
    padding: 8,
  },
  deleteIcon: {
    width: 24,
    height: 24,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginLeft: 8,
    fontFamily: "regular",
  },
  clearIcon: {
    width: 20,
    height: 20,
    marginLeft: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.black,
  },
  headerRight: {
    flexDirection: "row",
    alignContent: "center",
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
  scrollView: {
    paddingVertical: 5,
    backgroundColor: COLORS.tertiaryWhite,
    paddingHorizontal: 16,
  },
  transactionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.greyScale400,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedIndicator: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  checkIcon: {
    width: 14,
    height: 14,
    tintColor: COLORS.white,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.greyscale900,
    marginBottom: 12,
  },
  clearSearchButton: {
    padding: 8,
  },
  clearSearchText: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    borderRadius: 16,
    padding: 24,
    backgroundColor: COLORS.white,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 12,
    color: COLORS.greyscale900,
  },
  modalText: {
    fontSize: 16,
    fontFamily: "regular",
    marginBottom: 24,
    color: COLORS.greyScale700,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 22,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: COLORS.tertiaryWhite,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  buttonText: {
    fontFamily: "medium",
    fontSize: 16,
    color: COLORS.greyscale900,
  },
  deleteButtonText: {
    color: COLORS.white,
  },
  undoNotification: {
    position: "absolute",
    bottom: 20,
    left: "5%",
    right: "5%",
    backgroundColor: COLORS.white,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  undoNotificationText: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.greyscale900,
  },
  undoButton: {
    fontSize: 14,
    fontFamily: "bold",
    color: COLORS.primary,
  },
  statusFilterContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 0,
    zIndex: 1,
    backgroundColor: COLORS.tertiaryWhite,
  },
});

export default Transactions;