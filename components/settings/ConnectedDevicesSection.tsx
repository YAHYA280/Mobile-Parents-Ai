import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";

import type { Device } from "../../types/security";

import { COLORS } from "../../constants";

interface ConnectedDevicesSectionProps {
  isOpen: boolean;
  devices?: Device[];
}

const ConnectedDevicesSection: React.FC<ConnectedDevicesSectionProps> = ({
  isOpen,
  devices = [],
}) => {
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
          style={[styles.deviceItem, { backgroundColor: "#F8F9FA" }]}
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
              <Text style={[styles.deviceName, { color: COLORS.black }]}>
                {device.name}
              </Text>
              <Text style={[styles.deviceDate, { color: COLORS.greyscale600 }]}>
                {device.connectionDate}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.deviceStatus,
              {
                backgroundColor: device.isActive ? "#4CAF5020" : "#EEEEEE",
              },
            ]}
          >
            <Text
              style={[
                styles.deviceStatusText,
                {
                  color: device.isActive ? "#4CAF50" : COLORS.greyscale600,
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
        height={420}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          draggableIcon: {
            backgroundColor: COLORS.grayscale400,
            width: 40,
            height: 5,
          },
          container: {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            backgroundColor: COLORS.white,
            padding: 16,
            paddingBottom: 32,
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

              <Text style={[styles.deviceSheetTitle, { color: COLORS.black }]}>
                {selectedDevice.name}
              </Text>

              <Text
                style={[
                  styles.deviceSheetSubtitle,
                  { color: COLORS.greyscale600 },
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
                    { color: COLORS.greyscale600 },
                  ]}
                >
                  Date de connexion
                </Text>
                <Text
                  style={[styles.deviceDetailValue, { color: COLORS.black }]}
                >
                  {selectedDevice.connectionDate}
                </Text>
              </View>

              <View style={styles.deviceDetailItem}>
                <Text
                  style={[
                    styles.deviceDetailLabel,
                    { color: COLORS.greyscale600 },
                  ]}
                >
                  Statut
                </Text>
                <View style={styles.deviceStatusToggle}>
                  <Text
                    style={[styles.deviceStatusLabel, { color: COLORS.black }]}
                  >
                    {selectedDevice.isActive ? "Actif" : "Inactif"}
                  </Text>
                  <Switch
                    value={selectedDevice.isActive}
                    onValueChange={(value) =>
                      console.log(`Device status changed to: ${value}`)
                    }
                    trackColor={{
                      false: "#EEEEEE",
                      true: COLORS.primary,
                    }}
                    thumbColor={COLORS.white}
                  />
                </View>
              </View>
            </View>

            <View style={styles.actionButtonContainer}>
              <TouchableOpacity
                style={[styles.logoutButton, { backgroundColor: "#FFE5E5" }]}
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
          </View>
        ) : (
          <></>
        )}
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContent: {
    marginTop: -16,
    marginBottom: 16,
    paddingBottom: 8,
  },
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
    flex: 1,
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
    paddingRight: 8,
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
    marginLeft: 8,
    alignSelf: "center",
    minWidth: 60,
    alignItems: "center",
  },
  deviceStatusText: {
    fontSize: 12,
    fontFamily: "medium",
    textAlign: "center",
  },
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
  actionButtonContainer: {
    paddingBottom: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: "#F44336",
    fontSize: 16,
    fontFamily: "medium",
  },
});

export default ConnectedDevicesSection;
