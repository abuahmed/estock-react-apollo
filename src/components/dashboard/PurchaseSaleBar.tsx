import { Bar } from "react-chartjs-2";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  Grid,
  colors,
} from "@material-ui/core";
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
  }, []);

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

  const data = {
    datasets: [
      {
        backgroundColor: theme.palette.primary.main,
        data: salesValues,
        label: "Purchase",
        borderWidth: 8,
        borderColor: colors.common.white,
        hoverBorderColor: colors.common.white,
      },
    ],
    labels: salesLabels,
  };

  const data2 = {
    datasets: [
      {
        backgroundColor: theme.palette.secondary.main,
        data: purchasesValues,
        label: "Sale",
        borderWidth: 8,
        borderColor: colors.common.white,
        hoverBorderColor: colors.common.white,
      },
    ],
    labels: purchasesLabels,
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <CardHeader title={`Last 10 Day Purchases`} />
            <Divider />
            <Bar data={data} />
          </Grid>
          <Grid item md={6} xs={12}>
            <CardHeader title={`Last 10 Day Sales`} />
            <Divider />
            <Bar data={data2} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PurchaseSaleBar;
