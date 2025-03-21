import { useNavigation } from "expo-router";
import { OtpInput } from "react-native-otp-entry";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { COLORS } from "../constants";
import Header from "../components/Header";
import Button from "../components/Button";
import { useTheme } from "../theme/ThemeProvider";

type Nav = {
  navigate: (value: string) => void;
};

// OTP verification screen
const OTPVerification = () => {
  const { navigate } = useNavigation<Nav>();
  const [time, setTime] = useState(50);
  const { colors, dark } = useTheme();
  const [otp, setOtp] = useState("");
  const [isTimerActive, setIsTimerActive] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        }
        setIsTimerActive(false);
        return 0;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleResendCode = () => {
    // Ici, vous mettriez la logique pour renvoyer le code
    // Par exemple, un appel API pour demander un nouveau code

    // Simuler l'envoi d'un nouveau code
    Alert.alert(
      "Code envoyé",
      "Un nouveau code a été envoyé à votre adresse email."
    );

    // Réinitialiser le compteur
    setTime(50);
    setIsTimerActive(true);
  };

  const handleVerify = () => {
    if (otp.length === 4) {
      navigate("createnewpassword");
    } else {
      Alert.alert("Code incomplet", "Veuillez entrer les 4 chiffres du code.");
    }
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Mot de passe oublié" />
        <ScrollView>
          <Text
            style={[
              styles.title,
              {
                color: dark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Le code a été envoyé à votre email
          </Text>
          <OtpInput
            numberOfDigits={4}
            onTextChange={(text) => setOtp(text)}
            focusColor={COLORS.primary}
            focusStickBlinkingDuration={500}
            onFilled={(text) => console.log(`OTP is ${text}`)}
            theme={{
              pinCodeContainerStyle: {
                backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite,
                borderColor: dark ? COLORS.gray : COLORS.secondaryWhite,
                borderWidth: 0.4,
                borderRadius: 10,
                height: 58,
                width: 58,
              },
              pinCodeTextStyle: {
                color: dark ? COLORS.white : COLORS.black,
              },
            }}
          />

          {isTimerActive ? (
            <View style={styles.codeContainer}>
              <Text
                style={[
                  styles.code,
                  {
                    color: dark ? COLORS.white : COLORS.greyscale900,
                  },
                ]}
              >
                Renvoyer le code dans
              </Text>
              <Text style={styles.time}>{`  ${time} `}</Text>
              <Text
                style={[
                  styles.code,
                  {
                    color: dark ? COLORS.white : COLORS.greyscale900,
                  },
                ]}
              >
                s
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleResendCode}
              style={styles.resendButtonContainer}
            >
              <Text style={styles.resendButtonText}>Renvoyer le code</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
        <Button
          title="Vérifier"
          filled
          style={styles.button}
          onPress={handleVerify}
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
  title: {
    fontSize: 18,
    fontFamily: "medium",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 54,
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    justifyContent: "center",
  },
  code: {
    fontSize: 18,
    fontFamily: "medium",
    color: COLORS.greyscale900,
    textAlign: "center",
  },
  time: {
    fontFamily: "medium",
    fontSize: 18,
    color: COLORS.primary,
  },
  button: {
    borderRadius: 32,
  },
  resendButtonContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  resendButtonText: {
    fontFamily: "medium",
    fontSize: 18,
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
});

export default OTPVerification;
