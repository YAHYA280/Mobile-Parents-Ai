import { Image } from "expo-image";
import React, { useState } from "react";
import Button from "@/components/Button";
import { useNavigation } from "expo-router";
import { useTheme } from "@/theme/ThemeProvider";
import { icons, COLORS, images } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  Modal,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

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
  navigate: (value: string, params?: object) => void;
};

const ListeEnfantsScreen = () => {
  const { colors, dark } = useTheme();
  const router = useRouter();
  const navigation = useNavigation<Nav>();
  const [children, setChildren] = useState<Child[]>(mockChildren);
  const [childToDelete, setChildToDelete] = useState<Child | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleChildDetails = (childId: string) => {
    router.push({
      pathname: "/childaccount/[id]",
      params: { id: childId },
    });
  };

  const handleDeleteChild = (child: Child) => {
    setChildToDelete(child);
    setShowDeleteModal(true);
  };

  function handleEditChild(childId: string) {
    // If you have app/editchild/[id].tsx
    router.push({
      pathname: "/editchild/[id]",
      params: { id: childId },
    });
  }

  const confirmDeleteChild = () => {
    if (childToDelete) {
      setChildren((prevChildren) =>
        prevChildren.filter((child) => child.id !== childToDelete.id)
      );
      setShowDeleteModal(false);
      setChildToDelete(null);
    }
  };

  // Calculate color for progress bar
  const getProgressColor = (progress: number) => {
    if (progress >= 75) return COLORS.greeen;
    if (progress >= 50) return COLORS.primary;
    if (progress >= 25) return COLORS.secondary;
    return COLORS.error;
  };

  // Delete confirmation modal
  const renderDeleteModal = () => (
    <Modal
      transparent
      visible={showDeleteModal}
      animationType="fade"
      onRequestClose={() => setShowDeleteModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
          <Text style={[styles.modalTitle, { color: COLORS.error }]}>
            Confirmer la suppression
          </Text>
          <Text
            style={[
              styles.modalMessage,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Êtes-vous sûr de vouloir supprimer le profil de{" "}
            {childToDelete?.name} ?
          </Text>
          <View style={styles.modalButtons}>
            <Button
              title="Annuler"
              style={[
                styles.modalButton,
                {
                  backgroundColor: dark ? COLORS.dark3 : COLORS.grayscale200,
                  borderWidth: 0,
                },
              ]}
              textColor={dark ? COLORS.white : COLORS.black}
              onPress={() => setShowDeleteModal(false)}
            />
            <Button
              title="Supprimer"
              style={[
                styles.modalButton,
                {
                  backgroundColor: COLORS.error,
                  borderColor: COLORS.error,
                },
              ]}
              onPress={confirmDeleteChild}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  // Type for renderItem
  type RenderItemProps = {
    item: Child;
    index: number;
  };

  const renderChildCard = ({ item }: RenderItemProps) => {
    return (
      <View
        style={[
          styles.childCard,
          { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
        ]}
      >
        {/* Delete Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteChild(item)}
        >
          <Image source={icons.cancelSquare} style={styles.deleteIcon} />
        </TouchableOpacity>

        {/* Edit Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditChild(item.id)}
        >
          <Image source={icons.editPencil} style={styles.editIcon} />
        </TouchableOpacity>

        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <Image source={item.avatar} style={styles.avatar} />
            {item.isActive && <View style={styles.statusDot} />}
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.nameContainer}>
              
              <Text
                style={[
                  styles.childName,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                {item.name}
              </Text>
            </View>

            <Text style={styles.childDetails}>
              {item.age} ans • {item.grade}
            </Text>
          </View>
        </View>

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
            <View
              style={[
                styles.progressBar,
                {
                  width: `${item.progress}%`,
                  backgroundColor: getProgressColor(item.progress),
                },
              ]}
            />
          </View>

          <View style={styles.timeSpentContainer}>
            <Image source={icons.time} style={styles.timeIcon} />
            <Text style={styles.timeSpentText}>
              Temps passé: {item.timeSpent}
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
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIconContainer}>
          <Image
            source={icons.menu}
            style={[
              styles.menuIcon,
              { tintColor: dark ? COLORS.white : COLORS.black },
            ]}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            { color: dark ? COLORS.white : COLORS.black },
          ]}
        >
          Mes Enfants
        </Text>

        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={() => navigation.navigate("addchild")}
        >
          <Image source={icons.plus} style={styles.addIcon} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={children}
        keyExtractor={(item) => item.id}
        renderItem={renderChildCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text
              style={[
                styles.emptyText,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  menuIconContainer: {
    padding: 8,
  },
  menuIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.black,
  },
  addButtonContainer: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 20,
  },
  addIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.white,
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
    position: "relative",
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: COLORS.error,
    borderRadius: 15,
    padding: 5,
    zIndex: 2,
  },
  deleteIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.white,
  },
  editButton: {
    position: "absolute",
    top: 45,
    right: 10,
    backgroundColor: COLORS.secondary,
    borderRadius: 15,
    padding: 5,
    zIndex: 2,
  },
  editIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.white,
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
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 35,
  },
  infoContainer: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.greeen,
    position: "absolute",
    bottom: 5,
    right: 5,
    borderWidth: 2,
    borderColor:  COLORS.white, // Ensure contrast
    zIndex: 10,
  },
  childName: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.black,
    marginBottom: 4,
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
    color: COLORS.primary,
    fontFamily: "bold",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.grayscale200,
    borderRadius: 4,
    marginBottom: 12,
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  timeSpentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.gray,
    marginRight: 8,
  },
  timeSpentText: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: "regular",
  },
  detailsButton: {
    borderRadius: 30,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: 50,
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
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
