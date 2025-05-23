import { MotiView } from "moti";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useNavigation } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  View,
  Text,
  Modal,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

import Button from "@/components/Button";
import Header from "@/components/ui/Header";
import { COLORS, images } from "@/constants";

interface Child {
  id: string;
  name: string;
  age: number;
  grade: string;
  progress: number;
  timeSpent: string;
  isActive: boolean;
  avatar: any;
}

const mockChildren: Child[] = [
  {
    id: "1",
    name: "Thomas Dubois",
    age: 8,
    grade: "CE2",
    progress: 75,
    timeSpent: "12h30",
    isActive: true,
    avatar: images.user7,
  },
  {
    id: "2",
    name: "Marie Laurent",
    age: 10,
    grade: "CM2",
    progress: 65,
    timeSpent: "8h45",
    isActive: false,
    avatar: images.user3,
  },
  {
    id: "3",
    name: "Lucas Martin",
    age: 6,
    grade: "CP",
    progress: 40,
    timeSpent: "5h20",
    isActive: true,
    avatar: images.user5,
  },
];

type Nav = {
  goBack(): unknown;
  navigate: (value: string, params?: object) => void;
};

const ListeEnfantsScreen = () => {
  const router = useRouter();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [children, setChildren] = useState<Child[]>(mockChildren);
  const [childToDelete, setChildToDelete] = useState<Child | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const CARD_HORIZONTAL_PADDING = 16;
  const CARD_WIDTH = width - CARD_HORIZONTAL_PADDING * 2;

  const handleChildDetails = (childId: string) => {
    router.push({
      pathname: "/childaccount/[id]",
      params: { id: childId },
    });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleDeleteChild = (child: Child) => {
    setChildToDelete(child);
    setShowDeleteModal(true);
  };

  const handleEditChild = (childId: string) => {
    router.push({
      pathname: "/editchild/[id]",
      params: { id: childId },
    });
  };

  const confirmDeleteChild = () => {
    if (childToDelete) {
      setChildren((prev) =>
        prev.filter((child) => child.id !== childToDelete.id)
      );
      setShowDeleteModal(false);
      setChildToDelete(null);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return COLORS.success ?? COLORS.primary;
    if (progress >= 50) return COLORS.primary;
    if (progress >= 25) return COLORS.secondary;
    return COLORS.error;
  };

  const renderDeleteModal = () => (
    <Modal
      transparent
      visible={showDeleteModal}
      animationType="fade"
      onRequestClose={() => setShowDeleteModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[styles.modalContainer, { backgroundColor: COLORS.white }]}
        >
          <Text style={[styles.modalTitle, { color: COLORS.error }]}>
            Confirmer la suppression
          </Text>
          <Text style={[styles.modalMessage, { color: COLORS.black }]}>
            Êtes-vous sûr de vouloir supprimer le profil de{" "}
            {childToDelete?.name} ?
          </Text>
          <View style={styles.modalButtons}>
            <Button
              title="Annuler"
              style={[
                styles.modalButton,
                { backgroundColor: COLORS.grayscale200, borderWidth: 0 },
              ]}
              textColor={COLORS.black}
              onPress={() => setShowDeleteModal(false)}
            />
            <Button
              title="Supprimer"
              style={[
                styles.modalButton,
                { backgroundColor: COLORS.error, borderColor: COLORS.black2 },
              ]}
              textColor={COLORS.white}
              onPress={confirmDeleteChild}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderChildCard = ({ item, index }: { item: Child; index: number }) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 600, delay: index * 120 }}
      style={[styles.childCardWrapper, { width: CARD_WIDTH }]}
    >
      <View
        style={[styles.childCard, Platform.OS === "ios" && styles.iosShadow]}
      >
        {/* Delete */}
        <Pressable
          style={styles.deleteButton}
          onPress={() => handleDeleteChild(item)}
        >
          <LinearGradient
            colors={[COLORS.error, "#FF6B6B"]}
            style={styles.roundButtonGradient}
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.white} />
          </LinearGradient>
        </Pressable>

        {/* Edit */}
        <Pressable
          style={styles.editButton}
          onPress={() => handleEditChild(item.id)}
        >
          <LinearGradient
            colors={[COLORS.secondary, COLORS.secondary]}
            style={styles.roundButtonGradient}
          >
            <Ionicons name="pencil-outline" size={18} color={COLORS.white} />
          </LinearGradient>
        </Pressable>

        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <Image source={item.avatar} style={styles.avatar} />
            {item.isActive && (
              <View style={styles.statusDotWrapper}>
                <View style={styles.statusDot} />
              </View>
            )}
          </View>
          <View style={styles.infoContainer}>
            <Text
              style={[styles.childName, { color: COLORS.black }]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text style={styles.childDetails}>
              {item.age} ans • {item.grade}
            </Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Progrès global</Text>
            <Text
              style={[
                styles.progressValue,
                { color: getProgressColor(item.progress) },
              ]}
            >
              {item.progress}%
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <MotiView
              from={{ width: "5%" }}
              animate={{ width: `${Math.max(5, item.progress)}%` }}
              transition={{ type: "timing", duration: 800, delay: 200 }}
              style={[
                styles.progressBar,
                { backgroundColor: getProgressColor(item.progress) },
              ]}
            />
          </View>
          <View style={styles.timeSpentContainer}>
            <Ionicons
              name="time-outline"
              size={16}
              color={COLORS.primary}
              style={styles.timeIcon}
            />
            <Text style={styles.timeSpentText}>
              Temps passé :{" "}
              <Text style={{ fontFamily: "medium", color: COLORS.primary }}>
                {item.timeSpent}
              </Text>
            </Text>
          </View>
        </View>

        <Button
          title="Accéder aux détails"
          filled
          style={styles.detailsButton}
          onPress={() => handleChildDetails(item.id)}
        />
      </View>
    </MotiView>
  );

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: insets.top }]}
      edges={["right", "left", "bottom"]}
    >
      <Header
        title="Mes Enfants"
        onBackPress={handleGoBack}
        rightIcon="add"
        onRightIconPress={() => navigation.navigate("addchild")}
      />
      <FlatList
        data={children}
        keyExtractor={(item) => item.id}
        renderItem={renderChildCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: COLORS.black }]}>
              Aucun enfant ajouté pour le moment
            </Text>
            <Button
              title="Ajouter un enfant"
              filled
              style={styles.emptyAddButton}
              onPress={() => navigation.navigate("addchild")}
            />
          </View>
        }
      />
      {renderDeleteModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  childCardWrapper: {
    marginVertical: 12,
    alignSelf: "center",
  },
  childCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  iosShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  roundButtonGradient: {
    padding: 8,
    borderRadius: 14,
  },
  deleteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 2,
  },
  editButton: {
    position: "absolute",
    top: 52,
    right: 12,
    zIndex: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: "hidden",
    marginRight: 14,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 36,
  },
  statusDotWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success ?? COLORS.primary,
  },
  infoContainer: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontFamily: "bold",
  },
  childDetails: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: "regular",
    marginTop: 2,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
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
    backgroundColor: COLORS.grayscale200,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  timeSpentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  timeIcon: {
    marginRight: 6,
  },
  timeSpentText: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: "regular",
  },
  detailsButton: {
    borderRadius: 30,
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "medium",
    marginBottom: 20,
    textAlign: "center",
  },
  emptyAddButton: {
    width: 200,
    borderRadius: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 18,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default ListeEnfantsScreen;
