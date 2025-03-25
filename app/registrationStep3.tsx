import { useNavigation } from "expo-router";
import ProgressBar from "@/components/ProgressBar";
import React, { useRef, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import Header from "../components/Header";
import Button from "../components/Button";
import { SIZES, COLORS } from "../constants";
import { useTheme } from "../theme/ThemeProvider";

type Nav = {
  navigate: (value: string) => void;
};

const RegistrationStep3 = () => {
  const { navigate } = useNavigation<Nav>();
  const { colors, dark } = useTheme();
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [remainingTime, setRemainingTime] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>(Array(6).fill(null));

  // Timer for resend button
  useEffect(() => {
    if (remainingTime > 0 && !canResend) {
      const timer = setTimeout(() => {
        setRemainingTime((prev) => prev - 1); // Utiliser une fonction pour éviter des problèmes d'état
      }, 1000);

      return () => clearTimeout(timer); // Retourner une fonction de nettoyage
    }

    if (remainingTime === 0 && !canResend) {
      setCanResend(true);
    }

    return undefined;
  }, [remainingTime, canResend]);

  const handleCodeChange = (text: string, index: number) => {
    // Ensure only numbers are entered
    if (!/^\d*$/.test(text)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input if current input is filled
    if (text !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace to move to previous input
    if (e.nativeEvent.key === "Backspace" && index > 0 && code[index] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    // Mock resend code functionality
    Alert.alert(
      "Code renvoyé",
      "Un nouveau code de vérification a été envoyé à votre adresse email."
    );
    setRemainingTime(60);
    setCanResend(false);
  };

  const handleVerifyCode = () => {
    // const codeString = code.join("");

    // if (codeString.length !== 6) {
    //   Alert.alert("Erreur", "Veuillez entrer le code complet à 6 chiffres.");
    //   return;
    // }

    // Here you would normally verify the code with your backend
    // For demonstration, just check if all digits are entered
    // if (codeString.length === 6 && /^\d{6}$/.test(codeString)) {
    navigate("registrationStep4");
    // } else {
    //   Alert.alert(
    //     "Erreur",
    //     "Code de vérification invalide. Veuillez réessayer."
    //   );
    // }
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Inscription" />
        <ProgressBar currentStep={2} steps={["1", "2", "3", "4", "5"]} />
        <Text style={styles.stepTitle}>Vérification de l&apos;Email</Text>

        <View style={styles.contentContainer}>
          <Text style={styles.description}>
            Un code de vérification à 6 chiffres a été envoyé à votre adresse
            email. Veuillez entrer le code ci-dessous pour valider votre compte.
          </Text>

          <View style={styles.codeInputContainer}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.codeInput,
                    {
                      borderColor: code[index]
                        ? COLORS.primary
                        : COLORS.greyscale300,
                    },
                  ]}
                  maxLength={1}
                  keyboardType="number-pad"
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  value={code[index]}
                />
              ))}
          </View>

          <TouchableOpacity
            style={styles.resendContainer}
            onPress={canResend ? handleResendCode : undefined}
            disabled={!canResend}
          >
            <Text
              style={[
                styles.resendText,
                !canResend && { color: COLORS.grayscale400 },
              ]}
            >
              {canResend
                ? "Renvoyer le code"
                : `Renvoyer le code (${remainingTime}s)`}
            </Text>
          </TouchableOpacity>

          <Button
            title="Vérifier"
            filled
            style={styles.verifyButton}
            onPress={handleVerifyCode}
          />
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Button
          title="Précédent"
          style={styles.prevButton}
          textColor={dark ? COLORS.white : COLORS.primary}
          onPress={() => navigate("registrationStep2")}
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
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: -80,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 30,
    color: "#555",
    lineHeight: 20,
  },
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },
  codeInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
  },
  resendContainer: {
    marginBottom: 30,
  },
  resendText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  verifyButton: {
    width: "100%",
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 32,
    left: 16,
    width: SIZES.width - 32,
    alignItems: "flex-start",
  },
  prevButton: {
    width: (SIZES.width - 32) / 2 - 8,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
});

export default RegistrationStep3;
