import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { FONTS } from "@/constants/fonts";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { ThemeProvider } from "@/theme/ThemeProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [loaded] = useFonts(FONTS);

  useEffect(() => {
    // Vérifier si c'est la première ouverture de l'app
    const checkFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem("alreadyLaunched");

        if (value === null) {
          // C'est la première ouverture
          await AsyncStorage.setItem("alreadyLaunched", "true");
          setIsFirstLaunch(true);
        } else {
          // Ce n'est pas la première ouverture
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification du premier lancement:",
          error
        );
        // En cas d'erreur, on considère que ce n'est pas la première ouverture
        setIsFirstLaunch(false);
      } finally {
        if (loaded) {
          SplashScreen.hideAsync();
        }
      }
    };

    checkFirstLaunch();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {isFirstLaunch ? (
          // Flux pour la première ouverture
          <>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding3" />
          </>
        ) : null}
        <Stack.Screen name="login" />
        <Stack.Screen name="registrationStep1" />
        <Stack.Screen name="registrationStep2" />
        <Stack.Screen name="registrationStep3" />
        <Stack.Screen name="registrationStep4" />
        <Stack.Screen name="registrationStep5" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="listeenfants" />
        <Stack.Screen name="addchild" />
        <Stack.Screen name="abonnementcatalogue" />
        <Stack.Screen name="planDetails" />
        <Stack.Screen name="addobjective" />
        <Stack.Screen name="abonnementActuel" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
