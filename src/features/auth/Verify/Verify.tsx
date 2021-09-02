import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
// import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
//import { CardHeader } from '@material-ui/core'
import Box from "@material-ui/core/Box";

import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { verify, resend, selectAuth } from "../authSlice";

import AuthSkeleton from "../AuthSkeleton";
import Toast from "../../../components/Layout/Toast";
import commonStyles from "../../commonStyles";
import useStyles from "./styles";
import Typography from "@material-ui/core/Typography";

export const Verify = () => {
  const cclasses = commonStyles();
  const classes = useStyles();
  const { loading, error, user, success } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  const { id, token, expires, signature } = useParams() as {
    token: string;
    id: string;
    expires: string;
    signature: string;
  };

  useEffect(() => {
    dispatch(verify({ id, token, expires, signature }));
  }, [dispatch, id, token, expires, signature]);

  function resendVerificationEmail() {
    dispatch(resend({ id }));
  }
  const navigate = useNavigate();
  if (success) {
    navigate("/login");
  }
  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>Verify Your Account | Pinna Stock</title>
      </Helmet>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h2" className={cclasses.subGreeting}>
            Account Activation
          </Typography>
          {loading === "pending" ? (
            <AuthSkeleton />
          ) : (
            error && (
              <>
                {/* {toast.error(`${error!.message}`, {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              })}
              <ToastContainer /> */}
                <Toast severity="error">{error!.message}</Toast>{" "}
                <Box component="div" pt={2}>
                  <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                    className={classes.submit}
                    onClick={resendVerificationEmail}
                  >
                    Resend Verification Email
                  </Button>
                </Box>
              </>
            )
          )}
        </CardContent>
      </Card>
    </>
  );
};
