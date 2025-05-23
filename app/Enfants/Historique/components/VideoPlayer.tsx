import type { IconProp } from "@fortawesome/fontawesome-svg-core";

// Videodetails components/VideoPlayer.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { COLORS } from "../../../../constants/theme";

interface VideoPlayerProps {
  duration: string;
  currentTime: number;
  isPlaying: boolean;
  isLoading: boolean;
  loadingProgress: number;
  isFullScreen: boolean;
  videoHeight: number;
  togglePlayback: () => void;
  toggleFullScreen: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  duration,
  currentTime,
  isPlaying,
  isLoading,
  loadingProgress,
  isFullScreen,
  videoHeight,
  togglePlayback,
  toggleFullScreen,
}) => {
  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const durationParts = duration.split(":");
    const durationInSeconds =
      Number(durationParts[0]) * 60 + Number(durationParts[1]);
    return (currentTime / durationInSeconds) * 100;
  };

  return (
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
              <FontAwesomeIcon
                icon={"play" as IconProp}
                size={30}
                color="#FFFFFF"
              />
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
                {formatTime(currentTime)} / {duration}
              </Text>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* Play/Pause Button */}
                <TouchableOpacity
                  onPress={togglePlayback}
                  style={{ padding: 10 }}
                >
                  <FontAwesomeIcon
                    icon={(isPlaying ? "pause" : "play") as IconProp}
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
                    icon={(isFullScreen ? "compress" : "expand") as IconProp}
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
  );
};

export default VideoPlayer;
