// This file would typically be part of your data or services directory
// For now, placing it along with the notification components

export interface Notification {
  id: string;
  type: string;
  subject: string;
  message: string;
  time: string;
  read: boolean;
  archived: boolean;
  favorite: boolean;
}

export const notificationsData: Notification[] = [
  {
    id: "1",
    type: "Progrès",
    subject: "Votre enfant a atteint 80% de progrès en mathématiques.",
    message: "Bravo ! Thomas a terminé son exercice avec succès 🎉",
    time: "2 min",
    read: false,
    archived: false,
    favorite: false,
  },
  {
    id: "2",
    type: "Rappels",
    subject: "N'oubliez pas de vérifier les devoirs de mathématiques.",
    message: "Assurez-vous que Marie termine son exercice de mathématiques 📚",
    time: "5 min",
    read: true,
    archived: false,
    favorite: false,
  },
  {
    id: "3",
    type: "Rappels",
    subject: "Nouveau défi : Géométrie disponible pour Thomas.",
    message: "Encouragez-le à continuer. Chaque petit effort compte 💪",
    time: "12 min",
    read: false,
    archived: false,
    favorite: true,
  },
  {
    id: "4",
    type: "Mises à jour",
    subject: "La version 2.3.0 de l'application a été publiée ce matin.",
    message: "L'échéance du devoir de votre enfant est dans 2 jours ! 📆",
    time: "45 min",
    read: false,
    archived: true,
    favorite: false,
  },
  {
    id: "5",
    type: "Support",
    subject: "Une mise à jour concernant votre demande est disponible.",
    message: "Veuillez consulter l'onglet Support pour plus d'informations",
    time: "1 h",
    read: false,
    archived: false,
    favorite: false,
  },
  {
    id: "6",
    type: "Rappels",
    subject: "Thomas est à 5 000 XP du prochain niveau.",
    message: "Félicitez-le pour ses efforts continus !",
    time: "2 h",
    read: true,
    archived: false,
    favorite: false,
  },
  {
    id: "7",
    type: "Progrès",
    subject: "Marie a complété le Chapitre 4 ! Félicitations.",
    message: "Excellente progression cette semaine pour votre enfant",
    time: "3 h",
    read: true,
    archived: false,
    favorite: true,
  },
  {
    id: "8",
    type: "Conseils",
    subject:
      "Astuce : 15 minutes par jour aident à consolider les compétences.",
    message: "Une routine quotidienne est importante pour l'apprentissage",
    time: "4 h",
    read: false,
    archived: false,
    favorite: false,
  },
  {
    id: "9",
    type: "Trophée",
    subject: "Thomas a obtenu le trophée 'Champion de calcul'.",
    message: "Encouragez-le à continuer de s'améliorer !",
    time: "5 h",
    read: true,
    archived: true,
    favorite: false,
  },
  {
    id: "10",
    type: "Rappels",
    subject: "Vérifiez l'exercice de français de Marie.",
    message: "Il reste 4 questions à compléter",
    time: "6 h",
    read: true,
    archived: true,
    favorite: false,
  },
  {
    id: "11",
    type: "Progrès",
    subject: "Thomas a maîtrisé la multiplication à deux chiffres !",
    message: "Super ! Votre enfant progresse rapidement",
    time: "8 h",
    read: false,
    archived: false,
    favorite: false,
  },
  {
    id: "12",
    type: "Support",
    subject: "Maintenance planifiée de l'application.",
    message: "L'application sera indisponible pendant 30 minutes cette nuit",
    time: "12 h",
    read: true,
    archived: false,
    favorite: false,
  },
];

// Function to get the count of notifications by type
export function getNotificationCounts() {
  return {
    all: notificationsData.length,
    unread: notificationsData.filter((n) => !n.read).length,
    read: notificationsData.filter((n) => n.read).length,
    favorite: notificationsData.filter((n) => n.favorite).length,
    archive: notificationsData.filter((n) => n.archived).length,
  };
}
