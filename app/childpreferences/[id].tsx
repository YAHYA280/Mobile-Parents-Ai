import { COLORS } from "@/constants";
import React, { useState } from "react";
import Header from "@/components/ui/Header";
import { useTheme } from "@/theme/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import {
  View,
  Text,
  Alert,
  Switch,
  Keyboard,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";

// --------------------------------------------------
// Updated Type
// --------------------------------------------------
type DayId = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
type ContentId = "learning" | "chatbot" | "challenge" | "recherche";

// --------------------------------------------------
// Jours de la semaine
// --------------------------------------------------
const daysOfWeek: { id: DayId; label: string; icon: string }[] = [
  { id: "mon", label: "Lun", icon: "calendar" },
  { id: "tue", label: "Mar", icon: "calendar" },
  { id: "wed", label: "Mer", icon: "calendar" },
  { id: "thu", label: "Jeu", icon: "calendar" },
  { id: "fri", label: "Ven", icon: "calendar" },
  { id: "sat", label: "Sam", icon: "calendar" },
  { id: "sun", label: "Dim", icon: "calendar" },
];

// --------------------------------------------------
// Sections de contenu (mis à jour)
// --------------------------------------------------
const contentSections: {
  id: ContentId;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    id: "learning",
    label: "J'apprends",
    icon: "school",
    description: "Accès aux cours et leçons",
  },
  {
    id: "chatbot",
    label: "Assistant d'accueil",
    icon: "chatbubble-ellipses",
    description: "Interaction avec l'assistant IA",
  },
  {
    id: "challenge",
    label: "Challenge",
    icon: "trophy",
    description: "Défis et compétitions",
  },
  {
    id: "recherche",
    label: "Recherche",
    icon: "search",
    description: "Fonctionnalité de recherche",
  },
];

// --------------------------------------------------
// ChildPreferencesScreen
// --------------------------------------------------
const ChildPreferencesScreen = () => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  // Dans une vraie application, vous récupéreriez ces préférences depuis une API
  const childId = (params.id as string) || "1";

  // États pour le temps d'utilisation
  const [maxHours, setMaxHours] = useState("2");
  const [maxMinutes, setMaxMinutes] = useState("30");

  // États pour les plages horaires
  const [startHour, setStartHour] = useState("08");
  const [startMinute, setStartMinute] = useState("00");
  const [endHour, setEndHour] = useState("18");
  const [endMinute, setEndMinute] = useState("00");

  // États pour les jours d'accès
  const [allowedDays, setAllowedDays] = useState<Record<DayId, boolean>>({
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: false,
    sun: false,
  });

  // --------------------------------------------------
  // Nouveau Record pour correspondre aux ID "challenge" & "recherche"
  // --------------------------------------------------
  const [contentRestrictions, setContentRestrictions] = useState<
    Record<ContentId, boolean>
  >({
    learning: false,
    chatbot: false,
    challenge: false, // remplace "exercises"
    recherche: true, // remplace "games"
  });

  // --------------------------------------------------
  // Ajout d'une liste de mots interdits
  // --------------------------------------------------
  const [restrictedWords, setRestrictedWords] = useState<string[]>([]);
  const [newRestrictedWord, setNewRestrictedWord] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const inputRef = React.useRef<TextInput>(null);

  // Fonction pour basculer l'état d'un jour
  const toggleDay = (dayId: DayId) => {
    setAllowedDays((prev) => ({
      ...prev,
      [dayId]: !prev[dayId],
    }));
  };

  // Fonction pour basculer l'état d'une restriction de contenu
  const toggleContentRestriction = (sectionId: ContentId) => {
    setContentRestrictions((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Validation des valeurs de temps
  const validateTimeInput = (value: string, max: number): string => {
    const numValue = parseInt(value, 10);
    if (Number.isNaN(numValue)) return "00";
    if (numValue < 0) return "00";
    if (numValue > max) return max.toString().padStart(2, "0");
    return numValue.toString().padStart(2, "0");
  };

  // Gestionnaire pour les changements de temps d'utilisation
  const handleMaxHoursChange = (value: string) => {
    setMaxHours(validateTimeInput(value, 12));
  };

  const handleMaxMinutesChange = (value: string) => {
    setMaxMinutes(validateTimeInput(value, 59));
  };

  // Gestionnaires pour les changements de plages horaires
  const handleStartHourChange = (value: string) => {
    setStartHour(validateTimeInput(value, 23));
  };

  const handleStartMinuteChange = (value: string) => {
    setStartMinute(validateTimeInput(value, 59));
  };

  const handleEndHourChange = (value: string) => {
    setEndHour(validateTimeInput(value, 23));
  };

  const handleEndMinuteChange = (value: string) => {
    setEndMinute(validateTimeInput(value, 59));
  };

  // --------------------------------------------------
  // Gestionnaires pour les mots interdits
  // --------------------------------------------------
  const handleAddRestrictedWord = () => {
    const trimmedWord = newRestrictedWord.trim();
    if (trimmedWord.length > 0) {
      setRestrictedWords((prev) => [...prev, trimmedWord]);
      setNewRestrictedWord("");
      Keyboard.dismiss();
    }
  };

  const handleRemoveRestrictedWord = (index: number) => {
    setRestrictedWords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputFocus = () => {
    // Scroll vers le bas après un délai pour laisser le clavier apparaître
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Fonction pour sauvegarder les préférences
  const savePreferences = () => {
    setIsSubmitting(true);

    // Dans une vraie application, vous enverriez ces données à une API
    // et incluriez "restrictedWords" pour gérer les mots interdits.
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        "Succès",
        "Les préférences ont été enregistrées avec succès.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    }, 1000);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "right", "bottom", "left"]}
    >
      <Header
        title="Préférences et restrictions"
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 0 }}
        >
          {/* Section Temps d'utilisation */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600 }}
            style={[
              styles.section,
              { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
              Platform.OS === "ios" && styles.iosShadow,
            ]}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="time" size={24} color={COLORS.primary} />
              <Text
                style={[
                  styles.sectionTitle,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Temps d&apos;utilisation
              </Text>
            </View>

            <Text
              style={[
                styles.label,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Temps maximum d&apos;utilisation par jour
            </Text>

            <View style={styles.timeInputContainer}>
              <View style={styles.timeInputGroup}>
                <View style={styles.timeInputWrapper}>
                  <Ionicons name="hourglass" size={16} color={COLORS.primary} />
                  <TextInput
                    style={[
                      styles.timeInput,
                      {
                        backgroundColor: dark
                          ? COLORS.dark3
                          : COLORS.greyscale100,
                        color: dark ? COLORS.white : COLORS.black,
                        borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
                      },
                    ]}
                    value={maxHours}
                    onChangeText={handleMaxHoursChange}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>
                <Text
                  style={[
                    styles.timeLabel,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  heures
                </Text>
              </View>

              <View style={styles.timeInputGroup}>
                <View style={styles.timeInputWrapper}>
                  <Ionicons name="timer" size={16} color={COLORS.primary} />
                  <TextInput
                    style={[
                      styles.timeInput,
                      {
                        backgroundColor: dark
                          ? COLORS.dark3
                          : COLORS.greyscale100,
                        color: dark ? COLORS.white : COLORS.black,
                        borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
                      },
                    ]}
                    value={maxMinutes}
                    onChangeText={handleMaxMinutesChange}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>
                <Text
                  style={[
                    styles.timeLabel,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  minutes
                </Text>
              </View>
            </View>
          </MotiView>

          {/* Section Plages horaires */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 200 }}
            style={[
              styles.section,
              { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
              Platform.OS === "ios" && styles.iosShadow,
            ]}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="alarm" size={24} color={COLORS.primary} />
              <Text
                style={[
                  styles.sectionTitle,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Plages horaires autorisées
              </Text>
            </View>

            <View style={styles.timeRangeContainer}>
              <View style={styles.timeRangeGroup}>
                <View style={styles.timeRangeHeader}>
                  <Ionicons name="play" size={16} color={COLORS.primary} />
                  <Text
                    style={[
                      styles.timeRangeLabel,
                      { color: dark ? COLORS.white : COLORS.black },
                    ]}
                  >
                    De
                  </Text>
                </View>
                <View style={styles.timeInputContainer}>
                  <TextInput
                    style={[
                      styles.timeInput,
                      {
                        backgroundColor: dark
                          ? COLORS.dark3
                          : COLORS.greyscale100,
                        color: dark ? COLORS.white : COLORS.black,
                        borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
                      },
                    ]}
                    value={startHour}
                    onChangeText={handleStartHourChange}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                  <Text
                    style={[
                      styles.timeSeparator,
                      { color: dark ? COLORS.white : COLORS.black },
                    ]}
                  >
                    :
                  </Text>
                  <TextInput
                    style={[
                      styles.timeInput,
                      {
                        backgroundColor: dark
                          ? COLORS.dark3
                          : COLORS.greyscale100,
                        color: dark ? COLORS.white : COLORS.black,
                        borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
                      },
                    ]}
                    value={startMinute}
                    onChangeText={handleStartMinuteChange}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>
              </View>

              <View style={styles.timeRangeGroup}>
                <View style={styles.timeRangeHeader}>
                  <Ionicons name="stop" size={16} color={COLORS.primary} />
                  <Text
                    style={[
                      styles.timeRangeLabel,
                      { color: dark ? COLORS.white : COLORS.black },
                    ]}
                  >
                    À
                  </Text>
                </View>
                <View style={styles.timeInputContainer}>
                  <TextInput
                    style={[
                      styles.timeInput,
                      {
                        backgroundColor: dark
                          ? COLORS.dark3
                          : COLORS.greyscale100,
                        color: dark ? COLORS.white : COLORS.black,
                        borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
                      },
                    ]}
                    value={endHour}
                    onChangeText={handleEndHourChange}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                  <Text
                    style={[
                      styles.timeSeparator,
                      { color: dark ? COLORS.white : COLORS.black },
                    ]}
                  >
                    :
                  </Text>
                  <TextInput
                    style={[
                      styles.timeInput,
                      {
                        backgroundColor: dark
                          ? COLORS.dark3
                          : COLORS.greyscale100,
                        color: dark ? COLORS.white : COLORS.black,
                        borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
                      },
                    ]}
                    value={endMinute}
                    onChangeText={handleEndMinuteChange}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>
              </View>
            </View>
          </MotiView>

          {/* Section Jours d'accès */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 400 }}
            style={[
              styles.section,
              { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
              Platform.OS === "ios" && styles.iosShadow,
            ]}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar" size={24} color={COLORS.primary} />
              <Text
                style={[
                  styles.sectionTitle,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Jours d&apos;accès autorisés
              </Text>
            </View>

            <View style={styles.daysContainer}>
              {daysOfWeek.map((day, index) => (
                <MotiView
                  key={day.id}
                  from={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    delay: 100 * index,
                    damping: 15,
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.dayButton,
                      allowedDays[day.id]
                        ? { backgroundColor: COLORS.primary }
                        : {
                            backgroundColor: dark
                              ? COLORS.dark3
                              : COLORS.greyscale300,
                          },
                    ]}
                    onPress={() => toggleDay(day.id)}
                    activeOpacity={0.8}
                  >
                    {allowedDays[day.id] ? (
                      <LinearGradient
                        colors={["#FF9500", "#FFB84D"]}
                        style={styles.dayButtonGradient}
                      >
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color={COLORS.white}
                        />
                        <Text style={styles.dayLabel}>{day.label}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.dayButtonContent}>
                        <Ionicons
                          name="close"
                          size={16}
                          color={dark ? COLORS.white : COLORS.black}
                        />
                        <Text
                          style={[
                            styles.dayLabel,
                            { color: dark ? COLORS.white : COLORS.black },
                          ]}
                        >
                          {day.label}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </MotiView>
              ))}
            </View>
          </MotiView>

          {/* Section Restrictions de contenu */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 600 }}
            style={[
              styles.section,
              { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
              Platform.OS === "ios" && styles.iosShadow,
            ]}
          >
            <View style={styles.sectionHeader}>
              <Ionicons
                name="shield-checkmark"
                size={24}
                color={COLORS.primary}
              />
              <Text
                style={[
                  styles.sectionTitle,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Restrictions de contenu
              </Text>
            </View>

            <Text
              style={[
                styles.restrictionDescription,
                { color: dark ? COLORS.greyscale300 : COLORS.gray },
              ]}
            >
              Activez les restrictions pour empêcher l&apos;accès à certaines
              sections de l&apos;application.
            </Text>

            {contentSections.map((section, index) => (
              <MotiView
                key={section.id}
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{
                  type: "timing",
                  duration: 500,
                  delay: 100 * index,
                }}
              >
                <View style={styles.restrictionItem}>
                  <View style={styles.restrictionLeft}>
                    <View style={styles.restrictionIconContainer}>
                      <Ionicons
                        name={section.icon as any}
                        size={20}
                        color={COLORS.primary}
                      />
                    </View>
                    <View style={styles.restrictionTextContainer}>
                      <Text
                        style={[
                          styles.restrictionLabel,
                          { color: dark ? COLORS.white : COLORS.black },
                        ]}
                      >
                        {section.label}
                      </Text>
                      <Text
                        style={[
                          styles.restrictionSubtext,
                          { color: dark ? COLORS.greyscale300 : COLORS.gray },
                        ]}
                      >
                        {section.description}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={contentRestrictions[section.id]}
                    onValueChange={() => toggleContentRestriction(section.id)}
                    trackColor={{
                      false: dark ? COLORS.dark3 : COLORS.greyscale300,
                      true: COLORS.primary,
                    }}
                    thumbColor={COLORS.white}
                    ios_backgroundColor={
                      dark ? COLORS.dark3 : COLORS.greyscale300
                    }
                  />
                </View>
              </MotiView>
            ))}
          </MotiView>

          {/* Section Mots interdits */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 800 }}
            style={[
              styles.section,
              { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
              Platform.OS === "ios" && styles.iosShadow,
            ]}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="eye-off" size={24} color={COLORS.primary} />
              <Text
                style={[
                  styles.sectionTitle,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Mots interdits
              </Text>
            </View>
            <Text
              style={[
                styles.restrictionDescription,
                { color: dark ? COLORS.greyscale300 : COLORS.gray },
              ]}
            >
              Saisissez les mots que vous souhaitez bloquer. Tapez le mot puis
              appuyez sur &quot;Ajouter&quot;.
            </Text>

            {/* Input pour un nouveau mot interdit */}
            <View style={styles.addRestrictedWordContainer}>
              <View style={styles.restrictedWordInputContainer}>
                <Ionicons name="ban" size={16} color={COLORS.primary} />
                <TextInput
                  ref={inputRef}
                  style={[
                    styles.restrictedWordInput,
                    {
                      backgroundColor: dark
                        ? COLORS.dark3
                        : COLORS.greyscale100,
                      color: dark ? COLORS.white : COLORS.black,
                      borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
                    },
                  ]}
                  placeholder="Ajouter un mot interdit..."
                  placeholderTextColor={
                    dark ? COLORS.greyscale300 : COLORS.gray
                  }
                  value={newRestrictedWord}
                  onChangeText={setNewRestrictedWord}
                  onSubmitEditing={handleAddRestrictedWord}
                  onFocus={handleInputFocus}
                  returnKeyType="done"
                  blurOnSubmit={true}
                />
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddRestrictedWord}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#FF9500", "#FFB84D"]}
                  style={styles.addButtonGradient}
                >
                  <Ionicons name="add" size={16} color={COLORS.white} />
                  <Text style={styles.addButtonText}>Ajouter</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Liste des mots interdits (tags) */}
            <View style={styles.tagsContainer}>
              {restrictedWords.map((word, index) => (
                <MotiView
                  key={`${word}-${index}`}
                  from={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    delay: 50 * index,
                    damping: 15,
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.tag,
                      {
                        backgroundColor: dark
                          ? COLORS.dark3
                          : COLORS.greyscale300,
                        borderColor: dark ? COLORS.dark3 : COLORS.greyscale400,
                      },
                    ]}
                    onPress={() => handleRemoveRestrictedWord(index)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        { color: dark ? COLORS.white : COLORS.black },
                      ]}
                    >
                      {word}
                    </Text>
                    <Ionicons
                      name="close-circle"
                      size={16}
                      color={COLORS.error}
                    />
                  </TouchableOpacity>
                </MotiView>
              ))}
            </View>
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Enhanced Apply Button */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500, delay: 1000 }}
        style={styles.buttonContainer}
      >
        <TouchableOpacity
          style={[styles.applyButton, { opacity: isSubmitting ? 0.8 : 1 }]}
          onPress={savePreferences}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#4CAF50", "#66BB6A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.applyButtonGradient}
          >
            {isSubmitting ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.white} />
                <Text style={styles.applyButtonText}>Application...</Text>
              </View>
            ) : (
              <View style={styles.applyButtonContent}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={COLORS.white}
                />
                <Text style={styles.applyButtonText}>
                  Appliquer les restrictions
                </Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </MotiView>
    </SafeAreaView>
  );
};

// --------------------------------------------------
// Styles
// --------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginLeft: 12,
  },
  label: {
    fontSize: 14,
    fontFamily: "medium",
    marginBottom: 12,
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  timeInputGroup: {
    alignItems: "center",
  },
  timeInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  timeInput: {
    width: 50,
    height: 40,
    padding: 8,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "medium",
    marginLeft: 8,
    borderWidth: 1,
  },
  timeLabel: {
    fontSize: 14,
    fontFamily: "regular",
  },
  timeRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeRangeGroup: {
    alignItems: "center",
  },
  timeRangeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  timeRangeLabel: {
    fontSize: 14,
    fontFamily: "medium",
    marginLeft: 6,
  },
  timeSeparator: {
    fontSize: 18,
    fontFamily: "bold",
    marginHorizontal: 4,
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  dayButton: {
    width: 70,
    height: 50,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dayButtonContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dayLabel: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "bold",
    marginTop: 2,
  },
  restrictionDescription: {
    fontSize: 14,
    fontFamily: "regular",
    marginBottom: 16,
    lineHeight: 20,
  },
  restrictionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale200,
  },
  restrictionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  restrictionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  restrictionTextContainer: {
    flex: 1,
  },
  restrictionLabel: {
    fontSize: 16,
    fontFamily: "medium",
  },
  restrictionSubtext: {
    fontSize: 12,
    fontFamily: "regular",
    marginTop: 2,
  },
  addRestrictedWordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  restrictedWordInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  restrictedWordInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    fontFamily: "regular",
    marginLeft: 8,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  addButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#FF9500",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addButtonText: {
    color: COLORS.white,
    fontFamily: "bold",
    fontSize: 14,
    marginLeft: 6,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tagText: {
    fontFamily: "medium",
    fontSize: 14,
    marginRight: 8,
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  applyButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  applyButtonGradient: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "semibold",
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChildPreferencesScreen;
