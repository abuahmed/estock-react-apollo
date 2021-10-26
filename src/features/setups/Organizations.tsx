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
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import { NavLink as RouterLink, useParams } from "react-router-dom";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { changePageTitle } from "../settings/settingsSlice";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@material-ui/core";
import { Add, Backspace, Edit, ListAltSharp, Save } from "@material-ui/icons";
import Delete from "@material-ui/icons/Delete";
import { StyledTableCell, StyledTableRow } from "../styles/tableStyles";
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

  useEffect(() => {
    dispatch(changePageTitle(`Organization List`));
    dispatch(fetchOrganizations(parseInt(clientId)));
  }, [clientId, dispatch]);

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

  return (
    <>
      <Helmet>
        <title>Organization List | Pinna Stock</title>
      </Helmet>
      <Box
        component="div"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Button
          color="secondary"
          variant="contained"
          component={RouterLink}
          to={`/app/clients`}
        >
          <Typography
            variant="h5"
            component="h5"
            sx={{ display: "flex", justifyItems: "center" }}
          >
            <Backspace />
          </Typography>
        </Button>
        <Button color="secondary" variant="contained" onClick={ResetFields}>
          <Typography
            variant="h5"
            component="h5"
            sx={{ display: "flex", justifyItems: "center" }}
          >
            <Add /> Add New Organization
          </Typography>
        </Button>
      </Box>
      <Divider variant="middle" sx={{ my: 2 }} />

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
            <Accordion sx={{ m: 1 }} expanded={expanded}>
              <AccordionSummary
                onClick={ToggleAccordion}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Detail</Typography>
              </AccordionSummary>
              <AccordionDetails>
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
              </AccordionDetails>
            </Accordion>
          </Form>
        )}
      </Formik>

      <Divider variant="middle" sx={{ my: 2 }} />

      <TableContainer component={Paper}>
        <Table size="small" aria-label="a simple table">
          <TableHead>
            <StyledTableRow>
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
              organizations.map((row) => (
                <StyledTableRow key={row.id}>
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
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() =>
                          DeleteOrganization(row ? (row.id as number) : 0)
                        }
                      >
                        <Delete />
                      </IconButton>
                      <IconButton
                        color="primary"
                        component={RouterLink}
                        to={"/app/warehouses/" + row.id}
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
      <Typography variant="h4" component="div">
        {organizations.length} Organizations
      </Typography>
    </>
  );
};
