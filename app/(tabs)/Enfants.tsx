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
import { CHILDREN_DATA } from "../../data/Enfants/CHILDREN_DATA";

// Types definitions
interface Child {
  id: number;
  name: string;
  progress: string;
  evolutionRate?: number;
  engagementScore?: number;
  age: number;
  classe: string;
  matieresFortes: string[];
  matieresAmeliorer: string[];
  activitesRecentes: any[];
  profileImage: any;
}
// Définir COLORS localement
const COLORS = {
  primary: "#ff8e69",
  secondary: "#fe7862",
  error: "#F75555",
  greeen: "#0ABE75",
  gray: "#9E9E9E",
  white: "#FFFFFF",
  black: "#000000",
  dark1: "#000000",
  dark2: "#1F222A",
  secondaryWhite: "#F8F8F8"
};
// New progress color function with more detailed color scale
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
const EnfantsList : React.FC<HomeProps> = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const router = useRouter();
  const { dark, colors } = useTheme();
  Dimensions.get('window');

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={[styles.viewRight, { marginLeft: 'auto' }]}>
        <TouchableOpacity onPress={() => navigation.navigate("notifications")}>
          <Image
            source={icons.notificationBell2}
            resizeMode="contain"
            style={[
              styles.bellIcon,
              { tintColor: dark ? COLORS.white : HEADER_COLORS.greyscale900 },
            ]}
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
    const progressValue = parseFloat(progressText.replace('%', ''));

    return (
      <View
        style={[
          styles.childCard,
          { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <Image source={item.profileImage} style={styles.avatar} contentFit="cover" />
          </View>

          <View style={styles.infoContainer}>
            <Text
              style={[
                styles.childName,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
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

          {/* Section pour l'engagement et l'évolution si disponibles */}
          {(item.engagementScore !== undefined || item.evolutionRate !== undefined) && (
            <View style={styles.metricsContainer} />
          )}
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
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
      </View>
      <View style={styles.header}>
        <Text
          style={[
            styles.headerTitle,
            { color: dark ? COLORS.white : COLORS.black },
          ]}
        >
          Mes Enfants
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
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.black,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  childCard: {
    backgroundColor: COLORS.white,
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
    borderColor: COLORS.white,
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
    color: COLORS.black,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  childDetails: {
    fontSize: 14,
    color: COLORS.gray,
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
    color: COLORS.gray,
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
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  detailsButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  detailsButtonText: {
    color: COLORS.white,
    fontFamily: "medium",
    fontSize: 14,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  bellIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
    marginRight: 8,
  },
});

export default EnfantsList;