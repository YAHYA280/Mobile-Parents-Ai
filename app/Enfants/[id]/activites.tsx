// app/Enfants/[id]/activites.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { CHILDREN_DATA } from "@/data/Enfants/CHILDREN_DATA";

export default function ChildActivitiesScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const childId = Number(id);
  const [child, setChild] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch child data
    const foundChild = CHILDREN_DATA.find((c) => c.id === childId);
    setChild(foundChild);
    setLoading(false);
  }, [childId]);

  const handleActivityPress = (activityId: number) => {
    router.push(`/Enfants/Historique/${activityId}?childId=${childId}`);
  };

  const navigateToAllActivities = () => {
    router.push(`/Enfants/Historique?childId=${childId}`);
  };

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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activités récentes</Text>
      </View>

      <TouchableOpacity
        style={styles.viewAllButton}
        onPress={navigateToAllActivities}
      >
        <Text style={styles.viewAllButtonText}>Voir tout l'historique</Text>
        <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
      </TouchableOpacity>

      <FlatList
        data={child.activitesRecentes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.activityCard}
            onPress={() => handleActivityPress(item.id)}
          >
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>{item.activite}</Text>
              <Text style={styles.activityDate}>
                {new Date(item.date).toLocaleDateString("fr-FR")}
              </Text>
            </View>

            <View style={styles.activityDetails}>
              {item.matiere && (
                <View style={styles.detailItem}>
                  <Ionicons name="book-outline" size={16} color="#757575" />
                  <Text style={styles.detailText}>{item.matiere}</Text>
                </View>
              )}

              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={16} color="#757575" />
                <Text style={styles.detailText}>{item.duree}</Text>
              </View>

              {item.assistant && (
                <View style={styles.detailItem}>
                  <Ionicons name="person-outline" size={16} color="#757575" />
                  <Text style={styles.detailText}>{item.assistant}</Text>
                </View>
              )}
            </View>

            <View style={styles.activityFooter}>
              <Text style={styles.viewDetailsText}>Voir les détails</Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={COLORS.primary}
              />
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  viewAllButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginRight: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  activityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  activityDate: {
    fontSize: 12,
    color: "#757575",
  },
  activityDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#757575",
    marginLeft: 8,
  },
  activityFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  viewDetailsText: {
    fontSize: 14,
    color: COLORS.primary,
    marginRight: 4,
  },
});
