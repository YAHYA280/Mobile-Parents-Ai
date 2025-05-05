import { StyleSheet } from "react-native";

import { COLORS } from "../constants/theme";
 
const KidsStyles = StyleSheet.create({
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 32,
  },
  avatarContainer: {          
  
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: COLORS.white,
    overflow: "hidden",
    position: "absolute",
    top: -75,
    zIndex: 10,
    elevation: 5,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
  },
  safeArea: {
    flex: 1,
  },
  activeFilter: {
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 100,
    paddingVertical: 50,
  },
  backButton: {
    padding: 8,
  },
  childInfoHeader: {
    alignItems: 'center',
  },
  childName: {
    fontSize: 18,
    fontFamily: 'bold',
    textAlign: 'right',
  },
  childClass: {
    fontSize: 14,
    fontFamily: 'regular',
    textAlign: 'right', 
  },
  pageTitle: {
    fontSize: 18,
    fontFamily: 'bold',
  },
  moreButton: {
    padding: 8,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'bold',
    marginBottom: 12,
  },
  progressSection: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 20,
    fontFamily: 'bold',
    marginBottom: 8,
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  subjectSection: {
    marginBottom: 8,
  },
  subheading: {
    fontSize: 14,
    fontFamily: 'semibold',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#24D26D',
    fontSize: 12,
    fontFamily: 'medium',
  },
  activityItem: {
    marginTop: 12,
    flexDirection: 'row',
    paddingBottom: 12,
  },
  activityItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  activityDate: {
    marginRight: 12,
    alignItems: 'center',
    width: 60,
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
    marginBottom: 4,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
  commentSection: {
    marginTop: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: 8,
    borderRadius: 8,
  },
  commentText: {
    fontSize: 12,
    fontFamily: 'regular',
  },
  // Performance specific styles
  subjectPerformance: {
    marginBottom: 16,
  },
  subjectPerformanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 14,
    fontFamily: 'semibold',
  },
  subjectScore: {
    fontSize: 14,
    fontFamily: 'semibold',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'regular',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
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
});

export default KidsStyles;