import { COLORS } from "@/constants";
import React, { useState } from "react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { useTheme } from "@/theme/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Alert,
  Switch,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

type DayId = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
type ContentId = "learning" | "chatbot" | "exercises" | "games" | "videos";

// Jours de la semaine
const daysOfWeek: { id: DayId; label: string }[] = [
  { id: "mon", label: "Lun" },
  { id: "tue", label: "Mar" },
  { id: "wed", label: "Mer" },
  { id: "thu", label: "Jeu" },
  { id: "fri", label: "Ven" },
  { id: "sat", label: "Sam" },
  { id: "sun", label: "Dim" },
];

const contentSections: { id: ContentId; label: string }[] = [
  { id: "learning", label: "J'apprends" },
  { id: "chatbot", label: "ChatBot Accueil" },
  { id: "exercises", label: "Exercices" },
  { id: "games", label: "Jeux éducatifs" },
  { id: "videos", label: "Vidéos" },
];

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

  // États pour les restrictions de contenu
  const [contentRestrictions, setContentRestrictions] = useState<
    Record<ContentId, boolean>
  >({
    learning: false,
    chatbot: false,
    exercises: false,
    games: true,
    videos: true,
  });
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

  // Fonction pour sauvegarder les préférences
  const savePreferences = () => {
    // Dans une vraie application, vous enverriez ces données à une API
    Alert.alert("Succès", "Les préférences ont été enregistrées avec succès", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header title="Préférences et restrictions" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Temps d'utilisation */}
        <View
          style={[
            styles.section,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Temps d&apos;utilisation
          </Text>

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
              <TextInput
                style={[
                  styles.timeInput,
                  {
                    backgroundColor: dark ? COLORS.dark3 : COLORS.greyscale100,
                    color: dark ? COLORS.white : COLORS.black,
                  },
                ]}
                value={maxHours}
                onChangeText={handleMaxHoursChange}
                keyboardType="numeric"
                maxLength={2}
              />
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
              <TextInput
                style={[
                  styles.timeInput,
                  {
                    backgroundColor: dark ? COLORS.dark3 : COLORS.greyscale100,
                    color: dark ? COLORS.white : COLORS.black,
                  },
                ]}
                value={maxMinutes}
                onChangeText={handleMaxMinutesChange}
                keyboardType="numeric"
                maxLength={2}
              />
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
        </View>

        {/* Section Plages horaires */}
        <View
          style={[
            styles.section,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Plages horaires autorisées
          </Text>

          <View style={styles.timeRangeContainer}>
            <View style={styles.timeRangeGroup}>
              <Text
                style={[
                  styles.timeRangeLabel,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                De
              </Text>
              <View style={styles.timeInputContainer}>
                <TextInput
                  style={[
                    styles.timeInput,
                    {
                      backgroundColor: dark
                        ? COLORS.dark3
                        : COLORS.greyscale100,
                      color: dark ? COLORS.white : COLORS.black,
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
              <Text
                style={[
                  styles.timeRangeLabel,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                À
              </Text>
              <View style={styles.timeInputContainer}>
                <TextInput
                  style={[
                    styles.timeInput,
                    {
                      backgroundColor: dark
                        ? COLORS.dark3
                        : COLORS.greyscale100,
                      color: dark ? COLORS.white : COLORS.black,
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
        </View>

        {/* Section Jours d'accès */}
        <View
          style={[
            styles.section,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Jours d&apos;accès autorisés
          </Text>

          <View style={styles.daysContainer}>
            {daysOfWeek.map((day) => (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayButton,
                  allowedDays[day.id as keyof typeof allowedDays]
                    ? { backgroundColor: COLORS.primary }
                    : {
                        backgroundColor: dark
                          ? COLORS.dark3
                          : COLORS.greyscale300,
                      },
                ]}
                onPress={() => toggleDay(day.id)}
              >
                <Text style={styles.dayLabel}>{day.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section Restrictions de contenu */}
        <View
          style={[
            styles.section,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Restrictions de contenu
          </Text>

          <Text
            style={[
              styles.restrictionDescription,
              { color: dark ? COLORS.greyscale300 : COLORS.gray },
            ]}
          >
            Activez les restrictions pour empêcher l&apos;accès à certaines
            sections de l&apos;application.
          </Text>

          {contentSections.map((section) => (
            <View key={section.id} style={styles.restrictionItem}>
              <Text
                style={[
                  styles.restrictionLabel,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                {section.label}
              </Text>
              <Switch
                value={
                  contentRestrictions[
                    section.id as keyof typeof contentRestrictions
                  ]
                }
                onValueChange={() => toggleContentRestriction(section.id)}
                trackColor={{
                  false: COLORS.greyscale300,
                  true: COLORS.primary,
                }}
                thumbColor={COLORS.white}
                ios_backgroundColor={COLORS.greyscale300}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bouton d'action */}
      <View style={styles.buttonContainer}>
        <Button
          title="Appliquer les restrictions"
          filled
          style={styles.applyButton}
          onPress={savePreferences}
        />
      </View>
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
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: "medium",
    marginBottom: 8,
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeInputGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  timeInput: {
    width: 50,
    height: 40,
    padding: 8,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "medium",
  },
  timeLabel: {
    marginLeft: 8,
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
  timeRangeLabel: {
    fontSize: 14,
    fontFamily: "medium",
    marginBottom: 8,
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
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  dayLabel: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "bold",
  },
  restrictionDescription: {
    fontSize: 14,
    fontFamily: "regular",
    marginBottom: 16,
  },
  restrictionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale200,
  },
  restrictionLabel: {
    fontSize: 16,
    fontFamily: "medium",
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
});

export default ChildPreferencesScreen;
