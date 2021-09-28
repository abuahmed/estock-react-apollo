import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from "@material-ui/core";
import { orange } from "@material-ui/core/colors";
import { FormatListNumbered } from "@material-ui/icons";
import { SummaryProps } from "./dashboardTypes";

export const TotalItems = ({ value, loading }: SummaryProps) => (
  <Card sx={{ backgroundColor: orange[600], height: "100%" }}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <Typography color="white" gutterBottom variant="h6">
            TOTAL NO. OF ITEMS
          </Typography>
          <Typography color="white" variant="h3">
            #
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
