import React from "react";
import { Form, FormikProps, Formik } from "formik";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { changePasswordSchema } from "../../features/auth/validation";

import { FormikTextField } from "../Layout/FormikTextField";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { changePassword, selectAuth } from "../../features/auth/authSlice";

import Toast from "../Layout/Toast";
import useStyles from "./styles";
import { UpdatePassword } from "../../features/auth/types/authType";

// interface Values {
//   oldPassword: string
//   password: string
//   confirmPassword: string
// }

const ChangePassword = () => {
  const classes = useStyles();
  const { error } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  return (
    <Formik
      key="2"
      initialValues={{
        userId: "",
        oldPassword: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={changePasswordSchema}
      onSubmit={(values, actions) => {
        actions.setSubmitting(false);

        dispatch(changePassword(values));
      }}
    >
      {(props: FormikProps<UpdatePassword>) => (
        <Form>
          <Card>
            <CardHeader subheader="Update password" title="Password" />
            <Divider />
            <CardContent>
              <FormikTextField
                autoComplete="off"
                formikKey="oldPassword"
                label="Old Password"
                type="password"
              />
              <FormikTextField
                formikKey="password"
                label="New Password"
                type="password"
              />
              <FormikTextField
                formikKey="confirmPassword"
                label="Confirm New Password"
                type="password"
              />
              <Box m={1}>
                {error && <Toast severity="error">{error.message}</Toast>}
              </Box>
            </CardContent>
            <Divider />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                p: 2,
              }}
            >
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                className={classes.submit}
                disabled={!props.isValid}
              >
                <SaveIcon /> Change Password
              </Button>
            </Box>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default ChangePassword;
