import React from "react";
import { Form, FormikProps, Formik } from "formik";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import Box from "@material-ui/core/Box";
import SaveIcon from "@material-ui/icons/Save";

import { FormikTextField } from "../Layout/FormikTextField";

import { profileUpdateSchema } from "../../features/auth/validation";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { updateProfile, selectAuth } from "../../features/auth/authSlice";

import Toast from "../Layout/Toast";
import { AuthUser } from "../../features/auth/types/authType";
import { useTheme } from "@material-ui/core";

export const AccountDetail = () => {
  const theme = useTheme();
  const { error, fileUploadUri, user } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  return (
    <Paper
      elevation={3}
      style={{
        position: "relative",
        borderRadius: 18,
      }}
    >
      <Formik
        initialValues={user as AuthUser}
        validationSchema={profileUpdateSchema}
        onSubmit={(values, actions) => {
          actions.setSubmitting(false);
          if (fileUploadUri) {
            values = { ...values, avatar: fileUploadUri };
          }
          dispatch(updateProfile(values));
        }}
      >
        {(props: FormikProps<AuthUser>) => (
          <Form>
            <Box m={1}>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <FormikTextField formikKey="name" label="Name" />
                </Grid>
                <Grid item md={6} xs={12}>
                  <FormikTextField formikKey="bio" label="Bio" />
                </Grid>
              </Grid>

              {error && <Toast severity="error">{error.message}</Toast>}
              <Box component="div" pb={3} mt={3}>
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  sx={{
                    margin: "auto",
                    marginBottom: theme.spacing(2),
                    width: "100%",
                  }}
                  disabled={!props.isValid}
                >
                  <SaveIcon /> Save Changes
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};
