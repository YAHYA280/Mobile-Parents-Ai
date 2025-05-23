// components/enfants/historique/TagsCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { COLORS } from "@/constants/theme";

interface TagsCardProps {
  tags: string[];
}

const TagsCard: React.FC<TagsCardProps> = ({ tags }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesomeIcon
          icon="tags"
          size={18}
          color={COLORS.primary}
          style={styles.headerIcon}
        />
        <Text style={styles.headerTitle}>Mots-clés</Text>
      </View>

      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
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
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  tagText: {
    color: COLORS.gray3,
    fontSize: 14,
    fontWeight: "500",
  },
});

export default TagsCard;
