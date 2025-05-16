import { Image } from "expo-image";
import React, { useState } from "react";
import Header from "@/components/ui/Header";
import Button from "@/components/Button";
import { icons, COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import RNPickerSelect from "react-native-picker-select";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  View,
  Text,
  Alert,
  Platform,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

// Options pour les matières
const subjectOptions = [
  { label: "Mathématiques", value: "math" },
  { label: "Français", value: "french" },
  { label: "Sciences", value: "science" },
  { label: "Histoire", value: "history" },
  { label: "Géographie", value: "geography" },
  { label: "Anglais", value: "english" },
];

// Options pour les priorités
const priorityOptions = [
  { label: "Basse", value: "low" },
  { label: "Moyenne", value: "medium" },
  { label: "Élevée", value: "high" },
];

// Options pour les statuts
const statusOptions = [
  { label: "Non commencé", value: "not_started" },
  { label: "En cours", value: "in_progress" },
  { label: "Atteint", value: "completed" },
];

const AddObjectiveScreen = () => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const childId = (params.id as string) || "1";

  // États pour les champs du formulaire
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [initialStatus, setInitialStatus] = useState<string | null>(
    "not_started"
  );

  // États pour les dates
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // +1 semaine par défaut
  );

  // États pour les pickers de date
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // **Nouvel état : message optionnel pour l'enfant**
  const [kidMessage, setKidMessage] = useState("");

  // Format de date pour l'affichage
  const formatDate = (date: Date): string => {
    return `${date.toLocaleDateString()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  // Gestionnaires de changement de date (date de début)
  const onStartDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === "ios");
    setStartDate(currentDate);

    // Ajuster la date de fin si la date de début dépasse la date de fin
    if (currentDate > endDate) {
      setEndDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
    }
  };

  // Gestionnaires de changement de date (date de fin)
  const onEndDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === "ios");

    if (currentDate >= startDate) {
      setEndDate(currentDate);
    } else {
      Alert.alert("Erreur", "La date de fin doit être après la date de début.");
    }
  };

  // Validation du formulaire
  const validateForm = (): boolean => {
    if (!title.trim()) {
      Alert.alert("Champ requis", "Veuillez entrer un titre pour l'objectif.");
      return false;
    }
    if (!subject) {
      Alert.alert("Champ requis", "Veuillez sélectionner une matière.");
      return false;
    }
    if (!priority) {
      Alert.alert("Champ requis", "Veuillez sélectionner une priorité.");
      return false;
    }
    return true; // kidMessage est optionnel
  };

  // Sauvegarde de l'objectif
  const saveObjective = () => {
    if (validateForm()) {
      // Dans une vraie application, vous enverriez tous ces champs (dont kidMessage) à votre API / backend
      Alert.alert("Succès", "L'objectif a été créé avec succès", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["right", "bottom", "left"]}
    >
      <Header
        title="Ajouter un objectif"
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            {/* Titre de l'objectif */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Titre de l&apos;objectif
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale100,
                    color: dark ? COLORS.white : COLORS.black,
                  },
                ]}
                value={title}
                onChangeText={setTitle}
                placeholder="Entrez le titre de l'objectif"
                placeholderTextColor={dark ? COLORS.gray3 : COLORS.gray}
              />
            </View>

            {/* Description de l'objectif */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Description
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  styles.textArea,
                  {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale100,
                    color: dark ? COLORS.white : COLORS.black,
                  },
                ]}
                value={description}
                onChangeText={setDescription}
                placeholder="Décrivez l'objectif"
                placeholderTextColor={dark ? COLORS.gray3 : COLORS.gray}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Matière */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Matière
              </Text>
              <View
                style={[
                  styles.pickerContainer,
                  {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale100,
                  },
                ]}
              >
                <RNPickerSelect
                  placeholder={{
                    label: "Sélectionner une matière",
                    value: null,
                  }}
                  items={subjectOptions}
                  onValueChange={setSubject}
                  value={subject}
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
                      style={{
                        width: 18,
                        height: 18,
                        tintColor: dark ? COLORS.white : COLORS.black,
                      }}
                    />
                  )}
                />
              </View>
            </View>

            {/* Priorité */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Priorité
              </Text>
              <View
                style={[
                  styles.pickerContainer,
                  {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale100,
                  },
                ]}
              >
                <RNPickerSelect
                  placeholder={{
                    label: "Sélectionner une priorité",
                    value: null,
                  }}
                  items={priorityOptions}
                  onValueChange={setPriority}
                  value={priority}
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
                      style={{
                        width: 18,
                        height: 18,
                        tintColor: dark ? COLORS.white : COLORS.black,
                      }}
                    />
                  )}
                />
              </View>
            </View>

            {/* Date de début */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Date de début
              </Text>
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale100,
                  },
                ]}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={{ color: dark ? COLORS.white : COLORS.black }}>
                  {formatDate(startDate)}
                </Text>
                <Image
                  source={icons.calendar}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: dark ? COLORS.white : COLORS.black,
                  }}
                />
              </TouchableOpacity>

              {showStartDatePicker && (
                <DateTimePicker
                  value={startDate}
                  mode="datetime"
                  display="default"
                  onChange={onStartDateChange}
                  {...(Platform.OS === "android" ? { is24Hour: true } : {})}
                />
              )}
            </View>

            {/* Date de fin */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Date de fin
              </Text>
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale100,
                  },
                ]}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={{ color: dark ? COLORS.white : COLORS.black }}>
                  {formatDate(endDate)}
                </Text>
                <Image
                  source={icons.calendar}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: dark ? COLORS.white : COLORS.black,
                  }}
                />
              </TouchableOpacity>

              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate}
                  mode="datetime"
                  display="default"
                  onChange={onEndDateChange}
                  minimumDate={startDate}
                  {...(Platform.OS === "android" ? { is24Hour: true } : {})}
                />
              )}
            </View>

            {/* Statut initial */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Statut initial
              </Text>
              <View
                style={[
                  styles.pickerContainer,
                  {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale100,
                  },
                ]}
              >
                <RNPickerSelect
                  placeholder={{ label: "Sélectionner un statut", value: null }}
                  items={statusOptions}
                  onValueChange={setInitialStatus}
                  value={initialStatus}
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
                      style={{
                        width: 18,
                        height: 18,
                        tintColor: dark ? COLORS.white : COLORS.black,
                      }}
                    />
                  )}
                />
              </View>
            </View>

            {/* Message pour l'enfant (optionnel) */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Message pour l&apos;enfant (optionnel)
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  styles.textArea,
                  {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale100,
                    color: dark ? COLORS.white : COLORS.black,
                  },
                ]}
                value={kidMessage}
                onChangeText={setKidMessage}
                placeholder="Entrez un message de félicitations ou d'encouragement..."
                placeholderTextColor={dark ? COLORS.gray3 : COLORS.gray}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>
        </ScrollView>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Annuler"
            style={[
              styles.button,
              styles.cancelButton,
              {
                backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
              },
            ]}
            textColor={dark ? COLORS.white : COLORS.black}
            onPress={() => navigation.goBack()}
          />
          <Button
            title="Enregistrer"
            filled
            style={[styles.button, styles.saveButton]}
            onPress={saveObjective}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    paddingBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: "medium",
    marginBottom: 8,
  },
  textInput: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: "regular",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  pickerContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  dateButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.grayscale200,
  },
  button: {
    flex: 1,
    height: 50,
  },
  cancelButton: {
    marginRight: 8,
  },
  saveButton: {
    marginLeft: 8,
    backgroundColor: COLORS.greeen,
    borderColor: COLORS.greeen,
  },
});

export default AddObjectiveScreen;
