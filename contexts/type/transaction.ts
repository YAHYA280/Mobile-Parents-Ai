import type { ImageSourcePropType } from "react-native";

export type TRANSACTION = {
  name: string;
  image: ImageSourcePropType;
  status: string;
  category: string;
  user: string;
  phone: string;
  email: string;
  country: string;
  price: number;
  paymentMethods: string;
  date: string;
  id: string;
};
