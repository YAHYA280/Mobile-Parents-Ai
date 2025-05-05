import { SIZES, COLORS } from "@/constants";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = 480;

const LOGO_COLORS = {
    lighter: "#f9a99a",
    light: "#f28374",
    main: "#fe7862",
    dark: "#d75f4d",
    darker: "#b34e3a",
    contrastText: "#FFFFFF",
  };
  

const styles = StyleSheet.create({
    area: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: COLORS.white,
    },
    headerContainer: {
      flexDirection: "row",
      width: SIZES.width - 32,
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: SIZES.padding3,
    },
    viewLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    parentIcon: {
      width: 52,
      height: 52,
      borderRadius: 26,
    },
    viewNameContainer: {
      marginLeft: SIZES.padding3 - 2,
    },
    title: {
      fontSize: 22,
      fontFamily: "bold",
      color: COLORS.greyscale900,
      letterSpacing: 0.5,
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
    headingContainer: {
      alignItems: 'center',
      marginVertical: 20,
    },
    headingTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: COLORS.black,
      marginBottom: 8,
    },
    headingSubtitle: {
      fontSize: 15,
      color: COLORS.gray3,
      textAlign: 'center',
      marginHorizontal: 16,
    },
    highlightedText: {
      fontWeight: 'bold',
    },
    scrollContainer: {
      alignItems: 'center',
      paddingBottom: 20,
    },
    cardOuterContainer: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      marginHorizontal: 8,
      alignItems: 'center',
      position: 'relative',
    },
    awardIconContainer: {
      position: 'absolute',
      top: -15,
      zIndex: 10,
    },
    awardIconCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#FFD700',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    emojiIcon: {
      fontSize: 20,
    },
    ribbonContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      overflow: 'hidden',
      height: 100,
      width: 100,
      zIndex: 10,
    },
    ribbon: {
      position: 'absolute',
      left: -40,
      top: 20,
      backgroundColor: '#E53935',
      transform: [{ rotate: '-45deg' }],
      width: 150,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    ribbonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 14,
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
    },
    planContainer: {
      width: '100%',
      height: CARD_HEIGHT,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 7,
    },
    planHeaderSection: {
      padding: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    planHeaderContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    planPriceContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    planBodySection: {
      backgroundColor: '#FFFFFF',
      position: 'relative',
    },
    featuresScrollView: {
      padding: 20,
    },
    planTypeLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    planPrice: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    planPeriod: {
      fontSize: 16,
      fontWeight: 'normal',
      color: '#FFFFFF',
      marginLeft: 2,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    checkmarkCircle: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: '#3B82F6',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    checkmarkText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold',
    },
    featureText: {
      fontSize: 14,
      color: '#111827',
      flex: 1,
    },
    buttonPositioner: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      zIndex: 2,
    },
    getStartedButton: {
      borderRadius: 8,
      padding: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    getStartedText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 10,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#D1D5DB',
      marginHorizontal: 4,
    },
    paginationDotActive: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#3B82F6',
      transform: [{scale: 1.1}],
    },
    errorText: {
      fontSize: 18,
      textAlign: 'center',
      marginVertical: 20,
      color: '#E53935',
    },
    backButton: {
      backgroundColor: LOGO_COLORS.main,
      padding: 12,
      borderRadius: 8,
      alignSelf: 'center',
    },
    backButtonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 16,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: COLORS.gray3,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    alertContainer: {
      width: '80%',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    alertTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    alertMessage: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
    },
    okButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      alignSelf: 'flex-end',
    },
    okButtonText: {
      color: COLORS.white,
      fontWeight: 'bold',
      fontSize: 16,
    },
    
  });
export default styles;
