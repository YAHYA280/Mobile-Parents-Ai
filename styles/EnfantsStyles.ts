import { StyleSheet } from "react-native";

import { FONTS, SIZES, COLORS } from "../constants/theme";

export const enfantsStyles = StyleSheet.create({
// Styles pour la page des recommandations
centerContent: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},
loadingText: {
  fontSize: 18,
  fontWeight: 'bold',
  marginTop: 15,
  color: COLORS.primary,
  textAlign: 'center',
},
loadingSubText: {
  fontSize: 14,
  color: COLORS.gray,
  textAlign: 'center',
  marginTop: 8,
},
errorText: {
  fontSize: 16,
  color: COLORS.red,
  textAlign: 'center',
  marginTop: 20,
},
pageTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: COLORS.primary,
  marginBottom: 5,
},
searchFilterContainer: {
  flexDirection: 'row',
  marginHorizontal: 15,
  marginVertical: 10,
  alignItems: 'center',
},
searchContainer: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F5F5F5',
  borderRadius: 8,
  paddingHorizontal: 10,
  height: 45,
},
searchIcon: {
  marginRight: 8,
},
 
filterButton: {
  backgroundColor: COLORS.primary,
  width: 45,
  height: 45,
  borderRadius: 8,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 10,
},
activeFiltersContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginHorizontal: 15,
  marginBottom: 10,
  alignItems: 'center',
},
activeFiltersText: {
  fontSize: 14,
  color: COLORS.gray,
  marginRight: 10,
},
activeFilterBadge: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: COLORS.primary,
  borderRadius: 15,
  paddingHorizontal: 10,
  paddingVertical: 5,
  marginRight: 10,
  marginBottom: 5,
},
activeFilterText: {
  color: '#FFFFFF',
  fontSize: 12,
  marginRight: 5,
},
removeFilterButton: {
  width: 16,
  height: 16,
  borderRadius: 8,
  backgroundColor: 'rgba(255,255,255,0.3)',
  justifyContent: 'center',
  alignItems: 'center',
},
resetFiltersButton: {
  marginLeft: 'auto',
},
resetFiltersText: {
  color: COLORS.primary,
  fontSize: 14,
},
recommendationsContainer: {
  padding: 15,
},
emptyStateContainer: {
  alignItems: 'center',
  justifyContent: 'center',
  padding: 30,
},
emptyStateTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: COLORS.gray,
  marginTop: 15,
  textAlign: 'center',
},
emptyStateText: {
  fontSize: 14,
  color: COLORS.gray,
  textAlign: 'center',
  marginTop: 8,
  marginBottom: 20,
},
resetButton: {
  borderWidth: 1,
  borderColor: COLORS.primary,
  borderRadius: 8,
  paddingHorizontal: 15,
  paddingVertical: 8,
},
resetButtonText: {
  color: COLORS.primary,
  fontSize: 14,
},
recommendationCard: {
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
  marginBottom: 15,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 3,
  overflow: 'hidden',
},
recommendationHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#F0F0F0',
},
typeBadge: {
  paddingHorizontal: 10,
  paddingVertical: 3,
  borderRadius: 12,
},
typeBadgeText: {
  color: '#FFFFFF',
  fontSize: 12,
  fontWeight: 'bold',
},
favoriteButton: {
  padding: 5,
},
recommendationContent: {
  padding: 12,
},
recommendationTitleRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  marginBottom: 8,
},
recommendationTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#212121',
  flex: 1,
},
newBadge: {
  backgroundColor: '#FF5722',
  borderRadius: 3,
  paddingHorizontal: 6,
  paddingVertical: 2,
  marginLeft: 8,
},
newBadgeText: {
  color: '#FFFFFF',
  fontSize: 10,
  fontWeight: 'bold',
},
recommendationDescription: {
  fontSize: 14,
  color: '#424242',
  lineHeight: 20,
  marginBottom: 10,
},
tagsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
},
tagBadge: {
  backgroundColor: '#F0F0F0',
  borderRadius: 15,
  paddingHorizontal: 8,
  paddingVertical: 4,
  marginRight: 8,
  marginBottom: 5,
},
tagText: {
  fontSize: 12,
  color: '#616161',
},
premiumBadge: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FEF9E7',
  borderRadius: 15,
  paddingHorizontal: 8,
  paddingVertical: 4,
  marginBottom: 5,
},
premiumText: {
  fontSize: 12,
  color: '#B7950B',
  marginLeft: 3,
},
recommendationFooter: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 12,
  borderTopWidth: 1,
  borderTopColor: '#F0F0F0',
},
viewDetailsText: {
  fontSize: 14,
  color: COLORS.primary,
},
closeButton: {
  padding: 5,
},
modalContent: {
  padding: 15,
  maxHeight: 400,
},
filterSectionTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: COLORS.primary,
  marginBottom: 10,
  marginTop: 5,
},
filterOption: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 12,
  paddingHorizontal: 10,
  borderRadius: 8,
},
selectedFilterOption: {
  backgroundColor: 'rgba(33, 150, 243, 0.1)',
},
filterOptionText: {
  fontSize: 14,
  color: COLORS.white,
},
selectedFilterOptionText: {
  color: COLORS.primary,
  fontWeight: 'bold',
},
filterDivider: {
  height: 1,
  backgroundColor: '#F0F0F0',
  marginVertical: 15,
},
checkboxOption: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 12,
  paddingHorizontal: 10,
},
checkbox: {
  width: 22,
  height: 22,
  borderRadius: 4,
  borderWidth: 2,
  borderColor: COLORS.white,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 10,
},
checkboxSelected: {
  backgroundColor: COLORS.primary,
  borderColor: COLORS.primary,
},
checkboxText: {
  fontSize: 14,
  color: '#424242',
},
modalFooter: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 15,
  borderTopWidth: 1,
  borderTopColor: '#F0F0F0',
},
applyButton: {
  backgroundColor: COLORS.primary,
  borderRadius: 8,
  paddingHorizontal: 20,
  paddingVertical: 10,
},
applyButtonText: {
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: 'bold',
},
detailModalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 15,
},
detailFavoriteButton: {
  padding: 5,
},
detailModalContent: {
  padding: 15,
  maxHeight: 500,
},
detailTypeContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 15,
},
detailNewBadge: {
  backgroundColor: '#FF5722',
  borderRadius: 3,
  paddingHorizontal: 6,
  paddingVertical: 2,
  marginLeft: 10,
},
detailPremiumBadge: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FEF9E7',
  borderRadius: 15,
  paddingHorizontal: 8,
  paddingVertical: 4,
  marginLeft: 10,
},
detailTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#212121',
  marginBottom: 15,
},
detailDescription: {
  fontSize: 15,
  color: '#424242',
  lineHeight: 22,
  marginBottom: 20,
},
detailTagsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginBottom: 20,
},
detailTagBadge: {
  backgroundColor: '#F0F0F0',
  borderRadius: 15,
  paddingHorizontal: 8,
  paddingVertical: 4,
  marginRight: 8,
  marginBottom: 5,
},
detailDivider: {
  height: 1,
  backgroundColor: '#E0E0E0',
  marginVertical: 20,
},
benefitsContainer: {
  marginBottom: 20,
},
benefitsTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#212121',
  marginBottom: 15,
},
benefitItem: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  marginBottom: 12,
},
benefitBullet: {
  width: 22,
  height: 22,
  borderRadius: 11,
  backgroundColor: COLORS.primary,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 10,
  marginTop: 2,
},
benefitText: {
  fontSize: 14,
  color: '#424242',
  flex: 1,
  lineHeight: 20,
},
implementationContainer: {
  marginBottom: 20,
},
implementationTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#212121',
  marginBottom: 15,
},
implementationStep: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  marginBottom: 15,
},
stepNumberContainer: {
  width: 26,
  height: 26,
  borderRadius: 13,
  backgroundColor: COLORS.primary,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 10,
},
stepNumber: {
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: 'bold',
},
stepText: {
  fontSize: 14,
  color: '#424242',
  flex: 1,
  lineHeight: 20,
},
detailModalFooter: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 15,
  borderTopWidth: 1,
  borderTopColor: '#F0F0F0',
},
shareButton: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: COLORS.primary,
  borderRadius: 8,
  paddingHorizontal: 15,
  paddingVertical: 10,
},
shareButtonText: {
  color: COLORS.primary,
  fontSize: 14,
  marginLeft: 5,
},
applyRecommendationButton: {
  backgroundColor: COLORS.primary,
  borderRadius: 8,
  paddingHorizontal: 15,
  paddingVertical: 10,
},
applyRecommendationText: {
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: 'bold',
},
activityFilters: {
  marginBottom: 15,
  borderRadius: 8,
  backgroundColor: COLORS.black,
  padding: 12,
},
searchBarContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: COLORS.black,
  borderRadius: 8,
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderWidth: 1,
  borderColor: '#e0e0e0',
  marginBottom: 12,
},
searchInput: {
  flex: 1,
  fontSize: 16,
  backgroundColor: 'black', // Couleur de fond noire
  paddingVertical: 6,
  color: 'white', // Couleur du texte en blanc
  borderRadius: 8,  // Coins arrondis
  paddingHorizontal: 8, // Espace à l'intérieur du champ
},
activityDateFilters: {
  backgroundColor: COLORS.black,
  marginTop: 8,
},
dateFilterRow: {
  backgroundColor: COLORS.black,
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 12,
},
resetActivityFiltersButton: {
  backgroundColor: COLORS.primary,
  borderRadius: 6,
  padding: 10,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: COLORS.primary,
},
noResultsContainer: {
  padding: 20,
  alignItems: 'center',
  justifyContent: 'center',
},
noResultsText: {
  fontSize: 16,
  color: COLORS.gray,
  textAlign: 'center',
},
// Overlay du modal (plein écran avec arrière-plan semi-transparent)
modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)',
},
assistantTagText: {
  color: COLORS.white,
  fontSize: 14,
  fontWeight: '500',
},
// Styles pour les sections de détails d'activité
activityDetailSection: {
  marginBottom: 15,
  borderBottomWidth: 1,
  borderBottomColor: '#f0f0f0',
  paddingBottom: 12,
},

activityDetailLabel: {
  fontSize: 14,
  fontWeight: 'bold',
  color: COLORS.gray,
  marginBottom: 5,
},

activityDetailValue: {
  fontSize: 16,
  color: COLORS.black,
  fontWeight: '500',
},

activityDetailDescription: {
  fontSize: 15,
  color: COLORS.black,
  lineHeight: 20,
  textAlign: 'justify',
},

// Style pour tag d'assistant
assistantTag: {
  backgroundColor: COLORS.primary,
  paddingVertical: 5,
  paddingHorizontal: 10,
  borderRadius: 15,
  alignSelf: 'flex-start',
  marginTop: 3,
},
sectionTitleRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
},
activitiesContainer: {
  backgroundColor: COLORS.black,
  width: '100%',
},
// Style pour tag de matière dans le modal (si pas déjà défini ailleurs)
subjectTag: {
  backgroundColor: COLORS.secondary,
  paddingVertical: 5,
  paddingHorizontal: 10,
  borderRadius: 15,
  alignSelf: 'flex-start',
  marginTop: 3,
},

subjectTagText: {
  color: COLORS.white,
  fontSize: 14,
  fontWeight: '500',
},

modalContainer: {
  backgroundColor: COLORS.black,
  borderRadius: 20,
  padding: 20,
  width: '90%',
  maxHeight: '85%', // Limite la hauteur du modal
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},

modalHeader: {
  borderBottomWidth: 1,
  borderBottomColor: '#f0f0f0',
  padding: 15,
  backgroundColor: COLORS.black,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',

},

modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: COLORS.primary,
  textAlign: 'center',
},

modalScrollContentContainer: {
  padding: 15,
},
modalButton: {
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
  minWidth: 100,
  alignItems: 'center',
},

cancelButton: {
  backgroundColor: '#f5f5f5',
  borderWidth: 1,
  borderColor: '#e0e0e0',
},
cancelButtonText: {
  color: COLORS.black,
  fontWeight: '500',
},
// Section de filtres
filterSection: {
  marginBottom: 20,
},
// Style pour les options de filtre
filterOptionsList: {
  color: COLORS.white,
  flexDirection: 'row',
  flexWrap: 'wrap',
},

filterOptionButton: {
  color: COLORS.white,
  marginRight: 10,
  marginBottom: 10,
},

// Conteneur pour les inputs de date
dateRangeContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 10,
},

dateInput: {
  backgroundColor: COLORS.black,
  borderRadius: 8,
  padding: 10,
  width: '50%',
},

dateInputLabel: {
  fontSize: 14,
  marginBottom: 5,
  color: COLORS.white,
},

dateInputField: {
  borderWidth: 1,
  borderColor: COLORS.black,
  borderRadius: 8,
  padding: 10,
  backgroundColor: COLORS.black,
  color: COLORS.white,
},

dateInputText: {
  color: COLORS.white,
  fontSize: 11, // Taille du texte (ajustez cette valeur selon vos besoins)
},

// Style pour le conteneur de checkbox
checkboxContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 8,
},
// Conteneur pour le calendrier
calendarContainer: {
  marginTop: 10,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: '#e0e0e0',
  borderRadius: 8,
  overflow: 'hidden',
},
  childInfoHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  // Style pour le contenu défilable du modal
  modalScrollContent: {
    flex: 1,
    marginBottom: 15, // Espace pour les boutons d'action
  },
  
  // Style pour le conteneur d'overlay
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
  },
  
  // Style pour le ScrollView à l'intérieur de la modal
  modalScrollView: {
    flex: 1,
    width: '100%',
    marginBottom: 10, // Espace pour les boutons du bas
  },
 
  childMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  
  metadataText: {
    fontSize: 14,
    color: COLORS.white,
    marginLeft: 5,
    fontWeight: '500',
  },
  
  metadataDivider: {
    width: 1,
    height: 14,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: 8,
  },
  activitiesTable: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    marginHorizontal: 16,
  },
  chartRow: {
    marginBottom: 16,
    width: '100%',
  },
  
  dashboardChartFull: {
    backgroundColor: COLORS.black,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  // Ajouter ces styles à votre fichier enfantsStyles.js
activitiesList: {
  marginTop: 10,
},
activityCard: {
  backgroundColor : COLORS.black,
  borderRadius: 12,
  marginBottom: 12,
  padding: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},
activityCardHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 8,
},
activityDate: {
  fontSize: 14,
  color : COLORS.white,
},
scoreContainer: {
  backgroundColor: `${COLORS.primary}10`, // Version transparente de la couleur primaire
  paddingHorizontal: 10,
  paddingVertical: 3,
  borderRadius: 10,
},
scoreText: {
  fontSize: 14,
  fontWeight: "bold",
  color: COLORS.primary,
},
activityCardContent: {
  color : COLORS.white,
  marginBottom: 12,
},
activityTitle: {
  color : COLORS.white,
  fontSize: 16,
  fontWeight: "600",
  marginBottom: 4,
},
activityDuration: {
  color : COLORS.white,
  fontSize: 14,
},
activityCardFooter: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: 8,
  borderTopWidth: 1,
  borderTopColor: "#f0f0f0",
},
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  
  tableHeaderCell: {
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.black,
    paddingHorizontal: 5,
  },
  
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  
  tableCell: {
    fontSize: 14,
    color: COLORS.text,
    paddingHorizontal: 5,
  },
  
  tableActionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  
  tableActionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Styles pour les contrôles de pagination
paginationControls: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 16,
  marginBottom: 10,
},
paginationButton: {
  padding: 8,
  borderWidth: 1,
  borderColor: COLORS.black,
  borderRadius: 4,
  marginHorizontal: 10,
},
paginationButtonDisabled: {
  borderColor: COLORS.black,
  backgroundColor : COLORS.black,
},
paginationText: {
  fontSize: 14,
  color: COLORS.primary,
},
  // Container et styles généraux
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding3,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale700,
  },
  backButton: {
    padding: SIZES.base,
  },
  backButtonText: {
    ...FONTS.h4,
    color: COLORS.white,
    borderWidth: 1,         // Épaisseur de la bordure
    borderColor: COLORS.primary, // Couleur de la bordure
    padding: 10,           // Espace à l'intérieur du rectangle
    borderRadius: 15,       // Coins arrondis pour le rectangle
    backgroundColor: COLORS.primary, // Couleur de fond du rectangle
    textAlign: 'center',   // Centre le texte à l'intérieur du rectangle
  },  
  childName: {
    ...FONTS.h2,
    color: COLORS.white,
    flex: 1,
    textAlign: 'center',
    marginRight: 30,
  },
  
  // Dashboard section
  dashboardSection: {
    padding: SIZES.padding3,
    backgroundColor: COLORS.black,
    margin: SIZES.padding3,
    borderRadius: SIZES.radius / 2.5,
  },
  dashboardContainer: {
    width: '100%',
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.white,
    marginBottom: SIZES.padding2,
  },
  progressContainer: {
    height: 25,
    backgroundColor: COLORS.grayscale400,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: SIZES.base,
    position: 'relative',
  },
  progressBar: {
    height: '200%',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  progressText: {
    position: 'absolute',
    right: 10,
    top: 0,
    ...FONTS.body4,
    color: COLORS.white,
  },
  childInfo: {
    ...FONTS.body4,
    color: COLORS.gray3,
    marginBottom: SIZES.padding2,
  },
  simpleDashboard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  
  // Dashboard charts
  dashboardChart: {
    flex: 1,
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius / 3,
    padding: SIZES.padding2,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  dashboardChartLarge: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius / 3,
    padding: SIZES.padding2,
    borderWidth: 1,
    borderColor: COLORS.grayscale700,
    marginBottom: SIZES.padding2,
  },
  dashboardChartMedium: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius / 3,
    padding: SIZES.padding2,
    borderWidth: 1,
    borderColor: COLORS.grayscale700,
  },
  chartTitle: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  chartPlaceholder: {
    height: 250,
    backgroundColor: COLORS.gray,
    borderRadius: SIZES.radius / 1.5,
  },
  chartPlaceholderCustom: {
    height: 100, // Exemple de hauteur différente
    backgroundColor: COLORS.grayscale400, // Autre couleur de fond
    borderRadius: SIZES.radius / 3, // Bord arrondi différent
    padding: 10, // Ajout d'un padding
  },
  // Detailed dashboard
  detailedDashboard: {
    padding: SIZES.padding3,
    margin: SIZES.padding3,
    marginTop: 0,
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius / 2.5,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  dashboardHeader: {
    marginBottom: SIZES.padding2,
  },
  detailedDashboardTitle: {
    ...FONTS.h3,
    color: COLORS.white,
    marginBottom: SIZES.base,
    textAlign: 'center', 
   },
  
  // Filter styles
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.base,
  },
  filterLabel: {
    ...FONTS.body4,
    marginRight: SIZES.base,
  },
  activeFilter: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    ...FONTS.body4,
  },
  filterButtonsRow: {
    backgroundColor: COLORS.black,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.padding2,
  },
  advancedFilterButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding2,
    borderRadius: SIZES.radius / 3,
    alignSelf: 'flex-start',
  },
  advancedFilterButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  resetFilterButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding2,
    borderRadius: SIZES.radius / 3,
    alignSelf: 'flex-start',
  },
  resetFilterButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  chartsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: SIZES.base,
  },
  
  // Subjects section
  subjectsSection: {
    padding: SIZES.padding3,
    margin: SIZES.padding3,
    marginTop: 0,
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius / 2.5,
    borderWidth: 1,
    borderColor: COLORS.grayscale700,
  },
  subjectsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  
  // Activities section
  activitiesSection: {
    padding: SIZES.padding3,
    margin: SIZES.padding3,
    marginTop: 0,
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius / 2.5,
    borderWidth: 1,
    borderColor: COLORS.grayscale700,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.base - 2,
  },
  activityName: {
    ...FONTS.h4,
    marginBottom: SIZES.base - 4,
  },
  activityScore: {
    ...FONTS.body4,
    color: COLORS.gray3,
  },
  
  // Action buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.padding3,
    marginBottom: SIZES.padding3 + 8,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding2,
    paddingHorizontal: SIZES.padding3,
    borderRadius: SIZES.radius / 3.75,
    flex: 1,
    alignItems: 'center',
  },
  actionButtonText: {
    ...FONTS.h4,
    fontSize: 13,
     fontWeight: "500",
    color: COLORS.white,
    flex: 1, // This makes the text take up available space
  },
  
  activityDetailButton: {
    marginTop: 8, 
    alignSelf: 'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: `${COLORS.primary}20`, // Version transparente de la couleur primaire
  },
  activityDetailButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  // Multi-selection styles pour les filtres
  multiSelectContainer: {
    marginBottom: SIZES.padding2,
  },
  selectedFiltersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SIZES.base,
  },
  selectedFilterChip: {
    backgroundColor: `${COLORS.primary}20`, // Version transparente de la couleur primaire
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZES.radius / 3,
    paddingVertical: SIZES.base - 2,
    paddingHorizontal: SIZES.padding2,
    marginRight: SIZES.base,
    marginBottom: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  selectedFilterChipText: {
    ...FONTS.body4,
    color: COLORS.primary,
    marginRight: SIZES.base,
  },
  detailModalContainer: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default enfantsStyles;