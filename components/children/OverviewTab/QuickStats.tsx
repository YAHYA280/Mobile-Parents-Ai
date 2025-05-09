import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, TYPOGRAPHY } from "@/constants/theme";
import { useTheme } from "@/theme/ThemeProvider";
import Card from "@/components/ui/Card";

interface StatItem {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}

interface QuickStatsProps {
  stats: StatItem[];
}

const QuickStats: React.FC<QuickStatsProps> = ({ stats }) => {
  const { dark } = useTheme();

  return (
    <Card>
      <Text
        style={[styles.title, { color: dark ? COLORS.white : COLORS.black }]}
      >
        Statistiques rapides
      </Text>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: stat.color || COLORS.primary },
              ]}
            >
              <Ionicons name={stat.icon as any} size={24} color="#FFFFFF" />
            </View>

            <Text
              style={[
                styles.statValue,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {stat.value}
            </Text>

            <Text
              style={[
                styles.statLabel,
                { color: dark ? COLORS.secondaryWhite : COLORS.gray3 },
              ]}
            >
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    ...TYPOGRAPHY.h3,
    fontWeight: "bold",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  statItem: {
    width: "50%",
    paddingHorizontal: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    ...TYPOGRAPHY.h2,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    textAlign: "center",
  },
});

export default QuickStats;
