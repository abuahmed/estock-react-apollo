import { Form, FormikProps, Formik } from "formik";

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  useTheme,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

import { FormikTextField } from "../Layout/FormikTextField";

import { useAppSelector, useAppDispatch } from "../../app/hooks";

import Toast from "../Layout/Toast";
import {
  postHeader,
  selectTransactions,
} from "../../features/transactions/transactionsSlice";
import { TransactionHeader } from "../../features/transactions/types/transactionTypes";

interface Props {
  id: number;
}

const Post = ({ id }: Props) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const { selectedHeader, error } = useAppSelector(selectTransactions);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={selectedHeader as TransactionHeader}
        onSubmit={(values, actions) => {
          actions.setSubmitting(false);
          dispatch(postHeader(selectedHeader.id as number));
        }}
      >
        {(props: FormikProps<TransactionHeader>) => (
          <Form>
            <Card>
              <Divider />
              <CardContent>
                <FormikTextField
                  formikKey="transactionDate"
                  label="Transaction Date"
                />
                <FormikTextField
                  formikKey="warehouse.displayName"
                  label="Warehouse"
                />
                <FormikTextField
                  formikKey="businessPartner.displayName"
                  label="Business Partner"
                />

                <Box m={1}>
                  {error && <Toast severity="error">{error.message}</Toast>}
                </Box>
              </CardContent>
              <Divider />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  p: 2,
                }}
              >
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  sx={{
                    margin: "auto",
                    marginBottom: theme.spacing(2),
                    width: "100%",
                  }}
                  disabled={!props.isValid}
                >
                  <SaveIcon /> POST
                </Button>
              </Box>
            </Card>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Post;
