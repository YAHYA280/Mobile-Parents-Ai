import { Image } from "expo-image";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { icons, COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import React, { useState, useEffect } from "react";
import RNPickerSelect from "react-native-picker-select";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  View,
  Text,
  Alert,
  Modal,
  Platform,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

const subjectOptions = [
  { label: "Mathématiques", value: "math" },
  { label: "Français", value: "french" },
  { label: "Sciences", value: "science" },
  { label: "Histoire", value: "history" },
  { label: "Géographie", value: "geography" },
  { label: "Anglais", value: "english" },
];

const priorityOptions = [
  { label: "Basse", value: "low" },
  { label: "Moyenne", value: "medium" },
  { label: "Élevée", value: "high" },
];

const statusOptions = [
  { label: "Non commencé", value: "not_started" },
  { label: "En cours", value: "in_progress" },
  { label: "Atteint", value: "completed" },
];

// Example objective data
const existingObjective = {
  id: "1",
  title: "Obtenir une moyenne de 80% en mathématiques",
  description:
    "Améliorer les performances en mathématiques en atteignant une moyenne d'au moins 80%",
  subject: "math",
  priority: "high",
  status: "in_progress",
  startDate: new Date("2025-02-26T12:26:00"),
  endDate: new Date("2025-02-27T00:00:00"),

  // Optional message, if it was previously set for demonstration
  kidMessage: "Félicitations ! Tu as atteint ton objectif en mathématiques !",
};

const EditObjectiveScreen = () => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  // Get the objective ID from route params (for demonstration we just use the existing one)
  const objectiveId = (params.id as string) || "1";
  const objective = existingObjective; // Simulating data fetching by ID

  // States for form fields
  const [title, setTitle] = useState(objective.title);
  const [description, setDescription] = useState(objective.description);
  const [subject, setSubject] = useState<string | null>(objective.subject);
  const [priority, setPriority] = useState<string | null>(objective.priority);
  const [initialStatus, setInitialStatus] = useState<string | null>(
    objective.status
  );

  // Date states
  const [startDate, setStartDate] = useState(objective.startDate);
  const [endDate, setEndDate] = useState(objective.endDate);

  // Date picker visibility
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // ** New State: Optional message for the kid **
  const [kidMessage, setKidMessage] = useState(objective.kidMessage || "");

  // Tracking form changes
  const [hasChanges, setHasChanges] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  // Check for unsaved changes
  useEffect(() => {
    const titleChanged = title !== objective.title;
    const descriptionChanged = description !== objective.description;
    const subjectChanged = subject !== objective.subject;
    const priorityChanged = priority !== objective.priority;
    const statusChanged = initialStatus !== objective.status;
    const startDateChanged =
      startDate.getTime() !== objective.startDate.getTime();
    const endDateChanged = endDate.getTime() !== objective.endDate.getTime();
    const kidMessageChanged = kidMessage !== (objective.kidMessage || "");

    setHasChanges(
      titleChanged ||
        descriptionChanged ||
        subjectChanged ||
        priorityChanged ||
        statusChanged ||
        startDateChanged ||
        endDateChanged ||
        kidMessageChanged
    );
  }, [
    title,
    description,
    subject,
    priority,
    initialStatus,
    startDate,
    endDate,
    kidMessage,
    objective.title,
    objective.description,
    objective.subject,
    objective.priority,
    objective.status,
    objective.startDate,
    objective.endDate,
    objective.kidMessage,
  ]);

  // For date display
  const formatDate = (date: Date): string => {
    return `${date.toLocaleDateString()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  // Start date picker handler
  const onStartDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === "ios");
    setStartDate(currentDate);

    // If start date is after end date, adjust end date
    if (currentDate > endDate) {
      setEndDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)); 
    }
  };

  // End date picker handler
  const onEndDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === "ios");

    if (currentDate >= startDate) {
      setEndDate(currentDate);
    } else {
      Alert.alert(
        "Erreur",
        "La date de fin doit être après la date de début."
      );
    }
  };

  // Back button handler
  const handleBack = () => {
    if (hasChanges) {
      setShowDiscardModal(true);
    } else {
      navigation.goBack();
    }
  };

  // Validate form fields
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

    return true;
  };

  // Save objective
  const saveObjective = () => {
    if (validateForm()) {
      // In a real app, you would send these updated values to an API
      Alert.alert("Succès", "L'objectif a été mis à jour avec succès", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
      // You might do something with `kidMessage` here, such as storing it for display
      // whenever the kid finishes the objective.
    }
  };

  // Discard changes modal
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
            Abandonner les modifications
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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header title="Modifier l'objectif" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            {/* Objective Title */}
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
                    backgroundColor: dark
                      ? COLORS.dark2
                      : COLORS.greyscale100,
                    color: dark ? COLORS.white : COLORS.black,
                  },
                ]}
                value={title}
                onChangeText={setTitle}
                placeholder="Entrez le titre de l'objectif"
                placeholderTextColor={dark ? COLORS.gray3 : COLORS.gray}
              />
            </View>

            {/* Description */}
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
                    backgroundColor: dark
                      ? COLORS.dark2
                      : COLORS.greyscale100,
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

            {/* Subject */}
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
                    backgroundColor: dark
                      ? COLORS.dark2
                      : COLORS.greyscale100,
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
                  Icon={() => {
                    return (
                      <Image
                        source={icons.down}
                        style={{
                          width: 18,
                          height: 18,
                          tintColor: dark ? COLORS.white : COLORS.black,
                        }}
                      />
                    );
                  }}
                />
              </View>
            </View>

            {/* Priority */}
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
                    backgroundColor: dark
                      ? COLORS.dark2
                      : COLORS.greyscale100,
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
                  Icon={() => {
                    return (
                      <Image
                        source={icons.down}
                        style={{
                          width: 18,
                          height: 18,
                          tintColor: dark ? COLORS.white : COLORS.black,
                        }}
                      />
                    );
                  }}
                />
              </View>
            </View>

            {/* Start Date */}
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
                    backgroundColor: dark
                      ? COLORS.dark2
                      : COLORS.greyscale100,
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

            {/* End Date */}
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
                    backgroundColor: dark
                      ? COLORS.dark2
                      : COLORS.greyscale100,
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

            {/* Status */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Statut
              </Text>
              <View
                style={[
                  styles.pickerContainer,
                  {
                    backgroundColor: dark
                      ? COLORS.dark2
                      : COLORS.greyscale100,
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
                  Icon={() => {
                    return (
                      <Image
                        source={icons.down}
                        style={{
                          width: 18,
                          height: 18,
                          tintColor: dark ? COLORS.white : COLORS.black,
                        }}
                      />
                    );
                  }}
                />
              </View>
            </View>

            {/* OPTIONAL MESSAGE FOR THE KID */}
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
                    backgroundColor: dark
                      ? COLORS.dark2
                      : COLORS.greyscale100,
                    color: dark ? COLORS.white : COLORS.black,
                  },
                ]}
                value={kidMessage}
                onChangeText={setKidMessage}
                placeholder="Félicitations ! Tu as ... (exemple)"
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
            onPress={handleBack}
          />
          <Button
            title="Enregistrer"
            filled
            style={[styles.button, styles.saveButton]}
            onPress={saveObjective}
          />
        </View>
      </KeyboardAvoidingView>

      {renderDiscardModal()}
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
    backgroundColor: COLORS.greeen, // Or your chosen color
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

export default EditObjectiveScreen;
