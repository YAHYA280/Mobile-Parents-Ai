// Re-export all types from their respective files

// Child-related types
export * from "./child";

// Activity-related types
export * from "./activity";

// Chat-related types
export * from "./chat";

// UI component types
export * from "./ui";

// Navigation types
export * from "./navigation";

// Additional interfaces

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: "parent" | "teacher" | "admin";
  children?: number[]; // Child IDs
  createdAt: string;
  updatedAt: string;
  preferences?: {
    theme?: "light" | "dark" | "system";
    notifications?: boolean;
    language?: string;
    [key: string]: any;
  };
}

export interface AppError {
  code: string;
  message: string;
  details?: any;
}
