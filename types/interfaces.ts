// types/interfaces.ts

// Define the Activity interface for activities data
export interface Activity {
  id: string | number;
  title?: string;
  date?: string;
  type?: string;
  score?: number;
  duration?: string;
  subject?: string;
  // Add any other activity properties used in your components
}

// Define the Child interface for child data
export interface Child {
  id: string | number;
  name?: string;
  progress: string | number;
  matieresFortes: string[];
  matieresAmeliorer: string[];
  activitesRecentes: Activity[];
  // Add any other child properties used in your components
}

// Define SubjectPerformance interface for the performance component
export interface SubjectPerformance {
  name: string;
  progress: number;
}

// You may also need to define props for your ActivityCard component
export interface ActivityCardProps {
  activity: Activity;
  onPress: () => void;
  index: number;
}
