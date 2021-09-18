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
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import { History, ViewList } from "@material-ui/icons";
import { StyledTableCell, StyledTableRow } from "../styles/tableStyles";
import { fetchInventories, selectTransactions } from "./transactionsSlice";
import { TabPanel } from "../styles/tabComponents";
import { Inventory } from "./types/transactionTypes";

export const Inventories = () => {
  const [tabValue, setTabValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const [selectedInventory, setSelectedInventory] = useState<Inventory>({});
  const dispatch = useAppDispatch();
  const { inventories, loading } = useAppSelector(selectTransactions);

  useEffect(() => {
    if (inventories.length === 0) dispatch(fetchInventories("all"));

    dispatch(changePageTitle("Inventories List"));
  }, []);

  const ChangeTab = (id: number) => {
    setSelectedInventory(inventories.find((i) => i.id === id) as Inventory);
    setTabValue(1);
  };

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
                              onClick={() => ChangeTab(row.id as number)}
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
        <Typography variant="h4" component="div">
          {selectedInventory.id}
        </Typography>
      </TabPanel>
    </>
  );
};
