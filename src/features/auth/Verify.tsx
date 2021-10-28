import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { verify, resend, selectAuth } from "./authSlice";

import AuthSkeleton from "./AuthSkeleton";
import Toast from "../../components/Layout/Toast";
import Typography from "@mui/material/Typography";
import { AuthenticationWrapper } from "../../styles/layoutStyled";

export const Verify = () => {
  const { loading, error, user, success } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  const { id, token, expires, signature } = useParams() as {
    token: string;
    id: string;
    expires: string;
    signature: string;
  };

  useEffect(() => {
    if (id && token && expires && signature)
      dispatch(verify({ id: parseInt(id), token, expires, signature }));
  }, [dispatch, id, token, expires, signature]);

  function resendVerificationEmail() {
    dispatch(resend({ id: parseInt(id) }));
  }
  const navigate = useNavigate();
  if (success) {
    navigate("/login");
  }
  if (user && user.email) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>Verify Your Account | Pinna Stock</title>
      </Helmet>
      <AuthenticationWrapper>
        <Card sx={{ width: 600 }}>
          <CardContent>
            <Typography variant="h2">Account Activation</Typography>
            {loading === "pending" ? (
              <AuthSkeleton />
            ) : (
              error && (
                <>
                  <Toast severity="error">{error!.message}</Toast>{" "}
                  <Box component="div" pt={2}>
                    <Button
                      sx={{ width: "100%", marginY: "8px" }}
                      type="submit"
                      color="secondary"
                      variant="contained"
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
      </AuthenticationWrapper>
    </>
  );
};
