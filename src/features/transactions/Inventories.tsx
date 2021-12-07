import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { NavLink as RouterLink } from "react-router-dom";

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
import { changePageTitle } from "../preferences/preferencesSlice";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { History, Refresh } from "@mui/icons-material";
import { StyledTableCell, StyledTableRow } from "../../styles/tableStyles";
import { fetchInventories, selectTransactions } from "./transactionsSlice";
import TableSkeleton from "../../components/Layout/TableSkeleton";
import Paging from "../../components/Layout/Paging";
import { WarehouseFilter } from "../../components/filter/WarehouseFilter";
import { CategoryFilter } from "../../components/filter/CategoryFilter";
import { CategoryType } from "../setups/types/itemTypes";
import { ItemFilter } from "../../components/filter/ItemFilter";

export const Inventories = () => {
  const dispatch = useAppDispatch();
  const {
    inventoriesWithCount: { inventories, totalCount },
    loading,
  } = useAppSelector(selectTransactions);
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [warehouseId, setWarehouseId] = useState<number>(0);
  const [itemId, setItemId] = useState<number>(0);
  const [itemCategoryId, setItemCategoryId] = useState<number>(0);
  const [itemUomId, setItemUomId] = useState<number>(0);

  useEffect(() => {
    dispatch(changePageTitle("Inventories List"));
    const skipRows = currentPage * rowsPerPage;
    dispatch(
      fetchInventories({
        itemId: itemId !== 0 ? itemId : undefined,
        warehouseId: warehouseId !== 0 ? warehouseId : undefined,
        categoryId: itemCategoryId !== 0 ? itemCategoryId : undefined,
        uomId: itemUomId !== 0 ? itemUomId : undefined,
        skip: skipRows,
        take: rowsPerPage,
      })
    );
  }, [
    dispatch,
    currentPage,
    rowsPerPage,
    itemId,
    warehouseId,
    itemCategoryId,
    itemUomId,
  ]);

  const RefreshList = () => {
    const skipRows = currentPage * rowsPerPage;

    dispatch(
      fetchInventories({
        refreshList: "refresh",
        skip: skipRows,
        take: rowsPerPage,
      })
    );
  };
  useEffect(() => {
    setTotal(totalCount as number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCount]);
  return (
    <>
      <Helmet>
        <title>Inventories List | Pinna Stock</title>
      </Helmet>

      <>
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
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item sm={3} xs={12}>
                <WarehouseFilter setWarehouseId={setWarehouseId} />
              </Grid>
              <Grid item sm={3} xs={12}>
                <ItemFilter setItemId={setItemId} />
              </Grid>
              <Grid item sm={3} xs={12}>
                <CategoryFilter
                  bpType={CategoryType.ItemCategory}
                  setItemCategoryId={setItemCategoryId}
                  setItemUomId={setItemUomId}
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <CategoryFilter
                  bpType={CategoryType.UnitOfMeasure}
                  setItemCategoryId={setItemCategoryId}
                  setItemUomId={setItemUomId}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Grid container justifyContent="flex-start" sx={{ mt: 1 }}>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a simple table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.No</StyledTableCell>

                  <StyledTableCell>Warehouse</StyledTableCell>
                  <StyledTableCell>Item</StyledTableCell>
                  <StyledTableCell>Category</StyledTableCell>
                  <StyledTableCell>UOM</StyledTableCell>
                  <StyledTableCell>Qty. OnHand</StyledTableCell>
                  <StyledTableCell>Total Purchase</StyledTableCell>
                  <StyledTableCell>Total Sale</StyledTableCell>
                  <StyledTableCell>Expected Profit</StyledTableCell>

                  <StyledTableCell>View Item History</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {loading === "pending" ? (
                  <TableSkeleton numRows={10} numColumns={8} />
                ) : (
                  inventories &&
                  inventories.map((row, index) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell component="th" scope="row">
                        {currentPage * rowsPerPage + index + 1}
                      </StyledTableCell>
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
                      <StyledTableCell>
                        {row.qtyOnHand?.toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.totalPurchaseValue?.toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.totalSaleValue?.toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.totalProfitValue?.toLocaleString()}
                      </StyledTableCell>

                      <StyledTableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <IconButton
                            color="primary"
                            component={RouterLink}
                            to={`/app/inventoryHistory/${row.warehouse?.id}/${row.item?.id}`}
                            size="large"
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
        </Grid>

        <Stack spacing={1}>
          <Paging
            total={total}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            setRowsPerPage={setRowsPerPage}
            setCurrentPage={setCurrentPage}
          />
          <Typography variant="h6" component="div">
            Number of Inventories: {total}
          </Typography>
        </Stack>
      </>
    </>
  );
};
