// Enhanced profile.tsx
import type { NavigationProp } from "@react-navigation/native";

import { Image } from "expo-image";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useNavigation } from "expo-router";
import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import CountryFlag from "react-native-country-flag";
import { icons, SIZES, COLORS, images } from "@/constants";
import { ScrollView } from "react-native-virtualized-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchImagePicker } from "@/utils/ImagePickerHelper";
import NotificationBell from "../../components/notifications/NotificationBell";
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
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";

type Nav = {
  navigate: (value: string) => void;
};

interface HomeProps {
  navigation: any;
}

// Function to get first letter of each word
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
};

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
  const { dark, colors, setScheme } = useTheme();

  const [isDarkMode, setIsDarkMode] = useState(false);
  // Dark mode state remains but toggle functionality removed as requested
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

  // Dark mode toggle removed as requested

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <Text
          style={[
            styles.headerTitle,
            { color: dark ? COLORS.white : COLORS.greyscale900 },
          ]}
        >
          Profil
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("notifications")}>
          <NotificationBell />
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
              { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
            ]}
          >
            <View style={styles.modalHeaderIcon}>
              <View style={styles.warningCircle}>
                <Ionicons name="warning" size={32} color="#FFFFFF" />
              </View>
            </View>

            <Text
              style={[
                styles.deleteTitle,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Êtes-vous sûr de vouloir supprimer votre compte ?
            </Text>

            <Text
              style={[
                styles.deleteSubtitle,
                { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
              ]}
            >
              Cette action est irréversible et toutes vos données seront
              définitivement supprimées.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.confirmDeleteText}>Confirmer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  {
                    backgroundColor: dark ? COLORS.dark3 : COLORS.greyscale100,
                  },
                ]}
                onPress={() => setConfirmationModalVisible(false)}
              >
                <Text
                  style={[
                    styles.cancelButtonText,
                    { color: dark ? COLORS.white : COLORS.greyscale900 },
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
              { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
            ]}
          >
            <View style={styles.modalDragHandle} />

            <Text
              style={[
                styles.editTitle,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Modifier le profil
            </Text>

            <View style={styles.profileImageEdit}>
              <Image
                source={image}
                contentFit="cover"
                style={styles.editProfileImage}
              />
              <TouchableOpacity
                onPress={pickImage}
                style={styles.editImageButton}
              >
                <MaterialIcons name="edit" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputsContainer}>
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
            </View>

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
                    backgroundColor: dark ? COLORS.dark3 : COLORS.greyscale100,
                  },
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text
                  style={[
                    styles.cancelButtonText,
                    { color: dark ? COLORS.white : COLORS.greyscale900 },
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
      <View
        style={[
          styles.profileCard,
          { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
        ]}
      >
        <LinearGradient
          colors={[COLORS.primary, "#ff7043"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.profileCardHeader}
        >
          <View style={styles.profileInfo}>
            <View style={styles.profileAvatarContainer}>
              {image ? (
                <Image
                  source={image}
                  contentFit="cover"
                  style={styles.profileAvatar}
                />
              ) : (
                <View style={styles.initialsContainer}>
                  <Text style={styles.initialsText}>{getInitials(name)}</Text>
                </View>
              )}
              <View style={styles.profileStatusDot} />
            </View>

            <View style={styles.nameEmailContainer}>
              <Text style={styles.profileName}>{name}</Text>
              <Text style={styles.profileEmail}>{email}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="create-outline" size={20} color="#FFFFFF" />
            <Text style={styles.editProfileText}>Modifier</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.phoneNumberContainer}>
          <View style={styles.phoneNumberRow}>
            <Ionicons
              name="call-outline"
              size={18}
              color={dark ? COLORS.greyscale500 : COLORS.greyscale600}
              style={styles.phoneIcon}
            />
            <Text
              style={[
                styles.phoneLabel,
                { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
              ]}
            >
              Numéro de téléphone
            </Text>
          </View>
          <Text
            style={[
              styles.phoneValue,
              { color: dark ? COLORS.white : COLORS.greyscale900 },
            ]}
          >
            {phone}
          </Text>
        </View>
      </View>
    );
  };

  const renderSettingsItem = (
    icon: string,
    name: string,
    onPress: () => void,
    showArrow: boolean = true,
    rightComponent?: React.ReactNode,
    iconColor?: string
  ) => (
    <TouchableOpacity style={styles.settingsItemContainer} onPress={onPress}>
      <View style={styles.settingsItemLeftContainer}>
        <View
          style={[
            styles.settingsItemIconContainer,
            iconColor ? { backgroundColor: `${iconColor}15` } : {},
          ]}
        >
          <Ionicons
            name={icon as any}
            size={20}
            color={iconColor || COLORS.primary}
          />
        </View>
        <Text
          style={[
            styles.settingsItemText,
            { color: dark ? COLORS.white : COLORS.greyscale900 },
          ]}
        >
          {name}
        </Text>
      </View>

      <View style={styles.settingsItemRightContainer}>
        {rightComponent}
        {showArrow && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={dark ? COLORS.greyscale500 : COLORS.greyscale600}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSettingsGroup = (title: string, children: React.ReactNode) => (
    <View style={styles.settingsGroupContainer}>
      <Text
        style={[
          styles.settingsGroupTitle,
          { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
        ]}
      >
        {title}
      </Text>
      <View
        style={[
          styles.settingsGroupCard,
          { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
        ]}
      >
        {children}
      </View>
    </View>
  );

  const renderSettings = () => {
    return (
      <View style={styles.settingsContainer}>
        {renderSettingsGroup(
          "Compte",
          <>
            {renderSettingsItem("shield-outline", "Sécurité", () =>
              navigate("settingssecurity")
            )}
            {renderSettingsItem("wallet-outline", "Abonnements", () =>
              navigate("abonnementActuel")
            )}
            {renderSettingsItem("receipt-outline", "Transactions", () =>
              navigate("transactions")
            )}
            {renderSettingsItem("notifications-outline", "Notifications", () =>
              navigate("settingsnotifications")
            )}
            {renderSettingsItem("people-outline", "Gestion Enfants", () =>
              navigate("listeenfants")
            )}
          </>
        )}

        {renderSettingsGroup(
          "Préférences",
          <>
            {renderSettingsItem(
              "language-outline",
              "Langue",
              () => setIsLanguageModalOpen(true),
              true,
              <Text
                style={[
                  styles.settingsItemRightText,
                  { color: COLORS.primary },
                ]}
              >
                {selectedLanguage}
              </Text>
            )}
          </>
        )}

        {renderSettingsGroup(
          "Autres",
          <>
            {renderSettingsItem("help-circle-outline", "Aide & Support", () =>
              navigate("support")
            )}
            {renderSettingsItem("information-circle-outline", "À propos", () =>
              navigate("about")
            )}
            {renderSettingsItem(
              "log-out-outline",
              "Déconnexion",
              () => refRBSheet.current.open(),
              false,
              null,
              "#F44336"
            )}
            {renderSettingsItem(
              "trash-outline",
              "Supprimer le compte",
              () => setConfirmationModalVisible(true),
              false,
              null,
              "#F44336"
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.area,
        { backgroundColor: dark ? COLORS.dark1 : colors.background },
      ]}
    >
      <View style={styles.container}>
        {renderHeader()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderProfile()}
          {renderSettings()}
        </ScrollView>
      </View>

      {/* Logout Bottom Sheet */}
      <RBSheet
        ref={refRBSheet}
        closeOnPressMask
        height={280}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          draggableIcon: {
            backgroundColor: dark ? COLORS.gray2 : COLORS.grayscale200,
            width: 40,
            height: 5,
          },
          container: {
            borderTopRightRadius: 24,
            borderTopLeftRadius: 24,
            backgroundColor: dark ? COLORS.dark1 : COLORS.white,
            paddingTop: 16,
          },
        }}
      >
        <View style={styles.logoutSheetContent}>
          <View style={styles.logoutIconContainer}>
            <Ionicons name="log-out" size={32} color={COLORS.primary} />
          </View>

          <Text
            style={[
              styles.logoutTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Déconnexion
          </Text>

          <Text
            style={[
              styles.logoutSubtitle,
              { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
            ]}
          >
            Êtes-vous sûr de vouloir vous déconnecter ?
          </Text>

          <View style={styles.logoutButtonsContainer}>
            <TouchableOpacity
              style={styles.confirmLogoutButton}
              onPress={() => refRBSheet.current.close()}
            >
              <Text style={styles.confirmLogoutText}>Oui, déconnexion</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.cancelLogoutButton,
                { backgroundColor: dark ? COLORS.dark3 : COLORS.greyscale100 },
              ]}
              onPress={() => refRBSheet.current.close()}
            >
              <Text
                style={[
                  styles.cancelLogoutText,
                  { color: dark ? COLORS.white : COLORS.greyscale900 },
                ]}
              >
                Annuler
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>

      {/* Language Selection Modal */}
      <Modal visible={isLanguageModalOpen} transparent animationType="slide">
        <View style={styles.languageModalContainer}>
          <View
            style={[
              styles.languageModalContent,
              { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
            ]}
          >
            <View style={styles.modalDragHandle} />

            <View style={styles.languageModalHeader}>
              <Text
                style={[
                  styles.languageModalTitle,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Choisir une langue
              </Text>
              <TouchableOpacity
                style={styles.closeLanguageButton}
                onPress={() => setIsLanguageModalOpen(false)}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={dark ? COLORS.white : COLORS.greyscale900}
                />
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
                  onPress={() => {
                    setSelectedLanguage(item.value);
                    setIsLanguageModalOpen(false);
                  }}
                >
                  <View style={styles.languageOptionFlag}>
                    <CountryFlag isoCode={item.countryCode} size={22} />
                  </View>
                  <Text
                    style={[
                      styles.languageOptionText,
                      { color: dark ? COLORS.white : COLORS.greyscale900 },
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

      {renderDeleteConfirmModal()}
      {renderProfileModal()}
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
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomColor: "rgba(0,0,0,0.05)",
    borderBottomWidth: 0,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "bold",
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  profileCard: {
    borderRadius: 16,
    overflow: "hidden",
    margin: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileCardHeader: {
    padding: 16,
    paddingBottom: 20,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileAvatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  profileAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  initialsContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  initialsText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontFamily: "bold",
  },
  profileStatusDot: {
    position: "absolute",
    bottom: 3,
    right: 3,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  nameEmailContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontFamily: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    fontFamily: "medium",
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 8,
  },
  editProfileText: {
    marginLeft: 6,
    color: "#FFFFFF",
    fontFamily: "medium",
    fontSize: 14,
  },
  phoneNumberContainer: {
    padding: 16,
  },
  phoneNumberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  phoneIcon: {
    marginRight: 8,
  },
  phoneLabel: {
    fontSize: 14,
    fontFamily: "medium",
  },
  phoneValue: {
    fontSize: 16,
    fontFamily: "medium",
    marginLeft: 26,
  },
  settingsContainer: {
    paddingHorizontal: 16,
  },
  settingsGroupContainer: {
    marginBottom: 24,
  },
  settingsGroupTitle: {
    fontSize: 14,
    fontFamily: "medium",
    textTransform: "uppercase",
    marginBottom: 12,
    marginLeft: 8,
  },
  settingsGroupCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  settingsItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  settingsItemLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsItemIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingsItemText: {
    fontSize: 16,
    fontFamily: "medium",
  },
  settingsItemRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsItemRightText: {
    fontSize: 14,
    fontFamily: "medium",
    marginRight: 8,
  },
  switch: {
    transform: [{ scale: 0.8 }],
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
  },
  modalContent: {
    width: "100%",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 10,
  },
  modalDragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 2.5,
    marginBottom: 16,
  },
  editTitle: {
    fontSize: 20,
    fontFamily: "bold",
    marginBottom: 24,
  },
  profileImageEdit: {
    position: "relative",
    marginBottom: 24,
  },
  editProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "rgba(0,0,0,0.05)",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  inputsContainer: {
    width: "100%",
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontFamily: "semibold",
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontFamily: "semibold",
    fontSize: 16,
  },
  modalHeaderIcon: {
    marginBottom: 24,
  },
  warningCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F44336",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteTitle: {
    fontSize: 20,
    fontFamily: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  deleteSubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  confirmDeleteButton: {
    flex: 1,
    backgroundColor: "#F44336",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmDeleteText: {
    color: "#FFFFFF",
    fontFamily: "semibold",
    fontSize: 16,
  },
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
  logoutSheetContent: {
    padding: 24,
    alignItems: "center",
  },
  logoutIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoutTitle: {
    fontSize: 20,
    fontFamily: "bold",
    marginBottom: 8,
  },
  logoutSubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  logoutButtonsContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  confirmLogoutButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmLogoutText: {
    color: "#FFFFFF",
    fontFamily: "semibold",
    fontSize: 16,
  },
  cancelLogoutButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelLogoutText: {
    fontFamily: "semibold",
    fontSize: 16,
  },
});

export default SettingsScreen;
