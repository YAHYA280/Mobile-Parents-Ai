import type { ViewStyle, TextStyle, ImageStyle } from 'react-native';

import { useNavigation } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useReducer, useCallback } from 'react';
import { View, Text, Image, Alert, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import Input from '../components/Input';
import Header from '../components/Header';
import Button from '../components/Button';
import { icons, COLORS } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import { launchImagePicker } from '../utils/ImagePickerHelper';

const initialFormState = {
  inputValues: {
    fullName: '',
    age: '',
  },
  inputValidities: {
    fullName: undefined,
    age: undefined,
  },
  formIsValid: false,
};

// Grade level options
const gradeOptions = [
  { label: 'CP', value: 'CP' },
  { label: 'CE1', value: 'CE1' },
  { label: 'CE2', value: 'CE2' },
  { label: 'CM1', value: 'CM1' },
  { label: 'CM2', value: 'CM2' },
];

const AddChildScreen = () => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const [formState, dispatchFormState] = useReducer(reducer, initialFormState);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [image, setImage] = useState<any>(null);

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      // Additional validation for age field to ensure it's a valid number
      if (inputId === 'age') {
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
    setSelectedGrade(value || '');
  };
  const pickImage = async () => {
    try {
      const tempUri = await launchImagePicker();
      if (tempUri) {
        setImage({ uri: tempUri });
      }
    } catch (error) {
      Alert.alert('Erreur', "Impossible d'accéder à vos photos");
    }
  };

  const handleSave = () => {
    if (!formState.formIsValid || !selectedGrade) {
      Alert.alert('Informations manquantes', 'Veuillez remplir tous les champs correctement');
      return;
    }
    // Save logic would go here in a real app
    Alert.alert('Succès', 'Enfant ajouté avec succès');
    navigation.goBack();
  };

  // Define styles that depend on the theme inside the component
  const dynamicStyles = {
    cancelButton: {
      flex: 1,
      marginRight: 8,
      backgroundColor: dark ? COLORS.dark2 : COLORS.tansparentPrimary,
      borderColor: dark ? COLORS.dark2 : COLORS.tansparentPrimary,
    },
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Ajouter un Enfant" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={image || icons.userDefault}
                style={styles.avatar}
              />
              <TouchableOpacity
                onPress={pickImage}
                style={styles.pickImageButton}
              >
                <Image source={icons.plus} style={styles.pickImageIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[styles.fieldLabel, { color: dark ? COLORS.white : COLORS.black }]}>
            Nom complet
          </Text>
          <Input
            id="fullName"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.fullName}
            placeholder="Nom et prénom de l'enfant"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
          />

          <Text style={[styles.fieldLabel, { color: dark ? COLORS.white : COLORS.black }]}>
            Âge
          </Text>
          <Input
            id="age"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.age}
            placeholder="Âge de l'enfant"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            keyboardType="numeric"
          />

          <Text style={[styles.fieldLabel, { color: dark ? COLORS.white : COLORS.black }]}>
            Niveau scolaire
          </Text>
          <View style={[styles.pickerContainer, { 
            backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
            borderColor: dark ? COLORS.dark2 : COLORS.greyscale500
          }]}>
            <RNPickerSelect
              placeholder={{ label: 'Sélectionner le niveau', value: null }}
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
              }}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Annuler"
          style={dynamicStyles.cancelButton}
          textColor={dark ? COLORS.white : COLORS.primary}
          onPress={() => navigation.goBack()}
        />
        <Button
          title="Enregistrer"
          filled
          style={styles.saveButton}
          onPress={handleSave}
        />
      </View>
    </SafeAreaView>
  );
};

interface Styles {
  container: ViewStyle;
  scrollView: ViewStyle;
  contentContainer: ViewStyle;
  avatarSection: ViewStyle;
  avatarContainer: ViewStyle;
  avatar: ImageStyle;
  pickImageButton: ViewStyle;
  pickImageIcon: ImageStyle;
  fieldLabel: TextStyle;
  pickerContainer: ViewStyle;
  buttonContainer: ViewStyle;
  // cancelButton: ViewStyle; // Removed from here
  saveButton: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingVertical: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
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
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickImageIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.white,
  },
  fieldLabel: {
    fontSize: 16,
    fontFamily: 'medium',
    marginBottom: 8,
    marginTop: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    marginVertical: 8,
    height: 52,
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.grayscale200,
  },
  // cancelButton style removed from static styles
  saveButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: COLORS.greeen,
    borderColor: COLORS.greeen,
  },
});

export default AddChildScreen;