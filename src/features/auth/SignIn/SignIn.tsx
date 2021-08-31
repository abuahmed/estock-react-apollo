import React from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { Form, FormikProps, Formik } from "formik";

import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Google from "../Google";
import Facebook from "../Facebook";
import Box from "@material-ui/core/Box";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";
import LockRounded from "@material-ui/icons/LockRounded";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { signIn, selectAuth, signInApollo } from "../authSlice";
import { FormikTextField } from "../../../components/Layout/FormikTextField";

import AuthSkeleton from "../AuthSkeleton";
import { loginSchema } from "../validation";
import Toast from "../../../components/Layout/Toast";
import Typography from "@material-ui/core/Typography";
import commonStyles from "../../commonStyles";
import useStyles from "./styles";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";

// interface LocationState {
//   from: {
//     pathname: string
//   }
// }

export const SignIn = () => {
  const cclasses = commonStyles();
  const classes = useStyles();
  const { loading, error, user } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  // const navigate = useNavigate()
  // const location = useLocation()
  const theme = useTheme();
  if (user) {
    return <Navigate to="/app" />;

    // let { from } = location.search || { from: { pathname: '/app/dashboard' } }
    // navigate(from)
  }
  interface Values {
    email: string;
    password: string;
    showPassword: boolean;
  }

  return (
    <>
      <Helmet>
        <title>Sign In | Mern Starter</title>
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
            <Typography variant="h1" className={cclasses.greeting}>
              Welcome!
            </Typography>
            <Typography variant="h2" className={cclasses.subGreeting}>
              Sign In
            </Typography>
          </Box>

          {loading === "pending" ? (
            <AuthSkeleton />
          ) : (
            <>
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                  showPassword: false,
                }}
                validationSchema={loginSchema}
                onSubmit={(values, actions) => {
                  actions.setSubmitting(false);
                  dispatch(signInApollo(values));
                }}
              >
                {(props: FormikProps<Values>) => (
                  <Form>
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
                    <FormGroup row className={classes.navDisplayFlex}>
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
                      <span>
                        <Link to="/forgotPassword" className={classes.forgot}>
                          <>Forgot your password?</>
                        </Link>
                      </span>
                    </FormGroup>
                    <br />{" "}
                    {error && <Toast severity="error">{error.message}</Toast>}
                    <Box component="div">
                      <Button
                        type="submit"
                        color="secondary"
                        variant="contained"
                        className={classes.submit}
                        disabled={!props.isValid}
                      >
                        Sign In
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
              <span>
                Need an account?
                <Link to="/register" className={classes.signup}>
                  <>Sign Up here</>
                </Link>
              </span>
              {/* <Divider className={classes.divider} /> */}
              <div className={cclasses.formDividerContainer}>
                <div className={cclasses.formDivider} />
                <Typography className={cclasses.formDividerWord}>or</Typography>
                <div className={cclasses.formDivider} />
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
        </Container>
      </Box>
    </>
  );
};
