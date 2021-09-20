import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

// Slices
import {
  fetchHeaders,
  removeHeader,
  selectTransactions,
} from "./transactionsSlice";
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
import { fetchItems, selectItems } from "../items/itemsSlice";
import { HeaderProps } from "./types/transactionTypes";
import { getAmharicCalendarFormatted } from "../../utils/calendarUtility";

export const Headers = ({ type }: HeaderProps) => {
  const dispatch = useAppDispatch();
  const { headers, loading } = useAppSelector(selectTransactions);

  const { items } = useAppSelector(selectItems);

  useEffect(() => {
    if (headers.length === 0) dispatch(fetchHeaders(type));
    else {
      if (headers[0].type !== type) dispatch(fetchHeaders(type));
    }
    if (items.length === 0) dispatch(fetchItems("all"));

    dispatch(changePageTitle(`${type} List`));
  }, [type, dispatch]);

  const DeleteHeader = (id: number) => {
    dispatch(removeHeader(id));
  };

  return (
    <>
      <Helmet>
        <title>{type} List | Pinna Stock</title>
      </Helmet>
      <Box component="div">
        <Button
          color="secondary"
          variant="contained"
          component={RouterLink}
          to={`/app/${type}/0`}
        >
          <Typography
            variant="h5"
            component="h5"
            sx={{ display: "flex", justifyItems: "center" }}
          >
            <Add /> Add New {type}
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
                      {format(
                        new Date(row.transactionDate as Date),
                        "MMM-dd-yyyy"
                      )}
                      (
                      {getAmharicCalendarFormatted(
                        row.transactionDate as Date,
                        "-"
                      )}
                      )
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
                          to={`/app/${type}/${row.id}`}
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
          {headers.length} {type}s
        </Typography>
      </Grid>
    </>
  );
};
