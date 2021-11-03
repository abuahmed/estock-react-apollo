import { useEffect } from "react";
import { Helmet } from "react-helmet";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

// Slices
import {
  selectSetups,
  removeBusinessPartner,
  fetchBusinessPartners,
} from "./setupSlices";
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
import { BusinessPartnerProps } from "./types/bpTypes";

export const BusinessPartners = ({ type }: BusinessPartnerProps) => {
  const dispatch = useAppDispatch();
  const { businessPartners, loading } = useAppSelector(selectSetups);

  useEffect(() => {
    dispatch(changePageTitle(`${type} List`));
    dispatch(fetchBusinessPartners(type));
  }, [dispatch, type]);

  const DeleteBusinessPartner = (id: number) => {
    dispatch(removeBusinessPartner({ id, type }));
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
                <StyledTableCell>Name</StyledTableCell>

                <StyledTableCell>Actions</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {loading === "pending" ? (
                <TableSkeleton numRows={10} numColumns={1} />
              ) : (
                businessPartners &&
                businessPartners.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      <Button
                        color="primary"
                        component={RouterLink}
                        to={`/app/${type}/` + row.id}
                      >
                        {row.displayName}
                      </Button>
                    </StyledTableCell>

                    <StyledTableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton
                          color="primary"
                          component={RouterLink}
                          to={`/app/${type}/` + row.id}
                          size="large"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() =>
                            DeleteBusinessPartner(row ? (row.id as number) : 0)
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
          {businessPartners.length} {type}s
        </Typography>
      </Grid>
    </>
  );
};
