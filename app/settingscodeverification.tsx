import { useNavigation } from "expo-router";
import { OtpInput } from "react-native-otp-entry";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { COLORS } from "../constants";
import Header from "../components/Header";
import Button from "../components/Button";
import { useTheme } from "../theme/ThemeProvider";

type Nav = {
  navigate: (value: string) => void;
};

// OTP verification screen
const SettingsCodeVerification = () => {
  const { navigate } = useNavigation<Nav>();
  const [time, setTime] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const { colors, dark } = useTheme();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleResendCode = () => {
    setTime(50);
  };

  const handleVerify = () => {
    setIsLoading(true); 
    
    setTimeout(() => {
      setIsLoading(false);
      navigate("settingsresetpassword");
    }, 2000);
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Réinitialiser mot de passe" />
        <ScrollView>
          <Text
            style={[
              styles.title,
              {
                color: dark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Le code a été envoyé à l&apos;email jack_Duboix@gmail.com
          </Text>
          <OtpInput
            numberOfDigits={4}
            onTextChange={(text) => console.log(text)}
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
          <View style={styles.buttonContainer}>
            <Button
              title="Renvoyer le code"
              filled={false}
              style={[styles.button, styles.resendButton]}
              onPress={handleResendCode}
            />
            <Button
              title={isLoading ? "" : "Vérifier"}
              filled
              style={styles.button}
              onPress={handleVerify}
              isLoading={isLoading}
            />
          </View>
        </ScrollView>
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
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
    flex: 1,
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  resendButton: {
    backgroundColor: "transparent",
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
});

export default SettingsCodeVerification;
