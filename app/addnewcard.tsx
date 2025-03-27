import type { NavigationProp } from "@react-navigation/native";

import Card from "@/components/Card";
import { useNavigation } from "expo-router";
import { View, Text, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform, ScrollView, KeyboardAvoidingView } from "react-native";
import React, { useState, useEffect, useReducer, useCallback } from "react";

import Input from "../components/Input";
import Button from "../components/Button";
import Header from "../components/Header";
import { SIZES, COLORS } from "../constants";
import { useTheme } from "../theme/ThemeProvider";
import { commonStyles } from "../styles/CommonStyles";
import { reducer } from "../utils/reducers/formReducers";
import { validateInput } from "../utils/actions/formActions";

const initialState = {
  inputValues: {
    creditCardHolderName: "",
    creditCardNumber: "",
    creditCardExpiryDate: "",
    cvv: "",
  },
  inputValidities: {
    creditCardHolderName: false,
    creditCardNumber: false,
    creditCardExpiryDate: false,
    cvv: false,
  },
  formIsValid: false,
};

const AddNewCard = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [error, setError] = useState<string | null>(null);
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const { colors, dark } = useTheme();

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
  const handleAddCard = () => {
    // if (formState.formIsValid) {
    navigation.navigate("confirmAddNewCard");
    // } else {
    //   setError("Veuillez remplir correctement tous les champs");
    // }
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Une erreur est survenue", error);
    }
  }, [error]);

  const renderPaymentForm = () => {
    return (
      <View style={{ marginVertical: 22 }}>
        <Card
          containerStyle={styles.card}
          number="•••• •••• •••• ••••"
          name="*****"
          date="MM/YY"
        />
        <View style={{ marginTop: 12 }}>
          <Text
            style={[
              commonStyles.inputHeader,
              {
                color: dark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Nom du titulaire de la carte
          </Text>
          <Input
            id="creditCardHolderName"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.creditCardHolderName}
            placeholder="Entrer le nom du titulaire"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
          />
        </View>
        <View style={{ marginTop: 12 }}>
          <Text
            style={[
              commonStyles.inputHeader,
              {
                color: dark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Numéro de la carte
          </Text>
          <Input
            id="creditCardNumber"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.creditCardNumber}
            placeholder="0000 0000 0000 0000"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 12,
          }}
        >
          <View style={{ width: (SIZES.width - 32) / 2 - 10 }}>
            <Text
              style={[
                commonStyles.inputHeader,
                {
                  color: dark ? COLORS.white : COLORS.black,
                },
              ]}
            >
              Date d&apos;expiration
            </Text>
            <Input
              id="creditCardExpiryDate"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities.creditCardExpiryDate}
              placeholder="mm/yyyy"
              placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            />
          </View>
          <View style={{ width: (SIZES.width - 32) / 2 - 10 }}>
            <Text
              style={[
                commonStyles.inputHeader,
                {
                  color: dark ? COLORS.white : COLORS.black,
                },
              ]}
            >
              CVV
            </Text>
            <Input
              id="cvv"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities.cvv}
              placeholder="000"
              placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1, margin: 16 }}>
            <Header title="Ajouter une nouvelle carte" />
            {renderPaymentForm()}
            <View style={styles.contentContainer}>
              <Button
                filled
                title="Ajouter une nouvelle carte"
                onPress={handleAddCard}
                style={styles.addBtn}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: 20,
    width: SIZES.width - 32,
  },
  card: {
    width: SIZES.width - 32,
    borderRadius: 16,
    marginVertical: 6,
  },
  addBtn: {
    borderRadius: 32,
  },
});

export default AddNewCard;
