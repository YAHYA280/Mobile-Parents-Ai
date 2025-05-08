import { COLOORS } from "@/constants/theme";

/**
 * Format date string to a more readable format
 * @param dateString - Date string in ISO format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original string if parsing fails
  }
};

/**
 * Get pricing period label based on duration code
 * @param duration - Duration code (monthly, six_months, yearly)
 * @returns Formatted pricing period label
 */
export const getPricingPeriod = (duration: string): string => {
  switch (duration) {
    case "monthly":
      return "par mois";
    case "six_months":
      return "pour 6 mois";
    case "yearly":
      return "par année";
    default:
      return "par mois";
  }
};

/**
 * Format duration for display
 * @param duration - Duration string
 * @returns Formatted duration string
 */
export const formatDuration = (duration: string): string => {
  // Already formatted durations
  if (
    duration === "Mensuel" ||
    duration === "6 Mois" ||
    duration === "Annuel"
  ) {
    return duration;
  }

  // Format API duration codes
  switch (duration) {
    case "monthly":
      return "Mensuel";
    case "six_months":
      return "6 Mois";
    case "yearly":
      return "Annuel";
    default:
      return duration;
  }
};

/**
 * Get color for a plan based on ID
 * @param id - Plan ID
 * @returns Color hex code
 */
export const getPlanColor = (id: string): string => {
  switch (id) {
    case "1":
      return COLOORS.primary.light;
    case "2":
      return COLOORS.primary.main;
    case "3":
      return COLOORS.primary.dark;
    default:
      return COLOORS.primary.main;
  }
};

/**
 * Get emoji for a plan based on ID
 * @param id - Plan ID
 * @returns Emoji character
 */
export const getPlanEmoji = (id: string): string => {
  switch (id) {
    case "1":
      return "🎓";
    case "2":
      return "🏆";
    case "3":
      return "🚀";
    default:
      return "📚";
  }
};
