import react, { useEffect } from "react";
import { Helmet } from "react-helmet";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
//import { useDispatch, useSelector } from 'react-redux'

// Slices
import { fetchItems, selectItems } from "./itemsSlice";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
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
import { IconButton, Stack } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import Delete from "@material-ui/icons/Delete";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export const Items = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector(selectItems);

  useEffect(() => {
    dispatch(fetchItems("all"));
    dispatch(changePageTitle("Items List"));
  }, []);

  const DeleteItem = (id: number) => {};
  return (
    <>
      <Helmet>
        <title>Items List | Pinna Stock</title>
      </Helmet>
      <Grid container justifyContent="flex-start">
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>UOM</TableCell>
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
                items.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.displayName}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.itemCategory.displayName}
                    </TableCell>
                    <TableCell>{row.unitOfMeasure.displayName}</TableCell>

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
                          onClick={() => DeleteItem(row.id)}
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
