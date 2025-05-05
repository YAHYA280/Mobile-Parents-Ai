import type { ColorValue, DimensionValue } from 'react-native';

import { useRouter } from "expo-router";
import { Dimensions } from 'react-native';
import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClose, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { View, Text, Modal, Alert, Share, TextInput, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";

import type { Child} from "../../../data/Enfants/CHILDREN_DATA";

import FilterModal from './FilterComponents';
import { COLORS } from "../../../constants/theme";
import { useActivityFilters } from "./activityFilters";
import { useTheme } from "../../../theme/ThemeProvider";
import PerfomancesStyles from "../../../styles/PerfomancesStyles";
import { CHILDREN_DATA } from "../../../data/Enfants/CHILDREN_DATA";

const { width, height } = Dimensions.get('window');

// Utility function to get progress color
function getProgressColor(progress: number) {
  if (progress < 30) return '#FC4E00';   // Rouge
  if (progress <= 50) return '#EBB016';  // Orange
  if (progress <= 70) return '#F3BB00';  // Jaune
  return '#24D26D';                      // Vert
}

export interface PerformanceComponentProps {
  isTabComponent?: boolean;
  childData: Child;  // Obligatoire maintenant
}

interface FeedbackItem {
  id: string;
  text: string;
  date: string;
  childName: string;
  filters: {
    assistants: string[];
    subjects: string[];
    dateRange: any;
  };
}

const PerformanceHome: React.FC<PerformanceComponentProps> = ({ childData , isTabComponent  }) => {
  const router = useRouter();
  const { dark, colors } = useTheme();
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState("");

  // State for selected child
  const selectedChild = childData;
  const [feedback, setFeedback] = useState("");
  const [showFeedbackSection, setShowFeedbackSection] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>([]);

  // Utilisation du hook useActivityFilters
  const {
    advancedFilters,
    activityDateRange,
    filteredActivities,
    setAdvancedFilters,
    handleActivityDayPress,
    resetActivityFilters,
    toggleActivityCalendar,
    activityCalendarMode,
    showActivityCalendar
  } = useActivityFilters(selectedChild.activitesRecentes);

  // Filter modal state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  // Get unique subjects for filtering
  const availableSubjects = useMemo(() => {
    const subjects = new Set<string>();
    CHILDREN_DATA.forEach(child => {
      child.subjects.forEach(subject => {
        subjects.add(subject.name);
      });
    });
    return Array.from(subjects);
  }, []);

  // Get unique assistants for filtering
  const availableAssistants = useMemo(() => {
    const assistants = new Set<string>(["J'Apprends", "Accueil", "Recherche"]);
    return Array.from(assistants);
  }, []);

  // Fonction pour gérer l'exportation PDF
  const handleExportPDF = async () => {
    try {
      // Ici, dans une implémentation réelle, vous utiliserez une bibliothèque
      // comme 'react-native-html-to-pdf' pour générer le PDF

      // Pour l'instant, simulation avec Share
      await Share.share({
        message: `Rapport de performance pour ${selectedChild.name} - Performance globale: ${calculatePerformance().averagePercentage}%`,
        title: `Rapport de performance - ${selectedChild.name}`
      });
    } catch (error) {
      console.error("Erreur lors de l'exportation:", error);
    }
  };

  // Fonction pour enregistrer le feedback
  const saveFeedback = () => {
    if (feedback.trim() === "") return;

    const newFeedback: FeedbackItem = {
      id: Date.now().toString(),
      text: feedback,
      date: new Date().toLocaleDateString(),
      childName: selectedChild.name,
      filters: {
        assistants: advancedFilters.selectedAssistants,
        subjects: advancedFilters.selectedSubjects,
        dateRange: activityDateRange
      }
    };

    setFeedbackHistory([newFeedback, ...feedbackHistory]);
    setFeedback("");
  };

  // Function to open feedback edit/delete modal
  const openFeedbackModal = (feedbackItem: FeedbackItem) => {
    setSelectedFeedback(feedbackItem);
    setEditingFeedback(feedbackItem.text);
    setShowFeedbackModal(true);
  };

  // Function to update feedback
  const updateFeedback = () => {
    if (!selectedFeedback || editingFeedback.trim() === "") return;

    const updatedFeedbackHistory = feedbackHistory.map(item =>
      item.id === selectedFeedback.id
        ? { ...item, text: editingFeedback, date: new Date().toLocaleDateString() }
        : item
    );

    setFeedbackHistory(updatedFeedbackHistory);
    setShowFeedbackModal(false);
  };

  // Function to delete feedback
  const deleteFeedback = () => {
    if (!selectedFeedback) return;

    Alert.alert(
      "Supprimer la recommandations",
      "Êtes-vous sûr de vouloir supprimer cette recommandations ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            const updatedFeedbackHistory = feedbackHistory.filter(
              item => item.id !== selectedFeedback.id
            );
            setFeedbackHistory(updatedFeedbackHistory);
            setShowFeedbackModal(false);
          }
        }
      ]
    );
  };

  // Performance calculation function based on filtered activities
  const calculatePerformance = () => {
    if (!selectedChild) return { averagePercentage: "0", subjectPerformance: {}, recentActivities: [] };

    // Performance calculation logic
    let totalScore = 0;
    let totalPossible = 0;
    const subjectPerformance: {[key: string]: {total: number, possible: number}} = {};

    filteredActivities.forEach(activity => {
      if (!activity.score || !activity.score.includes('/')) return;

      const [score, possible] = activity.score.split('/').map(num => parseInt(num, 10));

      totalScore += score;
      totalPossible += possible;

      if (activity.matiere) {
        if (!subjectPerformance[activity.matiere]) {
          subjectPerformance[activity.matiere] = { total: 0, possible: 0 };
        }
        subjectPerformance[activity.matiere].total += score;
        subjectPerformance[activity.matiere].possible += possible;
      }
    });

    const averagePercentage = totalPossible > 0
      ? ((totalScore / totalPossible) * 100).toFixed(1)
      : "0";

    return {
      averagePercentage,
      subjectPerformance,
      recentActivities: filteredActivities.slice(0, 3)
    };
  };

  // Render performance details
  const renderPerformanceDetails = () => {
    const performance = calculatePerformance();

    return (
      <View style={PerfomancesStyles.performanceDetailsContainer}>
        <View style={PerfomancesStyles.performanceHeader}>
          <Text style={[PerfomancesStyles.performanceTitle, { color: dark ? COLORS.white : COLORS.black }]}>
            Performance de {selectedChild.name}
          </Text>
        </View>

        {/* Global Performance */}
        <View style={[PerfomancesStyles.globalPerformanceContainer, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
          <Text style={[PerfomancesStyles.globalPerformanceTitle, { color: dark ? COLORS.white : COLORS.black }]}>
            Performance globale
          </Text>
          <View style={PerfomancesStyles.progressContainer}>
            <View
              style={[
                PerfomancesStyles.progressBar,
                {
                  width: `${parseFloat(performance.averagePercentage)}%`,
                  backgroundColor: getProgressColor(parseFloat(performance.averagePercentage))
                }
              ]}
            />
            <Text style={[PerfomancesStyles.progressText, { color: dark ? COLORS.white : COLORS.black }]}>
              {performance.averagePercentage}%
            </Text>
          </View>
        </View>

        <View style={PerfomancesStyles.buttonContainer}>
          {/* Bouton Filtres avancés placé ici - après la performance globale */}
          <TouchableOpacity
            style={[PerfomancesStyles.advancedFilterButton ,{ backgroundColor: dark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(213, 205, 205, 0.5)' }
            ]}
            onPress={toggleFilterModal}
          >
            <Text style={[PerfomancesStyles.advancedFilterButtonText, { color: dark ? COLORS.white : COLORS.black }]}>
              Filtres avancés
            </Text>
          </TouchableOpacity>

          {/* Bouton Réinitialiser avancés placé ici */}
          <TouchableOpacity
            style={[
              PerfomancesStyles.cancelButton,
              { backgroundColor: dark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(213, 205, 205, 0.5)' }
            ]}
            onPress={() => {
              resetActivityFilters();
            }}
          >
            <Text style={[PerfomancesStyles.advancedFilterButtonText, { color: dark ? COLORS.white : COLORS.black }]}>
              Réinitialiser
            </Text>
          </TouchableOpacity>
        </View>

        {/* Subject Performance */}
        <View style={[PerfomancesStyles.subjectPerformanceContainer , { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
          <Text style={[PerfomancesStyles.subjectPerformanceTitle, { color: dark ? COLORS.white : COLORS.black }]}>
            Performance par matière
          </Text>
          {Object.entries(performance.subjectPerformance).map(([subject, data], index) => {
            const percentage = ((data.total / data.possible) * 100).toFixed(1);
            return (
              <View key={index} style={PerfomancesStyles.subjectPerformanceItem}>
                <Text style={[PerfomancesStyles.subjectName, { color: dark ? COLORS.white : COLORS.black }]}>{subject}</Text>
                <View style={PerfomancesStyles.progressContainer}>
                  <View
                    style={[
                      PerfomancesStyles.progressBar,
                      {
                        width: `${parseFloat(percentage)}%` as DimensionValue,
                        backgroundColor: getProgressColor(parseFloat(percentage)) as ColorValue
                      }
                    ]}
                  />
                  <Text style={[PerfomancesStyles.progressText, { color: dark ? COLORS.white : COLORS.black }]}>{percentage}%</Text>
                </View>
              </View>
            );
          })}
        </View>
{/* Simplified Dashboard Section */}
<View style={PerfomancesStyles.dashboardSection}>
  <Text style={[PerfomancesStyles.sectionTitle, { color: dark ? COLORS.white : COLORS.black }]}>
    Dashboard
  </Text>
  <View style={[PerfomancesStyles.dashboardContainer, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
    {/* Simple dashboard charts */}
    <View style={[PerfomancesStyles.simpleDashboard, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
      <View style={[PerfomancesStyles.dashboardChart, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
        <Text style={[PerfomancesStyles.chartTitle, { color: dark ? COLORS.primary : COLORS.dark1 }]}>
          Engagement
        </Text>
        <View style={[PerfomancesStyles.chartPlaceholderCustom , { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
          {/* Affichage du score d'engagement */}
          <Text style={[PerfomancesStyles.metricValue, { color: dark ? COLORS.white : COLORS.black }]}>
            {selectedChild?.engagementScore ? `${selectedChild.engagementScore.toFixed(1)}%` : 'N/A'}
          </Text>
        </View>
      </View>
      <View style={[PerfomancesStyles.dashboardChart, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
        <Text style={[PerfomancesStyles.chartTitle, { color: dark ? COLORS.primary : COLORS.dark1 }]}>
          Évolution
        </Text>
        <View style={[PerfomancesStyles.chartPlaceholderCustom , { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
          {/* Affichage du taux d'évolution avec seulement le symbole + ou - coloré */}
          {selectedChild?.evolutionRate !== undefined ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                {selectedChild.evolutionRate !== 0 && (
                  <Text
                    style={[
                      PerfomancesStyles.metricSymbol,
                      {
                        color: selectedChild.evolutionRate > 0
                          ? COLORS.success
                          : COLORS.error
                      }
                    ]}
                  >
                    {selectedChild.evolutionRate > 0 ? '+' : '-'}
                  </Text>
                )}
                <Text
                  style={[
                    PerfomancesStyles.metricValue,
                    { color: dark ? COLORS.white : COLORS.dark1 }
                  ]}
                >
                  {Math.abs(selectedChild.evolutionRate).toFixed(1)}%
                </Text>
              </View>
          ) : (
            <Text style={[PerfomancesStyles.metricValue, { color: dark ? COLORS.primary : COLORS.dark1 }]}>
              N/A
            </Text>
          )}
        </View>
      </View>
    </View>
  </View>
</View>
        {/* Detailed Dashboard */}
        <View style={[PerfomancesStyles.detailedDashboard, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
          <View style={PerfomancesStyles.dashboardHeader}>
            <Text style={[PerfomancesStyles.detailedDashboardTitle, { color: dark ? COLORS.white : COLORS.black }]}>
              Dashboard détaillé
            </Text>
          </View>

          {/* Assistant usage chart */}
          <View style={PerfomancesStyles.chartRow}>
            <View style={[PerfomancesStyles.dashboardChartFull, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
              <Text style={[PerfomancesStyles.chartTitle, { color: COLORS.primary }]}>
                Utilisation des assistants
              </Text>
              <View style={PerfomancesStyles.chartPlaceholder}>
                {/* Placeholder for assistant usage chart */}
              </View>
            </View>
          </View>

{/* Score evolution chart */}
<View style={PerfomancesStyles.chartRow}>
            <View style={[PerfomancesStyles.dashboardChartFull, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
              <Text style={[PerfomancesStyles.chartTitle, { color: COLORS.primary }]}>
                Évolution des scores
              </Text>
              <View style={PerfomancesStyles.chartPlaceholder}>
                {/* Placeholder for score evolution chart */}
              </View>
            </View>
          </View>

          {/* Time by exercise type chart - only shown by default or when J'Apprends assistant is selected */}
          {(advancedFilters.selectedAssistants.length === 0 ||
            (advancedFilters.selectedAssistants.includes("J'Apprends") &&
            !advancedFilters.selectedAssistants.some(assistant => assistant !== "J'Apprends"))) && (
            <View style={PerfomancesStyles.chartRow}>
              <View style={[PerfomancesStyles.dashboardChartFull, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
                <Text style={[PerfomancesStyles.chartTitle, { color: COLORS.primary }]}>
                  Temps par type d&apos;exercice
                </Text>
                <View style={PerfomancesStyles.chartPlaceholder}>
                  {/* Placeholder for time by exercise type chart */}
                </View>
              </View>
            </View>
          )}

          {/* Progress by assistant chart */}
          <View style={PerfomancesStyles.chartRow}>
            <View style={[PerfomancesStyles.dashboardChartFull, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
              <Text style={[PerfomancesStyles.chartTitle, { color: COLORS.primary }]}>
                Progrès par assistant
              </Text>
              <View style={PerfomancesStyles.chartPlaceholder}>
                {/* Placeholder for progress by assistant chart */}
              </View>
            </View>
          </View>
          {/* Feedback Section */}
          <View style={[PerfomancesStyles.feedbackContainer, {
            backgroundColor: dark ? COLORS.dark1 : COLORS.white,
            marginTop: 20
          }]}>
            <Text style={[PerfomancesStyles.feedbackTitle, {
              color: dark ? COLORS.white : COLORS.black,
              alignSelf: 'flex-start',
              marginBottom: 10
            }]}>
              Recommandations
            </Text>
             {/* Ajouter un feedback */}
             <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
              borderRadius: 8,
              padding: 8
            }}>
              <TextInput
                placeholder="Ajouter une recommandation..."
                placeholderTextColor={dark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'}
                value={feedback}
                onChangeText={setFeedback}
                multiline
                style={{
                  flex: 1,
                  color: dark ? COLORS.white : COLORS.black,
                  paddingHorizontal: 8
                }}
              />
              <TouchableOpacity
                onPress={saveFeedback}
                style={{
                  padding: 8,
                  backgroundColor: COLORS.primary,
                  borderRadius: 8
                }}
                disabled={feedback.trim() === ''}
              >
                <FontAwesomeIcon icon={faPaperPlane} size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Historique des feedbacks */}
            {feedbackHistory.length > 0 && (
              <View style={PerfomancesStyles.feedbackHistoryContainer}>
                <Text style={[PerfomancesStyles.feedbackHistoryTitle, { color: dark ? COLORS.white : COLORS.black, marginTop: 15, marginBottom: 10 }]}>
                  Historique des recommandations
                </Text>

                {feedbackHistory.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => openFeedbackModal(item)}
                    style={[PerfomancesStyles.feedbackItem, {
                      backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                      padding: 10,
                      borderRadius: 5,
                      marginBottom: 10
                    }]}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontWeight: 'bold', color: dark ? COLORS.white : COLORS.black }}>{item.date}</Text>
                      {item.filters.assistants.length > 0 && (
                        <Text style={{ color: COLORS.primary, fontSize: 12 }}>
                          {item.filters.assistants.join(', ')}
                        </Text>
                      )}
                    </View>
                    <Text style={{ color: dark ? COLORS.white : COLORS.black, marginTop: 5 }}>{item.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Bouton Exporter */}
          <TouchableOpacity
            style={[PerfomancesStyles.exportButton, { backgroundColor: COLORS.secondary, marginVertical: 10 }]}
            onPress={handleExportPDF}
          >
            <Text style={[PerfomancesStyles.advancedFilterButtonText, { color: COLORS.white }]}>
              Exporter PDF
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render feedback edit/delete modal
  const renderFeedbackModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent
        visible={showFeedbackModal}
        onRequestClose={() => setShowFeedbackModal(false)}
      >
        <View style={PerfomancesStyles.modalOverlay}>
          <View style={PerfomancesStyles.modalContainer}>
            <View style={PerfomancesStyles.modalHeader}>
              <Text style={PerfomancesStyles.modalTitle}>Modifier la recommandation</Text>
              <TouchableOpacity
                style={PerfomancesStyles.closeModalButton}
                onPress={() => setShowFeedbackModal(false)}
              >
                <FontAwesomeIcon icon={faClose} size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>

            <View style={PerfomancesStyles.feedbackInputContainer}>
              <TextInput
                style={[
                  PerfomancesStyles.feedbackInput,
                  {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.gray,
                    color: dark ? COLORS.white : COLORS.black,
                    borderColor: COLORS.gray,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    height: 100,
                    textAlignVertical: 'top'
                  }
                ]}
                placeholder="Modifiez votre recommandations ..."
                placeholderTextColor={dark ? COLORS.white : COLORS.white}
                multiline
                value={editingFeedback}
                onChangeText={setEditingFeedback}
              />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <TouchableOpacity
                  style={[
                    PerfomancesStyles.modalButton,
                    PerfomancesStyles.deleteButton,
                    { backgroundColor: COLORS.error }
                  ]}
                  onPress={deleteFeedback}
                >
                  <Text style={{ color: COLORS.white }}>Supprimer</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    PerfomancesStyles.modalButton,
                    PerfomancesStyles.applyButton
                  ]}
                  onPress={updateFeedback}
                >
                  <Text style={{ color: COLORS.white }}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

// Render advanced filter modal
const renderFilterModal = () => {
  return (
    <FilterModal
    showFilterModal={showFilterModal}
    toggleFilterModal={toggleFilterModal}
    advancedFilters={advancedFilters}
    activityDateRange={activityDateRange}
    showActivityCalendar={showActivityCalendar}
    activityCalendarMode={activityCalendarMode}
    availableSubjects={availableSubjects}
    availableAssistants={availableAssistants}
    toggleActivityCalendar={toggleActivityCalendar}
    handleActivityDayPress={handleActivityDayPress}
    setAdvancedFilters={setAdvancedFilters}
    resetActivityFilters={resetActivityFilters}
  />
  );
};
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
    <View style={PerfomancesStyles.header} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 40 }}
        showsVerticalScrollIndicator
      >
        {renderPerformanceDetails()}
      </ScrollView>
      {renderFeedbackModal()}
      {renderFilterModal()}
    </SafeAreaView>
  );
};

export default PerformanceHome;
