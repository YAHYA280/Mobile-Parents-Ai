import type { NavigationProp } from "@react-navigation/native";

import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-virtualized-view";
import { SafeAreaView } from "react-native-safe-area-context";
import PaymentMethodItem from "@/components/PaymentMethodItem";
import {
  View,
  Text,
  Modal,
  Image,
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

import Header from "../components/Header";
import Button from "../components/Button";
import { useTheme } from "../theme/ThemeProvider";
import { SIZES, icons, COLORS, illustrations } from "../constants";

const SelectPaymentMethods = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { colors, dark } = useTheme();

  const handleCheckboxPress = (itemTitle: any) => {
    if (selectedItem === itemTitle) {
      setSelectedItem(null);
    } else {
      setSelectedItem(itemTitle);
    }
  };

  const handleContinue = () => {
    // Si aucune carte n'est sélectionnée, afficher un message d'erreur
    if (!selectedItem) {
      Alert.alert(
        "Sélection de carte requise",
        "Veuillez sélectionner une carte de paiement avant de continuer.",
        [{ text: "OK" }]
      );
      return;
    }

    // Si une carte est sélectionnée, afficher le modal de confirmation
    setShowConfirmationModal(true);
  };

  const handleConfirmPayment = () => {
    setShowConfirmationModal(false);

    setTimeout(() => {
      setModalVisible(true);
    }, 500);
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
                  backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite,
                },
              ]}
            >
              <View style={styles.backgroundIllustration}>
                <Image
                  source={illustrations.successCheck}
                  resizeMode="contain"
                  style={styles.modalIllustration}
                />
              </View>
              <Text style={styles.modalTitle}>Paiement Réussi !</Text>
              <Text
                style={[
                  styles.modalSubtitle,
                  {
                    color: dark ? COLORS.secondaryWhite : COLORS.greyscale900,
                  },
                ]}
              >
                Vous avez effectué le paiement avec succès.
              </Text>
              <Button
                title="Voir le reçu"
                filled
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("ereceipt");
                }}
                style={{
                  width: "100%",
                  marginTop: 12,
                }}
              />
              <Button
                title="Gérer mon abonnement"
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("subscriptionManagerChildren");
                }}
                style={{
                  width: "100%",
                  marginTop: 12,
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Paiement" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={[
              styles.title,
              {
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          >
            Sélectionnez le mode de paiement que vous souhaitez utiliser.
          </Text>
          <PaymentMethodItem
            checked={selectedItem === "Credit Card"}
            onPress={() => handleCheckboxPress("Credit Card")}
            title="•••• •••• •••• •••• 4679"
            icon={icons.creditCard}
          />
          <Button
            title="Ajouter une nouvelle carte"
            onPress={() => {
              navigation.navigate("addnewcard");
            }}
            style={{
              width: SIZES.width - 32,
              borderRadius: 32,
              backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
              borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
            }}
            textColor={dark ? COLORS.white : COLORS.primary}
          />
        </ScrollView>
        <Button
          title="Continuer"
          filled
          style={styles.continueBtn}
          onPress={handleContinue}
        />

        {/* Modal de Confirmation */}
        <Modal
          visible={showConfirmationModal}
          transparent
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirmer le paiement</Text>
              <Text style={styles.modalText}>
                Voulez-vous confirmer le paiement avec la carte se terminant par
                4679 ?
              </Text>
              <View style={styles.modalButtonContainer}>
                <Button
                  title="Annuler"
                  onPress={() => setShowConfirmationModal(false)}
                  style={styles.modalCancelButton}
                  textColor={COLORS.primary}
                />
                <Button
                  title="Confirmer"
                  filled
                  onPress={handleConfirmPayment}
                  style={styles.modalConfirmButton}
                />
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal de Succès */}
        {renderModal()}
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
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.greyscale900,
    marginVertical: 32,
  },
  continueBtn: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: SIZES.width - 32,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
  },
  modalContent: {
    width: SIZES.width - 32,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    fontFamily: "medium",
    marginBottom: 20,
    textAlign: "center",
    color: COLORS.greyScale700,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalCancelButton: {
    width: "45%",
    borderRadius: 32,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  modalConfirmButton: {
    width: "45%",
    borderRadius: 32,
    backgroundColor: COLORS.primary,
  },

  modalTitle: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginVertical: 12,
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.black,
    textAlign: "center",
    marginVertical: 12,
    marginHorizontal: 16,
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalSubContainer: {
    height: 490,
    width: SIZES.width * 0.86,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  backgroundIllustration: {
    height: 150,
    width: 150,
    marginVertical: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  modalIllustration: {
    height: 180,
    width: 180,
  },
});

export default SelectPaymentMethods;
