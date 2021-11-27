import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import { StyledAccordionSummary } from "../../styles/componentStyled";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../../styles/tableStyles";
import { fetchLines, selectTransactions } from "./transactionsSlice";
import { TransactionStatus, TransactionType } from "./types/transactionTypes";
import { addMonths, format } from "date-fns";
import { getAmharicCalendarFormatted } from "../../utils/calendarUtility";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { NavLink, useParams } from "react-router-dom";
import { Role } from "../auth/types/authType";
import { selectAuth } from "../auth/authSlice";
import { isPrivilegedTransaction } from "../../utils/authUtils";
import TableSkeleton from "../../components/Layout/TableSkeleton";
import Paging from "../../components/Layout/Paging";
import { Helmet } from "react-helmet";
import { changePageTitle } from "../preferences/preferencesSlice";
import { Refresh } from "@mui/icons-material";
import { fetchItems } from "../setups/setupSlices";
import { ItemFilter } from "../../components/filter/ItemFilter";

export const ItemsHistory = () => {
  const { id } = useParams() as {
    id: string;
  };

  const [state, setState] = useState({
    includeSale: true,
    includePurchase: true,
    includePI: true,
    includeTransfer: true,
  });

  const handleChangeType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const { includeSale, includePurchase, includePI, includeTransfer } = state;

  const [startDate, setStartDate] = useState<Date | null>(
    addMonths(new Date(), -1)
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const dispatch = useAppDispatch();
  const { loading, lines } = useAppSelector(selectTransactions);

  const { user } = useAppSelector(selectAuth);
  const [total, setTotal] = useState(40);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemId, setItemId] = useState<number>(0);

  useEffect(() => {
    if (id) setItemId(parseInt(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    dispatch(changePageTitle("Items History List"));
    dispatch(fetchItems({ skip: 0 }));
    fetchInventoryLines("All");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    itemId,
    includeSale,
    includePurchase,
    includePI,
    includeTransfer,
    startDate,
    endDate,
    currentPage,
    rowsPerPage,
  ]);

  const RefreshList = () => {
    fetchInventoryLines("refresh");
  };

  const fetchInventoryLines = (refresh: string) => {
    const userRoles = user?.roles as Role[];
    let startDateHeader = startDate as Date;
    let endDateHeader = endDate as Date;
    const skipRows = currentPage * rowsPerPage;

    dispatch(
      fetchLines({
        itemId: itemId !== 0 ? itemId : undefined,
        includeSales:
          includeSale &&
          isPrivilegedTransaction(userRoles, TransactionType.Sale, "View"),
        includePurchases:
          includePurchase &&
          isPrivilegedTransaction(userRoles, TransactionType.Purchase, "View"),
        includePIs:
          includePI &&
          isPrivilegedTransaction(userRoles, TransactionType.PI, "View"),
        includeTransfers:
          includeTransfer &&
          isPrivilegedTransaction(userRoles, TransactionType.Transfer, "View"),
        durationBegin: startDateHeader,
        durationEnd: endDateHeader,
        status: TransactionStatus.Posted,
        refreshList: refresh,
        skip: skipRows,
        take: rowsPerPage,
      })
    );
  };

  return (
    <>
      <Helmet>
        <title>Items History List | Pinna Stock</title>
      </Helmet>
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
        <AccordionDetails>
          <Stack direction="row" alignItems="center" justifyContent="center">
            <FormGroup aria-label="position" row>
              {isPrivilegedTransaction(
                user?.roles as Role[],
                TransactionType.Sale,
                "View"
              ) && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeSale}
                      onChange={handleChangeType}
                      name="includeSale"
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label="Sales"
                />
              )}
              {isPrivilegedTransaction(
                user?.roles as Role[],
                TransactionType.Purchase,
                "View"
              ) && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includePurchase}
                      onChange={handleChangeType}
                      name="includePurchase"
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label="Purchases"
                />
              )}
              {isPrivilegedTransaction(
                user?.roles as Role[],
                TransactionType.PI,
                "View"
              ) && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includePI}
                      onChange={handleChangeType}
                      name="includePI"
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label="PIs"
                />
              )}
              {isPrivilegedTransaction(
                user?.roles as Role[],
                TransactionType.Transfer,
                "View"
              ) && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeTransfer}
                      onChange={handleChangeType}
                      name="includeTransfer"
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label="Transfers"
                />
              )}
            </FormGroup>
          </Stack>
          <Divider variant="middle" sx={{ my: 2 }} />
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
          <Divider variant="middle" sx={{ my: 2 }} />
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item sm={4} xs={12}>
              <ItemFilter setItemId={setItemId} />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>S.No</StyledTableCell>

              <StyledTableCell>Type</StyledTableCell>
              <StyledTableCell>Warehouse</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell align="center">Number</StyledTableCell>
              <StyledTableCell align="center">Item</StyledTableCell>
              <StyledTableCell align="right">Qty(Diff)</StyledTableCell>
              <StyledTableCell align="right">Each Price</StyledTableCell>
              <StyledTableCell align="right">Line Price</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {loading === "pending" ? (
              <TableSkeleton numRows={10} numColumns={8} />
            ) : (
              lines &&
              lines.map((row, index) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {currentPage * rowsPerPage + index + 1}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.header?.type}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.header?.warehouse?.displayName}
                  </StyledTableCell>

                  <StyledTableCell component="th" scope="row">
                    {format(
                      new Date(
                        (row.header?.transactionDate as Date).toString()
                      ),
                      "MMM-dd-yyyy"
                    )}
                    (
                    {getAmharicCalendarFormatted(
                      row.header?.transactionDate as Date,
                      "-"
                    )}
                    )
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
                    <Button
                      color="primary"
                      component={NavLink}
                      to={"/app/item/" + row.item?.id}
                    >
                      {row.item?.displayName}
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell
                    scope="row"
                    sx={{ padding: "0px 16px" }}
                    align="right"
                  >
                    {row.header?.type === TransactionType.PI
                      ? row.diff?.toLocaleString()
                      : row.qty?.toLocaleString()}
                  </StyledTableCell>

                  <StyledTableCell
                    scope="row"
                    sx={{ padding: "0px 16px" }}
                    align="right"
                  >
                    {row.eachPrice?.toLocaleString()}
                  </StyledTableCell>

                  <StyledTableCell
                    scope="row"
                    sx={{ padding: "0px 16px" }}
                    align="right"
                  >
                    {row.linePrice?.toLocaleString()}
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack spacing={1}>
        <Paging
          total={total}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          setRowsPerPage={setRowsPerPage}
          setCurrentPage={setCurrentPage}
        />
        <Typography variant="h6" component="div">
          Number of Items History: {total}
        </Typography>
      </Stack>
    </>
  );
};
