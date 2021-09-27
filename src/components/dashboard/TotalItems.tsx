import { Avatar, Card, CardContent, Grid, Typography } from "@material-ui/core";
import { orange } from "@material-ui/core/colors";
import { FormatListNumbered } from "@material-ui/icons";

export const TotalItems = () => (
  <Card sx={{ backgroundColor: orange[600], height: "100%" }}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <Typography color="textPrimary" gutterBottom variant="h6">
            TOTAL NO. OF ITEMS
          </Typography>
          <Typography color="textPrimary" variant="h3">
            #50
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: orange[900],
              height: 56,
              width: 56,
            }}
          >
            <FormatListNumbered />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
