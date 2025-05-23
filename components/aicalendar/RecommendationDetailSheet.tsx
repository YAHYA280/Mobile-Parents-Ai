// components/aicalendar/RecommendationDetailSheet.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import { COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import { AIRecommendation } from "./RecommendationCard";

interface RecommendationDetailSheetProps {
  sheetRef: React.RefObject<any>;
  selectedRecommendation: AIRecommendation | null;
  getRecommendationIcon: (type: string) => string;
  getRecommendationColor: (type: string) => string;
}

const RecommendationDetailSheet: React.FC<RecommendationDetailSheetProps> = ({
  sheetRef,
  selectedRecommendation,
  getRecommendationIcon,
  getRecommendationColor,
}) => {
  const { dark } = useTheme();

  if (!selectedRecommendation) return null;

  return (
    <RBSheet
      ref={sheetRef}
      closeOnPressMask
      height={400}
      customStyles={{
        wrapper: {
          backgroundColor: "rgba(0,0,0,0.5)",
        },
        draggableIcon: {
          backgroundColor: dark ? COLORS.greyscale500 : COLORS.grayscale400,
          width: 40,
          height: 5,
        },
        container: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          backgroundColor: dark ? COLORS.dark1 : COLORS.white,
          padding: 16,
          paddingBottom: 32,
        },
      }}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View
            style={[
              styles.icon,
              {
                backgroundColor: `${getRecommendationColor(selectedRecommendation.type)}15`,
              },
            ]}
          >
            <Ionicons
              name={getRecommendationIcon(selectedRecommendation.type) as any}
              size={24}
              color={getRecommendationColor(selectedRecommendation.type)}
            />
          </View>
          <Text
            style={[
              styles.title,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            {selectedRecommendation.title}
          </Text>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text
              style={[
                styles.detailLabel,
                { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
              ]}
            >
              Enfant:
            </Text>
            <Text
              style={[
                styles.detailValue,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {selectedRecommendation.childName}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text
              style={[
                styles.detailLabel,
                { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
              ]}
            >
              Heure:
            </Text>
            <Text
              style={[
                styles.detailValue,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {selectedRecommendation.timeSlot}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text
              style={[
                styles.detailLabel,
                { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
              ]}
            >
              Durée:
            </Text>
            <Text
              style={[
                styles.detailValue,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {selectedRecommendation.duration}
            </Text>
          </View>

          {selectedRecommendation.subject && (
            <View style={styles.detailRow}>
              <Text
                style={[
                  styles.detailLabel,
                  {
                    color: dark ? COLORS.greyscale500 : COLORS.greyscale600,
                  },
                ]}
              >
                Matière:
              </Text>
              <Text
                style={[
                  styles.detailValue,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                {selectedRecommendation.subject}
              </Text>
            </View>
          )}
        </View>

        <Text
          style={[
            styles.description,
            { color: dark ? COLORS.greyscale400 : COLORS.greyScale700 },
          ]}
        >
          {selectedRecommendation.description}
        </Text>

        <View style={styles.actions}>
          {/* <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
          >
            <Text style={styles.actionButtonText}>Commencer maintenant</Text>
          </TouchableOpacity> */}

          {/* <TouchableOpacity
            style={[
              styles.actionButton,
              styles.secondaryButton,
              {
                backgroundColor: dark ? COLORS.dark3 : COLORS.greyscale100,
              },
            ]}
          >
            <Text
              style={[
                styles.actionButtonText,
                styles.secondaryButtonText,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Programmer plus tard
            </Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: "bold",
    textAlign: "center",
  },
  details: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: "medium",
  },
  detailValue: {
    fontSize: 14,
    fontFamily: "bold",
  },
  description: {
    fontSize: 14,
    fontFamily: "regular",
    lineHeight: 20,
    marginBottom: 24,
  },
  actions: {
    gap: 12,
    marginBottom: 20, // Added bottom margin as requested
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: "semibold",
    color: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#333333",
  },
});

export default RecommendationDetailSheet;
