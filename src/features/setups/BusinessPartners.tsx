import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

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

import {
  changePageTitle,
  selectPreference,
} from "../preferences/preferencesSlice";
import {
  Button,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Add, Edit, Refresh } from "@mui/icons-material";
import Delete from "@mui/icons-material/Delete";
import { StyledTableCell, StyledTableRow } from "../../styles/tableStyles";
import TableSkeleton from "../../components/Layout/TableSkeleton";
import { BusinessPartnerProps } from "./types/bpTypes";
import Paging from "../../components/Layout/Paging";

export const BusinessPartners = ({ type }: BusinessPartnerProps) => {
  const dispatch = useAppDispatch();
  const {
    businessPartnersWithCount: { businessPartners, totalCount },
    loading,
  } = useAppSelector(selectSetups);
  const { searchText } = useAppSelector(selectPreference);
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    dispatch(changePageTitle(`${type} List`));
    getBusinessPartners("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, type, searchText, currentPage, rowsPerPage]);

  const RefreshList = () => {
    getBusinessPartners("refresh");
  };

  const getBusinessPartners = (refresh: string) => {
    const skipRows = currentPage * rowsPerPage;

    dispatch(
      fetchBusinessPartners({
        type,
        refreshList: refresh,
        searchText,
        skip: skipRows,
        take: rowsPerPage,
      })
    );
  };
  const DeleteBusinessPartner = (id: number) => {
    dispatch(removeBusinessPartner({ id, type }));
  };
  useEffect(() => {
    setTotal(totalCount as number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCount]);

  return (
    <>
      <Helmet>
        <title>{type} List | Pinna Stock</title>
      </Helmet>
      <Stack
        direction="row"
        justifyContent="space-between"
        justifyItems="center"
      >
        <Tooltip title={`Refresh ${type}s List`}>
          <Button color="secondary" variant="contained" onClick={RefreshList}>
            <Refresh />
          </Button>
        </Tooltip>
        <Tooltip title={`Add New ${type}`}>
          <Button
            color="secondary"
            variant="contained"
            component={RouterLink}
            to={`/app/${type}/0`}
          >
            <Add />
          </Button>
        </Tooltip>
      </Stack>

      <Grid container justifyContent="flex-start" sx={{ mt: 1 }}>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a simple table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Mobile</StyledTableCell>
                <StyledTableCell>Credit(Birr)</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {loading === "pending" ? (
                <TableSkeleton numRows={10} numColumns={1} />
              ) : (
                businessPartners &&
                businessPartners.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {currentPage * rowsPerPage + index + 1}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      <Button
                        color="primary"
                        component={RouterLink}
                        to={`/app/${type}/` + row.id}
                      >
                        {row.displayName}
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {row.address?.mobile}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      ${row.totalOutstandingCredit?.toLocaleString()}
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
          Total Number of {type}s: {total}
        </Typography>
      </Stack>
    </>
  );
};
