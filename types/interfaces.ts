export interface Activity {
  id: string | number;
  activite: string;
  date: string;
  duree: string;
  assistant?: string;
  matiere?: string;
  score?: number;
  type?: string;
}

export interface Child {
  id: string | number;
  name: string;
  age?: number;
  classe?: string;
  progress: string | number;
  matieresFortes: string[];
  matieresAmeliorer: string[];
  activitesRecentes: Activity[];
  profileImage: any; // For Image source
}

export interface SubjectPerformance {
  name: string;
  progress: number;
}

export interface ActivityCardProps {
  activity: Activity;
  onPress: () => void;
  index: number;
}
