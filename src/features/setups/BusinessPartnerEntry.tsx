import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Form, FormikProps, Formik } from "formik";
import { NavLink as RouterLink } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { Add, Backspace } from "@material-ui/icons";
import { Grid, Divider, LinearProgress } from "@material-ui/core";
import Save from "@material-ui/icons/Save";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { registerSchema } from "./validation";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import Toast from "../../components/Layout/Toast";
import {
  addBusinessPartner,
  selectSetups,
  getBusinessPartner,
} from "./setupSlices";
import { resetSelectedBusinessPartner } from "./setupSlices";
import { BusinessPartner, BusinessPartnerProps } from "./types/bpTypes";
import { FormikTextField } from "../../components/Layout/FormikTextField";
import { changePageTitle } from "../settings/settingsSlice";

export const BusinessPartnerEntry = ({ type }: BusinessPartnerProps) => {
  const { id } = useParams() as {
    id: string;
  };
  const { loading, error, success, selectedBusinessPartner } =
    useAppSelector(selectSetups);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(changePageTitle(`${type} Entry`));

    if (id && id !== "0") {
      dispatch(getBusinessPartner(parseInt(id)));
    } else {
      resetFields();
    }
  }, [dispatch]);

  function resetFields() {
    dispatch(resetSelectedBusinessPartner({ type }));
  }

  return (
    <>
      <Helmet>
        <title>{type} Entry | Pinna Stock</title>
      </Helmet>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          color="secondary"
          variant="contained"
          component={RouterLink}
          to={`/app/${type}s`}
        >
          <Typography
            variant="h5"
            component="h5"
            sx={{ display: "flex", justifyItems: "center" }}
          >
            <Backspace />
          </Typography>
        </Button>
        <Button color="secondary" variant="contained" onClick={resetFields}>
          <Typography
            variant="h5"
            component="h5"
            sx={{ display: "flex", justifyItems: "center" }}
          >
            <Add />
          </Typography>
        </Button>
      </Box>
      <Divider variant="middle" sx={{ my: 2 }} />

      <Box>
        <Container maxWidth="lg">
          <Box sx={{ mb: 3 }}>
            <>
              <Formik
                enableReinitialize={true}
                initialValues={selectedBusinessPartner as BusinessPartner}
                validationSchema={registerSchema}
                onSubmit={(values, actions) => {
                  actions.setSubmitting(false);
                  dispatch(addBusinessPartner(values));
                }}
              >
                {(props: FormikProps<BusinessPartner>) => (
                  <Form>
                    <Accordion sx={{ m: 1 }} expanded={true}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>Detail</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item md={4} xs={12}>
                            <FormikTextField
                              formikKey="displayName"
                              label="Name"
                            />
                          </Grid>
                          <Grid item md={8} xs={12}>
                            <FormikTextField
                              formikKey="description"
                              label="Description"
                            />
                          </Grid>
                          <Grid item md={4} xs={12}>
                            <FormikTextField
                              formikKey="initialOutstandingCredit"
                              label="Initial Credit"
                              type={"number"}
                            />
                          </Grid>
                          <Grid item md={4} xs={12}>
                            <FormikTextField
                              formikKey="creditLimit"
                              label="Max. Credit"
                              type={"number"}
                            />
                          </Grid>
                          <Grid item md={4} xs={12}>
                            <FormikTextField
                              formikKey="creditTransactionsLimit"
                              label="Max. Transactions"
                              type={"number"}
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>

                    <Accordion sx={{ m: 1 }} expanded={true}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>Address</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
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
                            <FormikTextField
                              formikKey="address.email"
                              label="Email"
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                    <br />
                    {success && (
                      <Toast severity="success">{success.message}</Toast>
                    )}
                    {error && <Toast severity="error">{error.message}</Toast>}
                    <Button
                      sx={{ width: "100%" }}
                      type="submit"
                      color="secondary"
                      variant="contained"
                      disabled={!props.isValid}
                    >
                      <Save />
                      Save {type}
                    </Button>
                  </Form>
                )}
              </Formik>
            </>
          </Box>
        </Container>
      </Box>
      {/* <Divider variant="middle" sx={{ my: 2 }} /> */}
      {loading === "pending" && <LinearProgress color="secondary" />}
    </>
  );
};
