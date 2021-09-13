import { useEffect } from "react";
import { Helmet } from "react-helmet";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

// Slices
import { fetchHeaders, selectTransactions } from "./transactionsSlice";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import Skeleton from "@material-ui/core/Skeleton";
import { NavLink as RouterLink, useParams } from "react-router-dom";

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
import { fetchItems, selectItems } from "../items/itemsSlice";

interface HeaderProps {
  type: string;
}
export const Headers = (props: HeaderProps) => {
  // const { type } = useParams() as {
  //   type: string;
  // };

  const dispatch = useAppDispatch();
  const { headers, loading } = useAppSelector(selectTransactions);

  const { items } = useAppSelector(selectItems);

  useEffect(() => {
    if (headers.length === 0) dispatch(fetchHeaders(props.type));
    if (items.length === 0) dispatch(fetchItems("all"));

    dispatch(changePageTitle("Items List"));
  }, []);

  const DeleteHeader = (id: number) => {
    //dispatch(removeHeader(id));
  };

  return (
    <>
      <Helmet>
        <title>Transactions List | Pinna Stock</title>
      </Helmet>
      <Box component="div">
        <Button
          color="secondary"
          variant="contained"
          component={RouterLink}
          to={"/app/transaction/0"}
        >
          <Typography
            variant="h5"
            component="h5"
            sx={{ display: "flex", justifyItems: "center" }}
          >
            <Add /> Add New Transaction
          </Typography>
        </Button>
      </Box>
      <Divider variant="middle" sx={{ my: 2 }} />

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
                      {row.transactionDate}
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
                          to={"/app/transaction/" + row.id}
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
          {headers.length} Transactions
        </Typography>
      </Grid>
    </>
  );
};
