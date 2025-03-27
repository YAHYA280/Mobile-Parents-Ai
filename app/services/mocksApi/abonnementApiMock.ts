export interface CataloguePlan {
  id: string;
  planName: string;
  features: string[];
  monthlyPrice: number;
  sixMonthPrice: number;
  yearlyPrice: number;
  recommended?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface Abonnement {
  id: number;
  start_date: string;
  end_date: string;
  status: string;
  duration: string;
  user: User;
  catalogue: CataloguePlan;
}

const usersData: User[] = [
  {
    id: 1,
    name: "Andrew Ainsley",
    email: "andrew.ainsley@example.com",
    avatar: "user7"
  },
  {
    id: 2,
    name: "Sophie Martin",
    email: "sophie.martin@example.com",
    avatar: "user5"
  }
];

const cataloguesData: CataloguePlan[] = [
  {
    id: "1",
    planName: "Basique",
    features: [
      "Assistant d'Accueil",
      "Support Standard",
      "100 questions/jour",
      "3 matières max",
      "1 enfant"
    ],
    monthlyPrice: 20,
    sixMonthPrice: 100,
    yearlyPrice: 180,
  },
  {
    id: "2",
    planName: "Plus",
    features: [
      "Assistants Accueil & Apprentissage",
      "Support Prioritaire",
      "100 questions/matière",
      "5 matières",
      "3 enfants",
      "additional feature1",
      "additional feature2"
    ],
    monthlyPrice: 40,
    sixMonthPrice: 210,
    yearlyPrice: 380,
    recommended: true,
  },
  {
    id: "3",
    planName: "Avancé",
    features: [
      "Les 3 Assistants IA",
      "Support Premium",
      "Questions illimitées",
      "Matières illimitées",
      "5 enfants",
      "Recherche incluse",
      "another additional feature"
    ],
    monthlyPrice: 60,
    sixMonthPrice: 300,
    yearlyPrice: 540,
  },
];

const abonnementData: Abonnement = {
  id: 101,
  start_date: "2024-03-01",
  end_date: "2025-03-01",
  status: "active",
  duration: "yearly",
  user: usersData[0],
  catalogue: cataloguesData[1],
};

export const getCatalogues = (): Promise<CataloguePlan[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(cataloguesData), 10);
  });
};


export const getAbonnementActiveByUser = (userId: number): Promise<Abonnement | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(userId === 1 ? abonnementData : null);
    }, 10);
  });
};

export const getCurrentUser = (): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(usersData[0]), 10);
  });
};

export const updateUserSubscription = (
  userId: number, 
  planId: string, 
  duration: string
): Promise<Abonnement> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = usersData.find(u => u.id === userId);
      if (!user) {
        reject(new Error("Utilisateur non trouvé"));
        return;
      }
      
      const selectedPlan = cataloguesData.find(plan => plan.id === planId);
      if (!selectedPlan) {
        reject(new Error("Plan sélectionné invalide"));
        return;
      }
      
      const today = new Date();
      const endDate = new Date(today);
      
      switch (duration) {
        case "monthly":
          endDate.setMonth(today.getMonth() + 1);
          break;
        case "six_months":
          endDate.setMonth(today.getMonth() + 6);
          break;
        case "yearly":
          endDate.setFullYear(today.getFullYear() + 1);
          break;
        default:
          reject(new Error("Durée invalide"));
          return;
      }
      
      const updatedSubscription: Abonnement = {
        id: abonnementData.id,
        duration,
        start_date: today.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: "active",
        user,
        catalogue: selectedPlan
      };
      
      resolve(updatedSubscription);
    }, 10);
  });
};