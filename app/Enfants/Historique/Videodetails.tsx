// app/Enfants/Historique/Videodetails.tsx - Refactored with Fixed Header
import React, { useRef, useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  Share,
  Animated,
  StatusBar,
  ScrollView,
  Dimensions,
  StyleSheet,
  SafeAreaView,
} from "react-native";

import type { VideoResource } from "@/types/video";

import Header from "../../../components/ui/Header";
// Import components
import {
  TagsCard,
  VideoPlayer,
  VideoInfoCard,
  RelatedResourcesCard,
} from "./components";

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

const VideoDetails: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // State for video playback and fullscreen
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Find the video resource based on the ID passed in params
  const resourceId = Number(params.resourceId || 1);
  const resource =
    VIDEO_RESOURCES.find((r) => r.id === resourceId) || VIDEO_RESOURCES[0];

  const onHeaderLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

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

  const handleResourcePress = (relatedResource: any) => {
    // Handle resource navigation
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
  };

  const { width: screenWidth } = Dimensions.get("window");
  const videoHeight = isFullScreen ? screenWidth * (9 / 16) : 220;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header - Hidden in fullscreen mode, fixed to top */}
      {!isFullScreen && (
        <View style={styles.headerContainer} onLayout={onHeaderLayout}>
          <Header
            title="Vidéo Explicative"
            subtitle={resource.subject}
            onBackPress={handleBack}
            rightIcon="share-outline"
            onRightIconPress={handleShare}
          />
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
          paddingTop: isFullScreen ? 0 : headerHeight, // Add padding equal to header height
        }}
      >
        {/* Video Player */}
        <VideoPlayer
          duration={resource.duration}
          currentTime={currentTime}
          isPlaying={isPlaying}
          isLoading={isLoading}
          loadingProgress={loadingProgress}
          isFullScreen={isFullScreen}
          videoHeight={videoHeight}
          togglePlayback={togglePlayback}
          toggleFullScreen={toggleFullScreen}
        />

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
            <VideoInfoCard resource={resource} />

            {/* Tags Card */}
            <TagsCard tags={resource.tags} />

            {/* Related Resources */}
            {resource.relatedResources &&
              resource.relatedResources.length > 0 && (
                <RelatedResourcesCard
                  resources={resource.relatedResources}
                  onResourcePress={handleResourcePress}
                />
              )}
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
});

export default VideoDetails;
