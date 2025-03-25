import {
  validateCVV,
  validateEmail,
  validateString,
  validateNumber,
  validatePassword,
  validateExpiryDate,
  validateCreditCardNumber,
} from "../ValidationConstraints";

export const validateInput = (
  inputId: string,
  inputValue: string
): string | undefined => {
  if (
    inputId === "fullName" ||
    inputId === "firstName" ||
    inputId === "lastName" ||
    inputId === "location" ||
    inputId === "phoneNumber" ||
    inputId === "bio" ||
    inputId === "address" ||
    inputId === "street" ||
    inputId === "postalCode" ||
    inputId === "appartment" ||
    inputId === "destination" ||
    inputId === "ageRange" ||
    inputId === "description" ||
    inputId === "about" ||
    inputId === "creditCardHolderName" ||
    inputId === "addressLine1" ||
    inputId === "addressLine2"
  ) {
    return validateString(inputId, inputValue);
  }
  if (
    inputId === "email" ||
    inputId === "currentEmail" ||
    inputId === "newEmail"
  ) {
    return validateEmail(inputId, inputValue);
  }
  if (
    inputId === "password" ||
    inputId === "confirmPassword" ||
    inputId === "currentPassword" ||
    inputId === "newPassword" ||
    inputId === "confirmNewPassword"
  ) {
    return validatePassword(inputId, inputValue);
  }
  if (inputId === "resetToken") {
    return validateString(inputId, inputValue);
  }
  if (inputId === "places") {
    return validateNumber(inputId, inputValue);
  }
  if (inputId === "creditCardNumber") {
    return validateCreditCardNumber(inputId, inputValue);
  }
  if (inputId === "creditCardExpiryDate") {
    return validateExpiryDate(inputId, inputValue);
  }
  if (inputId === "cvv") {
    return validateCVV(inputId, inputValue);
  }
  return undefined;
};
