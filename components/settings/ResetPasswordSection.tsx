import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../constants";

type Nav = {
  navigate: (value: string) => void;
};

interface ResetPasswordSectionProps {
  dark: boolean;
  isOpen: boolean;
}

const ResetPasswordSection: React.FC<ResetPasswordSectionProps> = ({
  dark,
  isOpen,
}) => {
  const { navigate } = useNavigation<Nav>();
  const [loading, setLoading] = useState(false);

  const handleSendCode = () => {
    setLoading(true);
    // Simulate sending verification code
    setTimeout(() => {
      setLoading(false);
      navigate("settingscodeverification");
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <View style={styles.sectionContent}>
      <View
        style={[
          styles.formContainer,
          { backgroundColor: dark ? COLORS.dark2 : "#FFFFFF" },
        ]}
      >
        <View style={styles.illustrationContainer}>
          <Ionicons
            name="mail"
            size={40}
            color={COLORS.primary}
            style={{ opacity: 0.9 }}
          />
        </View>

        <Text
          style={[styles.title, { color: dark ? COLORS.white : COLORS.black }]}
        >
          Réinitialiser votre mot de passe
        </Text>

        <Text
          style={[
            styles.formInstructions,
            { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
          ]}
        >
          Nous enverrons un code de vérification à votre adresse e-mail
          enregistrée. Utilisez ce code pour réinitialiser votre mot de passe.
        </Text>

        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendCode}
          activeOpacity={0.7}
          disabled={loading}
        >
          <LinearGradient
            colors={[COLORS.primary, "#ff7043"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.sendGradient}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.sendText}>Envoyer le code</Text>
                <Ionicons
                  name="send"
                  size={18}
                  color="#FFFFFF"
                  style={styles.sendIcon}
                />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContent: {
    marginTop: -16,
    marginBottom: 16,
    paddingBottom: 8,
  },
  formContainer: {
    borderRadius: 12,
    padding: 24,
    marginBottom: 8,
    alignItems: "center",
  },
  illustrationContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  formInstructions: {
    fontSize: 14,
    fontFamily: "regular",
    marginBottom: 24,
    lineHeight: 22,
    textAlign: "center",
  },
  sendButton: {
    borderRadius: 12,
    overflow: "hidden",
    width: "100%",
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  sendGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  sendText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "semibold",
    marginRight: 8,
  },
  sendIcon: {
    marginLeft: 4,
  },
});

export default ResetPasswordSection;
