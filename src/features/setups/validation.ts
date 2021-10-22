import * as Yup from "yup";

const displayName = Yup.string()
  .min(3, "Must be 3 characters at minimum")
  .max(128, "Must be 128 characters or less")
  .trim()
  .required();

const email = Yup.string()
  .email()
  .min(8)
  .max(254)
  .lowercase()
  .trim()
  .required();

export const registerSchema = Yup.object({
  displayName,
});

export const createUserSchema = Yup.object({
  email,
});
