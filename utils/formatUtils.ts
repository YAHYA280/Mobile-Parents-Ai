export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const day = date.getDate();
  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

export const formatDuration = (duration: string): string => {
  if (
    duration.toLowerCase().includes("monthly") ||
    duration.toLowerCase().includes("mois")
  ) {
    if (duration.includes("six") || duration.includes("6")) {
      return "6 MOIS";
    }
    return "MENSUEL";
  }
  if (
    duration.toLowerCase().includes("yearly") ||
    duration.toLowerCase().includes("annuel")
  ) {
    return "ANNUEL";
  }
  return duration.substring(0, 3).toUpperCase();
};

export const getPricingPeriod = (duration: string): string => {
  switch (duration) {
    case "monthly":
      return "/ mois";
    case "six_months":
      return "/ 6 mois";
    case "yearly":
      return "/ an";
    default:
      return "";
  }
};
export const getPlanColor = (planId: string): string => {
  switch (planId) {
    case "1":
      return "#4CAF50"; // green
    case "2":
      return "#FF9800"; // orange
    case "3":
      return "#2196F3"; // blue
    default:
      return "#9E9E9E"; // grey fallback
  }
};

export const getPlanEmoji = (planId: string): string => {
  switch (planId) {
    case "1":
      return "🚀";
    case "2":
      return "🌟";
    case "3":
      return "🔥";
    default:
      return "💼";
  }
};
