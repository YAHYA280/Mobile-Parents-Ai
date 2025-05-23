// components/enfants/historique/ContentCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { COLORS } from "@/constants/theme";

interface ContentCardProps {
  content: string[];
}

const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesomeIcon
          icon="list-alt"
          size={18}
          color={COLORS.primary}
          style={styles.headerIcon}
        />
        <Text style={styles.headerTitle}>Contenu</Text>
      </View>

      {content.map((item, index) => (
        <View
          key={index}
          style={[
            styles.contentItem,
            { marginBottom: index < content.length - 1 ? 16 : 0 },
          ]}
        >
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{index + 1}</Text>
          </View>
          <View style={styles.contentTextContainer}>
            <Text style={styles.contentText}>{item}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerIcon: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.black,
  },
  contentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  numberText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  contentTextContainer: {
    flex: 1,
  },
  contentText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },
});

export default ContentCard;
