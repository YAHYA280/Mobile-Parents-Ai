// components/enfants/historique/filtres/SearchBarComponent.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  faSync,
  faSearch,
  faCalendar,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

import { COLORS } from "@/constants/theme";

interface SearchBarProps {
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  activityDateRange: { startDate: string | null; endDate: string | null };
  toggleActivityCalendar: () => void;
  resetAllFilters: () => void;
  hasFilters: boolean;
}

const SearchBarComponent: React.FC<SearchBarProps> = ({
  searchKeyword,
  setSearchKeyword,
  activityDateRange,
  toggleActivityCalendar,
  resetAllFilters,
  hasFilters,
}) => {
  const isDateFilterActive =
    activityDateRange.startDate || activityDateRange.endDate;

  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <FontAwesomeIcon
          icon={faSearch}
          color={COLORS.gray3}
          size={16}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Rechercher une activité..."
          placeholderTextColor="rgba(0,0,0,0.4)"
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          style={styles.textInput}
        />
        {searchKeyword && (
          <TouchableOpacity
            onPress={() => setSearchKeyword("")}
            style={styles.clearButton}
          >
            <FontAwesomeIcon
              icon={faTimesCircle}
              color={COLORS.gray3}
              size={16}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Date Filter & Reset Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.dateFilterButton,
            {
              backgroundColor: isDateFilterActive
                ? "rgba(0, 149, 255, 0.1)"
                : "rgba(0,0,0,0.05)",
            },
          ]}
          onPress={toggleActivityCalendar}
        >
          <FontAwesomeIcon
            icon={faCalendar}
            color={isDateFilterActive ? COLORS.primary : COLORS.gray3}
            size={16}
            style={styles.buttonIcon}
          />
          <Text
            style={[
              styles.dateFilterText,
              {
                color: isDateFilterActive ? COLORS.primary : COLORS.gray3,
                fontWeight: isDateFilterActive ? "600" : "normal",
              },
            ]}
          >
            {isDateFilterActive ? "Période active" : "Filtrer par date"}
          </Text>
        </TouchableOpacity>

        {hasFilters && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetAllFilters}
          >
            <FontAwesomeIcon
              icon={faSync}
              color={COLORS.gray3}
              size={16}
              style={styles.buttonIcon}
            />
            <Text style={styles.resetButtonText}>Réinitialiser</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 4,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 2,
    color: COLORS.black,
    fontSize: 15,
  },
  clearButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateFilterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    flex: 1,
    marginRight: 8,
  },
  resetButton: {
    backgroundColor: "rgba(0,0,0,0.05)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  dateFilterText: {
    fontSize: 14,
  },
  resetButtonText: {
    color: COLORS.gray3,
    fontSize: 14,
  },
});

export default SearchBarComponent;
