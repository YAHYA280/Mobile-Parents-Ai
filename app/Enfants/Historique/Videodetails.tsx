import React, { useState, useRef, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { LinearGradient } from "expo-linear-gradient";
import {
  faExpand,
  faCompress,
  faArrowLeft,
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeMute,
  faDownload,
  faShareAlt,
  faBookmark,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Animated,
  Image,
  Platform,
  Alert,
} from "react-native";
import { MotiView } from "moti";

import { COLORS } from "../../../constants/theme";
import { useTheme } from "../../../theme/ThemeProvider";

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
  thumbnailUrl?: string;
  viewCount?: number;
  likeCount?: number;
  publishDate?: string;
  transcript?: string;
  relatedVideos?: {
    id: number;
    title: string;
    thumbnailUrl?: string;
    duration: string;
  }[];
}

// Sample videos data
const VIDEO_RESOURCES: VideoResource[] = [
  {
    id: 1,
    title: "Introduction aux Fractions",
    subject: "Mathématiques",
    description:
      "Une explication claire et détaillée des fractions pour les débutants. Cette vidéo couvre les concepts de base des fractions, comment les représenter visuellement, et comment effectuer des opérations simples avec les fractions.",
    duration: "10:24",
    videoUrl: "https://example.com/videos/fractions-intro.mp4",
    tags: ["Fractions", "Primaire", "Mathématiques de base"],
    difficulty: "Facile",
    thumbnailUrl:
      "https://via.placeholder.com/800x450?text=Introduction+aux+Fractions",
    viewCount: 1245,
    likeCount: 87,
    publishDate: "2025-01-15",
    transcript:
      "Bonjour et bienvenue à cette introduction aux fractions. Aujourd'hui, nous allons découvrir ce que sont les fractions et comment elles fonctionnent. Une fraction représente une partie d'un tout. Par exemple, si nous prenons une pizza et la divisons en 4 parts égales, chaque part représente 1/4 de la pizza entière...",
    relatedVideos: [
      {
        id: 2,
        title: "Additionner des Fractions",
        thumbnailUrl:
          "https://via.placeholder.com/400x225?text=Additionner+des+Fractions",
        duration: "8:45",
      },
      {
        id: 3,
        title: "Fractions et Nombres Décimaux",
        thumbnailUrl:
          "https://via.placeholder.com/400x225?text=Fractions+et+Nombres+Decimaux",
        duration: "12:30",
      },
      {
        id: 4,
        title: "Multiplier des Fractions",
        thumbnailUrl:
          "https://via.placeholder.com/400x225?text=Multiplier+des+Fractions",
        duration: "9:15",
      },
    ],
  },
  {
    id: 2,
    title: "Additionner des Fractions",
    subject: "Mathématiques",
    description:
      "Apprenez à additionner des fractions avec le même dénominateur et avec des dénominateurs différents. Cette vidéo explique aussi comment simplifier les fractions après les opérations.",
    duration: "8:45",
    videoUrl: "https://example.com/videos/adding-fractions.mp4",
    tags: ["Fractions", "Addition", "Mathématiques"],
    difficulty: "Moyen",
    thumbnailUrl:
      "https://via.placeholder.com/800x450?text=Additionner+des+Fractions",
    viewCount: 980,
    likeCount: 65,
    publishDate: "2025-01-25",
    relatedVideos: [
      {
        id: 1,
        title: "Introduction aux Fractions",
        thumbnailUrl:
          "https://via.placeholder.com/400x225?text=Introduction+aux+Fractions",
        duration: "10:24",
      },
      {
        id: 3,
        title: "Fractions et Nombres Décimaux",
        thumbnailUrl:
          "https://via.placeholder.com/400x225?text=Fractions+et+Nombres+Decimaux",
        duration: "12:30",
      },
    ],
  },
];

// Difficulty color mapping
const DIFFICULTY_COLORS = {
  Facile: ["#4CAF50", "#2E7D32"], // Green
  Moyen: ["#FF9800", "#F57C00"], // Orange
  Difficile: ["#F44336", "#C62828"], // Red
};

// Subject color mapping
const getSubjectColors = (subject: string): [string, string] => {
  switch (subject.toLowerCase()) {
    case "mathématiques":
      return ["#2196F3", "#1565C0"]; // Blue
    case "français":
      return ["#4CAF50", "#2E7D32"]; // Green
    case "histoire":
    case "géographie":
    case "histoire-géographie":
      return ["#FF9800", "#F57C00"]; // Orange
    case "sciences":
      return ["#9C27B0", "#7B1FA2"]; // Purple
    case "anglais":
      return ["#F44336", "#C62828"]; // Red
    default:
      return ["#607D8B", "#455A64"]; // Blue Grey
  }
};

const EnhancedVideoDetails = () => {
  const router = useRouter();
  const { dark, colors } = useTheme();
  const params = useLocalSearchParams();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // States
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedSection, setSelectedSection] = useState<
    "description" | "transcript"
  >("description");
  const [showTags, setShowTags] = useState(true);

  // Find the video resource based on the ID passed in params
  const resourceId = Number(params.resourceId || 1);
  const resource =
    VIDEO_RESOURCES.find((r) => r.id === resourceId) || VIDEO_RESOURCES[0];

  // Screen dimensions
  const { width: screenWidth } = Dimensions.get("window");
  const videoHeight = isFullScreen
    ? Dimensions.get("window").height
    : screenWidth * (9 / 16);

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Toggle play/pause
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    showControlsTemporarily();
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    showControlsTemporarily();
  };

  // Show controls temporarily
  const showControlsTemporarily = () => {
    setShowControls(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Clear any existing timeout
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }

    // Set a new timeout to hide controls after 3 seconds
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setShowControls(false);
        });
      }
    }, 3000);
  };

  // Video tap handler to show/hide controls
  const handleVideoTap = () => {
    if (showControls) {
      if (isPlaying) {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setShowControls(false);
        });
      }
    } else {
      showControlsTemporarily();
    }
  };

  // Simulate video progress (for demo)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 0.001;
          if (newProgress >= 1) {
            setIsPlaying(false);
            setShowControls(true);
            return 1;
          }

          // Update current time display
          const totalSeconds =
            Math.floor(parseFloat(resource.duration.split(":")[0]) * 60) +
            parseInt(resource.duration.split(":")[1]);
          const currentSeconds = Math.floor(totalSeconds * newProgress);
          const minutes = Math.floor(currentSeconds / 60);
          const seconds = currentSeconds % 60;
          setCurrentTime(`${minutes}:${seconds.toString().padStart(2, "0")}`);

          return newProgress;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    };
  }, [isPlaying, resource.duration]);

  // Toggle bookmark
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    Alert.alert(
      !isBookmarked ? "Vidéo sauvegardée" : "Vidéo retirée des favoris",
      !isBookmarked
        ? "Vous pourrez retrouver cette vidéo dans vos favoris."
        : "Cette vidéo a été retirée de vos favoris."
    );
  };

  // Toggle like
  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  // Share video
  const handleShare = () => {
    Alert.alert(
      "Partager cette vidéo",
      "Un lien vers cette vidéo sera envoyé.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Partager",
          onPress: () =>
            console.log("Share pressed - would open native share dialog"),
        },
      ]
    );
  };

  // Download video
  const handleDownload = () => {
    Alert.alert(
      "Télécharger cette vidéo",
      "La vidéo sera disponible hors ligne.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Télécharger",
          onPress: () => console.log("Download pressed - would start download"),
        },
      ]
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
        isFullScreen && styles.fullScreenContainer,
      ]}
    >
      <StatusBar hidden={isFullScreen} />

      {!isFullScreen && (
        <View
          style={[
            styles.header,
            {
              borderBottomColor: dark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)",
            },
          ]}
        >
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <FontAwesomeIcon
              icon={faArrowLeft}
              size={24}
              color={dark ? COLORS.white : COLORS.black}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Vidéo Explicative
          </Text>
        </View>
      )}

      {/* Video Player */}
      <View style={[styles.videoContainer, { height: videoHeight }]}>
        {/* Video Thumbnail/Player */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleVideoTap}
          style={styles.videoPlayer}
        >
          <Image
            source={{ uri: resource.thumbnailUrl }}
            style={styles.videoThumbnail}
            resizeMode="cover"
          />

          {/* Overlay for darker appearance */}
          <View
            style={[styles.videoOverlay, { opacity: isPlaying ? 0.3 : 0.5 }]}
          />

          {/* Video Controls */}
          <Animated.View
            style={[styles.videoControls, { opacity: fadeAnim }]}
            pointerEvents={showControls ? "auto" : "none"}
          >
            {/* Top Controls */}
            <View style={styles.topControls}>
              {isFullScreen && (
                <TouchableOpacity
                  onPress={handleBack}
                  style={styles.controlButton}
                >
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    size={20}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              )}
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                onPress={toggleFullScreen}
                style={styles.controlButton}
              >
                <FontAwesomeIcon
                  icon={isFullScreen ? faCompress : faExpand}
                  size={20}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>

            {/* Center Play Button */}
            <TouchableOpacity
              onPress={togglePlayback}
              style={styles.centerPlayButton}
            >
              <FontAwesomeIcon
                icon={isPlaying ? faPause : faPlay}
                size={32}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
              <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${progress * 100}%` },
                    ]}
                  />
                </View>
                <View style={styles.timeDisplay}>
                  <Text style={styles.timeText}>{currentTime}</Text>
                  <Text style={styles.timeText}>{resource.duration}</Text>
                </View>
              </View>

              <View style={styles.controlButtons}>
                <TouchableOpacity
                  onPress={toggleMute}
                  style={styles.controlButton}
                >
                  <FontAwesomeIcon
                    icon={isMuted ? faVolumeMute : faVolumeUp}
                    size={18}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>

                <View style={{ flex: 1 }} />

                <TouchableOpacity
                  onPress={toggleLike}
                  style={styles.controlButton}
                >
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    size={18}
                    color={isLiked ? COLORS.primary : "#FFFFFF"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleShare}
                  style={styles.controlButton}
                >
                  <FontAwesomeIcon
                    icon={faShareAlt}
                    size={18}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={toggleBookmark}
                  style={styles.controlButton}
                >
                  <FontAwesomeIcon
                    icon={faBookmark}
                    size={18}
                    color={isBookmarked ? COLORS.primary : "#FFFFFF"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDownload}
                  style={styles.controlButton}
                >
                  <FontAwesomeIcon
                    icon={faDownload}
                    size={18}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {!isFullScreen && (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Video Details */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "spring", damping: 18 }}
            style={[
              styles.detailsCard,
              { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
            ]}
          >
            <Text
              style={[
                styles.videoTitle,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {resource.title}
            </Text>

            <View style={styles.metadataRow}>
              <View style={styles.metadataItem}>
                <Text
                  style={[
                    styles.subjectText,
                    { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                  ]}
                >
                  {resource.subject}
                </Text>
              </View>

              <LinearGradient
                colors={DIFFICULTY_COLORS[resource.difficulty]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.difficultyBadge}
              >
                <Text style={styles.difficultyText}>
                  Niveau: {resource.difficulty}
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.statsRow}>
              <Text
                style={[
                  styles.durationText,
                  { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                ]}
              >
                Durée: {resource.duration}
              </Text>

              {resource.viewCount && (
                <Text
                  style={[
                    styles.viewsText,
                    { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                  ]}
                >
                  {resource.viewCount.toLocaleString()} vues
                </Text>
              )}

              {resource.publishDate && (
                <Text
                  style={[
                    styles.dateText,
                    { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                  ]}
                >
                  Publié le {formatDate(resource.publishDate)}
                </Text>
              )}
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  isLiked && styles.actionButtonActive,
                ]}
                onPress={toggleLike}
              >
                <FontAwesomeIcon
                  icon={faThumbsUp}
                  size={18}
                  color={isLiked ? "#FFFFFF" : COLORS.primary}
                  style={styles.actionIcon}
                />
                <Text
                  style={[
                    styles.actionText,
                    isLiked
                      ? styles.actionTextActive
                      : { color: COLORS.primary },
                  ]}
                >
                  J'aime {resource.likeCount && `(${resource.likeCount})`}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  isBookmarked && styles.actionButtonActive,
                ]}
                onPress={toggleBookmark}
              >
                <FontAwesomeIcon
                  icon={faBookmark}
                  size={18}
                  color={isBookmarked ? "#FFFFFF" : COLORS.primary}
                  style={styles.actionIcon}
                />
                <Text
                  style={[
                    styles.actionText,
                    isBookmarked
                      ? styles.actionTextActive
                      : { color: COLORS.primary },
                  ]}
                >
                  Sauvegarder
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}
              >
                <FontAwesomeIcon
                  icon={faShareAlt}
                  size={18}
                  color={COLORS.primary}
                  style={styles.actionIcon}
                />
                <Text style={[styles.actionText, { color: COLORS.primary }]}>
                  Partager
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tags */}
            {showTags && (
              <View style={styles.tagsContainer}>
                {resource.tags.map((tag, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tagBadge,
                      {
                        backgroundColor: dark
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.05)",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                      ]}
                    >
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </MotiView>

          {/* Content Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedSection === "description" && styles.activeTabButton,
              ]}
              onPress={() => setSelectedSection("description")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedSection === "description"
                    ? { color: COLORS.primary, fontWeight: "bold" }
                    : { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                ]}
              >
                Description
              </Text>
              {selectedSection === "description" && (
                <View style={styles.tabIndicator} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedSection === "transcript" && styles.activeTabButton,
              ]}
              onPress={() => setSelectedSection("transcript")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedSection === "transcript"
                    ? { color: COLORS.primary, fontWeight: "bold" }
                    : { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                ]}
              >
                Transcription
              </Text>
              {selectedSection === "transcript" && (
                <View style={styles.tabIndicator} />
              )}
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <MotiView
            key={selectedSection}
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "timing", duration: 300 }}
            style={[
              styles.tabContentCard,
              { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
            ]}
          >
            {selectedSection === "description" ? (
              <Text
                style={[
                  styles.descriptionText,
                  { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                ]}
              >
                {resource.description}
              </Text>
            ) : (
              <Text
                style={[
                  styles.transcriptText,
                  { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
                ]}
              >
                {resource.transcript ||
                  "La transcription n'est pas disponible pour cette vidéo."}
              </Text>
            )}
          </MotiView>

          {/* Related Videos */}
          {resource.relatedVideos && resource.relatedVideos.length > 0 && (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "spring", damping: 18, delay: 300 }}
              style={styles.relatedVideosSection}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Vidéos associées
              </Text>

              <View style={styles.relatedVideosGrid}>
                {resource.relatedVideos.map((video, index) => (
                  <TouchableOpacity
                    key={video.id}
                    style={[
                      styles.relatedVideoCard,
                      { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
                    ]}
                    onPress={() => {
                      // Navigate to the selected video
                      router.push({
                        pathname: "/Enfants/Historique/Videodetails",
                        params: { resourceId: video.id.toString() },
                      });
                    }}
                  >
                    <View style={styles.relatedThumbnailContainer}>
                      <Image
                        source={{ uri: video.thumbnailUrl }}
                        style={styles.relatedThumbnail}
                        resizeMode="cover"
                      />
                      <View style={styles.durationBadge}>
                        <Text style={styles.durationBadgeText}>
                          {video.duration}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.relatedVideoTitle,
                        { color: dark ? COLORS.white : COLORS.black },
                      ]}
                      numberOfLines={2}
                    >
                      {video.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </MotiView>
          )}

          <View style={styles.bottomPadding} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreenContainer: {
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  videoContainer: {
    width: "100%",
    backgroundColor: "#000",
  },
  videoPlayer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  videoThumbnail: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  videoControls: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: "space-between",
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  centerPlayButton: {
    alignSelf: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomControls: {
    width: "100%",
  },
  progressContainer: {
    width: "100%",
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  timeDisplay: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  timeText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  controlButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  controlButton: {
    padding: 8,
    marginHorizontal: 4,
  },
  content: {
    flex: 1,
  },
  detailsCard: {
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  metadataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  subjectText: {
    fontSize: 14,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  difficultyText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  durationText: {
    fontSize: 13,
    marginRight: 16,
  },
  viewsText: {
    fontSize: 13,
    marginRight: 16,
  },
  dateText: {
    fontSize: 13,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonActive: {
    backgroundColor: COLORS.primary,
  },
  actionIcon: {
    marginRight: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "500",
  },
  actionTextActive: {
    color: "#FFFFFF",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  tagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
  },
  tagText: {
    fontSize: 12,
  },
  tabsContainer: {
    flexDirection: "row",
    marginTop: 24,
    marginHorizontal: 16,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    position: "relative",
  },
  activeTabButton: {
    // Style controlled by indicator
  },
  tabText: {
    fontSize: 15,
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    width: "60%",
    height: 3,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  tabContentCard: {
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 100,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  transcriptText: {
    fontSize: 15,
    lineHeight: 22,
  },
  relatedVideosSection: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  relatedVideosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  relatedVideoCard: {
    width: "48%",
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  relatedThumbnailContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 16 / 9,
  },
  relatedThumbnail: {
    width: "100%",
    height: "100%",
  },
  durationBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  relatedVideoTitle: {
    fontSize: 14,
    fontWeight: "500",
    padding: 8,
    height: 60,
  },
  bottomPadding: {
    height: 30,
  },
});

export default EnhancedVideoDetails;
