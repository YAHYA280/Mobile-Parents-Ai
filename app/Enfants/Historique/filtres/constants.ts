// components/enfants/historique/filtres/constants.ts
import {
  faBook,
  faSearch,
  faFilter,
  faChalkboardTeacher,
} from "@fortawesome/free-solid-svg-icons";

interface AssistantThemeType {
  colors: readonly [string, string, ...string[]];
  icon: any;
}

interface SubjectThemeType {
  colors: readonly [string, string, ...string[]];
  icon: any;
}

// Themes for assistants
export const ASSISTANT_THEME: {
  "J'Apprends": AssistantThemeType;
  Recherche: AssistantThemeType;
  Accueil: AssistantThemeType;
  Autre: AssistantThemeType;
  [key: string]: AssistantThemeType;
} = {
  "J'Apprends": {
    colors: ["#4CAF50", "#2E7D32"],
    icon: faChalkboardTeacher,
  },
  Recherche: {
    colors: ["#2196F3", "#1565C0"],
    icon: faSearch,
  },
  Accueil: {
    colors: ["#FF9800", "#F57C00"],
    icon: faBook,
  },
  Autre: {
    colors: ["#9C27B0", "#7B1FA2"],
    icon: faFilter,
  },
};

// Themes for subjects
export const SUBJECT_THEME: {
  Mathématiques: SubjectThemeType;
  Français: SubjectThemeType;
  Sciences: SubjectThemeType;
  Histoire: SubjectThemeType;
  Anglais: SubjectThemeType;
  Autre: SubjectThemeType;
  [key: string]: SubjectThemeType;
} = {
  Mathématiques: {
    colors: ["#E91E63", "#C2185B"],
    icon: faBook,
  },
  Français: {
    colors: ["#3F51B5", "#303F9F"],
    icon: faBook,
  },
  Sciences: {
    colors: ["#009688", "#00796B"],
    icon: faBook,
  },
  Histoire: {
    colors: ["#795548", "#5D4037"],
    icon: faBook,
  },
  Anglais: {
    colors: ["#673AB7", "#512DA8"],
    icon: faBook,
  },
  Autre: {
    colors: ["#607D8B", "#455A64"],
    icon: faBook,
  },
};

export function getProgressColor(progress: number) {
  if (progress < 30) return "#FC4E00"; // Rouge
  if (progress <= 50) return "#EBB016"; // Orange
  if (progress <= 70) return "#F3BB00"; // Jaune
  return "#24D26D"; // Vert
}
