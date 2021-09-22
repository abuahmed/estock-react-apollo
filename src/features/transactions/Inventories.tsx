import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import Skeleton from "@material-ui/core/Skeleton";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { changePageTitle } from "../settings/settingsSlice";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core";
import { Backspace, History, ViewList } from "@material-ui/icons";
import { StyledTableCell, StyledTableRow } from "../styles/tableStyles";
import {
  fetchInventories,
  fetchLines,
  selectTransactions,
} from "./transactionsSlice";
import { TabPanel } from "../styles/tabComponents";
import {
  Inventory,
  TransactionStatus,
  TransactionType,
} from "./types/transactionTypes";
import { addMonths, format } from "date-fns";
import { getAmharicCalendarFormatted } from "../../utils/calendarUtility";
import { DatePicker, LocalizationProvider } from "@material-ui/lab";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import { NavLink } from "react-router-dom";
import { Role } from "../auth/types/authType";
import { selectAuth } from "../auth/authSlice";
import { isPrivilegedTransaction } from "../../utils/authUtils";

export const Inventories = () => {
  const [tabValue, setTabValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

  const [selectedInventory, setSelectedInventory] = useState<Inventory>({});
  const dispatch = useAppDispatch();
  const { inventories, loading, lines } = useAppSelector(selectTransactions);
  const { user } = useAppSelector(selectAuth);

  useEffect(() => {
    //if (inventories.length === 0)
    console.log("hits Inventories use effect");
    dispatch(fetchInventories("all"));

    dispatch(changePageTitle("Inventories List"));
  }, [dispatch]); //inventories.length

  const ChangeTab = (id: number, tabIndex: number) => {
    if (tabIndex === 1)
      setSelectedInventory(inventories.find((i) => i.id === id) as Inventory);
    setTabValue(tabIndex);
  };

  useEffect(() => {
    dispatch(
      fetchLines({
        itemId: selectedInventory.item?.id,
        includeSales:
          includeSale &&
          isPrivilegedTransaction(
            user?.roles as Role[],
            TransactionType.Sale,
            "View"
          ),
        includePurchases:
          includePurchase &&
          isPrivilegedTransaction(
            user?.roles as Role[],
            TransactionType.Purchase,
            "View"
          ),
        includePIs:
          includePI &&
          isPrivilegedTransaction(
            user?.roles as Role[],
            TransactionType.PI,
            "View"
          ),
        includeTransfers:
          includeTransfer &&
          isPrivilegedTransaction(
            user?.roles as Role[],
            TransactionType.Transfer,
            "View"
          ),
        durationBegin: startDate as Date,
        durationEnd: endDate as Date,
        status: TransactionStatus.Posted,
      })
    );
  }, [
    dispatch,
    selectedInventory,
    includeSale,
    includePurchase,
    includePI,
    includeTransfer,
    startDate,
    endDate,
    user?.roles,
  ]);

  return (
    <>
      <Helmet>
        <title>Inventories List | Pinna Stock</title>
      </Helmet>
      <Tabs
        value={tabValue}
        onChange={handleChange}
        aria-label="icon label tabs example"
        variant="fullWidth"
        centered
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab icon={<ViewList />} label="Inventories" />
        <Tab icon={<History />} label="Item History" />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        <>
          <Box component="div"></Box>
          {/* <Divider variant="middle" sx={{ my: 2 }} /> */}

          <Grid container justifyContent="flex-start">
            <TableContainer component={Paper}>
              <Table size="small" aria-label="a simple table">
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>Warehouse</StyledTableCell>
                    <StyledTableCell>Item</StyledTableCell>
                    <StyledTableCell>Category</StyledTableCell>
                    <StyledTableCell>UOM</StyledTableCell>
                    <StyledTableCell>Qty. OnHand</StyledTableCell>

                    <StyledTableCell>View Item History</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {loading === "pending" ? (
                    <StyledTableRow>
                      <StyledTableCell>
                        <Skeleton
                          variant="rectangular"
                          height={10}
                          width={100}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Skeleton
                          variant="rectangular"
                          height={10}
                          width={100}
                        />
                      </StyledTableCell>

                      <StyledTableCell>
                        <Skeleton
                          variant="rectangular"
                          height={10}
                          width={100}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    inventories &&
                    inventories.map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell component="th" scope="row">
                          {row.warehouse?.displayName}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.item?.displayName}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.item?.itemCategory?.displayName}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.item?.unitOfMeasure?.displayName}
                        </StyledTableCell>
                        <StyledTableCell>{row.qtyOnHand}</StyledTableCell>

                        <StyledTableCell>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <IconButton
                              color="primary"
                              onClick={() => ChangeTab(row.id as number, 1)}
                            >
                              <History />
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
              {inventories.length} inventories
            </Typography>
          </Grid>
        </>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <>
          <Box
            component="div"
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button
              color="secondary"
              variant="contained"
              onClick={() => ChangeTab(0, 0)}
            >
              <Typography
                variant="h5"
                component="h5"
                sx={{ display: "flex", justifyItems: "center" }}
              >
                <Backspace />
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
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
              >
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
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
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
          <TableContainer component={Paper} sx={{ mt: "8px" }}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Type</StyledTableCell>
                  {/* <StyledTableCell>Warehouse</StyledTableCell> */}
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell align="center">Number</StyledTableCell>
                  <StyledTableCell align="center">Item</StyledTableCell>
                  <StyledTableCell align="right">Qty</StyledTableCell>
                  <StyledTableCell align="right">
                    Each Price(Difference)
                  </StyledTableCell>

                  <StyledTableCell align="right">Total</StyledTableCell>
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
                  </StyledTableRow>
                ) : (
                  lines &&
                  lines.map((row) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell component="th" scope="row">
                        {row.header?.type}
                      </StyledTableCell>

                      {/* <StyledTableCell component="th" scope="row">
                        {row.header?.warehouse?.displayName}
                      </StyledTableCell> */}

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
                        {row.qty}
                      </StyledTableCell>

                      {row.header?.type === TransactionType.Sale ||
                      row.header?.type === TransactionType.Purchase ? (
                        <StyledTableCell
                          scope="row"
                          sx={{ padding: "0px 16px" }}
                          align="right"
                        >
                          {row.eachPrice}
                        </StyledTableCell>
                      ) : (
                        <StyledTableCell
                          scope="row"
                          sx={{ padding: "0px 16px" }}
                          align="right"
                        >
                          {row.diff}
                        </StyledTableCell>
                      )}
                      <StyledTableCell
                        scope="row"
                        sx={{ padding: "0px 16px" }}
                        align="right"
                      >
                        {(row.qty as number) * (row.eachPrice as number)}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="h4" component="div">
            {lines.length} transactions
          </Typography>
        </>
      </TabPanel>
    </>
  );
};
