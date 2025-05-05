import { StyleSheet, Dimensions } from 'react-native';

import { COLORS } from '../constants/theme';

const { width } = Dimensions.get('window');

const recommandationStyles = StyleSheet.create({
  // Add these styles for the summary section
summary: {
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 16,
  marginBottom: 20,
  elevation: 3,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},
summaryTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 10,
},
summaryText: {
  fontSize: 14,
  color: '#555',
  lineHeight: 20,
},

// Add these styles for the recommendations section
recommendationsContainer: {
  marginBottom: 20,
},
recommendationsTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 16,
},
noRecommendations: {
  padding: 20,
  backgroundColor: '#f8f9fa',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#e9ecef',
  alignItems: 'center',
},
noRecommendationsText: {
  fontSize: 15,
  color: '#6c757d',
  textAlign: 'center',
},

// Recommendation card styles
recommendationCard: {
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 16,
  marginBottom: 12,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
},
recommendationHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
},
recommendationHeaderLeft: {
  flexDirection: 'row',
  alignItems: 'center',
},
recommendationSubject: {
  fontSize: 16,
  fontWeight: 'bold',
  marginLeft: 8,
  color: '#333',
},
recommendationContent: {
  marginTop: 8,
},
recommendationType: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
},
recommendationTypeText: {
  fontSize: 14,
  marginLeft: 6,
  fontWeight: '500',
  color: '#555',
},
recommendationMessage: {
  fontSize: 14,
  color: '#333',
  marginBottom: 12,
  lineHeight: 20,
},
recommendationMeta: {
  marginTop: 6,
},
recommendationMetaTitle: {
  fontSize: 13,
  fontWeight: '600',
  color: '#555',
  marginBottom: 4,
},
recommendationMetaText: {
  fontSize: 13,
  color: '#666',
  lineHeight: 18,
},
recommendationFooter: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 12,
  paddingTop: 8,
  borderTopWidth: 1,
  borderTopColor: '#eee',
},
recommendationDate: {
  fontSize: 12,
  color: '#888',
},
recommendationAssistant: {
  fontSize: 12,
  fontWeight: '500',
  color: COLORS.primary,
},

// Filter modal styles
modalContent: {
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 20,
  width: '90%',
  maxHeight: '80%',
},
filterOptions: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 8,
},
filterOption: {
  backgroundColor: '#f1f3f5',
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 20,
  marginRight: 8,
  marginBottom: 8,
},
filterOptionSelected: {
  backgroundColor: COLORS.primary,
},
filterOptionText: {
  fontSize: 14,
  color: '#495057',
},
filterOptionTextSelected: {
  color: '#fff',
},
exercicesScrollView: {
  maxHeight: 150,
},
filterActions: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 20,
},
resetButton: {
  backgroundColor: '#f1f3f5',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
},
resetButtonText: {
  color: '#495057',
  fontSize: 15,
  fontWeight: '500',
},
applyButton: {
  backgroundColor: COLORS.primary,
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
},
applyButtonText: {
  color: '#fff',
  fontSize: 15,
  fontWeight: '500',
},

// Date picker styles
datePickerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
},
datePickerLabel: {
  fontSize: 14,
  color: '#333',
  width: 40,
},
datePickerButton: {
  flexGrow: 1,
  backgroundColor: '#f1f3f5',
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 8,
},
datePickerButtonText: {
  fontSize: 14,
  color: '#495057',
},
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  
  // Carte de résumé des performances
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  globalScoreContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: COLORS.primary,
  },
  scoreText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  subjectScoresContainer: {
    marginTop: 16,
  },
  subjectScoreRow: {
    marginBottom: 16,
  },
  subjectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  subjectComment: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    marginLeft: 30,
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    marginTop: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  
  // Section des recommandations
  recommendationsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 40,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  gravityBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  gravityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardContent: {
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  suggestionButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  exerciseBadgesContainer: {
    flexDirection: 'row',
  },
  exerciseBadge: {
    backgroundColor: '#f1f3f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 6,
  },
  exerciseBadgeText: {
    fontSize: 12,
    color: '#495057',
  },
  
  // Section de plan d'amélioration
  improvementPlanSection: {
    marginBottom: 30,
  },
  improvementPlanCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  improvementPlanTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  objectiveItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
  },
  objectiveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  objectiveTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  objectiveProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  objectiveProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    marginRight: 10,
  },
  objectiveProgress: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  objectiveProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    width: 40,
    textAlign: 'right',
  },
  objectiveDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  exerciseSchedule: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  exerciseDaySchedule: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  exerciseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  
  // Messages pour aucun résultat
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  noResultsText: {
    fontSize: 15,
    color: '#6c757d',
    textAlign: 'center',
  },
  
  // Styles pour les options de filtre dans le modal
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  filterOptionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOptionButton: {
    marginRight: 12,
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
  },
  // Styles pour le modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalScrollContentContainer: {
    padding: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f3f5',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#495057',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default recommandationStyles;