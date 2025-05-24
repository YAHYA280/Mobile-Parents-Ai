import { StyleSheet } from "react-native";

const LOGO_COLORS = {
  lighter: "#f9a99a",
  light: "#f28374",
  main: "#fe7862",
  dark: "#d75f4d",
  darker: "#b34e3a",
  contrastText: "#FFFFFF",
};

export default StyleSheet.create({
  area: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  plansHeadingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  headingIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${LOGO_COLORS.main}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: LOGO_COLORS.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  plansHeadingTitle: {
    fontSize: 24,
    fontFamily: "bold",
    color: LOGO_COLORS.darker,
    marginBottom: 8,
    textAlign: "center",
  },
  plansHeadingSubtitle: {
    fontSize: 16,
    fontFamily: "regular",
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 24,
  },
  // Benefits section
  benefitsContainer: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  benefitsTitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  benefitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  benefitItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  benefitIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${LOGO_COLORS.main}10`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: "medium",
    color: "#444",
    flex: 1,
  },
  // Loading and error states
  loadingText: {
    fontSize: 16,
    fontFamily: "medium",
    color: "#666",
    marginTop: 16,
  },
  errorIconContainer: {
    marginBottom: 24,
  },
  errorText: {
    fontSize: 18,
    fontFamily: "medium",
    color: "#E11D48",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  retryButton: {
    width: 180,
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
    shadowColor: LOGO_COLORS.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "semibold",
  },
  // List container
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  comparePlansBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 20,
    alignSelf: "center",
  },
  infoIcon: {
    marginRight: 6,
  },
  comparePlansText: {
    fontSize: 14,
    fontFamily: "medium",
    color: "#3B82F6",
    marginRight: 6,
  },
  // Testimonial section
  testimonialContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  testimonialHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  testimonialIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${LOGO_COLORS.main}10`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  testimonialTitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: "#333",
  },
  quoteContainer: {
    position: "relative",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  quoteIcon: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  testimonialQuote: {
    fontSize: 15,
    fontFamily: "medium",
    color: "#444",
    lineHeight: 22,
    fontStyle: "italic",
  },
  testimonialFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  testimonialAuthor: {
    fontSize: 14,
    fontFamily: "semibold",
    color: "#333",
  },
  starsContainer: {
    flexDirection: "row",
  },
  starIcon: {
    marginLeft: 2,
  },
  // Loading and error states
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
});
