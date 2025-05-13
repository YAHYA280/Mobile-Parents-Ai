// app/Enfants/Historique/Videodetails.tsx
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import {
  View,
  Text,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Share,
  StatusBar,
} from "react-native";

import { COLORS } from "../../../constants/theme";
import { useTheme } from "../../../theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";

// Define an interface for the video resource
interface VideoResource {
  id: number;
  title: string;
  subject: string;
  description: string;
  duration: string;
  videoUrl: string;
  tags: string[];
  difficulty: "Facile" | "Moyen" | "Difficile";
  relatedResources?: {
    id: number;
    title: string;
    type: "pdf" | "video" | "exercise";
    duration?: string;
  }[];
}

// Mock data (in a real app, this would come from a backend)
const VIDEO_RESOURCES: VideoResource[] = [
  {
    id: 1,
    title: "Introduction aux Fractions",
    subject: "Mathématiques",
    description:
      "Une explication claire et détaillée des fractions pour les débutants. Cette vidéo couvre les concepts fondamentaux pour comprendre les fractions, leur représentation visuelle et les opérations simples comme l'addition et la soustraction de fractions.",
    duration: "10:24",
    videoUrl: "", // Replace with actual video URL
    tags: [
      "Fractions",
      "Primaire",
      "Mathématiques de base",
      "Numérateur",
      "Dénominateur",
    ],
    difficulty: "Facile",
    relatedResources: [
      {
        id: 1,
        title: "Fiche de cours - Introduction aux fractions",
        type: "pdf",
      },
      {
        id: 2,
        title: "Exercices pratiques sur les fractions",
        type: "exercise",
      },
      {
        id: 3,
        title: "Addition et soustraction de fractions",
        type: "video",
        duration: "8:45",
      },
    ],
  },
  // Add more videos as needed
];

const VideoDetails = () => {
  const router = useRouter();
  const { dark, colors } = useTheme();
  const params = useLocalSearchParams();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // State for video playback and fullscreen
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Find the video resource based on the ID passed in params
  const resourceId = Number(params.resourceId || 1);
  const resource =
    VIDEO_RESOURCES.find((r) => r.id === resourceId) || VIDEO_RESOURCES[0];

  // Animation effect when component mounts
  useEffect(() => {
    // Simulate video loading
    const loadingTimer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(loadingTimer);
          setIsLoading(false);

          // Start animations once loaded
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

          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(loadingTimer);
  }, [fadeAnim, slideAnim]);

  // Simulate video playback
  useEffect(() => {
    let interval: number;

    if (isPlaying && !isLoading) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          // Parse duration to seconds
          const durationParts = resource.duration.split(":");
          const durationInSeconds =
            Number(durationParts[0]) * 60 + Number(durationParts[1]);

          if (prev >= durationInSeconds) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0; // Reset to beginning
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isLoading, resource.duration]);

  const handleBack = () => {
    router.back();
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Découvrez cette vidéo éducative: ${resource.title} - ${resource.description}`,
        title: resource.title,
      });
    } catch (error) {
      console.error("Erreur lors du partage:", error);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const durationParts = resource.duration.split(":");
    const durationInSeconds =
      Number(durationParts[0]) * 60 + Number(durationParts[1]);
    return (currentTime / durationInSeconds) * 100;
  };

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

  // Get icon for resource type
  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return "file-pdf";
      case "video":
        return "play-circle";
      case "exercise":
        return "book";
      default:
        return "file";
    }
  };

  const { width: screenWidth } = Dimensions.get("window");
  const videoHeight = isFullScreen ? screenWidth * (9 / 16) : 220;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: dark ? COLORS.dark1 : "#F8F8F8",
      }}
    >
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        backgroundColor={dark ? COLORS.dark1 : "#FFFFFF"}
      />

      {/* Header - Hidden in fullscreen mode */}
      {!isFullScreen && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            backgroundColor: dark ? COLORS.dark1 : "#FFFFFF",
            borderBottomWidth: 1,
            borderBottomColor: dark
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.05)",
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
              Vidéo Explicative
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
      )}

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
          paddingTop: isFullScreen ? 0 : 0,
        }}
      >
        {/* Video Player */}
        <View
          style={{
            backgroundColor: "#000000",
            height: videoHeight,
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {isLoading ? (
            // Loading overlay
            <View
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "rgba(0,0,0,0.8)",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
              }}
            >
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#FFFFFF", fontSize: 24 }}>
                  {loadingProgress}%
                </Text>
              </View>
              <Text
                style={{
                  color: "#FFFFFF",
                  marginTop: 16,
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                Chargement de la vidéo...
              </Text>
            </View>
          ) : (
            <>
              {/* Play/Pause Button Overlay */}
              {!isPlaying && (
                <TouchableOpacity
                  onPress={togglePlayback}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    elevation: 5,
                    zIndex: 5,
                  }}
                >
                  <FontAwesomeIcon icon="play" size={30} color="#FFFFFF" />
                </TouchableOpacity>
              )}

              {/* Video Controls */}
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 16,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  zIndex: 10,
                }}
              >
                {/* Progress Bar */}
                <View
                  style={{
                    height: 4,
                    backgroundColor: "rgba(255,255,255,0.3)",
                    borderRadius: 2,
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      height: "100%",
                      width: `${calculateProgress()}%`,
                      backgroundColor: COLORS.primary,
                      borderRadius: 2,
                    }}
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: "#FFFFFF", fontSize: 12 }}>
                    {formatTime(currentTime)} / {resource.duration}
                  </Text>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {/* Play/Pause Button */}
                    <TouchableOpacity
                      onPress={togglePlayback}
                      style={{ padding: 10 }}
                    >
                      <FontAwesomeIcon
                        icon={isPlaying ? "pause" : "play"}
                        size={20}
                        color="#FFFFFF"
                      />
                    </TouchableOpacity>

                    {/* Fullscreen Toggle */}
                    <TouchableOpacity
                      onPress={toggleFullScreen}
                      style={{ padding: 10, marginLeft: 8 }}
                    >
                      <FontAwesomeIcon
                        icon={isFullScreen ? "compress" : "expand"}
                        size={20}
                        color="#FFFFFF"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Content - Not visible in fullscreen mode */}
        {!isFullScreen && (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              padding: 16,
            }}
          >
            {/* Video Title and Details Card */}
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

            {/* Related Resources */}
            {resource.relatedResources &&
              resource.relatedResources.length > 0 && (
                <View
                  style={{
                    backgroundColor: dark ? COLORS.dark1 : COLORS.white,
                    borderRadius: 16,
                    padding: 20,
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
                      icon="link"
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
                      Ressources associées
                    </Text>
                  </View>

                  {resource.relatedResources.map((relatedResource, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: dark
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(0,0,0,0.02)",
                        borderRadius: 12,
                        padding: 14,
                        marginBottom:
                          index < resource.relatedResources!.length - 1
                            ? 12
                            : 0,
                      }}
                      onPress={() => {
                        // Handle resource navigation - example code
                        if (relatedResource.type === "pdf") {
                          router.push({
                            pathname: "/Enfants/Historique/fichedetails",
                            params: {
                              resourceId: relatedResource.id.toString(),
                            },
                          });
                        } else if (
                          relatedResource.type === "video" &&
                          relatedResource.id !== resource.id
                        ) {
                          router.push({
                            pathname: "/Enfants/Historique/Videodetails",
                            params: {
                              resourceId: relatedResource.id.toString(),
                            },
                          });
                        }
                      }}
                    >
                      <LinearGradient
                        colors={["#FF8E69", "#FF7862"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 14,
                        }}
                      >
                        <FontAwesomeIcon
                          icon={getResourceTypeIcon(relatedResource.type)}
                          size={18}
                          color="#FFFFFF"
                        />
                      </LinearGradient>

                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontWeight: "500",
                            fontSize: 15,
                            color: dark ? COLORS.white : COLORS.black,
                            marginBottom: 3,
                          }}
                        >
                          {relatedResource.title}
                        </Text>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text
                            style={{
                              fontSize: 13,
                              color: dark
                                ? COLORS.secondaryWhite
                                : COLORS.gray3,
                              textTransform: "capitalize",
                            }}
                          >
                            {relatedResource.type}
                          </Text>
                          {relatedResource.duration && (
                            <>
                              <View
                                style={{
                                  width: 3,
                                  height: 3,
                                  borderRadius: 1.5,
                                  backgroundColor: dark
                                    ? COLORS.secondaryWhite
                                    : COLORS.gray3,
                                  marginHorizontal: 6,
                                }}
                              />
                              <Text
                                style={{
                                  fontSize: 13,
                                  color: dark
                                    ? COLORS.secondaryWhite
                                    : COLORS.gray3,
                                }}
                              >
                                {relatedResource.duration}
                              </Text>
                            </>
                          )}
                        </View>
                      </View>

                      <FontAwesomeIcon
                        icon="chevron-right"
                        size={16}
                        color={dark ? COLORS.secondaryWhite : COLORS.gray3}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default VideoDetails;
