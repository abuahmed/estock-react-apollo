import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AuthSkeleton from "./AuthSkeleton";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectAuth } from "./authSlice";

import { changePageTitle } from "../preferences/preferencesSlice";
import AccountHeader from "../../components/account/AccountHeader";
import { AccountDetail } from "../../components/account/AccountDetail";
import ChangePassword from "../../components/account/ChangePassword";

export const Profile = () => {
  const { loading } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const title = "My Account";
  useEffect(() => {
    dispatch(changePageTitle(title));
  }, [dispatch]);

  return (
    <div>
      <Helmet>
        <title>{title} | Pinna Stock</title>
      </Helmet>
      <Box sx={{ mt: 2 }} />
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 3,
        }}
      >
        {loading === "pending" ? (
          <AuthSkeleton />
        ) : (
          <>
            <Grid container spacing={3}>
              <Grid item lg={3} md={5} xs={12}>
                <AccountHeader />
              </Grid>
              <Grid item lg={9} md={7} xs={12}>
                <AccountDetail />
              </Grid>
            </Grid>
            <Box sx={{ pt: 3 }}>
              <ChangePassword />
            </Box>
          </>
        )}
      </Box>
    </div>
  );
};
