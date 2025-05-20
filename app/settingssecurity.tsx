import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Import Header from ui components
import Header from "../components/ui/Header";
import { useTheme } from "../theme/ThemeProvider";
import { COLORS } from "../constants";
import { Device, PaymentMethod } from "../types/security";

// Import our component sections
import SecuritySectionCard from "../components/settings/SecuritySectionCard";
import ConnectedDevicesSection from "../components/settings/ConnectedDevicesSection";
import ChangePasswordSection from "../components/settings/ChangePasswordSection";
import ResetPasswordSection from "../components/settings/ResetPasswordSection";
import PaymentMethodsSection from "../components/settings/PaymentMethodsSection";

// Mock data
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

// Main component
const SettingsSecurity = () => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation();

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

  const [headerHeight, setHeaderHeight] = useState(0);
  const onHeaderLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer} onLayout={onHeaderLayout}>
        <Header title="Sécurité" onBackPress={() => navigation.goBack()} />
      </View>

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: headerHeight },
        ]}
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
          <SecuritySectionCard
            title="Appareils connectés"
            icon="hardware-chip"
            dark={dark}
            isOpen={openSections.devices}
            onToggle={() => toggleSection("devices")}
          />
          <ConnectedDevicesSection
            dark={dark}
            isOpen={openSections.devices}
            devices={mockDevices}
          />

          {/* Change Password Section */}
          <SecuritySectionCard
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
          <SecuritySectionCard
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
          <SecuritySectionCard
            title="Mes cartes"
            icon="card"
            dark={dark}
            isOpen={openSections.paymentMode}
            onToggle={() => toggleSection("paymentMode")}
          />
          <PaymentMethodsSection
            dark={dark}
            isOpen={openSections.paymentMode}
            paymentMethods={mockPaymentMethods}
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
            régulièrement et utilisez l'authentification à deux facteurs lorsque
            disponible.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
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
});

export default SettingsSecurity;
