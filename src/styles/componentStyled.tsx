import { styled } from "@mui/material/styles";

import Button from "@mui/material/Button";
import Card, { CardProps } from "@mui/material/Card";
import Link from "@mui/material/Link";
import { orange } from "@mui/material/colors";
import AccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";

export const StyledAccordionSummary = styled(
  AccordionSummary
)<AccordionSummaryProps>(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  borderRadius: "4px",
  // "&.MuiButtonBase-root": {
  //   "&.MuiAccordionSummary-root": {
  //     "&.Mui-expanded": {
  //       minHeight: 0,
  //     },
  //   },
  // },
  "&.MuiAccordionSummary-root.Mui-expanded": {
    minHeight: 0,
  },
  "& .Mui-expanded": {
    margin: "12px 0",
  },
}));

export const StyledCard = styled(Card)<CardProps>(({ theme }) => ({
  maxWidth: 400,
  margin: "auto",
  textAlign: "center",
  marginTop: theme.spacing(5),
  paddingBottom: theme.spacing(2),
}));

export const StyledLink = styled(Link)(({ theme }) => ({
  color: "black",
  "&:hover": {
    textDecoration: "none",
  },
  "&:not(:first-of-type)": {
    paddingLeft: 15,
  },
}));

export const ImageMargin = styled("div")(({ theme }) => ({
  marginLeft: "0",
  [theme.breakpoints.up("sm")]: {
    // zIndex: '-10',
    marginLeft: "-10rem",
  },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  //color: 'white',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.getContrastText(theme.palette.primary.main),
  fontSize: "1rem",
  [theme.breakpoints.up("sm")]: {
    fontSize: "1rem",
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
}));
export const ColorButton = styled(Button)(({ theme }) => ({
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
}));
