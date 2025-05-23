import type { NavigationProp } from "@react-navigation/native";

import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-virtualized-view";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Modal,
  Image,
  Alert,
  StatusBar,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import Header from "../components/ui/Header";
import { COLOORS } from "../constants/theme";
import { icons, illustrations } from "../constants";

const { width } = Dimensions.get("window");

interface PaymentMethodItemProps {
  title: string;
  icon: any;
  checked: boolean;
  onPress: () => void;
  lastDigits?: string;
  expiryDate?: string;
}

const PaymentMethodItem: React.FC<PaymentMethodItemProps> = ({
  title,
  icon,
  checked,
  onPress,
  lastDigits = "4679",
  expiryDate = "09/26",
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.paymentCard,
        {
          borderColor: checked ? COLOORS.primary.main : "transparent",
          borderWidth: checked ? 2 : 0,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardIconContainer}>
          <Image source={icon} style={styles.cardIcon} />
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.cardNumber}>•••• {lastDigits}</Text>
          <Text style={styles.cardExpiry}>Expire {expiryDate}</Text>
        </View>

        <View
          style={[
            styles.checkboxContainer,
            {
              backgroundColor: checked
                ? COLOORS.primary.main
                : "rgba(0,0,0,0.05)",
            },
          ]}
        >
          {checked && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SelectPaymentMethods = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const handleCheckboxPress = (itemTitle: string) => {
    if (selectedItem === itemTitle) {
      setSelectedItem(null);
    } else {
      setSelectedItem(itemTitle);
    }
  };

  const handleContinue = () => {
    if (!selectedItem) {
      Alert.alert(
        "Sélection de carte requise",
        "Veuillez sélectionner une carte de paiement avant de continuer.",
        [{ text: "OK" }]
      );
      return;
    }

    setShowConfirmationModal(true);
  };

  const handleConfirmPayment = () => {
    setShowConfirmationModal(false);

    setTimeout(() => {
      setModalVisible(true);
    }, 500);
  };

  const renderConfirmationModal = () => {
    return (
      <Modal visible={showConfirmationModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <View style={styles.confirmModalHeader}>
              <View style={styles.confirmIconContainer}>
                <Ionicons name="shield-checkmark" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.confirmModalTitle}>
                Confirmer le paiement
              </Text>
            </View>

            <Text style={styles.confirmModalMessage}>
              Voulez-vous confirmer le paiement avec la carte se terminant par
              4679 ?
            </Text>

            <View style={styles.cardPreview}>
              <View style={styles.cardPreviewIconContainer}>
                <Image
                  source={icons.creditCard}
                  style={styles.cardPreviewIcon}
                />
              </View>
              <Text style={styles.cardPreviewText}>•••• •••• •••• 4679</Text>
            </View>

            <View style={styles.confirmModalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowConfirmationModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmPayment}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmButtonText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderSuccessModal = () => {
    return (
      <Modal animationType="fade" transparent visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.successModal}>
              <LinearGradient
                colors={[COLOORS.primary.main, "#ff7043"]}
                style={styles.successGradient}
              >
                <View style={styles.successIconContainer}>
                  <Image
                    source={illustrations.successCheck}
                    resizeMode="contain"
                    style={styles.successIcon}
                  />
                </View>
              </LinearGradient>

              <View style={styles.successContent}>
                <Text style={styles.successTitle}>Paiement Réussi !</Text>
                <Text style={styles.successMessage}>
                  Vous avez effectué le paiement avec succès.
                </Text>

                <View style={styles.successActions}>
                  <TouchableOpacity
                    style={styles.successButton}
                    onPress={() => {
                      setModalVisible(false);
                      navigation.navigate("ereceipt");
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.successButtonText}>Voir le reçu</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => {
                      setModalVisible(false);
                      navigation.navigate("subscriptionManagerChildren");
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.secondaryButtonText}>
                      Gérer mon abonnement
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const onHeaderLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Sticky Header */}
      <View style={styles.headerContainer} onLayout={onHeaderLayout}>
        <Header
          title="Paiement"
          subtitle="Sélectionnez votre méthode de paiement préférée"
          onBackPress={() => navigation.goBack()}
        />
      </View>

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={{
            paddingTop: headerHeight + 16, // Adjust the extra padding (16) as needed
            paddingHorizontal: 16,
            paddingBottom: 16,
          }}
        >
          <View style={styles.infoCard}>
            <Ionicons
              name="information-circle"
              size={24}
              color={COLOORS.primary.main}
            />
            <Text style={styles.infoText}>
              Sélectionnez le mode de paiement que vous souhaitez utiliser.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Méthodes de paiement</Text>

          <PaymentMethodItem
            checked={selectedItem === "Credit Card"}
            onPress={() => handleCheckboxPress("Credit Card")}
            title="Credit Card"
            icon={icons.creditCard}
            lastDigits="4679"
            expiryDate="09/26"
          />

          <View style={styles.addNewSection}>
            <Text style={styles.addNewTitle}>
              Ajouter un nouveau moyen de paiement
            </Text>

            <TouchableOpacity
              style={styles.addNewButton}
              onPress={() => navigation.navigate("addnewcard")}
              activeOpacity={0.8}
            >
              <View style={styles.addNewIconContainer}>
                <Ionicons name="add" size={24} color={COLOORS.primary.main} />
              </View>
              <Text style={styles.addNewText}>Ajouter une nouvelle carte</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.bottomButtonContainer}>
          <LinearGradient
            colors={[COLOORS.primary.main, "#ff7043"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButtonGradient}
          >
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Continuer</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {renderConfirmationModal()}
        {renderSuccessModal()}
      </View>
    </SafeAreaView>
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    // Removed paddingHorizontal here and moved it to contentContainerStyle
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(255, 112, 67, 0.05)",
    borderRadius: 12,
    marginBottom: 16, // Changed from marginVertical to marginBottom
  },
  infoText: {
    fontSize: 14,
    color: COLOORS.primary.main,
    marginLeft: 12,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 16,
  },
  paymentCard: {
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "rgba(255, 112, 67, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardIcon: {
    width: 24,
    height: 24,
    tintColor: COLOORS.primary.main,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 16,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 4,
  },
  cardExpiry: {
    fontSize: 12,
    color: "#666666",
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addNewSection: {
    marginTop: 8,
  },
  addNewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12,
  },
  addNewButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(255, 112, 67, 0.05)",
    borderRadius: 12,
  },
  addNewIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 112, 67, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  addNewText: {
    fontSize: 14,
    color: COLOORS.primary.main,
    fontWeight: "500",
  },
  bottomButtonContainer: {
    padding: 16,
  },
  continueButtonGradient: {
    borderRadius: 30,
    overflow: "hidden",
  },
  continueButton: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmModal: {
    width: width - 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  confirmModalHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  confirmIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLOORS.primary.main,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  confirmModalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
  },
  confirmModalMessage: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: 20,
  },
  cardPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    marginBottom: 20,
  },
  cardPreviewIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 112, 67, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardPreviewIcon: {
    width: 16,
    height: 16,
    tintColor: COLOORS.primary.main,
  },
  cardPreviewText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
  },
  confirmModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLOORS.primary.main,
    borderRadius: 24,
    marginRight: 8,
  },
  cancelButtonText: {
    color: COLOORS.primary.main,
    fontSize: 14,
    fontWeight: "500",
  },
  confirmButton: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLOORS.primary.main,
    borderRadius: 24,
    marginLeft: 8,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },

  // Success Modal Styles
  successModal: {
    width: width - 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
  },
  successGradient: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  successIconContainer: {
    height: 100,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  successIcon: {
    height: 100,
    width: 100,
  },
  successContent: {
    padding: 24,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLOORS.primary.main,
    textAlign: "center",
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: 24,
  },
  successActions: {
    width: "100%",
  },
  successButton: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLOORS.primary.main,
    borderRadius: 24,
    marginBottom: 12,
  },
  successButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  secondaryButton: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLOORS.primary.main,
    borderRadius: 24,
  },
  secondaryButtonText: {
    color: COLOORS.primary.main,
    fontSize: 14,
    fontWeight: "500",
  },
});

export default SelectPaymentMethods;
