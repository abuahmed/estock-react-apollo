import React from "react";
import { Helmet } from "react-helmet";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Form, FormikProps, Formik } from "formik";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";
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

  if (user) {
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