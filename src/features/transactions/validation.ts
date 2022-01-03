import * as Yup from "yup";

const item = Yup.object().shape({
  id: Yup.number().required(),
  displayName: Yup.string().required(),
});

const qty = Yup.number()
  .min(0.01, "Minimum must be 0.01")
  .max(1000000, "Maximum must be 1 million")
  .required();

const eachPrice = Yup.number()
  .min(0.01, "Minimum must be 0.01")
  .max(1000000, "Maximum must be 1 million")
  .required();

export const lineSchema = Yup.object({
  item,
  qty,
  eachPrice,
});
