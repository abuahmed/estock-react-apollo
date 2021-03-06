import { Doughnut, Pie } from "react-chartjs-2";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  colors,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getTopItems,
  selectTransactions,
} from "../../features/transactions/transactionsSlice";

interface PropTypes {
  type: string;
}
export const TopSales = ({ type }: PropTypes) => {
  const dispatch = useAppDispatch();
  const { topSalesItems, topPurchasesItems } =
    useAppSelector(selectTransactions);
  const [values, setValues] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  useEffect(() => {
    dispatch(getTopItems(type));
  }, [dispatch, type]);
  useEffect(() => {
    if (type === "sale" && topSalesItems.length > 0) {
      setValues(topSalesItems.map((t) => t.totalAmount as number));
      setLabels(topSalesItems.map((t) => t.itemName as string));
    }
    if (type === "purchase" && topPurchasesItems.length > 0) {
      setValues(topPurchasesItems.map((t) => t.totalAmount as number));
      setLabels(topPurchasesItems.map((t) => t.itemName as string));
    }
  }, [topSalesItems, topPurchasesItems, type]);
  const bgColors =
    type === "sale"
      ? [
          colors.indigo[500],
          colors.red[600],
          colors.orange[600],
          colors.green[600],
          colors.blue[600],
        ]
      : [
          colors.blue[600],
          colors.green[600],
          colors.orange[600],
          colors.red[600],
          colors.indigo[500],
        ];
  const data = {
    datasets: [
      {
        data: values,
        backgroundColor: bgColors,
        borderWidth: 2,
        borderColor: "transparent",
        hoverBorderColor: colors.common.white,
      },
    ],
    labels: labels,
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader title={`TOP 5 ${type.toUpperCase()} ITEMS`} />
      <Divider />
      <CardContent>
        <Box
          sx={{
            position: "relative",
          }}
        >
          {type === "sale" ? <Pie data={data} /> : <Doughnut data={data} />}
        </Box>
      </CardContent>
    </Card>
  );
};
