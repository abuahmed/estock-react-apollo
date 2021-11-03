import { useEffect } from "react";
import { Helmet } from "react-helmet";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
//import { useDispatch, useSelector } from 'react-redux'

// Slices
import { fetchItems, removeItem, selectSetups } from "./setupSlices";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import { NavLink as RouterLink } from "react-router-dom";

import { changePageTitle } from "../preferences/preferencesSlice";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import Delete from "@mui/icons-material/Delete";
import { StyledTableCell, StyledTableRow } from "../styles/tableStyles";
import TableSkeleton from "../../components/Layout/TableSkeleton";

export const Items = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector(selectSetups);

  useEffect(() => {
    dispatch(changePageTitle("Items List"));
    dispatch(fetchItems("all"));
  }, [dispatch]);

  const DeleteItem = (id: number) => {
    dispatch(removeItem(id));
  };

  return (
    <>
      <Helmet>
        <title>Items List | Pinna Stock</title>
      </Helmet>
      <Box component="div">
        <Button
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
        </Button>
      </Box>
      <Divider variant="middle" sx={{ my: 2 }} />

      <Grid container justifyContent="flex-start">
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a simple table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell>UOM</StyledTableCell>

                <StyledTableCell>Purchase Price</StyledTableCell>
                <StyledTableCell>Selling Price</StyledTableCell>
                <StyledTableCell>Safe Qty.</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {loading === "pending" ? (
                <TableSkeleton numRows={10} numColumns={6} />
              ) : (
                items &&
                items.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      <Button
                        color="primary"
                        component={RouterLink}
                        to={"/app/item/" + row.id}
                      >
                        {row.displayName}
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {row && row.itemCategory && row.itemCategory.displayName}
                    </StyledTableCell>
                    <StyledTableCell>
                      {row &&
                        row.unitOfMeasure &&
                        row.unitOfMeasure.displayName}
                    </StyledTableCell>

                    <StyledTableCell>{row.purchasePrice}</StyledTableCell>
                    <StyledTableCell>{row.sellingPrice}</StyledTableCell>
                    <StyledTableCell>{row.safeQty}</StyledTableCell>

                    <StyledTableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton
                          color="primary"
                          component={RouterLink}
                          to={"/app/item/" + row.id}
                          size="large"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() =>
                            DeleteItem(row ? (row.id as number) : 0)
                          }
                          size="large"
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
          {items.length} Items
        </Typography>
      </Grid>
    </>
  );
};
