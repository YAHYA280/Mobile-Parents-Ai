import { Activity } from "./activity";

export interface Child {
  id: number;
  name: string;
  age?: number;
  progress: string;
  avatar?: string;
  gender?: "male" | "female" | "other";
  birthdate?: string;
  matieresFortes: string[];
  matieresAmeliorer: string[];
  activitesRecentes: Activity[];
  level?: string;
  grade?: string;
  notes?: string;
  parentId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChildSummary {
  totalActivities: number;
  totalDuration: string;
  lastActivityDate: string;
  favoriteSubject?: string;
  progress: string | number;
  evolutionRate?: number;
}

export interface ChildPerformance {
  overall: number | string;
  evolution?: number;
  bySubject: SubjectPerformance[];
}

export interface SubjectPerformance {
  name: string;
  progress: number;
  evolution?: number;
  color?: string;
}

export interface StrengthItem {
  subject: string;
  icon?: string;
  color?: string;
}
