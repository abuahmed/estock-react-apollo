import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import { SummaryProps } from "./dashboardTypes";

export const TotalSales = ({ value, loading }: SummaryProps) => (
  <Card sx={{ backgroundColor: green[600], height: "100%" }}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <Typography color="white" gutterBottom variant="h6">
            TOTAL SALES VALUE
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
              backgroundColor: green[900],
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

//export default TotalItems;
