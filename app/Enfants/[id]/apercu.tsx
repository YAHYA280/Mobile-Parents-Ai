// app/Enfants/[id]/apercu.tsx
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { COLORS, TYPOGRAPHY } from "@/constants/theme";
import { CHILDREN_DATA } from "@/data/Enfants/CHILDREN_DATA";

export default function ChildOverviewScreen() {
  const { id } = useLocalSearchParams();
  const childId = Number(id);
  const [child, setChild] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch child data - in a real app, this would come from an API or context
    const foundChild = CHILDREN_DATA.find((c) => c.id === childId);
    setChild(foundChild);
    setLoading(false);
  }, [childId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!child) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Enfant non trouvé</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Aperçu général</Text>
          <Text style={styles.childName}>{child.name}</Text>
        </View>

        {/* Progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progrès Global</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressText}>{child.progress}</Text>
            </View>
          </View>
        </View>

        {/* Strengths Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Points forts</Text>
          <View style={styles.listContainer}>
            {child.matieresFortes.map((matiere: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listItemText}>{matiere}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Areas to Improve Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Points à améliorer</Text>
          <View style={styles.listContainer}>
            {child.matieresAmeliorer.map((matiere: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <View style={[styles.bullet, styles.improveBullet]} />
                <Text style={styles.listItemText}>
                  {matiere.replace(/^\?/, "").trim()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#333",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
  },
  header: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerTitle: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 8,
  },
  childName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 8,
    borderColor: COLORS.primary,
  },
  progressText: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  listContainer: {
    marginTop: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginRight: 12,
  },
  improveBullet: {
    backgroundColor: "#FF3B30",
  },
  listItemText: {
    fontSize: 16,
    color: "#333",
  },
});
