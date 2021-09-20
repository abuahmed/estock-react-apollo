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
import { Inventory } from "./types/transactionTypes";
import { format } from "date-fns";
import { getAmharicCalendarFormatted } from "../../utils/calendarUtility";

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

  const [selectedInventory, setSelectedInventory] = useState<Inventory>({});
  const dispatch = useAppDispatch();
  const { inventories, loading, lines } = useAppSelector(selectTransactions);

  useEffect(() => {
    if (inventories.length === 0) dispatch(fetchInventories("all"));

    dispatch(changePageTitle("Inventories List"));
  }, [dispatch]);

  const ChangeTab = (id: number, tabIndex: number) => {
    if (tabIndex === 1)
      setSelectedInventory(inventories.find((i) => i.id === id) as Inventory);
    setTabValue(tabIndex);
  };
  // const SelectInventoryItem = (itemId?: number) => {
  //   setSelectedInventory(
  //     inventories.find((i) => i.item?.id === itemId) as Inventory
  //   );
  // };
  useEffect(() => {
    dispatch(
      fetchLines({
        itemId: selectedInventory.item?.id,
        includeSales: includeSale,
        includePurchases: includePurchase,
        includePIs: includePI,
        includeTransfers: includeTransfer,
      })
    );
  }, [
    dispatch,
    selectedInventory,
    includeSale,
    includePurchase,
    includePI,
    includeTransfer,
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
      >
        <Tab icon={<ViewList />} label="Inventories" />
        <Tab icon={<History />} label="Item History" />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        <>
          <Box component="div"></Box>
          <Divider variant="middle" sx={{ my: 2 }} />

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
            <Stack direction="row">
              <FormGroup aria-label="position" row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeSale}
                      onChange={handleChangeType}
                      name="includeSale"
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label="Include Sales"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includePurchase}
                      onChange={handleChangeType}
                      name="includePurchase"
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label="Include Purchases"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includePI}
                      onChange={handleChangeType}
                      name="includePI"
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label="Include Sales"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeTransfer}
                      onChange={handleChangeType}
                      name="includeTransfer"
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label="Include Purchases"
                />
              </FormGroup>
            </Stack>
          </Box>
          <Divider variant="middle" sx={{ my: 2 }} />

          <TableContainer component={Paper} sx={{ mt: "8px" }}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Type</StyledTableCell>
                  <StyledTableCell>Warehouse</StyledTableCell>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Item</StyledTableCell>
                  <StyledTableCell align="right">Qty</StyledTableCell>
                  <StyledTableCell align="right">Each Price</StyledTableCell>
                  <StyledTableCell align="right">Total Price</StyledTableCell>
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
                  </StyledTableRow>
                ) : (
                  lines &&
                  lines.map((row) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell component="th" scope="row">
                        {row.header?.type}
                      </StyledTableCell>

                      <StyledTableCell component="th" scope="row">
                        {row.header?.warehouse?.displayName}
                      </StyledTableCell>

                      <StyledTableCell component="th" scope="row">
                        {format(
                          new Date(row.header?.transactionDate as Date),
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
                        {row.item?.displayName}
                      </StyledTableCell>
                      <StyledTableCell
                        scope="row"
                        sx={{ padding: "0px 16px" }}
                        align="right"
                      >
                        {row.qty}
                      </StyledTableCell>
                      <StyledTableCell
                        scope="row"
                        sx={{ padding: "0px 16px" }}
                        align="right"
                      >
                        {row.eachPrice}
                      </StyledTableCell>
                      <StyledTableCell
                        scope="row"
                        sx={{ padding: "0px 16px" }}
                        align="right"
                      >
                        {(row.qty as number) * (row.eachPrice as number)}
                      </StyledTableCell>

                      <StyledTableCell
                        sx={{ padding: "0px 16px" }}
                      ></StyledTableCell>
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
