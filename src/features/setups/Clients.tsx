import { useEffect } from "react";
import { Helmet } from "react-helmet";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

// Slices
import { selectSetups, removeClient, fetchClients } from "./setupSlices";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
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
import TableSkeleton from "../../components/Layout/TableSkeleton";

export const Clients = () => {
  const dispatch = useAppDispatch();
  const { clients, loading } = useAppSelector(selectSetups);

  useEffect(() => {
    dispatch(changePageTitle(`Client List`));
    dispatch(fetchClients("all"));
  }, [dispatch]);

  const DeleteClient = (id: number) => {
    dispatch(removeClient(id));
  };

  return (
    <>
      <Helmet>
        <title>Client List | Pinna Stock</title>
      </Helmet>
      <Box component="div">
        <Button
          color="secondary"
          variant="contained"
          component={RouterLink}
          to={`/app/client/0`}
        >
          <Typography
            variant="h5"
            component="h5"
            sx={{ display: "flex", justifyItems: "center" }}
          >
            <Add /> Add New Client
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

                <StyledTableCell>Actions</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {loading === "pending" ? (
                <TableSkeleton numRows={10} numColumns={1} />
              ) : (
                clients &&
                clients.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      <Button
                        color="primary"
                        component={RouterLink}
                        to={`/app/client/` + row.id}
                      >
                        {row.displayName}
                      </Button>
                    </StyledTableCell>

                    <StyledTableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton
                          color="primary"
                          component={RouterLink}
                          to={`/app/client/` + row.id}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() =>
                            DeleteClient(row ? (row.id as number) : 0)
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
          {clients.length} Clients
        </Typography>
      </Grid>
    </>
  );
};
