// Dans D:\bureau\PFA\dev\mobile\brainboost\brainboost-parent-mobile\app\Enfants\Historique\home.tsx

import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { View, Text, FlatList, Animated, SafeAreaView, TouchableOpacity } from "react-native";
import { faStar, faClock, faArrowLeft, faArrowRight, faCheckCircle, faChevronRight, faHourglassEmpty } from '@fortawesome/free-solid-svg-icons';

import type { Child, Activity } from "../../../data/Enfants/CHILDREN_DATA";

import { useActivityFilters } from './filtre';
import { COLORS } from "../../../constants/theme";
import styles from "../../../styles/HistoryStyles";
import { useTheme } from "../../../theme/ThemeProvider";
import { enhanceActivity } from "../../../data/Enfants/CHILDREN_DATA";
import { SearchBar, FilterModal, getActivityTheme, DateRangeIndicator, AssistantTypeFilters } from './filtres';

// Constantes pour la pagination et les couleurs
const ACTIVITIES_PER_PAGE = 3;

// Interface pour les props du composant
interface HistoriqueActivitesProps {
  isTabComponent?: boolean;
  childData?: Child;
}

const HistoriqueActivites: React.FC<HistoriqueActivitesProps> = ({ isTabComponent = false, childData }) => {
  const router = useRouter();
  const { dark, colors } = useTheme();
  const flatListRef = React.useRef<FlatList>(null);

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [activitiesPerPage] = useState(ACTIVITIES_PER_PAGE);

  // Animation pour les items d'activité
  const fadeAnim = React.useMemo(() => new Animated.Value(0), []);

  // Get child data
  const child = childData;

  // Hook useActivityFilters
  const {
    searchKeyword,
    activityDateRange,
    showActivityCalendar,
    activityCalendarMode,
    advancedFilters,
    filteredActivities,
    availableSubjects,
    availableChapters,
    availableExercises,
    setSearchKeyword,
    toggleActivityCalendar,
    handleActivityDayPress,
    setAdvancedFilters,
    resetActivityFilters,
    getUniqueAssistantTypes
  } = useActivityFilters(child?.activitesRecentes || []);

  // Récupérer les types d'assistants uniques
  const [uniqueAssistantTypes, setUniqueAssistantTypes] = useState<string[]>([]);

  // Création d'une valeur d'animation partagée pour tous les items
  const itemAnimValues = React.useMemo(() => {
    const values: { [key: number]: Animated.Value } = {};
    if (child?.activitesRecentes) {
      child.activitesRecentes.forEach((_, i) => {
        values[i] = new Animated.Value(0);
      });
    }
    return values;
  }, [child?.activitesRecentes]);

  // Function setActivityDateRange
  const setActivityDateRange = (range: { startDate: string | null; endDate: string | null }) => {
    if (range.startDate === null && range.endDate === null) {
      resetActivityFilters();
    }
  };

  // Animation à l'initialisation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const setShowActivityCalendar = (value: boolean) => {
    if (value === showActivityCalendar) return;
    toggleActivityCalendar('start');
  };

  // Récupérer les types d'assistants uniques
  useEffect(() => {
    if (child && child.activitesRecentes) {
      const assistantTypes = getUniqueAssistantTypes();
      setUniqueAssistantTypes(assistantTypes);
    }
  }, [child, getUniqueAssistantTypes]);

  useEffect(() => {
    console.log("Filtres actuels:", {
      searchKeyword,
      dateRange: activityDateRange,
      assistantTypes: advancedFilters.selectedAssistants
    });
    console.log("Nombre d'activités après filtrage:", filteredActivities.length);
  }, [searchKeyword, activityDateRange, advancedFilters.selectedAssistants, filteredActivities]);

  // Réinitialiser à la première page quand les résultats filtrés changent
  useEffect(() => {
    setCurrentPage(1);
  }, [advancedFilters.selectedAssistants, activityDateRange, searchKeyword]);

  // Function pour réinitialiser les filtres
  const resetAllFilters = () => {
    resetActivityFilters();
  };

  // Définition de currentActivities avec une vérification de filteredActivities
  const indexOfLastActivity = currentPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  const currentActivities = React.useMemo(() => {
    return filteredActivities ? filteredActivities.slice(indexOfFirstActivity, indexOfLastActivity) : [];
  }, [filteredActivities, indexOfFirstActivity, indexOfLastActivity]);

  const setSelectedAssistantTypes = (updater: (prev: string[]) => string[]) => {
    const newAssistants = updater(advancedFilters.selectedAssistants);
    setAdvancedFilters({ selectedAssistants: newAssistants });
  };

  const totalPages = Math.ceil((filteredActivities?.length || 0) / activitiesPerPage);

  useEffect(() => {
    // Si la page actuelle dépasse le nombre total de pages, revenir à la dernière page
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [filteredActivities, activitiesPerPage, currentPage, totalPages]);

  // Animer les items lorsque la page change
  useEffect(() => {
    // Réinitialiser les animations quand on change de page
    const animations = currentActivities.map((_, index) => {
      const itemIndex = indexOfFirstActivity + index;
      if (!itemAnimValues[itemIndex]) {
        itemAnimValues[itemIndex] = new Animated.Value(0);
      }
      return Animated.timing(itemAnimValues[itemIndex], {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true
      });
    });

    if (animations.length > 0) {
      Animated.stagger(50, animations).start();
    }
  }, [currentPage, filteredActivities, currentActivities, indexOfFirstActivity, itemAnimValues]);

  // Gestion du bouton de retour
  const handleBack = () => {
    router.back();
  };

  // Seulement vérifier les données de l'enfant avant de renvoyer une UI différente
  if (!child) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: dark ? COLORS.white : COLORS.black }}>Données non disponibles</Text>
      </View>
    );
  }

  // Rendu de l'en-tête (uniquement si pas utilisé comme composant d'onglet)
  const renderHeader = () => {
    if (isTabComponent) return null;
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} color={dark ? COLORS.white : COLORS.black} />
        </TouchableOpacity>
        <View style={styles.childInfoHeader}>
          <Text style={[styles.pageTitle, { color: dark ? COLORS.white : COLORS.black }]}>
            Historique d&apos;activités
          </Text>
          <Text style={[styles.childName, { color: dark ? COLORS.secondaryWhite : COLORS.gray3 }]}>
            {child.name} • {child.classe}
          </Text>
        </View>
      </View>
    );
  };

  // Remplacez la fonction renderFilterModal complète par ceci :
  const renderFilterModal = () => {
    return (
      <FilterModal
        showActivityCalendar={showActivityCalendar}
        toggleActivityCalendar={toggleActivityCalendar}
        dark={dark}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        uniqueAssistantTypes={uniqueAssistantTypes}
        selectedAssistantTypes={advancedFilters.selectedAssistants}
        setSelectedAssistantTypes={setSelectedAssistantTypes}
        activityCalendarMode={activityCalendarMode}
        activityDateRange={activityDateRange}
        handleActivityDayPress={handleActivityDayPress}
        resetAllFilters={resetAllFilters}
        availableSubjects={availableSubjects}
        availableChapters={availableChapters}
        availableExercises={availableExercises}
        advancedFilters={advancedFilters}
        setAdvancedFilters={setAdvancedFilters}
      />
    );
  };


  // Rendu d'un élément d'activité
  const renderActivityItem = ({ item, index }: { item: Activity, index: number }) => {
    const enhancedActivity = enhanceActivity(item);
    const activityTheme = getActivityTheme(item);
    const itemAnimValue = itemAnimValues[indexOfFirstActivity + index] || new Animated.Value(1);

    // Extraction de la date pour un affichage plus lisible
    const dateObj = new Date(item.date);
    const formattedDate = dateObj.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
    const dayName = dateObj.toLocaleDateString('fr-FR', { weekday: 'short' });

    return (
      <Animated.View
        style={{
          opacity: itemAnimValue,
          transform: [{
            translateY: itemAnimValue.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            })
          }]
        }}
      >
        <View style={[
          styles.activityItem,
          index < currentActivities.length - 1 && styles.activityItemBorder,
          { paddingVertical: 14 }
        ]}>
          <View style={styles.activityDate}>
            <LinearGradient
              colors={activityTheme.assistant.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 6 }}
            >
              <FontAwesomeIcon icon={activityTheme.assistant.icon} color="#FFF" />
            </LinearGradient>
            <Text style={[{ fontSize: 16, fontWeight: '600', color: dark ? COLORS.white : COLORS.black, textAlign: 'center' }]}>{formattedDate}</Text>
            <Text style={[{ fontSize: 12, color: dark ? COLORS.secondaryWhite : COLORS.gray3, textAlign: 'center' }]}>{dayName}</Text>
          </View>
          <View style={styles.activityDetails}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <LinearGradient
                colors={activityTheme.subject.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                  marginRight: 8
                }}
              >
                <FontAwesomeIcon icon={activityTheme.subject.icon} color="#FFF" />
              </LinearGradient>
              <Text style={[styles.activityTitle, { color: dark ? COLORS.white : COLORS.black, flex: 1 }]}>{item.activite}</Text>
            </View>
            <View style={styles.activityMeta}>
              <FontAwesomeIcon icon={faClock} color={COLORS.primary} />
              <Text style={[styles.metaText, { color: dark ? COLORS.secondaryWhite : COLORS.gray3 }]}>{item.duree}</Text>
              {item.score && (
                <>
                  <FontAwesomeIcon icon={faStar} color={COLORS.primary} style={{ marginLeft: 12 }} />
                  <Text style={[styles.metaText, { color: dark ? COLORS.secondaryWhite : COLORS.gray3 }]}>{item.score}</Text>
                </>
              )}
            </View>
            {enhancedActivity.commentaires && (
              <View style={[
                styles.commentSection,
                { backgroundColor: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)', padding: 10, borderRadius: 8, marginTop: 8 }
              ]}>
                <Text style={[styles.commentText, { color: dark ? COLORS.secondaryWhite : COLORS.gray3 }]}>{enhancedActivity.commentaires}</Text>
              </View>
            )}
            {enhancedActivity.recommandations && enhancedActivity.recommandations.length > 0 && (
              <View style={styles.recommendationsSection}>
                <Text style={[styles.recommendationsTitle, { color: dark ? COLORS.white : COLORS.black, marginTop: 8, marginBottom: 4 }]}>Recommandations:</Text>
                {enhancedActivity.recommandations.map((rec, recIndex) => (
                  <View key={recIndex} style={[
                    styles.recommendationItem,
                    { marginTop: 2 }
                  ]}>
                    <FontAwesomeIcon icon={faCheckCircle} color={COLORS.primary} style={{ marginRight: 6 }} />
                    <Text style={[
                      styles.recommendationText,
                      { color: dark ? COLORS.secondaryWhite : COLORS.gray3 }
                    ]}>
                      {rec}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Nouvelle section Voir les détails */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
                paddingVertical: 8,
                backgroundColor: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                borderRadius: 8
              }}
              onPress={() => {
                // Navigate to activity details page
                router.push({
                  pathname: "/Enfants/Historique/historydetails",
                  params: {
                    activityId: item.id, // Assuming each activity has a unique id
                    childId: child?.id  // Pass child ID if needed
                  }
                });
              }}
            >
              <Text style={{
                color: COLORS.primary,
                fontWeight: '600',
                marginRight: 8
              }}>
                Voir les détails
              </Text>
              <FontAwesomeIcon
                icon={faChevronRight}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

// Dans la fonction renderContent(), remplacez la pagination actuelle par celle-ci:

const renderContent = () => {
  // Créer une référence au FlatList
  
  // Fonction pour gérer le changement de page
  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage) return;
    setCurrentPage(newPage);
    
    // Faire défiler vers le haut après le changement de page
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ offset: 0, animated: true });
      }
    }, 100);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Première partie avec les filtres (inchangée) */}
      <View style={[
        {
          marginHorizontal: isTabComponent ? 16 : 0,
          marginTop: isTabComponent ? 16 : 0,
          marginBottom: 10,
          backgroundColor: dark ? COLORS.dark1 : COLORS.white,
          borderRadius: 12,
          padding: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2
        }
      ]}>
        <SearchBar
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          dark={dark}
          activityDateRange={activityDateRange}
          toggleActivityCalendar={() => toggleActivityCalendar('start')}
          resetAllFilters={resetAllFilters}
          hasFilters={searchKeyword !== "" || activityDateRange.startDate !== null || advancedFilters.selectedAssistants.length > 0}
        />

        <AssistantTypeFilters
          uniqueAssistantTypes={uniqueAssistantTypes}
          selectedAssistantTypes={advancedFilters.selectedAssistants}
          setSelectedAssistantTypes={setSelectedAssistantTypes}
          dark={dark}
        />

        <DateRangeIndicator
          activityDateRange={activityDateRange}
          setActivityDateRange={setActivityDateRange}
          dark={dark}
        />
      </View>
      
      {/* Liste des activités avec la pagination en haut */}
      <View style={[
        {
          flex: 1,
          marginHorizontal: isTabComponent ? 16 : 0,
          marginBottom: isTabComponent ? 16 : 0,
          backgroundColor: dark ? COLORS.dark1 : COLORS.white,
          borderRadius: 12,
          overflow: 'hidden',
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2
        }
      ]}>    
        <FlatList
          ref={flatListRef}
          data={currentActivities}
          renderItem={renderActivityItem}
          keyExtractor={(item, index) => `activity-${index}`}
          contentContainerStyle={{ 
            padding: 16 , 
            paddingBottom: isTabComponent ? 80 : 16 // Augmenter le padding bottom si c'est un composant d'onglet

            
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 30 }}>
              <FontAwesomeIcon icon={faHourglassEmpty} color={dark ? '#555' : '#ccc'} />
              <Text style={{ marginTop: 16, color: dark ? COLORS.secondaryWhite : COLORS.gray3, fontWeight: '500' }}>Aucune activité trouvée</Text>
            </View>
          )}
          extraData={[currentPage, filteredActivities.length]}
        />

{/* Ajouter cet espace tampon en bas pour éviter le chevauchement avec les tabs */}
{isTabComponent && (
  <View style={{
    height: 50, // Ajustez cette hauteur selon vos besoins
    width: '100%',
    backgroundColor: 'transparent'
  }} />
)}

{/* Pagination en bas au lieu du haut */}
{totalPages > 1 && (
  <View style={{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1, // Changé de borderBottomWidth à borderTopWidth
    borderTopColor: dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)', // Changé de borderBottomColor à borderTopColor
    position: isTabComponent ? 'absolute' : 'relative', // Position absolue si c'est un composant d'onglet
    bottom: isTabComponent ? 50 : 0, // Positionnez au-dessus des onglets
    left: 0,
    right: 0,
    backgroundColor: dark ? COLORS.dark1 : COLORS.white, // Fond assorti
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  }}>
            {/* Bouton précédent */}
            <TouchableOpacity
              style={{
                width: 36,
                height: 36,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 18,
                backgroundColor: currentPage === 1
                  ? (dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)')
                  : (dark ? 'rgba(0, 149, 255, 0.2)' : 'rgba(0, 149, 255, 0.1)'),
              }}
              onPress={() => {
                if (currentPage > 1) {
                  handlePageChange(currentPage - 1);
                }
              }}
              disabled={currentPage <= 1}
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                color={currentPage === 1 ? (dark ? '#666' : '#ccc') : COLORS.primary}
                size={14}
              />
            </TouchableOpacity>

            {/* Numéros de page - version compacte */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
              marginHorizontal: 8
            }}>
              <Text style={{
                fontSize: 13,
                fontWeight: '600',
                color: dark ? COLORS.white : COLORS.black
              }}>
                {currentPage} / {totalPages}
              </Text>
            </View>

            {/* Bouton suivant */}
            <TouchableOpacity
              style={{
                width: 36,
                height: 36,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 18,
                backgroundColor: currentPage === totalPages
                  ? (dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')
                  : (dark ? 'rgba(0, 149, 255, 0.2)' : 'rgba(0, 149, 255, 0.1)'),
              }}
              onPress={() => {
                if (currentPage < totalPages) {
                  handlePageChange(currentPage + 1);
                }
              }}
              disabled={currentPage >= totalPages}
            >
              <FontAwesomeIcon
                icon={faArrowRight}
                color={currentPage === totalPages ? (dark ? '#666' : '#ccc') : COLORS.primary}
                size={14}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};
  // Rendu conditionnel selon le mode d'utilisation (standalone ou onglet)
  if (isTabComponent) {
    return (
      <>
        {renderContent()}
        {renderFilterModal()}
      </>
    );
  }

  return (
    <SafeAreaView style={[
      styles.safeArea,
      { backgroundColor: colors.background }
    ]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        {renderContent()}
        {renderFilterModal()}
      </View>
    </SafeAreaView>
  );
};

export default HistoriqueActivites;