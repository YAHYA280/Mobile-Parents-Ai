import type { NavigationProp } from "@react-navigation/native";

import React, { useState } from "react";
import * as Clipboard from "expo-clipboard";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-virtualized-view";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import {
  View,
  Text,
  Image,
  Alert,
  Modal,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import { useTheme } from "../theme/ThemeProvider";
import { SIZES, icons, COLORS } from "../constants";

// EReceipt screen
const EReceipt = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { colors } = useTheme();

  const dropdownItems = [
    {
      label: "Partager",
      value: "share",
      icon: icons.shareOutline,
    },
    {
      label: "Télécharger",
      value: "downloadEReceipt",
      icon: icons.download2,
    },
    { label: "Imprimer", value: "print", icon: icons.documentOutline },
  ];

  const handleDropdownSelect = (item: any) => {
    setSelectedItem(item.value);
    setModalVisible(false);

    // Perform actions based on the selected item
    switch (item.value) {
      case "share":
        // Handle Share action
        setModalVisible(false);
        navigation.navigate("(tabs)");
        break;
      case "downloadEReceipt":
        // Handle Download E-Receipt action
        setModalVisible(false);
        navigation.navigate("(tabs)");
        break;
      case "print":
        // Handle Print action
        setModalVisible(false);
        navigation.navigate("(tabs)");
        break;
      default:
        break;
    }
  };
  /**
   * Render Header
   */
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={icons.back}
              resizeMode="contain"
              style={[
                styles.backIcon,
                {
                  tintColor: COLORS.black,
                },
              ]}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              {
                color: COLORS.black,
              },
            ]}
          >
            Reçu électronique
          </Text>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={icons.moreCircle}
            resizeMode="contain"
            style={[
              styles.moreIcon,
              {
                tintColor: COLORS.black,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };
  /**
   * Render content
   */
  const renderContent = () => {
    const transactionId = "SKD354822747"; // Replace with your actual transaction ID

    const handleCopyToClipboard = async () => {
      await Clipboard.setStringAsync(transactionId);
      Alert.alert("Copied!", "Transaction ID copied to clipboard.");
    };

    return (
      <View style={{ marginVertical: 22 }}>
        <Barcode
          format="EAN13"
          value="0123456789012"
          text="0123456789012"
          width={SIZES.width - 64}
          height={72}
          style={{
            marginBottom: 40,
            backgroundColor: COLORS.white,
          }}
          lineColor={COLORS.black}
          textStyle={{
            color: COLORS.black,
          }}
          maxWidth={SIZES.width - 64}
        />
        <View
          style={[
            styles.summaryContainer,
            {
              backgroundColor: COLORS.white,
              borderRadius: 6,
            },
          ]}
        >
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Cours</Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: COLORS.black,
                },
              ]}
            >
              Mastering Figma A to Z
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Catégorie</Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: COLORS.black,
                },
              ]}
            >
              UI/UX Design
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.summaryContainer,
            {
              backgroundColor: COLORS.white,
              borderRadius: 6,
            },
          ]}
        >
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Nom</Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: COLORS.black,
                },
              ]}
            >
              Andrew Ainsley
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Téléphone</Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: COLORS.black,
                },
              ]}
            >
              +1 111 3452 2837 3747
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Email</Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: COLORS.black,
                },
              ]}
            >
              andrew_ainsley@domain.com
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Country</Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: COLORS.black,
                },
              ]}
            >
              États-Unis
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.summaryContainer,
            {
              backgroundColor: COLORS.white,
              borderRadius: 6,
            },
          ]}
        >
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Price</Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: COLORS.black,
                },
              ]}
            >
              $40
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Moyens de paiement</Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: COLORS.black,
                },
              ]}
            >
              Carte de crédit
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Date</Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: COLORS.black,
                },
              ]}
            >
              Dec 16, 2026 | 12:23:45 PM
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>ID de transaction</Text>
            <View style={styles.copyContentContainer}>
              <Text style={styles.viewRight}>{transactionId}</Text>
              <TouchableOpacity
                style={{ marginLeft: 8 }}
                onPress={handleCopyToClipboard}
              >
                <MaterialCommunityIcons
                  name="content-copy"
                  size={24}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Statut</Text>
            <TouchableOpacity style={styles.statusBtn}>
              <Text style={styles.statusBtnText}>Payée</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <ScrollView
          style={[styles.scrollView, { backgroundColor: COLORS.tertiaryWhite }]}
          showsVerticalScrollIndicator={false}
        >
          {renderContent()}
        </ScrollView>
      </View>
      {/* Modal for dropdown selection */}
      <Modal animationType="slide" transparent visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={{ position: "absolute", top: 112, right: 12 }}>
            <View
              style={{
                width: 202,
                padding: 16,
                backgroundColor: COLORS.tertiaryWhite,
                borderRadius: 8,
              }}
            >
              <FlatList
                data={dropdownItems}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 12,
                    }}
                    onPress={() => handleDropdownSelect(item)}
                  >
                    <Image
                      source={item.icon}
                      resizeMode="contain"
                      style={{
                        width: 20,
                        height: 20,
                        marginRight: 16,
                        tintColor: COLORS.black,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "semiBold",
                        color: COLORS.black,
                      }}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
  },
  scrollView: {
    backgroundColor: COLORS.tertiaryWhite,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.black,
  },
  moreIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
  summaryContainer: {
    width: SIZES.width - 32,
    backgroundColor: COLORS.white,
    alignItems: "center",
    padding: 16,
    marginVertical: 8,
  },
  viewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginVertical: 12,
  },
  viewLeft: {
    fontSize: 12,
    fontFamily: "regular",
    color: "gray",
  },
  viewRight: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.black,
  },
  copyContentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBtn: {
    width: 72,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 6,
  },
  statusBtnText: {
    fontSize: 12,
    fontFamily: "medium",
    color: COLORS.primary,
  },
});

export default EReceipt;
