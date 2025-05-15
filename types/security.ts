// Define types for reuse in both components and main file
export interface Device {
  id: string;
  name: string;
  type: "android" | "ios" | "web" | "desktop"; // Strict type definition
  connectionDate: string;
  isActive: boolean;
  lastActivity: string;
}

export interface PaymentMethod {
  id: string;
  cardNumber: string;
  cardType: "visa" | "mastercard" | "amex" | "paypal"; // Strict type definition
  expiryDate: string;
  isActive: boolean;
  lastUsed: string;
}
