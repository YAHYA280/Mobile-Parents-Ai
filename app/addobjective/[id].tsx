import React, { useState } from "react";
import Header from "@/components/ui/Header";
import { icons, COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import RNPickerSelect from "react-native-picker-select";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
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
  ActivityIndicator,
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Refs for pickers
  const subjectPickerRef = React.useRef<any>(null);
  const priorityPickerRef = React.useRef<any>(null);
  const statusPickerRef = React.useRef<any>(null);

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
      setIsSubmitting(true);

      // Dans une vraie application, vous enverriez tous ces champs (dont kidMessage) à votre API / backend
      setTimeout(() => {
        setIsSubmitting(false);
        Alert.alert("Succès", "L'objectif a été créé avec succès", [
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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "right", "bottom", "left"]}
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
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600 }}
            style={[styles.formCard, Platform.OS === "ios" && styles.iosShadow]}
          >
            <View style={styles.formContainer}>
              {/* Titre de l'objectif */}
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

              {/* Description de l'objectif */}
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

              {/* Matière */}
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

              {/* Priorité */}
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

              {/* Date de début */}
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

              {/* Date de fin */}
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

              {/* Statut initial */}
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
                      Statut initial
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

              {/* Message pour l'enfant (optionnel) */}
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
                    placeholder="Entrez un message de félicitations ou d'encouragement..."
                    placeholderTextColor={dark ? COLORS.gray3 : COLORS.gray}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              </MotiView>

              {/* Note d'information */}
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 500, delay: 1000 }}
              >
                <View style={styles.noteContainer}>
                  <Ionicons
                    name="information-circle-outline"
                    size={16}
                    color={COLORS.primary}
                  />
                  <Text style={styles.note}>
                    Les champs marqués d'un * sont obligatoires. Le message pour
                    l'enfant est optionnel.
                  </Text>
                </View>
              </MotiView>
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
            onPress={() => navigation.goBack()}
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
                  <Text style={styles.saveButtonText}>Création...</Text>
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

export default AddObjectiveScreen;
