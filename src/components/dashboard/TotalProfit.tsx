import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { indigo } from "@mui/material/colors";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { SummaryProps } from "./dashboardTypes";

export const TotalProfit = ({ value, loading }: SummaryProps) => (
  <Card sx={{ backgroundColor: indigo[600], height: "100%" }}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <Typography color="white" gutterBottom variant="h6">
            EXPECTED TOTAL PROFIT
          </Typography>
          <Typography color="white" variant="h3">
            $
            {loading === "pending" ? (
              <Skeleton variant="text" />
            ) : (
              value.toLocaleString()
            )}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: indigo[900],
              height: 56,
              width: 56,
            }}
          >
            <AttachMoneyIcon />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

//export default TotalProfit;
