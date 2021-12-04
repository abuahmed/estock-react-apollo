import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

// Slices
import {
  selectSetups,
  removeOrganization,
  fetchOrganizations,
  addOrganization,
  setSelectedOrganization,
  resetSelectedOrganization,
} from "./setupSlices";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import { NavLink as RouterLink, useParams } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import { StyledAccordionSummary } from "../../styles/componentStyled";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  changePageTitle,
  selectPreference,
} from "../preferences/preferencesSlice";
import { Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import {
  Add,
  Backspace,
  Edit,
  ListAltSharp,
  Refresh,
  Save,
} from "@mui/icons-material";
import Delete from "@mui/icons-material/Delete";
import { StyledTableCell, StyledTableRow } from "../../styles/tableStyles";
import TableSkeleton from "../../components/Layout/TableSkeleton";
import { Organization } from "./types/warehouseTypes";
import { Form, Formik, FormikProps } from "formik";
import { FormikTextField } from "../../components/Layout/FormikTextField";
import { registerSchema } from "./validation";
import Toast from "../../components/Layout/Toast";

const defaultOrganization: Organization = {
  displayName: "",
  clientId: 0,
  description: "",
  address: { mobile: "", telephone: "", email: "" },
};

export const Organizations = () => {
  const { clientId } = useParams() as {
    clientId: string;
  };

  const initializeOrganization = {
    ...defaultOrganization,
    clientId: parseInt(clientId),
  };
  const [expanded, setExpanded] = useState(false);

  const dispatch = useAppDispatch();
  const { organizations, selectedOrganization, success, error, loading } =
    useAppSelector(selectSetups);
  const { searchText } = useAppSelector(selectPreference);
  // const [total, setTotal] = useState(2);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [currentPage, setCurrentPage] = useState(0);
  useEffect(() => {
    dispatch(changePageTitle(`Organization List`));
    //dispatch(fetchOrganizations(parseInt(clientId)));
    //const skipRows = currentPage * rowsPerPage;

    dispatch(
      fetchOrganizations({
        searchText,
        clientId: parseInt(clientId),
        skip: 0,
        take: -1,
      })
    );
  }, [clientId, dispatch, searchText]); //currentPage, rowsPerPage

  const ToggleAccordion = () => {
    setExpanded(!expanded);
  };
  const DeleteOrganization = (id: number) => {
    dispatch(removeOrganization(id));
  };

  const SetSelectedOrganization = (id: number) => {
    setExpanded(true);
    dispatch(
      setSelectedOrganization(
        organizations.find((cat) => cat.id === id) as Organization
      )
    );
  };
  const ResetFields = () => {
    setExpanded(true);
    //console.log(initializeOrganization);
    dispatch(resetSelectedOrganization(initializeOrganization));
  };

  // useEffect(() => {
  //   console.log(selectedOrganization);
  // }, [selectedOrganization]);
  const RefreshList = () => {
    //const skipRows = currentPage * rowsPerPage;
    dispatch(
      fetchOrganizations({
        refreshList: "refresh",
        searchText,
        clientId: parseInt(clientId),
        skip: 0,
        take: -1,
      })
    );
  };

  return (
    <>
      <Helmet>
        <title>Organization List | Pinna Stock</title>
      </Helmet>

      <Stack
        direction="row"
        justifyContent="space-between"
        justifyItems="center"
      >
        <Stack
          direction="row"
          justifyContent="flex-start"
          justifyItems="center"
        >
          <Tooltip title="Back to clients">
            <Button
              color="secondary"
              variant="contained"
              component={RouterLink}
              to={`/app/clients`}
              sx={{ mr: 1 }}
            >
              <Backspace />
            </Button>
          </Tooltip>
          <Tooltip title="Refresh Items List">
            <Button color="secondary" variant="contained" onClick={RefreshList}>
              <Refresh />
            </Button>
          </Tooltip>
        </Stack>
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
            initialValues={selectedOrganization as Organization}
            validationSchema={registerSchema}
            onSubmit={(values, actions) => {
              actions.setSubmitting(false);
              dispatch(addOrganization(values));
            }}
          >
            {(props: FormikProps<Organization>) => (
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
                  Save Organization
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
              organizations &&
              organizations.map((row, index) => (
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
                          SetSelectedOrganization(row ? (row.id as number) : 0)
                        }
                        size="large"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() =>
                          DeleteOrganization(row ? (row.id as number) : 0)
                        }
                        size="large"
                      >
                        <Delete />
                      </IconButton>
                      <IconButton
                        color="primary"
                        component={RouterLink}
                        to={"/app/warehouses/" + row.id}
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
          Number of Organizations: {total}
        </Typography>
      </Stack> */}
    </>
  );
};
