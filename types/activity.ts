import { Message } from "./chat";

export interface Activity {
  id: number;
  activite: string;
  date: string;
  duree: string;
  matiere?: string;
  assistant?: string;
  difficulty?: string;
  score?: string | number;
  commentaires?: string;
  recommandations?: string[];
  childId: number;
  conversation?: Message[];
  status?: ActivityStatus;
  completed?: boolean;
  resources?: ActivityResource[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export enum ActivityStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  EVALUATED = "evaluated",
}

export interface ActivityFilter {
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  selectedAssistants: string[];
  selectedSubjects: string[];
  selectedDifficulties: string[];
}

export interface ActivityResource {
  id: number;
  type: "video" | "document" | "link" | "image";
  title: string;
  description?: string;
  url: string;
  duration?: string;
  tags?: string[];
  subject?: string;
  difficulty?: string;
}

export interface ActivityStat {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}
