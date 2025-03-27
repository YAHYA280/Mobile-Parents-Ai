import { Image } from "expo-image";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { useNavigation } from "expo-router";
import RBSheet from "react-native-raw-bottom-sheet";
import { reducer } from "@/utils/reducers/formReducers";
import { ScrollView } from "react-native-virtualized-view";
import { validateInput } from "@/utils/actions/formActions";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useRef, useMemo, useState, useReducer } from "react";
import PaymentMethodItemConnected from "@/components/PaymentMethodItemConnected";
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

// Component props
interface SectionHeaderProps {
  title: string;
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

// Section Header Component
const SectionHeader: React.FC<SectionHeaderProps> = React.memo(
  // eslint-disable-next-line react/prop-types
  ({ title, dark, isOpen, onToggle }) => (
    <TouchableOpacity
      onPress={onToggle}
      style={[
        styles.accordionHeader,
        {
          backgroundColor: dark ? COLORS.primary : COLORS.primary,
          borderRadius: 32,
          borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
        },
      ]}
    >
      <Text
        style={[
          styles.accordionTitle,
          {
            color: dark ? COLORS.dark1 : COLORS.white,
          },
        ]}
      >
        {title}
      </Text>
      <Image
        source={icons.arrowRight}
        contentFit="contain"
        style={[
          styles.arrowIcon,
          {
            tintColor: dark ? COLORS.dark1 : COLORS.white,
            transform: [{ rotate: isOpen ? "90deg" : "0deg" }],
          },
        ]}
      />
    </TouchableOpacity>
  )
);

// Connected Devices Component
const ConnectedDevices: React.FC<ThemedSectionProps> = React.memo(
  // eslint-disable-next-line react/prop-types
  ({ dark, isOpen }) => {
    const [devices] = useState<Device[]>(mockDevices);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const bottomSheetRef = useRef<any>(null);

    const getDeviceIcon = (type: string) => {
      switch (type) {
        case "android":
          return icons.android;
        case "ios":
          return icons.apple;
        case "web":
          return icons.globe;
        case "desktop":
          return icons.laptop;
        default:
          return icons.android;
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
              { backgroundColor: dark ? COLORS.black : COLORS.white },
            ]}
            onPress={() => handleDevicePress(device)}
          >
            <View style={styles.deviceInfo}>
              <Image
                source={getDeviceIcon(device.type)}
                contentFit="contain"
                style={styles.deviceIcon}
              />
              <View>
                <Text
                  style={[
                    styles.deviceName,
                    {
                      color: dark ? COLORS.white : COLORS.black,
                      marginBottom: 5,
                    },
                  ]}
                >
                  {device.name}
                </Text>
                <Text style={styles.deviceDate}>{device.connectionDate}</Text>
              </View>
            </View>
            <Image
              source={icons.arrowRight}
              contentFit="contain"
              style={[
                styles.arrowRightIcon,
                {
                  tintColor: dark ? COLORS.primary : COLORS.primary,
                },
              ]}
            />
          </TouchableOpacity>
        ))}

        {/* Bottom Sheet for device details */}
        <RBSheet
          ref={bottomSheetRef}
          closeOnPressMask
          height={350}
          customStyles={{
            wrapper: {
              backgroundColor: "rgba(0,0,0,0.5)",
            },
            draggableIcon: {
              backgroundColor: dark ? COLORS.greyscale500 : COLORS.grayscale400,
            },
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            },
          }}
        >
          {selectedDevice ? (
            <View style={styles.bottomSheetContent}>
              <View style={styles.deviceDetailHeader}>
                <Image
                  source={getDeviceIcon(selectedDevice.type)}
                  contentFit="contain"
                  style={styles.deviceDetailIcon}
                />
                <Text
                  style={[
                    styles.deviceDetailName,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  {selectedDevice.name}
                </Text>
              </View>

              <View style={styles.deviceDetailInfo}>
                <Text
                  style={[
                    styles.deviceDetailLabel,
                    {
                      color: dark ? COLORS.secondaryWhite : COLORS.greyscale600,
                    },
                  ]}
                >
                  Dernière activité
                </Text>
                <Text
                  style={[
                    styles.deviceDetailValue,
                    { color: dark ? COLORS.white : COLORS.primary },
                  ]}
                >
                  {selectedDevice.lastActivity}
                </Text>
              </View>

              <View style={styles.deviceDetailInfo}>
                <Text
                  style={[
                    styles.deviceDetailLabel,
                    {
                      color: dark ? COLORS.secondaryWhite : COLORS.greyscale600,
                    },
                  ]}
                >
                  Date de connexion
                </Text>
                <Text
                  style={[
                    styles.deviceDetailValue,
                    { color: dark ? COLORS.white : COLORS.primary },
                  ]}
                >
                  {selectedDevice.connectionDate}
                </Text>
              </View>

              <View style={styles.activeStatusContainer}>
                <Text
                  style={[
                    styles.deviceDetailLabel,
                    {
                      color: dark ? COLORS.secondaryWhite : COLORS.greyscale600,
                    },
                  ]}
                >
                  Actif
                </Text>
                <Switch
                  value={selectedDevice.isActive}
                  onValueChange={(value) =>
                    console.log(`Device status changed to: ${value}`)
                  }
                  trackColor={{
                    false: dark ? COLORS.dark3 : COLORS.greyscale300,
                    true: COLORS.primary,
                  }}
                  thumbColor={COLORS.white}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.logoutButton,
                  {
                    backgroundColor: dark ? COLORS.dark3 : COLORS.white,
                    borderColor: COLORS.error,
                  },
                ]}
                onPress={() => handleLogout(selectedDevice.id)}
              >
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
  }
);

// Change Password Component
const ChangePasswordSection: React.FC<ThemedSectionProps> = React.memo(
  // eslint-disable-next-line react/prop-types
  ({ dark, isOpen }) => {
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
            <View style={[styles.modalContainer]}>
              <View
                style={[
                  styles.modalSubContainer,
                  {
                    backgroundColor: dark
                      ? COLORS.dark2
                      : COLORS.secondaryWhite,
                  },
                ]}
              >
                <Image
                  source={illustrations.passwordSuccess}
                  resizeMode="contain"
                  style={styles.modalIllustration}
                />
                <Text style={styles.modalTitle}>
                  Mot de passe modifié avec succès!
                </Text>
                <Text
                  style={[
                    styles.modalSubtitle,
                    { color: dark ? COLORS.greyscale300 : COLORS.greyscale600 },
                  ]}
                >
                  Lors de la prochaine connexion, veuillez utiliser le nouveau
                  mot de passe.
                </Text>
                <Button
                  title="Continuer"
                  filled
                  onPress={() => {
                    setModalVisible(false);
                    navigate("(tabs)");
                  }}
                  style={{ width: "100%", marginTop: 12 }}
                />
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
            styles.passwordSection,
            { backgroundColor: dark ? COLORS.black : COLORS.white },
          ]}
        >
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

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.actionButtonText}>Enregistrer</Text>
          </TouchableOpacity>

          {renderModal()}
        </View>
      </View>
    );
  }
);

// Reset Password Component
const ResetPasswordSection: React.FC<ThemedSectionProps> = React.memo(
  // eslint-disable-next-line react/prop-types
  ({ dark, isOpen }) => {
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
            styles.passwordSection,
            { backgroundColor: dark ? COLORS.black : COLORS.white },
          ]}
        >
          <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.email}
            autoCapitalize="none"
            id="email"
            placeholder="Saisir votre email"
            placeholderTextColor={
              dark ? COLORS.greyscale500 : COLORS.grayscale400
            }
            icon={icons.padlock}
            keyboardType="email-address"
            value={formState.inputValues.email}
          />

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              navigate("settingscodeverification");
            }}
          >
            <Text style={styles.actionButtonText}>Envoyer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

// Payment Method Section Component
const PaymentMethodSection: React.FC<ThemedSectionProps> = React.memo(
  // eslint-disable-next-line react/prop-types
  ({ dark, isOpen }) => {
    const [paymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
    const [selectedPaymentMethod, setSelectedPaymentMethod] =
      useState<PaymentMethod | null>(null);
    const paymentBottomSheetRef = useRef<any>(null);

    const getPaymentIcon = (type: string) => {
      switch (type) {
        case "visa":
          return icons.visa || icons.creditCard;
        case "mastercard":
          return icons.mastercard || icons.creditCard;
        case "amex":
          return icons.amex || icons.creditCard;
        case "paypal":
          return icons.paypal;
        default:
          return icons.creditCard;
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
          <PaymentMethodItemConnected
            key={paymentMethod.id}
            title={paymentMethod.cardNumber}
            icon={getPaymentIcon(paymentMethod.cardType)}
            expiryDate={
              paymentMethod.expiryDate !== "N/A"
                ? paymentMethod.expiryDate
                : undefined
            }
            onPress={() => handlePaymentMethodPress(paymentMethod)}
          />
        ))}

        {/* Bottom Sheet for payment method details */}
        <RBSheet
          ref={paymentBottomSheetRef}
          closeOnPressMask
          height={350}
          customStyles={{
            wrapper: {
              backgroundColor: "rgba(0,0,0,0.5)",
            },
            draggableIcon: {
              backgroundColor: dark ? COLORS.greyscale500 : COLORS.grayscale400,
            },
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            },
          }}
        >
          {selectedPaymentMethod ? (
            <View style={styles.bottomSheetContent}>
              <View style={styles.deviceDetailHeader}>
                <Image
                  source={getPaymentIcon(selectedPaymentMethod.cardType)}
                  contentFit="contain"
                  style={styles.deviceDetailIcon}
                />
                <Text
                  style={[
                    styles.deviceDetailName,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  {selectedPaymentMethod.cardNumber}
                </Text>
              </View>

              <View style={styles.deviceDetailInfo}>
                <Text
                  style={[
                    styles.deviceDetailLabel,
                    {
                      color: dark ? COLORS.secondaryWhite : COLORS.greyscale600,
                    },
                  ]}
                >
                  Date d&apos;expiration
                </Text>
                <Text
                  style={[
                    styles.deviceDetailValue,
                    { color: dark ? COLORS.white : COLORS.primary },
                  ]}
                >
                  {selectedPaymentMethod.expiryDate}
                </Text>
              </View>

              <View style={styles.deviceDetailInfo}>
                <Text
                  style={[
                    styles.deviceDetailLabel,
                    {
                      color: dark ? COLORS.secondaryWhite : COLORS.greyscale600,
                    },
                  ]}
                >
                  Dernière utilisation
                </Text>
                <Text
                  style={[
                    styles.deviceDetailValue,
                    { color: dark ? COLORS.white : COLORS.primary },
                  ]}
                >
                  {selectedPaymentMethod.lastUsed}
                </Text>
              </View>

              <View style={styles.activeStatusContainer}>
                <Text
                  style={[
                    styles.deviceDetailLabel,
                    {
                      color: dark ? COLORS.secondaryWhite : COLORS.greyscale600,
                    },
                  ]}
                >
                  Actif
                </Text>
                <Switch
                  value={selectedPaymentMethod.isActive}
                  onValueChange={(value) =>
                    console.log(`Payment method status changed to: ${value}`)
                  }
                  trackColor={{
                    false: dark ? COLORS.dark3 : COLORS.greyscale300,
                    true: COLORS.primary,
                  }}
                  thumbColor={COLORS.white}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.logoutButton,
                  {
                    backgroundColor: dark ? COLORS.dark3 : COLORS.white,
                    borderColor: COLORS.error,
                  },
                ]}
                onPress={() =>
                  handleRemovePaymentMethod(selectedPaymentMethod.id)
                }
              >
                <Text style={styles.logoutButtonText}>
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
  }
);

// Main component
const SettingsSecurity = () => {
  const { colors, dark } = useTheme();

  const [openSections, setOpenSections] = useState({
    devices: true,
    changePassword: false,
    resetPassword: false,
    paymentMode: false,
  });

  const toggleDevicesSection = () => {
    setOpenSections((prev) => ({
      ...prev,
      devices: !prev.devices,
    }));
  };

  const toggleChangePasswordSection = () => {
    setOpenSections((prev) => ({
      ...prev,
      changePassword: !prev.changePassword,
    }));
  };

  const toggleResetPasswordSection = () => {
    setOpenSections((prev) => ({
      ...prev,
      resetPassword: !prev.resetPassword,
    }));
  };

  const togglePaymentModeSection = () => {
    setOpenSections((prev) => ({
      ...prev,
      paymentMode: !prev.paymentMode,
    }));
  };

  const dynamicMargin = useMemo(() => {
    const screenHeight = Dimensions.get("window").height;
    return screenHeight * 0.04;
  }, []);

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={{ marginBottom: dynamicMargin }}>
          <Header title="Sécurité" />
        </View>
        <ScrollView
          style={styles.settingsContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionContainer}>
            <SectionHeader
              title="Appareils connectés"
              dark={dark}
              isOpen={openSections.devices}
              onToggle={toggleDevicesSection}
            />
            <ConnectedDevices dark={dark} isOpen={openSections.devices} />
          </View>

          <View style={styles.sectionContainer}>
            <SectionHeader
              title="Modifier Mot de passe"
              dark={dark}
              isOpen={openSections.changePassword}
              onToggle={toggleChangePasswordSection}
            />
            <ChangePasswordSection
              dark={dark}
              isOpen={openSections.changePassword}
            />
          </View>

          <View style={styles.sectionContainer}>
            <SectionHeader
              title="Réinitialiser mot de passe"
              dark={dark}
              isOpen={openSections.resetPassword}
              onToggle={toggleResetPasswordSection}
            />
            <ResetPasswordSection
              dark={dark}
              isOpen={openSections.resetPassword}
            />
          </View>

          <View style={styles.sectionContainer}>
            <SectionHeader
              title="Mode de paiement"
              dark={dark}
              isOpen={openSections.paymentMode}
              onToggle={togglePaymentModeSection}
            />
            <PaymentMethodSection
              dark={dark}
              isOpen={openSections.paymentMode}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SettingsSecurity;

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  settingsContainer: {
    flex: 1,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalSubContainer: {
    height: 494,
    width: SIZES.width * 0.9,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginVertical: 12,
  },
  modalIllustration: {
    height: 180,
    width: 180,
    marginVertical: 22,
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.greyscale600,
    textAlign: "center",
    marginVertical: 12,
  },
  accordionTitle: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.greyscale900,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.greyscale900,
  },
  deviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
    padding: 12,
    paddingHorizontal: 15,
    marginHorizontal: 7,
    borderRadius: 10,
    marginBottom: 16,
  },
  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  deviceName: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.greyscale900,
  },
  deviceDate: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.primary,
  },
  arrowRightIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.greyscale900,
  },
  passwordSection: {
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    paddingHorizontal: 15,
    marginHorizontal: 7,
    borderRadius: 10,
    marginBottom: 16,
  },
  actionButton: {
    height: 46,
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  actionButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: "medium",
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionContent: {
    overflow: "hidden",
  },
  // Bottom Sheet Styles
  bottomSheetContent: {
    padding: 20,
  },
  deviceDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  deviceDetailIcon: {
    width: 32,
    height: 32,
    marginRight: 16,
  },
  deviceDetailName: {
    fontSize: 18,
    fontFamily: "medium",
  },
  deviceDetailInfo: {
    marginBottom: 15,
  },
  deviceDetailLabel: {
    fontSize: 14,
    fontFamily: "regular",
    marginBottom: 5,
  },
  deviceDetailValue: {
    fontSize: 16,
    fontFamily: "medium",
  },
  activeStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logoutButton: {
    height: 46,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  logoutButtonText: {
    color: COLORS.error,
    fontSize: 16,
    fontFamily: "medium",
  },
});
