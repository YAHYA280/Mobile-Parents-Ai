import { StyleSheet } from "react-native";

import { FONTS, SIZES, COLORS } from "../constants/theme";

// Utility functions for color manipulation
export const colorUtils = {
  hexToRgba: (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  shadeColor: (color: string, percent: number): string => {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = Math.floor(R * (100 + percent) / 100);
    G = Math.floor(G * (100 + percent) / 100);
    B = Math.floor(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    const RR = R.toString(16).padStart(2, '0');
    const GG = G.toString(16).padStart(2, '0');
    const BB = B.toString(16).padStart(2, '0');

    return `#${RR}${GG}${BB}`;
  }
};
export const CUSTOM_COLORS = {
    primary: {
      lighter: colorUtils.hexToRgba(COLORS.primary, 0.1), // Reduced opacity for lighter background
      light: colorUtils.hexToRgba(COLORS.primary, 0.6),
      main: COLORS.primary,
      dark: colorUtils.shadeColor(COLORS.primary, -15),
      darker: colorUtils.shadeColor(COLORS.primary, -30),
      contrastText: "#FFFFFF"
    }
  };
export const styles = StyleSheet.create({
  // Ajouter ces styles dans votre fichier allkidsStyles.js/ts

// Pour l'image de profil
profileImageContainer: {
  width: 50,
  height: 50,
  borderRadius: 25,
  overflow: 'hidden',
  borderWidth: 2,
  borderColor: CUSTOM_COLORS.primary.main,
  backgroundColor: COLORS.white,
},
profileImage: {
  width: '100%',
  height: '100%',
},

// Pour les métriques (engagement/évolution)
metricsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 10,
  marginBottom: 10,
},
metricItem: {
  alignItems: 'center',
},
metricLabel: {
  fontSize: 12,
  marginBottom: 2,
},
metricValue: {
  fontSize: 14,
  fontWeight: 'bold',
},
  scrollViewContent: {
    paddingBottom: 100, // Add extra padding at the bottom for scrolling
    flexGrow: 1, // Ensure content fills the scroll view
    paddingHorizontal: SIZES.padding,
  },
  container: {
        flex: 1,
        padding: SIZES.padding3,
        // La couleur de fond est maintenant définie directement dans le composant
      },
      header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: SIZES.padding3 * 1.5,
      },
      sectionTitle: {
        ...FONTS.h3,
        marginLeft: 10,
        fontWeight: "700",
        // La couleur est maintenant définie directement dans le composant
      },
      childCard: {
        borderRadius: SIZES.radius,
        padding: SIZES.padding3 * 1.5,
        marginBottom: SIZES.padding3 * 1.2,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderLeftWidth: 4,
        borderLeftColor: CUSTOM_COLORS.primary.main,
        // La couleur de fond est maintenant définie dans le composant ChildCard
      },
      childHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: SIZES.base,
      },
      iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: CUSTOM_COLORS.primary.lighter,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
      },
      childNameContainer: {
        flex: 1,
      },
      childName: {
        ...FONTS.h4,
        fontWeight: "600",
        // La couleur est maintenant définie directement dans le composant
      },
      divider: {
        height: 1,
        backgroundColor: CUSTOM_COLORS.primary.lighter,
        marginVertical: SIZES.base,
      },
      childDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: SIZES.padding,
        paddingVertical: SIZES.base,
      },
      detailItem: {
        flexDirection: "row",
        alignItems: "center",
      },
      childInfo: {
        ...FONTS.body4,
        // La couleur est maintenant définie directement dans le composant
      },
      progressSection: {
        marginTop: SIZES.base,
      },
      childProgress: {
        ...FONTS.body4,
        fontWeight: "bold",
        marginBottom: 5,
        // La couleur est maintenant définie directement dans le composant
      },
      progressContainer: {
        height: 8,
        backgroundColor: "#E0E0E0",
        borderRadius: 4,
        overflow: 'hidden',
        marginTop: 4,
      },
      progressBar: {
        height: '100%',
        borderRadius: 4,
      },
    });
export default styles ; 