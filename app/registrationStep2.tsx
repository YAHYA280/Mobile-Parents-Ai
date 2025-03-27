import { useNavigation } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import ProgressBar from "@/components/ProgressBar";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import Input from "../components/Input";
import Header from "../components/Header";
import Button from "../components/Button";
import { SIZES, COLORS } from "../constants";
import { useTheme } from "../theme/ThemeProvider";
import { reducer } from "../utils/reducers/formReducers";
import { validateInput } from "../utils/actions/formActions";

const isTestMode = true;

const initialState = {
  inputValues: {
    city: isTestMode ? "Paris" : "",
    address: isTestMode ? "123 Rue Example" : "",
    email: isTestMode ? "example@email.com" : "",
    confirmEmail: isTestMode ? "example@email.com" : "",
    password: isTestMode ? "Password123!" : "",
    confirmPassword: isTestMode ? "Password123!" : "",
  },
  inputValidities: {
    city: false,
    address: false,
    email: false,
    confirmEmail: false,
    password: false,
    confirmPassword: false,
  },
  formIsValid: false,
};

type Nav = {
  navigate: (value: string) => void;
};

const RegistrationStep2 = () => {
  const { navigate } = useNavigation<Nav>();
  const [error, setError] = useState();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const { colors, dark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [emailsMatch, setEmailsMatch] = useState(true);

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      });

      // Check if emails match
      if (inputId === "email" || inputId === "confirmEmail") {
        if (inputId === "email") {
          setEmailsMatch(
            inputValue === formState.inputValues.confirmEmail ||
              formState.inputValues.confirmEmail === ""
          );
        } else {
          setEmailsMatch(inputValue === formState.inputValues.email);
        }
      }

      // Check if passwords match
      if (inputId === "password" || inputId === "confirmPassword") {
        if (inputId === "password") {
          setPasswordsMatch(
            inputValue === formState.inputValues.confirmPassword ||
              formState.inputValues.confirmPassword === ""
          );
        } else {
          setPasswordsMatch(inputValue === formState.inputValues.password);
        }
      }
    },
    [dispatchFormState, formState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert("Une erreur est survenue", error);
    }
  }, [error]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Validate before navigation
  const handleNextStep = () => {
    // if (!emailsMatch) {
    //   Alert.alert("Erreur", "Les adresses email ne correspondent pas.");
    //   return;
    // }

    // if (!passwordsMatch) {
    //   Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
    //   return;
    // }

    // if (!formState.formIsValid) {
    //   Alert.alert(
    //     "Formulaire incomplet",
    //     "Veuillez remplir tous les champs correctement."
    //   );
    //   return;
    // }

    navigate("registrationStep3");
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Inscription" />
        <ProgressBar currentStep={1} steps={["1", "2", "3", "4", "5"]} />{" "}
        <Text style={styles.stepTitle}>Informations de connexion</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {/* Email Section */}
            <Text style={styles.sectionTitle}>Informations de contact</Text>

            <Input
              id="email"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities.email}
              placeholder="Email"
              placeholderTextColor={COLORS.gray}
              value={formState.inputValues.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              id="confirmEmail"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities.confirmEmail}
              placeholder="Confirmation email"
              placeholderTextColor={COLORS.gray}
              value={formState.inputValues.confirmEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {!emailsMatch && (
              <Text style={styles.errorText}>
                Les adresses email ne correspondent pas
              </Text>
            )}

            {/* Password Section */}
            <Text style={styles.sectionTitle}>Sécurité</Text>

            <View style={styles.passwordContainer}>
              <Input
                id="password"
                onInputChanged={inputChangedHandler}
                errorText={formState.inputValidities.password}
                placeholder="Mot de passe"
                placeholderTextColor={COLORS.gray}
                value={formState.inputValues.password}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={togglePasswordVisibility}
              >
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={24}
                  color={COLORS.gray}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <Input
                id="confirmPassword"
                onInputChanged={inputChangedHandler}
                errorText={formState.inputValidities.confirmPassword}
                placeholder="Confirmation du mot de passe"
                placeholderTextColor={COLORS.gray}
                value={formState.inputValues.confirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={toggleConfirmPasswordVisibility}
              >
                <MaterialIcons
                  name={showConfirmPassword ? "visibility" : "visibility-off"}
                  size={24}
                  color={COLORS.gray}
                />
              </TouchableOpacity>
            </View>

            {!passwordsMatch && (
              <Text style={styles.errorText}>
                Les mots de passe ne correspondent pas
              </Text>
            )}

            <View style={styles.passwordHintContainer}>
              <Text style={styles.passwordHintTitle}>
                Votre mot de passe doit contenir :
              </Text>
              <Text style={styles.passwordHint}>• Au moins 8 caractères</Text>
              <Text style={styles.passwordHint}>
                • Au moins une lettre majuscule
              </Text>
              <Text style={styles.passwordHint}>
                • Au moins une lettre minuscule
              </Text>
              <Text style={styles.passwordHint}>• Au moins un chiffre</Text>
              <Text style={styles.passwordHint}>
                • Au moins un caractère spécial
              </Text>
            </View>

            {/* Add some space at the bottom for scrolling */}
            <View style={{ height: 100 }} />
          </View>
        </ScrollView>
      </View>

      <View style={styles.bottomContainer}>
        <Button
          title="Précédent"
          style={styles.prevButton}
          textColor={dark ? COLORS.white : COLORS.primary}
          onPress={() => navigate("registrationStep1")}
        />
        <Button
          title="Suivant"
          filled
          style={styles.nextButton}
          onPress={handleNextStep}
        />
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#111",
  },
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 25,
    zIndex: 1,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
  passwordHintContainer: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  passwordHintTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  passwordHint: {
    color: "#555",
    fontSize: 12,
    marginBottom: 4,
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
});

export default RegistrationStep2;
