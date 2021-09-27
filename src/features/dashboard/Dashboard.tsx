import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import {
  TotalPurchase,
  PurchaseSaleBar,
  TotalSales,
  TotalProfit,
  TopSales,
} from "../../components/dashboard";

import { useAppDispatch } from "../../app/hooks";
import { changePageTitle } from "../settings/settingsSlice";
import { TotalItems } from "../../components/dashboard/TotalItems";

const Dashboard = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(changePageTitle("Dashboard"));
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard | PinnaStock</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalItems />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalPurchase />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalSales />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalProfit />
            </Grid>

            <Grid item lg={8} md={12} xl={9} xs={12}>
              <PurchaseSaleBar />
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              <TopSales />
            </Grid>
            {/* <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TasksProgress />
            </Grid> 
            <Grid item lg={4} md={6} xl={3} xs={12}>
              <LatestSales />
            </Grid>
            <Grid item lg={8} md={12} xl={9} xs={12}>
              <LatestPurchases />
            </Grid> */}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
