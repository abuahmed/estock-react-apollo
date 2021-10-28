import { Link, Navigate } from "react-router-dom";
import { Form, FormikProps, Formik } from "formik";

import Button from "@mui/material/Button";
import Google from "./Google";
import Facebook from "./Facebook";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockRounded from "@mui/icons-material/LockRounded";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectAuth, signInApollo } from "./authSlice";
import { FormikTextField } from "../../components/Layout/FormikTextField";

import AuthSkeleton from "./AuthSkeleton";
import { loginSchema } from "./validation";
import Toast from "../../components/Layout/Toast";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Helmet } from "react-helmet";
import Divider from "@mui/material/Divider";
import { AuthenticationWrapper } from "../../styles/layoutStyled";

// interface LocationState {
//   from: {
//     pathname: string
//   }
// }

interface Values {
  email: string;
  password: string;
  showPassword: boolean;
}

export const SignIn = () => {
  const { loading, error, user } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  // const navigate = useNavigate()
  // const location = useLocation()
  if (user && user.email) {
    return <Navigate to="/app" />;
    // let { from } = location.search || { from: { pathname: '/app/dashboard' } }
    // navigate(from)
  }

  return (
    <>
      <Helmet>
        <title>Sign In | Pinna Stock</title>
      </Helmet>
      <AuthenticationWrapper>
        <Card sx={{ width: 600 }}>
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h1">Welcome!</Typography>
              <Typography variant="h2">Sign In</Typography>
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
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ width: "100%" }}
                      >
                        <Grid
                          item
                          spacing={3}
                          xs={12}
                          sm={6}
                          sx={{ textAlign: "left" }}
                        >
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
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ textAlign: "right" }}>
                          <Link to="/forgotPassword">
                            <>Forgot your password?</>
                          </Link>
                        </Grid>
                      </Grid>

                      {error && <Toast severity="error">{error.message}</Toast>}
                      <Box component="div">
                        <Button
                          sx={{ width: "100%", marginY: "8px" }}
                          type="submit"
                          color="secondary"
                          variant="contained"
                          disabled={!props.isValid}
                        >
                          Sign In
                        </Button>
                      </Box>
                    </Form>
                  )}
                </Formik>
                <Box sx={{ my: 2 }}>
                  Need an account?
                  <Link to="/register" style={{ marginLeft: "10px" }}>
                    <>Sign Up here</>
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
