import * as Yup from "yup";

const displayName = Yup.string()
  .min(3, "Must be 3 characters at minimum")
  .max(128, "Must be 128 characters or less")
  .trim()
  .required();

// const accountNumber = Yup.string()
//   .min(4, "Must be 4 characters at minimum")
//   .max(15, "Must be 15 characters or less")
//   .required();
const regExp = /\b\d{4,15}\b/;

const accountNumber = Yup.string().matches(regExp, {
  message: "Incorrect Account Number",
  excludeEmptyString: true,
});

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

export const accountSchema = Yup.object({
  accountNumber,
});

export const createUserSchema = Yup.object({
  email,
});
