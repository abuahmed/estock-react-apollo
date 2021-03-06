import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import { red } from "@mui/material/colors";
import { SummaryProps } from "./dashboardTypes";

export const TotalPurchase = ({ value, loading }: SummaryProps) => (
  <Card sx={{ backgroundColor: red[600], height: "100%" }}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <Typography color="white" gutterBottom variant="h6">
            TOTAL PURCHASE VALUE
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
              backgroundColor: red[900],
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

//export Budget;
