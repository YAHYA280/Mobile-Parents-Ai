// components/enfants/historique/filtres/AssistantTypeFilters.tsx
import React from "react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { COLORS } from "@/constants/theme";

import { ASSISTANT_THEME } from "./constants";

interface AssistantTypeFiltersProps {
  uniqueAssistantTypes: string[];
  selectedAssistantTypes: string[];
  setSelectedAssistantTypes: (
    value: ((prev: string[]) => string[]) | string[]
  ) => void;
}

const AssistantTypeFilters: React.FC<AssistantTypeFiltersProps> = ({
  uniqueAssistantTypes,
  selectedAssistantTypes,
  setSelectedAssistantTypes,
}) => {
  if (!uniqueAssistantTypes || uniqueAssistantTypes.length === 0) return null;
  const safeSelectedTypes = selectedAssistantTypes || [];

  const handleTypePress = (type: string) => {
    if (typeof setSelectedAssistantTypes === "function") {
      setSelectedAssistantTypes((prev: string[]) => {
        const safeArray = prev || [];
        return safeArray.includes(type)
          ? safeArray.filter((t) => t !== type)
          : [...safeArray, type];
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Types d&apos;assistants</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {uniqueAssistantTypes.map((type) => {
          const isSelected = safeSelectedTypes.includes(type);
          const theme = ASSISTANT_THEME[type] || ASSISTANT_THEME.Autre;
          return (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterButton,
                {
                  backgroundColor: isSelected
                    ? theme.colors[0]
                    : "rgba(0,0,0,0.05)",
                  elevation: isSelected ? 2 : 0,
                  shadowColor: isSelected ? theme.colors[0] : "transparent",
                },
              ]}
              onPress={() => handleTypePress(type)}
            >
              <FontAwesomeIcon
                icon={theme.icon}
                color={isSelected ? "#FFFFFF" : COLORS.gray3}
                style={styles.filterIcon}
              />
              <Text
                style={[
                  styles.filterText,
                  {
                    color: isSelected ? "#FFFFFF" : COLORS.gray3,
                    fontWeight: isSelected ? "600" : "normal",
                  },
                ]}
              >
                {type}
              </Text>
              {isSelected && (
                <View style={styles.checkContainer}>
                  <FontAwesomeIcon icon={faCheck} size={12} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.black,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  scrollContent: {
    paddingBottom: 4,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  filterIcon: {
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
  },
  checkContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});

export default AssistantTypeFilters;
