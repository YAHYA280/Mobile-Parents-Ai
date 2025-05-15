import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/theme/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from "@/constants/theme";
import Header from "@/components/ui/Header";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import CalendarModal from "@/components/CalendarModal"; // Import the new CalendarModal component

// Mock data types
import type { TransactionStatus } from "@/utils/translation";
import type { TRANSACTION } from "@/contexts/type/transaction";
import {
  TRANSACTION_STATUS_OPTIONS,
  transactions as initialTransactions,
} from "@/data/_mock/_transaction";

const { width } = Dimensions.get("window");

// Filter types
type FilterType = "status" | "date";

// Date filter options
const DATE_FILTER_OPTIONS = {
  all: "Toutes les dates",
  today: "Aujourd'hui",
  week: "Cette semaine",
  month: "Ce mois",
  year: "Cette année",
  custom: "Période personnalisée",
};

const Transactions = () => {
  const navigation = useNavigation();
  const { dark, colors } = useTheme();

  // State
  const [transactions, setTransactions] =
    useState<TRANSACTION[]>(initialTransactions);
  const [filteredTransactions, setFilteredTransactions] =
    useState<TRANSACTION[]>(initialTransactions);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TRANSACTION | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [showUndoNotification, setShowUndoNotification] = useState(false);
  const [deletedTransaction, setDeletedTransaction] =
    useState<TRANSACTION | null>(null);

  // Filter state
  const [activeFilter, setActiveFilter] = useState<FilterType>("status");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("all");

  // Calendar state
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  // Animation
  const undoNotificationOpacity = useRef(new Animated.Value(0)).current;
  const undoTimerRef = useRef<number | null>(null);

  // Effect to filter transactions
  useEffect(() => {
    let filtered = [...transactions];

    // Apply status filter if active
    if (activeFilter === "status" && selectedStatus !== "all") {
      filtered = filtered.filter(
        (item) => item.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    // Apply date filter if active
    if (activeFilter === "date") {
      if (selectedDate === "today") {
        // Filter for today's transactions
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Mock implementation - would need actual date fields in transactions
        filtered = filtered.slice(
          0,
          Math.max(1, Math.floor(filtered.length * 0.3))
        );
      } else if (selectedDate === "week") {
        // Filter for this week's transactions
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Go to Sunday

        // Mock implementation
        filtered = filtered.slice(
          0,
          Math.max(2, Math.floor(filtered.length * 0.5))
        );
      } else if (selectedDate === "month") {
        // Filter for this month's transactions
        // Mock implementation
        filtered = filtered.slice(
          0,
          Math.max(3, Math.floor(filtered.length * 0.7))
        );
      } else if (selectedDate === "year") {
        // Filter for this year's transactions
        // Mock implementation
        filtered = filtered.slice(
          0,
          Math.max(4, Math.floor(filtered.length * 0.9))
        );
      } else if (
        selectedDate === "custom" &&
        (dateRange.startDate || dateRange.endDate)
      ) {
        // Apply custom date range filter
        // In a real app, each transaction would have a date field to filter by
        // For mock purposes, we'll filter a subset of transactions

        if (dateRange.startDate && dateRange.endDate) {
          // Filter transactions between start and end dates
          // Mock implementation - simulate 40-70% of transactions based on date range size
          const daysDiff = Math.floor(
            (dateRange.endDate.getTime() - dateRange.startDate.getTime()) /
              (1000 * 60 * 60 * 24)
          );
          const filterRatio = Math.min(0.7, Math.max(0.4, daysDiff / 30));
          filtered = filtered.slice(
            0,
            Math.floor(filtered.length * filterRatio)
          );
        } else if (dateRange.startDate) {
          // Filter transactions from start date
          // Mock implementation - show 50% of transactions
          filtered = filtered.slice(0, Math.floor(filtered.length * 0.5));
        }
      }
    }

    setFilteredTransactions(filtered);
  }, [transactions, activeFilter, selectedStatus, selectedDate, dateRange]);

  const handleDeleteTransaction = (transaction: TRANSACTION) => {
    setSelectedTransaction(transaction);
    setIsDeleteModalVisible(true);
  };

  const confirmDeleteTransaction = () => {
    if (selectedTransaction) {
      setDeletedTransaction(selectedTransaction);
      setTransactions(
        transactions.filter((t) => t.id !== selectedTransaction.id)
      );
      setIsDeleteModalVisible(false);
      setSelectedTransaction(null);

      // Show undo notification
      setShowUndoNotification(true);
      Animated.timing(undoNotificationOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto-hide notification after 5 seconds
      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current);
      }

      undoTimerRef.current = setTimeout(() => {
        hideUndoNotification();
      }, 5000);
    }
  };

  const handleUndoDelete = () => {
    if (deletedTransaction) {
      setTransactions([...transactions, deletedTransaction]);
      hideUndoNotification();
    }
  };

  const hideUndoNotification = () => {
    Animated.timing(undoNotificationOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowUndoNotification(false);
      setDeletedTransaction(null);
    });

    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }
  };

  // Handle date range selection from calendar
  const handleDateRangeSelect = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    setDateRange({ startDate, endDate });
    if (startDate || endDate) {
      setSelectedDate("custom");
    }
  };

  // Show calendar modal
  const showCalendar = () => {
    setIsCalendarVisible(true);
  };

  // Format date for display
  const formatDateDisplay = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get display text for custom date range
  const getDateRangeDisplayText = () => {
    if (dateRange.startDate && dateRange.endDate) {
      return `${formatDateDisplay(dateRange.startDate)} - ${formatDateDisplay(dateRange.endDate)}`;
    } else if (dateRange.startDate) {
      return `À partir du ${formatDateDisplay(dateRange.startDate)}`;
    } else if (dateRange.endDate) {
      return `Jusqu'au ${formatDateDisplay(dateRange.endDate)}`;
    }
    return "Période personnalisée";
  };

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return {
          color: COLORS.greeen || "#4CAF50", // Using app's green color
          icon: "checkmark-circle",
          label: "Payé",
          bg: "rgba(76, 175, 80, 0.1)",
          gradient: ["#4CAF50", "#43A047"],
        };
      case "pending":
        return {
          color: COLORS.secondary || "#FFC107", // Using app's secondary color
          icon: "time",
          label: "En attente",
          bg: "rgba(255, 193, 7, 0.1)",
          gradient: ["#FFC107", "#FFB300"],
        };
      case "failed":
      case "canceled":
        return {
          color: COLORS.error || "#F44336", // Using app's error color
          icon: "close-circle",
          label: "Annulé",
          bg: "rgba(244, 67, 54, 0.1)",
          gradient: ["#F44336", "#E53935"],
        };
      default:
        return {
          color: COLORS.gray3 || "#9E9E9E", // Grey
          icon: "help-circle",
          label: "Inconnu",
          bg: "rgba(158, 158, 158, 0.1)",
          gradient: ["#9E9E9E", "#757575"],
        };
    }
  };

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <View style={styles.filterTypeContainer}>
        <TouchableOpacity
          style={[
            styles.filterTypeButton,
            activeFilter === "status" && styles.activeFilterTypeButton,
            {
              backgroundColor: dark
                ? activeFilter === "status"
                  ? "rgba(255, 142, 105, 0.2)"
                  : "rgba(255, 255, 255, 0.05)"
                : activeFilter === "status"
                  ? "rgba(255, 142, 105, 0.1)"
                  : "rgba(0, 0, 0, 0.03)",
            },
          ]}
          onPress={() => setActiveFilter("status")}
        >
          <Ionicons
            name="options-outline"
            size={18}
            color={
              activeFilter === "status"
                ? COLORS.primary
                : dark
                  ? COLORS.gray2
                  : COLORS.gray3
            }
          />
          <Text
            style={[
              styles.filterTypeButtonText,
              {
                color:
                  activeFilter === "status"
                    ? COLORS.primary
                    : dark
                      ? COLORS.gray2
                      : COLORS.gray3,
              },
            ]}
          >
            Statut
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTypeButton,
            activeFilter === "date" && styles.activeFilterTypeButton,
            {
              backgroundColor: dark
                ? activeFilter === "date"
                  ? "rgba(255, 142, 105, 0.2)"
                  : "rgba(255, 255, 255, 0.05)"
                : activeFilter === "date"
                  ? "rgba(255, 142, 105, 0.1)"
                  : "rgba(0, 0, 0, 0.03)",
            },
          ]}
          onPress={() => setActiveFilter("date")}
        >
          <Ionicons
            name="calendar-outline"
            size={18}
            color={
              activeFilter === "date"
                ? COLORS.primary
                : dark
                  ? COLORS.gray2
                  : COLORS.gray3
            }
          />
          <Text
            style={[
              styles.filterTypeButtonText,
              {
                color:
                  activeFilter === "date"
                    ? COLORS.primary
                    : dark
                      ? COLORS.gray2
                      : COLORS.gray3,
              },
            ]}
          >
            Date
          </Text>
        </TouchableOpacity>
      </View>

      {/* Custom Date Range Display */}
      {activeFilter === "date" &&
        selectedDate === "custom" &&
        (dateRange.startDate || dateRange.endDate) && (
          <View style={styles.dateRangeContainer}>
            <TouchableOpacity
              style={[
                styles.dateRangeButton,
                {
                  backgroundColor: dark
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.05)",
                },
              ]}
              onPress={showCalendar}
            >
              <Ionicons
                name="calendar"
                size={18}
                color={COLORS.primary}
                style={styles.dateRangeIcon}
              />
              <Text style={[styles.dateRangeText, { color: COLORS.primary }]}>
                {getDateRangeDisplayText()}
              </Text>
            </TouchableOpacity>
          </View>
        )}

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={
          activeFilter === "status"
            ? Object.entries(TRANSACTION_STATUS_OPTIONS).map(
                ([key, value]) => ({ id: key, label: value })
              )
            : Object.entries(DATE_FILTER_OPTIONS).map(([key, value]) => ({
                id: key,
                label: value,
              }))
        }
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.filterOptionsContainer}
        renderItem={({ item, index }) => {
          const isActive =
            activeFilter === "status"
              ? selectedStatus === item.id
              : selectedDate === item.id;

          return (
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 300, delay: index * 50 }}
            >
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  isActive && styles.activeFilterOption,
                  {
                    backgroundColor: isActive
                      ? "rgba(255, 142, 105, 0.1)"
                      : dark
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.03)",
                    borderColor: isActive ? COLORS.primary : "transparent",
                  },
                ]}
                onPress={() => {
                  if (activeFilter === "status") {
                    setSelectedStatus(item.id);
                  } else {
                    setSelectedDate(item.id);
                    if (item.id === "custom") {
                      showCalendar();
                    }
                  }
                }}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    {
                      color: isActive
                        ? COLORS.primary
                        : dark
                          ? COLORS.gray2
                          : COLORS.gray3,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            </MotiView>
          );
        }}
      />
    </View>
  );

  const renderTransactionItem = ({
    item,
    index,
  }: {
    item: TRANSACTION;
    index: number;
  }) => {
    const statusConfig = getStatusConfig(item.status);
    const amount = 120.0 + index * 15.75; // Generate varied amounts for visual variety

    return (
      <MotiView
        from={{ opacity: 0, translateY: 15 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 350, delay: index * 70 }}
      >
        <Card style={styles.transactionCard} shadowLevel="medium">
          <View style={styles.transactionCardInner}>
            {/* Left side - Status indicator with full height */}
            <View
              style={[
                styles.statusIndicatorContainer,
                { backgroundColor: statusConfig.color },
              ]}
            />

            {/* Right side - Transaction content */}
            <View style={styles.transactionContent}>
              <View style={styles.transactionHeader}>
                <View style={styles.transactionInfo}>
                  <Text
                    style={[
                      styles.transactionName,
                      { color: dark ? COLORS.white : COLORS.black },
                    ]}
                  >
                    {item.name}
                  </Text>
                  <View style={styles.transactionMeta}>
                    <Text style={styles.transactionId}>
                      #{item.id.slice(0, 6)}
                    </Text>
                    <Text style={styles.transactionDate}>• 15 Mai 2025</Text>
                  </View>
                </View>

                <View style={styles.amountContainer}>
                  <Text
                    style={[
                      styles.amount,
                      {
                        color:
                          item.status.toLowerCase() === "canceled"
                            ? COLORS.error
                            : statusConfig.color,
                      },
                    ]}
                  >
                    -${amount.toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={styles.transactionFooter}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: `${statusConfig.color}20` },
                  ]}
                >
                  <Ionicons
                    name={statusConfig.icon as any}
                    size={14}
                    color={statusConfig.color}
                  />
                  <Text
                    style={[styles.statusText, { color: statusConfig.color }]}
                  >
                    {statusConfig.label}
                  </Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.navigate("ereceipt" as never)}
                  >
                    <Ionicons
                      name="receipt-outline"
                      size={16}
                      color={dark ? COLORS.white : COLORS.black}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.iconButton, styles.deleteIconButton]}
                    onPress={() => handleDeleteTransaction(item)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={16}
                      color={COLORS.error}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Card>
      </MotiView>
    );
  };

  const renderEmptyState = () => (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 16 }}
      style={styles.emptyStateContainer}
    >
      <View
        style={[
          styles.emptyIconContainer,
          {
            backgroundColor: dark
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.03)",
          },
        ]}
      >
        <Ionicons
          name="receipt-outline"
          size={64}
          color={dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"}
        />
      </View>

      <Text
        style={[
          styles.emptyTitle,
          { color: dark ? COLORS.white : COLORS.black },
        ]}
      >
        Aucune transaction
      </Text>

      <Text
        style={[
          styles.emptyDescription,
          { color: dark ? COLORS.gray2 : COLORS.gray3 },
        ]}
      >
        Les transactions apparaîtront ici lorsque vous en effectuerez
      </Text>
    </MotiView>
  );

  const renderUndoNotification = () => (
    <Animated.View
      style={[
        styles.undoNotification,
        {
          opacity: undoNotificationOpacity,
          backgroundColor: dark ? COLORS.dark2 : COLORS.white,
          transform: [
            {
              translateY: undoNotificationOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.undoNotificationContent}>
        <Ionicons
          name="trash-outline"
          size={22}
          color={COLORS.error}
          style={styles.undoNotificationIcon}
        />
        <Text
          style={[
            styles.undoNotificationText,
            { color: dark ? COLORS.white : COLORS.greyscale900 },
          ]}
        >
          Transaction supprimée
        </Text>
      </View>

      <TouchableOpacity style={styles.undoButton} onPress={handleUndoDelete}>
        <Text style={styles.undoButtonText}>ANNULER</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: dark ? COLORS.dark1 : "#F8F9FA" },
      ]}
    >
      <Header
        title="Transactions"
        subtitle={`${filteredTransactions.length} transactions`}
        onBackPress={() => navigation.goBack()}
      />

      {renderFilters()}

      {filteredTransactions.length > 0 ? (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransactionItem}
          contentContainerStyle={styles.transactionsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}

      <Alert
        visible={isDeleteModalVisible}
        title="Supprimer la transaction"
        message={`Voulez-vous vraiment supprimer cette transaction${selectedTransaction ? ` de ${selectedTransaction.name}` : ""} ?`}
        buttons={[
          {
            text: "Annuler",
            style: "cancel",
            onPress: () => setIsDeleteModalVisible(false),
          },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: confirmDeleteTransaction,
          },
        ]}
      />

      {/* Calendar Modal */}
      <CalendarModal
        visible={isCalendarVisible}
        onClose={() => setIsCalendarVisible(false)}
        onSelectDateRange={handleDateRangeSelect}
        dark={dark}
      />

      {showUndoNotification && renderUndoNotification()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  filterTypeContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  filterTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 12,
  },
  activeFilterTypeButton: {
    borderWidth: 1,
    borderColor: "rgba(255, 142, 105, 0.3)",
  },
  filterTypeButtonText: {
    fontSize: 14,
    fontFamily: "medium",
    marginLeft: 6,
  },
  filterOptionsContainer: {
    paddingRight: 16,
    paddingBottom: 16,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  activeFilterOption: {
    borderWidth: 1,
  },
  filterOptionText: {
    fontSize: 13,
    fontFamily: "medium",
  },
  // New styles for date range display
  dateRangeContainer: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  dateRangeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  dateRangeIcon: {
    marginRight: 8,
  },
  dateRangeText: {
    fontSize: 14,
    fontFamily: "medium",
  },
  transactionsList: {
    padding: 16,
    paddingBottom: 100,
  },
  transactionCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  transactionCardInner: {
    flexDirection: "row",
  },
  statusIndicatorContainer: {
    width: 8,
  },
  transactionContent: {
    flex: 1,
    padding: 16,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontFamily: "semibold",
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionId: {
    fontSize: 13,
    fontFamily: "regular",
    color: "#999",
  },
  transactionDate: {
    fontSize: 13,
    fontFamily: "regular",
    color: "#999",
    marginLeft: 4,
  },
  amountContainer: {
    marginLeft: 16,
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 18,
    fontFamily: "bold",
  },
  transactionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 13,
    fontFamily: "medium",
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: "row",
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    marginLeft: 8,
  },
  deleteIconButton: {
    backgroundColor: "rgba(244, 67, 54, 0.1)",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: "regular",
    textAlign: "center",
    lineHeight: 20,
  },
  undoNotification: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  undoNotificationContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  undoNotificationIcon: {
    marginRight: 10,
  },
  undoNotificationText: {
    fontSize: 14,
    fontFamily: "medium",
  },
  undoButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255, 142, 105, 0.1)",
  },
  undoButtonText: {
    fontSize: 12,
    fontFamily: "bold",
    color: COLORS.primary,
  },
});

export default Transactions;
