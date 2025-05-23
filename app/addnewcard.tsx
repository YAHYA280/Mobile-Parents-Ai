import type { NavigationProp } from "@react-navigation/native";

import { MotiView } from "moti";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform, ScrollView, KeyboardAvoidingView } from "react-native";
import React, {
  useRef,
  useState,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import {
  View,
  Text,
  Alert,
  Keyboard,
  StatusBar,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import Input from "../components/Input";
import Header from "../components/ui/Header";
import { COLOORS } from "../constants/theme";
import { reducer } from "../utils/reducers/formReducers";
import { validateInput } from "../utils/actions/formActions";

const { width, height } = Dimensions.get("window");
const isSmallScreen = height < 700;
const isTablet = width > 768;

const initialState = {
  inputValues: {
    creditCardHolderName: "",
    creditCardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  },
  inputValidities: {
    creditCardHolderName: false,
    creditCardNumber: false,
    expiryMonth: false,
    expiryYear: false,
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
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Format card number with spaces
  const formattedCardNumber = () => {
    const number = formState.inputValues.creditCardNumber || "";
    if (number) {
      // Add a space after every 4 digits
      return number.replace(/(\d{4})/g, "$1 ").trim();
    }
    return "•••• •••• •••• ••••";
  };

  // Format expiration date
  const formattedExpiryDate = () => {
    const month = formState.inputValues.expiryMonth;
    const year = formState.inputValues.expiryYear;

    if (month && year) {
      return `${month.padStart(2, "0")}/${year}`;
    } if (month) {
      return `${month.padStart(2, "0")}/YY`;
    } if (year) {
      return `MM/${year}`;
    }
    return "MM/YY";
  };

  // Format name to uppercase
  const formattedName = () => {
    return formState.inputValues.creditCardHolderName
      ? formState.inputValues.creditCardHolderName.toUpperCase()
      : "CARD HOLDER NAME";
  };

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      let processedValue = inputValue;

      // Process specific inputs
      if (inputId === "expiryMonth") {
        // Ensure month is between 01-12
        if (
          inputValue &&
          (parseInt(inputValue) < 1 || parseInt(inputValue) > 12)
        ) {
          return;
        }
        processedValue = inputValue.replace(/[^\d]/g, "");
      } else if (inputId === "expiryYear") {
        processedValue = inputValue.replace(/[^\d]/g, "");
      } else if (inputId === "creditCardNumber") {
        processedValue = inputValue.replace(/[^\d]/g, "");
      } else if (inputId === "cvv") {
        processedValue = inputValue.replace(/[^\d]/g, "");
      }

      const result = validateInput(inputId, processedValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue: processedValue,
      });

      // Flip card to show CVV when CVV field is focused
      if (inputId === "cvv") {
        setIsCardFlipped(!!processedValue);
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

    // Scroll to input when focused (only on Android or when needed)
    if (Platform.OS === "android") {
      setTimeout(() => {
        if (scrollViewRef.current) {
          let scrollToY = 0;

          switch (inputId) {
            case "creditCardHolderName":
              scrollToY = cardHeight + 50;
              break;
            case "creditCardNumber":
              scrollToY = cardHeight + 120;
              break;
            case "expiryMonth":
            case "expiryYear":
            case "cvv":
              scrollToY = cardHeight + 200;
              break;
          }

          scrollViewRef.current.scrollTo({
            y: scrollToY,
            animated: true,
          });
        }
      }, 100);
    }
  };

  const handleInputBlur = () => {
    setFocusedField(null);
  };

  const handleAddCard = () => {
    const requiredFields = [
      "creditCardHolderName",
      "creditCardNumber",
      "expiryMonth",
      "expiryYear",
      "cvv",
    ];
    const isFormValid = requiredFields.every(
      (field) =>
        formState.inputValues[field] && formState.inputValidities[field]
    );

    if (isFormValid) {
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

  const cardWidth = isTablet ? Math.min(400, width - 64) : width - 32;
  const cardHeight = isSmallScreen ? 160 : 200;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Fixed Header */}
      <View style={styles.headerContainer} onLayout={onHeaderLayout}>
        <Header
          title="Ajouter une nouvelle carte"
          subtitle="Ajouter une carte de paiement en toute sécurité"
          onBackPress={() => navigation.goBack()}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: headerHeight + 10 }, // Reduced from 20 to 10
          ]}
        >
          <View style={styles.container}>
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "spring", damping: 18, stiffness: 120 }}
            >
              {/* Credit Card Preview */}
              <View style={styles.cardContainer}>
                <MotiView
                  animate={{ rotateY: isCardFlipped ? "180deg" : "0deg" }}
                  transition={{ type: "timing", duration: 300 }}
                  style={[
                    styles.cardPreviewWrapper,
                    { width: cardWidth, height: cardHeight },
                  ]}
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
                          size={isSmallScreen ? 20 : 24}
                          color="#FFFFFF"
                          style={{ transform: [{ rotate: "90deg" }] }}
                        />
                      </View>

                      <MotiView
                        style={[
                          styles.cardNumberWrapper,
                          { marginTop: isSmallScreen ? 60 : 80 },
                        ]}
                        animate={{
                          scale: focusedField === "creditCardNumber" ? 1.05 : 1,
                        }}
                        transition={{ type: "spring", damping: 10 }}
                      >
                        <Text
                          style={[
                            styles.cardNumber,
                            { fontSize: isSmallScreen ? 18 : 22 },
                          ]}
                        >
                          {formattedCardNumber()}
                        </Text>
                      </MotiView>

                      <View style={styles.cardInfoWrapper}>
                        <MotiView
                          animate={{
                            scale:
                              focusedField === "creditCardHolderName"
                                ? 1.05
                                : 1,
                          }}
                          transition={{ type: "spring", damping: 10 }}
                        >
                          <Text style={styles.cardInfoLabel}>
                            NOM DU TITULAIRE
                          </Text>
                          <Text
                            style={[
                              styles.cardInfoValue,
                              { fontSize: isSmallScreen ? 14 : 16 },
                            ]}
                          >
                            {formattedName()}
                          </Text>
                        </MotiView>
                        <MotiView
                          animate={{
                            scale:
                              focusedField === "expiryMonth" ||
                              focusedField === "expiryYear"
                                ? 1.05
                                : 1,
                          }}
                          transition={{ type: "spring", damping: 10 }}
                        >
                          <Text style={styles.cardInfoLabel}>EXPIRE LE</Text>
                          <Text
                            style={[
                              styles.cardInfoValue,
                              { fontSize: isSmallScreen ? 14 : 16 },
                            ]}
                          >
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
                      <View
                        style={[
                          styles.cardStrip,
                          { top: isSmallScreen ? 25 : 30 },
                        ]}
                      />
                      <View
                        style={[
                          styles.cardCvvContainer,
                          { top: isSmallScreen ? 75 : 90 },
                        ]}
                      >
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
              </View>

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
                    value={formState.inputValues.creditCardHolderName}
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
                    value={formState.inputValues.creditCardNumber}
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.inputThird}>
                    <Text style={styles.inputLabel}>Mois</Text>
                    <Input
                      id="expiryMonth"
                      onInputChanged={inputChangedHandler}
                      errorText={formState.inputValidities.expiryMonth}
                      placeholder="MM"
                      placeholderTextColor="#999999"
                      keyboardType="number-pad"
                      style={styles.inputField}
                      onFocus={() => handleInputFocus("expiryMonth")}
                      onBlur={handleInputBlur}
                      maxLength={2}
                      value={formState.inputValues.expiryMonth}
                    />
                  </View>

                  <View style={styles.inputThird}>
                    <Text style={styles.inputLabel}>Année</Text>
                    <Input
                      id="expiryYear"
                      onInputChanged={inputChangedHandler}
                      errorText={formState.inputValidities.expiryYear}
                      placeholder="YYYY"
                      placeholderTextColor="#999999"
                      keyboardType="number-pad"
                      style={styles.inputField}
                      onFocus={() => handleInputFocus("expiryYear")}
                      onBlur={handleInputBlur}
                      maxLength={4}
                      value={formState.inputValues.expiryYear}
                    />
                  </View>

                  <View style={styles.inputThird}>
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
                      value={formState.inputValues.cvv}
                    />
                  </View>
                </View>
              </View>
            </MotiView>

            {/* Bottom Button */}
            <View style={styles.buttonContainer}>
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
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "ios" ? 20 : 80, // Reduced iOS padding
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  cardContainer: {
    alignItems: "center",
    marginBottom: 16, // Reduced from 24 to 16
  },
  cardPreviewWrapper: {
    borderRadius: 16,
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
    width: isSmallScreen ? 35 : 40,
    height: isSmallScreen ? 25 : 30,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 6,
  },
  cardWifi: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  cardNumberWrapper: {
    alignItems: "center",
  },
  cardNumber: {
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
    fontSize: isSmallScreen ? 9 : 10,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  cardInfoValue: {
    fontWeight: "500",
    color: "#FFFFFF",
  },
  cardStrip: {
    width: "100%",
    height: isSmallScreen ? 35 : 40,
    backgroundColor: "rgba(0,0,0,0.8)",
    position: "absolute",
    left: 0,
  },
  cardCvvContainer: {
    position: "absolute",
    right: 20,
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
    padding: isTablet ? 32 : 24,
    marginTop: 8, // Reduced from 16 to 8
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
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
    fontSize: 16,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8, // Reduced gap from 12 to 8
  },
  inputHalf: {
    flex: 1,
  },
  inputThird: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 32,
    marginBottom: 24,
    paddingHorizontal: isTablet ? 40 : 0,
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
    textAlign: "center",
  },
});

export default AddNewCard;
