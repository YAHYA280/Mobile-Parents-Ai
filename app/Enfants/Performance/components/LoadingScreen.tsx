// app/Enfants/Performance/components/LoadingScreen.tsx
import React, { useRef, useEffect } from "react";
import { View, Text, Easing, Animated, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBook,
  faClock,
  faTrophy,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

import { COLORS } from "../../../../constants/theme";

const LoadingScreen: React.FC = () => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim1 = useRef(new Animated.Value(20)).current;
  const slideAnim2 = useRef(new Animated.Value(20)).current;
  const slideAnim3 = useRef(new Animated.Value(20)).current;
  const slideAnim4 = useRef(new Animated.Value(20)).current;
  const loadingAnim = useRef(new Animated.Value(0)).current;

  // Animation sequence
  useEffect(() => {
    // Pulse animation for the skeleton items
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Sequence for sliding in each card
    Animated.stagger(150, [
      Animated.spring(slideAnim1, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim2, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim3, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim4, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Loading progress animation
    Animated.timing(loadingAnim, {
      toValue: 1,
      duration: 2500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [fadeAnim, slideAnim1, slideAnim2, slideAnim3, slideAnim4, loadingAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.headerSkeleton}>
        <View style={styles.backButtonSkeleton} />
        <View style={styles.headerTextSkeleton}>
          <View style={styles.titleSkeleton} />
          <View style={styles.subtitleSkeleton} />
        </View>
      </View>

      {/* Global Performance Card */}
      <Animated.View
        style={[
          styles.cardSkeleton,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim1 }],
          },
        ]}
      >
        <View style={styles.cardHeaderSkeleton}>
          <View style={styles.cardTitleSkeleton} />
          <View style={styles.iconSkeleton}>
            <FontAwesomeIcon icon={faTrophy} size={16} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.circleProgressSkeleton}>
          <View style={styles.innerCircleSkeleton} />
          <Animated.View
            style={[
              styles.progressOverlay,
              {
                width: loadingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "75%"],
                }),
              },
            ]}
          />
        </View>

        <View style={styles.buttonsSkeleton}>
          <View style={styles.buttonSkeleton} />
          <View style={[styles.buttonSkeleton, { width: "30%" }]} />
        </View>
      </Animated.View>

      {/* Subject Performance Card */}
      <Animated.View
        style={[
          styles.cardSkeleton,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim2 }],
          },
        ]}
      >
        <View style={styles.cardHeaderSkeleton}>
          <View style={styles.cardTitleSkeleton} />
          <View
            style={[
              styles.iconSkeleton,
              { backgroundColor: "rgba(36, 210, 109, 0.3)" },
            ]}
          >
            <FontAwesomeIcon icon={faChartLine} size={16} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.subjectSkeleton}>
          <View style={styles.subjectLineSkeleton}>
            <View style={styles.subjectNameSkeleton} />
            <View style={styles.subjectScoreSkeleton} />
          </View>
          <View style={styles.progressBarSkeleton}>
            <Animated.View
              style={[
                styles.progressBarFillSkeleton,
                {
                  width: loadingAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "85%"],
                  }),
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.subjectSkeleton}>
          <View style={styles.subjectLineSkeleton}>
            <View style={[styles.subjectNameSkeleton, { width: "40%" }]} />
            <View style={styles.subjectScoreSkeleton} />
          </View>
          <View style={styles.progressBarSkeleton}>
            <Animated.View
              style={[
                styles.progressBarFillSkeleton,
                {
                  width: loadingAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "60%"],
                  }),
                  backgroundColor: "#F3BB00",
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.subjectSkeleton}>
          <View style={styles.subjectLineSkeleton}>
            <View style={[styles.subjectNameSkeleton, { width: "35%" }]} />
            <View style={styles.subjectScoreSkeleton} />
          </View>
          <View style={styles.progressBarSkeleton}>
            <Animated.View
              style={[
                styles.progressBarFillSkeleton,
                {
                  width: loadingAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "70%"],
                  }),
                  backgroundColor: "#2196F3",
                },
              ]}
            />
          </View>
        </View>
      </Animated.View>

      {/* Skills Card */}
      <Animated.View
        style={[
          styles.cardSkeleton,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim3 }],
          },
        ]}
      >
        <View style={styles.cardHeaderSkeleton}>
          <View style={styles.cardTitleSkeleton} />
          <View
            style={[
              styles.iconSkeleton,
              { backgroundColor: "rgba(156, 39, 176, 0.3)" },
            ]}
          >
            <FontAwesomeIcon icon={faBook} size={16} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.skillChartSkeleton}>
          <View style={styles.skillCircleSkeleton} />
          <View style={styles.skillLegendSkeleton}>
            <View style={styles.skillItemSkeleton} />
            <View style={styles.skillItemSkeleton} />
            <View style={styles.skillItemSkeleton} />
          </View>
        </View>
      </Animated.View>

      {/* Time Card */}
      <Animated.View
        style={[
          styles.cardSkeleton,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim4 }],
            marginBottom: 30,
          },
        ]}
      >
        <View style={styles.cardHeaderSkeleton}>
          <View style={styles.cardTitleSkeleton} />
          <View
            style={[
              styles.iconSkeleton,
              { backgroundColor: "rgba(255, 152, 0, 0.3)" },
            ]}
          >
            <FontAwesomeIcon icon={faClock} size={16} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.timeChartSkeleton}>
          <View style={styles.donutChartSkeleton} />
          <View style={styles.timeStatsSkeleton}>
            <View style={styles.timeStatItemSkeleton} />
            <View style={styles.timeStatItemSkeleton} />
            <View style={styles.timeStatItemSkeleton} />
          </View>
        </View>
      </Animated.View>

      {/* Loading text at bottom */}
      <View style={styles.loadingTextContainer}>
        <Text style={styles.loadingText}>Chargement des données...</Text>

        <View style={styles.loadingBarContainer}>
          <Animated.View
            style={[
              styles.loadingBar,
              {
                width: loadingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["5%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 16,
  },
  headerSkeleton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: 16,
  },
  backButtonSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginRight: 16,
  },
  headerTextSkeleton: {
    flex: 1,
  },
  titleSkeleton: {
    height: 20,
    width: "50%",
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginBottom: 8,
  },
  subtitleSkeleton: {
    height: 14,
    width: "30%",
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  cardSkeleton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeaderSkeleton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitleSkeleton: {
    height: 18,
    width: "40%",
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  iconSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 142, 105, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  circleProgressSkeleton: {
    alignSelf: "center",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    position: "relative",
    overflow: "hidden",
  },
  innerCircleSkeleton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    zIndex: 1,
  },
  progressOverlay: {
    position: "absolute",
    height: "100%",
    backgroundColor: "rgba(255, 142, 105, 0.3)",
    left: 0,
    top: 0,
  },
  buttonsSkeleton: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonSkeleton: {
    height: 40,
    width: "65%",
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  subjectSkeleton: {
    marginBottom: 16,
  },
  subjectLineSkeleton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  subjectNameSkeleton: {
    height: 16,
    width: "30%",
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  subjectScoreSkeleton: {
    height: 16,
    width: 40,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  progressBarSkeleton: {
    height: 10,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFillSkeleton: {
    height: "100%",
    backgroundColor: "#24D26D",
    borderRadius: 5,
  },
  skillChartSkeleton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  skillCircleSkeleton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(156, 39, 176, 0.1)",
  },
  skillLegendSkeleton: {
    flex: 1,
    marginLeft: 16,
  },
  skillItemSkeleton: {
    height: 20,
    width: "100%",
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginBottom: 12,
  },
  timeChartSkeleton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  donutChartSkeleton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 152, 0, 0.1)",
    borderWidth: 16,
    borderColor: "rgba(255, 152, 0, 0.3)",
  },
  timeStatsSkeleton: {
    flex: 1,
    marginLeft: 16,
  },
  timeStatItemSkeleton: {
    height: 20,
    width: "100%",
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginBottom: 12,
  },
  loadingTextContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  loadingText: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 12,
  },
  loadingBarContainer: {
    width: "80%",
    height: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    overflow: "hidden",
  },
  loadingBar: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
});

export default LoadingScreen;
