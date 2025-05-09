// app/Enfants/Historique/[activityId]/video.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { CHILDREN_DATA } from "@/data/Enfants/CHILDREN_DATA";

// Mock video resources
const VIDEO_RESOURCES = [
  {
    id: 1,
    title: "Introduction aux Fractions",
    subject: "Mathématiques",
    description:
      "Une explication claire et détaillée des fractions pour les débutants.",
    duration: "10:24",
    tags: ["Fractions", "Primaire", "Mathématiques de base"],
    difficulty: "Facile",
  },
  {
    id: 2,
    title: "Avancé: Problèmes avec Fractions",
    subject: "Mathématiques",
    description:
      "Techniques pour résoudre des problèmes complexes impliquant des fractions.",
    duration: "15:30",
    tags: ["Fractions", "Problèmes", "Collège"],
    difficulty: "Moyen",
  },
  {
    id: 3,
    title: "Les Fractions dans la Vie Quotidienne",
    subject: "Mathématiques",
    description:
      "Applications pratiques des fractions dans des situations réelles.",
    duration: "8:45",
    tags: ["Fractions", "Vie quotidienne", "Applications"],
    difficulty: "Facile",
  },
];

const { width } = Dimensions.get("window");

export default function VideoResourcesScreen() {
  const router = useRouter();
  const { activityId, childId } = useLocalSearchParams();
  const activityIdNum = Number(activityId);
  const childIdNum = Number(childId);

  const [child, setChild] = useState<any>(null);
  const [activity, setActivity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<any>(VIDEO_RESOURCES[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      try {
        setIsLoading(true);

        // Find child
        const foundChild = CHILDREN_DATA.find((c) => c.id === childIdNum);
        if (!foundChild) {
          console.error("Child not found");
          router.back();
          return;
        }

        // Find activity
        const foundActivity = foundChild.activitesRecentes.find(
          (a: any) => a.id === activityIdNum
        );

        if (!foundActivity) {
          console.error("Activity not found");
          router.back();
          return;
        }

        setChild(foundChild);
        setActivity(foundActivity);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activityIdNum, childIdNum]);

  const handleBack = () => {
    router.back();
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const selectVideo = (video: any) => {
    setSelectedVideo(video);
    setIsPlaying(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Facile":
        return "#4CAF50";
      case "Moyen":
        return "#FF9800";
      case "Difficile":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement des ressources...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!activity || !child) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#FF3B30" />
          <Text style={styles.errorText}>Ressources non trouvées</Text>
          <TouchableOpacity style={styles.errorButton} onPress={handleBack}>
            <Text style={styles.errorButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ressources vidéo</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Video Player */}
        <View style={styles.videoContainer}>
          <View style={styles.videoPlayer}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={togglePlayPause}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={40}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          {/* Controls */}
          <View style={styles.videoControls}>
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="play-skip-back" size={24} color="#333333" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.playPauseButton}
              onPress={togglePlayPause}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={32}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="play-skip-forward" size={24} color="#333333" />
            </TouchableOpacity>
          </View>

          {/* Video Info */}
          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle}>{selectedVideo.title}</Text>

            <View style={styles.videoMetadata}>
              <Text style={styles.subjectText}>{selectedVideo.subject}</Text>
              <View
                style={[
                  styles.difficultyBadge,
                  {
                    backgroundColor:
                      getDifficultyColor(selectedVideo.difficulty) + "20",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    { color: getDifficultyColor(selectedVideo.difficulty) },
                  ]}
                >
                  {selectedVideo.difficulty}
                </Text>
              </View>
            </View>

            <Text style={styles.durationText}>
              Durée: {selectedVideo.duration}
            </Text>

            <Text style={styles.videoDescription}>
              {selectedVideo.description}
            </Text>

            <View style={styles.tagsContainer}>
              {selectedVideo.tags.map((tag: string, index: number) => (
                <View key={index} style={styles.tagBadge}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Related Videos */}
        <View style={styles.relatedVideosContainer}>
          <Text style={styles.relatedVideosTitle}>Vidéos connexes</Text>

          {VIDEO_RESOURCES.filter((v) => v.id !== selectedVideo.id).map(
            (video) => (
              <TouchableOpacity
                key={video.id}
                style={styles.relatedVideoItem}
                onPress={() => selectVideo(video)}
              >
                <View style={styles.relatedVideoThumbnail}>
                  <Ionicons name="play-circle" size={32} color="#FFFFFF" />
                </View>

                <View style={styles.relatedVideoInfo}>
                  <Text style={styles.relatedVideoTitle}>{video.title}</Text>
                  <View style={styles.relatedVideoMetadata}>
                    <Text style={styles.relatedVideoDuration}>
                      {video.duration}
                    </Text>
                    <Text style={styles.relatedVideoDifficulty}>
                      {video.difficulty}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#333333",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: "#333333",
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  videoContainer: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  videoPlayer: {
    width: "100%",
    height: width * (9 / 16), // 16:9 ratio
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  videoControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#F8F8F8",
  },
  controlButton: {
    padding: 8,
  },
  playPauseButton: {
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 24,
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  videoMetadata: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  subjectText: {
    fontSize: 14,
    color: "#757575",
    marginRight: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  durationText: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 12,
  },
  videoDescription: {
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagBadge: {
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: "#757575",
  },
  relatedVideosContainer: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  relatedVideosTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
  },
  relatedVideoItem: {
    flexDirection: "row",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    paddingBottom: 16,
  },
  relatedVideoThumbnail: {
    width: 120,
    height: 80,
    backgroundColor: "#000000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  relatedVideoInfo: {
    flex: 1,
    justifyContent: "center",
  },
  relatedVideoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  relatedVideoMetadata: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  relatedVideoDuration: {
    fontSize: 12,
    color: "#757575",
  },
  relatedVideoDifficulty: {
    fontSize: 12,
    color: "#757575",
  },
});
