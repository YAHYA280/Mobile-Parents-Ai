import React, { useState } from 'react';
import { useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { icons, COLORS, images } from '../constants';

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
    id: '1',
    name: 'Thomas Dubois',
    age: 8,
    grade: 'CE2',
    progress: 75,
    timeSpent: '12h30',
    isActive: true,
    avatar: images.user7,
  },
  {
    id: '2',
    name: 'Marie Laurent',
    age: 10,
    grade: 'CM2',
    progress: 65,
    timeSpent: '8h45',
    isActive: false,
    avatar: images.user7,
  },
  {
    id: '3',
    name: 'Lucas Martin',
    age: 6,
    grade: 'CP',
    progress: 40,
    timeSpent: '5h20',
    isActive: true,
    avatar: images.user7,
  }
];

type Nav = {
  navigate: (value: string) => void;
};

const ListeEnfantsScreen = () => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation<Nav>();
  const [children, setChildren] = useState<Child[]>(mockChildren);

  const handleDeleteChild = (id: string) => {
    setChildren(children.filter(child => child.id !== id));
  };

  // Type for renderItem
  type RenderItemProps = {
    item: Child;
    index: number;
  };

  const renderChildCard = ({ item }: RenderItemProps) => {
    // Calculate color for progress bar
    const progressColor = 
      item.progress >= 75 ? COLORS.greeen : 
      item.progress >= 50 ? COLORS.primary : 
      item.progress >= 25 ? COLORS.secondary : 
      COLORS.error;

    return (
      <View style={[styles.childCard, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
        {/* Delete Button */}
        <TouchableOpacity 
          style={[styles.deleteButton, { backgroundColor: COLORS.error }]}
          onPress={() => handleDeleteChild(item.id)}
        >
          <Image source={icons.cancelSquare} style={styles.deleteIcon} />
        </TouchableOpacity>
        
        {/* Edit Button */}
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => navigation.navigate("editchild")}
        >
          <Image source={icons.editPencil} style={styles.editIcon} />
        </TouchableOpacity>
        
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <Image source={item.avatar} style={styles.avatar} />
          </View>
          
          <View style={styles.infoContainer}>
            <View style={styles.nameContainer}>
              {item.isActive && <View style={styles.statusDot} />}
              <Text style={[styles.childName, { color: dark ? COLORS.white : COLORS.black }]}>
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
            <Text style={styles.progressValue}>{item.progress}%</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${item.progress}%`, backgroundColor: progressColor }
              ]} 
            />
          </View>
          
          <View style={styles.timeSpentContainer}>
            <Image source={icons.time} style={styles.timeIcon} />
            <Text style={styles.timeSpentText}>Temps passé: {item.timeSpent}</Text>
          </View>
        </View>
        
        <Button
          title="Accéder aux détails"
          filled
          style={styles.detailsButton}
          onPress={() => console.log('Navigate to child details')}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIconContainer}>
          <Image 
            source={icons.menu} 
            style={[styles.menuIcon, { tintColor: dark ? COLORS.white : COLORS.black }]} 
          />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: dark ? COLORS.white : COLORS.black }]}>
          Mes Enfants
        </Text>
        
        <TouchableOpacity 
          style={styles.addButtonContainer}
          onPress={() => navigation.navigate("addchild")}
        >
          <Image 
            source={icons.plus} 
            style={[styles.addIcon, { tintColor: COLORS.white }]} 
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={children}
        keyExtractor={item => item.id}
        renderItem={renderChildCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontFamily: 'bold',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
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
    position: 'absolute',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    marginRight: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
  infoContainer: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.greeen,
    marginRight: 8,
  },
  childName: {
    fontSize: 18,
    fontFamily: 'bold',
    color: COLORS.black,
    marginBottom: 4,
  },
  childDetails: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: 'regular',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: 'medium',
  },
  progressValue: {
    fontSize: 14,
    color: COLORS.primary,
    fontFamily: 'bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.grayscale200,
    borderRadius: 4,
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  timeSpentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontFamily: 'regular',
  },
  detailsButton: {
    borderRadius: 30,
  },
});

export default ListeEnfantsScreen;