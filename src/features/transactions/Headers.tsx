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
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import Skeleton from "@material-ui/core/Skeleton";
import { NavLink as RouterLink } from "react-router-dom";
import { DatePicker, LocalizationProvider } from "@material-ui/lab";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { changePageTitle } from "../settings/settingsSlice";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@material-ui/core";
import { Add, Edit } from "@material-ui/icons";
import Delete from "@material-ui/icons/Delete";
import { StyledTableCell, StyledTableRow } from "../styles/tableStyles";
import { fetchItems, selectItems } from "../items/itemsSlice";
import { HeaderProps } from "./types/transactionTypes";
import { getAmharicCalendarFormatted } from "../../utils/calendarUtility";

export const Headers = ({ type }: HeaderProps) => {
  const [startDate, setStartDate] = useState<Date | null>(
    addMonths(new Date(), -1)
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const dispatch = useAppDispatch();
  const { headers, loading } = useAppSelector(selectTransactions);

  const { items } = useAppSelector(selectItems);

  useEffect(() => {
    if (headers.length === 0)
      dispatch(
        fetchHeaders({
          type,
          durationBegin: startDate as Date,
          durationEnd: endDate as Date,
        })
      );
    else {
      if (headers[0].type !== type)
        dispatch(
          fetchHeaders({
            type,
            durationBegin: startDate as Date,
            durationEnd: endDate as Date,
          })
        );
    }
    if (items.length === 0) dispatch(fetchItems("all"));

    dispatch(changePageTitle(`${type} List`));
  }, [dispatch, type, startDate, endDate]);

  const DeleteHeader = (id: number) => {
    dispatch(removeHeader(id));
  };

  return (
    <>
      <Helmet>
        <title>{type} List | Pinna Stock</title>
      </Helmet>
      <Box component="div">
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
            <Add /> Add New {type}
          </Typography>
        </Button>
      </Box>
      <Accordion sx={{ m: 1 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Filter List</Typography>
        </AccordionSummary>
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
                    inputFormat="MMM-dd-yyyy"
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
                    inputFormat="MMM-dd-yyyy"
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

      <Grid container justifyContent="flex-start">
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a simple table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Warehouse</StyledTableCell>
                <StyledTableCell>Number</StyledTableCell>
                <StyledTableCell>No of Items</StyledTableCell>
                <StyledTableCell>Total Qty</StyledTableCell>
                <StyledTableCell>Total Amount</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {loading === "pending" ? (
                <StyledTableRow>
                  <StyledTableCell>
                    <Skeleton variant="rectangular" height={10} width={100} />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Skeleton variant="rectangular" height={10} width={100} />
                  </StyledTableCell>

                  <StyledTableCell>
                    <Skeleton variant="rectangular" height={10} width={100} />
                  </StyledTableCell>
                </StyledTableRow>
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
                    <StyledTableCell component="th" scope="row">
                      {row.number}
                    </StyledTableCell>
                    <StyledTableCell>{row.numberOfItems}</StyledTableCell>
                    <StyledTableCell>{row.totalQty}</StyledTableCell>
                    <StyledTableCell>{row.totalAmount}</StyledTableCell>

                    <StyledTableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton
                          color="primary"
                          component={RouterLink}
                          to={`/app/${type}/${row.id}`}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() =>
                            DeleteHeader(row ? (row.id as number) : 0)
                          }
                        >
                          <Delete />
                        </IconButton>
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
    </>
  );
};
