import { StyleSheet } from "react-native";

import { COLORS } from "../constants/theme";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  childInfoHeader: {
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 18,
    fontFamily: 'bold',
  },
  childName: {
    fontSize: 14,
    fontFamily: 'regular',
  },
  childClass: {
    fontSize: 14,
    fontFamily: 'regular',
  },
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
  cardTitle: {
    fontSize: 16,
    fontFamily: 'bold',
    marginBottom: 16,
  },
  activityItem: {
    marginTop: 12,
    flexDirection: 'row',
    paddingBottom: 16,
  },
  activityItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  activityDate: {
    marginRight: 12,
    alignItems: 'center',
    width: 80,
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'medium',
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'semibold',
    marginBottom: 6,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
  commentSection: {
    marginTop: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentText: {
    fontSize: 12,
    fontFamily: 'regular',
    lineHeight: 18,
  },
  recommendationsSection: {
    marginTop: 8,
  },
  recommendationsTitle: {
    fontSize: 12,
    fontFamily: 'semibold',
    marginBottom: 4,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  recommendationText: {
    fontSize: 12,
    fontFamily: 'regular',
    marginLeft: 6,
    flex: 1,
  },
  // Additional styles for potential future features
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 12,
    fontFamily: 'medium',
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
  },
  activeFilterText: {
    color: COLORS.white,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'medium',
    textAlign: 'center',
    marginTop: 16,
  }
});

export default styles;