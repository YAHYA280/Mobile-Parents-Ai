import type { ViewStyle, TextStyle, ImageStyle } from "react-native";

import { MotiView } from "moti";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import RNPickerSelect from "react-native-picker-select";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useReducer, useCallback } from "react";
import {
  View,
  Text,
  Alert,
  Platform,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";

import Input from "@/components/Input";
import Header from "@/components/ui/Header";
import { icons, COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import { reducer } from "@/utils/reducers/formReducers";
import { validateInput } from "@/utils/actions/formActions";
import { launchImagePicker } from "@/utils/ImagePickerHelper";

const initialFormState = {
  inputValues: {
    fullName: "",
    age: "",
  },
  inputValidities: {
    fullName: undefined,
    age: undefined,
  },
  formIsValid: false,
};

// Grade level options
const gradeOptions = [
  { label: "CP", value: "CP" },
  { label: "CE1", value: "CE1" },
  { label: "CE2", value: "CE2" },
  { label: "CM1", value: "CM1" },
  { label: "CM2", value: "CM2" },
];

const AddChildScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [formState, dispatchFormState] = useReducer(reducer, initialFormState);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [image, setImage] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pickerRef = React.useRef<any>(null);

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      // Additional validation for age field to ensure it's a valid number
      if (inputId === "age") {
        const ageValue = parseInt(inputValue, 10);
        if (Number.isNaN(ageValue) || ageValue <= 0 || ageValue > 18) {
          dispatchFormState({
            inputId,
            validationResult: "L'âge doit être un nombre entre 1 et 18",
            inputValue,
          });
          return;
        }
      }

      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      });
    },
    [dispatchFormState]
  );

  const handleGradeChange = (value: string | null) => {
    setSelectedGrade(value || "");
  };

  const pickImage = async () => {
    try {
      const tempUri = await launchImagePicker();
      if (tempUri) {
        setImage({ uri: tempUri });
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'accéder à vos photos");
    }
  };

  const handleSave = () => {
    if (!formState.formIsValid || !selectedGrade) {
      Alert.alert(
        "Informations manquantes",
        "Veuillez remplir tous les champs correctement"
      );
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert("Succès", "Enfant ajouté avec succès", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }, 1000);
  };

  const openPicker = () => {
    if (pickerRef.current) {
      pickerRef.current.togglePicker();
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "right", "left", "bottom"]}
    >
      <Header
        title="Ajouter un Enfant"
        onBackPress={() => navigation.goBack()}
        showBackButton
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600 }}
            style={[styles.formCard, Platform.OS === "ios" && styles.iosShadow]}
          >
            <View style={styles.contentContainer}>
              <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", delay: 200, damping: 15 }}
                style={styles.avatarSection}
              >
                <View style={styles.avatarContainer}>
                  <Image
                    source={image || icons.userDefault}
                    style={styles.avatar}
                  />
                  <TouchableOpacity
                    onPress={pickImage}
                    style={styles.pickImageButton}
                  >
                    <LinearGradient
                      colors={[COLORS.primary, "#4A90E2"]}
                      style={styles.pickImageGradient}
                    >
                      <Ionicons name="camera" size={20} color={COLORS.white} />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </MotiView>

              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: "timing", duration: 500, delay: 300 }}
              >
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Ionicons
                      name="person-outline"
                      size={18}
                      color={COLORS.primary}
                    />
                    <Text style={[styles.fieldLabel, { color: COLORS.black }]}>
                      Nom complet
                    </Text>
                  </View>
                  <Input
                    id="fullName"
                    onInputChanged={inputChangedHandler}
                    errorText={formState.inputValidities.fullName}
                    placeholder="Nom et prénom de l'enfant"
                    placeholderTextColor={COLORS.black}
                  />
                </View>
              </MotiView>

              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: "timing", duration: 500, delay: 400 }}
              >
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color={COLORS.primary}
                    />
                    <Text style={[styles.fieldLabel, { color: COLORS.black }]}>
                      Âge
                    </Text>
                  </View>
                  <Input
                    id="age"
                    onInputChanged={inputChangedHandler}
                    errorText={formState.inputValidities.age}
                    placeholder="Âge de l'enfant"
                    placeholderTextColor={COLORS.black}
                    keyboardType="numeric"
                  />
                </View>
              </MotiView>

              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: "timing", duration: 500, delay: 500 }}
              >
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Ionicons
                      name="school-outline"
                      size={18}
                      color={COLORS.primary}
                    />
                    <Text style={[styles.fieldLabel, { color: COLORS.black }]}>
                      Niveau scolaire
                    </Text>
                  </View>

                  {/* Enhanced Picker Container */}
                  <View
                    style={[
                      styles.pickerContainer,
                      {
                        backgroundColor: COLORS.white,
                        borderColor: COLORS.greyscale300,
                      },
                    ]}
                  >
                    {/* Touchable Overlay */}
                    <TouchableOpacity
                      style={styles.pickerTouchableOverlay}
                      onPress={openPicker}
                      activeOpacity={0.7}
                    />

                    {/* Native Picker */}
                    <RNPickerSelect
                      ref={pickerRef}
                      placeholder={{
                        label: "Sélectionner le niveau",
                        value: null,
                        color: COLORS.gray,
                      }}
                      items={gradeOptions}
                      onValueChange={handleGradeChange}
                      value={selectedGrade}
                      style={{
                        inputIOS: {
                          fontSize: 16,
                          paddingVertical: 12,
                          paddingHorizontal: 16,
                          color: COLORS.black,
                          paddingRight: 50,
                          width: "100%",
                          height: "100%",
                        },
                        inputAndroid: {
                          fontSize: 16,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          color: COLORS.black,
                          paddingRight: 50,
                          width: "100%",
                          height: "100%",
                        },
                        placeholder: {
                          color: COLORS.gray,
                          fontSize: 16,
                        },
                        iconContainer: {
                          top: 18,
                          right: 16,
                        },
                        viewContainer: {
                          width: "100%",
                          height: "100%",
                        },
                      }}
                      useNativeAndroidPickerStyle={false}
                      Icon={() => {
                        return (
                          <View style={styles.pickerIconContainer}>
                            <Ionicons
                              name="chevron-down"
                              size={20}
                              color={COLORS.black}
                            />
                          </View>
                        );
                      }}
                    />
                  </View>
                </View>
              </MotiView>

              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 500, delay: 600 }}
              >
                <View style={styles.noteContainer}>
                  <Ionicons
                    name="information-circle-outline"
                    size={16}
                    color={COLORS.primary}
                  />
                  <Text style={styles.note}>
                    Tous les champs sont obligatoires pour ajouter un enfant.
                  </Text>
                </View>
              </MotiView>
            </View>
          </MotiView>
        </ScrollView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500, delay: 700 }}
          style={styles.buttonContainer}
        >
          {/* Enhanced Cancel Button */}
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: COLORS.greyscale300 }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <View style={styles.cancelButtonContent}>
              <Ionicons name="close-outline" size={20} color={COLORS.black} />
              <Text style={[styles.cancelButtonText, { color: COLORS.black }]}>
                Annuler
              </Text>
            </View>
          </TouchableOpacity>

          {/* Enhanced Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, { opacity: isSubmitting ? 0.8 : 1 }]}
            onPress={handleSave}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#4CAF50", "#66BB6A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButtonGradient}
            >
              {isSubmitting ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={COLORS.white} />
                  <Text style={styles.saveButtonText}>Enregistrement...</Text>
                </View>
              ) : (
                <View style={styles.saveButtonContent}>
                  <Ionicons
                    name="checkmark-outline"
                    size={20}
                    color={COLORS.white}
                  />
                  <Text style={styles.saveButtonText}>Enregistrer</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

interface Styles {
  container: ViewStyle;
  keyboardContainer: ViewStyle;
  scrollView: ViewStyle;
  formCard: ViewStyle;
  iosShadow: ViewStyle;
  contentContainer: ViewStyle;
  avatarSection: ViewStyle;
  avatarContainer: ViewStyle;
  avatar: ImageStyle;
  pickImageButton: ViewStyle;
  pickImageGradient: ViewStyle;
  inputGroup: ViewStyle;
  labelContainer: ViewStyle;
  fieldLabel: TextStyle;
  pickerContainer: ViewStyle;
  pickerTouchableOverlay: ViewStyle;
  pickerIconContainer: ViewStyle;
  noteContainer: ViewStyle;
  note: TextStyle;
  buttonContainer: ViewStyle;
  cancelButton: ViewStyle;
  cancelButtonContent: ViewStyle;
  cancelButtonText: TextStyle;
  saveButton: ViewStyle;
  saveButtonGradient: ViewStyle;
  saveButtonContent: ViewStyle;
  saveButtonText: TextStyle;
  loadingContainer: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  iosShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  contentContainer: {
    padding: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    position: "relative",
    width: 120,
    height: 120,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.grayscale200,
  },
  pickImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 18,
    overflow: "hidden",
  },
  pickImageGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 16,
    fontFamily: "medium",
    marginLeft: 8,
  },
  pickerContainer: {
    borderWidth: 1.5,
    borderRadius: 12,
    height: 56,
    position: "relative",
  },
  pickerTouchableOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  pickerIconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${COLORS.primary}10`,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  note: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.primary,
    fontStyle: "italic",
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: "semibold",
    marginLeft: 8,
  },
  saveButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: "semibold",
    color: COLORS.white,
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AddChildScreen;
