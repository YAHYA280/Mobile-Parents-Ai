// app/(tabs)/Enfants.tsx
import type { NavigationProp } from "@react-navigation/native";

import React from "react";
import { Image } from "expo-image";
import { useRouter, useNavigation } from "expo-router";
import { icons, COLORS as HEADER_COLORS } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { COLORS as THEME_COLORS } from "../../constants/theme";
import { CHILDREN_DATA, Child } from "../../data/Enfants/CHILDREN_DATA";

// Function to get progress color based on value
function getProgressColor(progress: number) {
  if (progress < 30) {
    return THEME_COLORS.error; // Rouge
  }
  if (progress <= 50) {
    return THEME_COLORS.secondary; // Orange
  }
  if (progress <= 70) {
    return THEME_COLORS.primary; // Jaune
  }
  return THEME_COLORS.greeen; // Vert
}

interface HomeProps {
  navigation: any;
}

// Main EnfantsList Component
const EnfantsList: React.FC<HomeProps> = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const router = useRouter();
  const { colors } = useTheme();
  const { width } = Dimensions.get("window");

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Mes Enfants</Text>
      <View style={[styles.viewRight, { marginLeft: "auto" }]}>
        <TouchableOpacity onPress={() => navigation.navigate("notifications")}>
          <Image
            source={icons.notificationBell2}
            resizeMode="contain"
            style={styles.bellIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleChildPress = (childId: number) => {
    router.push(`/Enfants/home?childId=${childId}`);
  };

  // Type for renderItem
  type RenderItemProps = {
    item: Child;
    index: number;
  };

  const renderChildCard = ({ item }: RenderItemProps) => {
    // Fix progress percentage parsing
    const progressText = item.progress;
    const progressValue = parseFloat(progressText.replace("%", ""));

    return (
      <View style={styles.childCard}>
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={item.profileImage}
              style={styles.avatar}
              contentFit="cover"
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.childName}>{item.name}</Text>
            <Text style={styles.childDetails}>
              {item.age} ans • {item.classe}
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Progrès global</Text>
            <Text
              style={[
                styles.progressValue,
                { color: getProgressColor(progressValue) },
              ]}
            >
              {progressText}
            </Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${progressValue}%`,
                  backgroundColor: getProgressColor(progressValue),
                },
              ]}
            />
          </View>
        </View>

        {/* Point forts and à améliorer */}
        <View style={styles.tagsSection}>
          <View style={styles.tagsRow}>
            <View style={styles.tagColumn}>
              <Text style={styles.tagLabel}>Points forts</Text>
              <View style={styles.tagsList}>
                {item.matieresFortes.slice(0, 2).map((matiere, idx) => (
                  <View key={idx} style={styles.tagItem}>
                    <View style={styles.tagBullet} />
                    <Text style={styles.tagText}>{matiere}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.tagColumn}>
              <Text style={styles.tagLabel}>À améliorer</Text>
              <View style={styles.tagsList}>
                {item.matieresAmeliorer.slice(0, 2).map((matiere, idx) => (
                  <View key={idx} style={styles.tagItem}>
                    <View style={[styles.tagBullet, styles.improveBullet]} />
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
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.area}>
      <View style={styles.container}>{renderHeader()}</View>

      <View style={styles.welcomeCard}>
        <View style={styles.welcomeIconContainer}>
          <Text style={styles.welcomeIcon}>👨‍👩‍👧‍👦</Text>
        </View>
        <Text style={styles.welcomeText}>
          Suivez le progrès et les activités de vos enfants facilement
        </Text>
      </View>

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
  container: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "bold",
    color: "#333333",
  },
  viewRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  bellIcon: {
    height: 24,
    width: 24,
    tintColor: "#333333",
  },
  welcomeCard: {
    margin: 16,
    backgroundColor: "rgba(255, 142, 105, 0.1)",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeIconContainer: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeIcon: {
    fontSize: 30,
  },
  welcomeText: {
    flex: 1,
    fontSize: 14,
    color: THEME_COLORS.primary,
    lineHeight: 20,
    marginLeft: 8,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  childCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    borderWidth: 2,
    borderColor: THEME_COLORS.primary,
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
    color: "#333333",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  childDetails: {
    fontSize: 14,
    color: "#757575",
    fontFamily: "regular",
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
    color: "#757575",
    fontFamily: "medium",
  },
  progressValue: {
    fontSize: 14,
    fontFamily: "bold",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    marginBottom: 12,
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  tagsSection: {
    marginBottom: 16,
  },
  tagsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tagColumn: {
    flex: 1,
    paddingHorizontal: 4,
  },
  tagLabel: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 8,
    fontFamily: "medium",
  },
  tagsList: {
    gap: 6,
  },
  tagItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  tagBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginRight: 8,
  },
  improveBullet: {
    backgroundColor: "#F44336",
  },
  tagText: {
    fontSize: 14,
    color: "#333333",
  },
  improveText: {
    color: "#333333",
  },
  detailsButton: {
    backgroundColor: THEME_COLORS.primary,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  detailsButtonText: {
    color: "#FFFFFF",
    fontFamily: "medium",
    fontSize: 14,
  },
});

export default EnfantsList;
