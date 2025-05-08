// app/Enfants/index.tsx - Enhanced version
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MotiView, AnimatePresence } from "moti";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  TYPOGRAPHY,
  COLORS,
  SPACING,
  RADIUS,
  SHADOWS,
} from "@/constants/theme";
import { CHILDREN_DATA } from "@/data/Enfants/CHILDREN_DATA";
import EnhancedNotificationIcon from "@/components/notifications/NotificationIcon";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const EnhancedEnfantsHome = () => {
  const router = useRouter();

  // States
  const [children, setChildren] = useState(CHILDREN_DATA);
  const [filteredChildren, setFilteredChildren] = useState(CHILDREN_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildAge, setNewChildAge] = useState("");
  const [newChildClass, setNewChildClass] = useState("");
  const [loadingChildData, setLoadingChildData] = useState(false);

  // Filter children based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChildren(children);
    } else {
      const filtered = children.filter(
        (child) =>
          child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          child.classe.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredChildren(filtered);
    }
  }, [searchQuery, children]);

  // Navigate to a child's profile
  const handleChildPress = (childId: number) => {
    router.push(`/Enfants/home?childId=${childId}`);
  };

  // Navigate to activity history
  const handleActivityHistoryPress = (childId: number) => {
    router.push(`/Enfants/Historique/home?childId=${childId}`);
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);

    // Simulate data refresh
    setTimeout(() => {
      // Get fresh data (just use the same data for demo)
      setChildren([...CHILDREN_DATA]);
      setIsRefreshing(false);
    }, 1500);
  };

  // Add new child
  const handleAddChild = () => {
    // Validate inputs
    if (!newChildName.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un nom");
      return;
    }

    if (!newChildAge.trim() || isNaN(Number(newChildAge))) {
      Alert.alert("Erreur", "Veuillez entrer un âge valide");
      return;
    }

    if (!newChildClass.trim()) {
      Alert.alert("Erreur", "Veuillez entrer une classe");
      return;
    }

    // Start loading
    setLoadingChildData(true);

    // Simulate API call
    setTimeout(() => {
      // Create new child
      const newChild = {
        id: Math.max(...children.map((c) => c.id)) + 1,
        name: newChildName.trim(),
        age: parseInt(newChildAge),
        classe: newChildClass.trim(),
        progress: "45%", // Default progress
        profileImage: require("../../assets/images/avatar1.png"), // Default image
        matieresFortes: ["Mathématiques", "Sciences"],
        matieresAmeliorer: ["Français", "Histoire"],
        activitesRecentes: [],
      };

      // Add new child to list
      setChildren((prevChildren) => [...prevChildren, newChild]);

      // Reset form
      setNewChildName("");
      setNewChildAge("");
      setNewChildClass("");
      setIsAddingChild(false);
      setLoadingChildData(false);

      // Show success message
      Alert.alert(
        "Succès",
        `L'enfant ${newChild.name} a été ajouté avec succès.`,
        [
          {
            text: "OK",
            onPress: () => {
              // Navigate to new child's profile
              setTimeout(() => {
                handleChildPress(newChild.id);
              }, 500);
            },
          },
        ]
      );
    }, 2000);
  };

  // Cancel adding child
  const handleCancelAddChild = () => {
    setIsAddingChild(false);
    setNewChildName("");
    setNewChildAge("");
    setNewChildClass("");
  };

  // Calculate progress percentage for progress bar
  const getProgressPercentage = (progressString: string) => {
    return parseInt(progressString.replace("%", ""));
  };

  // Get progress color
  const getProgressColor = (progressString: string) => {
    const progress = getProgressPercentage(progressString);

    if (progress >= 80) return ["#4CAF50", "#2E7D32"]; // Green
    if (progress >= 60) return ["#8BC34A", "#558B2F"]; // Light Green
    if (progress >= 40) return ["#FFEB3B", "#FBC02D"]; // Yellow
    if (progress >= 20) return ["#FF9800", "#F57C00"]; // Orange
    return ["#F44336", "#C62828"]; // Red
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", damping: 18 }}
        >
          <Text style={styles.title}>Mes Enfants</Text>
        </MotiView>

        <View style={styles.headerRight}>
          <EnhancedNotificationIcon size={24} />

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsAddingChild(true)}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.gray3} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un enfant..."
            placeholderTextColor={COLORS.gray3}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={COLORS.gray3} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500 }}
          style={styles.welcomeCard}
        >
          <LinearGradient
            colors={[COLORS.primary, "#ff8e69"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeCardGradient}
          >
            <View style={styles.welcomeCardContent}>
              <Ionicons
                name="information-circle"
                size={24}
                color="#FFFFFF"
                style={styles.welcomeCardIcon}
              />
              <View style={styles.welcomeCardTextContainer}>
                <Text style={styles.welcomeCardTitle}>
                  Bienvenue dans l'espace Enfants
                </Text>
                <Text style={styles.welcomeCardText}>
                  Suivez les activités et performances de vos enfants. Ajoutez
                  des commentaires et consultez leur historique d'apprentissage.
                </Text>
              </View>
            </View>
          </LinearGradient>
        </MotiView>

        {/* Add child form */}
        <AnimatePresence>
          {isAddingChild && (
            <MotiView
              from={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", damping: 18 }}
              style={styles.addChildContainer}
            >
              <View style={styles.addChildHeader}>
                <Text style={styles.addChildTitle}>Ajouter un enfant</Text>
                <TouchableOpacity onPress={handleCancelAddChild}>
                  <Ionicons name="close" size={24} color={COLORS.gray3} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nom de l'enfant</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Entrez le nom complet"
                  placeholderTextColor={COLORS.gray3}
                  value={newChildName}
                  onChangeText={setNewChildName}
                />
              </View>

              <View style={styles.inputRow}>
                <View
                  style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}
                >
                  <Text style={styles.inputLabel}>Âge</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Âge"
                    placeholderTextColor={COLORS.gray3}
                    value={newChildAge}
                    onChangeText={setNewChildAge}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>

                <View style={[styles.inputContainer, { flex: 2 }]}>
                  <Text style={styles.inputLabel}>Classe</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="ex: CM1, 6ème, etc."
                    placeholderTextColor={COLORS.gray3}
                    value={newChildClass}
                    onChangeText={setNewChildClass}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.addChildButton}
                onPress={handleAddChild}
                disabled={loadingChildData}
              >
                {loadingChildData ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons
                      name="person-add"
                      size={18}
                      color="#FFFFFF"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.addChildButtonText}>Ajouter</Text>
                  </>
                )}
              </TouchableOpacity>
            </MotiView>
          )}
        </AnimatePresence>

        {/* Children cards */}
        {filteredChildren.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="search" size={60} color={COLORS.gray3} />
            <Text style={styles.emptyStateTitle}>Aucun enfant trouvé</Text>
            <Text style={styles.emptyStateText}>
              Aucun enfant ne correspond à votre recherche "{searchQuery}"
            </Text>
          </View>
        ) : (
          filteredChildren.map((child, index) => (
            <MotiView
              key={child.id}
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{
                type: "spring",
                damping: 15,
                stiffness: 100,
                delay: 100 + index * 100,
              }}
              style={styles.childCardContainer}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleChildPress(child.id)}
                style={styles.childCard}
              >
                <LinearGradient
                  colors={getProgressColor(child.progress)}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.childCardHeader}
                >
                  <View style={styles.childHeaderContent}>
                    <View style={styles.avatarContainer}>
                      <Image
                        source={child.profileImage}
                        style={styles.avatar}
                        resizeMode="cover"
                      />
                    </View>

                    <View style={styles.childInfo}>
                      <Text style={styles.childName}>{child.name}</Text>
                      <Text style={styles.childDetails}>
                        {child.classe} • {child.age} ans
                      </Text>

                      <View style={styles.progressContainer}>
                        <Text style={styles.progressLabel}>Progression</Text>
                        <View style={styles.progressBarContainer}>
                          <View
                            style={[
                              styles.progressBar,
                              {
                                width: `${getProgressPercentage(child.progress)}%`,
                              },
                            ]}
                          />
                        </View>
                        <Text style={styles.progressValue}>
                          {child.progress}
                        </Text>
                      </View>
                    </View>
                  </View>
                </LinearGradient>

                <View style={styles.childCardBody}>
                  {/* Strengths and weaknesses */}
                  <View style={styles.strengthsRow}>
                    <View style={styles.strengthsColumn}>
                      <Text style={styles.strengthsTitle}>Points forts</Text>
                      <View style={styles.strengthTags}>
                        {child.matieresFortes.map((subject, idx) => (
                          <View key={idx} style={styles.strengthTag}>
                            <Ionicons
                              name="star"
                              size={14}
                              color="#4CAF50"
                              style={styles.tagIcon}
                            />
                            <Text style={styles.strengthTagText}>
                              {subject}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.strengthsColumn}>
                      <Text style={styles.strengthsTitle}>À améliorer</Text>
                      <View style={styles.strengthTags}>
                        {child.matieresAmeliorer.map((subject, idx) => (
                          <View key={idx} style={styles.weaknessTag}>
                            <Ionicons
                              name="trending-up"
                              size={14}
                              color="#FF5722"
                              style={styles.tagIcon}
                            />
                            <Text style={styles.weaknessTagText}>
                              {subject.replace(/^\?/, "").trim()}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>

                  {/* Activity counts */}
                  <View style={styles.activityCountContainer}>
                    <View style={styles.activityCount}>
                      <Text style={styles.activityCountValue}>
                        {child.activitesRecentes.length}
                      </Text>
                      <Text style={styles.activityCountLabel}>Activités</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.viewHistoryButton}
                      onPress={() => handleActivityHistoryPress(child.id)}
                    >
                      <Text style={styles.viewHistoryText}>Historique</Text>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </MotiView>
          ))
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: "#333",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.small,
    marginLeft: 12,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 24,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  welcomeCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    ...SHADOWS.medium,
  },
  welcomeCardGradient: {
    borderRadius: 16,
  },
  welcomeCardContent: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeCardIcon: {
    marginRight: 16,
  },
  welcomeCardTextContainer: {
    flex: 1,
  },
  welcomeCardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  welcomeCardText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    lineHeight: 20,
  },
  addChildContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    ...SHADOWS.small,
    overflow: "hidden",
  },
  addChildHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addChildTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  addChildButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  addChildButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateTitle: {
    ...TYPOGRAPHY.h2,
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    ...TYPOGRAPHY.body1,
    color: "#666",
    textAlign: "center",
  },
  childCardContainer: {
    marginBottom: 20,
  },
  childCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    ...SHADOWS.medium,
  },
  childCardHeader: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  childHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.5)",
    overflow: "hidden",
    marginRight: 16,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  childDetails: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
    marginBottom: 4,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
  },
  progressValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
    alignSelf: "flex-end",
  },
  childCardBody: {
    padding: 16,
  },
  strengthsRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  strengthsColumn: {
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginHorizontal: 12,
  },
  strengthsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  strengthTags: {
    flexDirection: "column",
  },
  strengthTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  weaknessTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 87, 34, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  tagIcon: {
    marginRight: 4,
  },
  strengthTagText: {
    fontSize: 12,
    color: "#4CAF50",
  },
  weaknessTagText: {
    fontSize: 12,
    color: "#FF5722",
  },
  activityCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 12,
    padding: 12,
  },
  activityCount: {
    alignItems: "center",
  },
  activityCountValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  activityCountLabel: {
    fontSize: 12,
    color: "#666",
  },
  viewHistoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 149, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewHistoryText: {
    fontSize: 14,
    color: COLORS.primary,
    marginRight: 4,
  },
  bottomSpacing: {
    height: 30,
  },
});

export default EnhancedEnfantsHome;
