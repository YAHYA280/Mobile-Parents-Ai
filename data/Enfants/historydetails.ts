import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import { 
  faHome, 
  faBook, 
  faRobot, 
  faFlask,
  faSearch,
  faLandmark,
  faLanguage,
  faBookOpen,
  faCalculator,
  faChalkboardTeacher
} from '@fortawesome/free-solid-svg-icons';

// Interface for Theme
interface ThemeItem {
  colors: readonly [string, string];
  icon: IconDefinition;
}

// Assistant Themes
export const ASSISTANT_THEME: { 
  [key: string]: ThemeItem;
  "J'Apprends": ThemeItem;
  "Recherche": ThemeItem;
  "Accueil": ThemeItem;
  "Autre": ThemeItem;
} = {
  "J'Apprends": {
    colors: ['#4CAF50', '#2E7D32'] as const,
    icon: faChalkboardTeacher
  },
  "Recherche": {
    colors: ['#2196F3', '#1565C0'] as const,
    icon: faSearch
  },
  "Accueil": {
    colors: ['#FF9800', '#F57C00'] as const,
    icon: faHome
  },
  "Autre": {
    colors: ['#9C27B0', '#7B1FA2'] as const,
    icon: faRobot
  }
};

// Subject Themes
export const SUBJECT_THEME: { 
  [key: string]: ThemeItem;
  "Mathématiques": ThemeItem;
  "Français": ThemeItem;
  "Sciences": ThemeItem;
  "Histoire": ThemeItem;
  "Anglais": ThemeItem;
  "Autre": ThemeItem;
} = {
  "Mathématiques": {
    colors: ['#E91E63', '#C2185B'] as const,
    icon: faCalculator
  },
  "Français": {
    colors: ['#3F51B5', '#303F9F'] as const,
    icon: faBook
  },
  "Sciences": {
    colors: ['#009688', '#00796B'] as const,
    icon: faFlask
  },
  "Histoire": {
    colors: ['#795548', '#5D4037'] as const,
    icon: faLandmark
  },
  "Anglais": {
    colors: ['#673AB7', '#512DA8'] as const,
    icon: faLanguage
  },
  "Autre": {
    colors: ['#607D8B', '#455A64'] as const,
    icon: faBookOpen
  }
};