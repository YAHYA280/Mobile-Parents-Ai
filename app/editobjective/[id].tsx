import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
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
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";

import { COLORS } from "@/constants";
import Header from "@/components/ui/Header";
import { useTheme } from "@/theme/ThemeProvider";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Refs for pickers
  const subjectPickerRef = React.useRef<any>(null);
  const priorityPickerRef = React.useRef<any>(null);
  const statusPickerRef = React.useRef<any>(null);

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
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
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
      Alert.alert("Erreur", "La date de fin doit être après la date de début.");
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
      setIsSubmitting(true);

      // In a real app, you would send these updated values to an API
      setTimeout(() => {
        setIsSubmitting(false);
        Alert.alert("Succès", "L'objectif a été mis à jour avec succès", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }, 1000);
    }
  };

  const openPicker = (pickerRef: React.RefObject<any>) => {
    if (pickerRef.current) {
      pickerRef.current.togglePicker();
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
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
          style={[
            styles.modalContainer,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
          <View style={styles.modalIconContainer}>
            <Ionicons name="warning" size={48} color="#FF9500" />
          </View>

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
            {/* Enhanced Cancel Button */}
            <TouchableOpacity
              style={[
                styles.modalCancelButton,
                { borderColor: dark ? COLORS.dark3 : COLORS.greyscale300 },
              ]}
              onPress={() => setShowDiscardModal(false)}
              activeOpacity={0.8}
            >
              <View style={styles.modalCancelContent}>
                <Ionicons
                  name="close-outline"
                  size={18}
                  color={dark ? COLORS.white : COLORS.black}
                />
                <Text
                  style={[
                    styles.modalCancelText,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  Continuer l'édition
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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "right", "bottom", "left"]}
    >
      <Header title="Modifier l'objectif" onBackPress={handleBack} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
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
            <View style={styles.formContainer}>
              {/* Objective Title */}
              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: "timing", duration: 500, delay: 200 }}
              >
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Ionicons name="flag" size={18} color={COLORS.primary} />
                    <Text
                      style={[
                        styles.label,
                        { color: dark ? COLORS.white : COLORS.black },
                      ]}
                    >
                      Titre de l&apos;objectif
                    </Text>
                  </View>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                        color: dark ? COLORS.white : COLORS.black,
                        borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
                      },
                    ]}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Entrez le titre de l'objectif"
                    placeholderTextColor={dark ? COLORS.gray3 : COLORS.gray}
                  />
                </View>
              </MotiView>

              {/* Description */}
              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: "timing", duration: 500, delay: 300 }}
              >
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Ionicons
                      name="document-text"
                      size={18}
                      color={COLORS.primary}
                    />
                    <Text
                      style={[
                        styles.label,
                        { color: dark ? COLORS.white : COLORS.black },
                      ]}
                    >
                      Description
                    </Text>
                  </View>
                  <TextInput
                    style={[
                      styles.textInput,
                      styles.textArea,
                      {
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                        color: dark ? COLORS.white : COLORS.black,
                        borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
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
              </MotiView>

              {/* Subject */}
              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: "timing", duration: 500, delay: 400 }}
              >
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Ionicons name="school" size={18} color={COLORS.primary} />
                    <Text
                      style={[
                        styles.label,
                        { color: dark ? COLORS.white : COLORS.black },
                      ]}
                    >
                      Matière
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.pickerContainer,
                      {
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                        borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.pickerTouchableOverlay}
                      onPress={() => openPicker(subjectPickerRef)}
                      activeOpacity={0.7}
                    />

                    <RNPickerSelect
                      ref={subjectPickerRef}
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
                          paddingHorizontal: 16,
                          color: dark ? COLORS.white : COLORS.black,
                          paddingRight: 50,
                        },
                        inputAndroid: {
                          fontSize: 16,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          color: dark ? COLORS.white : COLORS.black,
                          paddingRight: 50,
                        },
                        iconContainer: {
                          top: 18,
                          right: 16,
                        },
                      }}
                      useNativeAndroidPickerStyle={false}
                      Icon={() => (
                        <Ionicons
                          name="chevron-down"
                          size={20}
                          color={dark ? COLORS.white : COLORS.black}
                        />
                      )}
                    />
                  </View>
                </View>
              </MotiView>

              {/* Priority */}
              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: "timing", duration: 500, delay: 500 }}
              >
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Ionicons
                      name="alert-circle"
                      size={18}
                      color={COLORS.primary}
                    />
                    <Text
                      style={[
                        styles.label,
                        { color: dark ? COLORS.white : COLORS.black },
                      ]}
                    >
                      Priorité
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.pickerContainer,
                      {
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                        borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.pickerTouchableOverlay}
                      onPress={() => openPicker(priorityPickerRef)}
                      activeOpacity={0.7}
                    />

                    <RNPickerSelect
                      ref={priorityPickerRef}
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
                          paddingHorizontal: 16,
                          color: dark ? COLORS.white : COLORS.black,
                          paddingRight: 50,
                        },
                        inputAndroid: {
                          fontSize: 16,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          color: dark ? COLORS.white : COLORS.black,
                          paddingRight: 50,
                        },
                        iconContainer: {
                          top: 18,
                          right: 16,
                        },
                      }}
                      useNativeAndroidPickerStyle={false}
                      Icon={() => (
                        <Ionicons
                          name="chevron-down"
                          size={20}
                          color={dark ? COLORS.white : COLORS.black}
                        />
                      )}
                    />
                  </View>
                </View>
              </MotiView>

              {/* Start Date */}
              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: "timing", duration: 500, delay: 600 }}
              >
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Ionicons name="play" size={18} color={COLORS.primary} />
                    <Text
                      style={[
                        styles.label,
                        { color: dark ? COLORS.white : COLORS.black },
                      ]}
                    >
                      Date de début
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.dateButton,
                      {
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                        borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
                      },
                    ]}
                    onPress={() => setShowStartDatePicker(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: dark ? COLORS.white : COLORS.black }}>
                      {formatDate(startDate)}
                    </Text>
                    <Ionicons
                      name="calendar"
                      size={20}
                      color={dark ? COLORS.white : COLORS.black}
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
              </MotiView>

              {/* End Date */}
              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: "timing", duration: 500, delay: 700 }}
              >
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Ionicons name="stop" size={18} color={COLORS.primary} />
                    <Text
                      style={[
                        styles.label,
                        { color: dark ? COLORS.white : COLORS.black },
                      ]}
                    >
                      Date de fin
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.dateButton,
                      {
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                        borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
                      },
                    ]}
                    onPress={() => setShowEndDatePicker(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: dark ? COLORS.white : COLORS.black }}>
                      {formatDate(endDate)}
                    </Text>
                    <Ionicons
                      name="calendar"
                      size={20}
                      color={dark ? COLORS.white : COLORS.black}
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
              </MotiView>

              {/* Status */}
              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: "timing", duration: 500, delay: 800 }}
              >
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={COLORS.primary}
                    />
                    <Text
                      style={[
                        styles.label,
                        { color: dark ? COLORS.white : COLORS.black },
                      ]}
                    >
                      Statut
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.pickerContainer,
                      {
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                        borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.pickerTouchableOverlay}
                      onPress={() => openPicker(statusPickerRef)}
                      activeOpacity={0.7}
                    />

                    <RNPickerSelect
                      ref={statusPickerRef}
                      placeholder={{
                        label: "Sélectionner un statut",
                        value: null,
                      }}
                      items={statusOptions}
                      onValueChange={setInitialStatus}
                      value={initialStatus}
                      style={{
                        inputIOS: {
                          fontSize: 16,
                          paddingVertical: 12,
                          paddingHorizontal: 16,
                          color: dark ? COLORS.white : COLORS.black,
                          paddingRight: 50,
                        },
                        inputAndroid: {
                          fontSize: 16,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          color: dark ? COLORS.white : COLORS.black,
                          paddingRight: 50,
                        },
                        iconContainer: {
                          top: 18,
                          right: 16,
                        },
                      }}
                      useNativeAndroidPickerStyle={false}
                      Icon={() => (
                        <Ionicons
                          name="chevron-down"
                          size={20}
                          color={dark ? COLORS.white : COLORS.black}
                        />
                      )}
                    />
                  </View>
                </View>
              </MotiView>

              {/* OPTIONAL MESSAGE FOR THE KID */}
              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: "timing", duration: 500, delay: 900 }}
              >
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Ionicons
                      name="chatbubble-ellipses"
                      size={18}
                      color={COLORS.primary}
                    />
                    <Text
                      style={[
                        styles.label,
                        { color: dark ? COLORS.white : COLORS.black },
                      ]}
                    >
                      Message pour l&apos;enfant (optionnel)
                    </Text>
                  </View>
                  <TextInput
                    style={[
                      styles.textInput,
                      styles.textArea,
                      {
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                        color: dark ? COLORS.white : COLORS.black,
                        borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
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
              </MotiView>

              {/* Changes indicator */}
              {hasChanges && (
                <MotiView
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: "timing", duration: 500, delay: 1000 }}
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

        {/* Enhanced Buttons */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500, delay: 1100 }}
          style={styles.buttonContainer}
        >
          {/* Enhanced Cancel Button */}
          <TouchableOpacity
            style={[
              styles.cancelButton,
              { borderColor: dark ? COLORS.dark3 : COLORS.greyscale300 },
            ]}
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <View style={styles.cancelButtonContent}>
              <Ionicons
                name="close-outline"
                size={20}
                color={dark ? COLORS.white : COLORS.black}
              />
              <Text
                style={[
                  styles.cancelButtonText,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Annuler
              </Text>
            </View>
          </TouchableOpacity>

          {/* Enhanced Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, { opacity: isSubmitting ? 0.8 : 1 }]}
            onPress={saveObjective}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
    padding: 16,
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
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: "medium",
    marginLeft: 8,
  },
  textInput: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "regular",
    borderWidth: 1.5,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
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
  dateButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
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

export default EditObjectiveScreen;
