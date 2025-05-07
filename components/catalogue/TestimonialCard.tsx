import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";
import {
  COLOORS,
  TYPOGRAPHY,
  RADIUS,
  SHADOWS,
  SPACING,
} from "@/constants/theme";

interface TestimonialCardProps {
  quote: string;
  author: string;
  rating?: number;
  delay?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  rating = 5,
  delay = 800,
}) => {
  const { dark } = useTheme();

  return (
    <MotiView
      style={[
        styles.container,
        {
          backgroundColor: dark ? COLOORS.surface.dark : COLOORS.surface.light,
        },
      ]}
      from={{ opacity: 0, translateY: 30 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay, type: "spring", damping: 15 }}
    >
      {/* ---------- header ---------- */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={22}
            color={COLOORS.primary.main}
          />
        </View>
        <Text
          style={[
            styles.title,
            { color: dark ? COLOORS.white : COLOORS.black },
          ]}
        >
          Ce que disent nos clients
        </Text>
      </View>

      {/* ---------- quote text ---------- */}
      <View style={styles.quoteContainer}>
        <Ionicons
          name="chatbubble-outline" /* << valid icon name */
          size={28}
          color={`${COLOORS.primary.main}40`}
          style={styles.quoteIcon}
        />

        <Text
          style={[
            styles.quote,
            { color: dark ? COLOORS.white : COLOORS.black },
          ]}
        >
          “{quote}”
        </Text>
      </View>

      {/* ---------- footer ---------- */}
      <View style={styles.footer}>
        <Text
          style={[
            styles.author,
            { color: dark ? COLOORS.white : COLOORS.black },
          ]}
        >
          {author}
        </Text>

        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= rating ? "star" : "star-outline"}
              size={16}
              color="#FFB800"
              style={styles.starIcon}
            />
          ))}
        </View>
      </View>
    </MotiView>
  );
};

/* ------------------------------------------------------------------ */
/* Styles                                                             */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${COLOORS.primary.main}10`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.h3,
  },
  quoteContainer: {
    position: "relative",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  quoteIcon: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  quote: {
    ...TYPOGRAPHY.body1,
    lineHeight: 22,
    fontStyle: "italic",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
  },
  author: {
    ...TYPOGRAPHY.subtitle2,
  },
  starsContainer: {
    flexDirection: "row",
  },
  starIcon: {
    marginLeft: 2,
  },
});

export default TestimonialCard;
