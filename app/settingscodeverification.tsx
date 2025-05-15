import { useNavigation } from "expo-router";
import { OtpInput } from "react-native-otp-entry";
import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { COLORS } from "../constants";
import Header from "../components/ui/Header"; // Updated import path
import Button from "../components/Button";
import { useTheme } from "../theme/ThemeProvider";

type Nav = {
  goBack: any;
  navigate: (value: string) => void;
};

// OTP verification screen
const SettingsCodeVerification = () => {
  const navigation = useNavigation<Nav>();
  const [time, setTime] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
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
    if (otp.length < 4) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate("settingsresetpassword");
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Réinitialiser mot de passe"
        subtitle="Vérification du code"
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={[COLORS.primary, "#ff7043"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.iconBackground}
          >
            <Ionicons name="mail" size={32} color="#FFFFFF" />
          </LinearGradient>
        </View>

        <Text
          style={[styles.title, { color: dark ? COLORS.white : COLORS.black }]}
        >
          Code de Vérification
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
          ]}
        >
          Le code a été envoyé à l'email{" "}
          <Text style={styles.email}>jack_Duboix@gmail.com</Text>
        </Text>

        <View style={styles.otpContainer}>
          <OtpInput
            numberOfDigits={4}
            onTextChange={(text) => setOtp(text)}
            focusColor={COLORS.primary}
            focusStickBlinkingDuration={500}
            onFilled={(text) => setOtp(text)}
            theme={{
              pinCodeContainerStyle: {
                backgroundColor: dark ? COLORS.dark2 : "#F8F9FA",
                borderColor: dark ? COLORS.gray : "#E8E8E8",
                borderWidth: 1,
                borderRadius: 12,
                height: 64,
                width: 64,
                marginHorizontal: 8,
                ...styles.otpDigitContainer,
              },
              pinCodeTextStyle: {
                color: dark ? COLORS.white : COLORS.black,
                fontSize: 24,
                fontFamily: "medium",
              },
            }}
          />
        </View>

        <View style={styles.timerContainer}>
          {time > 0 ? (
            <>
              <Text
                style={[
                  styles.timerText,
                  { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
                ]}
              >
                Renvoyer le code dans{" "}
              </Text>
              <View style={styles.timerBadge}>
                <Text style={styles.timerDigits}>{formatTime(time)}</Text>
              </View>
            </>
          ) : (
            <Text
              style={[
                styles.timerText,
                { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
              ]}
            >
              Vous n'avez pas reçu le code?
            </Text>
          )}
        </View>

        <View style={styles.buttonsContainer}>
          {time === 0 ? (
            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendCode}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={["rgba(255,142,105,0.2)", "rgba(255,142,105,0.1)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.resendGradient}
              >
                <Ionicons
                  name="refresh"
                  size={18}
                  color={COLORS.primary}
                  style={styles.resendIcon}
                />
                <Text style={styles.resendText}>Renvoyer le code</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholderButton} />
          )}

          <TouchableOpacity
            style={[
              styles.verifyButton,
              otp.length < 4 && styles.verifyButtonDisabled,
            ]}
            onPress={handleVerify}
            disabled={otp.length < 4 || isLoading}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[COLORS.primary, "#ff7043"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.verifyGradient}
            >
              {isLoading ? (
                <View style={styles.loadingIndicator} />
              ) : (
                <>
                  <Text style={styles.verifyText}>Vérifier</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color="#FFFFFF"
                    style={styles.verifyIcon}
                  />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "regular",
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 22,
  },
  email: {
    fontFamily: "semibold",
    color: COLORS.primary,
  },
  otpContainer: {
    marginBottom: 24,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  otpDigitContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 48,
  },
  timerText: {
    fontSize: 14,
    fontFamily: "medium",
  },
  timerBadge: {
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerDigits: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: "bold",
  },
  buttonsContainer: {
    width: "100%",
    marginTop: "auto",
    marginBottom: 24,
    gap: 16,
  },
  resendButton: {
    borderRadius: 30,
    overflow: "hidden",
  },
  resendGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 30,
  },
  resendIcon: {
    marginRight: 8,
  },
  resendText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: "semibold",
  },
  placeholderButton: {
    height: 52,
  },
  verifyButton: {
    borderRadius: 30,
    overflow: "hidden",
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  verifyGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 30,
  },
  verifyText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "semibold",
  },
  verifyIcon: {
    marginLeft: 8,
  },
  loadingIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    animationName: "spin",
    animationDuration: "1s",
    animationIterationCount: "infinite",
    animationTimingFunction: "linear",
  },
});

export default SettingsCodeVerification;
