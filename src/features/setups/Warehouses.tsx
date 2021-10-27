import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

// Slices
import {
  selectSetups,
  removeWarehouse,
  fetchWarehouses,
  addWarehouse,
  setSelectedWarehouse,
  resetSelectedWarehouse,
  getOrganization,
} from "./setupSlices";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import { NavLink as RouterLink, useParams } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { changePageTitle } from "../settings/settingsSlice";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Add, Backspace, Edit, Save } from "@mui/icons-material";
import Delete from "@mui/icons-material/Delete";
import { StyledTableCell, StyledTableRow } from "../styles/tableStyles";
import TableSkeleton from "../../components/Layout/TableSkeleton";
import { Warehouse } from "./types/warehouseTypes";
import { Form, Formik, FormikProps } from "formik";
import { FormikTextField } from "../../components/Layout/FormikTextField";
import { registerSchema } from "./validation";
import Toast from "../../components/Layout/Toast";

const defaultWarehouse: Warehouse = {
  displayName: "",
  organizationId: 0,
  description: "",
  address: { mobile: "", telephone: "", email: "" },
};

export const Warehouses = () => {
  const { organizationId } = useParams() as {
    organizationId: string;
  };
  const initializeWarehouse = {
    ...defaultWarehouse,
    organizationId: parseInt(organizationId),
  };
  const [expanded, setExpanded] = useState(false);

  const dispatch = useAppDispatch();
  const {
    warehouses,
    selectedWarehouse,
    selectedOrganization,
    success,
    error,
    loading,
  } = useAppSelector(selectSetups);

  useEffect(() => {
    dispatch(changePageTitle(`Warehouse List`));
    dispatch(
      fetchWarehouses({
        parent: "Organization",
        parentId: parseInt(organizationId),
      })
    );
    dispatch(getOrganization(parseInt(organizationId)));
  }, [dispatch, organizationId]);

  const ToggleAccordion = () => {
    setExpanded(!expanded);
  };
  const DeleteWarehouse = (id: number) => {
    dispatch(removeWarehouse(id));
  };

  const SetSelectedWarehouse = (id: number) => {
    dispatch(
      setSelectedWarehouse(warehouses.find((cat) => cat.id === id) as Warehouse)
    );
    setExpanded(true);
  };
  const ResetFields = () => {
    setExpanded(true);
    dispatch(resetSelectedWarehouse(initializeWarehouse));
  };

  return <>
    <Helmet>
      <title>Warehouse List | Pinna Stock</title>
    </Helmet>
    <Box
      component="div"
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      <Button
        color="secondary"
        variant="contained"
        component={RouterLink}
        to={`/app/organizations/${selectedOrganization.clientId}`}
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
          <Add /> Add New Warehouse
        </Typography>
      </Button>
    </Box>
    <Divider variant="middle" sx={{ my: 2 }} />

    <Formik
      enableReinitialize={true}
      initialValues={selectedWarehouse as Warehouse}
      validationSchema={registerSchema}
      onSubmit={(values, actions) => {
        actions.setSubmitting(false);
        dispatch(addWarehouse(values));
      }}
    >
      {(props: FormikProps<Warehouse>) => (
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
                Save Warehouse
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
            warehouses &&
            warehouses.map((row) => (
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
                        SetSelectedWarehouse(row ? (row.id as number) : 0)
                      }
                      size="large">
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() =>
                        DeleteWarehouse(row ? (row.id as number) : 0)
                      }
                      size="large">
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
      {warehouses.length} Warehouses
    </Typography>
  </>;
};
