import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, TYPOGRAPHY } from "@/constants/theme";
import { useTheme } from "@/theme/ThemeProvider";
import Card from "@/components/ui/Card";

interface ActivitySummaryProps {
  activityCount: number;
  totalDuration: string;
  lastActivityDate: string | Date;
  favoriteSubject?: string;
}

const ActivitySummary: React.FC<ActivitySummaryProps> = ({
  activityCount,
  totalDuration,
  lastActivityDate,
  favoriteSubject,
}) => {
  const { dark } = useTheme();

  // Format date
  const formatDate = (date: string | Date) => {
    if (typeof date === "string") {
      date = new Date(date);
    }
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Card>
      <Text
        style={[styles.title, { color: dark ? COLORS.white : COLORS.black }]}
      >
        Résumé des activités
      </Text>

      <View style={styles.summaryStat}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: dark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
            },
          ]}
        >
          <Ionicons name="calendar-outline" size={24} color={COLORS.primary} />
        </View>
        <View style={styles.statContent}>
          <Text
            style={[
              styles.statLabel,
              { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
            ]}
          >
            Nombre d'activités
          </Text>
          <Text
            style={[
              styles.statValue,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            {activityCount}
          </Text>
        </View>
      </View>

      <View style={styles.summaryStat}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: dark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
            },
          ]}
        >
          <Ionicons name="time-outline" size={24} color={COLORS.primary} />
        </View>
        <View style={styles.statContent}>
          <Text
            style={[
              styles.statLabel,
              { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
            ]}
          >
            Temps total
          </Text>
          <Text
            style={[
              styles.statValue,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            {totalDuration}
          </Text>
        </View>
      </View>

      <View style={styles.summaryStat}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: dark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
            },
          ]}
        >
          <Ionicons name="stopwatch-outline" size={24} color={COLORS.primary} />
        </View>
        <View style={styles.statContent}>
          <Text
            style={[
              styles.statLabel,
              { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
            ]}
          >
            Dernière activité
          </Text>
          <Text
            style={[
              styles.statValue,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            {formatDate(lastActivityDate)}
          </Text>
        </View>
      </View>

      {favoriteSubject && (
        <View style={styles.summaryStat}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: dark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
          >
            <Ionicons name="star-outline" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.statContent}>
            <Text
              style={[
                styles.statLabel,
                { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
              ]}
            >
              Matière préférée
            </Text>
            <Text
              style={[
                styles.statValue,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {favoriteSubject}
            </Text>
          </View>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    ...TYPOGRAPHY.h3,
    fontWeight: "bold",
    marginBottom: 16,
  },
  summaryStat: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    marginBottom: 4,
  },
  statValue: {
    ...TYPOGRAPHY.h3,
  },
});

export default ActivitySummary;
