import type { NavigationProp } from "@react-navigation/native";

import { useNavigation } from "expo-router";
import { View, Alert, StyleSheet } from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useRef, useState, useEffect, useCallback } from "react";

import { images } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import { launchImagePicker } from "@/utils/ImagePickerHelper";
import {
  ProfileCard,
  ProfileHeader,
  SettingsSection,
  ProfileEditModal,
  LogoutBottomSheet,
  DeleteConfirmModal,
  LanguageSelectionModal,
} from "@/components/profile";

type Nav = {
  navigate: (value: string) => void;
};

interface HomeProps {
  navigation: any;
}

const SettingsScreen: React.FC<HomeProps> = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [image, setImage] = useState(images.user7);
  const [name, setName] = useState("Jack Duboix");
  const [email, setEmail] = useState("Jack.Duboix@gmail.com");
  const [phone, setPhone] = useState("+33 655884477");

  const [error] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);

  const { navigate } = useNavigation<Nav>();
  const { colors } = useTheme();

  const refRBSheet = useRef<any>(null);

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("Fr");

  const languages = [
    { id: "1", label: "Ar", value: "Ar", countryCode: "MA" },
    { id: "2", label: "Fr", value: "Fr", countryCode: "FR" },
    { id: "3", label: "An", value: "An", countryCode: "GB" },
    { id: "4", label: "Es", value: "Es", countryCode: "ES" },
    { id: "5", label: "Al", value: "Al", countryCode: "DE" },
    { id: "6", label: "It", value: "It", countryCode: "IT" },
  ];

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      if (inputId === "name") {
        setName(inputValue);
      } else if (inputId === "email") {
        setEmail(inputValue);
      } else if (inputId === "phone") {
        setPhone(inputValue);
      }
    },
    []
  );

  useEffect(() => {
    if (error) {
      Alert.alert("Une erreur est survenue", error);
    }
  }, [error]);

  const handleDeleteAccount = () => {
    console.log("Compte supprimé");
    setConfirmationModalVisible(false);
  };

  const pickImage = async () => {
    const tempUri = await launchImagePicker();
    if (!tempUri) return;
    setImage({ uri: tempUri });
  };

  const handleSaveProfile = () => {
    setModalVisible(false);
    // Add save logic here
  };

  const handleLogout = () => {
    refRBSheet.current.close();
    // Add logout logic here
  };

  const handleCancelLogout = () => {
    refRBSheet.current.close();
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <ProfileHeader navigation={navigation} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ProfileCard
            name={name}
            email={email}
            phone={phone}
            image={image}
            onEditPress={() => setModalVisible(true)}
          />

          <SettingsSection
            navigate={navigate}
            selectedLanguage={selectedLanguage}
            onLanguagePress={() => setIsLanguageModalOpen(true)}
            onLogoutPress={() => refRBSheet.current.open()}
            onDeleteAccountPress={() => setConfirmationModalVisible(true)}
          />
        </ScrollView>
      </View>

      {/* Modals and Bottom Sheets */}
      <ProfileEditModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        image={image}
        name={name}
        email={email}
        phone={phone}
        onPickImage={pickImage}
        onInputChanged={inputChangedHandler}
        onSave={handleSaveProfile}
      />

      <DeleteConfirmModal
        visible={confirmationModalVisible}
        onClose={() => setConfirmationModalVisible(false)}
        onConfirm={handleDeleteAccount}
      />

      <LanguageSelectionModal
        visible={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        languages={languages}
        selectedLanguage={selectedLanguage}
        onLanguageSelect={setSelectedLanguage}
      />

      <LogoutBottomSheet
        refRBSheet={refRBSheet}
        onConfirmLogout={handleLogout}
        onCancel={handleCancelLogout}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
});

export default SettingsScreen;
