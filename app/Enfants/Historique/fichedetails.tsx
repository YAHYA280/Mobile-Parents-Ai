import { useRouter, useLocalSearchParams } from "expo-router";
// app/Enfants/Historique/fichedetails.tsx - Refactored
import React, { useState, useEffect, useCallback } from "react";
import {
  Share,
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";

import {
  TagsCard,
  FicheHeader,
  ContentCard,
  LoadingScreen,
  DownloadButton,
  ResourceTitleCard,
} from "@/app/Enfants/Historique/components/FicheDetails";

// Define an interface for the pedagogical resource
interface PedagogicalResource {
  id: number;
  title: string;
  subject: string;
  description: string;
  content: string[];
  tags: string[];
  difficulty: "Facile" | "Moyen" | "Difficile";
  duration: string;
}

// Mock data (in a real app, this would come from a backend)
const PEDAGOGICAL_RESOURCES: PedagogicalResource[] = [
  {
    id: 1,
    title: "Introduction aux Fractions",
    subject: "Mathématiques",
    description:
      "Comprendre les bases des fractions et leurs applications dans la vie quotidienne. Cette fiche pédagogique couvre les concepts fondamentaux des fractions, leur représentation et les opérations de base pour les élèves du primaire et du début du collège.",
    content: [
      "Définition d'une fraction",
      "Représentation graphique des fractions",
      "Comparaison de fractions",
      "Opérations de base avec les fractions",
      "Résolution de problèmes utilisant des fractions",
      "Applications dans la vie quotidienne",
    ],
    tags: [
      "Fractions",
      "Primaire",
      "Mathématiques de base",
      "Numérateur",
      "Dénominateur",
    ],
    difficulty: "Facile",
    duration: "30 minutes",
  },
  // Add more resources as needed
];

const FicheDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // Find the resource based on the ID passed in params
  const resourceId = Number(params.resourceId || 1);
  const resource =
    PEDAGOGICAL_RESOURCES.find((r) => r.id === resourceId) ||
    PEDAGOGICAL_RESOURCES[0];

  // Create animated values with useCallback to ensure stable references
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  const startAnimations = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      startAnimations();
    }, 800);

    return () => clearTimeout(timer);
  }, [startAnimations]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleDownloadPDF = useCallback(async () => {
    setIsDownloading(true);

    // Simulate download delay
    setTimeout(() => {
      setIsDownloading(false);

      // Show success message
      Alert.alert(
        "Téléchargement terminé",
        `Le PDF "${resource.title}" a été téléchargé avec succès`,
        [{ text: "OK" }]
      );
    }, 1500);
  }, [resource.title]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Découvrez cette fiche pédagogique: ${resource.title} - ${resource.description}`,
        title: resource.title,
      });
    } catch (error) {
      console.error("Erreur lors du partage:", error);
    }
  }, [resource.title, resource.description]);

  if (isLoading) {
    return <LoadingScreen onBack={handleBack} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FicheHeader
        title="Fiche Pédagogique"
        subject={resource.subject}
        onBack={handleBack}
        onShare={handleShare}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ResourceTitleCard
            title={resource.title}
            subject={resource.subject}
            difficulty={resource.difficulty}
            duration={resource.duration}
            description={resource.description}
          />

          <ContentCard content={resource.content} />

          <TagsCard tags={resource.tags} />

          <DownloadButton
            onPress={handleDownloadPDF}
            isDownloading={isDownloading}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  animatedContainer: {
    flex: 1,
  },
});

export default FicheDetails;
