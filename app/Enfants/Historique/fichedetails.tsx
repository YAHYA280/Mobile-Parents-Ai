// app/Enfants/Historique/fichedetails.tsx
import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Share,
  Animated,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";

import { COLORS } from "../../../constants/theme";
import { useTheme } from "../../../theme/ThemeProvider";

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
  const { dark, colors } = useTheme();
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  // Find the resource based on the ID passed in params
  const resourceId = Number(params.resourceId || 1);
  const resource =
    PEDAGOGICAL_RESOURCES.find((r) => r.id === resourceId) ||
    PEDAGOGICAL_RESOURCES[0];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Start animations
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
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Helper function to get color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Facile":
        return "#24D26D";
      case "Moyen":
        return "#F3BB00";
      case "Difficile":
        return "#FC4E00";
      default:
        return "#24D26D";
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleDownloadPDF = async () => {
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
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Découvrez cette fiche pédagogique: ${resource.title} - ${resource.description}`,
        title: resource.title,
      });
    } catch (error) {
      console.error("Erreur lors du partage:", error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: dark ? COLORS.dark1 : "#F8F8F8" }}
      >
        <View
          style={{
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: dark ? COLORS.dark1 : "#FFFFFF",
            borderBottomWidth: 1,
            borderBottomColor: dark
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.05)",
          }}
        >
          <TouchableOpacity onPress={handleBack} style={{ marginRight: 16 }}>
            <FontAwesomeIcon
              icon="arrow-left"
              size={22}
              color={dark ? COLORS.white : COLORS.black}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: dark ? COLORS.white : COLORS.black,
            }}
          >
            Fiche Pédagogique
          </Text>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text
            style={{ marginTop: 16, color: dark ? COLORS.white : COLORS.black }}
          >
            Chargement de la fiche...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: dark ? COLORS.dark1 : "#F8F8F8" }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: dark
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.05)",
          backgroundColor: dark ? COLORS.dark1 : "#FFFFFF",
          elevation: 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }}
      >
        <TouchableOpacity
          onPress={handleBack}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: dark
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.05)",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
          }}
        >
          <FontAwesomeIcon
            icon="arrow-left"
            size={18}
            color={dark ? COLORS.white : COLORS.black}
          />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: dark ? COLORS.white : COLORS.black,
            }}
          >
            Fiche Pédagogique
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: dark ? COLORS.secondaryWhite : COLORS.gray3,
            }}
          >
            {resource.subject}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: dark
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.05)",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 8,
          }}
          onPress={handleShare}
        >
          <FontAwesomeIcon
            icon="share-alt"
            size={18}
            color={dark ? COLORS.white : COLORS.black}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Resource Title Card */}
          <View
            style={{
              backgroundColor: dark ? COLORS.dark1 : COLORS.white,
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: dark ? COLORS.white : COLORS.black,
                marginBottom: 16,
              }}
            >
              {resource.title}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  backgroundColor: dark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.05)",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  marginRight: 12,
                  marginBottom: 8,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon
                  icon="book"
                  size={14}
                  color={dark ? COLORS.secondaryWhite : COLORS.gray3}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{
                    color: dark ? COLORS.secondaryWhite : COLORS.gray3,
                    fontWeight: "500",
                    fontSize: 14,
                  }}
                >
                  {resource.subject}
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: `${getDifficultyColor(resource.difficulty)}20`,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  marginRight: 12,
                  marginBottom: 8,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: getDifficultyColor(resource.difficulty),
                    marginRight: 6,
                  }}
                />
                <Text
                  style={{
                    color: getDifficultyColor(resource.difficulty),
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  {resource.difficulty}
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: dark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.05)",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  marginBottom: 8,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon
                  icon="clock"
                  size={14}
                  color={dark ? COLORS.secondaryWhite : COLORS.gray3}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{
                    color: dark ? COLORS.secondaryWhite : COLORS.gray3,
                    fontWeight: "500",
                    fontSize: 14,
                  }}
                >
                  {resource.duration}
                </Text>
              </View>
            </View>

            <Text
              style={{
                fontSize: 15,
                lineHeight: 22,
                color: dark ? COLORS.secondaryWhite : COLORS.gray3,
              }}
            >
              {resource.description}
            </Text>
          </View>

          {/* Content Card */}
          <View
            style={{
              backgroundColor: dark ? COLORS.dark1 : COLORS.white,
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <FontAwesomeIcon
                icon="list-alt"
                size={18}
                color={COLORS.primary}
                style={{ marginRight: 10 }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: dark ? COLORS.white : COLORS.black,
                }}
              >
                Contenu
              </Text>
            </View>

            {resource.content.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginBottom: index < resource.content.length - 1 ? 16 : 0,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: COLORS.primary,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                    marginTop: 2,
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      fontWeight: "bold",
                      fontSize: 14,
                    }}
                  >
                    {index + 1}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: dark ? COLORS.white : COLORS.black,
                      fontSize: 16,
                      fontWeight: "500",
                      lineHeight: 24,
                    }}
                  >
                    {item}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Tags Card */}
          <View
            style={{
              backgroundColor: dark ? COLORS.dark1 : COLORS.white,
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <FontAwesomeIcon
                icon="tags"
                size={18}
                color={COLORS.primary}
                style={{ marginRight: 10 }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: dark ? COLORS.white : COLORS.black,
                }}
              >
                Mots-clés
              </Text>
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {resource.tags.map((tag, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: dark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.05)",
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    margin: 4,
                  }}
                >
                  <Text
                    style={{
                      color: dark ? COLORS.secondaryWhite : COLORS.gray3,
                      fontSize: 14,
                      fontWeight: "500",
                    }}
                  >
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Download PDF Button */}
          <TouchableOpacity
            onPress={handleDownloadPDF}
            disabled={isDownloading}
            style={{
              backgroundColor: COLORS.primary,
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 24,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            {isDownloading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <FontAwesomeIcon
                  icon="file-pdf"
                  size={20}
                  color={COLORS.white}
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Télécharger en PDF
                </Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FicheDetails;
