import React from "react";
import { Helmet } from "react-helmet";
import { Grid, Paper, Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// logo
//import logo from './logo.svg'
import Logo from "../../components/Logo";

export default function Home() {
  const classes = useStyles();

  return (
    <>
      <Helmet>
        <title>Home | Pinna Stock</title>
      </Helmet>
      <Grid container className={classes.container}>
        <div className={classes.logotype}>
          <Logo />
          <Typography
            variant="h3"
            color="primary"
            className={classes.logotypeText}
          >
            Pinna Stock
          </Typography>
        </div>
        <Paper classes={{ root: classes.paperRoot }}>
          <Typography
            variant="h1"
            color="primary"
            className={classnames(classes.textRow, classes.errorCode)}
          >
            Home
          </Typography>

          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/app"
            size="large"
            className={classes.backButton}
          >
            Go to Dashboard
          </Button>
        </Paper>
      </Grid>
    </>
  );
}
