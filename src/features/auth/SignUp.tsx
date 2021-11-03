import React from "react";
import { Helmet } from "react-helmet";
import { Navigate, useNavigate, NavLink } from "react-router-dom";
import Link from "@mui/material/Link";

import { Form, FormikProps, Formik } from "formik";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import { FormikTextField } from "../../components/Layout/FormikTextField";
import AuthSkeleton from "./AuthSkeleton";

import { registerSchema } from "./validation";
import InputAdornment from "@mui/material/InputAdornment";
import LockRounded from "@mui/icons-material/LockRounded";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { signUp, selectAuth } from "./authSlice";
import { resetSuccess } from "./authReducers";
import Toast from "../../components/Layout/Toast";
import Google from "./Google";
import Facebook from "./Facebook";
import { AuthenticationWrapper } from "../../styles/layoutStyled";
import { FormControlLabel, Switch } from "@mui/material";

export const SignUp = () => {
  const { loading, error, success, user } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  if (user && user.email) {
    return <Navigate to="/app" />;
  }
  if (success) {
    //return <Navigate to='/' />;
    dispatch(resetSuccess());
    navigate("/login");
  }
  // function redirectToLogin() {
  //   history.push('/login');
  // }

  interface Values {
    name: string;
    email: string;
    showPassword: boolean;
    password: string;
    confirmPassword: string;
  }

  return (
    <>
      <Helmet>
        <title>Sign Up | Pinna Stock</title>
      </Helmet>
      <AuthenticationWrapper>
        <Card sx={{ width: 600 }}>
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h1">Welcome!</Typography>
              <Typography variant="h2">Create your account</Typography>
            </Box>

            {/* {success && redirectToLogin} */}
            {loading === "pending" ? (
              <AuthSkeleton />
            ) : (
              <>
                <Formik
                  initialValues={{
                    name: "",
                    email: "",
                    showPassword: false,
                    password: "",
                    confirmPassword: "",
                  }}
                  validationSchema={registerSchema}
                  onSubmit={(values, actions) => {
                    actions.setSubmitting(false);
                    dispatch(signUp(values));
                  }}
                >
                  {(props: FormikProps<Values>) => (
                    <Form>
                      <FormikTextField formikKey="name" label="Name" />
                      <FormikTextField formikKey="email" label="Email" />
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <FormikTextField
                            formikKey="password"
                            label="Password"
                            type={
                              props.values.showPassword ? "text" : "password"
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockRounded />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormikTextField
                            formikKey="confirmPassword"
                            label="Confirm Password"
                            type={
                              props.values.showPassword ? "text" : "password"
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockRounded />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>
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
                      <Box component="div">
                        <Button
                          sx={{ width: "100%", marginY: "8px" }}
                          type="submit"
                          color="secondary"
                          variant="contained"
                          disabled={!props.isValid}
                        >
                          Create your account
                        </Button>
                      </Box>
                    </Form>
                  )}
                </Formik>
                <Box sx={{ my: 2 }}>
                  Have an account?
                  <Link
                    component={NavLink}
                    underline="none"
                    to="/login"
                    style={{ marginLeft: "10px" }}
                  >
                    <>Sign In here</>
                  </Link>
                </Box>
                <Divider variant="middle" sx={{ my: 2 }}>
                  or
                </Divider>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Google />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Facebook />
                  </Grid>
                </Grid>
              </>
            )}
          </CardContent>
        </Card>
      </AuthenticationWrapper>
    </>
  );
};
