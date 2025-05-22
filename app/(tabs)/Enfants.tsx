// app/(tabs)/Enfants.tsx
import React from "react";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { COLORS, TYPOGRAPHY, SHADOWS, RADIUS } from "../../constants/theme";
import { CHILDREN_DATA, Child } from "../../data/Enfants/CHILDREN_DATA";
import NotificationBell from "../../components/notifications/NotificationBell";

// Function to get progress color based on value
function getProgressColor(progress: number) {
  if (progress < 30) {
    return COLORS.error; // Rouge
  }
  if (progress <= 50) {
    return COLORS.secondary; // Orange
  }
  if (progress <= 70) {
    return COLORS.primary; // Jaune
  }
  return COLORS.greeen; // Vert
}

// Main EnfantsList Component
const EnfantsList: React.FC = () => {
  const router = useRouter();

  const handleChildPress = (childId: number) => {
    // Make sure this matches your route structure
    router.push(`/Enfants/home?childId=${childId}`);
  };

  // Render header with animated appearance
  const renderHeader = () => (
    <MotiView
      from={{ opacity: 0, translateY: -20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", damping: 18 }}
      style={styles.headerContainer}
    >
      <Text style={styles.headerTitle}>Mes Enfants</Text>
      <View style={styles.headerActions}>
        <NotificationBell />
      </View>
    </MotiView>
  );

  // Render child card with staggered animation
  const renderChildCard = ({ item, index }: { item: Child; index: number }) => {
    // Parse progress percentage
    const progressText = item.progress;
    const progressValue = parseFloat(progressText.replace("%", ""));
    const progressColor = getProgressColor(progressValue);

    return (
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500 }}
        style={styles.childCardWrapper}
      >
        <TouchableOpacity
          style={styles.childCard}
          onPress={() => handleChildPress(item.id)}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <View
              style={[styles.avatarContainer, { borderColor: progressColor }]}
            >
              <Image
                source={item.profileImage}
                style={styles.avatar}
                contentFit="cover"
                transition={500}
              />
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.childName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.childDetails}>
                {item.age} ans • {item.classe}
              </Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Progrès global</Text>
              <Text style={[styles.progressValue, { color: progressColor }]}>
                {progressText}
              </Text>
            </View>

            <View style={styles.progressBarContainer}>
              <MotiView
                from={{ width: "0%" }}
                animate={{ width: `${progressValue}%` }}
                transition={{
                  type: "timing",
                  duration: 1000,
                  delay: 300 + index * 100,
                }}
                style={[styles.progressBar, { backgroundColor: progressColor }]}
              />
            </View>
          </View>

          {/* Points forts and à améliorer */}
          <View style={styles.tagsSection}>
            <View style={styles.tagColumns}>
              <View style={styles.tagColumn}>
                <Text style={styles.tagLabel}>Points forts</Text>
                <View style={styles.tagsList}>
                  {item.matieresFortes.slice(0, 2).map((matiere, idx) => (
                    <View key={idx} style={styles.tagItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={14}
                        color="#4CAF50"
                        style={styles.tagIcon}
                      />
                      <Text style={styles.tagText}>{matiere}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.tagColumn}>
                <Text style={styles.tagLabel}>À améliorer</Text>
                <View style={styles.tagsList}>
                  {item.matieresAmeliorer.slice(0, 2).map((matiere, idx) => (
                    <View
                      key={idx}
                      style={[styles.tagItem, styles.improveTagItem]}
                    >
                      <Ionicons
                        name="alert-circle"
                        size={14}
                        color="#F44336"
                        style={styles.tagIcon}
                      />
                      <Text style={[styles.tagText, styles.improveText]}>
                        {matiere.replace(/^\?/, "").trim()}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => handleChildPress(item.id)}
          >
            <Text style={styles.detailsButtonText}>Accéder aux détails</Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color="#FFFFFF"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </MotiView>
    );
  };

  return (
    <SafeAreaView style={styles.area}>
      {renderHeader()}

      <FlatList
        data={CHILDREN_DATA}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderChildCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20, // Increased from 16 to 20
    paddingBottom: 24, // Added extra bottom padding
    backgroundColor: "#FFFFFF",
    ...SHADOWS.small,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: "#333333",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeCard: {
    margin: 16,
    borderRadius: RADIUS.lg,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,142,105,0.1)",
    ...SHADOWS.small,
  },
  welcomeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeIcon: {
    fontSize: 24,
  },
  welcomeText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    marginLeft: 12,
    fontFamily: "medium",
    color: COLORS.primary,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16, // Added top padding for spacing between header and content
    paddingBottom: 80,
  },
  childCardWrapper: {
    marginBottom: 20,
  },
  childCard: {
    borderRadius: RADIUS.lg,
    padding: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    ...SHADOWS.medium,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: "hidden",
    marginRight: 16,
    borderWidth: 3,
    ...SHADOWS.small,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 35,
  },
  infoContainer: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 4,
    textTransform: "capitalize",
    color: "#333333",
  },
  childDetails: {
    fontSize: 14,
    fontFamily: "regular",
    color: "#757575",
  },
  progressSection: {
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: "medium",
    color: "#757575",
  },
  progressValue: {
    fontSize: 14,
    fontFamily: "bold",
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
    backgroundColor: "#E0E0E0",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  tagsSection: {
    marginBottom: 16,
  },
  tagColumns: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tagColumn: {
    flex: 1,
    paddingHorizontal: 4,
  },
  tagLabel: {
    fontSize: 14,
    fontFamily: "medium",
    marginBottom: 8,
    color: "#757575",
  },
  tagsList: {
    gap: 6,
  },
  tagItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    borderRadius: RADIUS.md,
    marginBottom: 4,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
  },
  tagIcon: {
    marginRight: 4,
  },
  improveTagItem: {
    backgroundColor: "rgba(244, 67, 54, 0.1)",
  },
  tagText: {
    fontSize: 12,
    color: "#333333",
    fontFamily: "medium",
  },
  improveText: {
    color: "#333333",
  },
  detailsButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  detailsButtonText: {
    color: "#FFFFFF",
    fontFamily: "medium",
    fontSize: 14,
  },
});

export default EnfantsList;
