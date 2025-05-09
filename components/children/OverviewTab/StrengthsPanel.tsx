import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, TYPOGRAPHY } from "@/constants/theme";
import { useTheme } from "@/theme/ThemeProvider";
import Card from "@/components/ui/Card";

interface StrengthItem {
  subject: string;
  icon?: string;
  color?: string;
}

interface StrengthsPanelProps {
  strengths: StrengthItem[];
  weaknesses?: StrengthItem[];
  title?: string;
}

const StrengthsPanel: React.FC<StrengthsPanelProps> = ({
  strengths,
  weaknesses = [],
  title = "Points forts et à améliorer",
}) => {
  const { dark } = useTheme();

  return (
    <Card>
      <Text
        style={[styles.title, { color: dark ? COLORS.white : COLORS.black }]}
      >
        {title}
      </Text>

      {strengths.length > 0 && (
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Points forts
          </Text>

          {strengths.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View
                style={[
                  styles.bulletPoint,
                  { backgroundColor: item.color || "#4CAF50" },
                ]}
              />
              <Text
                style={[
                  styles.itemText,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                {item.subject}
              </Text>

              {item.icon && (
                <Ionicons
                  name={item.icon as any}
                  size={16}
                  color={item.color || "#4CAF50"}
                  style={styles.itemIcon}
                />
              )}
            </View>
          ))}
        </View>
      )}

      {weaknesses.length > 0 && (
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Points à améliorer
          </Text>

          {weaknesses.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View
                style={[
                  styles.bulletPoint,
                  { backgroundColor: item.color || "#FF5722" },
                ]}
              />
              <Text
                style={[
                  styles.itemText,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                {item.subject}
              </Text>

              {item.icon && (
                <Ionicons
                  name={item.icon as any}
                  size={16}
                  color={item.color || "#FF5722"}
                  style={styles.itemIcon}
                />
              )}
            </View>
          ))}
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
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    ...TYPOGRAPHY.subtitle1,
    fontWeight: "600",
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  itemText: {
    ...TYPOGRAPHY.body1,
    flex: 1,
  },
  itemIcon: {
    marginLeft: 8,
  },
});

export default StrengthsPanel;
