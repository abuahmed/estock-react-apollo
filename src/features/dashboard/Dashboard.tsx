import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import { Box, Container } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { useAppDispatch } from "../../app/hooks";
import { changePageTitle } from "../settings/settingsSlice";

function Dashboard() {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  useEffect(() => {
    dispatch(changePageTitle("Dashboard"));
  }, []);
  return (
    <>
      <Helmet>
        <title>Dashboard | Pinna Stock</title>
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
        <Container maxWidth="xs">
          <div>
            <h1>DashBoard</h1>
          </div>
        </Container>
      </Box>
    </>
  );
}

export default Dashboard;
