import { Avatar, Card, CardContent, Grid, Typography } from "@material-ui/core";
import { indigo } from "@material-ui/core/colors";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";

export const TotalProfit = () => (
  <Card sx={{ backgroundColor: indigo[600] }}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <Typography color="textPrimary" gutterBottom variant="h6">
            EXPECTED TOTAL PROFIT
          </Typography>
          <Typography color="textPrimary" variant="h3">
            $23,200
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
