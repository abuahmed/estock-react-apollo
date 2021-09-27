import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@material-ui/core";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import MoneyIcon from "@material-ui/icons/Money";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";

import { red } from "@material-ui/core/colors";

export const TotalPurchase = () => (
  <Card sx={{ backgroundColor: red[600], height: "100%" }}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <Typography color="textPrimary" gutterBottom variant="h6">
            TOTAL PURCHASE VALUE
          </Typography>
          <Typography color="textPrimary" variant="h3">
            $20,200
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
