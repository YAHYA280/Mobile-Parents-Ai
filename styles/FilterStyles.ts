import { StyleSheet, Dimensions } from 'react-native';

import { COLORS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    difficultyIndicator: {
        fontSize: 10,
        fontFamily: 'Poppins-Medium',
        marginLeft: 4,
        marginRight: 4,
      },
    selectedDifficultyIndicator: {
        color: '#FFFFFF',
      },
  // Modal Base Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end', // Modal part de bas vers le haut
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
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
    borderBottomColor: '#F2F2F2',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: COLORS.black,
    marginBottom: 12,
  },

  // Date Filter Styles
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerWrapper: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: COLORS.gray,
    marginBottom: 6,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
  },
  datePickerText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: COLORS.black,
  },
  dateSeparator: {
    paddingHorizontal: 10,
  },
  calendarContainer: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  // Filter Chips Styles
  filterChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedFilterChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: COLORS.black,
  },
  selectedFilterChipText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
  },
  checkmarkIcon: {
    marginLeft: 6,
  },

  // Score Range Slider
  scoreRangeContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  scoreRangeText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
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
    backgroundColor: '#FFFFFF',
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
    borderTopColor: '#F2F2F2',
  },
  clearButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  clearButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: COLORS.gray,
    textDecorationLine: 'underline',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: COLORS.primary,
  },
  applyButton: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
  },
});

export default styles;