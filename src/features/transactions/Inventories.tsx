import { useEffect } from "react";
import { Helmet } from "react-helmet";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
//import { useDispatch, useSelector } from 'react-redux'

// Slices

import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import Skeleton from "@material-ui/core/Skeleton";
import { NavLink as RouterLink } from "react-router-dom";

import { changePageTitle } from "../settings/settingsSlice";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@material-ui/core";
import { Add, Edit } from "@material-ui/icons";
import Delete from "@material-ui/icons/Delete";
import { StyledTableCell, StyledTableRow } from "../styles/tableStyles";
import { fetchInventories, selectTransactions } from "./transactionsSlice";

export const Inventories = () => {
  const dispatch = useAppDispatch();
  const { inventories, loading } = useAppSelector(selectTransactions);

  useEffect(() => {
    if (inventories.length === 0) dispatch(fetchInventories("all"));

    dispatch(changePageTitle("Inventories List"));
  }, []);

  const DeleteItem = (id: number) => {
    //dispatch(removeItem(id));
  };

  return (
    <>
      <Helmet>
        <title>Inventories List | Pinna Stock</title>
      </Helmet>
      <Box component="div">
        {/* <Button
          color="secondary"
          variant="contained"
          component={RouterLink}
          to={"/app/item/0"}
        >
          <Typography
            variant="h5"
            component="h5"
            sx={{ display: "flex", justifyItems: "center" }}
          >
            <Add /> Add New Item
          </Typography>
        </Button> */}
      </Box>
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
                      <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton
                          color="primary"
                          component={RouterLink}
                          to={"/app/item/" + row.id}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() =>
                            DeleteItem(row ? (row.id as number) : 0)
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
          {inventories.length} inventories
        </Typography>
      </Grid>
    </>
  );
};
