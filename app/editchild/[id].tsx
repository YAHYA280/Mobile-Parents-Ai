import type { ViewStyle, TextStyle, ImageStyle } from "react-native";

import { MotiView } from "moti";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import RNPickerSelect from "react-native-picker-select";
import { useNavigation, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  Modal,
  Platform,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  KeyboardAvoidingView,
} from "react-native";

import Input from "@/components/Input";
import Header from "@/components/ui/Header";
import { COLORS, images } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import { reducer } from "@/utils/reducers/formReducers";
import { validateInput } from "@/utils/actions/formActions";
import { launchImagePicker } from "@/utils/ImagePickerHelper";

// --------------------------------------------------
// Mock Data (similar to "ChildAccount" snippet)
// --------------------------------------------------
const mockChildrenData = [
  {
    id: "1",
    name: "Thomas Dubois",
    age: 8,
    grade: "CE2",
    avatar: images.user7,
  },
  {
    id: "2",
    name: "Marie Laurent",
    age: 10,
    grade: "CM2",
    avatar: images.user3,
  },
  {
    id: "3",
    name: "Lucas Martin",
    age: 6,
    grade: "CP",
    avatar: images.user5,
  },
];

// --------------------------------------------------
// Initial Form State
// --------------------------------------------------
const initialFormState = {
  inputValues: {
    fullName: "",
    age: "",
  },
  inputValidities: {
    fullName: undefined,
    age: undefined,
  },
  formIsValid: true,
};

// --------------------------------------------------
// Grade level options
// --------------------------------------------------
const gradeOptions = [
  { label: "CP", value: "CP" },
  { label: "CE1", value: "CE1" },
  { label: "CE2", value: "CE2" },
  { label: "CM1", value: "CM1" },
  { label: "CM2", value: "CM2" },
];

// --------------------------------------------------
// EditChildScreen
// --------------------------------------------------
const EditChildScreen = () => {
  // 1) Always call Hooks unconditionally, at the top:
  const { colors } = useTheme();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Form and state hooks:
  const [formState, dispatchFormState] = useReducer(reducer, initialFormState);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [image, setImage] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const pickerRef = React.useRef<any>(null);

  // 2) Get childId from params:
  const childId = (params.id as string) || "1";

  // 3) Find the matching child's data:
  const childData = mockChildrenData.find((child) => child.id === childId);

  // --------------------------------------------------
  // Effects
  // --------------------------------------------------
  useEffect(() => {
    // If there's no childData, do nothing – but still call this effect
    if (!childData) return;

    // Initialize form from childData
    dispatchFormState({
      inputId: "fullName",
      validationResult: undefined,
      inputValue: childData.name,
    });
    dispatchFormState({
      inputId: "age",
      validationResult: undefined,
      inputValue: String(childData.age),
    });
    setSelectedGrade(childData.grade);
    setImage(childData.avatar);
  }, [childData]);

  useEffect(() => {
    // If there's no childData, do nothing – but still call this effect
    if (!childData) return;

    const nameChanged = formState.inputValues.fullName !== childData.name;
    const ageChanged = formState.inputValues.age !== String(childData.age);
    const gradeChanged = selectedGrade !== childData.grade;
    const imageChanged = image !== childData.avatar;

    setHasChanges(nameChanged || ageChanged || gradeChanged || imageChanged);
  }, [childData, formState.inputValues, selectedGrade, image]);

  // --------------------------------------------------
  // Handlers (useCallback called unconditionally)
  // --------------------------------------------------
  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      // Extra validation for the 'age' field
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

  const openPicker = () => {
    if (pickerRef.current) {
      pickerRef.current.togglePicker();
    }
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

  const handleBack = () => {
    if (hasChanges) {
      setShowDiscardModal(true);
    } else {
      navigation.goBack();
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

    // Simulate saving
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert("Succès", "Informations mises à jour avec succès", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }, 1000);
  };

  // --------------------------------------------------
  // If there's no child data, conditionally render
  // "not found" UI – but *only after* all Hooks
  // have been called above.
  // --------------------------------------------------
  if (!childData) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["top", "right", "left", "bottom"]}
      >
        <Header title="Enfant introuvable" onBackPress={handleBack} />
        <View style={{ padding: 16 }}>
          <Text style={{ color: COLORS.black }}>
            Désolé, aucune donnée trouvée pour cet enfant.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // --------------------------------------------------
  // Modals
  // --------------------------------------------------
  const renderDiscardModal = () => (
    <Modal
      transparent
      visible={showDiscardModal}
      animationType="fade"
      onRequestClose={() => setShowDiscardModal(false)}
    >
      <View style={styles.modalOverlay}>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
          style={[styles.modalContainer, { backgroundColor: COLORS.white }]}
        >
          <View style={styles.modalIconContainer}>
            <Ionicons name="warning" size={48} color="#FF9500" />
          </View>

          <Text style={[styles.modalTitle, { color: COLORS.black }]}>
            Annuler les modifications
          </Text>
          <Text style={[styles.modalMessage, { color: COLORS.black }]}>
            Vous avez des modifications non enregistrées. Voulez-vous vraiment
            quitter sans enregistrer ?
          </Text>
          <View style={styles.modalButtons}>
            {/* Enhanced Cancel Button */}
            <TouchableOpacity
              style={[
                styles.modalCancelButton,
                { borderColor: COLORS.greyscale300 },
              ]}
              onPress={() => setShowDiscardModal(false)}
              activeOpacity={0.8}
            >
              <View style={styles.modalCancelContent}>
                <Ionicons name="close-outline" size={18} color={COLORS.black} />
                <Text style={[styles.modalCancelText, { color: COLORS.black }]}>
                  Continuer
                </Text>
              </View>
            </TouchableOpacity>

            {/* Enhanced Discard Button */}
            <TouchableOpacity
              style={styles.modalDiscardButton}
              onPress={() => {
                setShowDiscardModal(false);
                navigation.goBack();
              }}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#FF6B6B", "#FF8E53"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalDiscardGradient}
              >
                <View style={styles.modalDiscardContent}>
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={COLORS.white}
                  />
                  <Text style={styles.modalDiscardText}>Abandonner</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </MotiView>
      </View>
    </Modal>
  );

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "right", "left", "bottom"]}
    >
      <Header
        title="Modifier les informations"
        onBackPress={handleBack}
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
                  <Image source={image} style={styles.avatar} />
                  <TouchableOpacity
                    onPress={pickImage}
                    style={styles.pickImageButton}
                  >
                    <LinearGradient
                      colors={["#FF9500", "#FFB84D"]}
                      style={styles.pickImageGradient}
                    >
                      <Ionicons name="pencil" size={18} color={COLORS.white} />
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
                    value={formState.inputValues.fullName}
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
                    value={formState.inputValues.age}
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

              {hasChanges && (
                <MotiView
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: "timing", duration: 500, delay: 600 }}
                >
                  <View style={styles.changesContainer}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={16}
                      color="#FF9500"
                    />
                    <Text style={styles.changesText}>
                      Vous avez des modifications non sauvegardées
                    </Text>
                  </View>
                </MotiView>
              )}
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
            onPress={handleBack}
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
                  <Text style={styles.saveButtonText}>Mise à jour...</Text>
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

      {renderDiscardModal()}
    </SafeAreaView>
  );
};

// --------------------------------------------------
// Styles
// --------------------------------------------------
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
  changesContainer: ViewStyle;
  changesText: TextStyle;
  buttonContainer: ViewStyle;
  cancelButton: ViewStyle;
  cancelButtonContent: ViewStyle;
  cancelButtonText: TextStyle;
  saveButton: ViewStyle;
  saveButtonGradient: ViewStyle;
  saveButtonContent: ViewStyle;
  saveButtonText: TextStyle;
  loadingContainer: ViewStyle;
  modalOverlay: ViewStyle;
  modalContainer: ViewStyle;
  modalIconContainer: ViewStyle;
  modalTitle: TextStyle;
  modalMessage: TextStyle;
  modalButtons: ViewStyle;
  modalCancelButton: ViewStyle;
  modalCancelContent: ViewStyle;
  modalCancelText: TextStyle;
  modalDiscardButton: ViewStyle;
  modalDiscardGradient: ViewStyle;
  modalDiscardContent: ViewStyle;
  modalDiscardText: TextStyle;
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
  changesContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3CD",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  changesText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#856404",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    width: "85%",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalIconContainer: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    height: 48,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  modalCancelContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelText: {
    fontSize: 14,
    fontFamily: "semibold",
    marginLeft: 6,
  },
  modalDiscardButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    overflow: "hidden",
  },
  modalDiscardGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalDiscardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  modalDiscardText: {
    fontSize: 14,
    fontFamily: "semibold",
    color: COLORS.white,
    marginLeft: 6,
  },
});

export default EditChildScreen;
