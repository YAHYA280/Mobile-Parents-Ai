// components/profile/LanguageSelectionModal.tsx
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import CountryFlag from "react-native-country-flag";
import {
  View,
  Text,
  Modal,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { COLORS } from "@/constants";

interface Language {
  id: string;
  label: string;
  value: string;
  countryCode: string;
}

interface LanguageSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  languages: Language[];
  selectedLanguage: string;
  onLanguageSelect: (language: string) => void;
}

const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  visible,
  onClose,
  languages,
  selectedLanguage,
  onLanguageSelect,
}) => {
  const handleLanguageSelect = (language: string) => {
    onLanguageSelect(language);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.languageModalContainer}>
        <View
          style={[
            styles.languageModalContent,
            { backgroundColor: COLORS.white },
          ]}
        >
          <View style={styles.modalDragHandle} />

          <View style={styles.languageModalHeader}>
            <Text style={[styles.languageModalTitle, { color: COLORS.black }]}>
              Choisir une langue
            </Text>
            <TouchableOpacity
              style={styles.closeLanguageButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color={COLORS.greyscale900} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={languages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  selectedLanguage === item.value &&
                    styles.languageOptionSelected,
                ]}
                onPress={() => handleLanguageSelect(item.value)}
              >
                <View style={styles.languageOptionFlag}>
                  <CountryFlag isoCode={item.countryCode} size={22} />
                </View>
                <Text
                  style={[
                    styles.languageOptionText,
                    { color: COLORS.greyscale900 },
                    selectedLanguage === item.value && {
                      color: COLORS.primary,
                      fontFamily: "semibold",
                    },
                  ]}
                >
                  {item.label}
                </Text>
                {selectedLanguage === item.value && (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={COLORS.primary}
                  />
                )}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.languageList}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  languageModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  languageModalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    paddingTop: 12,
    alignItems: "center",
    maxHeight: "70%",
    width: "100%",
  },
  modalDragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 2.5,
    marginBottom: 16,
  },
  languageModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  languageModalTitle: {
    fontSize: 20,
    fontFamily: "bold",
  },
  closeLanguageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  languageList: {
    width: "100%",
    paddingHorizontal: 50,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 12,
    marginBottom: 8,
    width: "100%",
  },
  languageOptionSelected: {
    backgroundColor: `${COLORS.primary}10`,
  },
  languageOptionFlag: {
    marginRight: 16,
  },
  languageOptionText: {
    fontSize: 16,
    fontFamily: "regular",
    flex: 1,
    paddingLeft: 4,
  },
});

export default LanguageSelectionModal;
