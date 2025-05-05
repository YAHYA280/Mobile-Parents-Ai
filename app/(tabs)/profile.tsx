import type { NavigationProp } from "@react-navigation/native";

import { Image } from "expo-image";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useNavigation } from "expo-router";
import { useTheme } from "@/theme/ThemeProvider";
import { MaterialIcons } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import CountryFlag from "react-native-country-flag";
import SettingsItem from "@/components/SettingsItem";
import { icons, SIZES, COLORS, images } from "@/constants";
import { ScrollView } from "react-native-virtualized-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchImagePicker } from "@/utils/ImagePickerHelper";
import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  Alert,
  Switch,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type Nav = {
  navigate: (value: string) => void;
};

interface HomeProps {
  navigation: any;
}


const SettingsScreen : React.FC<HomeProps> = () => {
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
  const { dark, colors, setScheme } = useTheme();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const refRBSheet = useRef<any>(null);

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("Français");

  const languages = [
    { id: "1", label: "Arabe", value: "Arabe", countryCode: "MA" },
    { id: "2", label: "Français", value: "Français", countryCode: "FR" },
    { id: "3", label: "Anglais", value: "Anglais", countryCode: "GB" },
    { id: "4", label: "Espagnol", value: "Espagnol", countryCode: "ES" },
    { id: "5", label: "Allemand", value: "Allemand", countryCode: "DE" },
    { id: "6", label: "Italien", value: "Italien", countryCode: "IT" },
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

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      setScheme(newMode ? "dark" : "light");
      return newMode;
    });
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={[styles.viewRight, { marginLeft: 'auto' }]}>
        <TouchableOpacity onPress={() => navigation.navigate("notifications")}>
          <Image
            source={icons.notificationBell2}
            resizeMode="contain"
            style={[
              styles.bellIcon,
              { tintColor: dark ? COLORS.white : COLORS.greyscale900 },
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDeleteConfirmModal = () => {
    return (
      <Modal
        visible={confirmationModalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: dark ? COLORS.black : COLORS.white },
            ]}
          >
            <Text
              style={[
                styles.deleteTitle,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Êtes-vous sûr de vouloir supprimer votre compte ?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.saveButtonText}>Confirmer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  {
                    backgroundColor: dark
                      ? COLORS.dark3
                      : COLORS.tansparentPrimary,
                    borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                  },
                ]}
                onPress={() => setConfirmationModalVisible(false)}
              >
                <Text
                  style={[
                    styles.cancelButtonText,
                    { color: dark ? COLORS.white : COLORS.primary },
                  ]}
                >
                  Annuler
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderProfileModal = () => {
    return (
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: dark ? COLORS.black : COLORS.white },
            ]}
          >
            <Text
              style={[
                styles.editTitle,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Modifier le profil
            </Text>
            <View
              style={[
                styles.separateLine,
                {
                  backgroundColor: dark
                    ? COLORS.greyScale800
                    : COLORS.grayscale200,
                },
              ]}
            />

            <View>
              <Image source={image} contentFit="cover" style={styles.image} />
              <TouchableOpacity onPress={pickImage} style={styles.editImage}>
                <MaterialIcons name="edit" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <Input
              id="name"
              value={name}
              onInputChanged={inputChangedHandler}
              placeholder="Nom Complet"
              icon={icons.user}
            />

            <Input
              id="email"
              value={email}
              onInputChanged={inputChangedHandler}
              placeholder="Email"
              icon={icons.email}
              keyboardType="email-address"
            />

            <Input
              id="phone"
              value={phone}
              onInputChanged={inputChangedHandler}
              placeholder="Téléphone"
              icon={icons.telephone}
              keyboardType="phone-pad"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  {
                    backgroundColor: dark
                      ? COLORS.dark3
                      : COLORS.tansparentPrimary,
                    borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                  },
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text
                  style={[
                    styles.cancelButtonText,
                    { color: dark ? COLORS.white : COLORS.primary },
                  ]}
                >
                  Annuler
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderProfile = () => {
    return (
      <View style={styles.profileContainer}>
        <View>
          <Image source={image} contentFit="cover" style={styles.image} />
          <TouchableOpacity
            style={styles.picContainer}
            onPress={() => setModalVisible(true)}
          >
            <MaterialIcons name="edit" size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text
          style={[styles.label, { color: dark ? COLORS.white : COLORS.black }]}
        >
          <Text style={styles.bold}>Nom Complet: </Text>
          {name}
        </Text>
        <Text
          style={[styles.label, { color: dark ? COLORS.white : COLORS.black }]}
        >
          <Text style={styles.bold}>Email: </Text>
          {email}
        </Text>
        <Text
          style={[styles.label, { color: dark ? COLORS.white : COLORS.black }]}
        >
          <Text style={styles.bold}>Numéro de téléphone: </Text>
          {phone}
        </Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setConfirmationModalVisible(true)}
        >
          <Text style={styles.deleteText}>Supprimer le compte</Text>
        </TouchableOpacity>

        <View
          style={[
            styles.profileSeparatorLine,
            {
              backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200,
            },
          ]}
        />
      </View>
    );
  };

  const renderSettings = () => {
    return (
      <View
        style={[
          styles.settingsContainer,
          { backgroundColor: dark ? "" : COLORS.white },
        ]}
      >
        <SettingsItem
          icon={icons.shieldOutline}
          name="Sécurité"
          onPress={() => navigate("settingssecurity")}
        />
        <SettingsItem
          icon={icons.walletOutline}
          name="Abonnements"
          onPress={() => navigate("abonnementActuel")}
        />
        <SettingsItem
          icon={icons.cartOutline}
          name="Transactions"
          onPress={() => navigate("transactions")}
        />
        <SettingsItem
          icon={icons.bell2}
          name="Paramètres Notification"
          onPress={() => navigate("settingsnotifications")}
        />
        
        <SettingsItem
          icon={icons.userOutline}
          name="Gestion Enfants"
          onPress={() => navigate("listeenfants")}
        />
        <TouchableOpacity
          onPress={() => setIsLanguageModalOpen(true)}
          style={styles.settingsItemContainer}
        >
          <View style={styles.leftContainer}>
            <Image
              source={icons.more}
              contentFit="contain"
              style={[
                styles.settingsIcon,
                {
                  tintColor: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            />
            <Text
              style={[
                styles.settingsName,
                {
                  color: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            >
              Langue
            </Text>
          </View>
          <View style={styles.rightContainer}>
            <Text
              style={[
                styles.rightLanguage,
                {
                  color: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            >
              {selectedLanguage}
            </Text>
            <Image
              source={icons.arrowRight}
              contentFit="contain"
              style={[
                styles.settingsArrowRight,
                {
                  tintColor: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItemContainer}>
          <View style={styles.leftContainer}>
            <Image
              source={icons.show}
              contentFit="contain"
              style={[
                styles.settingsIcon,
                {
                  tintColor: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            />
            <Text
              style={[
                styles.settingsName,
                {
                  color: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            >
              Dark Mode
            </Text>
          </View>
          <View style={styles.rightContainer}>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              thumbColor={isDarkMode ? "#fff" : COLORS.white}
              trackColor={{ false: "#EEEEEE", true: COLORS.primary }}
              ios_backgroundColor={COLORS.white}
              style={styles.switch}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => refRBSheet.current.open()}
          style={styles.logoutContainer}
        >
          <View style={styles.logoutLeftContainer}>
            <MaterialIcons
              style={styles.logoutIcon}
              name="logout"
              size={24}
              color="red"
            />

            <Text
              style={[
                styles.logoutName,
                {
                  color: "red",
                },
              ]}
            >
              Déconnexion
            </Text>
          </View>
        </TouchableOpacity>

        <Modal visible={isLanguageModalOpen} transparent animationType="slide">
          <View style={styles.modalBackground}>
            <View style={styles.modalContainerLanguage}>
              <TouchableOpacity
                onPress={() => setIsLanguageModalOpen(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Choisir une langue</Text>

              <FlatList
                data={languages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.languageOption}
                    onPress={() => {
                      setSelectedLanguage(item.value);
                      setIsLanguageModalOpen(false);
                    }}
                  >
                    <CountryFlag isoCode={item.countryCode} size={18} />
                    <Text style={[styles.languageText]}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderProfile()}
          {renderSettings()}
        </ScrollView>
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnPressMask
        height={240}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          draggableIcon: {
            backgroundColor: dark ? COLORS.gray2 : COLORS.grayscale200,
            height: 4,
          },
          container: {
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
            height: 240,
            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
          },
        }}
      >
        <Text style={styles.bottomTitle}>Déconnexion</Text>
        <View
          style={[
            styles.separateLine,
            {
              backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200,
            },
          ]}
        />
        <Text
          style={[
            styles.bottomSubtitle,
            {
              color: dark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          Êtes-vous sûr de vouloir vous déconnecter ?
        </Text>
        <View style={styles.bottomContainer}>
          <Button
            title="Oui, déconnexion"
            filled
            style={styles.logoutButton}
            onPress={() => refRBSheet.current.close()}
          />
          <Button
            title="Annuler"
            style={{
              width: (SIZES.width - 32) / 2 - 8,
              backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
              borderRadius: 32,
              borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
            }}
            textColor={dark ? COLORS.white : COLORS.primary}
            onPress={() => refRBSheet.current.close()}
          />
        </View>
      </RBSheet>

      {renderDeleteConfirmModal()}
      {renderProfileModal()}
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
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomColor: COLORS.secondaryWhite,
    shadowColor: COLORS.white,
    elevation: 0,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    marginTop: 19,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    width: "70%",
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainerLanguage: {
    backgroundColor: COLORS.primary,
    padding: 24,
    borderRadius: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    paddingTop: 10,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    zIndex: 100,
  },
  deleteTitle: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  modalTitle: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  saveButtonText: {
    color: COLORS.white,
    textAlign: "center",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: COLORS.tansparentPrimary,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  cancelButtonText: {
    color: COLORS.primary,
    textAlign: "center",
    fontWeight: "bold",
  },
  profileContainer: {
    alignItems: "center",
    borderBottomColor: COLORS.grayscale400,
    paddingVertical: 20,
  },
  picContainer: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    position: "absolute",
    bottom: 70,
    top: 0,
    left: 170,
  },
  editImage: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    position: "absolute",
    right: 0,
    bottom: 12,
  },
  languageOption: {
    padding: 10,
    fontSize: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  settingsContainer: {
    marginVertical: 0,
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    paddingTop: 7,
    marginBottom: 32,
    marginTop: -20,
  },
  settingsItemContainer: {
    width: SIZES.width - 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900,
  },
  settingsName: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    marginLeft: 12,
  },
  settingsArrowRight: {
    width: 24,
    height: 24,
    tintColor: COLORS.greyscale900,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightLanguage: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    marginRight: 8,
  },

  switch: {
    marginLeft: 8,
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  logoutContainer: {
    width: SIZES.width - 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  logoutLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900,
  },
  logoutName: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    marginLeft: 12,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 16,
  },

  logoutButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.primary,
    borderRadius: 32,
  },

  bottomTitle: {
    fontSize: 24,
    fontFamily: "semiBold",
    color: "red",
    textAlign: "center",
    marginTop: 12,
  },
  editTitle: {
    fontSize: 24,
    fontFamily: "semiBold",
    color: COLORS.black,
    textAlign: "center",
    marginTop: 0,
  },
  bottomSubtitle: {
    fontSize: 20,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 28,
  },
  separateLine: {
    width: SIZES.width,
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginTop: 12,
  },

  profileSeparatorLine: {
    width: "90%",
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginTop: 25,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  languageText: {
    fontSize: 18,
    marginLeft: 10,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: COLORS.white,
    position: "absolute",
    right: 16,
    top: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  viewRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  bellIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
    marginRight: 8,
  },
});

export default SettingsScreen;
