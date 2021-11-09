import { Form, FormikProps, Formik } from "formik";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateTimePicker from "@mui/lab/DateTimePicker";
import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { format } from "date-fns";

import { useAppSelector, useAppDispatch } from "../../app/hooks";

import {
  postHeaderWithPayment,
  selectTransactions,
  setSelectedPayment,
} from "../../features/transactions/transactionsSlice";
import { TransactionType } from "../../features/transactions/types/transactionTypes";
import { getAmharicCalendarFormatted } from "../../utils/calendarUtility";
import { BusinessPartnerType } from "../../features/setups/types/bpTypes";
import { useEffect, useRef, useState } from "react";
import { Payment } from "../../features/transactions/types/paymentTypes";
import { PostAdd } from "@mui/icons-material";

interface Props {
  id: number;
}

const defaultPayment: Payment = {
  amountRequired: 0,
  paymentDate: new Date(),
  headerId: 0,
  amount: 0,
};

const Post = ({ id }: Props) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  let bpType = useRef<BusinessPartnerType>(BusinessPartnerType.Customer);

  const { selectedHeader, selectedPayment } =
    useAppSelector(selectTransactions);

  const [amountPaid, setAmountPaid] = useState(0);
  const [amountLeft, setAmountLeft] = useState(0);

  const amountPaidChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const requiredAmount = selectedHeader.totalAmount as number;
    const paid = parseFloat(event.target.value);
    if (paid >= 0 && paid <= requiredAmount) {
      const left = requiredAmount - paid;
      setAmountPaid(paid);
      setAmountLeft(Number.parseFloat(left.toFixed(10)));
    }
  };

  const initializePayment = {
    ...defaultPayment,
    headerId: id,
  };

  useEffect(() => {
    if (selectedHeader.id) {
      bpType.current =
        selectedHeader.type === TransactionType.Sale
          ? BusinessPartnerType.Customer
          : BusinessPartnerType.Vendor;
      dispatch(setSelectedPayment(initializePayment));
      setAmountPaid(selectedHeader.totalAmount as number);
    }
  }, [dispatch, selectedHeader]);

  return (
    <Stack spacing={2} sx={{ minWidth: "600", padding: "10px" }}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item sm={6} xs={12}>
              <TextField
                value={`${format(
                  new Date(selectedHeader.transactionDate as Date),
                  "MMM-dd-yyyy"
                )} (${getAmharicCalendarFormatted(
                  selectedHeader.transactionDate as Date,
                  "-"
                )})`}
                name="transactionDate"
                label={`${selectedHeader.type} Date`}
                disabled
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
                value={selectedHeader?.warehouse?.displayName}
                name="warehouse"
                label="Warehouse"
                disabled
              />
            </Grid>

            <Grid item sm={6} xs={12}>
              <TextField
                value={selectedHeader?.businessPartner?.displayName}
                name="businessPartner"
                label={bpType.current}
                disabled
              />
            </Grid>

            <Grid item sm={6} xs={12}>
              <TextField
                value={selectedHeader?.totalAmount?.toLocaleString()}
                name="amount"
                label="Total Amount"
                disabled
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Divider variant="middle" />

      <Formik
        enableReinitialize={true}
        initialValues={selectedPayment as Payment}
        onSubmit={(values, actions) => {
          actions.setSubmitting(false);
          values = {
            ...values,
            amount: amountPaid,
            amountRequired: selectedHeader.totalAmount as number,
          };
          //console.log(values);
          dispatch(postHeaderWithPayment(values));
        }}
      >
        {(props: FormikProps<Payment>) => (
          <Form>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="Payment Date"
                        inputFormat="MMM-dd-yyyy"
                        minDate={new Date("2021-01-01")}
                        value={props.values.paymentDate}
                        onChange={(value) => {
                          props.setFieldValue("paymentDate", value);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth helperText="" />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      value={amountPaid}
                      name="amountPaid"
                      onChange={amountPaidChanged}
                      label="Amount Paid"
                      type={"number"}
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      value={amountLeft}
                      name="amountLeft"
                      label="Amount Left"
                      disabled
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                    sx={{
                      margin: "auto",
                      marginTop: theme.spacing(2),
                      width: "100%",
                    }}
                    disabled={!props.isValid}
                  >
                    <PostAdd />
                    {"   "} POST
                  </Button>
                </Grid>
              </CardContent>
            </Card>
          </Form>
        )}
      </Formik>
    </Stack>
  );
};

export default Post;
