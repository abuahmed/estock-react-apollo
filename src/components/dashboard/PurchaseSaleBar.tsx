import { Bar } from "react-chartjs-2";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  Grid,
  colors,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  GetDailyTransactions,
  selectTransactions,
} from "../../features/transactions/transactionsSlice";
import { useEffect, useState } from "react";
import { TransactionType } from "../../features/transactions/types/transactionTypes";

export const PurchaseSaleBar = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { dailySalesSummary, dailyPurchasesSummary } =
    useAppSelector(selectTransactions);
  const [salesValues, setSalesValues] = useState<number[]>([]);
  const [salesLabels, setSalesLabels] = useState<string[]>([]);
  const [purchasesValues, setPurchasesValues] = useState<number[]>([]);
  const [purchasesLabels, setPurchasesLabels] = useState<string[]>([]);
  useEffect(() => {
    dispatch(GetDailyTransactions(TransactionType.Sale));
    dispatch(GetDailyTransactions(TransactionType.Purchase));
  }, [dispatch]);

  useEffect(() => {
    if (dailySalesSummary.length > 0) {
      setSalesValues(dailySalesSummary.map((t) => t.totalAmount as number));
      setSalesLabels(dailySalesSummary.map((t) => t.transactionDate as string));
    }
    if (dailyPurchasesSummary.length > 0) {
      setPurchasesValues(
        dailyPurchasesSummary.map((t) => t.totalAmount as number)
      );
      setPurchasesLabels(
        dailyPurchasesSummary.map((t) => t.transactionDate as string)
      );
    }
  }, [dailySalesSummary, dailyPurchasesSummary]);

  const purchaseData = {
    datasets: [
      {
        backgroundColor: theme.palette.primary.main,
        data: purchasesValues,
        label: "Purchase",
        borderWidth: 2,
        borderColor: "transparent",
        hoverBorderColor: colors.common.white,
      },
    ],
    labels: purchasesLabels,
  };

  const saleData = {
    datasets: [
      {
        backgroundColor: theme.palette.secondary.main,
        data: salesValues,
        label: "Sale",
        borderWidth: 2,
        borderColor: "transparent",
        hoverBorderColor: colors.common.white,
      },
    ],
    labels: salesLabels,
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <CardHeader title={`Last 7 Day Purchases`} />
            <Divider />
            <Bar data={purchaseData} />
          </Grid>
          <Grid item md={6} xs={12}>
            <CardHeader title={`Last 7 Day Sales`} />
            <Divider />
            <Bar data={saleData} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PurchaseSaleBar;
