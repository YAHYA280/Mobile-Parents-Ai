import { StyleSheet } from "react-native";
import { SIZES, COLORS } from "@/constants";


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
        backgroundColor: COLORS.white,
        padding: 16,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    viewLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    viewRight: {
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
    iconButton: {
        padding: SIZES.base,
    },
    bellIcon: {
        height: 26,
        width: 26,
        tintColor: COLORS.black,
    },
    scrollContent: {
        paddingBottom: 24,
    },
    titleSection: {
        marginBottom: 24,
    },
    headingTitle: {
        fontSize: 24,
        fontFamily: "bold", 
        color: '#C85C44',
        marginBottom: 8,
    },
    headingSubtitle: {
        fontSize: 15,
        color: COLORS.gray3,
        marginBottom: 8,
    },
    cardContainer: {
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: COLORS.white,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 7,
        marginHorizontal: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    planTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    planIcon: {
        fontSize: 18,
    },
    planName: {
        fontSize: 18,
        fontFamily: "bold",
        color: COLORS.white,
        letterSpacing: 0.5,
    },
    statusContainer: {
        alignItems: 'flex-end',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#10B981',
    },
    statusText: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "semibold",
    },
    cardBody: {
        padding: 16,
    },
    detailsSection: {
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 14,
        color: COLORS.gray3,
        fontFamily: "medium",
    },
    detailValue: {
        fontSize: 14,
        color: COLORS.greyscale900,
        fontFamily: "semibold",
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.gray2,
        marginVertical: 16,
    },
    featuresTitle: {
        fontSize: 16,
        fontFamily: "bold",
        color: COLORS.greyscale900,
        marginBottom: 12,
    },
    featuresContainer: {
        marginBottom: 20,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: LOGO_COLORS.main,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    checkmarkText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "bold",
    },
    featureText: {
        fontSize: 14,
        color: COLORS.greyscale900,
        fontFamily: "regular",
    },
    buttonsContainer: {
        marginTop: 8,
    },
    actionButton: {
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modifyButton: {
        backgroundColor: LOGO_COLORS.main,
        marginBottom: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    secondaryButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    secondaryButton: {
        flex: 1,
        marginRight: 8,
        backgroundColor: COLORS.gray2,
    },
    dangerButton: {
        flex: 1,
        marginLeft: 8,
        backgroundColor: '#FEE2E2',
    },
    buttonText: {
        fontSize: 14,
        fontFamily: "bold",
        color: COLORS.white,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.gray3,
    },
    errorText: {
        fontSize: 18,
        color: '#E53935',
        textAlign: 'center',
        marginBottom: 16,
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
    noSubscriptionContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    noSubscriptionIcon: {
        width: 60,
        height: 60,
        tintColor: COLORS.gray3,
        marginBottom: 16,
    },
    noSubscriptionTitle: {
        fontSize: 20,
        fontFamily: "bold",
        color: COLORS.greyscale900,
        marginBottom: 12,
    },
    noSubscriptionText: {
        fontSize: 16,
        color: COLORS.gray3,
        textAlign: 'center',
        marginBottom: 24,
    },
    choosePlanButton: {
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
    },
    choosePlanButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: "bold",
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
    alertButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
    },
    alertButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 100,
    },
    alertDefaultButton: {
        backgroundColor: COLORS.primary,
    },
    alertDestructiveButton: {
        backgroundColor: '#FCEEF0',
    },
    alertCancelButton: {
        backgroundColor: COLORS.gray2,
    },
    alertButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    });

export default styles;
