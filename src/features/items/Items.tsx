import { useEffect } from "react";
import { Helmet } from "react-helmet";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
//import { useDispatch, useSelector } from 'react-redux'

// Slices
import { fetchItems, removeItem, selectItems } from "./itemsSlice";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Skeleton from "@material-ui/core/Skeleton";
import { NavLink as RouterLink } from "react-router-dom";

import { changePageTitle } from "../settings/settingsSlice";
import { Box, Button, IconButton, Stack, Typography } from "@material-ui/core";
import { Add, Edit } from "@material-ui/icons";
import Delete from "@material-ui/icons/Delete";

export const Items = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector(selectItems);

  useEffect(() => {
    if (items.length === 0) dispatch(fetchItems("all"));
    dispatch(changePageTitle("Items List"));
  }, []);

  const DeleteItem = (id: number) => {
    dispatch(removeItem(id));
  };
  return (
    <>
      <Helmet>
        <title>Items List | Pinna Stock</title>
      </Helmet>
      <Box component="div">
        <Button color="secondary" component={RouterLink} to={"/app/item/0"}>
          <Add /> Add New Item
        </Button>
      </Box>
      <Grid container justifyContent="flex-start">
        <Typography variant="h4" component="div">
          {items.length} Items
        </Typography>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>UOM</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Purchase Price</TableCell>
                <TableCell>Selling Price</TableCell>
                <TableCell>Safe Qty.</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading === "pending" ? (
                <TableRow>
                  <TableCell>
                    <Skeleton variant="rectangular" height={10} width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" height={10} width={100} />
                  </TableCell>

                  <TableCell>
                    <Skeleton variant="rectangular" height={10} width={100} />
                  </TableCell>
                </TableRow>
              ) : (
                items &&
                items.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.displayName}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row && row.itemCategory && row.itemCategory.displayName}
                    </TableCell>
                    <TableCell>
                      {row &&
                        row.unitOfMeasure &&
                        row.unitOfMeasure.displayName}
                    </TableCell>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.purchasePrice}</TableCell>
                    <TableCell>{row.sellingPrice}</TableCell>
                    <TableCell>{row.safeQty}</TableCell>

                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};
