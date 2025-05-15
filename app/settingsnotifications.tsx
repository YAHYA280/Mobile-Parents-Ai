import { Image } from "expo-image";
import Header from "@/components/Header";
import React, { useMemo, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-virtualized-view";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import { icons, COLORS } from "../constants";
import { useTheme } from "../theme/ThemeProvider";

// Component props
interface SectionHeaderProps {
  title: string;
  dark: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

// Section Header Component
const SectionHeader: React.FC<SectionHeaderProps> = React.memo(
  ({ title, dark, isOpen, onToggle }) => (
    <TouchableOpacity
      onPress={onToggle}
      style={[
        styles.accordionHeader,
        isOpen ? styles.accordionHeaderActive : {},
        {
          backgroundColor: isOpen
            ? COLORS.primary
            : dark
              ? COLORS.dark2
              : "#F8F9FA",
        },
      ]}
      activeOpacity={0.8}
    >
      <View style={styles.accordionTitleContainer}>
        <View
          style={[
            styles.accordionIcon,
            {
              backgroundColor: isOpen
                ? "rgba(255,255,255,0.2)"
                : `${COLORS.primary}15`,
            },
          ]}
        >
          <Ionicons
            name={isOpen ? "notifications" : "notifications-outline"}
            size={20}
            color={isOpen ? "#FFFFFF" : COLORS.primary}
          />
        </View>
        <Text
          style={[
            styles.accordionTitle,
            {
              color: isOpen ? "#FFFFFF" : dark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          {title}
        </Text>
      </View>
      <View
        style={[
          styles.accordionArrow,
          {
            backgroundColor: isOpen
              ? "rgba(255,255,255,0.2)"
              : dark
                ? COLORS.dark3
                : "#EEEEEE",
          },
        ]}
      >
        <Ionicons
          name={isOpen ? "chevron-down" : "chevron-forward"}
          size={16}
          color={isOpen ? "#FFFFFF" : dark ? COLORS.white : COLORS.greyscale900}
        />
      </View>
    </TouchableOpacity>
  )
);

// Notification Toggle Component
interface NotificationToggleProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  dark: boolean;
  icon?: string;
}

const NotificationToggle: React.FC<NotificationToggleProps> = React.memo(
  ({ label, value, onValueChange, dark, icon }) => (
    <View style={styles.toggleContainer}>
      <View style={styles.toggleLabelContainer}>
        {icon && (
          <View
            style={[
              styles.toggleIconContainer,
              {
                backgroundColor: value
                  ? `${COLORS.primary}15`
                  : dark
                    ? COLORS.dark3
                    : "#EEEEEE",
              },
            ]}
          >
            <Ionicons
              name={icon as any}
              size={16}
              color={
                value
                  ? COLORS.primary
                  : dark
                    ? COLORS.greyscale500
                    : COLORS.greyscale600
              }
            />
          </View>
        )}
        <Text
          style={[
            styles.toggleLabel,
            { color: dark ? COLORS.white : COLORS.greyscale900 },
          ]}
        >
          {label}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: dark ? COLORS.dark3 : "#EEEEEE",
          true: COLORS.primary,
        }}
        thumbColor={COLORS.white}
        ios_backgroundColor={dark ? COLORS.dark3 : "#EEEEEE"}
        style={styles.toggle}
      />
    </View>
  )
);

// Main component
const SettingsNotifications = () => {
  const { colors, dark } = useTheme();

  const [mainNotificationsEnabled, setMainNotificationsEnabled] =
    useState(true);
  const [notificationSettings, setNotificationSettings] = useState({
    childProgress: true,
    objectiveReminders: true,
    appUpdates: true,
    messages: false,
    newsletter: true,
  });

  const [openSections, setOpenSections] = useState({
    notificationTypes: true,
    communicationPrefs: false,
  });

  const toggleNotificationTypesSection = () => {
    setOpenSections((prev) => ({
      ...prev,
      notificationTypes: !prev.notificationTypes,
    }));
  };

  const toggleCommunicationSection = () => {
    setOpenSections((prev) => ({
      ...prev,
      communicationPrefs: !prev.communicationPrefs,
    }));
  };

  const handleToggleChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const renderSectionContent = (isOpen: boolean, children: React.ReactNode) => {
    if (!isOpen) return null;

    return (
      <View
        style={[
          styles.sectionContent,
          { backgroundColor: dark ? COLORS.dark2 : "#FFFFFF" },
        ]}
      >
        {children}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Notifications" />

        <ScrollView
          style={styles.settingsContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View
            style={[
              styles.mainToggleCard,
              { backgroundColor: dark ? COLORS.dark2 : "#FFFFFF" },
            ]}
          >
            <View style={styles.mainToggleHeaderContainer}>
              <View style={styles.mainToggleIconContainer}>
                <LinearGradient
                  colors={[COLORS.primary, "#ff7043"]}
                  style={styles.mainToggleGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="notifications" size={24} color="#FFFFFF" />
                </LinearGradient>
              </View>
              <View style={styles.mainToggleTextContainer}>
                <Text
                  style={[
                    styles.mainToggleTitle,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  Notifications
                </Text>
                <Text
                  style={[
                    styles.mainToggleSubtitle,
                    { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
                  ]}
                >
                  {mainNotificationsEnabled
                    ? "Activées pour tous les éléments"
                    : "Toutes les notifications sont désactivées"}
                </Text>
              </View>
              <Switch
                value={mainNotificationsEnabled}
                onValueChange={(value) => setMainNotificationsEnabled(value)}
                trackColor={{
                  false: dark ? COLORS.dark3 : "#EEEEEE",
                  true: COLORS.primary,
                }}
                thumbColor={COLORS.white}
                ios_backgroundColor={dark ? COLORS.dark3 : "#EEEEEE"}
              />
            </View>
          </View>

          {mainNotificationsEnabled && (
            <>
              <View style={styles.sectionContainer}>
                <SectionHeader
                  title="Types de notifications"
                  dark={dark}
                  isOpen={openSections.notificationTypes}
                  onToggle={toggleNotificationTypesSection}
                />

                {renderSectionContent(
                  openSections.notificationTypes,
                  <>
                    <NotificationToggle
                      label="Progrès de l'enfant"
                      value={notificationSettings.childProgress}
                      onValueChange={() => handleToggleChange("childProgress")}
                      dark={dark}
                      icon="trending-up"
                    />
                    <NotificationToggle
                      label="Rappels d'objectifs"
                      value={notificationSettings.objectiveReminders}
                      onValueChange={() =>
                        handleToggleChange("objectiveReminders")
                      }
                      dark={dark}
                      icon="flag"
                    />
                    <NotificationToggle
                      label="Mises à jour de l'application"
                      value={notificationSettings.appUpdates}
                      onValueChange={() => handleToggleChange("appUpdates")}
                      dark={dark}
                      icon="refresh-circle"
                    />
                  </>
                )}
              </View>

              <View style={styles.sectionContainer}>
                <SectionHeader
                  title="Préférences de communication"
                  dark={dark}
                  isOpen={openSections.communicationPrefs}
                  onToggle={toggleCommunicationSection}
                />

                {renderSectionContent(
                  openSections.communicationPrefs,
                  <>
                    <NotificationToggle
                      label="Messages et alertes"
                      value={notificationSettings.messages}
                      onValueChange={() => handleToggleChange("messages")}
                      dark={dark}
                      icon="chatbubble"
                    />
                    <NotificationToggle
                      label="Newsletter et offres"
                      value={notificationSettings.newsletter}
                      onValueChange={() => handleToggleChange("newsletter")}
                      dark={dark}
                      icon="mail"
                    />
                  </>
                )}
              </View>
            </>
          )}

          <View style={styles.footerContainer}>
            <Text
              style={[
                styles.footerText,
                { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
              ]}
            >
              Les paramètres de notification vous permettent de contrôler
              comment et quand vous recevez des alertes concernant l'activité de
              vos enfants et les mises à jour de l'application.
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
  settingsContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  mainToggleCard: {
    borderRadius: 16,
    marginVertical: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  mainToggleHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  mainToggleIconContainer: {
    marginRight: 16,
  },
  mainToggleGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  mainToggleTextContainer: {
    flex: 1,
  },
  mainToggleTitle: {
    fontSize: 16,
    fontFamily: "semibold",
    marginBottom: 4,
  },
  mainToggleSubtitle: {
    fontSize: 13,
    fontFamily: "regular",
  },
  sectionContainer: {
    marginBottom: 16,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  accordionHeaderActive: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  accordionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  accordionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  accordionTitle: {
    fontSize: 16,
    fontFamily: "medium",
  },
  accordionArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionContent: {
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginTop: -8,
    paddingTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  toggleLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  toggleIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  toggleLabel: {
    fontSize: 15,
    fontFamily: "medium",
  },
  toggle: {
    transform: [{ scale: 0.8 }],
  },
  footerContainer: {
    marginTop: 16,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  footerText: {
    fontSize: 13,
    fontFamily: "regular",
    textAlign: "center",
    lineHeight: 18,
  },
});

export default SettingsNotifications;
