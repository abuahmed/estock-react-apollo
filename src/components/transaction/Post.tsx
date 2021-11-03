import { Form, FormikProps, Formik } from "formik";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  FormControlLabel,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { format } from "date-fns";

import { FormikTextField } from "../Layout/FormikTextField";

import { useAppSelector, useAppDispatch } from "../../app/hooks";

import Toast from "../Layout/Toast";
import {
  postHeader,
  selectTransactions,
} from "../../features/transactions/transactionsSlice";
import {
  TransactionHeader,
  TransactionType,
} from "../../features/transactions/types/transactionTypes";
import { getAmharicCalendarFormatted } from "../../utils/calendarUtility";
import { BusinessPartnerType } from "../../features/setups/types/bpTypes";
import { useEffect, useRef } from "react";

interface Props {
  id: number;
}

const Post = ({ id }: Props) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  let bpType = useRef<BusinessPartnerType>(BusinessPartnerType.Customer);

  const { selectedHeader, error } = useAppSelector(selectTransactions);
  useEffect(() => {
    if (selectedHeader.id) {
      bpType.current =
        selectedHeader.type === TransactionType.Sale
          ? BusinessPartnerType.Customer
          : BusinessPartnerType.Vendor;
    }
  }, [selectedHeader]);
  return (
    <Box sx={{ minWidth: "600" }}>
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
              <CardContent>
                <Typography variant="h6" component="h6">
                  {selectedHeader.type} Date:{" "}
                  {format(
                    new Date(selectedHeader.transactionDate as Date),
                    "MMM-dd-yyyy"
                  )}{" "}
                  (
                  {getAmharicCalendarFormatted(
                    selectedHeader.transactionDate as Date,
                    "-"
                  )}
                  )
                </Typography>

                <Typography variant="h6" component="h6">
                  Warehouse : {selectedHeader?.warehouse?.displayName}
                </Typography>

                <Typography variant="h6" component="h6">
                  {bpType.current} :{" "}
                  {selectedHeader?.businessPartner?.displayName}
                </Typography>

                <Typography variant="h6" component="h6">
                  Amount : {selectedHeader?.totalAmount?.toLocaleString()}
                </Typography>

                <Divider variant="middle" />

                <Box m={1}>
                  {error && <Toast severity="error">{error.message}</Toast>}
                </Box>
              </CardContent>
              <CardActions>
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
              </CardActions>
            </Card>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Post;
