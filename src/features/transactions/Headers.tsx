import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { addMonths, format } from "date-fns";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

// Slices
import {
  fetchHeaders,
  removeHeader,
  selectTransactions,
} from "./transactionsSlice";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import { NavLink as RouterLink } from "react-router-dom";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Accordion from "@mui/material/Accordion";
import { StyledAccordionSummary } from "../../styles/componentStyled";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { changePageTitle } from "../preferences/preferencesSlice";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Edit, Visibility, Refresh } from "@mui/icons-material";
import Delete from "@mui/icons-material/Delete";
import { StyledTableCell, StyledTableRow } from "../styles/tableStyles";
import {
  HeaderProps,
  TransactionStatus,
  TransactionType,
} from "./types/transactionTypes";
import { getAmharicCalendarFormatted } from "../../utils/calendarUtility";
import { Role } from "../auth/types/authType";
import { selectAuth } from "../auth/authSlice";
import { isPrivilegedTransaction } from "../../utils/authUtils";
import TableSkeleton from "../../components/Layout/TableSkeleton";
import { BusinessPartnerType } from "../setups/types/bpTypes";

export const Headers = ({ type }: HeaderProps) => {
  const [startDate, setStartDate] = useState<Date | null>(
    addMonths(new Date(), -1)
  );
  const bpType =
    type === TransactionType.Sale
      ? BusinessPartnerType.Customer
      : BusinessPartnerType.Vendor;
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const dispatch = useAppDispatch();
  const { headers, loading } = useAppSelector(selectTransactions);

  const { user } = useAppSelector(selectAuth);

  useEffect(() => {
    dispatch(changePageTitle(`${type} List`));

    if (headers.length === 0)
      dispatch(
        fetchHeaders({
          type,
          durationBegin: startDate as Date,
          durationEnd: endDate as Date,
          refreshList: "All",
        })
      );
    else {
      if (headers[0].type !== type)
        dispatch(
          fetchHeaders({
            type,
            durationBegin: startDate as Date,
            durationEnd: endDate as Date,
            refreshList: "All",
          })
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, type, startDate, endDate]);

  const DeleteHeader = (id: number) => {
    dispatch(removeHeader(id));
  };
  const RefreshList = () => {
    dispatch(
      fetchHeaders({
        type,
        durationBegin: startDate as Date,
        durationEnd: endDate as Date,
        refreshList: "refresh",
      })
    );
  };

  return (
    <>
      <Helmet>
        <title>{type} List | Pinna Stock</title>
      </Helmet>
      <Box sx={{ m: 1 }}>
        <Box component="div">
          {isPrivilegedTransaction(user?.roles as Role[], type, "Add") && (
            <Button
              color="secondary"
              variant="contained"
              component={RouterLink}
              to={`/app/${type}/0`}
            >
              <Typography
                variant="h5"
                component="h5"
                sx={{ display: "flex", justifyItems: "center" }}
              >
                <Add />
              </Typography>
            </Button>
          )}
          <Button
            color="secondary"
            variant="contained"
            sx={{ ml: 1 }}
            onClick={RefreshList}
          >
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
          <AccordionDetails>
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

        <Grid container justifyContent="flex-start" sx={{ mt: 1 }}>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a simple table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Warehouse</StyledTableCell>
                  {(type === TransactionType.Sale ||
                    type === TransactionType.Purchase) && (
                    <StyledTableCell>{bpType}</StyledTableCell>
                  )}
                  {type === TransactionType.Transfer && (
                    <StyledTableCell>To warehouse</StyledTableCell>
                  )}
                  <StyledTableCell>Number</StyledTableCell>
                  <StyledTableCell>No of Items</StyledTableCell>
                  <StyledTableCell>Total Qty</StyledTableCell>
                  {type !== TransactionType.Transfer && (
                    <StyledTableCell>Total Amount</StyledTableCell>
                  )}
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {loading === "pending" ? (
                  <TableSkeleton numRows={10} numColumns={7} />
                ) : (
                  headers &&
                  headers.map((row) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell component="th" scope="row">
                        {format(
                          new Date(row.transactionDate as Date),
                          "MMM-dd-yyyy"
                        )}
                        (
                        {getAmharicCalendarFormatted(
                          row.transactionDate as Date,
                          "-"
                        )}
                        )
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {row.warehouse && row.warehouse.displayName}
                      </StyledTableCell>
                      {(type === TransactionType.Sale ||
                        type === TransactionType.Purchase) && (
                        <StyledTableCell component="th" scope="row">
                          {row.businessPartner &&
                            row.businessPartner.displayName}
                        </StyledTableCell>
                      )}
                      {type === TransactionType.Transfer && (
                        <StyledTableCell>
                          {row.toWarehouse && row.toWarehouse.displayName}
                        </StyledTableCell>
                      )}
                      <StyledTableCell component="th" scope="row">
                        {row.number}
                      </StyledTableCell>
                      <StyledTableCell>{row.numberOfItems}</StyledTableCell>
                      <StyledTableCell>
                        {row.totalQty?.toLocaleString()}
                      </StyledTableCell>
                      {type !== TransactionType.Transfer && (
                        <StyledTableCell>
                          {row.totalAmount?.toLocaleString()}
                        </StyledTableCell>
                      )}
                      <StyledTableCell>{row.status}</StyledTableCell>

                      <StyledTableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          {row?.status !== TransactionStatus.Draft &&
                            isPrivilegedTransaction(
                              user?.roles as Role[],
                              type,
                              "View"
                            ) && (
                              <IconButton
                                color="primary"
                                component={RouterLink}
                                to={`/app/${type}/${row.id}`}
                                size="large"
                              >
                                <Visibility />
                              </IconButton>
                            )}
                          {row?.status === TransactionStatus.Draft &&
                            isPrivilegedTransaction(
                              user?.roles as Role[],
                              type,
                              "Add"
                            ) && (
                              <IconButton
                                color="primary"
                                component={RouterLink}
                                to={`/app/${type}/${row.id}`}
                                size="large"
                              >
                                <Edit />
                              </IconButton>
                            )}
                          {row?.status === TransactionStatus.Draft &&
                            isPrivilegedTransaction(
                              user?.roles as Role[],
                              type,
                              "Delete"
                            ) && (
                              <IconButton
                                color="secondary"
                                onClick={() =>
                                  DeleteHeader(row ? (row.id as number) : 0)
                                }
                                size="large"
                              >
                                <Delete />
                              </IconButton>
                            )}
                        </Stack>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="h4" component="div">
            {headers.length} {type}s
          </Typography>
        </Grid>
      </Box>
    </>
  );
};
