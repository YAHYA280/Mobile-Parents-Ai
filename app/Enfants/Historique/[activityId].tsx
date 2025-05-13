// app/Enfants/Historique/[activityId].tsx
import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ActivityHeader from "@/components/activities/ActivityHeader";
import ActivityDetails from "@/components/activities/ActivityDetails";
import ConversationView from "@/components/chat/ConversationView";
import ChatInput from "@/components/chat/ChatInput";
import { COLORS } from "@/constants/theme";

// Mock activity with conversations
const mockActivityDetails: Record<
  number,
  {
    id: number;
    activite: string;
    date: string;
    duree: string;
    assistant: string;
    matiere: string;
    difficulty: string;
    score?: string;
    childId: number;
    commentaires: string;
    recommandations: string[];
    conversation: Array<{
      id: string;
      message: string;
      timestamp: string;
      sender: "assistant" | "child";
    }>;
  }
> = {
  1: {
    id: 1,
    activite: "Conversation sur les fractions",
    date: "2025-05-10T10:30:00",
    duree: "25 min",
    assistant: "J'apprends",
    matiere: "Mathématiques",
    difficulty: "Moyen",
    score: "85%",
    childId: 1,
    commentaires:
      "Bonne compréhension des fractions de base. Doit encore travailler sur l'addition de fractions avec des dénominateurs différents.",
    recommandations: [
      "Revoir l'addition de fractions avec des dénominateurs différents",
      "Faire plus d'exercices pratiques sur les fractions équivalentes",
      "Utiliser des représentations visuelles pour renforcer la compréhension",
    ],
    conversation: [
      {
        id: "1",
        message:
          "Bonjour ! Aujourd'hui, nous allons travailler sur les fractions. Es-tu prêt ?",
        timestamp: "10:30",
        sender: "assistant",
      },
      {
        id: "2",
        message: "Oui, je suis prêt !",
        timestamp: "10:31",
        sender: "child",
      },
      {
        id: "3",
        message:
          "Super ! Commençons par les bases. Peux-tu me dire ce qu'est une fraction ?",
        timestamp: "10:31",
        sender: "assistant",
      },
      {
        id: "4",
        message:
          "Une fraction représente une partie d'un tout. Elle a un numérateur et un dénominateur.",
        timestamp: "10:32",
        sender: "child",
      },
      {
        id: "5",
        message:
          "Excellent ! Si nous avons 3/4, peux-tu m'expliquer ce que signifient les chiffres 3 et 4 ?",
        timestamp: "10:33",
        sender: "assistant",
      },
      {
        id: "6",
        message:
          "Le 3 est le numérateur, il dit combien de parties nous avons. Le 4 est le dénominateur, il dit en combien de parties le tout est divisé.",
        timestamp: "10:34",
        sender: "child",
      },
      {
        id: "7",
        message:
          "Parfait ! Passons maintenant à l'addition des fractions. Comment additionnes-tu 1/4 + 2/4 ?",
        timestamp: "10:35",
        sender: "assistant",
      },
      {
        id: "8",
        message:
          "Pour additionner des fractions avec le même dénominateur, j'additionne les numérateurs et je garde le même dénominateur. Donc 1/4 + 2/4 = 3/4",
        timestamp: "10:36",
        sender: "child",
      },
      {
        id: "9",
        message:
          "Très bien ! Et si les dénominateurs sont différents, comme 1/2 + 1/4 ?",
        timestamp: "10:37",
        sender: "assistant",
      },
      {
        id: "10",
        message:
          "Je dois trouver un dénominateur commun. 2 et 4... le plus petit commun multiple est 4. Donc 1/2 = 2/4, et 2/4 + 1/4 = 3/4.",
        timestamp: "10:38",
        sender: "child",
      },
      {
        id: "11",
        message:
          "Excellent travail ! Tu as très bien compris l'addition des fractions. Continuons avec quelques exercices...",
        timestamp: "10:39",
        sender: "assistant",
      },
    ],
  },
  2: {
    id: 2,
    activite: "Lecture et compréhension de texte",
    date: "2025-05-09T14:20:00",
    duree: "30 min",
    assistant: "Recherche",
    matiere: "Français",
    difficulty: "Facile",
    childId: 1,
    commentaires:
      "Bonne compréhension générale du texte. Pourrait améliorer l'identification des idées principales.",
    recommandations: [
      "Pratiquer l'identification des idées principales",
      "Faire plus d'exercices de résumé de texte",
      "Renforcer le vocabulaire",
    ],
    conversation: [
      {
        id: "1",
        message:
          "Bonjour ! Aujourd'hui, nous allons travailler sur la compréhension de texte. Je vais te partager un court paragraphe à lire.",
        timestamp: "14:20",
        sender: "assistant",
      },
      {
        id: "2",
        message: "D'accord, je suis prêt à lire !",
        timestamp: "14:21",
        sender: "child",
      },
      {
        id: "3",
        message:
          "\"Le petit chat gris se promenait dans le jardin. Il aperçut un papillon bleu qui voletait parmi les fleurs. Doucement, il s'approcha, prêt à bondir. Mais le papillon s'envola au loin, et le chat retourna jouer avec une feuille.\"",
        timestamp: "14:21",
        sender: "assistant",
      },
      {
        id: "4",
        message: "J'ai fini de lire le texte.",
        timestamp: "14:22",
        sender: "child",
      },
      {
        id: "5",
        message:
          "Très bien ! Maintenant, peux-tu me dire qui est le personnage principal de cette histoire ?",
        timestamp: "14:23",
        sender: "assistant",
      },
      {
        id: "6",
        message: "Le personnage principal est le petit chat gris.",
        timestamp: "14:23",
        sender: "child",
      },
    ],
  },
};

const ActivityDetailScreen = () => {
  const { activityId, childId } = useLocalSearchParams();
  const router = useRouter();
  const activityIdNumber = Number(activityId);
  const childIdNumber = Number(childId);

  // Get the activity details
  const activity = mockActivityDetails[activityIdNumber];

  if (!activity) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Activité non trouvée</Text>
      </View>
    );
  }

  // State for chat tab visibility
  const [showChat, setShowChat] = useState(false);

  // Navigate back
  const navigateBack = () => {
    router.back();
  };

  // Toggle chat view
  const toggleChatView = () => {
    setShowChat((prev) => !prev);
  };

  // Handle video press (mock function)
  const handleVideoPress = () => {
    console.log("Video pressed");
    // In a real app, this would navigate to a video player or open a modal
  };

  return (
    <SafeAreaView style={styles.container}>
      <ActivityHeader title={activity.activite} onBack={navigateBack} />

      {!showChat ? (
        <ScrollView
          style={styles.detailsContainer}
          showsVerticalScrollIndicator={false}
        >
          <ActivityDetails
            activity={activity}
            onChatPress={toggleChatView}
            onVideoPress={handleVideoPress}
          />
        </ScrollView>
      ) : (
        <View style={styles.chatContainer}>
          <ConversationView messages={activity.conversation || []} />
          <ChatInput
            placeholder="Ce chat est en lecture seule"
            disabled={true}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.error,
  },
  detailsContainer: {
    flex: 1,
    padding: 16,
  },
  chatContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
});

export default ActivityDetailScreen;
