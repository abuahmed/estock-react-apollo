import React from "react";
import { Typography, Button, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import Logo from "../../components/Logo";
import { LogoType, PaperRoot, GridContainer } from "../../styles/errorStyled";

export default function Error() {
  const theme = useTheme();
  return (
    <GridContainer container>
      <LogoType>
        <Logo />
        <Typography
          variant="h3"
          color="primary"
          sx={{ fontWeight: 500, color: "white", marginLeft: theme.spacing(2) }}
        >
          PS Admin
        </Typography>
      </LogoType>
      <PaperRoot>
        <Typography
          variant="h1"
          color="primary"
          sx={{
            marginBottom: theme.spacing(10),
            textAlign: "center",
            fontSize: 148,
            fontWeight: 600,
          }}
        >
          404
        </Typography>
        <Typography
          variant="h5"
          color="primary"
          sx={{ marginBottom: theme.spacing(10), textAlign: "center" }}
        >
          Oops. Looks like the page you're looking for no longer exists
        </Typography>
        <Typography
          variant="h6"
          color="primary"
          sx={{
            marginBottom: theme.spacing(10),
            textAlign: "center",
            fontWeight: 300,
            color: theme.palette.text.primary,
          }}
        >
          But we're here to bring you back to safety
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          size="large"
          sx={{ textTransform: "none", fontSize: 22 }}
        >
          Back to Home
        </Button>
      </PaperRoot>
    </GridContainer>
  );
}
