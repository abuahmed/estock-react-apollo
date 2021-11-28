import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import {
  fetchFinancialAccounts,
  removeFinancialAccount,
  selectSetups,
} from "./setupSlices";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import { NavLink as RouterLink } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import { StyledAccordionSummary } from "../../styles/componentStyled";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  changePageTitle,
  selectPreference,
} from "../preferences/preferencesSlice";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

import { Add, Edit, Refresh } from "@mui/icons-material";
import Delete from "@mui/icons-material/Delete";
import { StyledTableCell, StyledTableRow } from "../../styles/tableStyles";
import TableSkeleton from "../../components/Layout/TableSkeleton";
import Paging from "../../components/Layout/Paging";
import { CategoryType } from "./types/itemTypes";
import { CategoryFilter } from "../../components/filter/CategoryFilter";
export const FinancialAccounts = () => {
  const dispatch = useAppDispatch();
  const { financialAccounts, loading } = useAppSelector(selectSetups);
  const { searchText } = useAppSelector(selectPreference);
  const [total, setTotal] = useState(14);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [bankId, setBankId] = useState<number>(0);

  useEffect(() => {
    dispatch(changePageTitle("Financial Accounts List"));
    const skipRows = currentPage * rowsPerPage;

    dispatch(
      fetchFinancialAccounts({
        searchText,
        bankId: bankId !== 0 ? bankId : undefined,
        skip: skipRows,
        take: rowsPerPage,
      })
    );
  }, [dispatch, currentPage, rowsPerPage, searchText, bankId]);
  const RefreshList = () => {
    const skipRows = currentPage * rowsPerPage;

    dispatch(
      fetchFinancialAccounts({
        refreshList: "refresh",
        searchText,
        bankId: bankId !== 0 ? bankId : undefined,
        skip: skipRows,
        take: rowsPerPage,
      })
    );
  };
  const DeleteFinancialAccount = (id: number) => {
    dispatch(removeFinancialAccount(id));
  };

  return (
    <>
      <Helmet>
        <title>Financial Accounts List | Pinna Stock</title>
      </Helmet>
      <Stack
        direction="row"
        justifyContent="space-between"
        justifyItems="center"
      >
        <Tooltip title="Refresh FinancialAccounts List">
          <Button color="secondary" variant="contained" onClick={RefreshList}>
            <Refresh />
          </Button>
        </Tooltip>
        <Tooltip title="Add New Financial Account">
          <Button
            color="secondary"
            variant="contained"
            component={RouterLink}
            to={"/app/fa/0"}
          >
            <Add />
          </Button>
        </Tooltip>
      </Stack>
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
            {/* <Grid item sm={4} xs={12}>
              <ItemFilter setItemId={setItemId} />
            </Grid> */}
            <Grid item sm={4} xs={12}>
              <CategoryFilter
                bpType={CategoryType.Bank}
                setBankId={setBankId}
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
                <StyledTableCell>Bank</StyledTableCell>
                <StyledTableCell>Branch</StyledTableCell>
                <StyledTableCell>Account Number</StyledTableCell>

                <StyledTableCell>Actions</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {loading === "pending" ? (
                <TableSkeleton numRows={10} numColumns={6} />
              ) : (
                financialAccounts &&
                financialAccounts.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {currentPage * rowsPerPage + index + 1}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {row && row.bank && row.bank.displayName}
                    </StyledTableCell>

                    <StyledTableCell component="th" scope="row">
                      {row.branch}
                    </StyledTableCell>

                    <StyledTableCell component="th" scope="row">
                      {row.accountNumber}
                    </StyledTableCell>

                    <StyledTableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton
                          color="primary"
                          component={RouterLink}
                          to={"/app/fa/" + row.id}
                          size="large"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() =>
                            DeleteFinancialAccount(row ? (row.id as number) : 0)
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
          Number of Financial Accounts: {total}
        </Typography>
      </Stack>
    </>
  );
};
