import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { StyledTableCell, StyledTableRow } from "../styles/tableStyles";
import { fetchPayments, selectTransactions } from "./transactionsSlice";
import { addMonths, endOfDay, format, startOfDay } from "date-fns";
import { getAmharicCalendarFormatted } from "../../utils/calendarUtility";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
//import { selectAuth } from "../auth/authSlice";
import TableSkeleton from "../../components/Layout/TableSkeleton";
import {
  PaymentMethods,
  PaymentStatus,
  PaymentTypes,
} from "./types/paymentTypes";
import { changePageTitle } from "../preferences/preferencesSlice";
import { NavLink } from "react-router-dom";
import { StyledAccordionSummary } from "../../styles/componentStyled";

export const Payments = () => {
  const [startDate, setStartDate] = useState<Date | null>(
    addMonths(new Date(), -1)
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const dispatch = useAppDispatch();
  const { payments, loading } = useAppSelector(selectTransactions);
  //const { user } = useAppSelector(selectAuth);

  const RefreshList = () => {
    fetchPaymentLines("refresh");
  };

  const fetchPaymentLines = (refresh: string) => {
    //const userRoles = user?.roles as Role[];
    let startDateHeader = startDate as Date;
    let endDateHeader = endDate as Date;
    if (refresh !== "refresh") {
      startDateHeader = startOfDay(startDateHeader);
      endDateHeader = endOfDay(endDateHeader);
    }
    // includeSale &&
    //       isPrivilegedTransaction(userRoles, TransactionType.Sale, "View"),
    //     includePurchases:
    //       includePurchase &&
    //       isPrivilegedTransaction(userRoles, TransactionType.Purchase, "View"),
    dispatch(
      fetchPayments({
        durationBegin: startDateHeader,
        durationEnd: endDateHeader,
        type: PaymentTypes.Sale,
        method: PaymentMethods.Cash,
        status: PaymentStatus.Paid,
      })
    );
  };
  useEffect(() => {
    dispatch(changePageTitle("Payments List"));

    fetchPaymentLines("All");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, startDate, endDate]);

  return (
    <>
      <Helmet>
        <title>Payments List | Pinna Stock</title>
      </Helmet>

      <Box sx={{ m: 1 }}>
        <Box component="div">
          <Button color="secondary" variant="contained" onClick={RefreshList}>
            <Typography
              variant="h5"
              component="h5"
              sx={{ display: "flex", justifyItems: "center" }}
            >
              <Refresh />
            </Typography>
          </Button>
        </Box>

        <Accordion sx={{ mt: 1 }}>
          <StyledAccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Filter List</Typography>
          </StyledAccordionSummary>
          <AccordionDetails sx={{ py: 3 }}>
            <Stack direction="row" justifyContent="center" alignItems="center">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item sm={4} xs={12}>
                    <DatePicker
                      label={"Start Date"}
                      views={["day", "month", "year"]}
                      minDate={new Date("2021-01-01")}
                      value={startDate}
                      onChange={(newValue) => {
                        setStartDate(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth helperText="" />
                      )}
                    />
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <DatePicker
                      label={"End Date"}
                      views={["day", "month", "year"]}
                      minDate={new Date("2021-01-01")}
                      value={endDate}
                      onChange={(newValue) => {
                        setEndDate(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth helperText="" />
                      )}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
            </Stack>
          </AccordionDetails>
        </Accordion>
        <TableContainer component={Paper} sx={{ mt: 1 }}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>Type</StyledTableCell>
                <StyledTableCell>Transaction No.</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Method</StyledTableCell>
                <StyledTableCell align="right">Amount</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {loading === "pending" ? (
                <TableSkeleton numRows={10} numColumns={8} />
              ) : (
                payments &&
                payments.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {index + 1}
                    </StyledTableCell>

                    <StyledTableCell component="th" scope="row">
                      {row.type}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      <Button
                        color="primary"
                        component={NavLink}
                        to={"/app/" + row.header?.type + "/" + row.header?.id}
                      >
                        {row.header?.number}
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {format(
                        new Date((row.paymentDate as Date).toString()),
                        "MMM-dd-yyyy"
                      )}
                      (
                      {getAmharicCalendarFormatted(
                        row.paymentDate as Date,
                        "-"
                      )}
                      )
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {row.method}
                    </StyledTableCell>

                    <StyledTableCell
                      scope="row"
                      sx={{ padding: "0px 16px" }}
                      align="right"
                    >
                      {row.amount?.toLocaleString()}
                    </StyledTableCell>

                    <StyledTableCell component="th" scope="row">
                      {row.status}
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h4" component="div">
          {payments.length} payments
        </Typography>
      </Box>
    </>
  );
};
