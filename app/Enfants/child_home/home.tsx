import { Calendar } from 'react-native-calendars';
import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { View, Text, Modal, TextInput, ScrollView, TouchableOpacity } from "react-native";

import type { Child} from "../../../data/Enfants/CHILDREN_DATA";

import { COLORS } from "../../../constants/theme";
import { useTheme } from "../../../theme/ThemeProvider";
import { useActivityFilters } from "./activityFilters1";
import enfantsStyles from "../../../styles/EnfantsStyles";
import CHILDREN_DATA, { EXERCISES_DATA } from "../../../data/Enfants/CHILDREN_DATA";

type DateRange = {
  startDate: string | null;
  endDate: string | null;
};

function getProgressColor(progress: number) {
  if (progress < 30) {
    return '#FC4E00';
  }

  if (progress <= 50) {
    return '#EBB016';
  }

  if (progress <= 70) {
    return '#F3BB00';
  }

  return '#24D26D';
}

const ChildHome = () => {
  const { childId } = useLocalSearchParams();
  const router = useRouter();
  const [childData, setChildData] = useState<Child | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("semaine");
  const { dark, colors } = useTheme();

  const [dateRange, setDateRange] = useState<DateRange>({ startDate: null, endDate: null });
  const [selectedAssistants, setSelectedAssistants] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMode, setCalendarMode] = useState<'start' | 'end'>('start');
  const [markedDates, setMarkedDates] = useState<{[date: string]: any}>({});

  const assistants = ["Accueil", "J'Apprends", "Recherche"];
  const subjects = ["Mathématiques", "Français", "Histoire", "Sciences", "Anglais"];

  const isJApprendsSelected = selectedAssistants.includes("J'Apprends");
  const [currentPage, setCurrentPage] = useState(1);
  const [showActivities, setShowActivities] = useState(false);

  const activitiesPerPage = 3;

  const {
    activityDateRange,
    searchKeyword,
    showActivityCalendar,
    activityCalendarMode,
    filteredActivities,
    setSearchKeyword,
    toggleActivityCalendar,
    handleActivityDayPress,
    resetActivityFilters
  } = useActivityFilters(childData?.activitesRecentes || []);

  useEffect(() => {
    if (childId) {
      const foundChild = CHILDREN_DATA.find(c => c.id === parseInt(childId as string, 10)) || null;
      setChildData(foundChild);
    }
  }, [childId]);

  useEffect(() => {
    if (!isJApprendsSelected) {
      setSelectedSubjects([]);
      setSelectedExercises([]);
    }
  }, [isJApprendsSelected]);

  useEffect(() => {
    const newMarkedDates: {[date: string]: any} = {};
    if (dateRange.startDate) {
      newMarkedDates[dateRange.startDate] = {
        selected: true,
        startingDay: true,
        color: COLORS.primary
      };
    }
    if (dateRange.endDate) {
      newMarkedDates[dateRange.endDate] = {
        selected: true,
        endingDay: true,
        color: COLORS.primary
      };
    }
    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      if (start.getTime() < end.getTime()) {
        const currentDate = new Date(start);
        currentDate.setDate(currentDate.getDate() + 1);
        while (currentDate.getTime() < end.getTime()) {
          const dateString = currentDate.toISOString().split('T')[0];
          newMarkedDates[dateString] = {
            selected: true,
            color: `${COLORS.primary}80`
          };
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    }
    setMarkedDates(newMarkedDates);
  }, [dateRange]);

  const getAvailableExercises = () => {
    if (selectedSubjects.length === 0) return [];

    const allExercises: string[] = [];
    selectedSubjects.forEach(subject => {
      if (EXERCISES_DATA[subject as keyof typeof EXERCISES_DATA]) {
        allExercises.push(...EXERCISES_DATA[subject as keyof typeof EXERCISES_DATA]);
      }
    });
    return Array.from(new Set(allExercises));
  };

  if (!childData) {
    return (
      <View style={enfantsStyles.container}>
        <Text style={enfantsStyles.loadingText}>Chargement des données...</Text>
      </View>
    );
  }

  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
  };

  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  const toggleCalendar = (mode: 'start' | 'end') => {
    setCalendarMode(mode);
    setShowCalendar(!showCalendar);
  };

  const handleDayPress = (day: any) => {
    if (calendarMode === 'start') {
      setDateRange({
        startDate: day.dateString,
        endDate: dateRange.endDate && new Date(day.dateString) > new Date(dateRange.endDate)
          ? day.dateString
          : dateRange.endDate
      });
    } else {
      setDateRange({
        startDate: dateRange.startDate && new Date(day.dateString) < new Date(dateRange.startDate)
          ? day.dateString
          : dateRange.startDate,
        endDate: day.dateString
      });
    }
    setShowCalendar(false);
  };

  const toggleAssistantSelection = (assistant: string) => {
    if (selectedAssistants.includes(assistant)) {
      setSelectedAssistants(selectedAssistants.filter(a => a !== assistant));
    } else {
      setSelectedAssistants([...selectedAssistants, assistant]);
    }
  };

  const toggleSubjectSelection = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
      const subjectExercises = EXERCISES_DATA[subject as keyof typeof EXERCISES_DATA] || [];
      setSelectedExercises(selectedExercises.filter(e => !subjectExercises.includes(e)));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const toggleExerciseSelection = (exercise: string) => {
    if (selectedExercises.includes(exercise)) {
      setSelectedExercises(selectedExercises.filter(e => e !== exercise));
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const applyFilters = () => {
    console.log("Filtres appliqués:", {
      dateRange,
      selectedAssistants,
      selectedSubjects,
      selectedExercises
    });
    toggleFilterModal();
  };

  const toggleActivities = () => {
    setShowActivities(!showActivities);
  };

  const resetFilters = () => {
    setDateRange({ startDate: null, endDate: null });
    setSelectedAssistants([]);
    setSelectedSubjects([]);
    setSelectedExercises([]);
  };

  return (
    <ScrollView style={enfantsStyles.container}>
      <View style={enfantsStyles.header}>
        <TouchableOpacity
          style={enfantsStyles.backButton}
          onPress={() => router.back()}
        >
          <Text style={enfantsStyles.backButtonText}>
            <FontAwesomeIcon icon="arrow-left" size={16} color={COLORS.white} /> Retour
          </Text>
        </TouchableOpacity>
        <View style={enfantsStyles.childInfoHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesomeIcon icon="user" size={24} color={COLORS.primary} style={{ marginRight: 8 }} />
            <Text style={[enfantsStyles.childName, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>
              {childData.name}
            </Text>
          </View>
          <View style={[enfantsStyles.childMetadata, { alignSelf: 'flex-start', marginTop: 10 }]}>
            <View style={enfantsStyles.metadataItem}>
              <FontAwesomeIcon icon="calendar" size={14} color={COLORS.white} />
              <Text style={enfantsStyles.metadataText}>{childData.age} ans</Text>
            </View>
            <View style={enfantsStyles.metadataDivider} />
            <View style={enfantsStyles.metadataItem}>
              <FontAwesomeIcon icon="book" size={14} color={COLORS.white} />
              <Text style={enfantsStyles.metadataText}>Classe: {childData.classe}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={enfantsStyles.dashboardSection}>
        <Text style={enfantsStyles.sectionTitle}>
          Progression globale
        </Text>
        <View style={enfantsStyles.dashboardContainer}>
          <View style={enfantsStyles.progressContainer}>
            <View
              style={[
                enfantsStyles.progressBar,
                {
                  width: `${parseInt(childData.progress, 10)}%`,
                  backgroundColor: getProgressColor(parseInt(childData.progress, 10))
                }
              ]}
            />
            <Text style={enfantsStyles.progressText}>
              {childData.progress}
            </Text>
          </View>
          <View style={enfantsStyles.simpleDashboard}>
            <View style={enfantsStyles.dashboardChart}>
              <Text style={enfantsStyles.chartTitle}>
                Progrès globale
              </Text>
              <View style={enfantsStyles.chartPlaceholderCustom} />
            </View>
            <View style={enfantsStyles.dashboardChart}>
              <Text style={enfantsStyles.chartTitle}>
                Assiduité
              </Text>
              <View style={enfantsStyles.chartPlaceholderCustom} />
            </View>
          </View>
          <TouchableOpacity
            style={[enfantsStyles.actionButton, { marginTop: 10, flexDirection: 'row', alignItems: 'center' }]}
            onPress={toggleDashboard}
          >
            <Text style={enfantsStyles.actionButtonText}>
              {showDashboard ? "Masquer les détails" : "Voir les détails"}
            </Text>
            <FontAwesomeIcon
              icon={showDashboard ? "chevron-up" : "chevron-down"}
              size={16}
              color={COLORS.white}
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      {showDashboard && (
        <View style={enfantsStyles.detailedDashboard}>
          <View style={enfantsStyles.dashboardHeader}>
            <Text style={enfantsStyles.detailedDashboardTitle}>
              Dashboard détaillé
            </Text>
            <View style={enfantsStyles.filterContainer} />
            <View style={enfantsStyles.filterButtonsRow}>
              <TouchableOpacity
                style={enfantsStyles.advancedFilterButton}
                onPress={toggleFilterModal}
              >
                <Text style={enfantsStyles.advancedFilterButtonText}>
                  Filtres
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={enfantsStyles.resetFilterButton}
                onPress={resetFilters}
              >
                <Text style={enfantsStyles.resetFilterButtonText}>
                  Réinitialiser
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={enfantsStyles.chartRow}>
            <View style={enfantsStyles.dashboardChartFull}>
              <Text style={enfantsStyles.chartTitle}>
                Performance par matière
              </Text>
              <View style={enfantsStyles.chartPlaceholder} />
            </View>
          </View>
          <View style={enfantsStyles.chartRow}>
            <View style={enfantsStyles.dashboardChartFull}>
              <Text style={enfantsStyles.chartTitle}>
                Utilisation des assistants
              </Text>
              <View style={enfantsStyles.chartPlaceholder} />
            </View>
          </View>
          <View style={enfantsStyles.chartRow}>
            <View style={enfantsStyles.dashboardChartFull}>
              <Text style={enfantsStyles.chartTitle}>
                Évolution des scores
              </Text>
              <View style={enfantsStyles.chartPlaceholder} />
            </View>
          </View>
          {selectedAssistants.includes("J'Apprends") && (
            <View style={enfantsStyles.chartRow}>
              <View style={enfantsStyles.dashboardChartFull}>
                <Text style={enfantsStyles.chartTitle}>
                  Temps par type d&apos;exercice
                </Text>
                <View style={enfantsStyles.chartPlaceholder} />
              </View>
            </View>
          )}
          <View style={enfantsStyles.chartRow}>
            <View style={enfantsStyles.dashboardChartFull}>
              <Text style={enfantsStyles.chartTitle}>
                Progrès par assistant
              </Text>
              <View style={enfantsStyles.chartPlaceholder} />
            </View>
          </View>
        </View>
      )}
      <View style={enfantsStyles.subjectsSection}>
        <Text style={enfantsStyles.sectionTitle}>Points forts</Text>
        <View style={enfantsStyles.subjectsList}>
          {childData.matieresFortes.map((matiere, index) => (
            <View key={index} style={[enfantsStyles.subjectTag, { backgroundColor: COLORS.greeen }]}>
              <Text style={enfantsStyles.subjectTagText}>{matiere}</Text>
            </View>
          ))}
        </View>
        <Text style={[enfantsStyles.sectionTitle, { marginTop: 16 }]}>Points à améliorer</Text>
        <View style={enfantsStyles.subjectsList}>
          {childData.matieresAmeliorer.map((matiere, index) => (
            <View key={index} style={[enfantsStyles.subjectTag, { backgroundColor: COLORS.red }]}>
              <Text style={enfantsStyles.subjectTagText}>{matiere}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={enfantsStyles.activitiesSection}>
        <View style={enfantsStyles.sectionTitleRow}>
          <TouchableOpacity
            style={[enfantsStyles.actionButton,
              {
                marginTop: 0,
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1
              }
            ]}
            onPress={toggleActivities}
          >
            <Text style={enfantsStyles.actionButtonText}>
              {showActivities ? "Masquer Historique des activités" : "Voir Historique des activités"}
            </Text>
            <FontAwesomeIcon
              icon={showActivities ? "chevron-up" : "chevron-down"}
              size={16}
              color={COLORS.white}
              style={{ marginLeft: 15 }}
            />
          </TouchableOpacity>
        </View>
        {showActivities && (
          <View style={enfantsStyles.activitiesContainer}>
            <View style={enfantsStyles.activityFilters}>
              <View style={enfantsStyles.searchBarContainer}>
                <FontAwesomeIcon icon="search" size={18} color={COLORS.white} style={{ marginRight: 8 }} />
                <TextInput
                  style={enfantsStyles.searchInput}
                  placeholder="Rechercher par mot-clé..."
                  placeholderTextColor="white"
                  value={searchKeyword}
                  onChangeText={setSearchKeyword}
                />
                {searchKeyword && (
                  <TouchableOpacity onPress={() => setSearchKeyword("")}>
                    <FontAwesomeIcon icon="times" size={18} color={COLORS.black} />
                  </TouchableOpacity>
                )}
              </View>
              <View style={enfantsStyles.activityDateFilters}>
                <View style={enfantsStyles.dateFilterRow}>
                  <View style={enfantsStyles.dateInput}>
                    <Text style={enfantsStyles.dateInputLabel}>Date début</Text>
                    <TouchableOpacity
                      style={enfantsStyles.dateInputField}
                      onPress={() => toggleActivityCalendar('start')}
                    >
                      <Text style={enfantsStyles.dateInputText}>
                        {activityDateRange.startDate || "JJ/MM/AAAA"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={enfantsStyles.dateInput}>
                    <Text style={enfantsStyles.dateInputLabel}>Date fin</Text>
                    <TouchableOpacity
                      style={enfantsStyles.dateInputField}
                      onPress={() => toggleActivityCalendar('end')}
                    >
                      <Text style={enfantsStyles.dateInputText}>
                        {activityDateRange.endDate || "JJ/MM/AAAA"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={enfantsStyles.resetActivityFiltersButton}
                  onPress={resetActivityFilters}
                >
                  <Text style={enfantsStyles.resetFilterButtonText}>
                    Réinitialiser les filtres
                  </Text>
                </TouchableOpacity>
              </View>
              {showActivityCalendar && (
                <View style={enfantsStyles.calendarContainer}>
                  <Calendar
                    markedDates={{
                      ...(activityDateRange.startDate ? {
                        [activityDateRange.startDate]: {
                          selected: true,
                          startingDay: true,
                          color: COLORS.primary
                        }
                      } : {}),
                      ...(activityDateRange.endDate ? {
                        [activityDateRange.endDate]: {
                          selected: true,
                          endingDay: true,
                          color: COLORS.primary
                        }
                      } : {})
                    }}
                    onDayPress={handleActivityDayPress}
                    markingType="period"
                    theme={{
                      selectedDayBackgroundColor: COLORS.primary,
                      todayTextColor: COLORS.primary,
                      arrowColor: COLORS.primary,
                    }}
                  />
                </View>
              )}
            </View>
            <View style={enfantsStyles.activitiesList}>
              {filteredActivities.length > 0 ? (
                filteredActivities
                  .slice((currentPage - 1) * activitiesPerPage, currentPage * activitiesPerPage)
                  .map((activite, index) => (
                    <TouchableOpacity
                      key={`activity-${index}`}
                      style={enfantsStyles.activityCard}
                      onPress={() => router.push(`/Enfants/Historique/home?childId=${childId}&activityId=${(currentPage - 1) * activitiesPerPage + index}`)}
                    >
                      <View style={enfantsStyles.activityCardHeader}>
                        <Text style={enfantsStyles.activityDate}>{activite.date}</Text>
                        {activite.score && (
                          <View style={enfantsStyles.scoreContainer}>
                            <Text style={enfantsStyles.scoreText}>{activite.score}</Text>
                          </View>
                        )}
                      </View>
                      <View style={enfantsStyles.activityCardContent}>
                        <Text style={enfantsStyles.activityTitle}>{activite.activite}</Text>
                        <Text style={enfantsStyles.activityDuration}>Durée: {activite.duree}</Text>
                      </View>
                      <View style={enfantsStyles.activityCardFooter}>
                        <Text style={enfantsStyles.viewDetailsText}>Voir les détails</Text>
                        <FontAwesomeIcon icon="chevron-right" size={16} color={COLORS.primary} />
                      </View>
                    </TouchableOpacity>
                  ))
              ) : (
                <View style={enfantsStyles.noResultsContainer}>
                  <Text style={enfantsStyles.noResultsText}>
                    Aucune activité ne correspond à votre recherche
                  </Text>
                </View>
              )}
            </View>
            <View style={enfantsStyles.paginationControls}>
              <TouchableOpacity
                style={[
                  enfantsStyles.paginationButton,
                  currentPage === 1 && enfantsStyles.paginationButtonDisabled
                ]}
                onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <FontAwesomeIcon icon="chevron-left" size={18} color={currentPage === 1 ? "#ccc" : COLORS.primary} />
              </TouchableOpacity>
              <Text style={enfantsStyles.paginationText}>
                Page {currentPage} / {Math.max(1, Math.ceil(filteredActivities.length / activitiesPerPage))}
              </Text>
              <TouchableOpacity
                style={[
                  enfantsStyles.paginationButton,
                  currentPage === Math.ceil(filteredActivities.length / activitiesPerPage) && enfantsStyles.paginationButtonDisabled
                ]}
                onPress={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredActivities.length / activitiesPerPage)))}
                disabled={currentPage === Math.ceil(filteredActivities.length / activitiesPerPage) || filteredActivities.length === 0}
              >
                <FontAwesomeIcon icon="chevron-right" size={18} color={currentPage === Math.ceil(filteredActivities.length / activitiesPerPage) || filteredActivities.length === 0 ? "#ccc" : COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <Modal
        animationType="slide"
        transparent
        visible={showFilterModal}
        onRequestClose={toggleFilterModal}
      >
        <View style={enfantsStyles.modalOverlay}>
          <View style={enfantsStyles.modalContainer}>
            <View style={enfantsStyles.modalHeader}>
              <Text style={enfantsStyles.modalTitle}>Filtres avancés</Text>
            </View>
            <ScrollView contentContainerStyle={enfantsStyles.modalScrollContentContainer}>
              <View style={enfantsStyles.filterSection}>
                <Text style={enfantsStyles.filterSectionTitle}>Période</Text>
                <View style={enfantsStyles.dateRangeContainer}>
                  <View style={enfantsStyles.dateInput}>
                    <Text style={enfantsStyles.dateInputLabel}>Date début</Text>
                    <TouchableOpacity
                      style={enfantsStyles.dateInputField}
                      onPress={() => toggleCalendar('start')}
                    >
                      <Text style={enfantsStyles.dateInputText}>
                        {dateRange.startDate || "JJ/MM/AAAA"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={enfantsStyles.dateInput}>
                    <Text style={enfantsStyles.dateInputLabel}>Date fin</Text>
                    <TouchableOpacity
                      style={enfantsStyles.dateInputField}
                      onPress={() => toggleCalendar('end')}
                    >
                      <Text style={enfantsStyles.dateInputText}>
                        {dateRange.endDate || "JJ/MM/AAAA"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {showCalendar && (
                  <View style={enfantsStyles.calendarContainer}>
                    <Calendar
                      markedDates={markedDates}
                      onDayPress={handleDayPress}
                      markingType="period"
                      theme={{
                        selectedDayBackgroundColor: COLORS.primary,
                        todayTextColor: COLORS.primary,
                        arrowColor: COLORS.primary,
                      }}
                    />
                  </View>
                )}
              </View>
              <View style={enfantsStyles.filterSection}>
                <Text style={enfantsStyles.filterSectionTitle}>Assistant</Text>
                <View style={enfantsStyles.filterOptionsList}>
                  {assistants.map((assistant, index) => (
                    <TouchableOpacity
                      key={`assistant-${index}`}
                      style={enfantsStyles.filterOptionButton}
                      onPress={() => toggleAssistantSelection(assistant)}
                    >
                      <View style={enfantsStyles.checkboxContainer}>
                        <View style={[
                          enfantsStyles.checkbox,
                          selectedAssistants.includes(assistant) && enfantsStyles.checkboxSelected
                        ]}>
                          {selectedAssistants.includes(assistant) && (
                            <FontAwesomeIcon icon="check" size={14} color="#FFFFFF" />
                          )}
                        </View>
                        <Text style={enfantsStyles.filterOptionText}>
                          {assistant}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {isJApprendsSelected && (
                <View style={enfantsStyles.filterSection}>
                  <Text style={enfantsStyles.filterSectionTitle}>Matières</Text>
                  <View style={enfantsStyles.filterOptionsList}>
                    {subjects.map((subject, index) => (
                      <TouchableOpacity
                        key={`subject-${index}`}
                        style={enfantsStyles.filterOptionButton}
                        onPress={() => toggleSubjectSelection(subject)}
                      >
                        <View style={enfantsStyles.checkboxContainer}>
                          <View style={[
                            enfantsStyles.checkbox,
                            selectedSubjects.includes(subject) && enfantsStyles.checkboxSelected
                          ]}>
                            {selectedSubjects.includes(subject) && (
                              <FontAwesomeIcon icon="check" size={14} color="#FFFFFF" />
                            )}
                          </View>
                          <Text style={enfantsStyles.filterOptionText}>
                            {subject}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
              {isJApprendsSelected && selectedSubjects.length > 0 && (
                <View style={enfantsStyles.filterSection}>
                  <Text style={enfantsStyles.filterSectionTitle}>Exercices</Text>
                  <View style={enfantsStyles.filterOptionsList}>
                    {getAvailableExercises().map((exercise, index) => (
                      <TouchableOpacity
                        key={`exercise-${index}`}
                        style={enfantsStyles.filterOptionButton}
                        onPress={() => toggleExerciseSelection(exercise)}
                      >
                        <View style={enfantsStyles.checkboxContainer}>
                          <View style={[
                            enfantsStyles.checkbox,
                            selectedExercises.includes(exercise) && enfantsStyles.checkboxSelected
                          ]}>
                            {selectedExercises.includes(exercise) && (
                              <FontAwesomeIcon icon="check" size={14} color="#FFFFFF" />
                            )}
                          </View>
                          <Text style={enfantsStyles.filterOptionText}>
                            {exercise}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>
            <View style={enfantsStyles.modalFooter}>
              <TouchableOpacity
                style={[enfantsStyles.modalButton, enfantsStyles.cancelButton]}
                onPress={toggleFilterModal}
              >
                <Text style={enfantsStyles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[enfantsStyles.modalButton, enfantsStyles.applyButton]}
                onPress={applyFilters}
              >
                <Text style={enfantsStyles.applyButtonText}>Appliquer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
export default ChildHome;
