import { Doughnut } from "react-chartjs-2";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  colors,
} from "@material-ui/core";

interface PropTypes {
  height?: string;
}
export const TopSales = (props: PropTypes) => {
  const data = {
    datasets: [
      {
        data: [40, 15, 22, 12, 11],
        backgroundColor: [
          colors.indigo[500],
          colors.red[600],
          colors.orange[600],
          colors.green[600],
          colors.blue[600],
        ],
        borderWidth: 8,
        borderColor: colors.common.white,
        hoverBorderColor: colors.common.white,
      },
    ],
    labels: ["Item 01", "Item 02 ", "Item 03", "Item 04", "Item 05"],
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader title="Top Sale Items" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 300,
            position: "relative",
          }}
        >
          <Doughnut data={data} />
        </Box>
      </CardContent>
    </Card>
  );
};
