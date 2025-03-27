import { Image } from "expo-image";
import Header from "@/components/Header";
import React, { useMemo, useState } from "react";
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

// Notification Toggle Component
interface NotificationToggleProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  dark: boolean;
}

const NotificationToggle: React.FC<NotificationToggleProps> = React.memo(
  // eslint-disable-next-line react/prop-types
  ({ label, value, onValueChange, dark }) => (
    <View style={styles.toggleContainer}>
      <Text
        style={[
          styles.toggleLabel,
          { color: dark ? COLORS.white : COLORS.greyscale900 },
        ]}
      >
        {label}
      </Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: dark ? COLORS.dark3 : COLORS.greyscale300,
          true: COLORS.primary,
        }}
        thumbColor={COLORS.white}
      />
    </View>
  )
);

// Main component
const SettingsNotifications = () => {
  const { colors, dark } = useTheme();

  const [mainNotificationsEnabled, setMainNotificationsEnabled] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState({
    childProgress: true,
    objectiveReminders: true,
    appUpdates: true,
  });

  const [openSections, setOpenSections] = useState({
    notificationTypes: true,
  });

  const toggleNotificationTypesSection = () => {
    setOpenSections((prev) => ({
      ...prev,
      notificationTypes: !prev.notificationTypes,
    }));
  };

  const handleToggleChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
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
          <Header title="Notifications" />
        </View>
        <ScrollView
          style={styles.settingsContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainToggleContainer}>
            <NotificationToggle
              label="Désactiver notifications"
              value={mainNotificationsEnabled}
              onValueChange={(value) => setMainNotificationsEnabled(value)}
              dark={dark}
            />
          </View>

          <View style={styles.sectionContainer}>
            <SectionHeader
              title="Types de notifications"
              dark={dark}
              isOpen={openSections.notificationTypes}
              onToggle={toggleNotificationTypesSection}
            />
            {openSections.notificationTypes && (
              <View style={[
                styles.sectionContent,
                {
                  backgroundColor: dark ? COLORS.dark3 : COLORS.secondaryWhite,
                }
              ]}>
                <NotificationToggle
                  label="Progrès de l'enfant"
                  value={notificationSettings.childProgress}
                  onValueChange={() => handleToggleChange("childProgress")}
                  dark={dark}
                />
                <NotificationToggle
                  label="Rappels d'objectifs"
                  value={notificationSettings.objectiveReminders}
                  onValueChange={() => handleToggleChange("objectiveReminders")}
                  dark={dark}
                />
                <NotificationToggle
                  label="Mises à jour de l'application"
                  value={notificationSettings.appUpdates}
                  onValueChange={() => handleToggleChange("appUpdates")}
                  dark={dark}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SettingsNotifications;

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
  mainToggleContainer: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  toggleLabel: {
    fontSize: 16,
    fontFamily: "medium",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
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
  sectionContainer: {
    marginBottom: 16,
  },
  sectionContent: {
    padding: 16,
    marginHorizontal: 7,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});