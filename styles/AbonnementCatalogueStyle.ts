import { StyleSheet } from "react-native";

import { SIZES, FONTS, COLORS } from "@/constants";

const styles = StyleSheet.create({
    area: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
      padding: 16,
    },
    listContainer: {
      paddingBottom: 24,
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    viewLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    title: {
      fontSize: 22,
      fontFamily: "bold",
      color: COLORS.greyscale900,
      letterSpacing: 0.5,
    },
    viewNameContainer: {
      marginLeft: SIZES.padding3 - 2,
    },
    viewRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconButton: {
      padding: SIZES.base,
    },
    bellIcon: {
      height: 26,
      width: 26,
      tintColor: COLORS.black,
      marginRight: SIZES.base,
    },
    plansHeadingContainer: {
      marginBottom: SIZES.padding3 + 8,
      paddingHorizontal: 4,
    },
    plansHeadingTitle: {
      ...FONTS.h1,
      color: COLORS.black,
      marginBottom: SIZES.base,
    },
    plansHeadingSubtitle: {
      ...FONTS.body3,
      color: COLORS.gray3,
    },
    parentIcon: {
      width: 52,
      height: 52,
      borderRadius: 26,
    },
    iconOuterContainer: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    emojiIcon: {
      fontSize: 24,
    },
    planName: {
      fontSize: 16,
      fontFamily: "bold",
      color: COLORS.white,
      textAlign: "center",
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    rightSection: {
      width: "75%",
      paddingTop: 20,
      paddingLeft: SIZES.padding2,
      paddingRight: SIZES.padding2,
    },
    featuresSection: {
      marginBottom: 0,
    },
    featureContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 9,
    },
    checkCircle: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.5)",
    },
    checkmark: {
      color: COLORS.white,
      fontSize: 11,
      fontWeight: "bold",
    },
    featureText: {
      fontSize: 14,
      fontFamily: "medium",
      color: COLORS.white,
      flex: 1,
      opacity: 0.9,
    },
    buttonPositioner: {
      position: "absolute",
      right: 16,
      bottom: 6,
      zIndex: 2,
    },
    selectPlanButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      borderRadius: 12,
    },
    selectPlanText: {
      fontSize: 12,
      fontFamily: "semibold",
      color: COLORS.black,
      letterSpacing: 1,
    },
    patternOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.03,
      backgroundColor: "transparent",
    },
    cardOuterContainer: {
      width: "100%",
      marginBottom: 20,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 7,
      position: "relative",
    },
    premiumIndicator: {
      position: "absolute",
      top: 0,
      left: 0,
      width: 8,
      height: "100%",
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      zIndex: 1,
    },
    cardContainer: {
      width: "100%",
      height: 170,
      borderRadius: 16,
      overflow: "hidden",
      flexDirection: "row",
      position: "relative",
    },
    leftSection: {
      width: "25%",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: SIZES.base,
      paddingVertical: SIZES.padding2,
    },
    iconInnerContainer: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      alignItems: "center",
      justifyContent: "center",
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: COLORS.gray3,
    },
    errorText: {
      fontSize: 16,
      color: "#E53935",
      marginBottom: 16,
      textAlign: "center",
    },
    retryButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
    },
    retryButtonText: {
      color: COLORS.white,
      fontSize: 16,
      fontFamily: "semibold",
    },
  });
export default styles;
