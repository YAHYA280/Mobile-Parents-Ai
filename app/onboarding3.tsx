import { useNavigation } from "expo-router";
import { View, Text, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "../components/Button";
import DotsView from "../components/DotsView";
import { COLORS, images } from "../constants";
import { useTheme } from "../theme/ThemeProvider";
import PageContainer from "../components/PageContainer";
import Onboarding1Styles from "../styles/OnboardingStyles";

type Nav = {
  navigate: (value: string) => void;
};

const Onboarding3 = () => {
  const [hasNavigated, setHasNavigated] = useState(false);
  const [progress, setProgress] = useState(0);
  const { colors } = useTheme();
  const { navigate } = useNavigation<Nav>();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 1) {
          clearInterval(intervalId);
          return prevProgress;
        }
        return prevProgress + 0.5;
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (progress >= 1 && !hasNavigated) {
      setHasNavigated(true);
      navigate("onboarding3");
    }
  }, [progress, navigate, hasNavigated]);

  const navigateToLogin = () => {
    setHasNavigated(true);
    navigate("login");
  };
  return (
    <SafeAreaView
      style={[
        Onboarding1Styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <PageContainer>
        <View style={Onboarding1Styles.contentContainer}>
          <Image
            source={images.educate4}
            resizeMode="contain"
            style={Onboarding1Styles.illustration}
          />
          <Image
            source={images.ornament}
            resizeMode="contain"
            style={Onboarding1Styles.ornament}
          />
          <View
            style={[
              Onboarding1Styles.buttonContainer,
              {
                backgroundColor: colors.background,
              },
            ]}
          >
            <View style={Onboarding1Styles.titleContainer}>
              <Text style={[Onboarding1Styles.title, { color: colors.text }]}>
                Suivi de l&apos;apprentissage
              </Text>
              <Text style={Onboarding1Styles.subTitle}>DE VOTRE ENFANT</Text>
            </View>

            <Text
              style={[Onboarding1Styles.description, { color: colors.text }]}
            >
              Accompagnez votre enfant et suivez ses progrès facilement.
            </Text>

            <View style={Onboarding1Styles.dotsContainer}>
              {progress < 1 && <DotsView progress={progress} numDots={3} />}
            </View>
            <Button
              title="Suivant"
              filled
              onPress={() => navigate("welcome")}
              style={Onboarding1Styles.nextButton}
            />
            <Button
              title="Passer"
              onPress={navigateToLogin}
              textColor={COLORS.primary}
              style={Onboarding1Styles.skipButton}
            />
          </View>
        </View>
      </PageContainer>
    </SafeAreaView>
  );
};

export default Onboarding3;
