// components/profile/SettingsSection.tsx
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { COLORS } from "@/constants";

interface SettingsItemProps {
  icon: string;
  settingName: string;
  onPress: () => void;
  showArrow?: boolean;
  rightComponent?: React.ReactNode;
  iconColor?: string;
}

interface SettingsSectionProps {
  navigate: (screen: string) => void;
  selectedLanguage: string;
  onLanguagePress: () => void;
  onLogoutPress: () => void;
  onDeleteAccountPress: () => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  settingName,
  onPress,
  showArrow = true,
  rightComponent,
  iconColor,
}) => {
  return (
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
        <Text style={[styles.settingsItemText, { color: COLORS.greyscale900 }]}>
          {settingName}
        </Text>
      </View>

      <View style={styles.settingsItemRightContainer}>
        {rightComponent}
        {showArrow && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={COLORS.greyscale600}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const SettingsGroup: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <View style={styles.settingsGroupContainer}>
      <Text style={[styles.settingsGroupTitle, { color: COLORS.greyscale600 }]}>
        {title}
      </Text>
      <View
        style={[styles.settingsGroupCard, { backgroundColor: COLORS.white }]}
      >
        {children}
      </View>
    </View>
  );
};

const SettingsSection: React.FC<SettingsSectionProps> = ({
  navigate,
  selectedLanguage,
  onLanguagePress,
  onLogoutPress,
  onDeleteAccountPress,
}) => {
  return (
    <View style={styles.settingsContainer}>
      <SettingsGroup title="Compte">
        <SettingsItem
          icon="shield-outline"
          settingName="Sécurité"
          onPress={() => navigate("settingssecurity")}
        />
        <SettingsItem
          icon="wallet-outline"
          settingName="Abonnements"
          onPress={() => navigate("abonnementActuel")}
        />
        <SettingsItem
          icon="receipt-outline"
          settingName="Transactions"
          onPress={() => navigate("transactions")}
        />
        <SettingsItem
          icon="notifications-outline"
          settingName="Notifications"
          onPress={() => navigate("settingsnotifications")}
        />
        <SettingsItem
          icon="people-outline"
          settingName="Gestion Enfants"
          onPress={() => navigate("listeenfants")}
        />
      </SettingsGroup>

      <SettingsGroup title="Préférences">
        <SettingsItem
          icon="language-outline"
          settingName="Langue"
          onPress={onLanguagePress}
          rightComponent={
            <Text
              style={[styles.settingsItemRightText, { color: COLORS.primary }]}
            >
              {selectedLanguage}
            </Text>
          }
        />
      </SettingsGroup>

      <SettingsGroup title="Autres">
        <SettingsItem
          icon="help-circle-outline"
          settingName="Aide & Support"
          onPress={() => navigate("support")}
        />
        <SettingsItem
          icon="information-circle-outline"
          settingName="À propos"
          onPress={() => navigate("about")}
        />
        <SettingsItem
          icon="log-out-outline"
          settingName="Déconnexion"
          onPress={onLogoutPress}
          showArrow={false}
          iconColor="#F44336"
        />
        <SettingsItem
          icon="trash-outline"
          settingName="Supprimer le compte"
          onPress={onDeleteAccountPress}
          showArrow={false}
          iconColor="#F44336"
        />
      </SettingsGroup>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default SettingsSection;
