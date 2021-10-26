import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import {
  TotalPurchase,
  PurchaseSaleBar,
  TotalSales,
  TotalProfit,
  TopSales,
} from "../../components/dashboard";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { changePageTitle } from "../settings/settingsSlice";
import { TotalItems } from "../../components/dashboard/TotalItems";
import {
  getSummary,
  selectTransactions,
} from "../transactions/transactionsSlice";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { inventorySummary, loading } = useAppSelector(selectTransactions);
  const [summary, setSummary] = useState({
    items: 0,
    purchases: 0,
    sales: 0,
    profit: 0,
  });
  useEffect(() => {
    dispatch(getSummary("all"));
    dispatch(changePageTitle("Dashboard"));
  }, [dispatch]);
  useEffect(() => {
    if (inventorySummary.totalItems > 0)
      setSummary({
        items: inventorySummary.totalItems as number,
        purchases: inventorySummary.totalPurchases as number,
        sales: inventorySummary.totalSales as number,
        profit:
          (inventorySummary.totalSales as number) -
          (inventorySummary.totalPurchases as number),
      });
  }, [inventorySummary]);
  let { items, purchases, sales, profit } = summary;
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
              <TotalItems value={items} loading={loading} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalPurchase value={purchases} loading={loading} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalSales value={sales} loading={loading} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalProfit value={profit} loading={loading} />
            </Grid>

            <Grid item md={6} xs={12}>
              <TopSales type="purchase" />
            </Grid>
            <Grid item md={6} xs={12}>
              <TopSales type="sale" />
            </Grid>

            <Grid item xs={12}>
              <PurchaseSaleBar />
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
