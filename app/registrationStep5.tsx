import React, { useState } from "react";
import { useNavigation } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  Image,
  Modal,
  Linking,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import ProgressBar from "@/components/ProgressBar";

import Header from "../components/Header";
import Button from "../components/Button";
import { useTheme } from "../theme/ThemeProvider";
import { SIZES, COLORS, illustrations } from "../constants";

type Nav = {
  navigate: (value: string) => void;
};

const RegistrationStep5 = () => {
  const { navigate } = useNavigation<Nav>();
  const { colors, dark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // Function to toggle terms acceptance
  const toggleTermsAccepted = () => {
    setTermsAccepted(!termsAccepted);
  };

  // Function to toggle privacy acceptance
  const togglePrivacyAccepted = () => {
    setPrivacyAccepted(!privacyAccepted);
  };

  // Function to open terms document
  const openTerms = () => {
    // Replace with your actual terms URL
    Linking.openURL("https://example.com/terms");
  };

  // Function to open privacy policy
  const openPrivacyPolicy = () => {
    // Replace with your actual privacy policy URL
    Linking.openURL("https://example.com/privacy");
  };

  // Function to handle final submission
  const handleSubmit = () => {
    if (!termsAccepted || !privacyAccepted) {
      Alert.alert(
        "Conditions non acceptées",
        "Vous devez accepter les Conditions Générales d'Utilisation et la Politique de Confidentialité pour finaliser votre inscription."
      );
      return;
    }

    // Here you would normally submit all the registration data to your server
    // For demonstration, just show a success message
    setModalVisible(true);
  };

  // Checkbox component
  const Checkbox = ({
    checked,
    onPress,
  }: {
    checked: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[
        styles.checkbox,
        checked && {
          backgroundColor: COLORS.primary,
          borderColor: COLORS.primary,
        },
      ]}
      onPress={onPress}
    >
      {checked && <MaterialIcons name="check" size={16} color={COLORS.white} />}
    </TouchableOpacity>
  );
  // render modal
  const renderModal = () => (
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
            <Image
              source={illustrations.successCheck}
              resizeMode="contain"
              style={styles.modalIllustration}
            />
            <Text style={styles.modalTitle}>Félicitations !</Text>
            <Text
              style={[
                styles.modalSubtitle,
                {
                  color: dark ? COLORS.greyscale300 : COLORS.greyscale600,
                },
              ]}
            >
              Votre demande d&apos;inscription a été soumise avec succès. Nous
              examinons actuellement vos documents. Une fois la vérification
              terminée, vous recevrez un email de confirmation. Merci pour votre
              patience.
            </Text>
            <Button
              title="Continuer"
              filled
              onPress={() => {
                setModalVisible(false);
                navigate("login");
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

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Inscription" />
        <ProgressBar currentStep={4} steps={["1", "2", "3", "4", "5"]} />
        <Text style={styles.stepTitle}>Acceptation des Conditions</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Text style={styles.instructions}>
              Avant de finaliser votre inscription, veuillez lire et accepter
              les conditions suivantes :
            </Text>

            <View style={styles.termsSection}>
              <View style={styles.termsCard}>
                <Text style={styles.termsCardTitle}>
                  Conditions Générales d&apos;Utilisation
                </Text>
                <Text style={styles.termsCardDescription}>
                  Les Conditions Générales d&apos;Utilisation constituent un
                  contrat qui définit les règles d&apos;utilisation de nos
                  services. Veuillez les lire attentivement avant de les
                  accepter.
                </Text>
                <TouchableOpacity
                  style={styles.readMoreButton}
                  onPress={openTerms}
                >
                  <Text style={styles.readMoreText}>Lire les CGU</Text>
                  <MaterialIcons
                    name="open-in-new"
                    size={16}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.termsCard}>
                <Text style={styles.termsCardTitle}>
                  Politique de Confidentialité
                </Text>
                <Text style={styles.termsCardDescription}>
                  Notre Politique de Confidentialité explique comment nous
                  collectons, utilisons et protégeons vos données personnelles
                  conformément aux réglementations en vigueur.
                </Text>
                <TouchableOpacity
                  style={styles.readMoreButton}
                  onPress={openPrivacyPolicy}
                >
                  <Text style={styles.readMoreText}>Lire la politique</Text>
                  <MaterialIcons
                    name="open-in-new"
                    size={16}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.acceptanceSection}>
              <View style={styles.checkboxRow}>
                <Checkbox
                  checked={termsAccepted}
                  onPress={toggleTermsAccepted}
                />
                <Text style={styles.checkboxLabel}>
                  J&apos;ai lu et j&apos;accepte les{" "}
                  <Text style={styles.linkText} onPress={openTerms}>
                    Conditions Générales d&apos;Utilisation
                  </Text>
                </Text>
              </View>

              <View style={styles.checkboxRow}>
                <Checkbox
                  checked={privacyAccepted}
                  onPress={togglePrivacyAccepted}
                />
                <Text style={styles.checkboxLabel}>
                  J&apos;ai lu et j&apos;accepte la{" "}
                  <Text style={styles.linkText} onPress={openPrivacyPolicy}>
                    Politique de Confidentialité
                  </Text>
                </Text>
              </View>
            </View>

            <View style={styles.noteSection}>
              <MaterialIcons name="info" size={20} color={COLORS.primary} />
              <Text style={styles.noteText}>
                En cochant ces cases, vous confirmez avoir pris connaissance de
                nos conditions et vous donnez votre consentement pour le
                traitement de vos données personnelles conformément à notre
                politique de confidentialité.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={styles.bottomContainer}>
        <Button
          title="Précédent"
          style={styles.prevButton}
          textColor={dark ? COLORS.white : COLORS.primary}
          onPress={() => navigate("registrationStep4")}
        />
        <Button
          title="Confirmer"
          filled
          style={[
            styles.nextButton,
            (!termsAccepted || !privacyAccepted) && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={!termsAccepted || !privacyAccepted}
        />
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
    padding: 16,
    backgroundColor: COLORS.white,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#111",
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    marginBottom: 100,
  },
  instructions: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
    color: "#555",
    textAlign: "center",
  },
  termsSection: {
    marginBottom: 24,
  },
  termsCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  termsCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  termsCardDescription: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 12,
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  readMoreText: {
    color: COLORS.primary,
    fontWeight: "500",
    marginRight: 4,
  },
  acceptanceSection: {
    marginBottom: 24,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.greyscale400,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  linkText: {
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
  noteSection: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  noteText: {
    fontSize: 12,
    color: "#555",
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 32,
    right: 16,
    left: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    width: SIZES.width - 32,
    alignItems: "center",
  },
  prevButton: {
    width: (SIZES.width - 32) / 2 - 8,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  nextButton: {
    width: (SIZES.width - 32) / 2 - 8,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  disabledButton: {
    backgroundColor: COLORS.greyscale300,
    borderColor: COLORS.greyscale300,
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
    color: COLORS.greyscale600,
    textAlign: "center",
    marginVertical: 12,
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
  modalIllustration: {
    height: 150,
    width: 150,
    marginVertical: 22,
  },
});

export default RegistrationStep5;
