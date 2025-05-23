// components/enfants/historique/filtres/index.ts
// Helper functions
import type { Activity } from "@/data/Enfants/CHILDREN_DATA";

import { SUBJECT_THEME, ASSISTANT_THEME } from "./constants";

export * from "./constants";
export { default as FilterModal } from "./FilterModal";
export { default as SearchBarComponent } from "./SearchBarComponent";
export { default as DateRangeIndicator } from "./DateRangeIndicator";
export { default as AssistantTypeFilters } from "./AssistantTypeFilters";

export const getActivityTheme = (activity: Activity) => {
  let assistantName = "Autre";
  if (activity.activite?.toLowerCase().includes("j'apprends")) {
    assistantName = "J'Apprends";
  } else if (activity.activite?.toLowerCase().includes("recherche")) {
    assistantName = "Recherche";
  } else if (activity.activite?.toLowerCase().includes("accueil")) {
    assistantName = "Accueil";
  }

  let subjectName = "Autre";
  if (activity.activite) {
    const activityLower = activity.activite.toLowerCase();
    if (
      activityLower.includes("mathématiques") ||
      activityLower.includes("géométrie")
    ) {
      subjectName = "Mathématiques";
    } else if (
      activityLower.includes("français") ||
      activityLower.includes("lecture") ||
      activityLower.includes("vocabulaire") ||
      activityLower.includes("conjugaison") ||
      activityLower.includes("grammaire")
    ) {
      subjectName = "Français";
    } else if (
      activityLower.includes("sciences") ||
      activityLower.includes("écologie")
    ) {
      subjectName = "Sciences";
    } else if (activityLower.includes("histoire")) {
      subjectName = "Histoire";
    } else if (activityLower.includes("anglais")) {
      subjectName = "Anglais";
    }
  }

  return {
    assistant: ASSISTANT_THEME[assistantName] || ASSISTANT_THEME.Autre,
    subject: SUBJECT_THEME[subjectName] || SUBJECT_THEME.Autre,
  };
};

export const extractAssistantType = (activity: Activity): string => {
  if (!activity.activite) return "Autre";
  const activiteLower = activity.activite.toLowerCase();
  if (activiteLower.includes("j'apprends")) return "J'Apprends";
  if (activiteLower.includes("recherche")) return "Recherche";
  if (activiteLower.includes("accueil")) return "Accueil";
  return "Autre";
};
