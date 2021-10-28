import React from "react";
import { Helmet } from "react-helmet";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Form, FormikProps, Formik } from "formik";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { forgot, selectAuth } from "./authSlice";
import { FormikTextField } from "../../components/Layout/FormikTextField";

import AuthSkeleton from "./AuthSkeleton";
import { forgotSchema } from "./validation";
import Toast from "../../components/Layout/Toast";

export const Forgot = () => {
  const { loading, error, user, success } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  if (user && user.email) {
    return <Navigate to="/" />;
  }
  if (success) {
    navigate("/login");
  }
  interface Values {
    email: string;
  }

  return (
    <>
      <Helmet>
        <title>Forgot Password | Pinna Stock</title>
      </Helmet>
      <Card>
        <CardContent>
          <Typography variant="h2">Forgot Password</Typography>

          {loading === "pending" ? (
            <AuthSkeleton />
          ) : (
            <>
              <Formik
                initialValues={{
                  email: "",
                }}
                validationSchema={forgotSchema}
                onSubmit={(values, actions) => {
                  actions.setSubmitting(false);
                  dispatch(forgot(values));
                }}
              >
                {(props: FormikProps<Values>) => (
                  <Form>
                    <Typography variant="h6">Type your Email</Typography>
                    <FormikTextField
                      formikKey="email"
                      label="Email"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircle />
                          </InputAdornment>
                        ),
                      }}
                    />

                    {error && <Toast severity="error">{error.message}</Toast>}
                    <Box component="div" pt={2}>
                      <Button
                        type="submit"
                        color="secondary"
                        variant="contained"
                        disabled={!props.isValid}
                      >
                        Request password reset link
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
              <span>
                Have an account?
                <Link to="/login">
                  <>Sign In here</>
                </Link>
              </span>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};
