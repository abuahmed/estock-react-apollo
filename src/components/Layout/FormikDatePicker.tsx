import {
  DesktopDatePicker,
  DesktopDatePickerProps,
  DatePicker,
  DatePickerProps,
} from "@mui/lab";
import { useField, useFormikContext } from "formik";

type FormikDesktopDatePickerProps = {
  formikKey: string;
} & DesktopDatePickerProps;

export const FormikDesktopDatePicker = ({
  formikKey,
  ...props
}: FormikDesktopDatePickerProps) => {
  const [field, meta] = useField(formikKey);
  const { setFieldValue } = useFormikContext();

  return (
    <></>
    // <DesktopDatePicker
    //   value={field.value}
    //   helperText={meta.error}
    //   error={meta.touched && Boolean(meta.error)}
    //   onChange={(value) => setFieldValue(field.name, value)}
    //   fullWidth
    //   {...props}
    // />
  );
};
