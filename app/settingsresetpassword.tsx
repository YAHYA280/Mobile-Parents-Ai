import Checkbox from "expo-checkbox";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import Input from "../components/Input";
import Header from "../components/ui/Header";
import { useTheme } from "../theme/ThemeProvider";
import { reducer } from "../utils/reducers/formReducers";
import { validateInput } from "../utils/actions/formActions";
import { SIZES, icons, COLORS, illustrations } from "../constants";

type Nav = {
  goBack: any;
  navigate: (value: string) => void;
};

const isTestMode = true;

const initialState = {
  inputValues: {
    newPassword: isTestMode ? "**********" : "",
    confirmNewPassword: isTestMode ? "**********" : "",
  },
  inputValidities: {
    newPassword: false,
    confirmNewPassword: false,
  },
  formIsValid: false,
};

const CreateNewPassword = () => {
  const navigation = useNavigation<Nav>();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState(null);
  const [isChecked, setChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { colors } = useTheme();

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      });
    },
    [dispatchFormState]
  );

  const handleHelpPress = () => {
    // Navigate to the support interface
    // navigate("support");
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Une erreur s'est produite", error);
    }
  }, [error]);

  // render success modal
  const renderModal = () => (
    <Modal animationType="slide" transparent visible={modalVisible}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: COLORS.white,
              },
            ]}
          >
            <View style={styles.successIconContainer}>
              <LinearGradient
                colors={[COLORS.primary, "#3CAE5C"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.successIconGradient}
              >
                <Ionicons name="checkmark" size={40} color="#FFFFFF" />
              </LinearGradient>
            </View>

            <Text style={styles.modalTitle}>
              Mot de passe modifié avec succès!
            </Text>

            <Text
              style={[
                styles.modalDescription,
                {
                  color: COLORS.greyscale600,
                },
              ]}
            >
              Lors de la prochaine connexion, veuillez utiliser le nouveau mot
              de passe.
            </Text>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("(tabs)");
              }}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[COLORS.primary, "#ff7043"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueGradient}
              >
                <Text style={styles.continueText}>Continuer</Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#FFFFFF"
                  style={styles.continueIcon}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Réinitialiser mot de passe"
        subtitle="Créer un nouveau mot de passe"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentContainer}>
          <View style={styles.illustrationContainer}>
            <Image
              source={illustrations.success}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={[styles.title, { color: COLORS.black }]}>
              Créez votre nouveau mot de passe
            </Text>

            <Text style={[styles.subtitle, { color: COLORS.greyscale600 }]}>
              Votre mot de passe doit contenir au moins 8 caractères, incluant
              des majuscules et des chiffres
            </Text>

            <View style={styles.inputsContainer}>
              <Input
                onInputChanged={inputChangedHandler}
                errorText={formState.inputValidities.newPassword}
                autoCapitalize="none"
                id="newPassword"
                placeholder="Nouveau mot de passe"
                placeholderTextColor={COLORS.grayscale400}
                icon={icons.padlock}
                secureTextEntry
              />

              <Input
                onInputChanged={inputChangedHandler}
                errorText={formState.inputValidities.confirmNewPassword}
                autoCapitalize="none"
                id="confirmNewPassword"
                placeholder="Confirmer le nouveau mot de passe"
                placeholderTextColor={COLORS.grayscale400}
                icon={icons.padlock}
                secureTextEntry
              />
            </View>

            <View style={styles.checkBoxContainer}>
              <TouchableOpacity
                style={styles.checkboxWrapper}
                onPress={() => setChecked(!isChecked)}
                activeOpacity={0.7}
              >
                <Checkbox
                  style={[
                    styles.checkbox,
                    {
                      borderColor: isChecked
                        ? COLORS.primary
                        : COLORS.grayscale400,
                    },
                  ]}
                  value={isChecked}
                  color={isChecked ? COLORS.primary : undefined}
                  onValueChange={setChecked}
                />
                <Text style={[styles.checkboxLabel, { color: COLORS.black }]}>
                  Se souvenir de moi
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.helpLinkContainer}
              onPress={handleHelpPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name="help-circle-outline"
                size={18}
                color={COLORS.primary}
                style={styles.helpIcon}
              />
              <Text style={styles.helpLink}>Besoin d&apos;aide?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[COLORS.primary, "#ff7043"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitGradient}
          >
            <Text style={styles.submitText}>Continuer</Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color="#FFFFFF"
              style={styles.submitIcon}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {renderModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  illustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  illustration: {
    width: SIZES.width * 0.8,
    height: 220,
  },
  formContainer: {
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontFamily: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "regular",
    marginBottom: 24,
    lineHeight: 20,
  },
  inputsContainer: {
    marginBottom: 16,
  },
  checkBoxContainer: {
    marginBottom: 16,
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 12,
    height: 20,
    width: 20,
    borderRadius: 4,
    borderWidth: 2,
  },
  checkboxLabel: {
    fontSize: 15,
    fontFamily: "medium",
  },
  helpLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  helpIcon: {
    marginRight: 8,
  },
  helpLink: {
    fontSize: 15,
    fontFamily: "medium",
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
  buttonContainer: {
    padding: 24,
    paddingTop: 16,
  },
  submitButton: {
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 30,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "semibold",
  },
  submitIcon: {
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  successIconContainer: {
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  successIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    fontFamily: "regular",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  continueButton: {
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 30,
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "semibold",
  },
  continueIcon: {
    marginLeft: 8,
  },
});

export default CreateNewPassword;
