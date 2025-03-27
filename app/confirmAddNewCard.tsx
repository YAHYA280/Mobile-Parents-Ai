import type { NavigationProp } from "@react-navigation/native";

import React, { useState } from "react";
import { OtpInput } from "react-native-otp-entry";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Modal,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

import Header from "../components/Header";
import Button from "../components/Button";
import { useTheme } from "../theme/ThemeProvider";
import { SIZES, COLORS, illustrations } from "../constants";

const ConfirmPayment = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { colors, dark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const handleAddCard = () => {
    setModalVisible(true);
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
              <Text style={styles.modalTitle}>
                Votre carte a été ajoutée avec succès.
              </Text>
              <Button
                title="Retour au paiement"
                filled
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("selectpaymentmethods");
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
        <Header title="Ajouter une nouvelle carte" />
        <View style={styles.containerView}>
          <Text
            style={[
              styles.title,
              {
                color: dark ? COLORS.secondaryWhite : COLORS.greyscale900,
              },
            ]}
          >
            Entrez le code envoyé à votre adresse e-mail pour confirmer
            l&apos;ajout d&apos;une nouvelle carte.
          </Text>
          <View style={styles.optContainer}>
            <OtpInput
              numberOfDigits={4}
              onTextChange={(text) => console.log(text)}
              focusColor={COLORS.primary}
              focusStickBlinkingDuration={500}
              onFilled={(text) => console.log(`OTP is ${text}`)}
              theme={{
                pinCodeContainerStyle: {
                  backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite,
                  borderColor: dark ? COLORS.gray3 : COLORS.secondaryWhite,
                  borderWidth: dark ? 0.4 : 1,
                  borderRadius: 10,
                  height: 58,
                  width: 58,
                },
                pinCodeTextStyle: {
                  color: dark ? COLORS.white : COLORS.black,
                },
              }}
            />
          </View>
          <Button title="Continuer" filled onPress={handleAddCard} />
        </View>
      </View>
      {renderModal()}
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
  containerView: {
    marginVertical: 16,
    flex: 1,
    justifyContent: "center",
    marginBottom: 170,
  },
  title: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.black,
    marginVertical: 16,
    textAlign: "center",
  },
  optContainer: {
    marginVertical: 64,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginVertical: 12,
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
    height: 130,
    width: 130,
    marginVertical: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  modalIllustration: {
    height: 180,
    width: 180,
  },
});

export default ConfirmPayment;
