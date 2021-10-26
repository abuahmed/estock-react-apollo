import React from "react";
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import { Form, FormikProps, Formik } from "formik";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

import { Navigate } from "react-router-dom";
import Box from "@material-ui/core/Box";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import InputAdornment from "@material-ui/core/InputAdornment";
import LockRounded from "@material-ui/icons/LockRounded";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { reset, selectAuth } from "../authSlice";
import { FormikTextField } from "../../../components/Layout/FormikTextField";

import AuthSkeleton from "../AuthSkeleton";
import { resetSchema } from "../validation";
import Toast from "../../../components/Layout/Toast";
import commonStyles from "../../commonStyles";

import useStyles from "./styles";
import Typography from "@material-ui/core/Typography";
import { ResetAuth } from "../types/authType";

export const Reset = () => {
  const cclasses = commonStyles();

  const classes = useStyles();
  const { loading, error, user, success } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { id, token } = useParams() as {
    token: string;
    id: string;
  };

  if (user) {
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
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h2" className={cclasses.subGreeting}>
            Reset Password
          </Typography>

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
                  <Typography variant="h6" className={cclasses.subGreeting}>
                    Type your new password
                  </Typography>
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
                      className={classes.submit}
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
