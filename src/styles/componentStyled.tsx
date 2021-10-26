import { experimentalStyled } from "@material-ui/core";
import Button, { ButtonProps } from "@material-ui/core/Button";
import Card, { CardProps } from "@material-ui/core/Card";
import Link, { LinkProps } from "@material-ui/core/Link";

import { orange } from "@material-ui/core/colors";

export const StyledCard = experimentalStyled(Card)<CardProps>(({ theme }) => ({
  maxWidth: 400,
  margin: "auto",
  textAlign: "center",
  marginTop: theme.spacing(5),
  paddingBottom: theme.spacing(2),
}));

export const StyledLink = experimentalStyled(Link)<LinkProps>(({ theme }) => ({
  color: "black",
  "&:hover": {
    textDecoration: "none",
  },
  "&:not(:first-of-type)": {
    paddingLeft: 15,
  },
}));

export const ImageMargin = experimentalStyled("div")(({ theme }) => ({
  marginLeft: "0",
  [theme.breakpoints.up("sm")]: {
    // zIndex: '-10',
    marginLeft: "-10rem",
  },
}));

export const StyledButton = experimentalStyled(Button)<ButtonProps>(
  ({ theme }) => ({
    //color: 'white',
    color: theme.palette.getContrastText(theme.palette.secondary.light),
    fontSize: "1rem",
    [theme.breakpoints.up("sm")]: {
      fontSize: "1rem",
      color: theme.palette.getContrastText(theme.palette.primary.light),
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1.2rem",
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: "1.5rem",
    },
    fontWeight: "bold",

    "&:hover": {
      color: "white",
    },
  })
);
export const ColorButton = experimentalStyled(Button)<ButtonProps>(
  ({ theme }) => ({
    color: theme.palette.getContrastText(orange[500]),
    backgroundColor: "white",
    borderColor: orange[600],
    "&:hover": {
      backgroundColor: "white",
      borderColor: orange[900],
    },
    borderRadius: "32px",
    width: "200px",
    height: "48px",
    fontSize: "1rem",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between",
  })
);