import { NavigatorScreenParams } from "@react-navigation/native";

export type AppStackParamList = {
  "(tabs)": NavigatorScreenParams<TabsParamList>;
  Enfants: NavigatorScreenParams<EnfantsStackParamList>;
  modal: undefined;
};

export type TabsParamList = {
  index: undefined;
  Enfants: undefined;
  support: undefined;
  profile: undefined;
};

export type EnfantsStackParamList = {
  index: undefined;
  "[id]": NavigatorScreenParams<ChildTabsParamList>;
  Historique: NavigatorScreenParams<HistoriqueStackParamList>;
};

export type ChildTabsParamList = {
  index: undefined;
  apercu: undefined;
  activites: undefined;
  suivi: undefined;
};

export type HistoriqueStackParamList = {
  index: { childId: string };
  "[activityId]": NavigatorScreenParams<ActivityStackParamList>;
};

export type ActivityStackParamList = {
  index: { childId: string };
  chat: { childId: string };
  video: { childId: string };
};

// Helper type to extract route parameters
export type RouteParams<T extends keyof AppStackParamList> =
  AppStackParamList[T] extends undefined ? {} : AppStackParamList[T];

// Types for useLocalSearchParams in Expo Router
export interface EnfantParams {
  id: string;
}

export interface HistoriqueParams {
  childId: string;
}

export interface ActivityParams {
  activityId: string;
  childId: string;
}
