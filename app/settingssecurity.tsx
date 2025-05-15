import Header from "@/components/Header";
import { useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import { reducer } from "@/utils/reducers/formReducers";
import { ScrollView } from "react-native-virtualized-view";
import { validateInput } from "@/utils/actions/formActions";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useRef, useMemo, useState, useReducer } from "react";
import {
  View,
  Text,
  Modal,
  Switch,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import Input from "../components/Input";
import { useTheme } from "../theme/ThemeProvider";
import { icons, SIZES, COLORS, illustrations } from "../constants";

interface Device {
  id: string;
  name: string;
  type: "android" | "ios" | "web" | "desktop";
  connectionDate: string;
  isActive: boolean;
  lastActivity: string;
}

interface PaymentMethod {
  id: string;
  cardNumber: string;
  cardType: "visa" | "mastercard" | "amex" | "paypal";
  expiryDate: string;
  isActive: boolean;
  lastUsed: string;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    cardNumber: "**** **** **** 4582",
    cardType: "visa",
    expiryDate: "05/26",
    isActive: true,
    lastUsed: "Hier",
  },
  {
    id: "2",
    cardNumber: "**** **** **** 7891",
    cardType: "mastercard",
    expiryDate: "09/25",
    isActive: false,
    lastUsed: "Il y a 2 semaines",
  },
  {
    id: "3",
    cardNumber: "Compte PayPal",
    cardType: "paypal",
    expiryDate: "N/A",
    isActive: true,
    lastUsed: "Il y a 5 jours",
  },
];

const mockDevices: Device[] = [
  {
    id: "1",
    name: "Mon téléphone",
    type: "android",
    connectionDate: "25 Mars 2025",
    isActive: true,
    lastActivity: "Connecté",
  },
  {
    id: "2",
    name: "iPhone Pro",
    type: "ios",
    connectionDate: "20 Mars 2025",
    isActive: false,
    lastActivity: "Il y a 2 jours",
  },
  {
    id: "3",
    name: "Chrome - Windows",
    type: "web",
    connectionDate: "15 Mars 2025",
    isActive: false,
    lastActivity: "Il y a 5 jours",
  },
  {
    id: "4",
    name: "MacBook Pro",
    type: "desktop",
    connectionDate: "10 Mars 2025",
    isActive: false,
    lastActivity: "Il y a 1 semaine",
  },
];

// Main section types
type SectionType =
  | "devices"
  | "changePassword"
  | "resetPassword"
  | "paymentMode";

// Component props
interface SectionCardProps {
  title: string;
  icon: string;
  dark: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

interface ThemedSectionProps {
  dark: boolean;
  isOpen: boolean;
}

// Types for password form
interface PasswordFormState {
  inputValues: {
    password: string;
    newPassword: string;
    confirmNewPassword: string;
  };
  inputValidities: {
    password: boolean | undefined;
    newPassword: boolean | undefined;
    confirmNewPassword: boolean | undefined;
  };
  formIsValid: boolean;
}

// Types for email form
interface EmailFormState {
  inputValues: {
    email: string;
  };
  inputValidities: {
    email: boolean | undefined;
  };
  formIsValid: boolean;
}

type Nav = {
  navigate: (value: string) => void;
};

// Section Card Component
const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon,
  dark,
  isOpen,
  onToggle,
}) => (
  <TouchableOpacity
    onPress={onToggle}
    style={[
      styles.sectionCard,
      isOpen && styles.sectionCardActive,
      { backgroundColor: dark ? COLORS.dark2 : "#FFFFFF" },
    ]}
    activeOpacity={0.8}
  >
    <View style={styles.sectionCardHeader}>
      <View style={styles.sectionIconContainer}>
        <LinearGradient
          colors={isOpen ? [COLORS.primary, "#ff7043"] : ["#E8E8E8", "#F8F9FA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.sectionIconGradient}
        >
          <Ionicons
            name={icon as any}
            size={20}
            color={isOpen ? "#FFFFFF" : COLORS.primary}
          />
        </LinearGradient>
      </View>
      <Text
        style={[
          styles.sectionTitle,
          { color: dark ? COLORS.white : COLORS.black },
        ]}
      >
        {title}
      </Text>
      <View
        style={[
          styles.sectionExpandIcon,
          { backgroundColor: dark ? COLORS.dark3 : "#F8F9FA" },
        ]}
      >
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={16}
          color={dark ? COLORS.greyscale500 : COLORS.greyscale600}
        />
      </View>
    </View>
  </TouchableOpacity>
);

// Connected Devices Component
const ConnectedDevices: React.FC<ThemedSectionProps> = ({ dark, isOpen }) => {
  const [devices] = useState<Device[]>(mockDevices);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const bottomSheetRef = useRef<any>(null);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "android":
        return "phone-portrait";
      case "ios":
        return "phone-portrait";
      case "web":
        return "globe";
      case "desktop":
        return "desktop";
      default:
        return "phone-portrait";
    }
  };

  const getDeviceIconColor = (type: string) => {
    switch (type) {
      case "android":
        return "#3DDC84";
      case "ios":
        return "#007AFF";
      case "web":
        return "#4285F4";
      case "desktop":
        return "#6C63FF";
      default:
        return COLORS.primary;
    }
  };

  const handleDevicePress = (device: Device) => {
    setSelectedDevice(device);
    bottomSheetRef.current?.open();
  };

  const handleLogout = (deviceId: string) => {
    console.log(`Logging out device with ID: ${deviceId}`);
    bottomSheetRef.current?.close();
    // Here you would implement your logout logic
  };

  if (!isOpen) return null;

  return (
    <View style={styles.sectionContent}>
      {devices.map((device) => (
        <TouchableOpacity
          key={device.id}
          style={[
            styles.deviceItem,
            { backgroundColor: dark ? COLORS.dark3 : "#F8F9FA" },
          ]}
          onPress={() => handleDevicePress(device)}
          activeOpacity={0.7}
        >
          <View style={styles.deviceItemLeft}>
            <View
              style={[
                styles.deviceIconContainer,
                { backgroundColor: `${getDeviceIconColor(device.type)}20` },
              ]}
            >
              <Ionicons
                name={getDeviceIcon(device.type) as any}
                size={20}
                color={getDeviceIconColor(device.type)}
              />
            </View>
            <View style={styles.deviceInfo}>
              <Text
                style={[
                  styles.deviceName,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                {device.name}
              </Text>
              <Text
                style={[
                  styles.deviceDate,
                  { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
                ]}
              >
                {device.connectionDate}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.deviceStatus,
              {
                backgroundColor: device.isActive
                  ? "#4CAF5020"
                  : dark
                    ? COLORS.dark2
                    : "#EEEEEE",
              },
            ]}
          >
            <Text
              style={[
                styles.deviceStatusText,
                {
                  color: device.isActive
                    ? "#4CAF50"
                    : dark
                      ? COLORS.greyscale500
                      : COLORS.greyscale600,
                },
              ]}
            >
              {device.isActive ? "Actif" : "Inactif"}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Bottom Sheet for device details */}
      <RBSheet
        ref={bottomSheetRef}
        closeOnPressMask
        height={380}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          draggableIcon: {
            backgroundColor: dark ? COLORS.greyscale500 : COLORS.grayscale400,
            width: 40,
            height: 5,
          },
          container: {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            backgroundColor: dark ? COLORS.dark1 : COLORS.white,
            padding: 16,
          },
        }}
      >
        {selectedDevice ? (
          <View style={styles.deviceSheet}>
            <View style={styles.deviceSheetHeader}>
              <View
                style={[
                  styles.deviceIconLarge,
                  {
                    backgroundColor: `${getDeviceIconColor(selectedDevice.type)}20`,
                  },
                ]}
              >
                <Ionicons
                  name={getDeviceIcon(selectedDevice.type) as any}
                  size={28}
                  color={getDeviceIconColor(selectedDevice.type)}
                />
              </View>

              <Text
                style={[
                  styles.deviceSheetTitle,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                {selectedDevice.name}
              </Text>

              <Text
                style={[
                  styles.deviceSheetSubtitle,
                  { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
                ]}
              >
                Dernière activité: {selectedDevice.lastActivity}
              </Text>
            </View>

            <View style={styles.deviceDetailsList}>
              <View style={styles.deviceDetailItem}>
                <Text
                  style={[
                    styles.deviceDetailLabel,
                    { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
                  ]}
                >
                  Date de connexion
                </Text>
                <Text
                  style={[
                    styles.deviceDetailValue,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  {selectedDevice.connectionDate}
                </Text>
              </View>

              <View style={styles.deviceDetailItem}>
                <Text
                  style={[
                    styles.deviceDetailLabel,
                    { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
                  ]}
                >
                  Statut
                </Text>
                <View style={styles.deviceStatusToggle}>
                  <Text
                    style={[
                      styles.deviceStatusLabel,
                      { color: dark ? COLORS.white : COLORS.black },
                    ]}
                  >
                    {selectedDevice.isActive ? "Actif" : "Inactif"}
                  </Text>
                  <Switch
                    value={selectedDevice.isActive}
                    onValueChange={(value) =>
                      console.log(`Device status changed to: ${value}`)
                    }
                    trackColor={{
                      false: dark ? COLORS.dark3 : "#EEEEEE",
                      true: COLORS.primary,
                    }}
                    thumbColor={COLORS.white}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.logoutButton,
                { backgroundColor: dark ? COLORS.dark3 : "#FFE5E5" },
              ]}
              onPress={() => handleLogout(selectedDevice.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="log-out"
                size={18}
                color="#F44336"
                style={styles.logoutIcon}
              />
              <Text style={styles.logoutButtonText}>
                Déconnecter cet appareil
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}
      </RBSheet>
    </View>
  );
};

// Change Password Component
const ChangePasswordSection: React.FC<ThemedSectionProps> = ({
  dark,
  isOpen,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { navigate } = useNavigation<Nav>();
  const initialState: PasswordFormState = {
    inputValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    inputValidities: {
      password: undefined,
      newPassword: undefined,
      confirmNewPassword: undefined,
    },
    formIsValid: false,
  };

  const renderModal = () => {
    return (
      <Modal animationType="slide" transparent visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                },
              ]}
            >
              <View style={styles.successIconContainer}>
                <LinearGradient
                  colors={[COLORS.primary, "#3CAE5C"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.successIconGradient}
                >
                  <Ionicons name="checkmark" size={40} color="#FFFFFF" />
                </LinearGradient>
              </View>

              <Text style={styles.modalTitle}>
                Mot de passe modifié avec succès!
              </Text>

              <Text
                style={[
                  styles.modalDescription,
                  { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
                ]}
              >
                Lors de la prochaine connexion, veuillez utiliser le nouveau mot
                de passe.
              </Text>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => {
                  setModalVisible(false);
                  navigate("(tabs)");
                }}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[COLORS.primary, "#ff7043"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.continueGradient}
                >
                  <Text style={styles.continueText}>Continuer</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color="#FFFFFF"
                    style={styles.continueIcon}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = React.useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      });
    },
    []
  );

  if (!isOpen) return null;

  return (
    <View style={styles.sectionContent}>
      <View
        style={[
          styles.formContainer,
          { backgroundColor: dark ? COLORS.dark2 : "#FFFFFF" },
        ]}
      >
        <Text
          style={[
            styles.formInstructions,
            { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
          ]}
        >
          Vous pouvez modifier votre mot de passe ici. Assurez-vous qu'il
          contient au moins 8 caractères.
        </Text>

        <View style={styles.formInputs}>
          <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.password}
            autoCapitalize="none"
            id="password"
            placeholder="Ancien mot de passe"
            placeholderTextColor={
              dark ? COLORS.greyscale500 : COLORS.grayscale400
            }
            icon={icons.padlock}
            secureTextEntry
            value={formState.inputValues.password}
          />

          <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.newPassword}
            autoCapitalize="none"
            id="newPassword"
            placeholder="Nouveau mot de passe"
            placeholderTextColor={
              dark ? COLORS.greyscale500 : COLORS.grayscale400
            }
            icon={icons.padlock}
            secureTextEntry
            value={formState.inputValues.newPassword}
          />

          <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.confirmNewPassword}
            autoCapitalize="none"
            id="confirmNewPassword"
            placeholder="Confirmer nouveau mot de passe"
            placeholderTextColor={
              dark ? COLORS.greyscale500 : COLORS.grayscale400
            }
            icon={icons.padlock}
            secureTextEntry
            value={formState.inputValues.confirmNewPassword}
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[COLORS.primary, "#ff7043"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveGradient}
          >
            <Text style={styles.saveText}>Enregistrer</Text>
            <Ionicons
              name="save-outline"
              size={18}
              color="#FFFFFF"
              style={styles.saveIcon}
            />
          </LinearGradient>
        </TouchableOpacity>

        {renderModal()}
      </View>
    </View>
  );
};

// Reset Password Component
const ResetPasswordSection: React.FC<ThemedSectionProps> = ({
  dark,
  isOpen,
}) => {
  const { navigate } = useNavigation<Nav>();
  const initialState: EmailFormState = {
    inputValues: {
      email: "",
    },
    inputValidities: {
      email: undefined,
    },
    formIsValid: false,
  };

  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = React.useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      });
    },
    []
  );

  if (!isOpen) return null;

  return (
    <View style={styles.sectionContent}>
      <View
        style={[
          styles.formContainer,
          { backgroundColor: dark ? COLORS.dark2 : "#FFFFFF" },
        ]}
      >
        <Text
          style={[
            styles.formInstructions,
            { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
          ]}
        >
          Saisissez votre adresse e-mail pour recevoir un lien de
          réinitialisation de mot de passe.
        </Text>

        <Input
          onInputChanged={inputChangedHandler}
          errorText={formState.inputValidities.email}
          autoCapitalize="none"
          id="email"
          placeholder="Saisir votre email"
          placeholderTextColor={
            dark ? COLORS.greyscale500 : COLORS.grayscale400
          }
          icon={icons.email}
          keyboardType="email-address"
          value={formState.inputValues.email}
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => navigate("settingscodeverification")}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[COLORS.primary, "#ff7043"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.sendGradient}
          >
            <Text style={styles.sendText}>Envoyer</Text>
            <Ionicons
              name="send"
              size={18}
              color="#FFFFFF"
              style={styles.sendIcon}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Payment Method Section Component
const PaymentMethodSection: React.FC<ThemedSectionProps> = ({
  dark,
  isOpen,
}) => {
  const [paymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const paymentBottomSheetRef = useRef<any>(null);

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case "visa":
        return "card";
      case "mastercard":
        return "card";
      case "amex":
        return "card";
      case "paypal":
        return "logo-paypal";
      default:
        return "card";
    }
  };

  const getPaymentColor = (type: string) => {
    switch (type) {
      case "visa":
        return "#1A1F71";
      case "mastercard":
        return "#EB001B";
      case "amex":
        return "#006FCF";
      case "paypal":
        return "#003087";
      default:
        return COLORS.primary;
    }
  };

  const handlePaymentMethodPress = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    paymentBottomSheetRef.current?.open();
  };

  const handleRemovePaymentMethod = (paymentMethodId: string) => {
    // payment method removal logic
    paymentBottomSheetRef.current?.close();
  };

  if (!isOpen) return null;

  return (
    <View style={styles.sectionContent}>
      {paymentMethods.map((paymentMethod) => (
        <TouchableOpacity
          key={paymentMethod.id}
          style={[
            styles.paymentMethodItem,
            { backgroundColor: dark ? COLORS.dark3 : "#F8F9FA" },
          ]}
          onPress={() => handlePaymentMethodPress(paymentMethod)}
          activeOpacity={0.7}
        >
          <View style={styles.paymentMethodLeft}>
            <View
              style={[
                styles.paymentIconContainer,
                {
                  backgroundColor: `${getPaymentColor(paymentMethod.cardType)}20`,
                },
              ]}
            >
              <Ionicons
                name={getPaymentIcon(paymentMethod.cardType) as any}
                size={20}
                color={getPaymentColor(paymentMethod.cardType)}
              />
            </View>
            <View style={styles.paymentInfo}>
              <Text
                style={[
                  styles.paymentCardNumber,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                {paymentMethod.cardNumber}
              </Text>
              {paymentMethod.expiryDate !== "N/A" && (
                <Text
                  style={[
                    styles.paymentExpiry,
                    { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
                  ]}
                >
                  Expire: {paymentMethod.expiryDate}
                </Text>
              )}
            </View>
          </View>

          <View
            style={[
              styles.paymentStatus,
              {
                backgroundColor: paymentMethod.isActive
                  ? "#4CAF5020"
                  : dark
                    ? COLORS.dark2
                    : "#EEEEEE",
              },
            ]}
          >
            <Text
              style={[
                styles.paymentStatusText,
                {
                  color: paymentMethod.isActive
                    ? "#4CAF50"
                    : dark
                      ? COLORS.greyscale500
                      : COLORS.greyscale600,
                },
              ]}
            >
              {paymentMethod.isActive ? "Actif" : "Inactif"}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Payment Method Bottom Sheet */}
      <RBSheet
        ref={paymentBottomSheetRef}
        closeOnPressMask
        height={380}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          draggableIcon: {
            backgroundColor: dark ? COLORS.greyscale500 : COLORS.grayscale400,
            width: 40,
            height: 5,
          },
          container: {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            backgroundColor: dark ? COLORS.dark1 : COLORS.white,
            padding: 16,
          },
        }}
      >
        {selectedPaymentMethod ? (
          <View style={styles.paymentSheet}>
            <View style={styles.paymentSheetHeader}>
              <View
                style={[
                  styles.paymentIconLarge,
                  {
                    backgroundColor: `${getPaymentColor(selectedPaymentMethod.cardType)}20`,
                  },
                ]}
              >
                <Ionicons
                  name={getPaymentIcon(selectedPaymentMethod.cardType) as any}
                  size={28}
                  color={getPaymentColor(selectedPaymentMethod.cardType)}
                />
              </View>

              <Text
                style={[
                  styles.paymentSheetTitle,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                {selectedPaymentMethod.cardNumber}
              </Text>

              <Text
                style={[
                  styles.paymentSheetSubtitle,
                  { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
                ]}
              >
                Dernière utilisation: {selectedPaymentMethod.lastUsed}
              </Text>
            </View>

            <View style={styles.paymentDetailsList}>
              <View style={styles.paymentDetailItem}>
                <Text
                  style={[
                    styles.paymentDetailLabel,
                    { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
                  ]}
                >
                  Date d'expiration
                </Text>
                <Text
                  style={[
                    styles.paymentDetailValue,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  {selectedPaymentMethod.expiryDate}
                </Text>
              </View>

              <View style={styles.paymentDetailItem}>
                <Text
                  style={[
                    styles.paymentDetailLabel,
                    { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
                  ]}
                >
                  Statut
                </Text>
                <View style={styles.paymentStatusToggle}>
                  <Text
                    style={[
                      styles.paymentStatusLabel,
                      { color: dark ? COLORS.white : COLORS.black },
                    ]}
                  >
                    {selectedPaymentMethod.isActive ? "Actif" : "Inactif"}
                  </Text>
                  <Switch
                    value={selectedPaymentMethod.isActive}
                    onValueChange={(value) =>
                      console.log(`Payment method status changed to: ${value}`)
                    }
                    trackColor={{
                      false: dark ? COLORS.dark3 : "#EEEEEE",
                      true: COLORS.primary,
                    }}
                    thumbColor={COLORS.white}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.removeButton,
                { backgroundColor: dark ? COLORS.dark3 : "#FFE5E5" },
              ]}
              onPress={() =>
                handleRemovePaymentMethod(selectedPaymentMethod.id)
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name="trash"
                size={18}
                color="#F44336"
                style={styles.removeIcon}
              />
              <Text style={styles.removeButtonText}>
                Supprimer cette méthode de paiement
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}
      </RBSheet>
    </View>
  );
};

// Main component
const SettingsSecurity = () => {
  const { colors, dark } = useTheme();

  const [openSections, setOpenSections] = useState<
    Record<SectionType, boolean>
  >({
    devices: true,
    changePassword: false,
    resetPassword: false,
    paymentMode: false,
  });

  const toggleSection = (section: SectionType) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Sécurité" />

        <ScrollView
          style={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.pageHeaderContainer}>
            <LinearGradient
              colors={[COLORS.primary, "#ff7043"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.pageHeaderGradient}
            >
              <Ionicons name="shield-checkmark" size={24} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.pageHeaderTextContainer}>
              <Text
                style={[
                  styles.pageHeaderTitle,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Paramètres de sécurité
              </Text>
              <Text
                style={[
                  styles.pageHeaderSubtitle,
                  { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
                ]}
              >
                Gérez les appareils, mots de passe et moyens de paiement
              </Text>
            </View>
          </View>

          <View style={styles.sectionsContainer}>
            {/* Devices Section */}
            <SectionCard
              title="Appareils connectés"
              icon="devices"
              dark={dark}
              isOpen={openSections.devices}
              onToggle={() => toggleSection("devices")}
            />
            <ConnectedDevices dark={dark} isOpen={openSections.devices} />

            {/* Change Password Section */}
            <SectionCard
              title="Modifier mot de passe"
              icon="key"
              dark={dark}
              isOpen={openSections.changePassword}
              onToggle={() => toggleSection("changePassword")}
            />
            <ChangePasswordSection
              dark={dark}
              isOpen={openSections.changePassword}
            />

            {/* Reset Password Section */}
            <SectionCard
              title="Réinitialiser mot de passe"
              icon="refresh-circle"
              dark={dark}
              isOpen={openSections.resetPassword}
              onToggle={() => toggleSection("resetPassword")}
            />
            <ResetPasswordSection
              dark={dark}
              isOpen={openSections.resetPassword}
            />

            {/* Payment Methods Section */}
            <SectionCard
              title="Mes cartes"
              icon="card"
              dark={dark}
              isOpen={openSections.paymentMode}
              onToggle={() => toggleSection("paymentMode")}
            />
            <PaymentMethodSection
              dark={dark}
              isOpen={openSections.paymentMode}
            />
          </View>

          <View style={styles.securityTipContainer}>
            <View style={styles.securityTipHeader}>
              <Ionicons
                name="information-circle"
                size={20}
                color={COLORS.primary}
              />
              <Text
                style={[
                  styles.securityTipTitle,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Astuce sécurité
              </Text>
            </View>
            <Text
              style={[
                styles.securityTipText,
                { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
              ]}
            >
              Pour une meilleure sécurité, changez votre mot de passe
              régulièrement et utilisez l'authentification à deux facteurs
              lorsque disponible.
            </Text>
          </View>
        </ScrollView>
      </View>
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
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  pageHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 24,
  },
  pageHeaderGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  pageHeaderTextContainer: {
    flex: 1,
  },
  pageHeaderTitle: {
    fontSize: 20,
    fontFamily: "bold",
    marginBottom: 4,
  },
  pageHeaderSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "regular",
  },
  sectionsContainer: {
    padding: 16,
  },
  sectionCard: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionCardActive: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  sectionCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIconContainer: {
    marginRight: 16,
  },
  sectionIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "semibold",
    flex: 1,
  },
  sectionExpandIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionContent: {
    marginTop: -16,
    marginBottom: 16,
    paddingBottom: 8,
  },
  // Device Styles
  deviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  deviceItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 15,
    fontFamily: "medium",
    marginBottom: 4,
  },
  deviceDate: {
    fontSize: 13,
    fontFamily: "regular",
  },
  deviceStatus: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  deviceStatusText: {
    fontSize: 12,
    fontFamily: "medium",
  },
  // Device Sheet Styles
  deviceSheet: {
    flex: 1,
  },
  deviceSheetHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  deviceIconLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  deviceSheetTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 4,
  },
  deviceSheetSubtitle: {
    fontSize: 14,
    fontFamily: "regular",
  },
  deviceDetailsList: {
    marginBottom: 24,
  },
  deviceDetailItem: {
    marginBottom: 16,
  },
  deviceDetailLabel: {
    fontSize: 14,
    fontFamily: "regular",
    marginBottom: 8,
  },
  deviceDetailValue: {
    fontSize: 16,
    fontFamily: "medium",
  },
  deviceStatusToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deviceStatusLabel: {
    fontSize: 16,
    fontFamily: "medium",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: "#F44336",
    fontSize: 16,
    fontFamily: "medium",
  },
  // Form Styles
  formContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  formInstructions: {
    fontSize: 14,
    fontFamily: "regular",
    marginBottom: 16,
    lineHeight: 20,
  },
  formInputs: {
    marginBottom: 16,
  },
  saveButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "semibold",
    marginRight: 8,
  },
  saveIcon: {
    marginLeft: 4,
  },
  sendButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  sendGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  sendText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "semibold",
    marginRight: 8,
  },
  sendIcon: {
    marginLeft: 4,
  },
  // Payment Method Styles
  paymentMethodItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  paymentMethodLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentCardNumber: {
    fontSize: 15,
    fontFamily: "medium",
    marginBottom: 4,
  },
  paymentExpiry: {
    fontSize: 13,
    fontFamily: "regular",
  },
  paymentStatus: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  paymentStatusText: {
    fontSize: 12,
    fontFamily: "medium",
  },
  // Payment Sheet Styles
  paymentSheet: {
    flex: 1,
  },
  paymentSheetHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  paymentIconLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  paymentSheetTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 4,
  },
  paymentSheetSubtitle: {
    fontSize: 14,
    fontFamily: "regular",
  },
  paymentDetailsList: {
    marginBottom: 24,
  },
  paymentDetailItem: {
    marginBottom: 16,
  },
  paymentDetailLabel: {
    fontSize: 14,
    fontFamily: "regular",
    marginBottom: 8,
  },
  paymentDetailValue: {
    fontSize: 16,
    fontFamily: "medium",
  },
  paymentStatusToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentStatusLabel: {
    fontSize: 16,
    fontFamily: "medium",
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  removeIcon: {
    marginRight: 8,
  },
  removeButtonText: {
    color: "#F44336",
    fontSize: 16,
    fontFamily: "medium",
  },
  // Security Tip Styles
  securityTipContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: `${COLORS.primary}10`,
  },
  securityTipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  securityTipTitle: {
    fontSize: 16,
    fontFamily: "semibold",
    marginLeft: 8,
  },
  securityTipText: {
    fontSize: 14,
    fontFamily: "regular",
    lineHeight: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  successIconContainer: {
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  successIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    fontFamily: "regular",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  continueButton: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "semibold",
  },
  continueIcon: {
    marginLeft: 8,
  },
});

export default SettingsSecurity;
