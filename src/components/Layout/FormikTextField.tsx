import React from "react";
import { useField } from "formik";
import { TextField, TextFieldProps } from "@material-ui/core";

type FormikTextFieldProps = {
  formikKey: string;
} & TextFieldProps;

export const FormikTextField = ({
  formikKey,
  ...props
}: FormikTextFieldProps) => {
  // const classes = useStyles()
  //helpers
  const [field, meta] = useField(formikKey);
  return (
    <TextField
      id={field.name}
      name={field.name}
      helperText={meta.touched ? meta.error : ""}
      error={meta.touched && Boolean(meta.error)}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      fullWidth
      variant="outlined"
      sx={{ mt: 1 }}
      {...props}
    />
  );
};
