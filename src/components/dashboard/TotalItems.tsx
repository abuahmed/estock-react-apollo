import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import { FormatListNumbered } from "@mui/icons-material";
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
