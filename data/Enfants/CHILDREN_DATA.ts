// D:\bureau\PFA\dev\mobile\brainboost\brainboost-parent-mobile\Brainboost-Parent-Mobile\data\Enfants\CHILDREN_DATA.ts
import type { ImageSourcePropType } from 'react-native';

const user3Image: ImageSourcePropType = require('../../assets/images/users/user3.jpeg');
const user5Image: ImageSourcePropType = require('../../assets/images/users/user5.jpeg');

export interface Child {
  id: number;
  name: string;
  progress: string;
  evolutionRate?: number; // Taux d'évolution des performances
  engagementScore?: number; // Score d'engagement de l'enfant
  age: number;
  classe: string;
  matieresFortes: string[];
  matieresAmeliorer: string[];
  activitesRecentes: Activity[];
  activitesPrecedentes?: Activity[]; // Activités de la période précédente pour calculer l'évolution
  subjects: Subject[]; // Propriété pour les matières
  profileImage: ImageSourcePropType; // Change the type here
}
export interface Subject {
  name: string;
  chapters: Chapter[];
}
export interface Chapter {
  id: number;
  name: string;
  exercises: Exercice[];
}
export interface Exercice {
  id: number;
  name: string;
  description?: string;
  reussite?: boolean; // Ajout de la propriété optionnelle
  commentaire?: string; // Ajout de la propriété optionnelle
}
export interface ConversationMessage {
  sender: string; // 'assistant' | 'child'
  message: string;
  timestamp: string;
}
export interface Activity {
  id?: number;  // Ajout de la propriété id (optionnelle pour la compatibilité)
  date: string;
  activite: string;
  duree: string;
  score?: string;
  scoreDetails?: {
    correct: number;
    total: number;
    percentage: number;
  };
  assistant?: string;
  matiere?: string;
  chapitre?: string; // Ajout pour spécifier le chapitre
  temps?: string;
  exercices?: Exercice[];
  commentaires?: string;
  commentaireSpecifique?: string;
  recommandations?: string[];
  conversation?: ConversationMessage[];
  nom?: string;        // Ajout de la propriété type
  typeExercice?: string;        // Ajout de la propriété type
}
// Helper function to enhance basic activity with additional data
export const enhanceActivity = (baseActivity: Activity): Activity => {
  const idActuel = baseActivity.id;
  const defaultConversation = [
    {
      sender: "assistant",
      message: "Bonjour! Aujourd'hui nous allons travailler sur un sujet intéressant. Es-tu prêt?",
      timestamp: "14:00"
    },
    {
      sender: "child",
      message: "Oui, je suis prêt!",
      timestamp: "14:01"
    },
    {
      sender: "assistant",
      message: "Super! Commençons par une question simple...",
      timestamp: "14:01"
    },
    {
      sender: "child",
      message: "D'accord, je vais essayer de répondre.",
      timestamp: "14:02"
    },
    {
      sender: "assistant",
      message: "Excellent travail. Maintenant essayons quelque chose de plus difficile.",
      timestamp: "14:05"
    },
    {
      sender: "child",
      message: "Je ne suis pas sûr de comprendre cette question.",
      timestamp: "14:06"
    },
    {
      sender: "assistant",
      message: "Pas de problème, je vais t'expliquer différemment...",
      timestamp: "14:06"
    }
  ];
  const conversation = baseActivity.conversation || defaultConversation;  // Utiliser l'ID pour générer une conversation "unique"
  const activityId = baseActivity.id || 0;
  // Parse score if available (e.g., "8/10" -> { correct: 8, total: 10, percentage: 80 })
  let scoreDetails;
  if (baseActivity.score && baseActivity.score.includes('/')) {
    const [correct, total] = baseActivity.score.split('/').map(num => parseInt(num, 10));
    scoreDetails = {
      correct,
      total,
      percentage: (correct / total) * 100
    };
  }
  // Extract assistant name if exists
  const assistant = baseActivity.activite.includes("Assistant") ?
                   baseActivity.activite.split("Assistant ")[1]?.split(" ")[0] || "AI" : "AI";
  // Determine matiere and exercices based on assistant type
  let {matiere} = baseActivity;
  let {exercices} = baseActivity;
  const {chapitre} = baseActivity;
  // On ne définit pas de matières ni d'exercices pour Accueil et Recherche
  if (!matiere && assistant !== 'Accueil' && assistant !== 'Recherche') {
    matiere = baseActivity.activite.toLowerCase().includes("mathématiques") ? "Mathématiques" :
             baseActivity.activite.toLowerCase().includes("lecture") ? "Français" :
             baseActivity.activite.toLowerCase().includes("vocabulaire") ? "Français" :
             baseActivity.activite.toLowerCase().includes("conjugaison") ? "Français" : undefined;
  }

  // Exercices seulement pour les assistants d'apprentissage
  if (assistant === "J'Apprends" && !exercices) {
    // Déterminer les exercices basés sur le type d'activité
    if (matiere === "Mathématiques") {
      exercices = [
        { id: 1, name: "Calcul mental", reussite: true, commentaire: "Bonne maîtrise des opérations de base" },
        { id: 2, name: "Problèmes", reussite: false, commentaire: "Difficulté avec les problèmes complexes" }
      ];
    } else if (matiere === "Français") {
      exercices = [
        { id: 1, name: "Compréhension de texte", reussite: true, commentaire: "Bonne capacité d'analyse" },
        { id: 2, name: "Règles grammaticales", reussite: true, commentaire: "Maîtrise des règles de base" }
      ];
    }
  }
  // Définir les commentaires et recommandations en fonction de l'assistant
  let commentaires;
  let commentaireSpecifique;
  let recommandations;
    if (assistant === "J'Apprends") {
    commentaires = "L'enfant a montré une bonne compréhension des concepts de base.";
    commentaireSpecifique = "Réagit bien aux encouragements et montre de l'enthousiasme pour les activités interactives.";
    recommandations = [
      "Continuer à pratiquer régulièrement",
      "Essayer des exercices plus avancés sur le même sujet"
    ];
  } else if (assistant === "Recherche") {
    commentaires = "A montré de l'intérêt pour le sujet de recherche.";
    commentaireSpecifique = "Pose des questions pertinentes et cherche à approfondir ses connaissances.";
    recommandations = [
      "Explorer des sujets connexes",
      "Consulter des ressources supplémentaires sur ce thème"
    ];
  } else if (assistant === "Accueil") {
    commentaires = "Bonne participation à la session d'accueil.";
    commentaireSpecifique = "S'adapte bien à la plateforme et comprend les différentes fonctionnalités.";
    recommandations = [
      "Explorer les différents assistants disponibles",
      "Établir un programme d'apprentissage régulier"
    ];
  }
  // Return enhanced activity
  return {
    id: idActuel,
    ...baseActivity,
    scoreDetails,
    matiere,
    chapitre,
    assistant,
    temps: baseActivity.duree,
    exercices,
    commentaires,
    commentaireSpecifique,
    recommandations,
    conversation // Assurez-vous que cette propriété est incluse
  };
};

// Données fictives pour les enfants
export const CHILDREN_DATA: Child[] = [
  {
    id: 1,
    name: "sara",
    progress: "", // Sera calculé automatiquement par la fonction calculateProgress
    age: 9,
    classe: "CM1",
    matieresFortes: ["Français", "Histoire"],
    matieresAmeliorer: ["Mathématiques", "Sciences"],
    profileImage: user3Image , 
    activitesRecentes: [
      {
        id: 1001,
        date: "2025-03-24",
        activite: "Exercice de Grammaire en Français avec l'Assistant J'Apprends",
        duree: "30 min",
        score: "8/10",
        matiere: "Français",
        chapitre: "Grammaire",
        typeExercice: "Accords des adjectifs",
        conversation: [
          { sender: "assistant", message: "Bonjour Sara! Aujourd'hui, nous allons travailler sur les accords des adjectifs en français.", timestamp: "14:00" },
          { sender: "child", message: "D'accord, je suis prête.", timestamp: "14:01" },
          { sender: "assistant", message: "Super! Commençons par un exercice simple. Comment accorde-t-on l'adjectif 'grand' avec le nom 'maison'?", timestamp: "14:02" },
          { sender: "child", message: "Une grande maison.", timestamp: "14:03" },
          { sender: "assistant", message: "Parfait! Maintenant, avec 'château'?", timestamp: "14:04" },
          { sender: "child", message: "Un grand château.", timestamp: "14:05" },
          { sender: "assistant", message: "Excellent! Passons à un exemple plus difficile. Comment accorde-t-on 'beau' avec 'fleur'?", timestamp: "14:06" },
          { sender: "child", message: "Une belle fleur.", timestamp: "14:07" },
          { sender: "assistant", message: "Très bien! Et avec 'tableau'?", timestamp: "14:08" },
          { sender: "child", message: "Un beau tableau.", timestamp: "14:09" },
          { sender: "assistant", message: "Parfait! Continuons avec les accords au pluriel. Comment accorde-t-on 'petit' avec 'enfants'?", timestamp: "14:10" },
          { sender: "child", message: "Des petits enfants.", timestamp: "14:11" },
          { sender: "assistant", message: "Bravo! Tu as bien compris les règles d'accord. Ton score final est de 8/10.", timestamp: "14:12" }
        ],
        exercices: [
          { id: 1, name: "Accords avec des noms féminins", reussite: true, commentaire: "Bonne maîtrise des accords au féminin" },
          { id: 2, name: "Accords avec des noms pluriels", reussite: false, commentaire: "Quelques confusions avec les cas particuliers au pluriel" }
        ]
      },
      {
        id: 1002,
        date: "2025-03-25",
        activite: "Exercice de Multiplication en Mathématiques avec l'Assistant J'Apprends",
        duree: "35 min",
        score: "7/10",
        matiere: "Mathématiques",
        chapitre: "Multiplications",
        typeExercice: "Multiplication de nombres entiers",
        conversation: [
          { sender: "assistant", message: "Bonjour Sara! Aujourd'hui, nous allons travailler sur les multiplications.", timestamp: "15:00" },
          { sender: "child", message: "D'accord, je suis prête.", timestamp: "15:01" },
          { sender: "assistant", message: "Super! Commençons par un exercice simple. Combien font 7 × 8?", timestamp: "15:02" },
          { sender: "child", message: "7 × 8 = 56", timestamp: "15:03" },
          { sender: "assistant", message: "Excellent! Maintenant, calculons 9 × 6.", timestamp: "15:04" },
          { sender: "child", message: "9 × 6 = 54", timestamp: "15:05" },
          { sender: "assistant", message: "Parfait! Passons à un exemple plus difficile. Combien font 12 × 7?", timestamp: "15:06" },
          { sender: "child", message: "12 × 7... Je pense que c'est 84.", timestamp: "15:07" },
          { sender: "assistant", message: "Très bien! Essayons maintenant 15 × 8.", timestamp: "15:08" },
          { sender: "child", message: "15 × 8... C'est 120.", timestamp: "15:09" },
          { sender: "assistant", message: "C'est presque ça! 15 × 8 = 120. Vérifions: 10 × 8 = 80, et 5 × 8 = 40. Donc 80 + 40 = 120.", timestamp: "15:10" },
          { sender: "child", message: "Ah oui, je me suis trompée dans mon calcul.", timestamp: "15:11" },
          { sender: "assistant", message: "Ne t'inquiète pas, tu t'améliores! Ton score final est de 7/10.", timestamp: "15:12" }
        ],
        exercices: [
          { id: 1, name: "Tables de multiplication de base", reussite: true, commentaire: "Bonne mémorisation des tables de 1 à 10" },
          { id: 2, name: "Multiplications à deux chiffres", reussite: false, commentaire: "Difficulté avec les multiplications impliquant des nombres à deux chiffres" }
        ]
      },
      {
        id: 1003,
        date: "2025-03-26",
        activite: "Recherche sur l'Égypte ancienne avec l'Assistant Recherche",
        duree: "40 min",
        score: "8/10",
        matiere: "Histoire",
        chapitre: "Préhistoire",
        typeExercice: "Égypte ancienne",
        conversation: [
          { sender: "assistant", message: "Bonjour Sara! Aujourd'hui, nous allons explorer l'Égypte ancienne. Qu'aimerais-tu savoir?", timestamp: "16:00" },
          { sender: "child", message: "J'aimerais en savoir plus sur les pyramides!", timestamp: "16:01" },
          { sender: "assistant", message: "Excellente question! Les pyramides d'Égypte sont d'immenses monuments construits comme tombeaux pour les pharaons.", timestamp: "16:02" },
          { sender: "child", message: "Comment les ont-ils construites sans machines?", timestamp: "16:03" },
          { sender: "assistant", message: "Les Égyptiens utilisaient des techniques ingénieuses! Ils déplaçaient d'énormes blocs de pierre sur des rampes, et utilisaient des leviers et des cordes.", timestamp: "16:04" },
          { sender: "child", message: "Combien de personnes travaillaient à la construction?", timestamp: "16:05" },
          { sender: "assistant", message: "On pense qu'environ 20,000 à 30,000 ouvriers travaillaient sur la Grande Pyramide de Gizeh. Et contrairement à ce qu'on croyait, ce n'étaient pas des esclaves mais des travailleurs respectés!", timestamp: "16:06" },
          { sender: "child", message: "Qu'y a-t-il à l'intérieur des pyramides?", timestamp: "16:07" },
          { sender: "assistant", message: "À l'intérieur, on trouve différentes chambres, dont la chambre funéraire avec le sarcophage du pharaon. Il y avait aussi des trésors, des objets quotidiens et des provisions pour l'au-delà.", timestamp: "16:08" },
          { sender: "child", message: "C'est fascinant! Et les momies?", timestamp: "16:09" },
          { sender: "assistant", message: "Les Égyptiens croyaient en la vie après la mort, alors ils momifiaient les corps des pharaons. Cela impliquait un processus d'embaumement qui prenait environ 70 jours!", timestamp: "16:10" },
          { sender: "child", message: "Merci pour toutes ces informations!", timestamp: "16:11" },
          { sender: "assistant", message: "Tu as posé d'excellentes questions! Ton score pour cette recherche est de 8/10.", timestamp: "16:12" }
        ]
      },
      {
        id: 1004,
        date: "2025-03-27",
        activite: "Quiz sur l'application avec l'Assistant Accueil",
        duree: "20 min",
        score: "7/10",
        conversation: [
          { sender: "assistant", message: "Bonjour Sara! Aujourd'hui, je vais te faire un petit quiz sur l'utilisation de notre application. Es-tu prête?", timestamp: "17:00" },
          { sender: "child", message: "Oui, je suis prête!", timestamp: "17:01" },
          { sender: "assistant", message: "Super! Première question: Quels sont les trois assistants disponibles dans l'application?", timestamp: "17:02" },
          { sender: "child", message: "J'Apprends, Recherche et Accueil!", timestamp: "17:03" },
          { sender: "assistant", message: "Parfait! Deuxième question: À quoi sert l'Assistant J'Apprends?", timestamp: "17:04" },
          { sender: "child", message: "Il m'aide à faire des exercices dans différentes matières.", timestamp: "17:05" },
          { sender: "assistant", message: "Excellent! Troisième question: Comment peux-tu voir ton progrès dans une matière?", timestamp: "17:06" },
          { sender: "child", message: "Je peux le voir dans mon profil, je crois?", timestamp: "17:07" },
          { sender: "assistant", message: "Presque! Tu peux le voir dans ton profil, mais aussi directement dans chaque matière. Quatrième question: Comment signaler un problème dans l'application?", timestamp: "17:08" },
          { sender: "child", message: "Je dois cliquer sur l'icône d'aide en haut à droite.", timestamp: "17:09" },
          { sender: "assistant", message: "Très bien! Dernière question: Combien de matières principales peux-tu étudier avec J'Apprends?", timestamp: "17:10" },
          { sender: "child", message: "Cinq matières: Mathématiques, Français, Histoire, Sciences et Anglais.", timestamp: "17:11" },
          { sender: "assistant", message: "Bravo! Tu as bien répondu. Ton score final est de 7/10.", timestamp: "17:12" }
        ]
      }
    ],
    subjects: [
      {
        name: "Français",
        chapters: [
          {
            id: 1,
            name: "Grammaire",
            exercises: [
              { id: 1, name: "Accords des adjectifs" },
              { id: 2, name: "Conjugaison" }
            ]
          },
          {
            id: 2,
            name: "Littérature",
            exercises: [
              { id: 1, name: "Analyse de texte" },
              { id: 2, name: "Poésie" }
            ]
          }
        ]
      },
      {
        name: "Histoire",
        chapters: [
          {
            id: 1,
            name: "Préhistoire",
            exercises: [
              { id: 1, name: "Égypte ancienne" },
              { id: 2, name: "Grèce antique" }
            ]
          },
          {
            id: 2,
            name: "Antiquité",
            exercises: [
              { id: 1, name: "Chevaliers" },
              { id: 2, name: "Châteaux forts" }
            ]
          }
        ]
      },
      {
        name: "Mathématiques",
        chapters: [
          {
            id: 1,
            name: "Additions",
            exercises: [
              { id: 1, name: "Addition de nombres entiers"},
              { id: 2, name: "Addition de nombres décimaux" },
              { id: 3, name: "Problèmes d'addition" }
            ]
          },
          {
            id: 2,
            name: "Multiplications",
            exercises: [
              { id: 1, name: "Multiplication de nombres entiers" },
              { id: 2, name: "Multiplication de fractions"},
              { id: 3, name: "Problèmes de multiplication" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Zakariae",
    progress: "", // Sera calculé automatiquement
    age: 10,
    classe: "CM2",
    matieresFortes: ["Sciences", "Anglais"],
    matieresAmeliorer: ["Mathématiques", "Histoire"],
    profileImage: user5Image, 
    activitesRecentes: [
      {
        id: 2001,
        date: "2025-03-24",
        activite: "Exercice de Physique avec l'Assistant J'Apprends",
        duree: "35 min",
        score: "8/10",
        matiere: "Sciences",
        chapitre: "Physique",
        typeExercice: "Forces et mouvements",
        conversation: [
          { sender: "assistant", message: "Bonjour Zakariae! Aujourd'hui, nous allons explorer les forces et les mouvements.", timestamp: "14:00" },
          { sender: "child", message: "Super! J'aime beaucoup la physique.", timestamp: "14:01" },
          { sender: "assistant", message: "Parfait! Commençons par comprendre ce qu'est une force. Peux-tu me donner un exemple de force?", timestamp: "14:02" },
          { sender: "child", message: "La gravité est une force, non?", timestamp: "14:03" },
          { sender: "assistant", message: "Excellent exemple! Pouvons-nous parler d'autres types de forces?", timestamp: "14:04" },
          { sender: "child", message: "Il y a la force de friction quand on frotte deux objets.", timestamp: "14:05" },
          { sender: "assistant", message: "Très bien! Maintenant, résous ce problème sur les forces.", timestamp: "14:06" }
        ],
        exercices: [
          { id: 1, name: "Identification des forces", reussite: true, commentaire: "Excellente compréhension des types de forces" },
          { id: 2, name: "Application des principes physiques", reussite: true, commentaire: "Bon raisonnement scientifique" }
        ]
      },
      {
        id: 2002,
        date: "2025-03-25",
        activite: "Exercice de Vocabulaire en Anglais avec l'Assistant J'Apprends",
        duree: "30 min",
        score: "9/10",
        matiere: "Anglais",
        chapitre: "Vocabulaire",
        typeExercice: "Expressions idiomatiques",
        conversation: [
          { sender: "assistant", message: "Hi Zakariae! Today we'll learn some English idioms.", timestamp: "15:00" },
          { sender: "child", message: "I'm ready! I love learning new expressions.", timestamp: "15:01" },
          { sender: "assistant", message: "Great! What does 'break a leg' mean?", timestamp: "15:02" },
          { sender: "child", message: "It means 'good luck', especially in performances!", timestamp: "15:03" },
          { sender: "assistant", message: "Perfect! Let's try another one. What about 'it's raining cats and dogs'?", timestamp: "15:04" },
          { sender: "child", message: "It means it's raining very heavily!", timestamp: "15:05" },
          { sender: "assistant", message: "Excellent! You're really good at these.", timestamp: "15:06" }
        ],
        exercices: [
          { id: 1, name: "Idiom Meanings", reussite: true, commentaire: "Excellent vocabulary understanding" },
          { id: 2, name: "Context Usage", reussite: true, commentaire: "Great at using idioms in context" }
        ]
      },
      {
        id: 2003,
        date: "2025-03-26",
        activite: "Quiz sur l'application avec l'Assistant Accueil",
        duree: "20 min",
        score: "7/10",
        conversation: [
          { sender: "assistant", message: "Bonjour Zakariae! Aujourd'hui, je vais te faire un petit quiz sur l'utilisation de notre application.", timestamp: "16:00" },
          { sender: "child", message: "Je suis prêt!", timestamp: "16:01" },
          { sender: "assistant", message: "Super! Quels sont les principaux assistants de l'application?", timestamp: "16:02" },
          { sender: "child", message: "J'Apprends, Recherche et Accueil!", timestamp: "16:03" },
          { sender: "assistant", message: "Parfait! Comment peux-tu suivre tes progrès?", timestamp: "16:04" },
          { sender: "child", message: "Dans mon profil et dans chaque matière.", timestamp: "16:05" },
          { sender: "assistant", message: "Excellent! Ton score final est de 7/10.", timestamp: "16:06" }
        ]
      },
      {
        id: 2004,
        date: "2025-03-27",
        activite: "Recherche sur l'Intelligence Artificielle avec l'Assistant Recherche",
        duree: "40 min",
        score: "8/10",
        matiere: "Sciences",
        chapitre: "Écologie",
        conversation: [
          { sender: "assistant", message: "Bonjour Zakariae! Aujourd'hui, nous allons explorer l'Intelligence Artificielle. Qu'aimerais-tu savoir?", timestamp: "17:00" },
          { sender: "child", message: "Comment fonctionne vraiment l'IA?", timestamp: "17:01" },
          { sender: "assistant", message: "L'IA utilise des algorithmes et l'apprentissage machine pour résoudre des problèmes complexes.", timestamp: "17:02" },
          { sender: "child", message: "Quels sont ses principaux domaines d'application?", timestamp: "17:03" },
          { sender: "assistant", message: "L'IA est utilisée dans la médecine, les voitures autonomes, la reconnaissance vocale, et bien plus encore!", timestamp: "17:04" },
          { sender: "child", message: "C'est fascinant!", timestamp: "17:05" },
          { sender: "assistant", message: "Tu as posé d'excellentes questions. Ton score pour cette recherche est de 8/10.", timestamp: "17:06" }
        ]
      }
    ],
    subjects: [
      {
        name: "Sciences",
        chapters: [
          {
            id: 1,
            name: "Écologie",
            exercises: [
              { id: 1, name: "Forces et mouvements" },
              { id: 2, name: "Énergie" }
            ]
          },
          {
            id: 2,
            name: "Astronomie",
            exercises: [
              { id: 1, name: "Intelligence Artificielle" },
              { id: 2, name: "Robotique" }
            ]
          }
        ]
      },
      {
        name: "Anglais",
        chapters: [
          {
            id: 1,
            name: "Vocabulaire",
            exercises: [
              { id: 1, name: "Expressions idiomatiques" },
              { id: 2, name: "Vocabulaire thématique" }
            ]
          },
          {
            id: 2,
            name: "Grammaire",
            exercises: [
              { id: 1, name: "Temps verbaux" },
              { id: 2, name: "Structure des phrases" }
            ]
          }
        ]
      }
    ]
  },
];

// Fonction pour calculer la progression en pourcentage à partir des scores
const calculateProgress = (activities: Activity[]): string => {
  // Filtrer les activités qui ont un score au format X/10
  const activitiesWithScore = activities.filter(activity => 
    activity.score && activity.score.includes('/') 
  );
  
  if (activitiesWithScore.length === 0) return "0%";
  
  // Calculer la moyenne des scores
  let totalScore = 0;
  activitiesWithScore.forEach(activity => {
    if (activity.score) {
      const scoreParts = activity.score.split('/');
      if (scoreParts.length === 2) {
        const numerator = parseInt(scoreParts[0], 10);
        const denominator = parseInt(scoreParts[1], 10);        
        if (!Number.isNaN(numerator) && !Number.isNaN(denominator) && denominator !== 0) {
          totalScore += (numerator / denominator) * 100;
        }
      }
    }
  });
  
  const averagePercentage = totalScore / activitiesWithScore.length;
  return `${averagePercentage.toFixed(1)}%`;
};

// Fonction pour calculer le taux d'évolution entre deux périodes
// Par exemple: comparaison des scores entre la semaine dernière et cette semaine
const calculateEvolutionRate = (currentActivities: Activity[], previousActivities: Activity[]): number => {
  // Calculer la moyenne des scores actuels
  const currentAvg = calculateAverageScore(currentActivities);
  
  // Calculer la moyenne des scores précédents
  const previousAvg = calculateAverageScore(previousActivities);
  
  // Éviter la division par zéro
  if (previousAvg === 0) return 0;
  
  // Calculer le taux d'évolution en pourcentage
  return ((currentAvg - previousAvg) / previousAvg) * 100;
};

// Fonction pour calculer l'engagement basé sur la fréquence et la durée des activités
const calculateEngagementScore = (activities: Activity[], daysInterval: number = 7): number => {
  if (activities.length === 0) return 0;
  
  // 1. Calculer la fréquence (nombre d'activités par période)
  const frequency = activities.length / daysInterval;
  
  // 2. Calculer la durée moyenne des sessions en minutes
  let totalDuration = 0;
  activities.forEach(activity => {
    if (activity.duree) {
      // Convertir "XX min" en nombre de minutes
      const durationMatch = activity.duree.match(/(\d+)/);
      if (durationMatch) {
        totalDuration += parseInt(durationMatch[1], 10);
      }
    }
  });
  const avgDuration = totalDuration / activities.length;
  
  // 3. Calculer un score d'engagement (formule personnalisable)
  // Cette formule simple donne une note sur 100
  // Plus la fréquence et la durée sont élevées, plus le score est élevé
  const frequencyWeight = 0.6; // 60% du score basé sur la fréquence
  const durationWeight = 0.4; // 40% du score basé sur la durée moyenne
  
  // Normaliser la fréquence (considérer qu'une activité par jour est le maximum idéal)
  const normalizedFrequency = Math.min(frequency, 1) * 100;
  
  // Normaliser la durée (considérer que 45 minutes est une durée optimale)
  const normalizedDuration = Math.min(avgDuration / 45, 1) * 100;
  
  // Calculer le score final
  return (normalizedFrequency * frequencyWeight) + (normalizedDuration * durationWeight);
};

// Fonction auxiliaire pour calculer la moyenne des scores numériques
const calculateAverageScore = (activities: Activity[]): number => {
  const activitiesWithScore = activities.filter(activity => 
    activity.score && activity.score.includes('/')
  );
  
  if (activitiesWithScore.length === 0) return 0;
  
  let totalScore = 0;
  activitiesWithScore.forEach(activity => {
    if (activity.score) {
      const [numerator, denominator] = activity.score.split('/').map(Number);
      if (!Number.isNaN(numerator) && !Number.isNaN(denominator) && denominator !== 0) {
        totalScore += numerator / denominator;
      }
    }
  });
  
  return totalScore / activitiesWithScore.length;
};

// Exemple d'activités précédentes pour Sara (pour démonstration)
const activitesPrecedentes: Activity[] = [
  {
    id: 901,
    date: "2025-03-17",
    activite: "Exercice d'Orthographe en Français avec l'Assistant J'Apprends",
    duree: "25 min",
    score: "6/10",
    matiere: "Français",
    chapitre: "Orthographe"
  },
  {
    id: 902,
    date: "2025-03-18",
    activite: "Exercice de Fractions en Mathématiques avec l'Assistant J'Apprends",
    duree: "30 min",
    score: "5/10",
    matiere: "Mathématiques",
    chapitre: "Fractions"
  }
];

// Appliquer la fonction enhanceActivity à toutes les activités
// et calculer les différentes métriques pour chaque enfant
CHILDREN_DATA.forEach((child) => {
  // Activités récentes
  child.activitesRecentes = child.activitesRecentes.map(activity => enhanceActivity(activity));
  
  // Ajouter les activités précédentes pour démonstration (uniquement pour Sara)
  if (child.id === 1) {
    child.activitesPrecedentes = activitesPrecedentes.map(activity => enhanceActivity(activity));
  } else {
    child.activitesPrecedentes = [];
  }
  
  // Calculer la progression
  child.progress = calculateProgress(child.activitesRecentes);
  
  // Calculer le taux d'évolution si des activités précédentes existent
  if (child.activitesPrecedentes && child.activitesPrecedentes.length > 0) {
    child.evolutionRate = calculateEvolutionRate(child.activitesRecentes, child.activitesPrecedentes);
  }
  
  // Calculer le score d'engagement (sur les 7 derniers jours)
  child.engagementScore = calculateEngagementScore(child.activitesRecentes, 7);
});

// Données fictives pour les exercices selon les matières
export const EXERCISES_DATA = {
  "Mathématiques": ["Additions", "Soustractions", "Multiplications", "Divisions", "Fractions", "Géométrie"],
  "Français": ["Grammaire", "Conjugaison", "Orthographe", "Vocabulaire", "Expression écrite", "Lecture"],
  "Histoire": ["Préhistoire", "Antiquité", "Moyen Âge", "Temps modernes", "Époque contemporaine"],
  "Sciences": ["Biologie", "Physique", "Chimie", "Astronomie", "Écologie"],
  "Anglais": ["Vocabulaire", "Grammaire", "Compréhension", "Expression orale", "Expression écrite"]
};

export default CHILDREN_DATA;