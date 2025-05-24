import Checkbox from "expo-checkbox";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";

import Input from "../components/Input";
import Header from "../components/Header";
import Button from "../components/Button";
import { useTheme } from "../theme/ThemeProvider";
import { reducer } from "../utils/reducers/formReducers";
import { validateInput } from "../utils/actions/formActions";
import { SIZES, icons, COLORS, illustrations } from "../constants";

type Nav = {
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
  const { navigate } = useNavigation<Nav>();
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

  useEffect(() => {
    if (error) {
      Alert.alert("Une erreur s'est produite", error);
    }
  }, [error]);

  // render modal
  const renderModal = () => (
    <Modal animationType="slide" transparent visible={modalVisible}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={[styles.modalContainer]}>
          <View
            style={[
              styles.modalSubContainer,
              {
                backgroundColor: COLORS.secondaryWhite,
              },
            ]}
          >
            <Image
              source={illustrations.passwordSuccess}
              resizeMode="contain"
              style={styles.modalIllustration}
            />
            <Text style={styles.modalTitle}>Félicitations !</Text>
            <Text
              style={[
                styles.modalSubtitle,
                {
                  color: COLORS.greyscale600,
                },
              ]}
            >
              Votre compte est prêt à être utilisé. Vous serez redirigé vers la
              page d&apos;accueil dans quelques secondes..
            </Text>
            <Button
              title="Continuer"
              filled
              onPress={() => {
                setModalVisible(false);
                navigate("login");
              }}
              style={{
                width: "100%",
                marginTop: 12,
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Nouveau mot de passe" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image
              source={illustrations.success}
              resizeMode="contain"
              style={styles.success}
            />
          </View>
          <Text style={[styles.title, { color: COLORS.black }]}>
            Créez votre nouveau mot de passe
          </Text>
          <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.newPassword}
            autoCapitalize="none"
            id="newPassword"
            placeholder="Nouveau mot de passe"
            placeholderTextColor={COLORS.black}
            icon={icons.padlock}
            secureTextEntry
          />
          <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.confirmNewPassword}
            autoCapitalize="none"
            id="confirmNewPassword"
            placeholder="Confirmer le nouveau mot de passe"
            placeholderTextColor={COLORS.black}
            icon={icons.padlock}
            secureTextEntry
          />
          <View style={styles.checkBoxContainer}>
            <View style={{ flexDirection: "row" }}>
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                color={isChecked ? COLORS.primary : "gray"}
                onValueChange={setChecked}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.privacy,
                    {
                      color: COLORS.black,
                    },
                  ]}
                >
                  Se souvenir de moi
                </Text>
              </View>
            </View>
          </View>
          <View />
        </ScrollView>
        <Button
          title="Continuer"
          filled
          onPress={() => setModalVisible(true)}
          style={styles.button}
        />
        {renderModal()}
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
  success: {
    width: SIZES.width * 0.8,
    height: 250,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 52,
  },
  title: {
    fontSize: 18,
    fontFamily: "medium",
    color: COLORS.black,
    marginVertical: 12,
  },
  checkBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 18,
  },
  checkbox: {
    marginRight: 8,
    height: 16,
    width: 16,
    borderRadius: 4,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  privacy: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.black,
  },
  button: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 30,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginVertical: 12,
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.greyscale600,
    textAlign: "center",
    marginVertical: 12,
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalSubContainer: {
    height: 494,
    width: SIZES.width * 0.9,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalIllustration: {
    height: 180,
    width: 180,
    marginVertical: 22,
  },
});

export default CreateNewPassword;
