import { z } from "zod";

// String Validation
export const validateString = (
  id: string,
  value: string
): string | undefined => {
  const schema = z
    .string()
    .nonempty({ message: "La valeur ne peut pas être vide." });

  try {
    schema.parse(value);
    return undefined; // Pas d'erreur
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message;
    }
    return "Une erreur inattendue est survenue.";
  }
};

// Email Validation
export const validateEmail = (
  id: string,
  value: string
): string | undefined => {
  const schema = z
    .string()
    .email({ message: "Adresse e-mail invalide." })
    .nonempty({ message: "L'e-mail ne peut pas être vide." });

  try {
    schema.parse(value);
    return undefined; // Pas d'erreur
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message;
    }
    return "Une erreur inattendue est survenue.";
  }
};

// Password Validation
export const validatePassword = (
  id: string,
  value: string
): string | undefined => {
  const schema = z
    .string()
    .min(6, {
      message: "Le mot de passe doit comporter au moins 6 caractères.",
    })
    .nonempty({ message: "Le mot de passe ne peut pas être vide." });

  try {
    schema.parse(value);
    return undefined; // Pas d'erreur
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message;
    }
    return "Une erreur inattendue est survenue.";
  }
};

// Number Validation
export const validateNumber = (
  id: string,
  value: string
): string | undefined => {
  const schema = z
    .string()
    .regex(/^\d+$/, { message: "La valeur doit être un nombre valide." })
    .nonempty({ message: "La valeur ne peut pas être vide." });

  try {
    schema.parse(value);
    return undefined; // Pas d'erreur
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message;
    }
    return "Une erreur inattendue est survenue.";
  }
};

// Credit Card Number Validation
export const validateCreditCardNumber = (
  id: string,
  value: string
): string | undefined => {
  const schema = z
    .string()
    .regex(/^(?:\d{4}-){3}\d{4}$|^\d{16}$/, {
      message: "Numéro de carte de crédit invalide.",
    })
    .nonempty({
      message: "Le numéro de carte de crédit ne peut pas être vide.",
    });

  try {
    schema.parse(value);
    return undefined; // Pas d'erreur
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message;
    }
    return "Une erreur inattendue est survenue.";
  }
};

// CVV Validation
export const validateCVV = (id: string, value: string): string | undefined => {
  const schema = z
    .string()
    .regex(/^[0-9]{3,4}$/, { message: "CVV invalide." })
    .nonempty({ message: "Le CVV ne peut pas être vide." });

  try {
    schema.parse(value);
    return undefined; // Pas d'erreur
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message;
    }
    return "Une erreur inattendue est survenue.";
  }
};

// Expiry Date Validation
export const validateExpiryDate = (
  id: string,
  value: string
): string | undefined => {
  const schema = z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, {
      message: "Date d'expiration invalide. Veuillez utiliser le format MM/AA.",
    })
    .nonempty({ message: "La date d'expiration ne peut pas être vide." });

  try {
    schema.parse(value);
    return undefined; // Pas d'erreur
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message;
    }
    return "Une erreur inattendue est survenue.";
  }
};
