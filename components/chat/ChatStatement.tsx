// app/Enfants/Historique/statement.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Activity } from "../../data/Enfants/CHILDREN_DATA";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";

interface StatementProps {
  activity: Activity;
  dark: boolean;
}

const Statement: React.FC<StatementProps> = ({ activity, dark }) => {
  // Format date for display
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: "rgba(0,0,0,0.02)" }]}>
      {/* Title */}
      <Text style={[styles.title, { color: "#333333" }]}>
        Énoncé de l'exercice
      </Text>

      {/* Content */}
      <View
        style={[
          styles.contentCard,
          {
            backgroundColor: "#FFFFFF",
          },
        ]}
      >
        <Text style={[styles.contentText, { color: "#333333" }]}>
          {activity.commentaires ||
            "L'élève a travaillé sur un exercice qui utilise l'application d'IA pour apprendre. Vous pouvez voir les détails de l'interaction dans la conversation ci-dessous."}
        </Text>

        {activity.recommandations && activity.recommandations.length > 0 && (
          <View style={styles.guidelineContainer}>
            <Text style={[styles.guidelineTitle, { color: "#333333" }]}>
              Recommandations:
            </Text>

            {activity.recommandations.map(
              (guideline: string, index: number) => (
                <View key={index} style={styles.guidelineItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={COLORS.primary}
                    style={styles.guidelineIcon}
                  />
                  <Text style={[styles.guidelineText, { color: "#333333" }]}>
                    {guideline}
                  </Text>
                </View>
              )
            )}
          </View>
        )}

        <Text style={[styles.note, { color: "#757575" }]}>
          Cet exercice aide à développer les compétences en résolution de
          problèmes et en réflexion critique.
        </Text>
      </View>

      {/* Details */}
      <View
        style={[
          styles.detailsCard,
          {
            backgroundColor: "#FFFFFF",
          },
        ]}
      >
        <View style={styles.detailsHeader}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={COLORS.primary}
            style={styles.detailsIcon}
          />
          <Text style={[styles.detailsTitle, { color: "#333333" }]}>
            Détails de l'activité
          </Text>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: "#757575" }]}>
              Date:
            </Text>
            <Text style={[styles.detailValue, { color: "#333333" }]}>
              {formatDate(activity.date)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: "#757575" }]}>
              Matière:
            </Text>
            <Text style={[styles.detailValue, { color: "#333333" }]}>
              {activity.matiere || "Non spécifiée"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: "#757575" }]}>
              Assistant:
            </Text>
            <Text style={[styles.detailValue, { color: "#333333" }]}>
              {activity.assistant || "Non spécifié"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: "#757575" }]}>
              Durée:
            </Text>
            <Text style={[styles.detailValue, { color: "#333333" }]}>
              {activity.duree || "Non spécifiée"}
            </Text>
          </View>

          {activity.score && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: "#757575" }]}>
                Score:
              </Text>
              <View style={styles.scoreContainer}>
                <Ionicons
                  name="star"
                  size={16}
                  color="#FFD700"
                  style={styles.scoreIcon}
                />
                <Text style={[styles.scoreText, { color: "#333333" }]}>
                  {activity.score}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  contentCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  contentText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  guidelineContainer: {
    marginBottom: 16,
  },
  guidelineTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  guidelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  guidelineIcon: {
    marginRight: 8,
    marginTop: 3,
  },
  guidelineText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  note: {
    fontSize: 14,
    fontStyle: "italic",
  },
  detailsCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  detailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailsIcon: {
    marginRight: 8,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  detailsGrid: {
    paddingHorizontal: 4,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  detailLabel: {
    width: 80,
    fontSize: 14,
    fontWeight: "500",
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreIcon: {
    marginRight: 4,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default Statement;
