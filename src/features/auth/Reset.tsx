import React from "react";
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import { Form, FormikProps, Formik } from "formik";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

import { Navigate } from "react-router-dom";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import InputAdornment from "@mui/material/InputAdornment";
import LockRounded from "@mui/icons-material/LockRounded";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { reset, selectAuth } from "./authSlice";
import { FormikTextField } from "../../components/Layout/FormikTextField";

import AuthSkeleton from "./AuthSkeleton";
import { resetSchema } from "./validation";
import Toast from "../../components/Layout/Toast";
import Typography from "@mui/material/Typography";
import { ResetAuth } from "./types/authType";

export const Reset = () => {
  const { loading, error, user, success } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { id, token } = useParams() as {
    token: string;
    id: string;
  };

  if (user && user.email) {
    return <Navigate to="/" />;
  }
  if (success) {
    navigate("/login");
  }

  return (
    <>
      <Helmet>
        <title>Reset Password | Pinna Stock</title>
      </Helmet>
      <Card>
        <CardContent>
          <Typography variant="h2">Reset Password</Typography>

          {loading === "pending" ? (
            <AuthSkeleton />
          ) : (
            <Formik
              initialValues={{
                password: "",
                confirmPassword: "",
                showPassword: false,
                id: parseInt(id),
                token: token as string,
              }}
              validationSchema={resetSchema}
              onSubmit={(values, actions) => {
                actions.setSubmitting(false);
                dispatch(reset(values));
              }}
            >
              {(props: FormikProps<ResetAuth>) => (
                <Form>
                  <Typography variant="h6">Type your new password</Typography>
                  <FormikTextField
                    formikKey="password"
                    label="Password"
                    type={props.values.showPassword ? "text" : "password"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockRounded />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormikTextField
                    formikKey="confirmPassword"
                    label="Confirm Password"
                    type={props.values.showPassword ? "text" : "password"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockRounded />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <FormControlLabel
                    style={{ marginBottom: "0" }}
                    control={
                      <Switch
                        checked={props.values.showPassword}
                        onChange={props.handleChange("showPassword")}
                        name="showPassword"
                      />
                    }
                    label="Show Password"
                  />

                  {error && <Toast severity="error">{error.message}</Toast>}
                  <Box component="div" pt={2}>
                    <Button
                      type="submit"
                      color="secondary"
                      variant="contained"
                      disabled={!props.isValid}
                    >
                      Reset Password
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          )}
        </CardContent>
      </Card>
    </>
  );
};
