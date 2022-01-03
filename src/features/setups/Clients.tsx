import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

// Slices
import {
  selectSetups,
  removeClient,
  fetchClients,
  addClient,
  setSelectedClient,
  resetSelectedClient,
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
import { Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { Add, Edit, ListAltSharp, Refresh, Save } from "@mui/icons-material";
import Delete from "@mui/icons-material/Delete";
import { StyledTableCell, StyledTableRow } from "../../styles/tableStyles";
import TableSkeleton from "../../components/Layout/TableSkeleton";
import { Client } from "./types/warehouseTypes";
import { Form, Formik, FormikProps } from "formik";
import { FormikTextField } from "../../components/Layout/FormikTextField";
import { registerSchema } from "./validation";
import Toast from "../../components/Layout/Toast";

export const Clients = () => {
  const [expanded, setExpanded] = useState(false);

  const dispatch = useAppDispatch();
  const { clients, selectedClient, success, error, loading } =
    useAppSelector(selectSetups);

  const { searchText } = useAppSelector(selectPreference);
  // const [total, setTotal] = useState(5);
  // const [rowsPerPage, setRowsPerPage] = useState(2);
  // const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    dispatch(changePageTitle(`Client List`));
    //const skipRows = currentPage * rowsPerPage;

    dispatch(
      fetchClients({
        searchText,
        skip: 0,
        take: -1,
      })
    );
  }, [dispatch, searchText]); //currentPage, rowsPerPage,

  const ToggleAccordion = () => {
    setExpanded(!expanded);
  };
  const DeleteClient = (id: number) => {
    dispatch(removeClient(id));
  };

  const SetSelectedClient = (id: number) => {
    dispatch(setSelectedClient(clients.find((cat) => cat.id === id) as Client));
    setExpanded(true);
  };
  const ResetFields = () => {
    dispatch(resetSelectedClient());
    setExpanded(true);
  };
  const RefreshList = () => {
    //const skipRows = currentPage * rowsPerPage;
    dispatch(
      fetchClients({
        refreshList: "refresh",
        searchText,
        skip: 0,
        take: -1,
      })
    );
  };
  return (
    <>
      <Helmet>
        <title>Client List | Pinna Stock</title>
      </Helmet>
      <Stack
        direction="row"
        justifyContent="space-between"
        justifyItems="center"
      >
        <Tooltip title="Refresh Items List">
          <Button color="secondary" variant="contained" onClick={RefreshList}>
            <Refresh />
          </Button>
        </Tooltip>
        <Tooltip title="Add New Item">
          <Button color="secondary" variant="contained" onClick={ResetFields}>
            <Add />
          </Button>
        </Tooltip>
      </Stack>

      <Accordion sx={{ mt: 1 }} expanded={expanded}>
        <StyledAccordionSummary
          onClick={ToggleAccordion}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Detail</Typography>
        </StyledAccordionSummary>
        <AccordionDetails>
          <Formik
            enableReinitialize={true}
            initialValues={selectedClient as Client}
            validationSchema={registerSchema}
            onSubmit={(values, actions) => {
              actions.setSubmitting(false);
              dispatch(addClient(values));
            }}
          >
            {(props: FormikProps<Client>) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12}>
                    <FormikTextField formikKey="displayName" label="Name" />
                  </Grid>
                  <Grid item md={8} xs={12}>
                    <FormikTextField
                      formikKey="description"
                      label="Description"
                    />
                  </Grid>

                  <Grid item md={4} xs={12}>
                    <FormikTextField
                      formikKey="address.mobile"
                      label="Mobile"
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <FormikTextField
                      formikKey="address.telephone"
                      label="Telephone"
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <FormikTextField formikKey="address.email" label="Email" />
                  </Grid>
                </Grid>

                <br />
                {success && <Toast severity="success">{success.message}</Toast>}
                {error && <Toast severity="error">{error.message}</Toast>}
                <Button
                  sx={{ width: "100%" }}
                  type="submit"
                  color="secondary"
                  variant="contained"
                  disabled={!props.isValid}
                >
                  <Save />
                  Save Client
                </Button>
              </Form>
            )}
          </Formik>
        </AccordionDetails>
      </Accordion>

      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table size="small" aria-label="a simple table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>S.No</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Mobile</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>

              <StyledTableCell>Actions</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {loading === "pending" ? (
              <TableSkeleton numRows={10} numColumns={1} />
            ) : (
              clients &&
              clients.map((row, index) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.displayName}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.address?.mobile}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.address?.email}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          SetSelectedClient(row ? (row.id as number) : 0)
                        }
                        size="large"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() =>
                          DeleteClient(row ? (row.id as number) : 0)
                        }
                        size="large"
                      >
                        <Delete />
                      </IconButton>

                      <IconButton
                        color="primary"
                        component={RouterLink}
                        to={"/app/organizations/" + row.id}
                        size="large"
                      >
                        <ListAltSharp />
                      </IconButton>
                    </Stack>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <Stack spacing={1}>
        <Paging
          total={total}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          setRowsPerPage={setRowsPerPage}
          setCurrentPage={setCurrentPage}
        />
        <Typography variant="h6" component="div">
          Number of Clients: {total}
        </Typography>
      </Stack> */}
    </>
  );
};
