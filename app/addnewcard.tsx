import type { NavigationProp } from "@react-navigation/native";

import { useNavigation } from "expo-router";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform, ScrollView, KeyboardAvoidingView } from "react-native";
import React, { useState, useEffect, useReducer, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";

import Input from "../components/Input";
import Header from "../components/ui/Header";
import { COLORS, COLOORS, RADIUS } from "../constants/theme";
import { reducer } from "../utils/reducers/formReducers";
import { validateInput } from "../utils/actions/formActions";

const { width } = Dimensions.get("window");

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
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Format card number with spaces
  const formattedCardNumber = () => {
    const number =
      formState.inputValues.creditCardNumber || "•••• •••• •••• ••••";
    if (formState.inputValues.creditCardNumber) {
      // Add a space after every 4 digits
      return number.replace(/(\d{4})/g, "$1 ").trim();
    }
    return number;
  };

  // Format expiration date
  const formattedExpiryDate = () => {
    if (formState.inputValues.creditCardExpiryDate) {
      const date = formState.inputValues.creditCardExpiryDate;
      if (date.length >= 2) {
        const month = date.substring(0, 2);
        const year = date.substring(2);
        return `${month}/${year.length ? year : "YY"}`;
      }
      return date;
    }
    return "MM/YY";
  };

  // Format name to uppercase
  const formattedName = () => {
    return formState.inputValues.creditCardHolderName
      ? formState.inputValues.creditCardHolderName.toUpperCase()
      : "******";
  };

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      });

      // Flip card to show CVV when CVV field is focused
      if (inputId === "cvv") {
        setIsCardFlipped(!!inputValue);
      }
    },
    [dispatchFormState]
  );

  const handleInputFocus = (inputId: string) => {
    setFocusedField(inputId);

    if (inputId === "cvv") {
      setIsCardFlipped(true);
    } else {
      setIsCardFlipped(false);
    }
  };

  const handleInputBlur = () => {
    setFocusedField(null);
  };

  const handleAddCard = () => {
    if (formState.formIsValid) {
      navigation.navigate("confirmAddNewCard");
    } else {
      setError("Veuillez remplir correctement tous les champs");
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Une erreur est survenue", error);
    }
  }, [error]);

  const onHeaderLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* Fixed Header */}
      <View style={styles.headerContainer} onLayout={onHeaderLayout}>
        <Header
          title="Ajouter une nouvelle carte"
          subtitle="Ajouter une carte de paiement en toute sécurité"
          onBackPress={() => navigation.goBack()}
        />
      </View>{" "}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: headerHeight }} // Add minimal padding after header
        >
          <View style={styles.container}>
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "spring", damping: 18, stiffness: 120 }}
            >
              {/* Credit Card Preview */}
              <MotiView
                animate={{ rotateY: isCardFlipped ? "180deg" : "0deg" }}
                transition={{ type: "timing", duration: 300 }}
                style={styles.cardPreviewWrapper}
              >
                {!isCardFlipped ? (
                  <LinearGradient
                    colors={[COLOORS.primary.main, "#ff7043"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardPreview}
                  >
                    {/* Card front elements */}
                    <View style={styles.cardChip} />
                    <View style={styles.cardWifi}>
                      <Ionicons
                        name="wifi-outline"
                        size={24}
                        color="#FFFFFF"
                        style={{ transform: [{ rotate: "90deg" }] }}
                      />
                    </View>

                    <MotiView
                      style={styles.cardNumberWrapper}
                      animate={{
                        scale: focusedField === "creditCardNumber" ? 1.05 : 1,
                      }}
                      transition={{ type: "spring", damping: 10 }}
                    >
                      <Text style={styles.cardNumber}>
                        {formattedCardNumber()}
                      </Text>
                    </MotiView>

                    <View style={styles.cardInfoWrapper}>
                      <MotiView
                        animate={{
                          scale:
                            focusedField === "creditCardHolderName" ? 1.05 : 1,
                        }}
                        transition={{ type: "spring", damping: 10 }}
                      >
                        <Text style={styles.cardInfoLabel}>
                          NOM DU TITULAIRE
                        </Text>
                        <Text style={styles.cardInfoValue}>
                          {formattedName()}
                        </Text>
                      </MotiView>
                      <MotiView
                        animate={{
                          scale:
                            focusedField === "creditCardExpiryDate" ? 1.05 : 1,
                        }}
                        transition={{ type: "spring", damping: 10 }}
                      >
                        <Text style={styles.cardInfoLabel}>EXPIRE LE</Text>
                        <Text style={styles.cardInfoValue}>
                          {formattedExpiryDate()}
                        </Text>
                      </MotiView>
                    </View>
                  </LinearGradient>
                ) : (
                  <LinearGradient
                    colors={[COLOORS.primary.main, "#ff7043"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.cardPreview,
                      { transform: [{ rotateY: "180deg" }] },
                    ]}
                  >
                    {/* Card back elements */}
                    <View style={styles.cardStrip} />
                    <View style={styles.cardCvvContainer}>
                      <Text style={styles.cardCvvLabel}>CVV</Text>
                      <MotiView
                        style={styles.cardCvvValue}
                        animate={{
                          scale: focusedField === "cvv" ? 1.05 : 1,
                        }}
                        transition={{ type: "spring", damping: 10 }}
                      >
                        <Text style={styles.cardCvvText}>
                          {formState.inputValues.cvv || "***"}
                        </Text>
                      </MotiView>
                    </View>
                  </LinearGradient>
                )}
              </MotiView>

              {/* Form */}
              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    Nom du titulaire de la carte
                  </Text>
                  <Input
                    id="creditCardHolderName"
                    onInputChanged={inputChangedHandler}
                    errorText={formState.inputValidities.creditCardHolderName}
                    placeholder="Entrer le nom du titulaire"
                    placeholderTextColor="#999999"
                    style={styles.inputField}
                    onFocus={() => handleInputFocus("creditCardHolderName")}
                    onBlur={handleInputBlur}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Numéro de la carte</Text>
                  <Input
                    id="creditCardNumber"
                    onInputChanged={inputChangedHandler}
                    errorText={formState.inputValidities.creditCardNumber}
                    placeholder="0000 0000 0000 0000"
                    placeholderTextColor="#999999"
                    keyboardType="number-pad"
                    style={styles.inputField}
                    onFocus={() => handleInputFocus("creditCardNumber")}
                    onBlur={handleInputBlur}
                    maxLength={16}
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.inputHalf}>
                    <Text style={styles.inputLabel}>Date d'expiration</Text>
                    <Input
                      id="creditCardExpiryDate"
                      onInputChanged={inputChangedHandler}
                      errorText={formState.inputValidities.creditCardExpiryDate}
                      placeholder="MM/YYYY"
                      placeholderTextColor="#999999"
                      keyboardType="number-pad"
                      style={styles.inputField}
                      onFocus={() => handleInputFocus("creditCardExpiryDate")}
                      onBlur={handleInputBlur}
                      maxLength={6}
                    />
                  </View>
                  <View style={styles.inputHalf}>
                    <Text style={styles.inputLabel}>CVV</Text>
                    <Input
                      id="cvv"
                      onInputChanged={inputChangedHandler}
                      errorText={formState.inputValidities.cvv}
                      placeholder="000"
                      placeholderTextColor="#999999"
                      keyboardType="number-pad"
                      secureTextEntry
                      style={styles.inputField}
                      onFocus={() => handleInputFocus("cvv")}
                      onBlur={handleInputBlur}
                      maxLength={3}
                    />
                  </View>
                </View>
              </View>
            </MotiView>

            {/* Bottom Button */}
            <View style={styles.buttonContainer}>
              {/* Button with solid color instead of gradient */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddCard}
                activeOpacity={0.9}
              >
                <Text style={styles.submitButtonText}>
                  Ajouter une nouvelle carte
                </Text>
              </TouchableOpacity>

              <View style={styles.securityNoteContainer}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={16}
                  color={COLOORS.primary.main}
                />
                <Text style={styles.securityNoteText}>
                  Vos données de paiement sont sécurisées et cryptées
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  cardPreviewWrapper: {
    width: width - 32,
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    backfaceVisibility: "hidden",
  },
  cardPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    padding: 20,
    position: "relative",
    backfaceVisibility: "hidden",
  },
  cardChip: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 40,
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 6,
  },
  cardWifi: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  cardNumberWrapper: {
    marginTop: 80,
    alignItems: "center",
  },
  cardNumber: {
    fontSize: 22,
    fontWeight: "500",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  cardInfoWrapper: {
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardInfoLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  cardInfoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  cardStrip: {
    width: "100%",
    height: 40,
    backgroundColor: "rgba(0,0,0,0.8)",
    position: "absolute",
    top: 30,
    left: 0,
  },
  cardCvvContainer: {
    position: "absolute",
    right: 20,
    top: 90,
    alignItems: "flex-end",
  },
  cardCvvLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginBottom: 5,
  },
  cardCvvValue: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 4,
    padding: 8,
    width: 60,
    alignItems: "center",
  },
  cardCvvText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 8,
  },
  inputField: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    height: 54,
    paddingHorizontal: 16,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputHalf: {
    width: "48%",
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  submitButton: {
    height: 56,
    backgroundColor: COLOORS.primary.main,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  securityNoteContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  securityNoteText: {
    fontSize: 12,
    color: "#666666",
    marginLeft: 8,
  },
});

export default AddNewCard;
