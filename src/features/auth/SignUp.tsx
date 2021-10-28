import React from "react";
import { Helmet } from "react-helmet";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { Form, FormikProps, Formik } from "formik";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import { FormikTextField } from "../../components/Layout/FormikTextField";
import AuthSkeleton from "./AuthSkeleton";

import { registerSchema } from "./validation";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { signUp, selectAuth } from "./authSlice";
import { resetSuccess } from "./authReducers";
import Toast from "../../components/Layout/Toast";
import Google from "./Google";
import Facebook from "./Facebook";

export const SignUp = () => {
  const theme = useTheme();

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
    password: string;
    confirmPassword: string;
  }

  return (
    <>
      <Helmet>
        <title>Sign Up | Pinna Stock</title>
      </Helmet>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(1),
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ mb: 3 }}>
            <Typography variant="h1">Welcome!</Typography>
            <Typography variant="h2">Create your account</Typography>
            {/* {success && redirectToLogin} */}
            {loading === "pending" ? (
              <AuthSkeleton />
            ) : (
              <>
                <Formik
                  initialValues={{
                    name: "",
                    email: "",
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
                      <FormikTextField
                        formikKey="password"
                        label="Password"
                        type="password"
                      />
                      <FormikTextField
                        formikKey="confirmPassword"
                        label="Confirm Password"
                        type="password"
                      />
                      <br />
                      {error && <Toast severity="error">{error.message}</Toast>}
                      <Box component="div" mt={1}>
                        <Button
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
                <span>
                  Have an account?
                  <Link to="/login">
                    <>Sign In here</>
                  </Link>
                </span>
                {/* <Divider className={classes.divider} /> */}
                <div>
                  <div>
                    <Typography>or</Typography>
                  </div>
                </div>
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
          </Box>
        </Container>
      </Box>
    </>
  );
};
