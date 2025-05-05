import type { ViewStyle, TextStyle, ImageStyle } from "react-native";

import { Image } from "expo-image";
import Input from "@/components/Input";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { useTheme } from "@/theme/ThemeProvider";
import { icons, COLORS, images } from "@/constants";
import RNPickerSelect from "react-native-picker-select";
import { reducer } from "@/utils/reducers/formReducers";
import { validateInput } from "@/utils/actions/formActions";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchImagePicker } from "@/utils/ImagePickerHelper";
import { useNavigation, useLocalSearchParams } from "expo-router";
import React, {
  useState,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import {
  View,
  Text,
  Alert,
  Modal,
  Platform,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

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
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  // Form and state hooks:
  const [formState, dispatchFormState] = useReducer(reducer, initialFormState);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [image, setImage] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

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

    const nameChanged =
      formState.inputValues.fullName !== childData.name;
    const ageChanged =
      formState.inputValues.age !== String(childData.age);
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
      >
        <Header title="Enfant introuvable" />
        <View style={{ padding: 16 }}>
          <Text style={{ color: dark ? COLORS.white : COLORS.black }}>
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
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
          <Text
            style={[
              styles.modalTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Annuler les modifications
          </Text>
          <Text
            style={[
              styles.modalMessage,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Vous avez des modifications non enregistrées. Voulez-vous vraiment
            quitter sans enregistrer ?
          </Text>
          <View style={styles.modalButtons}>
            <Button
              title="Continuer l'édition"
              style={[
                styles.modalButton,
                {
                  backgroundColor: dark ? COLORS.dark3 : COLORS.grayscale200,
                  borderWidth: 0,
                },
              ]}
              textColor={dark ? COLORS.white : COLORS.black}
              onPress={() => setShowDiscardModal(false)}
            />
            <Button
              title="Abandonner"
              style={[
                styles.modalButton,
                {
                  backgroundColor: COLORS.primary,
                  borderColor: COLORS.primary,
                },
              ]}
              onPress={() => {
                setShowDiscardModal(false);
                navigation.goBack();
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  const dynamicStyles = {
    cancelButton: {
      flex: 1,
      marginRight: 8,
      backgroundColor: dark ? COLORS.dark2 : COLORS.tansparentPrimary,
      borderColor: dark ? COLORS.dark2 : COLORS.tansparentPrimary,
    },
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header title="Modifier les informations" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentContainer}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <Image source={image} style={styles.avatar} />
                <TouchableOpacity
                  onPress={pickImage}
                  style={styles.pickImageButton}
                >
                  <Image
                    source={icons.editPencil}
                    style={styles.pickImageIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Text
              style={[
                styles.fieldLabel,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Nom complet
            </Text>
            <Input
              id="fullName"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities.fullName}
              placeholder="Nom et prénom de l'enfant"
              placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
              value={formState.inputValues.fullName}
            />

            <Text
              style={[
                styles.fieldLabel,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Âge
            </Text>
            <Input
              id="age"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities.age}
              placeholder="Âge de l'enfant"
              placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
              keyboardType="numeric"
              value={formState.inputValues.age}
            />

            <Text
              style={[
                styles.fieldLabel,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Niveau scolaire
            </Text>
            <View
              style={[
                styles.pickerContainer,
                {
                  backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                  borderColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                },
              ]}
            >
              <RNPickerSelect
                placeholder={{ label: "Sélectionner le niveau", value: null }}
                items={gradeOptions}
                onValueChange={handleGradeChange}
                value={selectedGrade}
                style={{
                  inputIOS: {
                    fontSize: 16,
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    color: dark ? COLORS.white : COLORS.black,
                    paddingRight: 30,
                  },
                  inputAndroid: {
                    fontSize: 16,
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    color: dark ? COLORS.white : COLORS.black,
                    paddingRight: 30,
                  },
                  iconContainer: {
                    top: 10,
                    right: 12,
                  },
                }}
                useNativeAndroidPickerStyle={false}
                Icon={() => (
                  <Image
                    source={icons.down}
                    style={[
                      styles.dropdownIcon,
                      { tintColor: dark ? COLORS.white : COLORS.black },
                    ]}
                  />
                )}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button
            title="Annuler"
            style={dynamicStyles.cancelButton}
            textColor={dark ? COLORS.white : COLORS.primary}
            onPress={handleBack}
          />
          <Button
            title="Enregistrer"
            filled
            isLoading={isSubmitting}
            style={styles.saveButton}
            onPress={handleSave}
          />
        </View>
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
  contentContainer: ViewStyle;
  avatarSection: ViewStyle;
  avatarContainer: ViewStyle;
  avatar: ImageStyle;
  pickImageButton: ViewStyle;
  pickImageIcon: ImageStyle;
  fieldLabel: TextStyle;
  pickerContainer: ViewStyle;
  dropdownIcon: ImageStyle;
  buttonContainer: ViewStyle;
  saveButton: ViewStyle;
  modalOverlay: ViewStyle;
  modalContainer: ViewStyle;
  modalTitle: TextStyle;
  modalMessage: TextStyle;
  modalButtons: ViewStyle;
  modalButton: ViewStyle;
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
  contentContainer: {
    paddingVertical: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
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
    backgroundColor: COLORS.secondary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  pickImageIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.white,
  },
  fieldLabel: {
    fontSize: 16,
    fontFamily: "medium",
    marginBottom: 8,
    marginTop: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    marginVertical: 8,
    height: 52,
    justifyContent: "center",
  },
  dropdownIcon: {
    width: 16,
    height: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.grayscale200,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: COLORS.greeen,
    borderColor: COLORS.greeen,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default EditChildScreen;
