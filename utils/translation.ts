import { TRANSACTION_STATUS_OPTIONS } from "@/data/_mock/_transaction";

export type TransactionStatus =
  | "all"
  | "paid"
  | "pending"
  | "cancelled"
  | "refunded"
  | "failed"
  | string;

// Définir un type pour l'objet de traduction
interface StatusTranslations {
  [key: string]: string;
}

const statusTranslations: StatusTranslations = TRANSACTION_STATUS_OPTIONS;

export const translateTransactionStatus = (
  status: TransactionStatus
): string => {
  if (status.toLowerCase() in statusTranslations) {
    return statusTranslations[status.toLowerCase()];
  }
  return status;
};
