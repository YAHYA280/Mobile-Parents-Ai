import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

import { FONTS, COLORS } from "../constants/theme";

const { height } = Dimensions.get("window");

const PerfomancesStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end", // Modal part de bas vers le haut
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: height * 0.85, // 85% de la hauteur de l'écran max
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: COLORS.black,
  },
  closeModalButton: {
    padding: 4,
  },
  modalScrollContentContainer: {
    paddingBottom: 20,
  },

  // Filter Sections
  filterSection: {
    marginTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  filterSectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: COLORS.black,
    marginBottom: 12,
  },

  // Date Filter Styles
  dateRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  datePickerWrapper: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: COLORS.gray,
    marginBottom: 6,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#F8F8F8",
  },
  datePickerText: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: COLORS.black,
  },
  dateSeparator: {
    paddingHorizontal: 10,
  },
  calendarContainer: {
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  // Filter Chips Styles
  filterChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedFilterChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: COLORS.black,
  },
  selectedFilterChipText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Medium",
  },
  checkmarkIcon: {
    marginLeft: 6,
  },

  // Score Range Slider
  scoreRangeContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  scoreRangeText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: COLORS.black,
    marginBottom: 10,
  },
  sliderContainer: {
    marginHorizontal: 10,
  },
  sliderMarker: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderColor: COLORS.primary,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },

  // Footer Buttons
  modalFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F2",
  },
  clearButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  clearButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: COLORS.gray,
    textDecorationLine: "underline",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: COLORS.primary,
    marginRight: 8,
    paddingVertical: 12, // Uniformisé avec advancedFilterButton
    borderRadius: 10, // Uniformisé avec advancedFilterButton
    width: "45%", // Même largeur que advancedFilterButton
    alignItems: "center", // Centrer le texte horizontalement
    justifyContent: "center", // Centrer le texte verticalement
  },
  cancelButtonText: {
    fontSize: 15,
    fontFamily: "Poppins-Medium",
    color: COLORS.primary,
  },
  applyButton: {
    backgroundColor: COLORS.primary, // Assuming you want a primary color for save button
  },
  applyButtonText: {
    fontSize: 15,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
  metricSymbol: {
    fontSize: 35,
    fontWeight: "bold",
    marginRight: 4,
  },
  metricValue: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },

  metricLabel: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  saveButton: {
    backgroundColor: COLORS.primary, // Couleur d'arrière-plan pour le bouton d'enregistrement
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  exportButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackContainer: {
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  feedbackInputContainer: {
    marginBottom: 15,
  },
  feedbackInput: {
    width: "100%",
  },
  feedbackHistoryContainer: {
    marginTop: 10,
  },
  feedbackHistoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  feedbackItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // ou 'center' selon vos besoins
    marginVertical: 10,
  },
  // Safe Area
  safeArea: {
    flex: 1,
  },

  // Main Container
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },

  // Header Styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.primary,
  },

  // Content Container
  contentContainer: {
    flex: 1,
  },

  // Performance Details Container
  performanceDetailsContainer: {
    flex: 1,
    marginTop: 25,
  },
  performanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  performanceTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center", // Centre le texte à l'intérieur de son conteneur
    alignSelf: "center", // Centre le conteneur lui-même horizontalement
    width: "100%", // Assurez-vous que le conteneur prend toute la largeur disponible
  },

  // Advanced Filter Button
  advancedFilterButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12, // Uniformisé avec cancelButton
    borderRadius: 10,
    paddingHorizontal: 12,
    width: "45%",
    alignItems: "center", // Centrer le texte horizontalement
    justifyContent: "center", // Centrer le texte verticalement
  },
  advancedFilterButtonText: {
    color: COLORS.white,
    fontSize: 15,
    textAlign: "center", // Assurer le centrage du texte
  },

  // Global Performance
  globalPerformanceContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
  },
  globalPerformanceTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  progressContainer: {
    height: 25,
    backgroundColor: COLORS.gray,
    borderRadius: 12,
    justifyContent: "center",
    position: "relative",
  },
  progressBar: {
    position: "absolute",
    height: "100%",
    borderRadius: 12,
    left: 0,
  },
  progressText: {
    position: "absolute",
    right: 10,
    fontSize: 12,
    fontWeight: "600",
  },

  // Subject Performance
  subjectPerformanceContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
  },
  subjectPerformanceTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  subjectPerformanceItem: {
    marginBottom: 10,
  },
  subjectName: {
    fontSize: 14,
    marginBottom: 5,
  },

  // Dashboard Section
  dashboardSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  dashboardContainer: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 15,
  },
  simpleDashboard: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dashboardChart: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 10,
  },
  chartTitle: {
    fontSize: 17,
    fontWeight: "500",
    marginBottom: 10,
  },
  chartPlaceholderCustom: {
    height: 80,
    backgroundColor: COLORS.gray,
    borderRadius: 10,
  },

  // Detailed Dashboard
  detailedDashboard: {
    borderRadius: 10,
    padding: 15,
  },
  dashboardHeader: {
    marginBottom: 15,
  },
  detailedDashboardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  chartRow: {
    marginBottom: 15,
  },
  dashboardChartFull: {
    borderRadius: 10,
    padding: 15,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: COLORS.gray,
    borderRadius: 10,
  },

  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },

  modalButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    paddingTop: 20,
    paddingBottom: 10,
    width: "90%",
    maxWidth: 500,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },
  filterItemSelected: {
    backgroundColor: COLORS.primary,
  },
  filterItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
  filterItemSelectedText: {
    fontWeight: "600",
    color: COLORS.primary,
  },
  filterButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 5,
  },
  filterButton: {
    padding: 8,
    borderWidth: 0.5,
    borderColor: COLORS.gray,
    backgroundColor: COLORS.gray,
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  selectedFilterButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    textAlign: "center",
  },
  selectedFilterButtonText: {
    color: COLORS.white,
  },

  recentActivitiesContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  recentActivitiesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: COLORS.primary,
  },
  activityDescription: {
    fontSize: 16,
    color: COLORS.gray3,
    marginBottom: 5,
  },
  activityScore: {
    fontSize: 16,
    color: COLORS.secondary,
    fontWeight: "bold",
  },
  noActivitiesText: {
    fontSize: 16,
    color: COLORS.gray2,
    textAlign: "center",
    marginTop: 20,
  },

  // Children List
  childrenListContainer: {
    width: "35%",
    marginRight: 15,
  },
  childCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  childCardContent: {
    flexDirection: "column",
  },
  childCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  childDetails: {
    fontSize: 14,
    marginTop: 5,
  },
  progressBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },

  headerTitle: {
    ...FONTS.h2,
    color: COLORS.white,
  },
  content: {
    flex: 1, // Permet au contenu d'occuper tout l'espace disponible
    padding: 16, // Ajoute un peu d'espace autour du contenu
    alignItems: "center", // Centre le contenu horizontalement
    justifyContent: "center", // Centre le contenu verticalement
    backgroundColor: "#f5f5f5", // Couleur de fond neutre
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },

  resetButton: {
    padding: 5,
  },
  resetButtonText: {
    color: COLORS.primary,
    fontSize: 14,
  },

  checkboxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -5,
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    margin: 5,
  },
  checkboxItemSelected: {
    backgroundColor: COLORS.primary,
  },
  checkboxText: {
    marginRight: 5,
    fontSize: 14,
  },

  dateButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    alignItems: "center",
  },
  dateButtonText: {
    fontSize: 14,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  resetActivityFiltersButton: {
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: 8,
  },
  dateInputText: {
    fontSize: 12,
    fontFamily: "regular",
  },
  dateInput: {
    flex: 1,
    marginRight: 8,
  },
  dateInputLabel: {
    fontSize: 12,
    fontFamily: "regular",
    marginBottom: 4,
  },
  dateInputField: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 4,
  },
  dateFilterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  activityDateFilters: {
    marginTop: 8,
  },
  backButton: {
    padding: 8,
  },
  childInfoHeader: {
    alignItems: "center",
  },
  childName: {
    fontSize: 18,
    fontFamily: "bold",
  },
  childClass: {
    fontSize: 14,
    fontFamily: "regular",
  },
  moreButton: {
    padding: 8,
  },

  // Card styles
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "bold",
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
  },
  activeFilterText: {
    color: COLORS.white,
  },
  filterButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resetFilterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    flex: 1,
  },
  resetFilterButtonText: {
    fontSize: 13,
    fontFamily: "semibold",
    color: COLORS.primary,
    textAlign: "center",
  },
  activityCard: {
    backgroundColor: COLORS.black,
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activitiesList: {
    marginTop: 10,
  },

  activityCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
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
  // Subject performance styles
  subjectPerformance: {
    marginBottom: 16,
  },
  subjectPerformanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  subjectScore: {
    fontSize: 14,
    fontFamily: "semibold",
  },

  // Activity styles
  activityItem: {
    marginTop: 12,
    flexDirection: "row",
    paddingBottom: 12,
  },
  activityItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  activityDate: {
    marginRight: 12,
    alignItems: "center",
    width: 60,
  },
  dateText: {
    fontSize: 12,
    fontFamily: "medium",
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: "semibold",
    marginBottom: 4,
  },
  activityMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
    color: "#757575",
    marginLeft: 4,
  },
  commentSection: {
    marginTop: 8,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    padding: 8,
    borderRadius: 8,
  },
  commentText: {
    fontSize: 12,
    fontFamily: "regular",
  },

  // Button styles
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "semibold",
  },

  // Empty state
  emptyText: {
    fontSize: 14,
    fontFamily: "regular",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 8,
  },

  filterOptionsList: {
    flexWrap: "wrap",
    flexDirection: "row",
  },
  filterOptionButton: {
    marginRight: 10,
    marginBottom: 10,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: COLORS.greyscale900,
  },
  // Conteneur d'options de filtre
  filterOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -5, // Pour compenser les marges des options
  },
  // Option de filtre individuelle
  filterOption: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  filterOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  filterOptionTextSelected: {
    color: COLORS.white,
  },
});

export default PerfomancesStyles;
