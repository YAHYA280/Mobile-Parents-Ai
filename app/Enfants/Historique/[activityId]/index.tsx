// app/Enfants/Historique/[activityId]/index.tsx
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "@/constants/theme";
import { useChildren } from "@/contexts/ChildrenContext";
import { useActivities } from "@/contexts/ActivitiesContext";
import { useTheme } from "@/contexts/ThemeContext";

import Header from "@/components/ui/Header";
import ActivityHeader from "@/components/activities/ActivityHeader";
import ActivityDetails from "@/components/activities/ActivityDetails";
import Alert from "@/components/ui/Alert";

export default function ActivityDetailsScreen() {
  const router = useRouter();
  const { activityId, childId } = useLocalSearchParams();
  const activityIdNum = Number(activityId);
  const childIdNum = Number(childId);

  const { getChild } = useChildren();
  const { getActivity, loading } = useActivities();
  const { dark } = useTheme();

  const [blocageIdentified, setBlockageIdentified] = useState(false);
  const [parentFeedback, setParentFeedback] = useState("");
  const [parentFeedbacks, setParentFeedbacks] = useState<any[]>([
    {
      text: "Bon travail sur cette activité. On voit des progrès!",
      date: new Date(2023, 2, 22),
    },
  ]);
  const [alertVisible, setAlertVisible] = useState(false);

  const child = getChild(childIdNum);
  const activity = getActivity(activityIdNum, childIdNum);

  const handleBack = () => {
    router.back();
  };

  const navigateToChat = () => {
    router.push(`./Enfants/Historique/${activityId}/chat?childId=${childId}`);
  };

  const navigateToVideo = () => {
    router.push(`./Enfants/Historique/${activityId}/video?childId=${childId}`);
  };

  const toggleBlockageIdentification = () => {
    setBlockageIdentified(!blocageIdentified);
    if (!blocageIdentified) {
      setAlertVisible(true);
    }
  };

  const addFeedback = () => {
    if (parentFeedback.trim() === "") {
      return;
    }

    setParentFeedbacks((prev) => [
      ...prev,
      { text: parentFeedback, date: new Date() },
    ]);

    setParentFeedback("");
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: dark ? COLORS.dark1 : "#F8F8F8" },
        ]}
      >
        <Header title="Détails de l'activité" onBackPress={handleBack} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!activity || !child) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: dark ? COLORS.dark1 : "#F8F8F8" },
        ]}
      >
        <Header title="Détails de l'activité" onBackPress={handleBack} />
        <View style={styles.errorContainer}>
          <Text
            style={[
              styles.errorText,
              { color: dark ? COLORS.white : "#333333" },
            ]}
          >
            Activité non trouvée
          </Text>
          <TouchableOpacity style={styles.errorButton} onPress={handleBack}>
            <Text style={styles.errorButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: dark ? COLORS.dark1 : "#F8F8F8" },
      ]}
    >
      <ActivityHeader
        title="Détails de l'activité"
        onBack={handleBack}
        onBlockageToggle={toggleBlockageIdentification}
        blockageIdentified={blocageIdentified}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ActivityDetails
          activity={activity}
          onChatPress={navigateToChat}
          onVideoPress={navigateToVideo}
        />

        {/* Parent Feedback */}
        <View
          style={[
            styles.feedbackSection,
            { backgroundColor: dark ? COLORS.dark2 : "#FFFFFF" },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: dark ? COLORS.white : "#333333" },
            ]}
          >
            Commentaires des parents
          </Text>

          <View style={styles.feedbackList}>
            {parentFeedbacks.map((feedback, index) => (
              <View
                key={index}
                style={[
                  styles.feedbackItem,
                  {
                    backgroundColor: dark
                      ? "rgba(255,255,255,0.05)"
                      : "#FFFFFF",
                    borderLeftColor: COLORS.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.feedbackText,
                    { color: dark ? COLORS.white : "#333333" },
                  ]}
                >
                  {feedback.text}
                </Text>
                <Text
                  style={[
                    styles.feedbackDate,
                    { color: dark ? COLORS.secondaryWhite : "#757575" },
                  ]}
                >
                  {feedback.date.toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.addFeedbackContainer}>
            <TextInput
              placeholder="Ajouter un commentaire..."
              placeholderTextColor={dark ? "rgba(255,255,255,0.5)" : "#999999"}
              value={parentFeedback}
              onChangeText={setParentFeedback}
              style={[
                styles.feedbackInput,
                {
                  backgroundColor: dark ? "rgba(255,255,255,0.1)" : "#FFFFFF",
                  color: dark ? COLORS.white : "#333333",
                },
              ]}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: COLORS.primary },
                !parentFeedback.trim() && styles.disabledButton,
              ]}
              onPress={addFeedback}
              disabled={!parentFeedback.trim()}
            >
              <Ionicons name="send" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Alert when blockage is identified */}
      <Alert
        visible={alertVisible}
        title="Blocage identifié"
        message="Vous avez identifié un blocage pour cette activité. Un email sera envoyé à l'enseignant pour l'informer de ce blocage."
        buttons={[
          {
            text: "Annuler",
            style: "cancel",
            onPress: () => {
              setAlertVisible(false);
              setBlockageIdentified(false);
            },
          },
          {
            text: "Confirmer",
            onPress: () => setAlertVisible(false),
          },
        ]}
        onDismiss={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
}

import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  errorButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  feedbackSection: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  feedbackList: {
    marginBottom: 16,
  },
  feedbackItem: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
  },
  feedbackText: {
    fontSize: 14,
    marginBottom: 4,
  },
  feedbackDate: {
    fontSize: 10,
    alignSelf: "flex-end",
  },
  addFeedbackContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  feedbackInput: {
    flex: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 40,
    maxHeight: 80,
    fontSize: 14,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
