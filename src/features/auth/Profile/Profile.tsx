import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import AuthSkeleton from "../AuthSkeleton";

import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { selectAuth } from "../authSlice";

import { changePageTitle } from "../../settings/settingsSlice";
import AccountHeader from "../../../components/account/AccountHeader";
import { AccountDetail } from "../../../components/account/AccountDetail";
import ChangePassword from "../../../components/account/ChangePassword";

export const Profile = () => {
  const { loading } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const title = "My Account";
  useEffect(() => {
    //if (user) dispatch(profileApollo(user!.id));
    dispatch(changePageTitle(title));
  }, []);

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
