import React from "react";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { COLORS, images } from "../constants";
import { useTheme } from "../theme/ThemeProvider";

type Nav = {
  navigate: (value: string) => void;
};

const Welcome = () => {
  const { navigate } = useNavigation<Nav>();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Image source={images.logo} contentFit="contain" style={styles.logo} />
        <Text style={[styles.title, { color: colors.text }]}>
          Bienvenue, Parents !
        </Text>
        <Text style={[styles.subtitle, { color: "black" }]}>
          Suivez facilement l&apos;apprentissage de votre enfant et
          accompagnez-le vers la réussite.
        </Text>

        <View style={{ flexDirection: "row", marginTop: 7 }}>
          <Text style={[styles.loginTitle, { color: "black" }]}>
            Vous avez déjà un compte ?
          </Text>
          <TouchableOpacity onPress={() => navigate("login")}>
            <Text style={styles.loginSubtitle}>Se connecter</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", marginTop: 8 }}>
          <Text style={[styles.loginTitle, { color: "black" }]}>
            Nouvel utilisateur ?
          </Text>
          <TouchableOpacity onPress={() => navigate("registrationStep1")}>
            <Text style={styles.loginSubtitle}>S&apos;inscrire</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={[styles.bottomTitle, { color: COLORS.black }]}>
          En continuant, vous acceptez les Conditions d&apos;utilisation et
        </Text>
        <TouchableOpacity onPress={() => navigate("login")}>
          <Text
            style={[
              styles.bottomSubtitle,
              {
                color: COLORS.black,
              },
            ]}
          >
            la Politique de confidentialité.
          </Text>
        </TouchableOpacity>
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
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 22,
    marginTop: -22,
    // tintColor: COLORS.primary,
  },
  title: {
    fontSize: 28,
    fontFamily: "bold",
    color: COLORS.black,
    marginVertical: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "regular",
    color: "black",
    textAlign: "center",
    paddingHorizontal: 16,
  },
  loginTitle: {
    fontSize: 14,
    fontFamily: "regular",
    color: "black",
  },
  loginSubtitle: {
    fontSize: 14,
    fontFamily: "semiBold",
    color: COLORS.primary,
    marginLeft: 4,
  },

  bottomContainer: {
    position: "absolute",
    bottom: 32,
    width: "95%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    flexWrap: "wrap",
  },
  bottomTitle: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.black,
  },
  bottomSubtitle: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.black,
    textDecorationLine: "underline",
    marginTop: 2,
  },
});

export default Welcome;
