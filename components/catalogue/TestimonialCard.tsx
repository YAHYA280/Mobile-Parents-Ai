import React from "react";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, Image, StyleSheet } from "react-native";

import {
  RADIUS,
  COLOORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "@/constants/theme";

interface TestimonialCardProps {
  quote: string;
  author: string;
  authorRole?: string;
  authorImage?: any; // Source for the image
  rating?: number;
  delay?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  authorRole = "Parent",
  authorImage,
  rating = 5,
  delay = 800,
}) => {
  return (
    <MotiView
      style={styles.cardShadowContainer}
      from={{ opacity: 0, translateY: 30, scale: 0.95 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ delay, type: "spring", damping: 15 }}
    >
      <LinearGradient
        colors={["rgba(255,255,255,0.8)", "rgba(255,255,255,0.95)"]}
        style={styles.gradientBackground}
      >
        {/* Decorative Elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />

        {/* Header Section */}
        <View style={styles.header}>
          <LinearGradient
            colors={[COLOORS.primary.main, COLOORS.primary.dark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerBadge}
          >
            <Ionicons
              name="chatbubble-ellipses"
              size={16}
              color="#FFFFFF"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.headerBadgeText}>TÉMOIGNAGE</Text>
          </LinearGradient>
        </View>

        {/* Quote Section */}
        <View style={styles.quoteContainer}>
          {/* Left quotation mark */}
          <Text style={styles.quoteMarkLeft}>&quot;</Text>

          <Text style={styles.quote}>{quote}</Text>

          {/* Right quotation mark */}
          <Text style={styles.quoteMarkRight}>&quot;</Text>
        </View>

        {/* Rating Stars */}
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= rating ? "star" : "star-outline"}
              size={18}
              color="#FFB800"
              style={styles.starIcon}
            />
          ))}
        </View>

        {/* Author Section */}
        <View style={styles.authorSection}>
          <View style={styles.authorImageContainer}>
            {authorImage ? (
              <Image source={authorImage} style={styles.authorImage} />
            ) : (
              <View style={styles.authorImagePlaceholder}>
                <Text style={styles.authorInitial}>
                  {author.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{author}</Text>
            <Text style={styles.authorRole}>{authorRole}</Text>
          </View>
        </View>
      </LinearGradient>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  cardShadowContainer: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.lg,
    borderRadius: RADIUS.lg,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
    backgroundColor: "#FFFFFF", // Added for Android shadow
  },
  gradientBackground: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    overflow: "hidden",
    position: "relative",
  },
  decorativeCircle1: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: `${COLOORS.primary.main}06`,
    top: -50,
    right: -30,
  },
  decorativeCircle2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${COLOORS.primary.main}08`,
    bottom: -30,
    left: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: SPACING.lg,
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.xxl,
    ...SHADOWS.small,
  },
  headerBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "semibold",
    letterSpacing: 1,
  },
  quoteContainer: {
    position: "relative",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  quoteMarkLeft: {
    position: "absolute",
    left: 0,
    top: -10,
    fontSize: 60,
    fontFamily: "bold",
    color: `${COLOORS.primary.main}30`,
    lineHeight: 60,
  },
  quoteMarkRight: {
    position: "absolute",
    right: 0,
    bottom: -30,
    fontSize: 60,
    fontFamily: "bold",
    color: `${COLOORS.primary.main}30`,
    lineHeight: 60,
  },
  quote: {
    ...TYPOGRAPHY.body1,
    lineHeight: 26,
    textAlign: "center",
    fontStyle: "italic",
    color: COLOORS.black,
    paddingHorizontal: SPACING.md,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  starIcon: {
    marginHorizontal: 2,
  },
  authorSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: `${COLOORS.primary.main}15`,
  },
  authorImageContainer: {
    marginRight: SPACING.md,
  },
  authorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  authorImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLOORS.primary.main,
    justifyContent: "center",
    alignItems: "center",
  },
  authorInitial: {
    color: "#FFFFFF",
    fontSize: 22,
    fontFamily: "bold",
  },
  authorInfo: {
    justifyContent: "center",
  },
  authorName: {
    ...TYPOGRAPHY.subtitle1,
    color: COLOORS.black,
    marginBottom: 2,
  },
  authorRole: {
    ...TYPOGRAPHY.caption,
    color: COLOORS.gray3,
  },
});

export default TestimonialCard;
