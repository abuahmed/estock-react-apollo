import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Form, FormikProps, Formik } from "formik";
import { NavLink as RouterLink } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import { registerSchema } from "./validation";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import Toast from "../../components/Layout/Toast";

import {
  addBusinessPartner,
  selectBusinessPartners,
  getBusinessPartner,
  resetSelectedBusinessPartner,
} from "./bpsSlice";
import { BusinessPartner, BusinessPartnerProps } from "./types/bpTypes";
import { FormikTextField } from "../../components/Layout/FormikTextField";

import { changePageTitle } from "../settings/settingsSlice";
import { Add, Backspace } from "@material-ui/icons";
import { Grid, Divider, LinearProgress } from "@material-ui/core";
import Save from "@material-ui/icons/Save";

export const BusinessPartnerEntry = ({ type }: BusinessPartnerProps) => {
  const { id } = useParams() as {
    id: string;
  };
  const { loading, error, success, selectedBusinessPartner } = useAppSelector(
    selectBusinessPartners
  );
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
    dispatch(resetSelectedBusinessPartner());
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
                    <Grid container spacing={2}>
                      <Grid item sm={4} xs={12}>
                        <FormikTextField formikKey="displayName" label="Name" />
                      </Grid>
                      <Grid item sm={8} xs={12}>
                        <FormikTextField
                          formikKey="description"
                          label="Description"
                        />
                      </Grid>
                    </Grid>

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
