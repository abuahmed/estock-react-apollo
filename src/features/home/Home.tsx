import React from "react";
import { Helmet } from "react-helmet";
import { Typography, Button, useTheme } from "@material-ui/core";
import { Link } from "react-router-dom";

import Logo from "../../components/Logo";
import { LogoType, PaperRoot, GridContainer } from "../../styles/errorStyled";

export default function Home() {
  const theme = useTheme();
  return (
    <>
      <Helmet>
        <title>Home | Pinna Stock</title>
      </Helmet>
      <GridContainer container>
        <LogoType>
          <Logo />
          <Typography
            variant="h3"
            color="primary"
            sx={{
              fontWeight: 500,
              color: "white",
              marginLeft: theme.spacing(2),
            }}
          >
            Pinna Stock
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
            Home
          </Typography>

          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/app"
            size="large"
            sx={{ textTransform: "none", fontSize: 22 }}
          >
            Go to Dashboard
          </Button>
        </PaperRoot>
      </GridContainer>
    </>
  );
}
